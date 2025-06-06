import {
    signInWithPopup,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    updateProfile,
    updatePassword,
    EmailAuthProvider,
    reauthenticateWithCredential,
    signOut,
    onAuthStateChanged,
    signInAnonymously,
    signInWithCustomToken,
    GoogleAuthProvider
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { auth, googleProvider, showMessageBox, translateFirebaseError, generateUniqueId } from './config.js';
import { loadDataFromFirestore, clearLocalData } from './data.js';
import { renderAllData, guestModeMessageContainer, authScreenModal, userAuthArea, profileDisplayNameInput, profileEmailInput, profileUserImage, profileUserInitials, passwordChangeSection, changeProfilePhotoBtn, saveProfileChangesBtn, profileNewPasswordInput, profileCurrentPasswordInput, authUserIdSpan, appUserIdSpan, showSection, mainAppTitle, creditCardTransactionsContainer } from './ui.js'; // Algumas refs de UI podem vir de ui.js

export let currentUserId = null;
export let isGuestMode = true;

// Função para definir o ID do usuário e o modo convidado (usado internamente)
function setUserState(userId, guestMode) {
    currentUserId = userId;
    isGuestMode = guestMode;
    if (authUserIdSpan) authUserIdSpan.textContent = isGuestMode ? "Convidado" : userId;
    if (appUserIdSpan) appUserIdSpan.textContent = isGuestMode ? "Convidado" : userId;
}

export function updateUserAuthAreaUI() {
    if (!userAuthArea) { console.warn("userAuthArea não encontrado no updateUserAuthAreaUI"); return; }
    userAuthArea.innerHTML = '';
    const currentUser = auth.currentUser;

    if (isGuestMode || !currentUser) {
        if (guestModeMessageContainer) guestModeMessageContainer.classList.remove('hidden');
        const loginTrigger = document.createElement('button');
        loginTrigger.id = 'loginTriggerBtn';
        loginTrigger.className = 'auth-button login-trigger-btn';
        loginTrigger.textContent = 'Login / Registrar';
        loginTrigger.onclick = () => { if (authScreenModal) authScreenModal.classList.remove('hidden'); };

        const guestInfo = document.createElement('span');
        guestInfo.className = 'text-sm text-gray-600 italic ml-2'; // Adicionado ml-2 para espaço
        guestInfo.textContent = '(Modo Convidado)';

        userAuthArea.appendChild(loginTrigger);
        userAuthArea.appendChild(guestInfo);
    } else {
        if (guestModeMessageContainer) guestModeMessageContainer.classList.add('hidden');
        let displayName = "Usuário";
        if (currentUser.displayName) {
            displayName = currentUser.displayName;
        } else if (currentUser.email) {
            displayName = currentUser.email.split('@')[0];
        } else if (currentUser.isAnonymous) {
            displayName = "Convidado Logado";
        }
        const photoURL = currentUser.photoURL;

        const profileTrigger = document.createElement('div');
        profileTrigger.className = 'user-profile-trigger cursor-pointer flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-700 transition-colors';
        profileTrigger.onclick = () => showSection('user-profile-section');


        const avatarDiv = document.createElement('div');
        avatarDiv.className = 'user-avatar w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-white overflow-hidden';
        if (photoURL) {
            const img = document.createElement('img');
            img.src = photoURL;
            img.alt = displayName;
            img.className = 'w-full h-full object-cover';
            img.onerror = () => { // Fallback para iniciais se a imagem falhar
                avatarDiv.innerHTML = `<span class="text-lg">${displayName.charAt(0).toUpperCase()}</span>`;
            };
            avatarDiv.appendChild(img);
        } else {
            avatarDiv.innerHTML = `<span class="text-lg">${displayName.charAt(0).toUpperCase()}</span>`;
        }

        const nameSpan = document.createElement('span');
        nameSpan.className = 'user-name-display text-sm font-medium text-gray-200'; // Ajustado para melhor contraste no header escuro
        nameSpan.textContent = displayName;

        profileTrigger.appendChild(avatarDiv);
        profileTrigger.appendChild(nameSpan);
        userAuthArea.appendChild(profileTrigger);
    }
}

export function populateUserProfile() {
    const user = auth.currentUser;
    if (!user || !profileDisplayNameInput || !profileEmailInput || !profileUserImage || !profileUserInitials || !passwordChangeSection) {
        // Esconder ou limpar a seção do perfil se não houver usuário
        if(document.getElementById('user-profile-section')) {
           // document.getElementById('user-profile-section').classList.add('hidden'); // ou lógica para limpar
        }
        return;
    }
    // Mostrar a seção do perfil se houver usuário
    // if(document.getElementById('user-profile-section')) {
    //     document.getElementById('user-profile-section').classList.remove('hidden');
    // }


    profileDisplayNameInput.value = user.displayName || (user.email ? user.email.split('@')[0] : "Usuário Anônimo");
    profileEmailInput.value = user.email || "Não disponível (usuário anônimo)";
    profileEmailInput.disabled = true;

    if (user.photoURL) {
        profileUserImage.src = user.photoURL;
        profileUserImage.classList.remove('hidden');
        if(profileUserInitials) profileUserInitials.classList.add('hidden');
    } else {
        if(profileUserImage) profileUserImage.classList.add('hidden');
        if(profileUserInitials) {
            const initial = (user.displayName || (user.email ? user.email.charAt(0) : "U")).charAt(0).toUpperCase();
            profileUserInitials.textContent = initial;
            profileUserInitials.style.backgroundColor = '#4A5568';
            profileUserInitials.classList.remove('hidden');
        }
    }

    const isPasswordProvider = user.providerData.some(p => p.providerId === EmailAuthProvider.PROVIDER_ID);
    passwordChangeSection.style.display = isPasswordProvider ? 'block' : 'none';

    const isGoogleUser = user.providerData.some(p => p.providerId === GoogleAuthProvider.PROVIDER_ID);

    profileDisplayNameInput.disabled = isGuestMode || isGoogleUser || user.isAnonymous;
    if(changeProfilePhotoBtn) changeProfilePhotoBtn.style.display = (isGuestMode || isGoogleUser || user.isAnonymous) ? 'none' : 'inline-block';
    if(saveProfileChangesBtn) saveProfileChangesBtn.disabled = isGuestMode || user.isAnonymous;
    if(profileNewPasswordInput) profileNewPasswordInput.disabled = isGuestMode || !isPasswordProvider || user.isAnonymous;
    if(profileCurrentPasswordInput) profileCurrentPasswordInput.disabled = isGuestMode || !isPasswordProvider || user.isAnonymous;
}


export async function handleLogin(email, password) {
    const authMessage = document.getElementById('authMessage');
    if (authMessage) authMessage.textContent = ''; // Limpa mensagens anteriores

    if (!email || !password) {
        if (authMessage) authMessage.textContent = 'Preencha email e senha.';
        else showMessageBox('Preencha email e senha.');
        return;
    }
    try {
        await signInWithEmailAndPassword(auth, email, password);
        if (authScreenModal) authScreenModal.classList.add('hidden');
    } catch (error) {
        if (authMessage) authMessage.textContent = "Erro no Login: " + translateFirebaseError(error.code);
        else showMessageBox("Erro no Login: " + translateFirebaseError(error.code));
        console.error("Login error:", error);
    }
}

export async function handleRegister(email, password) {
    const authMessage = document.getElementById('authMessage');
    if (authMessage) authMessage.textContent = '';

    if (!email || !password) {
        if (authMessage) authMessage.textContent = 'Preencha email e senha.';
        else showMessageBox('Preencha email e senha.');
        return;
    }
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const displayName = email.split('@')[0];
        await updateProfile(userCredential.user, { displayName: displayName });
        if (authScreenModal) authScreenModal.classList.add('hidden');
    } catch (error) {
        if (authMessage) authMessage.textContent = "Erro no Registro: " + translateFirebaseError(error.code);
        else showMessageBox("Erro no Registro: " + translateFirebaseError(error.code));
        console.error("Register error:", error);
    }
}

export async function handleGoogleLogin() {
    const authMessage = document.getElementById('authMessage');
    if (authMessage) authMessage.textContent = '';
    try {
        await signInWithPopup(auth, googleProvider);
        if (authScreenModal) authScreenModal.classList.add('hidden');
    } catch (error) {
        if (authMessage) authMessage.textContent = "Erro no Login com Google: " + translateFirebaseError(error.code);
        else showMessageBox("Erro no Login com Google: " + translateFirebaseError(error.code));
        console.error("Google login error:", error);
    }
}

export async function handleLogout() {
    try {
        await signOut(auth);
        // onAuthStateChanged irá limpar os dados, atualizar a UI e redirecionar
        showMessageBox("Você saiu da sua conta.");
    } catch (error) {
        showMessageBox("Erro ao sair: " + translateFirebaseError(error.code));
        console.error("Logout error:", error);
    }
}

export async function saveProfileChanges(displayName, newPassword, currentPassword, photoFile) {
    const user = auth.currentUser;
    if (!user || isGuestMode || user.isAnonymous) {
        showMessageBox("Você precisa estar logado com uma conta não-anônima para salvar alterações.");
        return;
    }

    try {
        if (displayName && displayName !== user.displayName && !user.providerData.some(p => p.providerId === GoogleAuthProvider.PROVIDER_ID)) {
            await updateProfile(user, { displayName: displayName });
            showMessageBox("Nome de exibição atualizado!");
        }

        if (photoFile) {
            console.warn("Upload de foto ainda não implementado (requer Firebase Storage).");
            showMessageBox("Funcionalidade de upload de foto pendente.");
        }

        if (newPassword && currentPassword) {
             if (user.providerData.some(p => p.providerId === EmailAuthProvider.PROVIDER_ID)) {
                const credential = EmailAuthProvider.credential(user.email, currentPassword);
                await reauthenticateWithCredential(user, credential);
                await updatePassword(user, newPassword);
                showMessageBox("Senha alterada com sucesso!");
                if (profileNewPasswordInput) profileNewPasswordInput.value = '';
                if (profileCurrentPasswordInput) profileCurrentPasswordInput.value = '';
            } else {
                 showMessageBox("Alteração de senha não disponível para este tipo de conta.");
            }
        } else if (newPassword && !currentPassword) {
            showMessageBox("Por favor, insira sua senha atual para alterar a senha.");
            return;
        }

        updateUserAuthAreaUI();
        populateUserProfile();
    } catch (error) {
        showMessageBox("Erro ao salvar perfil: " + translateFirebaseError(error.code));
        console.error("Profile save error:", error);
    }
}

export function setupAuthListeners() {
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            setUserState(user.uid, user.isAnonymous);
            console.log("Usuário autenticado:", user.uid, "Anônimo:", user.isAnonymous);
            await loadDataFromFirestore(user.uid);
            if (authScreenModal) authScreenModal.classList.add('hidden');
            const authMessage = document.getElementById('authMessage');
            if(authMessage) authMessage.textContent = ''; // Limpa mensagem de erro do modal
        } else {
            const guestId = `guest-${generateUniqueId()}`;
            setUserState(guestId, true);
            console.log("Modo Convidado Ativado. Guest ID:", currentUserId);
            clearLocalData();
            renderAllData();
            showSection('home-section'); // Redireciona para home se deslogado
        }
        updateUserAuthAreaUI();
        populateUserProfile(); // Atualiza a seção de perfil (habilitando/desabilitando campos)

        const homeSection = document.getElementById('home-section');
        if (guestModeMessageContainer && homeSection && homeSection.classList.contains('active')) {
            guestModeMessageContainer.classList.toggle('hidden', !isGuestMode);
        } else if (guestModeMessageContainer) {
            guestModeMessageContainer.classList.add('hidden');
        }
    });
}

export async function initializeAuth() {
    if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
        try {
            console.log("Tentando login com token customizado.");
            await signInWithCustomToken(auth, __initial_auth_token);
        } catch (error) {
            console.error("Erro ao tentar login com token customizado:", error);
            if (!auth.currentUser) {
                try { await signInAnonymously(auth); } catch (e) { console.error("Falha no fallback para anônimo após erro de token:", e); }
            }
        }
    } else if (!auth.currentUser) {
        try {
            console.log("Nenhum usuário, tentando login anônimo inicial.");
            await signInAnonymously(auth);
        } catch (error) {
            console.error("Erro ao tentar login anônimo inicial:", error);
        }
    }
}
