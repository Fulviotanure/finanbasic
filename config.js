import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, setLogLevel as setFirestoreLogLevel } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// --- Firebase Setup ---
const firebaseConfigFromGlobal = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : null;
export const appIdFromGlobal = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

const firebaseConfig = firebaseConfigFromGlobal || {
    apiKey: "AIzaSyC4VnxBSFKnkQX6iX6qQmkCjvya814l02Q",
    authDomain: "finanbasic1.firebaseapp.com",
    projectId: "finanbasic1",
    storageBucket: "finanbasic1.appspot.com",
    messagingSenderId: "532199237323",
    appId: "1:532199237323:web:2dc33622cc826ee7671d4e",
    measurementId: "G-1GTJ3RKBZ7"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
setFirestoreLogLevel('debug'); // Renomeado para evitar conflito de nome
export const googleProvider = new GoogleAuthProvider();

// --- Utility Functions ---
export function generateUniqueId() { return '_' + Math.random().toString(36).substr(2, 9); }

export function showMessageBox(message) {
    const mb = document.getElementById('messageBox');
    const mt = document.getElementById('messageText');
    if (mb && mt) {
        mt.textContent = message;
        mb.classList.remove('hidden');
    }
}

export function closeMessageBoxHandler() {
    const mb = document.getElementById('messageBox');
    if (mb) {
        mb.classList.add('hidden');
    }
}

export function formatCurrency(value) {
    if (typeof value !== 'number' || isNaN(value)) return 'R$ 0,00';
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function translateFirebaseError(errorCode) {
    switch (errorCode) {
        case 'auth/invalid-email': return 'Formato de email inválido.';
        case 'auth/user-disabled': return 'Este usuário foi desabilitado.';
        case 'auth/user-not-found': return 'Usuário não encontrado.';
        case 'auth/wrong-password': return 'Senha incorreta.';
        case 'auth/email-already-in-use': return 'Este email já está em uso.';
        case 'auth/weak-password': return 'Senha muito fraca. Use pelo menos 6 caracteres.';
        case 'auth/requires-recent-login': return 'Esta operação requer login recente. Faça login novamente.';
        case 'auth/too-many-requests': return 'Muitas tentativas de login. Tente novamente mais tarde.';
        default: return errorCode;
    }
}
