// state.js

// O estado inicial da aplicação
const initialState = {
    allDespesas: [],
    allReceitas: [],
    creditCards: [],
    reserves: [],
    valesAlimentacao: [],
    // Podemos adicionar mais propriedades de estado aqui conforme necessário
    // Por exemplo: isLoading, currentError, activeFilters, etc.
};

// O objeto de estado reativo. Não modificar diretamente fora deste módulo.
let state = { ...initialState };

// Array para armazenar funções de callback (ouvintes)
const listeners = [];

/**
 * Permite que outras partes do código "escutem" as mudanças no estado.
 * @param {Function} listener - A função a ser chamada quando o estado mudar.
 * @returns {Function} Uma função para remover o ouvinte (unsubscribe).
 */
export function subscribe(listener) {
    listeners.push(listener);
    return () => { // Função de unsubscribe
        const index = listeners.indexOf(listener);
        if (index > -1) {
            listeners.splice(index, 1);
        }
    };
}

/**
 * Notifica todos os ouvintes registrados que o estado mudou.
 */
function notifyListeners() {
    console.log("Estado mudou, notificando ouvintes:", listeners.length);
    for (const listener of listeners) {
        listener(state); // Passa o estado atual para o ouvinte
    }
}

/**
 * Reseta o estado para o inicial.
 */
export function resetState() {
    state = { ...initialState };
    console.log("Estado resetado para o inicial.");
    notifyListeners();
}

/**
 * Define todos os dados carregados no estado.
 * Usado após carregar do Firestore ou ao limpar dados.
 * @param {object} loadedData - Objeto contendo os arrays de dados.
 */
export function setAllData(loadedData) {
    state.allDespesas = loadedData.allDespesas || [];
    state.allReceitas = loadedData.allReceitas || [];
    state.creditCards = loadedData.creditCards || [];
    state.reserves = loadedData.reserves || [];
    state.valesAlimentacao = loadedData.valesAlimentacao || [];
    console.log("Todos os dados definidos no estado:", state);
    notifyListeners();
}

// --- Funções "Mutators" para cada parte do estado ---
// Essas funções são as ÚNICAS que devem modificar o estado.

export function addDespesa(despesa) {
    state.allDespesas = [...state.allDespesas, despesa];
    notifyListeners();
}

export function removeDespesa(despesaId) {
    const despesaOriginal = state.allDespesas.find(d => d.id === despesaId);
    state.allDespesas = state.allDespesas.filter(d => d.id !== despesaId);

    // Reverter impacto no cartão/reserva se necessário (lógica movida para data.js ou aqui)
    if (despesaOriginal && despesaOriginal.expenseNature === 'variavel') {
        if (despesaOriginal.paymentMethod === 'Crédito' && despesaOriginal.creditCardId) {
            const cardIndex = state.creditCards.findIndex(c => c.id === despesaOriginal.creditCardId);
            if (cardIndex > -1) {
                state.creditCards[cardIndex].usedLimit -= despesaOriginal.value;
                // Garante que não fique negativo
                if (state.creditCards[cardIndex].usedLimit < 0) state.creditCards[cardIndex].usedLimit = 0;
            }
        } else if (despesaOriginal.paymentMethod === 'Reserva Financeira' && despesaOriginal.reserveAccountId) {
            const reserveIndex = state.reserves.findIndex(r => r.id === despesaOriginal.reserveAccountId);
            if (reserveIndex > -1) {
                state.reserves[reserveIndex].value += despesaOriginal.value;
            }
        }
    }
    notifyListeners();
}

export function addReceita(receita) {
    state.allReceitas = [...state.allReceitas, receita];
    notifyListeners();
}

export function removeReceita(receitaId) {
    const receitaOriginal = state.allReceitas.find(r => r.id === receitaId);
    state.allReceitas = state.allReceitas.filter(r => r.id !== receitaId);

    if (receitaOriginal && receitaOriginal.receiptMethod === 'Reserva Financeira' && receitaOriginal.reserveAccountId) {
        const reserveIndex = state.reserves.findIndex(r => r.id === receitaOriginal.reserveAccountId);
        if (reserveIndex > -1) {
            state.reserves[reserveIndex].value -= receitaOriginal.value;
             if (state.reserves[reserveIndex].value < 0) state.reserves[reserveIndex].value = 0;
        }
    }
    notifyListeners();
}

export function addCard(card) {
    state.creditCards = [...state.creditCards, card];
    notifyListeners();
}

export function removeCard(cardId) {
    // Adicionar verificação se o cartão está em uso antes de permitir a remoção em data.js
    state.creditCards = state.creditCards.filter(c => c.id !== cardId);
    notifyListeners();
}

export function updateCardUsedLimit(cardId, amountChange) {
    const cardIndex = state.creditCards.findIndex(c => c.id === cardId);
    if (cardIndex > -1) {
        state.creditCards[cardIndex].usedLimit += amountChange;
        notifyListeners();
    }
}

export function addFoodVale(vale) {
    state.valesAlimentacao = [...state.valesAlimentacao, vale];
    notifyListeners();
}

export function updateFoodVale(valeId, updatedValeData) {
    const valeIndex = state.valesAlimentacao.findIndex(v => v.id === valeId);
    if (valeIndex > -1) {
        state.valesAlimentacao[valeIndex] = { ...state.valesAlimentacao[valeIndex], ...updatedValeData };
        notifyListeners();
    }
}

export function removeFoodVale(valeId) {
    state.valesAlimentacao = state.valesAlimentacao.filter(v => v.id !== valeId);
    notifyListeners();
}

export function addAReserve(reserve) {
    state.reserves = [...state.reserves, reserve];
    notifyListeners();
}

export function removeAReserve(reserveId) {
     // Adicionar verificação se a reserva está em uso antes de permitir a remoção em data.js
    state.reserves = state.reserves.filter(r => r.id !== reserveId);
    notifyListeners();
}

export function updateReserveValue(reserveId, amountChange) {
    const reserveIndex = state.reserves.findIndex(r => r.id === reserveId);
    if (reserveIndex > -1) {
        state.reserves[reserveIndex].value += amountChange;
        notifyListeners();
    }
}

// Getter para acessar o estado (opcional, mas bom para encapsulamento)
export function getState() {
    // Retorna uma cópia profunda para evitar mutações externas acidentais do estado aninhado.
    // Para um estado simples como o nosso, uma cópia superficial dos arrays é suficiente
    // se as funções mutadoras sempre criarem novos arrays/objetos.
    return {
        allDespesas: [...state.allDespesas],
        allReceitas: [...state.allReceitas],
        creditCards: state.creditCards.map(c => ({...c})),
        reserves: state.reserves.map(r => ({...r})),
        valesAlimentacao: state.valesAlimentacao.map(v => ({...v})),
    };
}
