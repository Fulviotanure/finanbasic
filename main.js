// main.js
import { initializeAuth, setupAuthListeners, handleLogin, handleRegister, handleGoogleLogin, handleLogout, saveProfileChanges } from './auth.js';
import {
    cacheDomElements, showSection, populateDateFilters, generateReport, copyReportToExcel,
    renderAllData, 
    // Elementos DOM individuais que precisam ser referenciados diretamente para listeners
    closeAuthModalBtn, authScreenModal, logoutBtn, saveProfileChangesBtn,
    profileDisplayNameInput, profileNewPasswordInput, profileCurrentPasswordInput, profilePhotoUpload,
    changeProfilePhotoBtn, addCreditCardBtn, addReserveBtn, addDespesaBtn, addReceitaBtn,
    addValeAlimentacaoBtn, filterReportBtn,
    // MODIFICADO: copyToExcelBtn já está correto, sem _id, pois é o elemento DOM
    copyToExcelBtn,
    closeReportModalBtn as closeReportModalBtn_el,
    // Variáveis de formulário para listeners de tipo (expenseType/incomeType)
    formDespesaVariavel, formDespesaFixa, formReceitaVariavel, formReceitaFixa,
    // Variáveis de formulário para listeners de método de pagamento/recebimento
    despesaVariavelPagamento, despesaVariavelCartaoContainer, despesaVariavelCartaoSelect, despesaVariavelReservaContainer, despesaVariavelReservaSelect,
    despesaFixaPagamento, despesaFixaCartaoContainer, despesaFixaCartaoSelect, despesaFixaReservaContainer, despesaFixaReservaSelect,
    receitaVariavelForma, receitaVariavelReservaContainer, receitaVariavelReservaSelect,
    receitaFixaForma, receitaFixaReservaContainer, receitaFixaReservaSelect,
    // Campos de data para inicialização
    despesaVariavelData, despesaFixaStartDateInput, receitaVariavelData, receitaFixaStartDateInput, valeDataCargaInput,
    reportStartDateInput, reportEndDateInput,
    updateCreditCardDropdowns, updateReserveAccountDropdowns // Funções utilitárias da UI
} from './ui.js';
import { addCreditCard, addReserve, addUnifiedDespesa, addUnifiedReceita, addOrUpdateValeAlimentacao, saveDataToFirestore } from './data.js'; // MODIFICADO: Adicionado saveDataToFirestore para uso após alterações de estado, se necessário.
import { closeMessageBoxHandler, showMessageBox } from './config.js';
import { subscribe, getState } from './state.js'; // MODIFICADO: Importa subscribe e getState

document.addEventListener('DOMContentLoaded', async () => {
    cacheDomElements();

    setupAuthListeners(); // Configura listeners de autenticação (que agora devem usar o estado)
    await initializeAuth(); // Tenta login inicial (que também deve atualizar o estado)

    // MODIFICADO: Inscreve-se nas mudanças de estado para re-renderizar a UI
    subscribe((newState) => {
        console.log("main.js: Notificação de mudança de estado recebida. Re-renderizando UI.", newState);
        renderAllUI(newState); // Função central de renderização da UI
        // MODIFICADO: Após cada mudança de estado que deve ser persistida, chame saveDataToFirestore
        // Isso garante que o Firestore seja atualizado após qualquer mutação de estado.
        // Alternativamente, você pode chamar saveDataToFirestore dentro de cada função em data.js que chama uma mutação do estado.
        // Escolha a abordagem que fizer mais sentido para o seu fluxo. Por simplicidade aqui, chamamos após cada notificação.
        saveDataToFirestore(newState);
    });

    // --- Event Listeners Globais ---
    const closeMessageBoxElement = document.getElementById('closeMessageBox');
    if (closeMessageBoxElement) closeMessageBoxElement.addEventListener('click', closeMessageBoxHandler);

    if (closeAuthModalBtn && authScreenModal) {
        closeAuthModalBtn.addEventListener('click', () => {
            authScreenModal.classList.add('hidden');
            const authMessage = document.getElementById('authMessage');
            if (authMessage) authMessage.textContent = '';
        });
    }

    const loginBtnModal = document.getElementById('loginBtnModal');
    const registerBtnModal = document.getElementById('registerBtnModal');
    const googleLoginBtnModal = document.getElementById('googleLoginBtnModal');

    if (loginBtnModal) {
        loginBtnModal.addEventListener('click', async () => {
            const emailEl = document.getElementById('authEmail');
            const passwordEl = document.getElementById('authPassword');
            if (!emailEl || !passwordEl) return;
            handleLogin(emailEl.value, passwordEl.value); // handleLogin em auth.js deve lidar com o estado
        });
    }
    if (registerBtnModal) {
        registerBtnModal.addEventListener('click', async () => {
            const emailEl = document.getElementById('authEmail');
            const passwordEl = document.getElementById('authPassword');
            if (!emailEl || !passwordEl) return;
            handleRegister(emailEl.value, passwordEl.value); // handleRegister em auth.js deve lidar com o estado
        });
    }
    if (googleLoginBtnModal) {
        googleLoginBtnModal.addEventListener('click', handleGoogleLogin); // handleGoogleLogin em auth.js deve lidar com o estado
    }

    if (logoutBtn) logoutBtn.addEventListener('click', handleLogout); // handleLogout em auth.js deve lidar com o estado

    if (saveProfileChangesBtn) {
        saveProfileChangesBtn.addEventListener('click', () => {
            const displayName = profileDisplayNameInput ? profileDisplayNameInput.value : null;
            const newPassword = profileNewPasswordInput ? profileNewPasswordInput.value : null;
            const currentPassword = profileCurrentPasswordInput ? profileCurrentPasswordInput.value : null;
            const photoFile = profilePhotoUpload && profilePhotoUpload.files[0] ? profilePhotoUpload.files[0] : null;
            saveProfileChanges(displayName, newPassword, currentPassword, photoFile); // saveProfileChanges em auth.js pode interagir com estado se necessário
        });
    }
    if (changeProfilePhotoBtn && profilePhotoUpload) {
        changeProfilePhotoBtn.addEventListener('click', () => profilePhotoUpload.click());
    }

    const sidebarItems = document.querySelectorAll('.sidebar-item');
    sidebarItems.forEach(item => {
        item.addEventListener('click', () => {
            const targetId = item.dataset.target;
            if (targetId) showSection(targetId); // showSection em ui.js agora usa getState se precisar
        });
    });

    // As funções add... em data.js agora atualizam o estado, que notificará a UI.
    if (addCreditCardBtn) addCreditCardBtn.addEventListener('click', addCreditCard);
    if (addReserveBtn) addReserveBtn.addEventListener('click', addReserve);
    if (addDespesaBtn) addDespesaBtn.addEventListener('click', addUnifiedDespesa);
    if (addReceitaBtn) addReceitaBtn.addEventListener('click', addUnifiedReceita);
    if (addValeAlimentacaoBtn) addValeAlimentacaoBtn.addEventListener('click', addOrUpdateValeAlimentacao);

    document.querySelectorAll('input[name="expenseType"]').forEach(radio => {
        radio.addEventListener('change', function() {
            if(formDespesaVariavel) formDespesaVariavel.classList.toggle('hidden', this.value !== 'variavel');
            if(formDespesaFixa) formDespesaFixa.classList.toggle('hidden', this.value !== 'fixa');
        });
    });
    document.querySelectorAll('input[name="incomeType"]').forEach(radio => {
        radio.addEventListener('change', function() {
            if(formReceitaVariavel) formReceitaVariavel.classList.toggle('hidden', this.value !== 'variavel');
            if(formReceitaFixa) formReceitaFixa.classList.toggle('hidden', this.value !== 'fixa');
        });
    });

    const setupUnifiedPaymentListener = (methodSelect, cardContainer, cardSel, reserveContainer, reserveSel) => {
        if (methodSelect) {
            methodSelect.addEventListener('change', () => {
                const showCard = methodSelect.value === 'Crédito';
                const showReserve = methodSelect.value === 'Reserva Financeira';
                if(cardContainer) cardContainer.classList.toggle('hidden', !showCard);
                // MODIFICADO: Passa os dados do estado para as funções de atualização de dropdown
                if(showCard && cardSel) updateCreditCardDropdowns(getState().creditCards); else if(cardSel) cardSel.value = '';
                if(reserveContainer) reserveContainer.classList.toggle('hidden', !showReserve);
                if(showReserve && reserveSel) updateReserveAccountDropdowns(getState().reserves); else if(reserveSel) reserveSel.value = '';
            });
            methodSelect.dispatchEvent(new Event('change')); // Para estado inicial
        }
    };
    setupUnifiedPaymentListener(despesaVariavelPagamento, despesaVariavelCartaoContainer, despesaVariavelCartaoSelect, despesaVariavelReservaContainer, despesaVariavelReservaSelect);
    setupUnifiedPaymentListener(despesaFixaPagamento, despesaFixaCartaoContainer, despesaFixaCartaoSelect, despesaFixaReservaContainer, despesaFixaReservaSelect);

    const setupUnifiedReceiptListener = (methodSelect, reserveContainer, reserveSel) => {
        if(methodSelect) {
            methodSelect.addEventListener('change', () => {
                const showReserve = methodSelect.value === 'Reserva Financeira';
                if(reserveContainer) reserveContainer.classList.toggle('hidden', !showReserve);
                 // MODIFICADO: Passa os dados do estado
                if(showReserve && reserveSel) updateReserveAccountDropdowns(getState().reserves); else if(reserveSel) reserveSel.value = '';
            });
            methodSelect.dispatchEvent(new Event('change')); // Para estado inicial
        }
    };
    setupUnifiedReceiptListener(receitaVariavelForma, receitaVariavelReservaContainer, receitaVariavelReservaSelect);
    setupUnifiedReceiptListener(receitaFixaForma, receitaFixaReservaContainer, receitaFixaReservaSelect);

    // MODIFICADO: generateReport e copyToExcel agora recebem o estado
    if (filterReportBtn) filterReportBtn.addEventListener('click', () => generateReport(true, getState()));
    if (copyToExcelBtn) copyToExcelBtn.addEventListener('click', () => copyReportToExcel(getState()));


    if (closeReportModalBtn_el) closeReportModalBtn_el.addEventListener('click', () => {
        const reportModal = document.getElementById('detailedReportModal');
        if (reportModal) reportModal.classList.add('hidden');
        showSection('general-summary-section');
    });

    // Funções de IA (mantidas, mas precisam do estado se forem interagir com dados)
    if (analyzeFinanceBtn_el && aiAnalysisModal_el) analyzeFinanceBtn_el.addEventListener('click', () => getFinancialAnalysis(getState())); // Passa o estado
    if (closeAiModalBtn_el && aiAnalysisModal_el) closeAiModalBtn_el.addEventListener('click', () => aiAnalysisModal_el.classList.add('hidden'));
    if (closeAiModalBtnBottom_el && aiAnalysisModal_el) closeAiModalBtnBottom_el.addEventListener('click', () => aiAnalysisModal_el.classList.add('hidden'));

    if (copyAiAnalysisBtn_el && aiAnalysisResult) {
        copyAiAnalysisBtn_el.addEventListener('click', () => {
            const textToCopy = aiAnalysisResult.innerText || aiAnalysisResult.textContent;
            navigator.clipboard.writeText(textToCopy).then(() => {
                showMessageBox('Análise copiada!');
            }).catch(err => {
                showMessageBox('Falha ao copiar.'); console.error('Falha ao copiar IA: ', err);
            });
        });
    }
    if(askAiBtn_el) askAiBtn_el.addEventListener('click', () => askFinancialQuestionToAI(getState())); // Passa o estado

    const today = new Date().toISOString().split('T')[0];
    if (despesaVariavelData) despesaVariavelData.value = today;
    if (despesaFixaStartDateInput) despesaFixaStartDateInput.value = today;
    if (receitaVariavelData) receitaVariavelData.value = today;
    if (receitaFixaStartDateInput) receitaFixaStartDateInput.value = today;
    if (valeDataCargaInput) valeDataCargaInput.value = today;
    if (reportStartDateInput) reportStartDateInput.value = "";
    if (reportEndDateInput) reportEndDateInput.value = "";

    populateDateFilters();
    showSection('home-section'); // showSection agora pode precisar do estado para renderizar tabelas
    console.log("DOMContentLoaded finalizado, listeners configurados, estado subscrito.");
});
