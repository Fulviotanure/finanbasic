import { formatCurrency, showMessageBox } from './config.js';
import { getState, subscribe } from './state.js'; // Importa do novo state.js
import { isGuestMode, populateUserProfile } from './auth.js';
import { removeCreditCard, removeReserve, removeUnifiedDespesa, removeUnifiedReceita, removeValeAlimentacao } from './data.js'; // Mantenha por enquanto

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
export let copyToExcelBtn, closeReportModalBtn;
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

export function renderAllData(currentState) {
    console.log("UI: renderAllData chamada com estado:", currentState);
    if (!currentState) {
        console.warn("UI: renderAllData chamada sem estado válido.");
        return;
    }
    renderCreditCards(currentState.creditCards);
    renderReserves(currentState.reserves);

    // Lógica para renderizar despesas ou receitas na tabela unificada
    // com base na seção ativa (ou outro critério que você definir)
    const despesasTabActive = despesasSection && despesasSection.classList.contains('active');
    const receitasTabActive = receitasSection && receitasSection.classList.contains('active');

    if (tabelaDespesasUnificada) { // Assumindo que este é o ID da tabela unificada
        if (despesasTabActive) {
            renderUnifiedDespesas(currentState.allDespesas);
        } else if (receitasTabActive) {
            renderUnifiedReceitas(currentState.allReceitas); // Renderiza receitas na mesma tabela
        } else {
            // Se nenhuma aba específica de transação estiver ativa, você pode limpar a tabela
            // ou mostrar um estado padrão.
             tabelaDespesasUnificada.innerHTML = '<tr><td colspan="9" class="text-center text-gray-500 py-4">Selecione Despesas ou Receitas para visualizar.</td></tr>';
        }
    }


    renderValesAlimentacao(currentState.valesAlimentacao);
    updateGeneralSummaryDisplay(currentState);
    updateCreditCardDropdowns(currentState.creditCards);
    updateReserveAccountDropdowns(currentState.reserves);
}


export function renderCreditCards(cardsToRender = []) { // Recebe os dados como argumento
    if (!creditCardTableBody) return;
    creditCardTableBody.innerHTML = '';
    if (!cardsToRender || cardsToRender.length === 0) {
        creditCardTableBody.innerHTML = '<tr><td colspan="7" class="text-center text-gray-500 py-4">Nenhum cartão de crédito adicionado.</td></tr>';
        return;
    }
    cardsToRender.forEach(card => {
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
        deleteBtn.onclick = async (e) => {
            e.stopPropagation();
            // A função removeCreditCard em data.js agora lida com a lógica de estado
            await removeCreditCard(card.id, getState());
        };
        actionsCell.appendChild(deleteBtn);
        row.onclick = () => displayCardTransactions(card.id, getState().allDespesas, getState().allReceitas, getState().creditCards);
    });
}

export function displayCardTransactions(cardId, allDespesasData, allReceitasData, creditCardsData) { // Recebe dados do estado
    const card = creditCardsData.find(c => c.id === cardId);
    if (!card || !creditCardTransactionsTableBody || !creditCardTransactionsContainer || !selectedCardNameSpan || !selectedCardAvailableLimitSpan) return;
    selectedCardNameSpan.textContent = card.bank;
    creditCardTransactionsTableBody.innerHTML = '';
    const cardTransactions = [
        ...allDespesasData.filter(d => d.creditCardId === cardId && d.paymentMethod === 'Crédito').map(d => ({ ...d, type: 'Despesa', dateSort: new Date(d.date || `2000-01-${d.dueDate || '01'}T00:00:00Z`) })),
        ...allReceitasData.filter(i => i.creditCardId === cardId && i.receiptMethod === 'Cartão de Crédito').map(i => ({ ...i, type: 'Pagamento Fatura', dateSort: new Date(i.date || `2000-01-${i.day || '01'}T00:00:00Z`) }))
    ].sort((a, b) => b.dateSort - a.dateSort);

    if (cardTransactions.length === 0) {
        creditCardTransactionsTableBody.innerHTML = '<tr><td colspan="4" class="text-center text-gray-500 py-4">Nenhuma transação para este cartão.</td></tr>';
    } else {
        cardTransactions.forEach(transaction => {
            const row = creditCardTransactionsTableBody.insertRow();
            row.insertCell(0).textContent = transaction.date ? new Date(transaction.date + "T00:00:00Z").toLocaleDateString('pt-BR', {timeZone: 'UTC'}) : `Dia ${transaction.dueDate || transaction.day}`;
            row.insertCell(1).textContent = transaction.description;
            row.insertCell(2).textContent = transaction.type;
            const valueCell = row.insertCell(3);
            valueCell.textContent = formatCurrency(transaction.value);
            valueCell.classList.add(transaction.type === 'Despesa' ? 'text-red-600' : 'text-green-600');
        });
    }
    selectedCardAvailableLimitSpan.textContent = formatCurrency(card.limit - card.usedLimit);
    if(creditCardTransactionsContainer) creditCardTransactionsContainer.classList.remove('hidden');
}

export function renderReserves(reservesToRender = []) {
    if (!reserveTableBody || !totalReserveValueSpan) return;
    reserveTableBody.innerHTML = '';
    let totalReserve = 0;
    if (!reservesToRender || reservesToRender.length === 0) {
        reserveTableBody.innerHTML = '<tr><td colspan="5" class="text-center text-gray-500 py-4">Nenhuma reserva financeira adicionada.</td></tr>';
        totalReserveValueSpan.textContent = formatCurrency(0);
        return;
    }
    reservesToRender.forEach(reserve => {
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
        deleteBtn.onclick = async () => {
            await removeReserve(reserve.id, getState());
        };
        actionsCell.appendChild(deleteBtn);
    });
    totalReserveValueSpan.textContent = formatCurrency(totalReserve);
}

export function renderUnifiedDespesas(despesasParaRenderizar = []) {
    const tabelaElem = document.getElementById('tabelaDespesasUnificada');
    if (!tabelaElem) { console.warn("Elemento tabelaDespesasUnificada não encontrado."); return; }
    tabelaElem.innerHTML = '';
    if (!despesasParaRenderizar || despesasParaRenderizar.length === 0) {
        tabelaElem.innerHTML = '<tr><td colspan="9" class="text-center text-gray-500 py-4">Nenhuma despesa registrada.</td></tr>';
        return;
    }
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

        // Coluna 0: Data (Variável) ou Dia Vencimento (Fixa)
        row.insertCell(0).textContent = despesa.date ? new Date(despesa.date + "T00:00:00Z").toLocaleDateString('pt-BR', { timeZone: 'UTC' }) : (despesa.dueDate ? `Todo dia ${despesa.dueDate}` : '-');

        // Coluna 1: Próximo Vencimento (para Fixas)
        const proxVencCell = row.insertCell(1);
        if (despesa.expenseNature === 'fixa' && despesa.dueDate && despesa.startDate) {
            const hoje = new Date(); 
            hoje.setUTCHours(0, 0, 0, 0); // Normaliza para início do dia UTC
            const inicioRecorrencia = new Date(despesa.startDate + "T00:00:00Z"); 
            inicioRecorrencia.setUTCHours(0, 0, 0, 0); // Normaliza para início do dia UTC

            let proxMes = hoje.getUTCMonth();
            let proxAno = hoje.getUTCFullYear();

            if (hoje.getUTCDate() > despesa.dueDate) {
                proxMes++;
                if (proxMes > 11) { 
                    proxMes = 0; 
                    proxAno++; 
                }
            }
            let proxVencData = new Date(Date.UTC(proxAno, proxMes, despesa.dueDate));
            proxVencData.setUTCHours(0,0,0,0); // Garante que é início do dia

            while (proxVencData < inicioRecorrencia) {
                proxVencData.setUTCMonth(proxVencData.getUTCMonth() + 1);
            }
            proxVencCell.textContent = proxVencData.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
        } else {
            proxVencCell.textContent = '-';
        }

        // Coluna 2: Tipo (Fixa/Variável)
        row.insertCell(2).textContent = despesa.expenseNature === 'fixa' ? 'Fixa' : 'Variável';
        // Coluna 3: Categoria
        row.insertCell(3).textContent = despesa.category || '-';
        // Coluna 4: Descrição
        row.insertCell(4).textContent = despesa.description;
        // Coluna 5: Valor
        row.insertCell(5).textContent = formatCurrency(despesa.value);
        // Coluna 6: Pagamento
        let paymentDetail = despesa.paymentMethod;
        if (despesa.paymentMethod === 'Crédito' && despesa.creditCardId) {
            const currentState = getState(); // Pega o estado atual para encontrar o cartão
            const card = currentState.creditCards.find(c => c.id === despesa.creditCardId);
            paymentDetail += ` (${card ? card.bank : 'Cartão Removido'})`;
        } else if (despesa.paymentMethod === 'Reserva Financeira' && despesa.reserveAccountId) {
            const currentState = getState(); // Pega o estado atual para encontrar a reserva
            const res = currentState.reserves.find(r => r.id === despesa.reserveAccountId);
            paymentDetail += ` (${res ? res.description : 'Reserva Removida'})`;
        }
        row.insertCell(6).textContent = paymentDetail;
        // Coluna 7: Observações
        row.insertCell(7).textContent = despesa.observations || '-';
        // Coluna 8: Ações
        const actionsCell = row.insertCell(8);
        const deleteBtn = document.createElement('button');
        deleteBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" /></svg>';
        deleteBtn.title = "Remover Despesa";
        deleteBtn.className = 'text-red-500 hover:text-red-700 font-bold py-1 px-2 rounded-md text-xs';
        deleteBtn.onclick = async () => {
            await removeUnifiedDespesa(despesa.id); // Função de data.js
        };
        actionsCell.appendChild(deleteBtn);
    });
}
    
        export function renderUnifiedReceitas(receitasParaRenderizar = []) { // Recebe dados como argumento
            const tabelaElem = document.getElementById('tabelaReceitasUnificada') || document.getElementById('tabelaDespesasUnificada');
            if (!tabelaElem) {
                console.warn("Elemento de tabela para receitas não encontrado.");
                return;
            }
            tabelaElem.innerHTML = '';
            if (!receitasParaRenderizar || receitasParaRenderizar.length === 0) {
                tabelaElem.innerHTML = '<tr><td colspan="7" class="text-center text-gray-500 py-4">Nenhuma receita registrada.</td></tr>'; // Ajuste colspan se necessário
                return;
            }
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
                    const hoje = new Date(); hoje.setUTCHours(0, 0, 0, 0);
                    const inicioRecorrencia = new Date(receita.startDate + "T00:00:00Z"); inicioRecorrencia.setUTCHours(0, 0, 0, 0);
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
                    const currentState = getState(); // Precisa do estado atual para encontrar a reserva
                    const reserve = currentState.reserves.find(r => r.id === receita.reserveAccountId);
                    receiptDetail += ` (${reserve ? reserve.description : 'Reserva Removida'})`;
                }
                row.insertCell(5).textContent = receiptDetail;
                const actionsCell = row.insertCell(6);
                const deleteBtn = document.createElement('button');
                deleteBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" /></svg>';
                deleteBtn.title = "Remover Receita";
                deleteBtn.className = 'text-red-500 hover:text-red-700 font-bold py-1 px-2 rounded-md text-xs';
                deleteBtn.onclick = async () => {
                    await removeUnifiedReceita(receita.id);
                };
                actionsCell.appendChild(deleteBtn);
            });
        }
    
        export function renderValesAlimentacao(valesToRender = []) {
            if (!tabelaValesAlimentacao) return;
            tabelaValesAlimentacao.innerHTML = '';
            if (!valesToRender || valesToRender.length === 0) {
                tabelaValesAlimentacao.innerHTML = '<tr><td colspan="4" class="text-center text-gray-500 py-4">Nenhum vale alimentação adicionado.</td></tr>';
                return;
            }
            valesToRender.forEach((vale) => {
                const row = tabelaValesAlimentacao.insertRow();
                row.insertCell(0).textContent = vale.nome;
                row.insertCell(1).textContent = formatCurrency(vale.saldo);
                row.insertCell(2).textContent = vale.dataUltimaCarga ? new Date(vale.dataUltimaCarga + "T00:00:00Z").toLocaleDateString('pt-BR', { timeZone: 'UTC' }) : '-';
                const actionsCell = row.insertCell(3);
                const deleteBtn = document.createElement('button');
                deleteBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" /></svg>';
                deleteBtn.title = "Remover Vale";
                deleteBtn.className = 'text-red-500 hover:text-red-700 font-bold py-1 px-2 rounded-md text-xs';
                deleteBtn.onclick = async () => {
                    await removeValeAlimentacao(vale.id);
                };
                actionsCell.appendChild(deleteBtn);
            });
        }
    
        export function updateCreditCardDropdowns(cardsData = []) {
            const dropdowns = [despesaVariavelCartaoSelect, despesaFixaCartaoSelect];
            dropdowns.forEach(dropdown => {
                if (dropdown) {
                    const currentVal = dropdown.value;
                    dropdown.innerHTML = '<option value="">Selecione um cartão</option>';
                    cardsData.forEach(card => {
                        const opt = document.createElement('option');
                        opt.value = card.id;
                        opt.textContent = `${card.bank} (Disp: ${formatCurrency(card.limit - card.usedLimit)})`;
                        dropdown.appendChild(opt);
                    });
                    if (cardsData.find(c => c.id === currentVal)) dropdown.value = currentVal;
                    else dropdown.value = "";
                }
            });
        }
    
        export function updateReserveAccountDropdowns(reservesData = []) {
            const dropdowns = [despesaVariavelReservaSelect, despesaFixaReservaSelect, receitaVariavelReservaSelect, receitaFixaReservaSelect];
            dropdowns.forEach(dropdown => {
                if (dropdown) {
                    const currentVal = dropdown.value;
                    dropdown.innerHTML = '<option value="">Selecione uma reserva</option>';
                    reservesData.forEach(reserve => {
                        const opt = document.createElement('option');
                        opt.value = reserve.id;
                        opt.textContent = `${reserve.description} (Saldo: ${formatCurrency(reserve.value)})`;
                        dropdown.appendChild(opt);
                    });
                    if (reservesData.find(r => r.id === currentVal)) dropdown.value = currentVal;
                    else dropdown.value = "";
                }
            });
        }
    
        export function updateGeneralSummaryDisplay(currentState) {
            if (!currentState) return; // Proteção contra estado indefinido
    
            const { allReceitas, allDespesas, creditCards, reserves } = currentState;
    
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
            const totalAPagarCartoes = limiteUsadoCartoes;
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
            if (summaryCardDueEl) summaryCardDueEl.textContent = formatCurrency(totalAPagarCartoes);
            if (summaryTotalReserveEl) summaryTotalReserveEl.textContent = formatCurrency(valorTotalReserva);
            if (totalValueSpan) { totalValueSpan.textContent = formatCurrency(balancoGeral); totalValueSpan.className = `text-xl sm:text-2xl font-bold ${balancoGeral >= 0 ? 'text-green-700' : 'text-red-700'}`; }
        }
    
        export function populateDateFilters() {
            if (reportMonthSelect) {
                reportMonthSelect.innerHTML = '<option value="">Mês (Todos)</option>';
                const meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
                meses.forEach((mes, index) => {
                    const option = document.createElement('option');
                    option.value = index;
                    option.textContent = mes;
                    reportMonthSelect.appendChild(option);
                });
            }
            if (reportYearInput) {
                reportYearInput.value = new Date().getFullYear();
                reportYearInput.max = new Date().getFullYear() + 5;
                reportYearInput.min = new Date().getFullYear() - 10;
            }
        }
    
        export function generateReport(isFiltered = false, currentState) {
            if (!currentState) {
                console.warn("generateReport chamado sem currentState.");
                return; // Ou pegar o estado com getState() se preferir
            }
            let despesasFiltradas = [...currentState.allDespesas];
            let receitasFiltradas = [...currentState.allReceitas];
    
            if (isFiltered) {
                const startDateValue = reportStartDateInput ? reportStartDateInput.value : null;
                const endDateValue = reportEndDateInput ? reportEndDateInput.value : null;
                const mesSelecionado = (reportMonthSelect && reportMonthSelect.value !== "") ? parseInt(reportMonthSelect.value) : null;
                const anoSelecionado = (reportYearInput && reportYearInput.value) ? parseInt(reportYearInput.value) : new Date().getFullYear();
    
                if (startDateValue && endDateValue) {
                    const startDate = new Date(startDateValue + "T00:00:00Z");
                    const endDate = new Date(endDateValue + "T23:59:59Z");
                    despesasFiltradas = despesasFiltradas.filter(d => {
                        const dataDespesa = new Date((d.date || `${anoSelecionado}-${String(mesSelecionado !== null ? mesSelecionado + 1 : 1).padStart(2,'0')}-${String(d.dueDate || '01').padStart(2,'0')}`) + "T00:00:00Z");
                        return dataDespesa >= startDate && dataDespesa <= endDate;
                    });
                    receitasFiltradas = receitasFiltradas.filter(r => {
                        const dataReceita = new Date((r.date || `${anoSelecionado}-${String(mesSelecionado !== null ? mesSelecionado + 1 : 1).padStart(2,'0')}-${String(r.day || '01').padStart(2,'0')}`) + "T00:00:00Z");
                        return dataReceita >= startDate && dataReceita <= endDate;
                    });
                } else if (mesSelecionado !== null) {
                    despesasFiltradas = despesasFiltradas.filter(d => { /* ... (lógica de filtro por mês/ano como antes) ... */
                        if (d.expenseNature === 'variavel') {
                            const dataDespesa = new Date(d.date + "T00:00:00Z");
                            return dataDespesa.getUTCMonth() === mesSelecionado && dataDespesa.getUTCFullYear() === anoSelecionado;
                        } else {
                            const inicioRecorrencia = new Date(d.startDate + "T00:00:00Z");
                            const dataFiltroFimMes = new Date(Date.UTC(anoSelecionado, mesSelecionado + 1, 0));
                            return inicioRecorrencia <= dataFiltroFimMes;
                        }
                    });
                    receitasFiltradas = receitasFiltradas.filter(r => { /* ... (lógica de filtro por mês/ano como antes) ... */
                        if (r.incomeNature === 'variavel') {
                            const dataReceita = new Date(r.date + "T00:00:00Z");
                            return dataReceita.getUTCMonth() === mesSelecionado && dataReceita.getUTCFullYear() === anoSelecionado;
                        } else {
                             const inicioRecorrencia = new Date(r.startDate + "T00:00:00Z");
                            const dataFiltroFimMes = new Date(Date.UTC(anoSelecionado, mesSelecionado + 1, 0));
                            return inicioRecorrencia <= dataFiltroFimMes;
                        }
                    });
                } else if (anoSelecionado && !startDateValue && !endDateValue && mesSelecionado === null) {
                    despesasFiltradas = despesasFiltradas.filter(d => new Date((d.date || d.startDate) + "T00:00:00Z").getUTCFullYear() === anoSelecionado);
                    receitasFiltradas = receitasFiltradas.filter(r => new Date((r.date || r.startDate) + "T00:00:00Z").getUTCFullYear() === anoSelecionado);
                }
            }
    
            const reportCreditCardTableBody = document.getElementById('reportCreditCardTableBody');
            if (reportCreditCardTableBody) {
                reportCreditCardTableBody.innerHTML = '';
                currentState.creditCards.forEach(card => { /* ... (renderização como antes, usando currentState.creditCards) ... */
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
                currentState.reserves.forEach(reserve => { /* ... (renderização como antes, usando currentState.reserves) ... */
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
                receitasFiltradas.forEach(item => { /* ... (renderização como antes, usando receitasFiltradas) ... */
                    const row = reportAllReceitasTableBody.insertRow();
                    row.insertCell(0).textContent = item.date ? new Date(item.date + "T00:00:00Z").toLocaleDateString('pt-BR', {timeZone: 'UTC'}) : (item.day ? `Dia ${item.day}`: '-');
                    row.insertCell(1).textContent = item.incomeNature === 'fixa' ? 'Fixa' : 'Variável';
                    row.insertCell(2).textContent = item.description;
                    row.insertCell(3).textContent = formatCurrency(item.value);
                    let receiptDetailText = item.receiptMethod;
                    if (item.receiptMethod === 'Reserva Financeira' && item.reserveAccountId) {
                        const reserve = currentState.reserves.find(r => r.id === item.reserveAccountId);
                        receiptDetailText += ` (${reserve ? reserve.description : 'Reserva Removida'})`;
                    }
                    row.insertCell(4).textContent = receiptDetailText;
                });
            }
            const reportAllDespesasTableBody = document.getElementById('reportAllDespesasTableBody');
            if (reportAllDespesasTableBody) {
                reportAllDespesasTableBody.innerHTML = '';
                despesasFiltradas.forEach(item => { /* ... (renderização como antes, usando despesasFiltradas) ... */
                    const row = reportAllDespesasTableBody.insertRow();
                    row.insertCell(0).textContent = item.date ? new Date(item.date + "T00:00:00Z").toLocaleDateString('pt-BR', {timeZone: 'UTC'}) : (item.dueDate ? `Dia ${item.dueDate}`: '-');
                    row.insertCell(1).textContent = item.expenseNature === 'fixa' ? 'Fixa' : 'Variável';
                    row.insertCell(2).textContent = item.category;
                    row.insertCell(3).textContent = item.description;
                    row.insertCell(4).textContent = formatCurrency(item.value);
                    let paymentDetailText = item.paymentMethod;
                    if (item.paymentMethod === 'Crédito' && item.creditCardId) {
                        const card = currentState.creditCards.find(c => c.id === item.creditCardId);
                        paymentDetailText += ` (${card ? card.bank : 'Cartão Removido'})`;
                    } else if (item.paymentMethod === 'Reserva Financeira' && item.reserveAccountId) {
                        const reserve = currentState.reserves.find(r => r.id === item.reserveAccountId);
                        paymentDetailText += ` (${reserve ? reserve.description : 'Reserva Removida'})`;
                    }
                    row.insertCell(5).textContent = paymentDetailText;
                    row.insertCell(6).textContent = item.observations || '-';
                });
            }
            const reportValesAlimentacaoTableBody = document.getElementById('reportValesAlimentacaoTableBody');
            if (reportValesAlimentacaoTableBody) {
                reportValesAlimentacaoTableBody.innerHTML = '';
                currentState.valesAlimentacao.forEach(vale => { /* ... (renderização como antes, usando currentState.valesAlimentacao) ... */
                    const row = reportValesAlimentacaoTableBody.insertRow();
                    row.insertCell(0).textContent = vale.nome;
                    row.insertCell(1).textContent = formatCurrency(vale.saldo);
                    row.insertCell(2).textContent = vale.dataUltimaCarga ? new Date(vale.dataUltimaCarga + "T00:00:00Z").toLocaleDateString('pt-BR', { timeZone: 'UTC' }) : '-';
                });
            }
            // Mostrar o modal do relatório
            const reportModal = document.getElementById('detailedReportModal');
            if (reportModal) reportModal.classList.remove('hidden');
        }
    
        export function copyReportToExcel(currentState) {
            if (!currentState) {
                console.warn("copyReportToExcel chamado sem currentState.");
                return;
            }
            let csvContent = "FINANBASIC - Relatório Detalhado\n\n";
            const createTableCSV = (title, headers, data, rowFn) => { /* ... (como antes) ... */
                csvContent += `${title}\n`;
                csvContent += headers.join('\t') + '\n';
                data.forEach(item => csvContent += rowFn(item).join('\t') + '\n');
                csvContent += '\n';
            };
    
            // A lógica de filtragem para Excel deve ser similar à de generateReport
            // ou você pode simplesmente usar os dados já filtrados se generateReport
            // armazenar despesasFiltradas e receitasFiltradas em algum lugar acessível
            // ou, mais simples, passar os dados filtrados para esta função se ela for chamada após generateReport.
            // Por ora, usaremos os dados do estado global, mas o ideal seria usar os dados filtrados do relatório.
            const { allDespesas, allReceitas, creditCards, reserves, valesAlimentacao } = currentState;
    
            createTableCSV("Detalhes dos Cartões de Crédito", ["Banco", "Limite Total (R$)", "Limite Usado (R$)", "Disponível (R$)", "Dia Fech.", "Dia Pag."], creditCards, c => [c.bank, c.limit.toFixed(2), c.usedLimit.toFixed(2), (c.limit - c.usedLimit).toFixed(2), c.closingDay || '', c.paymentDay || '']);
            createTableCSV("Detalhes da Reserva Financeira", ["Descrição", "Valor (R$)", "Fonte", "Local"], reserves, r => [r.description, r.value.toFixed(2), r.source || '', r.location || '']);
            createTableCSV("Detalhes das Receitas", ["Data/Dia Rec.", "Tipo", "Descrição", "Valor (R$)", "Forma Rec."], allReceitas, i => {
                let receiptDetail = i.receiptMethod;
                if (i.receiptMethod === 'Reserva Financeira' && i.reserveAccountId) receiptDetail += ` (${reserves.find(r => r.id === i.reserveAccountId)?.description || 'N/A'})`;
                return [i.date ? new Date(i.date + "T00:00:00Z").toLocaleDateString('pt-BR', {timeZone: 'UTC'}) : (i.day || ''), i.incomeNature, i.description, i.value.toFixed(2), receiptDetail];
            });
            createTableCSV("Detalhes das Despesas", ["Data/Venc.", "Tipo", "Categoria", "Descrição", "Valor (R$)", "Pagamento", "Observações"], allDespesas, e => {
                let paymentDetail = e.paymentMethod;
                if (e.paymentMethod === 'Crédito' && e.creditCardId) paymentDetail += ` (${creditCards.find(c => c.id === e.creditCardId)?.bank || 'N/A'})`;
                if (e.paymentMethod === 'Reserva Financeira' && e.reserveAccountId) paymentDetail += ` (${reserves.find(r => r.id === e.reserveAccountId)?.description || 'N/A'})`;
                return [e.date ? new Date(e.date + "T00:00:00Z").toLocaleDateString('pt-BR', {timeZone: 'UTC'}) : (e.dueDate || ''), e.expenseNature, e.category, e.description, e.value.toFixed(2), paymentDetail, e.observations || '-'];
            });
            createTableCSV("Detalhes dos Vales Alimentação", ["Nome", "Saldo Atual (R$)", "Última Carga"], valesAlimentacao, v => [v.nome, v.saldo.toFixed(2), v.dataUltimaCarga ? new Date(v.dataUltimaCarga + "T00:00:00Z").toLocaleDateString('pt-BR', {timeZone: 'UTC'}) : '-']);
    
            const textarea = document.createElement('textarea');
            textarea.value = csvContent.replace(/\./g, ',');
            document.body.appendChild(textarea);
            textarea.select();
            try {
                document.execCommand('copy');
                showMessageBox('Dados do relatório copiados! Cole no Excel.');
            } catch (err) {
                showMessageBox('Falha ao copiar. Copie manualmente.');
                console.error('Falha ao copiar dados para Excel: ', err);
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
                    guestModeMessageContainer.classList.toggle('hidden', !isGuestMode); // isGuestMode é de auth.js
                } else if (guestModeMessageContainer) {
                    guestModeMessageContainer.classList.add('hidden');
                }
    
// ui.js
// ... (código anterior até a linha 751 da função showSection) ...

                if (targetId === 'user-profile-section') { // Linha 752
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

                // Lógica para renderizar a tabela correta na seção de transações unificadas
                // (Assumindo que 'tabelaDespesasUnificada' e 'tabelaReceitasUnificada' podem ser o mesmo elemento
                //  ou você tem seções separadas com IDs 'despesas-section' e 'receitas-section')
                if (targetId === 'despesas-section' || targetId === 'unified-transactions-section') { // Adicionei unified-transactions-section como exemplo
                    const currentState = getState();
                    renderUnifiedDespesas(currentState.allDespesas);
                } else if (targetId === 'receitas-section') {
                    const currentState = getState();
                    renderUnifiedReceitas(currentState.allReceitas);
                }


            } else {
                console.warn(`Target section with ID "${targetId}" not found.`);
            }
        }