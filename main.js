import { initializeAuth, setupAuthListeners, handleLogin, handleRegister, handleGoogleLogin, handleLogout, saveProfileChanges } from './auth.js';
import {
    cacheDomElements, showSection, populateDateFilters, generateReport, copyReportToExcel,
    // Elementos DOM individuais que precisam ser referenciados diretamente para listeners
    closeAuthModalBtn, authScreenModal, logoutBtn, saveProfileChangesBtn,
    profileDisplayNameInput, profileNewPasswordInput, profileCurrentPasswordInput, profilePhotoUpload,
    changeProfilePhotoBtn, addCreditCardBtn, addReserveBtn, addDespesaBtn, addReceitaBtn,
    addValeAlimentacaoBtn, filterReportBtn, copyToExcelBtn, // Renomeado para evitar conflito com a função
    closeReportModalBtn as closeReportModalBtn_el, // Renomeado para evitar conflito
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
import { addCreditCard, addReserve, addUnifiedDespesa, addUnifiedReceita, addOrUpdateValeAlimentacao } from './data.js';
import { closeMessageBoxHandler, showMessageBox } from './config.js';

document.addEventListener('DOMContentLoaded', async () => {
    cacheDomElements(); // Cacheia todos os elementos DOM primeiro

    setupAuthListeners();
    await initializeAuth();

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
            handleLogin(emailEl.value, passwordEl.value);
        });
    }
    if (registerBtnModal) {
        registerBtnModal.addEventListener('click', async () => {
            const emailEl = document.getElementById('authEmail');
            const passwordEl = document.getElementById('authPassword');
            if (!emailEl || !passwordEl) return;
            handleRegister(emailEl.value, passwordEl.value);
        });
    }
    if (googleLoginBtnModal) {
        googleLoginBtnModal.addEventListener('click', handleGoogleLogin);
    }

    if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);

    if (saveProfileChangesBtn) {
        saveProfileChangesBtn.addEventListener('click', () => {
            const displayName = profileDisplayNameInput ? profileDisplayNameInput.value : null;
            const newPassword = profileNewPasswordInput ? profileNewPasswordInput.value : null;
            const currentPassword = profileCurrentPasswordInput ? profileCurrentPasswordInput.value : null;
            const photoFile = profilePhotoUpload && profilePhotoUpload.files[0] ? profilePhotoUpload.files[0] : null;
            saveProfileChanges(displayName, newPassword, currentPassword, photoFile);
        });
    }
    if (changeProfilePhotoBtn && profilePhotoUpload) {
        changeProfilePhotoBtn.addEventListener('click', () => profilePhotoUpload.click());
    }

    const sidebarItems = document.querySelectorAll('.sidebar-item');
    sidebarItems.forEach(item => {
        item.addEventListener('click', () => {
            const targetId = item.dataset.target;
            console.log("Sidebar item clicked, targetId:", targetId); // Log para depuração
            if (targetId) showSection(targetId);
        });
    });

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
                if(showCard && cardSel) updateCreditCardDropdowns(); else if(cardSel) cardSel.value = '';
                if(reserveContainer) reserveContainer.classList.toggle('hidden', !showReserve);
                if(showReserve && reserveSel) updateReserveAccountDropdowns(); else if(reserveSel) reserveSel.value = '';
            });
            methodSelect.dispatchEvent(new Event('change'));
        }
    };
    setupUnifiedPaymentListener(despesaVariavelPagamento, despesaVariavelCartaoContainer, despesaVariavelCartaoSelect, despesaVariavelReservaContainer, despesaVariavelReservaSelect);
    setupUnifiedPaymentListener(despesaFixaPagamento, despesaFixaCartaoContainer, despesaFixaCartaoSelect, despesaFixaReservaContainer, despesaFixaReservaSelect);

    const setupUnifiedReceiptListener = (methodSelect, reserveContainer, reserveSel) => {
        if(methodSelect) {
            methodSelect.addEventListener('change', () => {
                const showReserve = methodSelect.value === 'Reserva Financeira';
                if(reserveContainer) reserveContainer.classList.toggle('hidden', !showReserve);
                if(showReserve && reserveSel) updateReserveAccountDropdowns(); else if(reserveSel) reserveSel.value = '';
            });
            methodSelect.dispatchEvent(new Event('change'));
        }
    };
    setupUnifiedReceiptListener(receitaVariavelForma, receitaVariavelReservaContainer, receitaVariavelReservaSelect);
    setupUnifiedReceiptListener(receitaFixaForma, receitaFixaReservaContainer, receitaFixaReservaSelect);

    if (filterReportBtn) filterReportBtn.addEventListener('click', () => generateReport(true));
    const today = new Date().toISOString().split('T')[0];
    if (despesaVariavelData) despesaVariavelData.value = today;
    if (despesaFixaStartDateInput) despesaFixaStartDateInput.value = today;
    if (receitaVariavelData) receitaVariavelData.value = today;
    if (receitaFixaStartDateInput) receitaFixaStartDateInput.value = today;
    if (valeDataCargaInput) valeDataCargaInput.value = today;
    if (reportStartDateInput) reportStartDateInput.value = "";
    if (reportEndDateInput) reportEndDateInput.value = "";

    populateDateFilters();
    showSection('home-section');
    console.log("DOMContentLoaded finalizado, listeners configurados."); // Log final
});
