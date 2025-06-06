// data.js
import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { db, generateUniqueId, appIdFromGlobal, showMessageBox } from './config.js';
import { isGuestMode, currentUserId } from './auth.js';
import {
    // Funções de mutação do estado
    setAllData, resetState,
    addDespesa as addDespesaToState,
    removeDespesa as removeDespesaFromState,
    addReceita as addReceitaToState,
    removeReceita as removeReceitaFromState,
    addCard as addCardToState,
    removeCard as removeCardFromState,
    updateCardUsedLimit,
    addAReserve as addReserveToState,
    removeAReserve as removeReserveFromState,
    updateReserveValue,
    addFoodVale as addFoodValeToState,
    updateFoodVale as updateFoodValeInState,
    removeFoodVale as removeFoodValeFromState
} from './state.js'; // Importa do novo state.js

// UI elements needed for clearing forms (ainda necessário aqui para limpar os forms)
import {
    despesaVariavelData, despesaVariavelCategoria, despesaVariavelDescricao, despesaVariavelValor, despesaVariavelPagamento, despesaVariavelCartaoSelect, despesaVariavelReservaSelect, despesaVariavelObs, despesaVariavelCartaoContainer, despesaVariavelReservaContainer,
    despesaFixaStartDateInput, despesaFixaVencimento, despesaFixaCategoria, despesaFixaDescricao, despesaFixaValor, despesaFixaPagamento, despesaFixaCartaoSelect, despesaFixaReservaSelect, despesaFixaObs, despesaFixaCartaoContainer, despesaFixaReservaContainer,
    receitaVariavelData, receitaVariavelDescricao, receitaVariavelValor, receitaVariavelForma, receitaVariavelReservaSelect, receitaVariavelReservaContainer,
    receitaFixaStartDateInput, receitaFixaDescricao, receitaFixaValor, receitaFixaDia, receitaFixaForma, receitaFixaReservaSelect, receitaFixaReservaContainer,
    valeNomeInput, valeSaldoInicialInput, valeDataCargaInput
    // As funções de renderização e update de sumário não são mais chamadas diretamente daqui.
    // A UI vai escutar o estado e se atualizar.
} from './ui.js';

// NÃO HÁ MAIS ARRAYS GLOBAIS DE DADOS AQUI (allDespesas, etc.)

export function clearLocalData() {
    console.log("Limpando dados locais e resetando estado.");
    resetState(); // Reseta o estado centralizado
}

export async function saveDataToFirestore(currentState) { // Recebe o estado atual
    if (isGuestMode || !currentUserId || currentUserId.startsWith('guest-')) {
        console.log("Modo convidado ou usuário inválido, dados não salvos no Firestore.");
        return;
    }
    const userDocRef = doc(db, 'artifacts', appIdFromGlobal, 'users', currentUserId, 'finanbasicData', 'userData');
    try {
        // Salva os dados do objeto de estado que são relevantes
        await setDoc(userDocRef, {
            allDespesas: currentState.allDespesas,
            allReceitas: currentState.allReceitas,
            creditCards: currentState.creditCards,
            reserves: currentState.reserves,
            valesAlimentacao: currentState.valesAlimentacao,
            lastUpdated: new Date().toISOString()
        });
        console.log("Dados do estado guardados no Firestore para o usuário:", currentUserId);
    } catch (error) {
        console.error("Erro ao guardar dados do estado:", error);
        showMessageBox("Erro ao guardar dados.");
    }
}

export async function loadDataFromFirestore(userId) {
    if (isGuestMode || !userId || userId.startsWith('guest-')) {
        console.log("Modo convidado ou ID de usuário inválido para carregar dados. Resetando estado.");
        resetState();
        return;
    }
    const userDocRef = doc(db, 'artifacts', appIdFromGlobal, 'users', userId, 'finanbasicData', 'userData');
    try {
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
            const data = docSnap.data();
            let loadedDespesas = data.allDespesas || [];
            let loadedReceitas = data.allReceitas || [];

            if (!data.allDespesas && (data.expenses || data.fixedExpenses)) {
                const oldVarExpenses = (data.expenses || []).map(e => ({ ...e, expenseNature: 'variavel', id: e.id || generateUniqueId() }));
                const oldFixExpenses = (data.fixedExpenses || []).map(e => ({ ...e, expenseNature: 'fixa', id: e.id || generateUniqueId() }));
                loadedDespesas = [...oldFixExpenses, ...oldVarExpenses];
            }
            if (!data.allReceitas && (data.income || data.fixedIncome)) {
                const oldVarIncome = (data.income || []).map(i => ({ ...i, incomeNature: 'variavel', id: i.id || generateUniqueId() }));
                const oldFixIncome = (data.fixedIncome || []).map(i => ({ ...i, incomeNature: 'fixa', id: i.id || generateUniqueId() }));
                loadedReceitas = [...oldFixIncome, ...oldVarIncome];
            }
            // Coloca os dados carregados no estado central
            setAllData({
                allDespesas: loadedDespesas,
                allReceitas: loadedReceitas,
                creditCards: data.creditCards || [],
                reserves: data.reserves || [],
                valesAlimentacao: data.valesAlimentacao || []
            });
            console.log("Dados carregados do Firestore e definidos no estado para o usuário:", userId);
        } else {
            console.log("Nenhum dado no Firestore para o usuário, resetando estado:", userId);
            resetState();
        }
    } catch (error) {
        console.error("Erro ao carregar dados:", error);
        showMessageBox("Erro ao carregar os dados do usuário.");
        resetState();
    }
    // A UI será notificada pelo state.js e se re-renderizará
}


// --- CRUD Functions (agora interagem com state.js) ---

export async function addCreditCard() {
    const bankInput = document.getElementById('creditCardBank'); // Ainda pega do DOM aqui
    const limitInput = document.getElementById('creditCardLimit');
    const spentInput = document.getElementById('creditCardSpent');
    const closingDayInput = document.getElementById('creditCardClosingDay');
    const paymentDayInput = document.getElementById('creditCardPaymentDay');

    const bank = bankInput.value;
    const limit = parseFloat(limitInput.value);
    const usedLimit = parseFloat(spentInput.value || 0);
    const closingDay = closingDayInput.value ? parseInt(closingDayInput.value) : null;
    const paymentDay = paymentDayInput.value ? parseInt(paymentDayInput.value) : null;

    if (!bank || isNaN(limit)) { showMessageBox('Preencha Banco e Limite Total.'); return; }
    // ... (validações como antes)

    const newCard = { id: generateUniqueId(), bank, limit, usedLimit, closingDay, paymentDay };
    addCardToState(newCard); // Adiciona ao estado
    // saveDataToFirestore será chamado pelo listener do estado ou explicitamente após várias alterações.
    // Por enquanto, vamos chamar após cada grande alteração.
    // A UI vai re-renderizar automaticamente por causa do notifyListeners() em addCardToState.

    showMessageBox('Cartão de crédito adicionado!');
    bankInput.value = ''; limitInput.value = ''; spentInput.value = ''; closingDayInput.value = ''; paymentDayInput.value = '';
}

export async function removeCreditCard(cardIdToRemove, currentState) { // Recebe currentState para verificações
    const isCardUsed = currentState.allDespesas.some(d => d.creditCardId === cardIdToRemove && d.paymentMethod === 'Crédito');
    if (isCardUsed) {
        showMessageBox('Este cartão está associado a despesas e não pode ser removido.'); return;
    }
    removeCardFromState(cardIdToRemove);
    showMessageBox('Cartão de crédito removido!');
}

export async function addReserve() {
    const descriptionInput = document.getElementById('reserveDescription');
    // ... (pegar outros valores do form)
    const description = descriptionInput.value;
    const value = parseFloat(document.getElementById('reserveValue').value);
    const source = document.getElementById('reserveSource').value;
    const location = document.getElementById('reserveLocation').value;

    if (!description || isNaN(value) || value <= 0) { showMessageBox('Preencha Descrição e Valor válido.'); return; }

    const newReserve = { id: generateUniqueId(), description, value, source, location };
    addReserveToState(newReserve);
    showMessageBox('Reserva financeira adicionada!');
    descriptionInput.value = ''; document.getElementById('reserveValue').value = ''; /*...*/
}

export async function removeReserve(reserveIdToRemove, currentState) {
    const isReserveUsedInDespesas = currentState.allDespesas.some(d => d.reserveAccountId === reserveIdToRemove && d.paymentMethod === 'Reserva Financeira');
    const isReserveUsedInReceitas = currentState.allReceitas.some(r => r.reserveAccountId === reserveIdToRemove && r.receiptMethod === 'Reserva Financeira');
    if (isReserveUsedInDespesas || isReserveUsedInReceitas) {
        showMessageBox('Esta reserva está associada a transações.'); return;
    }
    removeReserveFromState(reserveIdToRemove);
    showMessageBox('Reserva financeira removida!');
}

export async function addUnifiedDespesa() {
    const typeRadio = document.querySelector('input[name="expenseType"]:checked');
    if (!typeRadio) { showMessageBox("Selecione o tipo de despesa."); return; }
    const type = typeRadio.value;
    let newDespesaData = { id: generateUniqueId(), expenseNature: type };

    if (type === 'variavel') {
        if (!despesaVariavelData.value || /*...outras validações...*/ !despesaVariavelPagamento.value) {
            showMessageBox('Preencha campos obrigatórios da despesa variável.'); return;
        }
        Object.assign(newDespesaData, {
            date: despesaVariavelData.value, category: despesaVariavelCategoria.value, description: despesaVariavelDescricao.value,
            value: parseFloat(despesaVariavelValor.value), paymentMethod: despesaVariavelPagamento.value,
            creditCardId: despesaVariavelPagamento.value === 'Crédito' ? despesaVariavelCartaoSelect.value : null,
            reserveAccountId: despesaVariavelPagamento.value === 'Reserva Financeira' ? despesaVariavelReservaSelect.value : null,
            observations: despesaVariavelObs.value
        });
        // A lógica de atualizar limite do cartão ou saldo da reserva é movida para o state.js ou tratada na mutação
        if (newDespesaData.paymentMethod === 'Crédito' && newDespesaData.creditCardId) {
            updateCardUsedLimit(newDespesaData.creditCardId, newDespesaData.value);
        } else if (newDespesaData.paymentMethod === 'Reserva Financeira' && newDespesaData.reserveAccountId) {
            // É preciso verificar se há saldo ANTES de chamar updateReserveValue
            // Esta verificação pode ficar aqui ou ser movida para uma função que prepara a transação
            const currentReserves = (await import('./state.js')).getState().reserves; // Pega o estado atual
            const res = currentReserves.find(r => r.id === newDespesaData.reserveAccountId);
            if (res) { if (res.value < newDespesaData.value) { showMessageBox("Saldo insuficiente na reserva."); return; } }
            else { showMessageBox("Reserva não encontrada."); return;}
            updateReserveValue(newDespesaData.reserveAccountId, -newDespesaData.value); // Subtrai da reserva
        }
        // Limpar campos do formulário
        despesaVariavelData.value = new Date().toISOString().split('T')[0];
        [despesaVariavelCategoria, despesaVariavelDescricao, despesaVariavelValor, despesaVariavelPagamento, despesaVariavelCartaoSelect, despesaVariavelReservaSelect, despesaVariavelObs].forEach(el => { if(el) el.value = ''; });
        if(despesaVariavelCartaoContainer) despesaVariavelCartaoContainer.classList.add('hidden');
        if(despesaVariavelReservaContainer) despesaVariavelReservaContainer.classList.add('hidden');

    } else { // Fixa
         if (!despesaFixaStartDateInput.value || /*...validações...*/ !despesaFixaPagamento.value) {
            showMessageBox('Preencha campos obrigatórios da despesa fixa.'); return;
        }
         Object.assign(newDespesaData, {
            startDate: despesaFixaStartDateInput.value, dueDate: parseInt(despesaFixaVencimento.value), category: despesaFixaCategoria.value,
            description: despesaFixaDescricao.value, value: parseFloat(despesaFixaValor.value), paymentMethod: despesaFixaPagamento.value,
            creditCardId: despesaFixaPagamento.value === 'Crédito' ? despesaFixaCartaoSelect.value : null,
            reserveAccountId: despesaFixaPagamento.value === 'Reserva Financeira' ? despesaFixaReservaSelect.value : null,
            observations: despesaFixaObs.value
        });
        // Limpar campos
        [despesaFixaStartDateInput, despesaFixaVencimento, despesaFixaCategoria, despesaFixaDescricao, despesaFixaValor, despesaFixaPagamento, despesaFixaCartaoSelect, despesaFixaReservaSelect, despesaFixaObs].forEach(el => { if(el) el.value = ''; });
        if(despesaFixaCartaoContainer) despesaFixaCartaoContainer.classList.add('hidden');
        if(despesaFixaReservaContainer) despesaFixaReservaContainer.classList.add('hidden');
    }
    addDespesaToState(newDespesaData);
    showMessageBox('Despesa adicionada!');
}

export async function removeUnifiedDespesa(despesaId) {
    // A lógica de reverter o impacto no cartão/reserva agora está em removeDespesaFromState
    removeDespesaFromState(despesaId);
    showMessageBox('Despesa removida!');
}

export async function addUnifiedReceita() {
    const typeRadio = document.querySelector('input[name="incomeType"]:checked');
    if (!typeRadio) { showMessageBox("Selecione o tipo de receita."); return; }
    const type = typeRadio.value;
    let newReceitaData = { id: generateUniqueId(), incomeNature: type };

    if (type === 'variavel') {
        if (!receitaVariavelData.value || /*...validações...*/ !receitaVariavelForma.value) {
            showMessageBox("Preencha campos obrigatórios da receita variável."); return;
        }
        Object.assign(newReceitaData, {
            date: receitaVariavelData.value, description: receitaVariavelDescricao.value, value: parseFloat(receitaVariavelValor.value),
            receiptMethod: receitaVariavelForma.value,
            reserveAccountId: receitaVariavelForma.value === 'Reserva Financeira' ? receitaVariavelReservaSelect.value : null
        });
        if (newReceitaData.receiptMethod === 'Reserva Financeira' && newReceitaData.reserveAccountId) {
            updateReserveValue(newReceitaData.reserveAccountId, newReceitaData.value); // Adiciona à reserva
        }
        // Limpar campos
        receitaVariavelData.value = new Date().toISOString().split('T')[0];
        [receitaVariavelDescricao, receitaVariavelValor, receitaVariavelForma, receitaVariavelReservaSelect].forEach(el => { if(el) el.value = ''; });
        if(receitaVariavelReservaContainer) receitaVariavelReservaContainer.classList.add('hidden');

    } else { // Fixa
        if (!receitaFixaStartDateInput.value || /*...validações...*/ !receitaFixaForma.value) {
            showMessageBox("Preencha campos obrigatórios da receita fixa."); return;
        }
         Object.assign(newReceitaData, {
            startDate: receitaFixaStartDateInput.value, description: receitaFixaDescricao.value, value: parseFloat(receitaFixaValor.value),
            day: parseInt(receitaFixaDia.value), receiptMethod: receitaFixaForma.value,
            reserveAccountId: receitaFixaForma.value === 'Reserva Financeira' ? receitaFixaReservaSelect.value : null
        });
         if (newReceitaData.receiptMethod === 'Reserva Financeira' && newReceitaData.reserveAccountId) {
            updateReserveValue(newReceitaData.reserveAccountId, newReceitaData.value);
        }
        // Limpar campos
        [receitaFixaStartDateInput, receitaFixaDescricao, receitaFixaValor, receitaFixaDia, receitaFixaForma, receitaFixaReservaSelect].forEach(el => { if(el) el.value = ''; });
        if(receitaFixaReservaContainer) receitaFixaReservaContainer.classList.add('hidden');
    }
    addReceitaToState(newReceitaData);
    showMessageBox("Receita adicionada!");
}

export async function removeUnifiedReceita(receitaId) {
    // A lógica de reverter o impacto na reserva agora está em removeReceitaFromState
    removeReceitaFromState(receitaId);
    showMessageBox('Receita removida!');
}

export async function addOrUpdateValeAlimentacao() {
    const nome = valeNomeInput.value;
    const saldo = parseFloat(valeSaldoInicialInput.value);
    const dataCarga = valeDataCargaInput.value;

    if (!nome || isNaN(saldo)) { showMessageBox("Preencha Nome e Saldo Inicial do vale."); return; }

    // Para simplificar, o estado será atualizado diretamente pelas funções de state.js
    // Mas precisamos do estado atual para verificar se o vale existe
    const currentVales = (await import('./state.js')).getState().valesAlimentacao;
    const existingVale = currentVales.find(v => v.nome.toLowerCase() === nome.toLowerCase());

    if (existingVale) {
        updateFoodValeInState(existingVale.id, { saldo, dataUltimaCarga: dataCarga || existingVale.dataUltimaCarga });
        showMessageBox('Vale alimentação atualizado!');
    } else {
        const newVale = { id: generateUniqueId(), nome, saldo, dataUltimaCarga: dataCarga || null };
        addFoodValeToState(newVale);
        showMessageBox('Vale alimentação adicionado!');
    }
    valeNomeInput.value = ''; valeSaldoInicialInput.value = '';
    valeDataCargaInput.value = new Date().toISOString().split('T')[0];
}

export async function removeValeAlimentacao(valeId) {
    removeFoodValeFromState(valeId);
    showMessageBox('Vale alimentação removido!');
}
