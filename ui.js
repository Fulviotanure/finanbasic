import { formatCurrency, showMessageBox } from './config.js';
import { creditCards, reserves, allDespesas, allReceitas, valesAlimentacao, removeCreditCard, removeReserve, removeUnifiedDespesa, removeUnifiedReceita, removeValeAlimentacao } from './data.js';
import { isGuestMode, populateUserProfile } from './auth.js';

// --- Referências de Elementos DOM ---
export let mainAppTitle, guestModeMessageContainer, authScreenModal, userAuthArea;
export let despesasSection, receitasSection, valeAlimentacaoSection, creditCardTransactionsContainer;
export let profileAvatar, profileUserImage, profileUserInitials, changeProfilePhotoBtn, profilePhotoUpload;
export let profileDisplayNameInput, profileEmailInput, profileCurrentPasswordInput, profileNewPasswordInput, saveProfileChangesBtn, passwordChangeSection;
export let formDespesaVariavel, formDespesaFixa, addDespesaBtn, tabelaDespesasUnificada;
export let expenseTypeVariableRadio, expenseTypeFixedRadio;
export let despesaVariavelData, despesaVariavelCategoria, despesaVariavelDescricao, despesaVariavelValor, despesaVariavelPagamento, despesaVariavelCartaoContainer, despesaVariavelCartaoSelect, despesaVariavelReservaContainer, despesaVariavelReservaSelect, despesaVariavelObs;
export let despesaFixaStartDateInput, despesaFixaVencimento, despesaFixaCategoria, despesaFixaDescricao, despesaFixaValor, despesaFixaPagamento, despesaFixaCartaoContainer, despesaFixaCartaoSelect, despesaFixaReservaContainer, despesaFixaReservaSelect, despesaFixaObs;
export let formReceitaVariavel, formReceitaFixa, addReceitaBtn, tabelaReceitasUnificada;
export let incomeTypeVariableRadio, incomeTypeFixedRadio;
export let receitaVariavelData, receitaVariavelDescricao, receitaVariavelValor, receitaVariavelForma, receitaVariavelReservaContainer, receitaVariavelReservaSelect;
export let receitaFixaStartDateInput, receitaFixaDescricao, receitaFixaValor, receitaFixaDia, receitaFixaForma, receitaFixaReservaContainer, receitaFixaReservaSelect;
export let valeNomeInput, valeSaldoInicialInput, valeDataCargaInput, addValeAlimentacaoBtn, tabelaValesAlimentacao;
export let addCreditCardBtn, creditCardTableBody, selectedCardNameSpan, creditCardTransactionsTableBody, selectedCardAvailableLimitSpan;
export let creditCardClosingDayInput, creditCardPaymentDayInput;
export let addReserveBtn, reserveTableBody, totalReserveValueSpan;
export let summaryFixedIncomeEl, summaryFixedExpensesEl, summaryFixedBalanceEl;
export let summaryVariableIncomeEl, summaryVariableExpensesEl, summaryVariableBalanceEl;
export let summaryTotalIncomeEl, summaryTotalExpensesEl, summaryTotalBalanceEl;
export let summaryCardLimitEl, summaryCardExpensesEl, summaryCardAvailableEl, summaryCardDueEl;
export let summaryTotalReserveEl, totalValueSpan;
export let copyToExcelBtn, closeReportModalBtn, aiAnalysisModal, closeAiModalBtn, closeAiModalBtnBottom, aiAnalysisResult, analyzeFinanceBtn, aiLoadingMessage, copyAiAnalysisBtn;
export let aiQuestionInput, askAiBtn, aiQuestionResponse, aiQuestionLoading;
export let reportMonthSelect, reportYearInput, filterReportBtn, reportStartDateInput, reportEndDateInput;
export let logoutBtn, authUserIdSpan, appUserIdSpan, closeAuthModalBtn;

export function cacheDomElements() {
    mainAppTitle = document.getElementById('mainAppTitle');
    guestModeMessageContainer = document.getElementById('guestModeMessageContainer');
    authScreenModal = document.getElementById('authScreenModal');
    userAuthArea = document.getElementById('userAuthArea');
    despesasSection = document.getElementById('despesas-section');
    receitasSection = document.getElementById('receitas-section');
    valeAlimentacaoSection = document.getElementById('vale-alimentacao-section');
    creditCardTransactionsContainer = document.getElementById('creditCardTransactionsContainer');
    profileAvatar = document.getElementById('profileAvatar');
    profileUserImage = document.getElementById('profileUserImage');
    profileUserInitials = document.getElementById('profileUserInitials');
    changeProfilePhotoBtn = document.getElementById('changeProfilePhotoBtn');
    profilePhotoUpload = document.getElementById('profilePhotoUpload');
    profileDisplayNameInput = document.getElementById('profileDisplayName');
    profileEmailInput = document.getElementById('profileEmail');
    profileCurrentPasswordInput = document.getElementById('profileCurrentPassword');
    profileNewPasswordInput = document.getElementById('profileNewPassword');
    saveProfileChangesBtn = document.getElementById('saveProfileChangesBtn');
    passwordChangeSection = document.getElementById('passwordChangeSection');
    formDespesaVariavel = document.getElementById('formDespesaVariavel');
    formDespesaFixa = document.getElementById('formDespesaFixa');
    addDespesaBtn = document.getElementById('addDespesaBtn');
    tabelaDespesasUnificada = document.getElementById('tabelaDespesasUnificada');
    expenseTypeVariableRadio = document.getElementById('expenseTypeVariable');
    expenseTypeFixedRadio = document.getElementById('expenseTypeFixed');
    despesaVariavelData = document.getElementById('despesaVariavelData');
    despesaVariavelCategoria = document.getElementById('despesaVariavelCategoria');
    despesaVariavelDescricao = document.getElementById('despesaVariavelDescricao');
    despesaVariavelValor = document.getElementById('despesaVariavelValor');
    despesaVariavelPagamento = document.getElementById('despesaVariavelPagamento');
    despesaVariavelCartaoContainer = document.getElementById('despesaVariavelCartaoContainer');
    despesaVariavelCartaoSelect = document.getElementById('despesaVariavelCartaoSelect');
    despesaVariavelReservaContainer = document.getElementById('despesaVariavelReservaContainer');
    despesaVariavelReservaSelect = document.getElementById('despesaVariavelReservaSelect');
    despesaVariavelObs = document.getElementById('despesaVariavelObs');
    despesaFixaStartDateInput = document.getElementById('despesaFixaStartDate');
    despesaFixaVencimento = document.getElementById('despesaFixaVencimento');
    despesaFixaCategoria = document.getElementById('despesaFixaCategoria');
    despesaFixaDescricao = document.getElementById('despesaFixaDescricao');
    despesaFixaValor = document.getElementById('despesaFixaValor');
    despesaFixaPagamento = document.getElementById('despesaFixaPagamento');
    despesaFixaCartaoContainer = document.getElementById('despesaFixaCartaoContainer');
    despesaFixaCartaoSelect = document.getElementById('despesaFixaCartaoSelect');
    despesaFixaReservaContainer = document.getElementById('despesaFixaReservaContainer');
    despesaFixaReservaSelect = document.getElementById('despesaFixaReservaSelect');
    despesaFixaObs = document.getElementById('despesaFixaObs');
    formReceitaVariavel = document.getElementById('formReceitaVariavel');
    formReceitaFixa = document.getElementById('formReceitaFixa');
    addReceitaBtn = document.getElementById('addReceitaBtn');
    tabelaReceitasUnificada = document.getElementById('tabelaReceitasUnificada'); // Verifique se é o mesmo ID da tabela de despesas ou diferente
    incomeTypeVariableRadio = document.getElementById('incomeTypeVariable');
    incomeTypeFixedRadio = document.getElementById('incomeTypeFixed');
    receitaVariavelData = document.getElementById('receitaVariavelData');
    receitaVariavelDescricao = document.getElementById('receitaVariavelDescricao');
    receitaVariavelValor = document.getElementById('receitaVariavelValor');
    receitaVariavelForma = document.getElementById('receitaVariavelForma');
    receitaVariavelReservaContainer = document.getElementById('receitaVariavelReservaContainer');
    receitaVariavelReservaSelect = document.getElementById('receitaVariavelReservaSelect');
    receitaFixaStartDateInput = document.getElementById('receitaFixaStartDate');
    receitaFixaDescricao = document.getElementById('receitaFixaDescricao');
    receitaFixaValor = document.getElementById('receitaFixaValor');
    receitaFixaDia = document.getElementById('receitaFixaDia');
    receitaFixaForma = document.getElementById('receitaFixaForma');
    receitaFixaReservaContainer = document.getElementById('receitaFixaReservaContainer');
    receitaFixaReservaSelect = document.getElementById('receitaFixaReservaSelect');
    valeNomeInput = document.getElementById('valeNome');
    valeSaldoInicialInput = document.getElementById('valeSaldoInicial');
    valeDataCargaInput = document.getElementById('valeDataCarga');
    addValeAlimentacaoBtn = document.getElementById('addValeAlimentacaoBtn');
    tabelaValesAlimentacao = document.getElementById('tabelaValesAlimentacao');
    addCreditCardBtn = document.getElementById('addCreditCardBtn');
    creditCardTableBody = document.getElementById('creditCardTableBody');
    selectedCardNameSpan = document.getElementById('selectedCardName');
    creditCardTransactionsTableBody = document.getElementById('creditCardTransactionsTableBody');
    selectedCardAvailableLimitSpan = document.getElementById('selectedCardAvailableLimit');
    creditCardClosingDayInput = document.getElementById('creditCardClosingDay');
    creditCardPaymentDayInput = document.getElementById('creditCardPaymentDay');
    addReserveBtn = document.getElementById('addReserveBtn');
    reserveTableBody = document.getElementById('reserveTableBody');
    totalReserveValueSpan = document.getElementById('totalReserveValue');
    summaryFixedIncomeEl = document.getElementById('summaryFixedIncome');
    summaryFixedExpensesEl = document.getElementById('summaryFixedExpenses');
    summaryFixedBalanceEl = document.getElementById('summaryFixedBalance');
    summaryVariableIncomeEl = document.getElementById('summaryVariableIncome');
    summaryVariableExpensesEl = document.getElementById('summaryVariableExpenses');
    summaryVariableBalanceEl = document.getElementById('summaryVariableBalance');
    summaryTotalIncomeEl = document.getElementById('summaryTotalIncome');
    summaryTotalExpensesEl = document.getElementById('summaryTotalExpenses');
    summaryTotalBalanceEl = document.getElementById('summaryTotalBalance');
    summaryCardLimitEl = document.getElementById('summaryCardLimit');
    summaryCardExpensesEl = document.getElementById('summaryCardExpenses');
    summaryCardAvailableEl = document.getElementById('summaryCardAvailable');
    summaryCardDueEl = document.getElementById('summaryCardDue');
    summaryTotalReserveEl = document.getElementById('summaryTotalReserve');
    totalValueSpan = document.getElementById('totalValue');
    copyToExcelBtn = document.getElementById('copyToExcelBtn');
    closeReportModalBtn = document.getElementById('closeReportModalBtn');
    aiAnalysisModal = document.getElementById('aiAnalysisModal');
    closeAiModalBtn = document.getElementById('closeAiModalBtn');
    closeAiModalBtnBottom = document.getElementById('closeAiModalBtnBottom');
    aiAnalysisResult = document.getElementById('aiAnalysisResult');
    analyzeFinanceBtn = document.getElementById('analyzeFinanceBtn');
    aiLoadingMessage = document.getElementById('aiLoadingMessage');
    copyAiAnalysisBtn = document.getElementById('copyAiAnalysisBtn');
    aiQuestionInput = document.getElementById('aiQuestionInput');
    askAiBtn = document.getElementById('askAiBtn');
    aiQuestionResponse = document.getElementById('aiQuestionResponse');
    aiQuestionLoading = document.getElementById('aiQuestionLoading');
    reportMonthSelect = document.getElementById('reportMonth');
    reportYearInput = document.getElementById('reportYear');
    filterReportBtn = document.getElementById('filterReportBtn');
    reportStartDateInput = document.getElementById('reportStartDate');
    reportEndDateInput = document.getElementById('reportEndDate');
    logoutBtn = document.getElementById('logoutBtn');
    authUserIdSpan = document.getElementById('authUserId');
    appUserIdSpan = document.getElementById('appUserId');
    closeAuthModalBtn = document.getElementById('closeAuthModalBtn');
}   

export function renderAllData() {
    renderCreditCards();
    renderReserves();
    // Decida qual tabela mostrar por padrão ou com base na seção ativa
    // Por exemplo, se a seção de despesas estiver ativa, renderize despesas.
    // Se você tem abas separadas para despesas e receitas na mesma "seção" de transações unificadas,
    // você precisará de uma lógica adicional para alternar qual função de renderização é chamada.
    // Para simplificar, vamos assumir que a tabela unificada é para despesas inicialmente,
    // e uma tabela separada (ou a mesma, limpa e re-renderizada) para receitas.
    if (document.getElementById('despesas-section')?.classList.contains('active')) {
        renderUnifiedDespesas();
    } else if (document.getElementById('receitas-section')?.classList.contains('active')) {
        // Supondo que você tenha uma tabela separada ou queira limpar e mostrar receitas aqui
        const tabelaReceitas = document.getElementById('tabelaReceitasUnificada'); // Ou o ID da sua tabela de receitas
        if (tabelaReceitas) renderUnifiedReceitas();
    } else {
        // Se nenhuma seção específica estiver ativa, talvez renderize despesas por padrão ou nada na tabela unificada.
         if(tabelaDespesasUnificada) tabelaDespesasUnificada.innerHTML = ''; // Limpa se não for mostrar nada específico
    }
    renderValesAlimentacao();
    updateGeneralSummaryDisplay();
    updateCreditCardDropdowns();
    updateReserveAccountDropdowns();
}

export function renderCreditCards() {
    if (!creditCardTableBody) return;
    creditCardTableBody.innerHTML = '';
    creditCards.forEach(card => {
        const row = creditCardTableBody.insertRow();
        row.classList.add('hover:bg-gray-50', 'clickable-row');
        row.dataset.cardId = card.id;
        const available = card.limit - card.usedLimit;
        row.insertCell(0).textContent = card.bank;
        row.insertCell(1).textContent = formatCurrency(card.limit);
        row.insertCell(2).textContent = formatCurrency(card.usedLimit);
        row.insertCell(3).textContent = formatCurrency(available);
        row.insertCell(4).textContent = card.closingDay || '-';
        row.insertCell(5).textContent = card.paymentDay || '-';
        const actionsCell = row.insertCell(6);
        const deleteBtn = document.createElement('button');
        deleteBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" /></svg>';
        deleteBtn.title = "Remover Cartão";
        deleteBtn.className = 'text-red-500 hover:text-red-700 font-bold py-1 px-2 rounded-md text-xs transition duration-200';
        deleteBtn.onclick = (e) => { e.stopPropagation(); removeCreditCard(card.id); };
        actionsCell.appendChild(deleteBtn);
        row.onclick = () => displayCardTransactions(card.id);
    });
    updateCreditCardDropdowns();
}

export function displayCardTransactions(cardId) {
    const card = creditCards.find(c => c.id === cardId);
    if (!card || !creditCardTransactionsTableBody || !creditCardTransactionsContainer || !selectedCardNameSpan || !selectedCardAvailableLimitSpan) return;
    selectedCardNameSpan.textContent = card.bank;
    creditCardTransactionsTableBody.innerHTML = '';
    const cardTransactions = [
        ...allDespesas.filter(d => d.creditCardId === cardId && d.paymentMethod === 'Crédito').map(d => ({ ...d, type: 'Despesa', dateSort: new Date(d.date || `2000-01-${d.dueDate || '01'}T00:00:00Z`) })),
        ...allReceitas.filter(i => i.creditCardId === cardId && i.receiptMethod === 'Cartão de Crédito').map(i => ({ ...i, type: 'Pagamento Fatura', dateSort: new Date(i.date || `2000-01-${i.day || '01'}T00:00:00Z`) }))
    ].sort((a, b) => b.dateSort - a.dateSort);
    cardTransactions.forEach(transaction => {
        const row = creditCardTransactionsTableBody.insertRow();
        row.insertCell(0).textContent = transaction.date ? new Date(transaction.date + "T00:00:00Z").toLocaleDateString('pt-BR', {timeZone: 'UTC'}) : `Dia ${transaction.dueDate || transaction.day}`;
        row.insertCell(1).textContent = transaction.description;
        row.insertCell(2).textContent = transaction.type;
        const valueCell = row.insertCell(3);
        valueCell.textContent = formatCurrency(transaction.value);
                valueCell.classList.add(transaction.type === 'Despesa' ? 'text-red-600' : 'text-green-600');
        });
        selectedCardAvailableLimitSpan.textContent = formatCurrency(card.limit - card.usedLimit);
        if(creditCardTransactionsContainer) creditCardTransactionsContainer.classList.remove('hidden');
    }

    export function renderReserves() {
        if (!reserveTableBody || !totalReserveValueSpan) return;
        reserveTableBody.innerHTML = '';
        let totalReserve = 0;
        reserves.forEach(reserve => {
            const row = reserveTableBody.insertRow();
            totalReserve += reserve.value;
            row.classList.add('hover:bg-gray-50');
            row.insertCell(0).textContent = reserve.description;
            row.insertCell(1).textContent = formatCurrency(reserve.value);
            row.insertCell(2).textContent = reserve.source || '-';
            row.insertCell(3).textContent = reserve.location || '-';
            const actionsCell = row.insertCell(4);
            const deleteBtn = document.createElement('button');
            deleteBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" /></svg>';
            deleteBtn.title = "Remover Reserva";
            deleteBtn.className = 'text-red-500 hover:text-red-700 font-bold py-1 px-2 rounded-md text-xs';
            deleteBtn.onclick = () => removeReserve(reserve.id);
            actionsCell.appendChild(deleteBtn);
        });
        totalReserveValueSpan.textContent = formatCurrency(totalReserve);
        updateReserveAccountDropdowns();
    }

    export function renderUnifiedDespesas(despesasParaRenderizar = allDespesas) {
        const tabelaElem = document.getElementById('tabelaDespesasUnificada');
        if (!tabelaElem) {
            console.warn("Elemento tabelaDespesasUnificada não encontrado para renderizar despesas.");
            return;
        }
        tabelaElem.innerHTML = '';
        const sortedDespesas = [...despesasParaRenderizar].sort((a, b) => {
            if (a.expenseNature === 'fixa' && b.expenseNature === 'variavel') return -1;
            if (a.expenseNature === 'variavel' && b.expenseNature === 'fixa') return 1;
            const dateA_str = a.date || `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(a.dueDate || '01').padStart(2, '0')}`;
            const dateB_str = b.date || `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(b.dueDate || '01').padStart(2, '0')}`;
            const dateA = new Date(dateA_str + "T00:00:00Z");
            const dateB = new Date(dateB_str + "T00:00:00Z");
            return dateB - dateA;
        });

        sortedDespesas.forEach((despesa) => {
            const row = tabelaElem.insertRow();
            row.classList.add('hover:bg-gray-50');
            if (despesa.expenseNature === 'fixa') row.classList.add('bg-pink-50');

            row.insertCell(0).textContent = despesa.date ? new Date(despesa.date + "T00:00:00Z").toLocaleDateString('pt-BR', { timeZone: 'UTC' }) : (despesa.dueDate ? `Todo dia ${despesa.dueDate}` : '-');

            const proxVencCell = row.insertCell(1);
            if (despesa.expenseNature === 'fixa' && despesa.dueDate && despesa.startDate) {
                const hoje = new Date();
                hoje.setUTCHours(0, 0, 0, 0);
                const inicioRecorrencia = new Date(despesa.startDate + "T00:00:00Z");
                inicioRecorrencia.setUTCHours(0, 0, 0, 0);

                let proxMes = hoje.getUTCMonth();
                let proxAno = hoje.getUTCFullYear();

                if (hoje.getUTCDate() > despesa.dueDate) {
                    proxMes++;
                    if (proxMes > 11) { proxMes = 0; proxAno++; }
                }
                let proxVencData = new Date(Date.UTC(proxAno, proxMes, despesa.dueDate));

                while (proxVencData < inicioRecorrencia) {
                    proxVencData.setUTCMonth(proxVencData.getUTCMonth() + 1);
                }
                proxVencCell.textContent = proxVencData.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
            } else {
                proxVencCell.textContent = '-';
            }

            row.insertCell(2).textContent = despesa.expenseNature === 'fixa' ? 'Fixa' : 'Variável';
            row.insertCell(3).textContent = despesa.category;
            row.insertCell(4).textContent = despesa.description;
            row.insertCell(5).textContent = formatCurrency(despesa.value);
            let paymentDetail = despesa.paymentMethod;
            if (despesa.paymentMethod === 'Crédito' && despesa.creditCardId) {
                const card = creditCards.find(c => c.id === despesa.creditCardId);
                paymentDetail += ` (${card ? card.bank : 'Cartão Removido'})`;
            } else if (despesa.paymentMethod === 'Reserva Financeira' && despesa.reserveAccountId) {
                const res = reserves.find(r => r.id === despesa.reserveAccountId);
                paymentDetail += ` (${res ? res.description : 'Reserva Removida'})`;
            }
            row.insertCell(6).textContent = paymentDetail;
            row.insertCell(7).textContent = despesa.observations || '-';
            const actionsCell = row.insertCell(8);
            const deleteBtn = document.createElement('button');
            deleteBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" /></svg>';
            deleteBtn.title = "Remover Despesa";
            deleteBtn.className = 'text-red-500 hover:text-red-700 font-bold py-1 px-2 rounded-md text-xs';
            deleteBtn.onclick = () => removeUnifiedDespesa(despesa.id);
            actionsCell.appendChild(deleteBtn);
        });
    }

    export function renderUnifiedReceitas(receitasParaRenderizar = allReceitas) {
        // Se sua tabela de receitas tiver um ID diferente, use esse ID aqui.
        // Se for a mesma tabela de despesas (tabelaDespesasUnificada), esta função limpará e renderizará as receitas.
        const tabelaElem = document.getElementById('tabelaReceitasUnificada') || document.getElementById('tabelaDespesasUnificada');
        if (!tabelaElem) {
            console.warn("Elemento de tabela para receitas não encontrado.");
            return;
        }
        tabelaElem.innerHTML = '';
        const sortedReceitas = [...receitasParaRenderizar].sort((a, b) => {
            if (a.incomeNature === 'fixa' && b.incomeNature === 'variavel') return -1;
            if (a.incomeNature === 'variavel' && b.incomeNature === 'fixa') return 1;
            const dateA_str = a.date || `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(a.day || '01').padStart(2, '0')}`;
            const dateB_str = b.date || `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(b.day || '01').padStart(2, '0')}`;
            const dateA = new Date(dateA_str + "T00:00:00Z");
            const dateB = new Date(dateB_str + "T00:00:00Z");
            return dateB - dateA;
        });
        sortedReceitas.forEach((receita) => {
            const row = tabelaElem.insertRow();
            row.classList.add('hover:bg-gray-50');
            if (receita.incomeNature === 'fixa') row.classList.add('bg-sky-50');

            row.insertCell(0).textContent = receita.date ? new Date(receita.date + "T00:00:00Z").toLocaleDateString('pt-BR', { timeZone: 'UTC' }) : (receita.day ? `Todo dia ${receita.day}` : '-');

            const proxRecCell = row.insertCell(1);
            if (receita.incomeNature === 'fixa' && receita.day && receita.startDate) {
                const hoje = new Date();
                hoje.setUTCHours(0, 0, 0, 0);
                const inicioRecorrencia = new Date(receita.startDate + "T00:00:00Z");
                inicioRecorrencia.setUTCHours(0, 0, 0, 0);

                let proxMes = hoje.getUTCMonth();
                let proxAno = hoje.getUTCFullYear();
                if (hoje.getUTCDate() > receita.day) {
                    proxMes++;
                    if (proxMes > 11) { proxMes = 0; proxAno++; }
                }
                let proxRecData = new Date(Date.UTC(proxAno, proxMes, receita.day));

                while (proxRecData < inicioRecorrencia) {
                    proxRecData.setUTCMonth(proxRecData.getUTCMonth() + 1);
                }
                proxRecCell.textContent = proxRecData.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
            } else {
                proxRecCell.textContent = '-';
            }

            row.insertCell(2).textContent = receita.incomeNature === 'fixa' ? 'Fixa' : 'Variável';
            row.insertCell(3).textContent = receita.description;
            row.insertCell(4).textContent = formatCurrency(receita.value);
            let receiptDetail = receita.receiptMethod;
            if (receita.receiptMethod === 'Reserva Financeira' && receita.reserveAccountId) {
                const reserve = reserves.find(r => r.id === receita.reserveAccountId);
                receiptDetail += ` (${reserve ? reserve.description : 'Reserva Removida'})`;
            }
            row.insertCell(5).textContent = receiptDetail;
            const actionsCell = row.insertCell(6);
            const deleteBtn = document.createElement('button');
            deleteBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" /></svg>';
            deleteBtn.title = "Remover Receita";
            deleteBtn.className = 'text-red-500 hover:text-red-700 font-bold py-1 px-2 rounded-md text-xs';
            deleteBtn.onclick = () => removeUnifiedReceita(receita.id);
            actionsCell.appendChild(deleteBtn);
        });
    }

    export function renderValesAlimentacao() {
        if (!tabelaValesAlimentacao) return;
        tabelaValesAlimentacao.innerHTML = '';
        valesAlimentacao.forEach((vale) => {
            const row = tabelaValesAlimentacao.insertRow();
            row.insertCell(0).textContent = vale.nome;
            row.insertCell(1).textContent = formatCurrency(vale.saldo);
            row.insertCell(2).textContent = vale.dataUltimaCarga ? new Date(vale.dataUltimaCarga + "T00:00:00Z").toLocaleDateString('pt-BR', { timeZone: 'UTC' }) : '-';
            const actionsCell = row.insertCell(3);
            const deleteBtn = document.createElement('button');
            deleteBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" /></svg>';
            deleteBtn.title = "Remover Vale";
            deleteBtn.className = 'text-red-500 hover:text-red-700 font-bold py-1 px-2 rounded-md text-xs';
            deleteBtn.onclick = () => removeValeAlimentacao(vale.id);
            actionsCell.appendChild(deleteBtn);
        });
    }

    export function updateCreditCardDropdowns() {
        const dropdowns = [despesaVariavelCartaoSelect, despesaFixaCartaoSelect];
        dropdowns.forEach(dropdown => {
            if (dropdown) {
                const currentVal = dropdown.value;
                dropdown.innerHTML = '<option value="">Selecione um cartão</option>';
                creditCards.forEach(card => {
                    const opt = document.createElement('option');
                    opt.value = card.id;
                    opt.textContent = `${card.bank} (Disp: ${formatCurrency(card.limit - card.usedLimit)})`;
                    dropdown.appendChild(opt);
                });
                if (creditCards.find(c => c.id === currentVal)) dropdown.value = currentVal;
                else dropdown.value = ""; // Garante que valor inválido seja resetado
            }
        });
    }

    export function updateReserveAccountDropdowns() {
        const dropdowns = [despesaVariavelReservaSelect, despesaFixaReservaSelect, receitaVariavelReservaSelect, receitaFixaReservaSelect];
        dropdowns.forEach(dropdown => {
            if (dropdown) {
                const currentVal = dropdown.value;
                dropdown.innerHTML = '<option value="">Selecione uma reserva</option>';
                reserves.forEach(reserve => {
                    const opt = document.createElement('option');
                    opt.value = reserve.id;
                    opt.textContent = `${reserve.description} (Saldo: ${formatCurrency(reserve.value)})`;
                    dropdown.appendChild(opt);
                });
                if (reserves.find(r => r.id === currentVal)) dropdown.value = currentVal;
                else dropdown.value = ""; // Garante que valor inválido seja resetado
            }
        });
    }

    export function updateGeneralSummaryDisplay() {
        const recFixas = allReceitas.filter(r => r.incomeNature === 'fixa').reduce((sum, item) => sum + item.value, 0);
        const recVariaveis = allReceitas.filter(r => r.incomeNature === 'variavel').reduce((sum, item) => sum + item.value, 0);
        const totalReceitas = recFixas + recVariaveis;

        const despFixasAll = allDespesas.filter(d => d.expenseNature === 'fixa').reduce((sum, item) => sum + item.value, 0);
        const despVariaveisAll = allDespesas.filter(d => d.expenseNature === 'variavel').reduce((sum, item) => sum + item.value, 0);
        const totalDespesasAll = despFixasAll + despVariaveisAll;

        const balancoFixas = recFixas - despFixasAll;
        const balancoVariaveis = recVariaveis - despVariaveisAll;
        const balancoGeral = totalReceitas - totalDespesasAll;

        let limiteTotalCartoes = 0;
        let limiteUsadoCartoes = 0;
        creditCards.forEach(card => { limiteTotalCartoes += card.limit; limiteUsadoCartoes += card.usedLimit; });
        const disponivelCartoes = limiteTotalCartoes - limiteUsadoCartoes;
        const totalAPagarCartoes = limiteUsadoCartoes; // Simplificado, cálculo real de fatura seria mais complexo
        const valorTotalReserva = reserves.reduce((sum, item) => sum + item.value, 0);

        if (summaryFixedIncomeEl) summaryFixedIncomeEl.textContent = formatCurrency(recFixas);
        if (summaryFixedExpensesEl) summaryFixedExpensesEl.textContent = formatCurrency(despFixasAll);
        if (summaryFixedBalanceEl) { summaryFixedBalanceEl.textContent = formatCurrency(balancoFixas); summaryFixedBalanceEl.className = `text-right font-medium ${balancoFixas >= 0 ? 'text-green-600' : 'text-red-600'}`; }
        if (summaryVariableIncomeEl) summaryVariableIncomeEl.textContent = formatCurrency(recVariaveis);
        if (summaryVariableExpensesEl) summaryVariableExpensesEl.textContent = formatCurrency(despVariaveisAll);
        if (summaryVariableBalanceEl) { summaryVariableBalanceEl.textContent = formatCurrency(balancoVariaveis); summaryVariableBalanceEl.className = `text-right font-medium ${balancoVariaveis >= 0 ? 'text-green-600' : 'text-red-600'}`; }
        if (summaryTotalIncomeEl) summaryTotalIncomeEl.textContent = formatCurrency(totalReceitas);
        if (summaryTotalExpensesEl) summaryTotalExpensesEl.textContent = formatCurrency(totalDespesasAll);
        if (summaryTotalBalanceEl) { summaryTotalBalanceEl.textContent = formatCurrency(balancoGeral); summaryTotalBalanceEl.className = `text-right font-semibold text-xl ${balancoGeral >= 0 ? 'text-green-700' : 'text-red-700'}`; }
        if (summaryCardLimitEl) summaryCardLimitEl.textContent = formatCurrency(limiteTotalCartoes);
        if (summaryCardExpensesEl) summaryCardExpensesEl.textContent = formatCurrency(limiteUsadoCartoes);
        if (summaryCardAvailableEl) summaryCardAvailableEl.textContent = formatCurrency(disponivelCartoes);
        if (summaryCardDueEl) summaryCardDueEl.textContent = formatCurrency(totalAPagarCartoes); // Fatura a pagar
        if (summaryTotalReserveEl) summaryTotalReserveEl.textContent = formatCurrency(valorTotalReserva);
        if (totalValueSpan) { totalValueSpan.textContent = formatCurrency(balancoGeral); totalValueSpan.className = `text-xl sm:text-2xl font-bold ${balancoGeral >= 0 ? 'text-green-700' : 'text-red-700'}`; }
    }

    export function populateDateFilters() {
        if (reportMonthSelect) {
            reportMonthSelect.innerHTML = '<option value="">Mês (Todos)</option>'; // Opção para limpar filtro de mês
            const meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
            meses.forEach((mes, index) => {
                const option = document.createElement('option');
                option.value = index; // 0-11
                option.textContent = mes;
                reportMonthSelect.appendChild(option);
            });
        }
        if (reportYearInput) {
            reportYearInput.value = new Date().getFullYear(); // Padrão para o ano atual
            reportYearInput.max = new Date().getFullYear() + 5;
            reportYearInput.min = new Date().getFullYear() - 10;
        }
        // Para filtros de data de início/fim, apenas garanta que os inputs existam
        // A lógica de data será pega diretamente deles.
    }

    export function generateReport(isFiltered = false) {
        let despesasFiltradas = [...allDespesas]; // Começa com cópia de todas as despesas
        let receitasFiltradas = [...allReceitas]; // Começa com cópia de todas as receitas

        if (isFiltered) {
            const startDateValue = reportStartDateInput ? reportStartDateInput.value : null;
            const endDateValue = reportEndDateInput ? reportEndDateInput.value : null;
            const mesSelecionado = (reportMonthSelect && reportMonthSelect.value !== "") ? parseInt(reportMonthSelect.value) : null;
            const anoSelecionado = (reportYearInput && reportYearInput.value) ? parseInt(reportYearInput.value) : new Date().getFullYear();

            if (startDateValue && endDateValue) {
                const startDate = new Date(startDateValue + "T00:00:00Z");
                const endDate = new Date(endDateValue + "T23:59:59Z"); // Inclui o dia final inteiro

                despesasFiltradas = despesasFiltradas.filter(d => {
                    const dataDespesa = new Date((d.date || `${anoSelecionado}-${String(mesSelecionado !== null ? mesSelecionado + 1 : 1).padStart(2,'0')}-${String(d.dueDate || '01').padStart(2,'0')}`) + "T00:00:00Z");
                    return dataDespesa >= startDate && dataDespesa <= endDate;
                });
                receitasFiltradas = receitasFiltradas.filter(r => {
                    const dataReceita = new Date((r.date || `${anoSelecionado}-${String(mesSelecionado !== null ? mesSelecionado + 1 : 1).padStart(2,'0')}-${String(r.day || '01').padStart(2,'0')}`) + "T00:00:00Z");
                    return dataReceita >= startDate && dataReceita <= endDate;
                });
            } else if (mesSelecionado !== null) { // Filtro por mês/ano se datas não estiverem preenchidas
                despesasFiltradas = despesasFiltradas.filter(d => {
                    if (d.expenseNature === 'variavel') {
                        const dataDespesa = new Date(d.date + "T00:00:00Z");
                        return dataDespesa.getUTCMonth() === mesSelecionado && dataDespesa.getUTCFullYear() === anoSelecionado;
                    } else { // Fixa
                        const inicioRecorrencia = new Date(d.startDate + "T00:00:00Z");
                        // Verifica se a despesa fixa está ativa no mês/ano do filtro
                        const dataFiltroInicioMes = new Date(Date.UTC(anoSelecionado, mesSelecionado, 1));
                        const dataFiltroFimMes = new Date(Date.UTC(anoSelecionado, mesSelecionado + 1, 0)); // Último dia do mês
                        return inicioRecorrencia <= dataFiltroFimMes; // && (condições de fim de recorrência se houver)
                    }
                });
                receitasFiltradas = receitasFiltradas.filter(r => {
                    if (r.incomeNature === 'variavel') {
                        const dataReceita = new Date(r.date + "T00:00:00Z");
                        return dataReceita.getUTCMonth() === mesSelecionado && dataReceita.getUTCFullYear() === anoSelecionado;
                    } else { // Fixa
                        const inicioRecorrencia = new Date(r.startDate + "T00:00:00Z");
                        const dataFiltroInicioMes = new Date(Date.UTC(anoSelecionado, mesSelecionado, 1));
                        const dataFiltroFimMes = new Date(Date.UTC(anoSelecionado, mesSelecionado + 1, 0));
                        return inicioRecorrencia <= dataFiltroFimMes;
                    }
                });
            } else if (anoSelecionado && !startDateValue && !endDateValue && mesSelecionado === null) { // Filtro apenas por ano
                 despesasFiltradas = despesasFiltradas.filter(d => {
                    const anoDespesa = new Date((d.date || d.startDate) + "T00:00:00Z").getUTCFullYear();
                    return anoDespesa === anoSelecionado;
                });
                receitasFiltradas = receitasFiltradas.filter(r => {
                    const anoReceita = new Date((r.date || r.startDate) + "T00:00:00Z").getUTCFullYear();
                    return anoReceita === anoSelecionado;
                });
            }
        }
        // Renderiza tabelas do relatório com os dados filtrados
        const reportCreditCardTableBody = document.getElementById('reportCreditCardTableBody');
        if (reportCreditCardTableBody) {
            reportCreditCardTableBody.innerHTML = '';
            creditCards.forEach(card => { /* ...renderização como antes... */
                const row = reportCreditCardTableBody.insertRow();
                row.insertCell(0).textContent = card.bank;
                row.insertCell(1).textContent = formatCurrency(card.limit);
                row.insertCell(2).textContent = formatCurrency(card.usedLimit);
                row.insertCell(3).textContent = formatCurrency(card.limit - card.usedLimit);
                row.insertCell(4).textContent = card.closingDay || '-';
                row.insertCell(5).textContent = card.paymentDay || '-';
            });
        }
        const reportReserveTableBody = document.getElementById('reportReserveTableBody');
        if (reportReserveTableBody) {
            reportReserveTableBody.innerHTML = '';
            reserves.forEach(reserve => { /* ...renderização como antes... */
                const row = reportReserveTableBody.insertRow();
                row.insertCell(0).textContent = reserve.description;
                row.insertCell(1).textContent = formatCurrency(reserve.value);
                row.insertCell(2).textContent = reserve.source;
                row.insertCell(3).textContent = reserve.location;
            });
        }
        const reportAllReceitasTableBody = document.getElementById('reportAllReceitasTableBody');
        if (reportAllReceitasTableBody) {
            reportAllReceitasTableBody.innerHTML = '';
            receitasFiltradas.forEach(item => { /* ...renderização como antes... */
                const row = reportAllReceitasTableBody.insertRow();
                row.insertCell(0).textContent = item.date ? new Date(item.date + "T00:00:00Z").toLocaleDateString('pt-BR', {timeZone: 'UTC'}) : (item.day ? `Dia ${item.day}`: '-');
                row.insertCell(1).textContent = item.incomeNature === 'fixa' ? 'Fixa' : 'Variável';
                row.insertCell(2).textContent = item.description;
                row.insertCell(3).textContent = formatCurrency(item.value);
                let receiptDetailText = item.receiptMethod;
                if (item.receiptMethod === 'Reserva Financeira' && item.reserveAccountId) {
                    const reserve = reserves.find(r => r.id === item.reserveAccountId);
                    receiptDetailText += ` (${reserve ? reserve.description : 'Reserva Removida'})`;
                }
                row.insertCell(4).textContent = receiptDetailText;
            });
        }
        const reportAllDespesasTableBody = document.getElementById('reportAllDespesasTableBody');
        if (reportAllDespesasTableBody) {
            reportAllDespesasTableBody.innerHTML = '';
            despesasFiltradas.forEach(item => { /* ...renderização como antes... */
                const row = reportAllDespesasTableBody.insertRow();
                row.insertCell(0).textContent = item.date ? new Date(item.date + "T00:00:00Z").toLocaleDateString('pt-BR', {timeZone: 'UTC'}) : (item.dueDate ? `Dia ${item.dueDate}`: '-');
                row.insertCell(1).textContent = item.expenseNature === 'fixa' ? 'Fixa' : 'Variável';
                row.insertCell(2).textContent = item.category;
                row.insertCell(3).textContent = item.description;
                row.insertCell(4).textContent = formatCurrency(item.value);
                let paymentDetailText = item.paymentMethod;
                if (item.paymentMethod === 'Crédito' && item.creditCardId) {
                    const card = creditCards.find(c => c.id === item.creditCardId);
                    paymentDetailText += ` (${card ? card.bank : 'Cartão Removido'})`;
                } else if (item.paymentMethod === 'Reserva Financeira' && item.reserveAccountId) {
                    const reserve = reserves.find(r => r.id === item.reserveAccountId);
                    paymentDetailText += ` (${reserve ? reserve.description : 'Reserva Removida'})`;
                }
                row.insertCell(5).textContent = paymentDetailText;
                row.insertCell(6).textContent = item.observations || '-';
            });
        }
        const reportValesAlimentacaoTableBody = document.getElementById('reportValesAlimentacaoTableBody');
        if (reportValesAlimentacaoTableBody) {
            reportValesAlimentacaoTableBody.innerHTML = '';
            valesAlimentacao.forEach(vale => { /* ...renderização como antes... */
                const row = reportValesAlimentacaoTableBody.insertRow();
                row.insertCell(0).textContent = vale.nome;
                row.insertCell(1).textContent = formatCurrency(vale.saldo);
                row.insertCell(2).textContent = vale.dataUltimaCarga ? new Date(vale.dataUltimaCarga + "T00:00:00Z").toLocaleDateString('pt-BR', { timeZone: 'UTC' }) : '-';
                });
            }
        }

        export function copyReportToExcel() {
            let csvContent = "FINANBASIC - Relatório Detalhado\n\n";
            const createTableCSV = (title, headers, data, rowFn) => {
                csvContent += `${title}\n`;
                csvContent += headers.join('\t') + '\n';
                data.forEach(item => csvContent += rowFn(item).join('\t') + '\n');
                csvContent += '\n';
            };

            // Usar os dados filtrados se o relatório estiver filtrado, senão todos os dados
            const reportStartDateValue = reportStartDateInput ? reportStartDateInput.value : null;
            const reportEndDateValue = reportEndDateInput ? reportEndDateInput.value : null;
            const reportMesSelecionado = (reportMonthSelect && reportMonthSelect.value !== "") ? parseInt(reportMonthSelect.value) : null;
            const reportAnoSelecionado = (reportYearInput && reportYearInput.value) ? parseInt(reportYearInput.value) : new Date().getFullYear();

            let despesasParaExcel = allDespesas;
            let receitasParaExcel = allReceitas;

            if (reportStartDateValue && reportEndDateValue) {
                const startDate = new Date(reportStartDateValue + "T00:00:00Z");
                const endDate = new Date(reportEndDateValue + "T23:59:59Z");
                despesasParaExcel = allDespesas.filter(d => {
                    const dataDespesa = new Date((d.date || `${reportAnoSelecionado}-${String(reportMesSelecionado !== null ? reportMesSelecionado + 1 : 1).padStart(2,'0')}-${String(d.dueDate || '01').padStart(2,'0')}`) + "T00:00:00Z");
                    return dataDespesa >= startDate && dataDespesa <= endDate;
                });
                receitasParaExcel = allReceitas.filter(r => {
                     const dataReceita = new Date((r.date || `${reportAnoSelecionado}-${String(reportMesSelecionado !== null ? reportMesSelecionado + 1 : 1).padStart(2,'0')}-${String(r.day || '01').padStart(2,'0')}`) + "T00:00:00Z");
                    return dataReceita >= startDate && dataReceita <= endDate;
                });
            } else if (reportMesSelecionado !== null) {
                despesasParaExcel = allDespesas.filter(d => {
                    if (d.expenseNature === 'variavel') {
                        const dataDespesa = new Date(d.date + "T00:00:00Z");
                        return dataDespesa.getUTCMonth() === reportMesSelecionado && dataDespesa.getUTCFullYear() === reportAnoSelecionado;
                    } else {
                        const inicioRecorrencia = new Date(d.startDate + "T00:00:00Z");
                        const dataFiltroFimMes = new Date(Date.UTC(reportAnoSelecionado, reportMesSelecionado + 1, 0));
                        return inicioRecorrencia <= dataFiltroFimMes;
                    }
                });
                 receitasParaExcel = allReceitas.filter(r => {
                    if (r.incomeNature === 'variavel') {
                        const dataReceita = new Date(r.date + "T00:00:00Z");
                        return dataReceita.getUTCMonth() === reportMesSelecionado && dataReceita.getUTCFullYear() === reportAnoSelecionado;
                    } else {
                         const inicioRecorrencia = new Date(r.startDate + "T00:00:00Z");
                        const dataFiltroFimMes = new Date(Date.UTC(reportAnoSelecionado, reportMesSelecionado + 1, 0));
                        return inicioRecorrencia <= dataFiltroFimMes;
                    }
                });
            } else if (reportAnoSelecionado && !reportStartDateValue && !reportEndDateValue && reportMesSelecionado === null) {
                despesasParaExcel = allDespesas.filter(d => new Date((d.date || d.startDate) + "T00:00:00Z").getUTCFullYear() === reportAnoSelecionado);
                receitasParaExcel = allReceitas.filter(r => new Date((r.date || r.startDate) + "T00:00:00Z").getUTCFullYear() === reportAnoSelecionado);
            }


            createTableCSV("Detalhes dos Cartões de Crédito", ["Banco", "Limite Total (R$)", "Limite Usado (R$)", "Disponível (R$)", "Dia Fech.", "Dia Pag."], creditCards, c => [c.bank, c.limit.toFixed(2), c.usedLimit.toFixed(2), (c.limit - c.usedLimit).toFixed(2), c.closingDay || '', c.paymentDay || '']);
            createTableCSV("Detalhes da Reserva Financeira", ["Descrição", "Valor (R$)", "Fonte", "Local"], reserves, r => [r.description, r.value.toFixed(2), r.source || '', r.location || '']);
            createTableCSV("Detalhes das Receitas", ["Data/Dia Rec.", "Tipo", "Descrição", "Valor (R$)", "Forma Rec."], receitasParaExcel, i => {
                let receiptDetail = i.receiptMethod;
                if (i.receiptMethod === 'Reserva Financeira' && i.reserveAccountId) receiptDetail += ` (${reserves.find(r => r.id === i.reserveAccountId)?.description || 'N/A'})`;
                return [
                    i.date ? new Date(i.date + "T00:00:00Z").toLocaleDateString('pt-BR', {timeZone: 'UTC'}) : (i.day || ''),
                    i.incomeNature,
                    i.description,
                    i.value.toFixed(2),
                    receiptDetail
                ];
            });
            createTableCSV("Detalhes das Despesas", ["Data/Venc.", "Tipo", "Categoria", "Descrição", "Valor (R$)", "Pagamento", "Observações"], despesasParaExcel, e => {
                let paymentDetail = e.paymentMethod;
                if (e.paymentMethod === 'Crédito' && e.creditCardId) paymentDetail += ` (${creditCards.find(c => c.id === e.creditCardId)?.bank || 'N/A'})`;
                if (e.paymentMethod === 'Reserva Financeira' && e.reserveAccountId) paymentDetail += ` (${reserves.find(r => r.id === e.reserveAccountId)?.description || 'N/A'})`;
                return [
                    e.date ? new Date(e.date + "T00:00:00Z").toLocaleDateString('pt-BR', {timeZone: 'UTC'}) : (e.dueDate || ''),
                    e.expenseNature,
                    e.category,
                    e.description,
                    e.value.toFixed(2),
                    paymentDetail,
                    e.observations || '-'
                ];
            });
            createTableCSV("Detalhes dos Vales Alimentação", ["Nome", "Saldo Atual (R$)", "Última Carga"], valesAlimentacao, v => [v.nome, v.saldo.toFixed(2), v.dataUltimaCarga ? new Date(v.dataUltimaCarga + "T00:00:00Z").toLocaleDateString('pt-BR', {timeZone: 'UTC'}) : '-']);

            const textarea = document.createElement('textarea');
            textarea.value = csvContent.replace(/\./g, ','); // Ajusta para formato CSV brasileiro (vírgula como decimal)
            document.body.appendChild(textarea);
            textarea.select();
            try {
                document.execCommand('copy');
                showMessageBox('Dados do relatório copiados para a área de transferência! Cole no Excel.');
            } catch (err) {
                showMessageBox('Falha ao copiar. Por favor, copie manualmente o conteúdo da área de texto.');
                console.error('Falha ao copiar dados para Excel: ', err);
                // Não remover o textarea imediatamente em caso de falha para permitir cópia manual
                return;
            }
            document.body.removeChild(textarea);
        }

        export function showSection(targetId) {
            const contentSections = document.querySelectorAll('.content-section');
            const sidebarItems = document.querySelectorAll('.sidebar-item');

            contentSections.forEach(section => section.classList.remove('active'));
            sidebarItems.forEach(item => item.classList.remove('active'));

            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.classList.add('active');
                const correspondingSidebarItem = document.querySelector(`.sidebar-item[data-target="${targetId}"]`);
                if (correspondingSidebarItem) correspondingSidebarItem.classList.add('active');

                if (targetId === 'home-section' && guestModeMessageContainer) {
                    guestModeMessageContainer.classList.toggle('hidden', !isGuestMode);
                } else if (guestModeMessageContainer) {
                    guestModeMessageContainer.classList.add('hidden');
                }

                if (targetId === 'user-profile-section') {
                    populateUserProfile(); // Chama a função de popular perfil do auth.js
                }

                // Lógica para títulos animados e visibilidade do título principal
                const activeH2 = targetSection.querySelector('h2');
                if (mainAppTitle) {
                    const isHomeOrSummary = targetId === 'home-section' || targetId === 'general-summary-section';
                    mainAppTitle.style.display = isHomeOrSummary ? 'block' : 'none';
                    if (isHomeOrSummary) {
                        mainAppTitle.classList.remove('animated-title');
                        void mainAppTitle.offsetWidth; // Trigger reflow
                        mainAppTitle.classList.add('animated-title');
                        if (activeH2 && activeH2 !== mainAppTitle) activeH2.classList.remove('animated-title');
                    } else if (activeH2) {
                        activeH2.classList.remove('animated-title');
                        void activeH2.offsetWidth; // Trigger reflow
                        activeH2.classList.add('animated-title');
                    }
                }
                // Esconder detalhes de transações de cartão se não estiver na seção de cartões
                if (targetId !== 'credit-cards-section' && creditCardTransactionsContainer) {
                    creditCardTransactionsContainer.classList.add('hidden');
                }

                // Se a seção de "Transações Unificadas" (despesas ou receitas) for ativada, decida qual renderizar
                if (targetId === 'unified-transactions-section') { // Supondo que você tenha um ID para a seção unificada
                    // Aqui você pode ter abas ou botões para alternar entre renderUnifiedDespesas e renderUnifiedReceitas
                    // Por padrão, pode mostrar despesas:
                    renderUnifiedDespesas();
                }


            } else {
                console.warn(`Target section with ID "${targetId}" not found.`);
            }
        }
      