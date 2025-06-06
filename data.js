import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { db, generateUniqueId, appIdFromGlobal, showMessageBox } from './config.js';
import { isGuestMode, currentUserId } from './auth.js';
import {
    renderAllData,
    renderCreditCards,
    renderReserves,
    renderUnifiedDespesas,
    renderUnifiedReceitas,
    renderValesAlimentacao,
    updateGeneralSummaryDisplay,
    generateReport,
    // Elementos de formulário para limpar após adicionar
    despesaVariavelData, despesaVariavelCategoria, despesaVariavelDescricao, despesaVariavelValor, despesaVariavelPagamento, despesaVariavelCartaoSelect, despesaVariavelReservaSelect, despesaVariavelObs, despesaVariavelCartaoContainer, despesaVariavelReservaContainer,
    despesaFixaStartDateInput, despesaFixaVencimento, despesaFixaCategoria, despesaFixaDescricao, despesaFixaValor, despesaFixaPagamento, despesaFixaCartaoSelect, despesaFixaReservaSelect, despesaFixaObs, despesaFixaCartaoContainer, despesaFixaReservaContainer,
    receitaVariavelData, receitaVariavelDescricao, receitaVariavelValor, receitaVariavelForma, receitaVariavelReservaSelect, receitaVariavelReservaContainer,
    receitaFixaStartDateInput, receitaFixaDescricao, receitaFixaValor, receitaFixaDia, receitaFixaForma, receitaFixaReservaSelect, receitaFixaReservaContainer,
    valeNomeInput, valeSaldoInicialInput, valeDataCargaInput
} from './ui.js';

// --- Global Data Arrays ---
export let allDespesas = [];
export let allReceitas = [];
export let creditCards = [];
export let reserves = [];
export let valesAlimentacao = [];

export function clearLocalData() {
    allDespesas = [];
    allReceitas = [];
    creditCards = [];
    reserves = [];
    valesAlimentacao = [];
}

export async function saveDataToFirestore() {
    if (isGuestMode || !currentUserId || currentUserId.startsWith('guest-')) {
        console.log("Modo convidado ou usuário inválido, dados não salvos no Firestore.");
        return;
    }
    const userDocRef = doc(db, 'artifacts', appIdFromGlobal, 'users', currentUserId, 'finanbasicData', 'userData');
    try {
        await setDoc(userDocRef, {
            allDespesas: allDespesas,
            allReceitas: allReceitas,
            creditCards: creditCards,
            reserves: reserves,
            valesAlimentacao: valesAlimentacao,
            lastUpdated: new Date().toISOString()
        });
        console.log("Dados guardados no Firestore para o usuário:", currentUserId);
    } catch (error) {
        console.error("Erro ao guardar dados:", error);
        showMessageBox("Erro ao guardar dados.");
    }
}

export async function loadDataFromFirestore(userId) {
    if (isGuestMode || !userId || userId.startsWith('guest-')) {
        console.log("Modo convidado ou ID de usuário inválido para carregar dados. Limpando dados locais.");
        clearLocalData();
        renderAllData();
        return;
    }
    const userDocRef = doc(db, 'artifacts', appIdFromGlobal, 'users', userId, 'finanbasicData', 'userData');
    try {
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
            const data = docSnap.data();
            allDespesas = data.allDespesas || [];
            allReceitas = data.allReceitas || [];
            // Migração de dados antigos (se necessário)
            if (!data.allDespesas && (data.expenses || data.fixedExpenses)) {
                console.log("Migrando despesas antigas...");
                const oldVarExpenses = (data.expenses || []).map(e => ({ ...e, expenseNature: 'variavel', id: e.id || generateUniqueId() }));
                const oldFixExpenses = (data.fixedExpenses || []).map(e => ({ ...e, expenseNature: 'fixa', id: e.id || generateUniqueId() }));
                allDespesas = [...oldFixExpenses, ...oldVarExpenses];
            }
            if (!data.allReceitas && (data.income || data.fixedIncome)) {
                console.log("Migrando receitas antigas...");
                const oldVarIncome = (data.income || []).map(i => ({ ...i, incomeNature: 'variavel', id: i.id || generateUniqueId() }));
                const oldFixIncome = (data.fixedIncome || []).map(i => ({ ...i, incomeNature: 'fixa', id: i.id || generateUniqueId() }));
                allReceitas = [...oldFixIncome, ...oldVarIncome];
            }
            creditCards = data.creditCards || [];
            reserves = data.reserves || [];
            valesAlimentacao = data.valesAlimentacao || [];
            console.log("Dados carregados do Firestore para o usuário:", userId);
        } else {
            console.log("Nenhum dado encontrado no Firestore para o usuário, usando arrays vazios:", userId);
            clearLocalData();
        }
    } catch (error) {
        console.error("Erro ao carregar dados:", error);
        showMessageBox("Erro ao carregar os dados do usuário.");
        clearLocalData();
    }
    renderAllData();
}

// --- CRUD Functions ---

// Credit Cards
export async function addCreditCard() {
    const bankInput = document.getElementById('creditCardBank');
    const limitInput = document.getElementById('creditCardLimit');
    const spentInput = document.getElementById('creditCardSpent');
    const closingDayInput = document.getElementById('creditCardClosingDay');
    const paymentDayInput = document.getElementById('creditCardPaymentDay');

    if (!bankInput || !limitInput || !spentInput || !closingDayInput || !paymentDayInput) {
        console.error("Elementos do formulário de cartão de crédito não encontrados."); return;
    }
    const bank = bankInput.value;
    const limit = parseFloat(limitInput.value);
    const usedLimit = parseFloat(spentInput.value || 0);
    const closingDay = closingDayInput.value ? parseInt(closingDayInput.value) : null;
    const paymentDay = paymentDayInput.value ? parseInt(paymentDayInput.value) : null;

    if (!bank || isNaN(limit)) {
        showMessageBox('Preencha Banco e Limite Total do cartão.'); return;
    }
    if ((closingDay && (isNaN(closingDay) || closingDay < 1 || closingDay > 31)) ||
        (paymentDay && (isNaN(paymentDay) || paymentDay < 1 || paymentDay > 31))) {
        showMessageBox('Dia de Fechamento e Pagamento devem ser números válidos (1-31) ou deixados em branco.'); return;
    }
    const newCard = { id: generateUniqueId(), bank, limit, usedLimit, closingDay, paymentDay };
    creditCards.push(newCard);
    await saveDataToFirestore();
    renderCreditCards();
    updateGeneralSummaryDisplay();
    generateReport();
    showMessageBox('Cartão de crédito adicionado!');
    bankInput.value = ''; limitInput.value = ''; spentInput.value = ''; closingDayInput.value = ''; paymentDayInput.value = '';
}

export async function removeCreditCard(cardIdToRemove) {
    const cardIndex = creditCards.findIndex(card => card.id === cardIdToRemove);
    if (cardIndex === -1) { console.warn("Cartão não encontrado para remoção:", cardIdToRemove); return; }
    const isCardUsed = allDespesas.some(d => d.creditCardId === cardIdToRemove && d.paymentMethod === 'Crédito');
    if (isCardUsed) {
        showMessageBox('Este cartão está associado a despesas e não pode ser removido. Remova ou altere as despesas primeiro.'); return;
    }
    creditCards.splice(cardIndex, 1);
    await saveDataToFirestore();
    renderCreditCards();
    updateGeneralSummaryDisplay();
    generateReport();
    showMessageBox('Cartão de crédito removido!');
}

// Reserves
export async function addReserve() {
    const descriptionInput = document.getElementById('reserveDescription');
    const valueInput = document.getElementById('reserveValue');
    const sourceInput = document.getElementById('reserveSource');
    const locationInput = document.getElementById('reserveLocation');

    if (!descriptionInput || !valueInput || !sourceInput || !locationInput) { console.error("Elementos do formulário de reserva não encontrados."); return; }
    const description = descriptionInput.value;
    const value = parseFloat(valueInput.value);
    const source = sourceInput.value;
    const location = locationInput.value;

    if (!description || isNaN(value) || value <= 0) {
        showMessageBox('Preencha Descrição e um Valor válido para a reserva.'); return;
    }
    const newReserve = { id: generateUniqueId(), description, value, source, location };
    reserves.push(newReserve);
    await saveDataToFirestore();
    renderReserves();
    updateGeneralSummaryDisplay();
    generateReport();
    showMessageBox('Reserva financeira adicionada!');
    descriptionInput.value = ''; valueInput.value = ''; sourceInput.value = ''; locationInput.value = '';
}

export async function removeReserve(reserveIdToRemove) {
    const reserveIndex = reserves.findIndex(r => r.id === reserveIdToRemove);
    if (reserveIndex === -1) { console.warn("Reserva não encontrada:", reserveIdToRemove); return; }
    const isReserveUsedInDespesas = allDespesas.some(d => d.reserveAccountId === reserveIdToRemove && d.paymentMethod === 'Reserva Financeira');
    const isReserveUsedInReceitas = allReceitas.some(r => r.reserveAccountId === reserveIdToRemove && r.receiptMethod === 'Reserva Financeira');
    if (isReserveUsedInDespesas || isReserveUsedInReceitas) {
        showMessageBox('Esta reserva está associada a transações e não pode ser removida. Remova ou altere as transações primeiro.'); return;
    }
    reserves.splice(reserveIndex, 1);
    await saveDataToFirestore();
    renderReserves();
    updateGeneralSummaryDisplay();
    generateReport();
    showMessageBox('Reserva financeira removida!');
}

// Unified Despesas
export async function addUnifiedDespesa() {
    const typeRadio = document.querySelector('input[name="expenseType"]:checked');
    if (!typeRadio) { showMessageBox("Selecione o tipo de despesa."); return; }
    const type = typeRadio.value;
    let newDespesaData = { id: generateUniqueId(), expenseNature: type };

    if (type === 'variavel') {
        if (!despesaVariavelData.value || !despesaVariavelCategoria.value || !despesaVariavelDescricao.value || !despesaVariavelValor.value || !despesaVariavelPagamento.value) {
            showMessageBox('Preencha campos obrigatórios da despesa variável.'); return;
        }
        Object.assign(newDespesaData, {
            date: despesaVariavelData.value, category: despesaVariavelCategoria.value, description: despesaVariavelDescricao.value,
            value: parseFloat(despesaVariavelValor.value), paymentMethod: despesaVariavelPagamento.value,
            creditCardId: despesaVariavelPagamento.value === 'Crédito' ? despesaVariavelCartaoSelect.value : null,
            reserveAccountId: despesaVariavelPagamento.value === 'Reserva Financeira' ? despesaVariavelReservaSelect.value : null,
            observations: despesaVariavelObs.value
        });
        if (newDespesaData.paymentMethod === 'Crédito' && newDespesaData.creditCardId) {
            const card = creditCards.find(c => c.id === newDespesaData.creditCardId);
            if (card) card.usedLimit += newDespesaData.value; else { showMessageBox("Cartão não encontrado."); return; }
        } else if (newDespesaData.paymentMethod === 'Reserva Financeira' && newDespesaData.reserveAccountId) {
            const res = reserves.find(r => r.id === newDespesaData.reserveAccountId);
            if (res) { if (res.value < newDespesaData.value) { showMessageBox("Saldo insuficiente na reserva."); return; } res.value -= newDespesaData.value; }
            else { showMessageBox("Reserva não encontrada."); return; }
        }
        despesaVariavelData.value = new Date().toISOString().split('T')[0];
        [despesaVariavelCategoria, despesaVariavelDescricao, despesaVariavelValor, despesaVariavelPagamento, despesaVariavelCartaoSelect, despesaVariavelReservaSelect, despesaVariavelObs].forEach(el => { if(el) el.value = ''; });
        if(despesaVariavelCartaoContainer) despesaVariavelCartaoContainer.classList.add('hidden');
        if(despesaVariavelReservaContainer) despesaVariavelReservaContainer.classList.add('hidden');
    } else { // Fixa
        if (!despesaFixaStartDateInput.value || !despesaFixaVencimento.value || !despesaFixaCategoria.value || !despesaFixaDescricao.value || !despesaFixaValor.value || !despesaFixaPagamento.value) {
            showMessageBox('Preencha campos obrigatórios da despesa fixa.'); return;
        }
        Object.assign(newDespesaData, {
            startDate: despesaFixaStartDateInput.value, dueDate: parseInt(despesaFixaVencimento.value), category: despesaFixaCategoria.value,
            description: despesaFixaDescricao.value, value: parseFloat(despesaFixaValor.value), paymentMethod: despesaFixaPagamento.value,
            creditCardId: despesaFixaPagamento.value === 'Crédito' ? despesaFixaCartaoSelect.value : null,
            reserveAccountId: despesaFixaPagamento.value === 'Reserva Financeira' ? despesaFixaReservaSelect.value : null,
            observations: despesaFixaObs.value
        });
        // Para despesas fixas, o impacto no cartão/reserva é geralmente no processamento mensal, não na adição.
        [despesaFixaStartDateInput, despesaFixaVencimento, despesaFixaCategoria, despesaFixaDescricao, despesaFixaValor, despesaFixaPagamento, despesaFixaCartaoSelect, despesaFixaReservaSelect, despesaFixaObs].forEach(el => { if(el) el.value = ''; });
        if(despesaFixaCartaoContainer) despesaFixaCartaoContainer.classList.add('hidden');
        if(despesaFixaReservaContainer) despesaFixaReservaContainer.classList.add('hidden');
    }
    allDespesas.push(newDespesaData);
    await saveDataToFirestore();
    renderUnifiedDespesas();
    if (newDespesaData.paymentMethod === 'Crédito' && newDespesaData.expenseNature === 'variavel') renderCreditCards();
    if (newDespesaData.paymentMethod === 'Reserva Financeira' && newDespesaData.expenseNature === 'variavel') renderReserves();
    updateGeneralSummaryDisplay();
    generateReport();
    showMessageBox('Despesa adicionada!');
}

export async function removeUnifiedDespesa(despesaId) {
    const despesaIndex = allDespesas.findIndex(d => d.id === despesaId);
    if (despesaIndex === -1) { console.warn("Despesa não encontrada:", despesaId); return; }
    const despesaRemovida = allDespesas[despesaIndex];
    allDespesas.splice(despesaIndex, 1);
    if (despesaRemovida.expenseNature === 'variavel') {
        if (despesaRemovida.paymentMethod === 'Crédito' && despesaRemovida.creditCardId) {
            const card = creditCards.find(c => c.id === despesaRemovida.creditCardId);
            if (card) card.usedLimit -= despesaRemovida.value;
        } else if (despesaRemovida.paymentMethod === 'Reserva Financeira' && despesaRemovida.reserveAccountId) {
            const res = reserves.find(r => r.id === despesaRemovida.reserveAccountId);
            if (res) res.value += despesaRemovida.value;
        }
    }
    await saveDataToFirestore();
    renderUnifiedDespesas();
    if (despesaRemovida.paymentMethod === 'Crédito' && despesaRemovida.expenseNature === 'variavel') renderCreditCards();
    if (despesaRemovida.paymentMethod === 'Reserva Financeira' && despesaRemovida.expenseNature === 'variavel') renderReserves();
    updateGeneralSummaryDisplay();
    generateReport();
    showMessageBox('Despesa removida!');
}

// Unified Receitas
export async function addUnifiedReceita() {
    const typeRadio = document.querySelector('input[name="incomeType"]:checked');
    if (!typeRadio) { showMessageBox("Selecione o tipo de receita."); return; }
    const type = typeRadio.value;
    let newReceitaData = { id: generateUniqueId(), incomeNature: type };

    if (type === 'variavel') {
        if (!receitaVariavelData.value || !receitaVariavelDescricao.value || !receitaVariavelValor.value || !receitaVariavelForma.value) {
            showMessageBox("Preencha campos obrigatórios da receita variável."); return;
        }
        Object.assign(newReceitaData, {
            date: receitaVariavelData.value, description: receitaVariavelDescricao.value, value: parseFloat(receitaVariavelValor.value),
            receiptMethod: receitaVariavelForma.value,
            reserveAccountId: receitaVariavelForma.value === 'Reserva Financeira' ? receitaVariavelReservaSelect.value : null
        });
        if (newReceitaData.receiptMethod === 'Reserva Financeira' && newReceitaData.reserveAccountId) {
            const res = reserves.find(r => r.id === newReceitaData.reserveAccountId);
            if (res) res.value += newReceitaData.value; else { showMessageBox("Reserva não encontrada."); return; }
        }
        receitaVariavelData.value = new Date().toISOString().split('T')[0];
        [receitaVariavelDescricao, receitaVariavelValor, receitaVariavelForma, receitaVariavelReservaSelect].forEach(el => { if(el) el.value = ''; });
        if(receitaVariavelReservaContainer) receitaVariavelReservaContainer.classList.add('hidden');
    } else { // Fixa
        if (!receitaFixaStartDateInput.value || !receitaFixaDescricao.value || !receitaFixaValor.value || !receitaFixaDia.value || !receitaFixaForma.value) {
            showMessageBox("Preencha campos obrigatórios da receita fixa."); return;
        }
        Object.assign(newReceitaData, {
            startDate: receitaFixaStartDateInput.value, description: receitaFixaDescricao.value, value: parseFloat(receitaFixaValor.value),
            day: parseInt(receitaFixaDia.value), receiptMethod: receitaFixaForma.value,
            reserveAccountId: receitaFixaForma.value === 'Reserva Financeira' ? receitaFixaReservaSelect.value : null
        });
        if (newReceitaData.receiptMethod === 'Reserva Financeira' && newReceitaData.reserveAccountId) {
            const res = reserves.find(r => r.id === newReceitaData.reserveAccountId);
            // Para receitas fixas, o impacto na reserva também pode ser mensal. Adicionando direto por simplicidade.
            if (res) res.value += newReceitaData.value; else { showMessageBox("Reserva não encontrada."); return; }
        }
        [receitaFixaStartDateInput, receitaFixaDescricao, receitaFixaValor, receitaFixaDia, receitaFixaForma, receitaFixaReservaSelect].forEach(el => { if(el) el.value = ''; });
        if(receitaFixaReservaContainer) receitaFixaReservaContainer.classList.add('hidden');
    }
    allReceitas.push(newReceitaData);
    await saveDataToFirestore();
    renderUnifiedReceitas(); // Ou a tabela apropriada
    if (newReceitaData.receiptMethod === 'Reserva Financeira') renderReserves();
    updateGeneralSummaryDisplay();
    generateReport();
    showMessageBox("Receita adicionada!");
}

export async function removeUnifiedReceita(receitaId) {
    const receitaIndex = allReceitas.findIndex(r => r.id === receitaId);
    if (receitaIndex === -1) { console.warn("Receita não encontrada:", receitaId); return; }
    const receitaRemovida = allReceitas[receitaIndex];
    allReceitas.splice(receitaIndex, 1);
    if (receitaRemovida.receiptMethod === 'Reserva Financeira' && receitaRemovida.reserveAccountId) {
        const res = reserves.find(r => r.id === receitaRemovida.reserveAccountId);
        if (res) res.value -= receitaRemovida.value;
    }
    await saveDataToFirestore();
    renderUnifiedReceitas(); // Ou a tabela apropriada
    if (receitaRemovida.receiptMethod === 'Reserva Financeira') renderReserves();
    updateGeneralSummaryDisplay();
    generateReport();
    showMessageBox('Receita removida!');
}

// Vales Alimentação
export async function addOrUpdateValeAlimentacao() {
    if (!valeNomeInput || !valeSaldoInicialInput || !valeDataCargaInput) { console.error("Elementos do formulário de vale não encontrados."); return; }
    const nome = valeNomeInput.value;
    const saldo = parseFloat(valeSaldoInicialInput.value);
    const dataCarga = valeDataCargaInput.value;

    if (!nome || isNaN(saldo)) { showMessageBox("Preencha Nome e Saldo Inicial do vale."); return; }
    const existingValeIndex = valesAlimentacao.findIndex(v => v.nome.toLowerCase() === nome.toLowerCase());
    if (existingValeIndex > -1) {
        valesAlimentacao[existingValeIndex].saldo = saldo;
        if (dataCarga) valesAlimentacao[existingValeIndex].dataUltimaCarga = dataCarga;
        valesAlimentacao[existingValeIndex].id = valesAlimentacao[existingValeIndex].id || generateUniqueId();
        showMessageBox('Vale alimentação atualizado!');
    } else {
        const newVale = { id: generateUniqueId(), nome, saldo, dataUltimaCarga: dataCarga || null };
        valesAlimentacao.push(newVale);
        showMessageBox('Vale alimentação adicionado!');
    }
    await saveDataToFirestore();
    renderValesAlimentacao();
    updateGeneralSummaryDisplay();
    generateReport();
    valeNomeInput.value = ''; valeSaldoInicialInput.value = '';
    valeDataCargaInput.value = new Date().toISOString().split('T')[0];
}

export async function removeValeAlimentacao(valeId) {
    valesAlimentacao = valesAlimentacao.filter(v => v.id !== valeId);
    await saveDataToFirestore();
    renderValesAlimentacao();
    updateGeneralSummaryDisplay();
    generateReport();
    showMessageBox('Vale alimentação removido!');
}
