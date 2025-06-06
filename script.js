
      import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
        import { 
            getAuth, 
            GoogleAuthProvider,
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
            signInWithCustomToken
        } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
        import { 
            getFirestore, 
            doc, 
            setDoc, 
            getDoc,
            setLogLevel
        } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

        // --- Global Variables & Firebase Setup ---
        const firebaseConfigFromGlobal = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : null;
        const appIdFromGlobal = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
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
        const auth = getAuth(app);
        const db = getFirestore(app);
        setLogLevel('debug'); 
        const googleProvider = new GoogleAuthProvider();


        let currentUserId = null; 
        let currentUserData = null; 
        let isGuestMode = true; 

        let allDespesas = []; 
        let allReceitas = []; 
        let creditCards = [];
        let reserves = []; 
        let valesAlimentacao = []; 

        // DOM Elements (Refs)
        let userAuthArea, guestModeMessageContainer, authScreenModal, closeAuthModalBtn;
        let profileAvatar, profileUserImage, profileUserInitials, changeProfilePhotoBtn, profilePhotoUpload;
        let profileDisplayNameInput, profileEmailInput, profileCurrentPasswordInput, profileNewPasswordInput, saveProfileChangesBtn, passwordChangeSection;
        
        let despesasSection, formDespesaVariavel, formDespesaFixa, addDespesaBtn, tabelaDespesasUnificada;
        let expenseTypeVariableRadio, expenseTypeFixedRadio;
        let despesaVariavelData, despesaVariavelCategoria, despesaVariavelDescricao, despesaVariavelValor, despesaVariavelPagamento, despesaVariavelCartaoContainer, despesaVariavelCartaoSelect, despesaVariavelReservaContainer, despesaVariavelReservaSelect, despesaVariavelObs;
        let despesaFixaVencimento, despesaFixaCategoria, despesaFixaDescricao, despesaFixaValor, despesaFixaPagamento, despesaFixaCartaoContainer, despesaFixaCartaoSelect, despesaFixaReservaContainer, despesaFixaReservaSelect, despesaFixaObs, despesaFixaStartDateInput;
        
        let receitasSection, formReceitaVariavel, formReceitaFixa, addReceitaBtn, tabelaReceitasUnificada; 
        let incomeTypeVariableRadio, incomeTypeFixedRadio;
        let receitaVariavelData, receitaVariavelDescricao, receitaVariavelValor, receitaVariavelForma, receitaVariavelReservaContainer, receitaVariavelReservaSelect;
        let receitaFixaDescricao, receitaFixaValor, receitaFixaDia, receitaFixaForma, receitaFixaReservaContainer, receitaFixaReservaSelect, receitaFixaStartDateInput; 

        let valeAlimentacaoSection, valeNomeInput, valeSaldoInicialInput, valeDataCargaInput, addValeAlimentacaoBtn, tabelaValesAlimentacao;

        let appContainer, logoutBtn, authUserIdSpan, appUserIdSpan, totalValueSpan; 
        let addCreditCardBtn, creditCardTableBody, creditCardTransactionsContainer, selectedCardNameSpan, creditCardTransactionsTableBody, selectedCardAvailableLimitSpan;
        let creditCardClosingDayInput, creditCardPaymentDayInput;

        let addReserveBtn, reserveTableBody, totalReserveValueSpan;
        let copyToExcelBtn, mainAppTitle, closeReportModalBtn;
        let summaryFixedIncomeEl, summaryFixedExpensesEl, summaryFixedBalanceEl;
        let summaryVariableIncomeEl, summaryVariableExpensesEl, summaryVariableBalanceEl;
        let summaryTotalIncomeEl, summaryTotalExpensesEl, summaryTotalBalanceEl;
        let summaryCardLimitEl, summaryCardExpensesEl, summaryCardAvailableEl, summaryCardDueEl;
        let summaryTotalReserveEl;

        let aiAnalysisModal, closeAiModalBtn, closeAiModalBtnBottom, aiAnalysisResult, analyzeFinanceBtn, aiLoadingMessage, copyAiAnalysisBtn;
        let aiQuestionInput, askAiBtn, aiQuestionResponse, aiQuestionLoading;
        let reportMonthSelect, reportYearInput, filterReportBtn;

        // --- Utility Functions ---
        function generateUniqueId() { return '_' + Math.random().toString(36).substr(2, 9); }
        function showMessageBox(message) { 
            const mb = document.getElementById('messageBox');
            const mt = document.getElementById('messageText');
            if(mb && mt) { mt.textContent = message; mb.classList.remove('hidden');}
        }
        function closeMessageBoxHandler() { document.getElementById('messageBox')?.classList.add('hidden'); }
        function formatCurrency(value) { 
            if (typeof value !== 'number' || isNaN(value)) return 'R$ 0,00';
            return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        }
        function calculateTotal() { updateGeneralSummaryDisplay(); }


        // --- Render Functions ---
        function renderCreditCards() { 
            if (!creditCardTableBody) return;
            creditCardTableBody.innerHTML = '';
            creditCards.forEach((card, index) => {
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
                deleteBtn.textContent = 'Remover';
                deleteBtn.className = 'bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded-md text-xs transition duration-200';
                deleteBtn.onclick = (e) => { e.stopPropagation(); removeCreditCard(index); };
                actionsCell.appendChild(deleteBtn);
                row.onclick = () => displayCardTransactions(card.id);
            });
            updateCreditCardDropdowns();
        }
        function displayCardTransactions(cardId) { 
            const card = creditCards.find(c => c.id === cardId);
            if (!card || !creditCardTransactionsTableBody || !creditCardTransactionsContainer || !selectedCardNameSpan || !selectedCardAvailableLimitSpan) return;
            selectedCardNameSpan.textContent = card.bank;
            creditCardTransactionsTableBody.innerHTML = '';
            
            const cardTransactions = [
                ...allDespesas.filter(d => d.creditCardId === cardId && d.paymentMethod === 'Crédito').map(d => ({...d, type: 'Despesa', dateSort: new Date(d.date || `2000-01-${d.dueDate || '01'}`)})),
                ...allReceitas.filter(i => i.creditCardId === cardId && i.receiptMethod === 'Cartão de Crédito').map(i => ({...i, type: 'Pagamento Fatura', dateSort: new Date(i.date || `2000-01-${i.day || '01'}`) })) 
            ].sort((a,b) => b.dateSort - a.dateSort);

            cardTransactions.forEach(transaction => {
                const row = creditCardTransactionsTableBody.insertRow();
                row.insertCell(0).textContent = transaction.date || `Dia ${transaction.dueDate || transaction.day}`;
                row.insertCell(1).textContent = transaction.description;
                row.insertCell(2).textContent = transaction.type;
                const valueCell = row.insertCell(3);
                valueCell.textContent = formatCurrency(transaction.value);
                valueCell.classList.add(transaction.type === 'Despesa' ? 'text-red-600' : 'text-green-600');
            });
            selectedCardAvailableLimitSpan.textContent = formatCurrency(card.limit - card.usedLimit);
            creditCardTransactionsContainer.classList.remove('hidden');
        }
        function renderReserves() { 
            if (!reserveTableBody || !totalReserveValueSpan) return;
            reserveTableBody.innerHTML = '';
            let totalReserve = 0;
            reserves.forEach((reserve, index) => {
                const row = reserveTableBody.insertRow();
                totalReserve += reserve.value;
                row.classList.add('hover:bg-gray-50');
                row.insertCell(0).textContent = reserve.description;
                row.insertCell(1).textContent = formatCurrency(reserve.value);
                row.insertCell(2).textContent = reserve.source;
                row.insertCell(3).textContent = reserve.location;
                const actionsCell = row.insertCell(4);
                const deleteBtn = document.createElement('button');
                deleteBtn.textContent = 'Remover';
                deleteBtn.className = 'bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded-md text-xs';
                deleteBtn.onclick = () => removeReserve(index);
                actionsCell.appendChild(deleteBtn);
            });
            totalReserveValueSpan.textContent = formatCurrency(totalReserve);
            updateReserveAccountDropdowns();
        }
        
        function renderUnifiedDespesas(despesasParaRenderizar = allDespesas) { 
            const tabelaDespesasElem = document.getElementById('tabelaDespesasUnificada'); 
            if (!tabelaDespesasElem) return;
            tabelaDespesasElem.innerHTML = '';
            const sortedDespesas = [...despesasParaRenderizar].sort((a, b) => {
                if (a.expenseNature === 'fixa' && b.expenseNature === 'variavel') return -1;
                if (a.expenseNature === 'variavel' && b.expenseNature === 'fixa') return 1;
                const dateA = new Date(a.date || `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2,'0')}-${String(a.dueDate || '01').padStart(2,'0')}`);
                const dateB = new Date(b.date || `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2,'0')}-${String(b.dueDate || '01').padStart(2,'0')}`);
                return dateB - dateA; 
            });

            sortedDespesas.forEach((despesa) => { 
                const row = tabelaDespesasElem.insertRow();
                row.classList.add('hover:bg-gray-50');
                if (despesa.expenseNature === 'fixa') row.classList.add('bg-green-50');
                
                row.insertCell(0).textContent = despesa.date || despesa.dueDate; 
                
                const proxVencCell = row.insertCell(1);
                if (despesa.expenseNature === 'fixa' && despesa.dueDate && despesa.startDate) {
                    const hoje = new Date();
                    const inicioRecorrencia = new Date(despesa.startDate + "T00:00:00"); 
                    let proxMes = hoje.getMonth();
                    let proxAno = hoje.getFullYear();

                    if (hoje.getDate() > despesa.dueDate) { 
                        proxMes++;
                        if (proxMes > 11) { proxMes = 0; proxAno++; }
                    }
                    let proxVencData = new Date(proxAno, proxMes, despesa.dueDate);
                    if (proxVencData < inicioRecorrencia) {
                        proxVencData = new Date(inicioRecorrencia.getFullYear(), inicioRecorrencia.getMonth(), despesa.dueDate);
                        if (proxVencData < inicioRecorrencia) { 
                            proxVencData.setMonth(proxVencData.getMonth() + 1);
                        }
                    }
                     if (inicioRecorrencia > hoje && proxVencData < inicioRecorrencia) {
                         proxVencData = new Date(inicioRecorrencia.getFullYear(), inicioRecorrencia.getMonth(), despesa.dueDate);
                         if (proxVencData < inicioRecorrencia) {
                            proxVencData.setMonth(proxVencData.getMonth() + 1);
                         }
                    }


                    proxVencCell.textContent = proxVencData.toLocaleDateString('pt-BR');
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
                deleteBtn.textContent = 'Remover';
                deleteBtn.className = 'bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded-md text-xs';
                deleteBtn.onclick = () => removeUnifiedDespesa(despesa.id); 
                actionsCell.appendChild(deleteBtn);
            });
        }

        function renderUnifiedReceitas(receitasParaRenderizar = allReceitas) { 
            const tabelaReceitasElem = document.getElementById('tabelaReceitasUnificada'); 
            if (!tabelaReceitasElem) return;
            tabelaReceitasElem.innerHTML = '';
            const sortedReceitas = [...receitasParaRenderizar].sort((a, b) => {
                if (a.incomeNature === 'fixa' && b.incomeNature === 'variavel') return -1;
                if (a.incomeNature === 'variavel' && b.incomeNature === 'fixa') return 1;
                const dateA = new Date(a.date || `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2,'0')}-${String(a.day || '01').padStart(2,'0')}`);
                const dateB = new Date(b.date || `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2,'0')}-${String(b.day || '01').padStart(2,'0')}`);
                return dateB - dateA; 
            });
            sortedReceitas.forEach((receita) => {
                const row = tabelaReceitasElem.insertRow();
                row.classList.add('hover:bg-gray-50');
                if (receita.incomeNature === 'fixa') row.classList.add('bg-blue-50');
                row.insertCell(0).textContent = receita.date || receita.day;

                const proxRecCell = row.insertCell(1);
                 if (receita.incomeNature === 'fixa' && receita.day && receita.startDate) {
                    const hoje = new Date();
                    const inicioRecorrencia = new Date(receita.startDate + "T00:00:00");
                    let proxMes = hoje.getMonth();
                    let proxAno = hoje.getFullYear();
                    if (hoje.getDate() > receita.day) { 
                        proxMes++;
                        if (proxMes > 11) { proxMes = 0; proxAno++; }
                    }
                    let proxRecData = new Date(proxAno, proxMes, receita.day);
                    if (proxRecData < inicioRecorrencia) {
                        proxRecData = new Date(inicioRecorrencia.getFullYear(), inicioRecorrencia.getMonth(), receita.day);
                        if (proxRecData < inicioRecorrencia) {
                            proxRecData.setMonth(proxRecData.getMonth() + 1);
                        }
                    }
                     if (inicioRecorrencia > hoje && proxRecData < inicioRecorrencia) {
                         proxRecData = new Date(inicioRecorrencia.getFullYear(), inicioRecorrencia.getMonth(), receita.day);
                         if (proxRecData < inicioRecorrencia) {
                            proxRecData.setMonth(proxRecData.getMonth() + 1);
                         }
                    }
                    proxRecCell.textContent = proxRecData.toLocaleDateString('pt-BR');
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
                deleteBtn.textContent = 'Remover';
                deleteBtn.className = 'bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded-md text-xs';
                deleteBtn.onclick = () => removeUnifiedReceita(receita.id);
                actionsCell.appendChild(deleteBtn);
            });
        }

        function renderValesAlimentacao() { 
            if (!tabelaValesAlimentacao) return;
            tabelaValesAlimentacao.innerHTML = '';
            valesAlimentacao.forEach((vale) => { 
                const row = tabelaValesAlimentacao.insertRow();
                row.insertCell(0).textContent = vale.nome;
                row.insertCell(1).textContent = formatCurrency(vale.saldo);
                row.insertCell(2).textContent = vale.dataUltimaCarga || '-';
                const actionsCell = row.insertCell(3);
                const deleteBtn = document.createElement('button');
                deleteBtn.textContent = 'Remover';
                deleteBtn.className = 'bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded-md text-xs';
                deleteBtn.onclick = () => removeValeAlimentacao(vale.id);
                actionsCell.appendChild(deleteBtn);
            });
        }
        
        function updateCreditCardDropdowns() { 
            const dropdowns = [ despesaVariavelCartaoSelect, despesaFixaCartaoSelect ]; 
            dropdowns.forEach(dropdown => { 
                if(dropdown) {
                    const currentVal = dropdown.value;
                    dropdown.innerHTML = '<option value="">Selecione um cartão</option>';
                    creditCards.forEach(card => {
                        const opt = document.createElement('option');
                        opt.value = card.id;
                        opt.textContent = `${card.bank} (Disp: ${formatCurrency(card.limit - card.usedLimit)})`;
                        dropdown.appendChild(opt);
                    });
                    if(creditCards.find(c=>c.id === currentVal)) dropdown.value = currentVal;
                }
            });
        }
        function updateReserveAccountDropdowns() { 
            const dropdowns = [ despesaVariavelReservaSelect, despesaFixaReservaSelect, receitaVariavelReservaSelect, receitaFixaReservaSelect ];
            dropdowns.forEach(dropdown => { 
                 if(dropdown) {
                    const currentVal = dropdown.value;
                    dropdown.innerHTML = '<option value="">Selecione uma reserva</option>';
                    reserves.forEach(reserve => {
                        const opt = document.createElement('option');
                        opt.value = reserve.id;
                        opt.textContent = `${reserve.description} (Saldo: ${formatCurrency(reserve.value)})`;
                        dropdown.appendChild(opt);
                    });
                    if(reserves.find(r=>r.id === currentVal)) dropdown.value = currentVal;
                }
            });
        }

        async function saveDataToFirestore() { 
            if (isGuestMode || !currentUserId) { 
                console.log("Modo convidado ou sem usuário, dados não serão salvos no Firestore.");
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
                console.log("Dados guardados no Firestore.");
            } catch (error) { console.error("Erro ao guardar dados:", error); showMessageBox("Erro ao guardar dados."); }
        }
        async function loadDataFromFirestore() { 
            if (isGuestMode || !currentUserId) {
                allDespesas = []; allReceitas = []; creditCards = []; reserves = []; valesAlimentacao = [];
                renderAllData(); 
                return;
            }
            const userDocRef = doc(db, 'artifacts', appIdFromGlobal, 'users', currentUserId, 'finanbasicData', 'userData');
            try {
                const docSnap = await getDoc(userDocRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    allDespesas = data.allDespesas || []; 
                    allReceitas = data.allReceitas || []; 
                    if (!data.allDespesas && (data.expenses || data.fixedExpenses)) { 
                        console.log("Migrando despesas antigas...");
                        const oldVarExpenses = (data.expenses || []).map(e => ({...e, expenseNature: 'variavel', id: e.id || generateUniqueId() }));
                        const oldFixExpenses = (data.fixedExpenses || []).map(e => ({...e, expenseNature: 'fixa', id: e.id || generateUniqueId() }));
                        allDespesas = [...oldFixExpenses, ...oldVarExpenses];
                    }
                    if (!data.allReceitas && (data.income || data.fixedIncome)) { 
                        console.log("Migrando receitas antigas...");
                        const oldVarIncome = (data.income || []).map(i => ({...i, incomeNature: 'variavel', id: i.id || generateUniqueId() }));
                        const oldFixIncome = (data.fixedIncome || []).map(i => ({...i, incomeNature: 'fixa', id: i.id || generateUniqueId() }));
                        allReceitas = [...oldFixIncome, ...oldVarIncome];
                    }
                    creditCards = data.creditCards || [];
                    reserves = data.reserves || [];
                    valesAlimentacao = data.valesAlimentacao || []; 
                    console.log("Dados carregados.");
                } else {
                     allDespesas = []; allReceitas = []; creditCards = []; reserves = []; valesAlimentacao = [];
                }
            } catch (error) { console.error("Erro ao carregar dados:", error); allDespesas = []; allReceitas = []; creditCards = []; reserves = []; valesAlimentacao = []; }
            renderAllData();
        }
        function renderAllData() { 
            renderCreditCards();
            renderReserves(); 
            renderUnifiedDespesas(); 
            renderUnifiedReceitas(); 
            renderValesAlimentacao(); 
            updateGeneralSummaryDisplay(); 
        }

        async function addCreditCard() { 
            const bankInput = document.getElementById('creditCardBank');
            const limitInput = document.getElementById('creditCardLimit');
            const spentInput = document.getElementById('creditCardSpent'); 
            const closingDay = parseInt(creditCardClosingDayInput.value);
            const paymentDay = parseInt(creditCardPaymentDayInput.value);

            if (!bankInput.value || !limitInput.value) { showMessageBox('Preencha Banco e Limite Total.'); return; }
            if ((closingDay && (isNaN(closingDay) || closingDay < 1 || closingDay > 31)) || 
                (paymentDay && (isNaN(paymentDay) || paymentDay < 1 || paymentDay > 31))) {
                showMessageBox('Dia de Fechamento e Pagamento devem ser números entre 1 e 31.');
                return;
            }

            const newCard = { 
                id: generateUniqueId(), 
                bank: bankInput.value, 
                limit: parseFloat(limitInput.value), 
                usedLimit: parseFloat(spentInput.value || 0),
                closingDay: closingDay || null, 
                paymentDay: paymentDay || null  
            };
            creditCards.push(newCard);
            await saveDataToFirestore(); 
            renderCreditCards(); 
            updateGeneralSummaryDisplay();      // <-- ADICIONE ESTA LINHA
            generateReport();                   // <-- ADICIONE ESTA LINHA
            showMessageBox('Cartão adicionado!');
            bankInput.value = ''; 
            limitInput.value = ''; 
            spentInput.value = '';
            creditCardClosingDayInput.value = '';
            creditCardPaymentDayInput.value = '';
        }
        async function removeCreditCard(index) {
            // ...código existente...
            creditCards.splice(index, 1);
            await saveDataToFirestore();
            renderCreditCards();
            updateGeneralSummaryDisplay();      // <-- ADICIONE ESTA LINHA
            generateReport();                   // <-- ADICIONE ESTA LINHA
            showMessageBox('Cartão removido!');
        }
        async function addReserve() {
            // ...código existente...
            reserves.push(newReserve);
            await saveDataToFirestore();
            renderReserves();
            updateGeneralSummaryDisplay();      // <-- ADICIONE ESTA LINHA
            generateReport();                   // <-- ADICIONE ESTA LINHA
            showMessageBox('Reserva adicionada!');
        }
        async function removeReserve(index) {
            // ...código existente...
            reserves.splice(index, 1);
            await saveDataToFirestore();
            renderReserves();
            updateGeneralSummaryDisplay();      // <-- ADICIONE ESTA LINHA
            generateReport();                   // <-- ADICIONE ESTA LINHA
            showMessageBox('Reserva removida!');
        }
        
        async function addUnifiedDespesa() { 
            const type = document.querySelector('input[name="expenseType"]:checked').value;
            let newDespesaData = { id: generateUniqueId(), expenseNature: type };
            if (type === 'variavel') {
                if (!despesaVariavelData.value || !despesaVariavelCategoria.value || !despesaVariavelDescricao.value || !despesaVariavelValor.value || !despesaVariavelPagamento.value) { showMessageBox('Preencha campos da despesa variável.'); return; }
                Object.assign(newDespesaData, { date: despesaVariavelData.value, category: despesaVariavelCategoria.value, description: despesaVariavelDescricao.value, value: parseFloat(despesaVariavelValor.value), paymentMethod: despesaVariavelPagamento.value, creditCardId: despesaVariavelPagamento.value === 'Crédito' ? despesaVariavelCartaoSelect.value : null, reserveAccountId: despesaVariavelPagamento.value === 'Reserva Financeira' ? despesaVariavelReservaSelect.value : null, observations: despesaVariavelObs.value });
                if (newDespesaData.paymentMethod === 'Crédito' && newDespesaData.creditCardId) { const card = creditCards.find(c=>c.id===newDespesaData.creditCardId); if(card) card.usedLimit += newDespesaData.value; }
                else if (newDespesaData.paymentMethod === 'Reserva Financeira' && newDespesaData.reserveAccountId) { const res = reserves.find(r=>r.id===newDespesaData.reserveAccountId); if(res) { if(res.value < newDespesaData.value) {showMessageBox("Saldo insuficiente na reserva."); return;} res.value -= newDespesaData.value;} }
                despesaVariavelData.value = new Date().toISOString().split('T')[0]; [despesaVariavelCategoria, despesaVariavelDescricao, despesaVariavelValor, despesaVariavelPagamento, despesaVariavelCartaoSelect, despesaVariavelReservaSelect, despesaVariavelObs].forEach(el => el.value = ''); despesaVariavelCartaoContainer.classList.add('hidden'); despesaVariavelReservaContainer.classList.add('hidden');

            } else { // Fixa
                if (!despesaFixaStartDateInput.value || !despesaFixaVencimento.value || !despesaFixaCategoria.value || !despesaFixaDescricao.value || !despesaFixaValor.value || !despesaFixaPagamento.value) { showMessageBox('Preencha todos os campos obrigatórios da despesa fixa, incluindo Data de Início.'); return; }
                Object.assign(newDespesaData, { startDate: despesaFixaStartDateInput.value, dueDate: parseInt(despesaFixaVencimento.value), category: despesaFixaCategoria.value, description: despesaFixaDescricao.value, value: parseFloat(despesaFixaValor.value), paymentMethod: despesaFixaPagamento.value, creditCardId: despesaFixaPagamento.value === 'Crédito' ? despesaFixaCartaoSelect.value : null, reserveAccountId: despesaFixaPagamento.value === 'Reserva Financeira' ? despesaFixaReservaSelect.value : null, observations: despesaFixaObs.value });
                if (newDespesaData.paymentMethod === 'Crédito' && newDespesaData.creditCardId) { const card = creditCards.find(c=>c.id===newDespesaData.creditCardId); if(card) card.usedLimit += newDespesaData.value; }
                else if (newDespesaData.paymentMethod === 'Reserva Financeira' && newDespesaData.reserveAccountId) { const res = reserves.find(r=>r.id===newDespesaData.reserveAccountId); if(res) { if(res.value < newDespesaData.value) {showMessageBox("Saldo insuficiente na reserva."); return;} res.value -= newDespesaData.value;} }
                [despesaFixaStartDateInput, despesaFixaVencimento, despesaFixaCategoria, despesaFixaDescricao, despesaFixaValor, despesaFixaPagamento, despesaFixaCartaoSelect, despesaFixaReservaSelect, despesaFixaObs].forEach(el => el.value = ''); despesaFixaCartaoContainer.classList.add('hidden'); despesaFixaReservaContainer.classList.add('hidden');
            }
            allDespesas.push(newDespesaData); await saveDataToFirestore(); renderUnifiedDespesas();
            if (newDespesaData.paymentMethod === 'Crédito') renderCreditCards();
            if (newDespesaData.paymentMethod === 'Reserva Financeira') renderReserves();
            updateGeneralSummaryDisplay();      // <-- ADICIONE ESTA LINHA
            generateReport();                   // <-- ADICIONE ESTA LINHA
            showMessageBox('Despesa adicionada!');
        }
        async function removeUnifiedDespesa(despesaId) {
            allDespesas = allDespesas.filter(d => d.id !== despesaId);
            await saveDataToFirestore();
            renderUnifiedDespesas();
            updateGeneralSummaryDisplay();      // <-- ADICIONE ESTA LINHA
            generateReport();                   // <-- ADICIONE ESTA LINHA
            showMessageBox('Despesa removida!');
        }
        
        async function addUnifiedReceita() { 
            const type = document.querySelector('input[name="incomeType"]:checked').value;
            let newReceitaData = { id: generateUniqueId(), incomeNature: type };
            if(type === 'variavel') {
                 if(!receitaVariavelData.value || !receitaVariavelDescricao.value || !receitaVariavelValor.value || !receitaVariavelForma.value) { showMessageBox("Preencha campos da receita variável."); return; }
                Object.assign(newReceitaData, { date: receitaVariavelData.value, description: receitaVariavelDescricao.value, value: parseFloat(receitaVariavelValor.value), receiptMethod: receitaVariavelForma.value, reserveAccountId: receitaVariavelForma.value === 'Reserva Financeira' ? receitaVariavelReservaSelect.value : null });
                if(newReceitaData.receiptMethod === 'Reserva Financeira' && newReceitaData.reserveAccountId) { const res = reserves.find(r=>r.id === newReceitaData.reserveAccountId); if(res) res.value += newReceitaData.value; }
                receitaVariavelData.value = new Date().toISOString().split('T')[0]; [receitaVariavelDescricao, receitaVariavelValor, receitaVariavelForma, receitaVariavelReservaSelect].forEach(el => el.value = ''); receitaVariavelReservaContainer.classList.add('hidden');

            } else { // Fixa
                if(!receitaFixaStartDateInput.value || !receitaFixaDescricao.value || !receitaFixaValor.value || !receitaFixaDia.value || !receitaFixaForma.value) { showMessageBox("Preencha campos da receita fixa, incluindo Data de Início."); return; }
                Object.assign(newReceitaData, { startDate: receitaFixaStartDateInput.value, description: receitaFixaDescricao.value, value: parseFloat(receitaFixaValor.value), day: parseInt(receitaFixaDia.value), receiptMethod: receitaFixaForma.value, reserveAccountId: receitaFixaForma.value === 'Reserva Financeira' ? receitaFixaReservaSelect.value : null });
                if(newReceitaData.receiptMethod === 'Reserva Financeira' && newReceitaData.reserveAccountId) { const res = reserves.find(r=>r.id === newReceitaData.reserveAccountId); if(res) res.value += newReceitaData.value; }
                [receitaFixaStartDateInput, receitaFixaDescricao, receitaFixaValor, receitaFixaDia, receitaFixaForma, receitaFixaReservaSelect].forEach(el => el.value = ''); receitaFixaReservaContainer.classList.add('hidden');
            }
            allReceitas.push(newReceitaData); await saveDataToFirestore(); renderUnifiedReceitas();
            if(newReceitaData.receiptMethod === 'Reserva Financeira') renderReserves();
            updateGeneralSummaryDisplay();      // <-- ADICIONE ESTA LINHA
            generateReport();                   // <-- ADICIONE ESTA LINHA
            showMessageBox("Receita adicionada!");
        }
        async function removeUnifiedReceita(receitaId) {
            allReceitas = allReceitas.filter(r => r.id !== receitaId);
            await saveDataToFirestore();
            renderUnifiedReceitas();
            updateGeneralSummaryDisplay();      // <-- ADICIONE ESTA LINHA
            generateReport();                   // <-- ADICIONE ESTA LINHA
            showMessageBox('Receita removida!');
        }
        async function addOrUpdateValeAlimentacao() {
            // ...código existente...
            // Adiciona ou atualiza o vale
            await saveDataToFirestore();
            renderValesAlimentacao();
            updateGeneralSummaryDisplay();      // <-- ADICIONE ESTA LINHA
            generateReport();                   // <-- ADICIONE ESTA LINHA
            showMessageBox('Vale alimentação atualizado!');
        }
        async function removeValeAlimentacao(valeId) {
            valesAlimentacao = valesAlimentacao.filter(v => v.id !== valeId);
            await saveDataToFirestore();
            renderValesAlimentacao();
            updateGeneralSummaryDisplay();      // <-- ADICIONE ESTA LINHA
            generateReport();                   // <-- ADICIONE ESTA LINHA
            showMessageBox('Vale alimentação removido!');
        }
        
        function translateFirebaseError(errorCode) { /* ... */ }

        async function getFinancialAnalysis() { /* ... */ }
        async function askFinancialQuestionToAI() { /* ... */ }

        function populateDateFilters() { /* ... */ }

        function updateUserAuthAreaUI() {
            if (!userAuthArea) { console.warn("userAuthArea não encontrado no updateUserAuthAreaUI"); return; }
            userAuthArea.innerHTML = ''; 

            const currentUser = auth.currentUser; 

            if (isGuestMode || !currentUser) {
                if(guestModeMessageContainer) guestModeMessageContainer.classList.remove('hidden');
                const loginTrigger = document.createElement('button');
                loginTrigger.id = 'loginTriggerBtn';
                loginTrigger.className = 'auth-button login-trigger-btn';
                loginTrigger.textContent = 'Login / Registrar';
                loginTrigger.onclick = () => { if(authScreenModal) authScreenModal.classList.remove('hidden'); };
                
                const guestInfo = document.createElement('span');
                guestInfo.className = 'text-sm text-gray-600 italic';
                guestInfo.textContent = '(Modo Convidado)';

                userAuthArea.appendChild(loginTrigger);
                userAuthArea.appendChild(guestInfo);
            } else {
                if(guestModeMessageContainer) guestModeMessageContainer.classList.add('hidden');
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
                profileTrigger.className = 'user-profile-trigger';
                // profileTrigger.onclick = () => showSection('user-profile-section'); // Removido

                const avatarDiv = document.createElement('div');
                avatarDiv.className = 'user-avatar';
                if (photoURL) {
                    const img = document.createElement('img');
                    img.src = photoURL;
                    img.alt = displayName;
                    img.onerror = () => { 
                        avatarDiv.innerHTML = `<span class="text-lg">${displayName.charAt(0).toUpperCase()}</span>`;
                    };
                    avatarDiv.appendChild(img);
                } else {
                    avatarDiv.innerHTML = `<span class="text-lg">${displayName.charAt(0).toUpperCase()}</span>`;
                }

                const nameSpan = document.createElement('span');
                nameSpan.className = 'user-name-display';
                nameSpan.textContent = displayName;

                profileTrigger.appendChild(avatarDiv);
                profileTrigger.appendChild(nameSpan);
                userAuthArea.appendChild(profileTrigger);
            }
        }
        
        function populateUserProfile() {
            const user = auth.currentUser;
            if (!user || !profileDisplayNameInput || !profileEmailInput || !profileUserImage || !profileUserInitials || !passwordChangeSection) return;

            profileDisplayNameInput.value = user.displayName || (user.email ? user.email.split('@')[0] : "Usuário");
            profileEmailInput.value = user.email || "Não disponível";
            
            if (user.photoURL) {
                profileUserImage.src = user.photoURL;
                profileUserImage.classList.remove('hidden');
                profileUserInitials.classList.add('hidden');
            } else {
                profileUserImage.classList.add('hidden');
                const initial = (user.displayName || (user.email ? user.email.charAt(0) : "U")).charAt(0).toUpperCase();
                profileUserInitials.textContent = initial;
                profileUserInitials.classList.remove('hidden');
            }
            passwordChangeSection.style.display = user.providerData.some(p => p.providerId === 'password') ? 'block' : 'none';
            
            const isGoogleUser = user.providerData.some(p => p.providerId === GoogleAuthProvider.PROVIDER_ID);
            const canEditProfile = !isGuestMode && !isGoogleUser;

            profileDisplayNameInput.disabled = !canEditProfile;
            if(changeProfilePhotoBtn) changeProfilePhotoBtn.style.display = canEditProfile ? 'inline-block' : 'none';
            if(saveProfileChangesBtn) saveProfileChangesBtn.disabled = isGuestMode; 
            if(profileNewPasswordInput) profileNewPasswordInput.disabled = isGuestMode || isGoogleUser;
            if(profileCurrentPasswordInput) profileCurrentPasswordInput.disabled = isGuestMode || isGoogleUser;
        }


        document.addEventListener('DOMContentLoaded', async () => {
            // Cache DOM Elements
            authScreenModal = document.getElementById('authScreenModal'); 
            closeAuthModalBtn = document.getElementById('closeAuthModalBtn');
            userAuthArea = document.getElementById('userAuthArea');
            guestModeMessageContainer = document.getElementById('guestModeMessageContainer');

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

            logoutBtn = document.getElementById('logoutBtn'); 
            appUserIdSpan = document.getElementById('appUserId'); 
            totalValueSpan = document.getElementById('totalValue');
            
            despesasSection = document.getElementById('despesas-section');
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

            receitasSection = document.getElementById('receitas-section');
            formReceitaVariavel = document.getElementById('formReceitaVariavel');
            formReceitaFixa = document.getElementById('formReceitaFixa');
            addReceitaBtn = document.getElementById('addReceitaBtn');
            tabelaReceitasUnificada = document.getElementById('tabelaReceitasUnificada');
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

            valeAlimentacaoSection = document.getElementById('vale-alimentacao-section');
            valeNomeInput = document.getElementById('valeNome');
            valeSaldoInicialInput = document.getElementById('valeSaldoInicial');
            valeDataCargaInput = document.getElementById('valeDataCarga');
            addValeAlimentacaoBtn = document.getElementById('addValeAlimentacaoBtn');
            tabelaValesAlimentacao = document.getElementById('tabelaValesAlimentacao');
            
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

            addCreditCardBtn = document.getElementById('addCreditCardBtn');
            creditCardTableBody = document.getElementById('creditCardTableBody');
            creditCardTransactionsContainer = document.getElementById('creditCardTransactionsContainer');
            selectedCardNameSpan = document.getElementById('selectedCardName');
            creditCardTransactionsTableBody = document.getElementById('creditCardTransactionsTableBody');
            selectedCardAvailableLimitSpan = document.getElementById('selectedCardAvailableLimit');
            creditCardClosingDayInput = document.getElementById('creditCardClosingDay');
            creditCardPaymentDayInput = document.getElementById('creditCardPaymentDay');

            addReserveBtn = document.getElementById('addReserveBtn');
            reserveTableBody = document.getElementById('reserveTableBody');
            totalReserveValueSpan = document.getElementById('totalReserveValue');
            copyToExcelBtn = document.getElementById('copyToExcelBtn');
            mainAppTitle = document.getElementById('mainAppTitle');
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

            const closeMessageBoxElement = document.getElementById('closeMessageBox');
            if (closeMessageBoxElement) closeMessageBoxElement.addEventListener('click', closeMessageBoxHandler);

            const today = new Date().toISOString().split('T')[0];
            if (despesaVariavelData) despesaVariavelData.value = today;
            if (despesaFixaStartDateInput) despesaFixaStartDateInput.value = today; 
            if (receitaVariavelData) receitaVariavelData.value = today;
            if (receitaFixaStartDateInput) receitaFixaStartDateInput.value = today; 
            if (valeDataCargaInput) valeDataCargaInput.value = today;
            
            populateDateFilters(); 
            
            if (authScreenModal && closeAuthModalBtn) {
                closeAuthModalBtn.addEventListener('click', () => {
                    authScreenModal.classList.add('hidden');
                    const authMessage = document.getElementById('authMessage');
                    if (authMessage) authMessage.textContent = '';
                });
            }
            
            const loginBtnModal = document.getElementById('loginBtnModal'); 
            const registerBtnModal = document.getElementById('registerBtnModal'); 
            const googleLoginBtnModal = document.getElementById('googleLoginBtnModal'); 

            function showAuthError(message) {
                const authMessage = document.getElementById('authMessage');
                if (authMessage) {
                    authMessage.textContent = message;
                    authMessage.classList.remove('hidden');
                }
            }

            if (loginBtnModal) loginBtnModal.addEventListener('click', async () => { 
                const emailEl = document.getElementById('authEmail');
                const passwordEl = document.getElementById('authPassword');
                const authMessage = document.getElementById('authMessage');
                if (!emailEl || !passwordEl) return;
                const email = emailEl.value;
                const password = passwordEl.value;
                if (!email || !password) { 
                    showAuthError('Preencha email e senha.');
                    return; 
                }
                try { 
                    await signInWithEmailAndPassword(auth, email, password); 
                    if (authMessage) authMessage.textContent = '';
                } 
                catch (error) { 
                    showAuthError("Erro no Login: " + translateFirebaseError(error.code));
                }
            });

            if (registerBtnModal) registerBtnModal.addEventListener('click', async () => { 
                const emailEl = document.getElementById('authEmail');
                const passwordEl = document.getElementById('authPassword');
                const authMessage = document.getElementById('authMessage');
                if (!emailEl || !passwordEl) return;
                const email = emailEl.value;
                const password = passwordEl.value;
                if (!email || !password) { 
                    showAuthError('Preencha email e senha.');
                    return; 
                }
                try { 
                    await createUserWithEmailAndPassword(auth, email, password); 
                    if (authMessage) authMessage.textContent = '';
                } 
                catch (error) { 
                    showAuthError("Erro no Registro: " + translateFirebaseError(error.code));
                }
            });

            if (googleLoginBtnModal) googleLoginBtnModal.addEventListener('click', async () => { 
                const authMessage = document.getElementById('authMessage');
                try { 
                    await signInWithPopup(auth, googleProvider); 
                    if (authMessage) authMessage.textContent = '';
                } 
                catch (error) { 
                    // Mostre o erro completo para depuração
                    showAuthError("Erro no Login com Google: " + (error.message || error.code || error));
                    console.error(error);
                }
            });


            onAuthStateChanged(auth, async (user) => { 
                authUserIdSpan = document.getElementById('authUserId'); 
                if (user) { 
                    currentUserId = user.uid; 
                    isGuestMode = false;
                    console.log("Usuário autenticado:", user.uid, user.displayName);
                    if(authUserIdSpan) authUserIdSpan.textContent = currentUserId; 
                    if(appUserIdSpan) appUserIdSpan.textContent = currentUserId; 
                    await loadDataFromFirestore(); 
                    if(authScreenModal) authScreenModal.classList.add('hidden'); 
                } else { 
                    currentUserId = `guest-${generateUniqueId()}`; 
                    isGuestMode = true;
                    console.log("Modo Convidado Ativado. Guest ID:", currentUserId);
                    if(authUserIdSpan) authUserIdSpan.textContent = "Convidado"; 
                    if(appUserIdSpan) appUserIdSpan.textContent = "Convidado"; 
                    allDespesas = []; allReceitas = []; creditCards = []; reserves = []; valesAlimentacao = []; 
                    renderAllData(); 
                }
                updateUserAuthAreaUI(); 
                const homeSection = document.getElementById('home-section');
                if (homeSection && homeSection.classList.contains('active') && guestModeMessageContainer) { 
                     guestModeMessageContainer.classList.toggle('hidden', !isGuestMode);
                }
            });

            if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
                 try {
                    console.log("Tentando login com token customizado após DOM ready.");
                    await signInWithCustomToken(auth, __initial_auth_token);
                } catch (error) {
                    console.error("Erro ao tentar login com token customizado:", error);
                    if (!auth.currentUser) { 
                        try { await signInAnonymously(auth); } catch (e) { console.error("Falha no fallback para anônimo", e); }
                    }
                }
            } else if (!auth.currentUser) { 
                try {
                    console.log("Tentando login anônimo após DOM ready.");
                    await signInAnonymously(auth);
                } catch (error) {
                    console.error("Erro ao tentar login anônimo inicial:", error);
                }
            }


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

            if (addDespesaBtn) addDespesaBtn.addEventListener('click', addUnifiedDespesa);
            if (addReceitaBtn) addReceitaBtn.addEventListener('click', addUnifiedReceita);
            if (addValeAlimentacaoBtn) addValeAlimentacaoBtn.addEventListener('click', addOrUpdateValeAlimentacao);
            
            const setupUnifiedPaymentListener = (methodSelect, cardContainer, cardSelect, reserveContainer, reserveSelect) => { 
                if (methodSelect) {
                    methodSelect.addEventListener('change', () => {
                        const showCard = methodSelect.value === 'Crédito';
                        const showReserve = methodSelect.value === 'Reserva Financeira';
                        if(cardContainer) cardContainer.classList.toggle('hidden', !showCard);
                        if(showCard && cardSelect) updateCreditCardDropdowns(); else if(cardSelect) cardSelect.value = '';
                        if(reserveContainer) reserveContainer.classList.toggle('hidden', !showReserve);
                        if(showReserve && reserveSelect) updateReserveAccountDropdowns(); else if(reserveSelect) reserveSelect.value = '';
                    });
                }
            };
            setupUnifiedPaymentListener(despesaVariavelPagamento, despesaVariavelCartaoContainer, despesaVariavelCartaoSelect, despesaVariavelReservaContainer, despesaVariavelReservaSelect);
            setupUnifiedPaymentListener(despesaFixaPagamento, despesaFixaCartaoContainer, despesaFixaCartaoSelect, despesaFixaReservaContainer, despesaFixaReservaSelect);
            
            const setupUnifiedReceiptListener = (methodSelect, reserveContainer, reserveSelect) => { 
                 if(methodSelect) {
                    methodSelect.addEventListener('change', () => {
                        const showReserve = methodSelect.value === 'Reserva Financeira';
                        if(reserveContainer) reserveContainer.classList.toggle('hidden', !showReserve);
                        if(showReserve && reserveSelect) updateReserveAccountDropdowns(); else if(reserveSelect) reserveSelect.value = '';
                    });
                }
            };
            setupUnifiedReceiptListener(receitaVariavelForma, receitaVariavelReservaContainer, receitaVariavelReservaSelect);
            setupUnifiedReceiptListener(receitaFixaForma, receitaFixaReservaContainer, receitaFixaReservaSelect);

            if (addCreditCardBtn) addCreditCardBtn.addEventListener('click', addCreditCard);
            if (addReserveBtn) addReserveBtn.addEventListener('click', addReserve);

            const sidebarItems = document.querySelectorAll('.sidebar-item');
            sidebarItems.forEach(item => { 
                item.addEventListener('click', () => {
                    const targetId = item.dataset.target;
                    if (targetId) showSection(targetId);
                });
            });
            if (logoutBtn) logoutBtn.addEventListener('click', async () => { 
                try {
                    await signOut(auth); 
                    showMessageBox("Você saiu da sua conta.");
                } catch (error) { console.error("Logout error:", error); showMessageBox("Erro ao sair: " + translateFirebaseError(error.code)); }
            });
            if (copyToExcelBtn) copyToExcelBtn.addEventListener('click', copyReportToExcel);
            if (closeReportModalBtn) closeReportModalBtn.addEventListener('click', () => showSection('general-summary-section'));

            if (analyzeFinanceBtn) analyzeFinanceBtn.addEventListener('click', getFinancialAnalysis);
            if (closeAiModalBtn) closeAiModalBtn.addEventListener('click', () => aiAnalysisModal.classList.add('hidden'));
            if (closeAiModalBtnBottom) closeAiModalBtnBottom.addEventListener('click', () => aiAnalysisModal.classList.add('hidden'));
            if (copyAiAnalysisBtn) { 
                copyAiAnalysisBtn.addEventListener('click', () => {
                    const textToCopy = aiAnalysisResult.innerText || aiAnalysisResult.textContent;
                    const textarea = document.createElement('textarea');
                    textarea.value = textToCopy;
                    document.body.appendChild(textarea);
                    textarea.select();
                    try { document.execCommand('copy'); showMessageBox('Análise copiada!'); } 
                    catch (err) { showMessageBox('Falha ao copiar.'); console.error('Falha ao copiar IA: ', err); }
                    document.body.removeChild(textarea);
                });
            }
            if(askAiBtn) askAiBtn.addEventListener('click', askFinancialQuestionToAI);
            if(filterReportBtn) filterReportBtn.addEventListener('click', () => generateReport(true)); 

            showSection('home-section'); 

        }); 

        function showSection(targetId) { 
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
                    populateUserProfile();
                }

                const activeH2 = targetSection.querySelector('h2');
                if (mainAppTitle) { 
                    const isHomeOrSummary = targetId === 'home-section' || targetId === 'general-summary-section';
                    mainAppTitle.style.display = isHomeOrSummary ? 'block' : 'none';
                    if (isHomeOrSummary) {
                        mainAppTitle.classList.remove('animated-title'); void mainAppTitle.offsetWidth; mainAppTitle.classList.add('animated-title');
                        if(activeH2 && activeH2 !== mainAppTitle) activeH2.classList.remove('animated-title'); 
                    } else if (activeH2) {
                        activeH2.classList.remove('animated-title'); void activeH2.offsetWidth; activeH2.classList.add('animated-title');
                    }
                 }
                if (targetId !== 'credit-cards-section' && creditCardTransactionsContainer) creditCardTransactionsContainer.classList.add('hidden');
            } else { console.warn(`Target section with ID "${targetId}" not found.`); }
        }
        
        function updateGeneralSummaryDisplay() { 
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

            if(summaryFixedIncomeEl) summaryFixedIncomeEl.textContent = formatCurrency(recFixas);
            if(summaryFixedExpensesEl) summaryFixedExpensesEl.textContent = formatCurrency(despFixasAll);
            if(summaryFixedBalanceEl) { summaryFixedBalanceEl.textContent = formatCurrency(balancoFixas); summaryFixedBalanceEl.className = `text-right ${balancoFixas >= 0 ? 'text-green-600' : 'text-red-600'}`; }
            if(summaryVariableIncomeEl) summaryVariableIncomeEl.textContent = formatCurrency(recVariaveis);
            if(summaryVariableExpensesEl) summaryVariableExpensesEl.textContent = formatCurrency(despVariaveisAll);
            if(summaryVariableBalanceEl) { summaryVariableBalanceEl.textContent = formatCurrency(balancoVariaveis); summaryVariableBalanceEl.className = `text-right ${balancoVariaveis >= 0 ? 'text-green-600' : 'text-red-600'}`; }
            if(summaryTotalIncomeEl) summaryTotalIncomeEl.textContent = formatCurrency(totalReceitas);
            if(summaryTotalExpensesEl) summaryTotalExpensesEl.textContent = formatCurrency(totalDespesasAll);
            if(summaryTotalBalanceEl) { summaryTotalBalanceEl.textContent = formatCurrency(balancoGeral); summaryTotalBalanceEl.className = `text-right font-semibold ${balancoGeral >= 0 ? 'text-green-700' : 'text-red-700'}`; }
            if(summaryCardLimitEl) summaryCardLimitEl.textContent = formatCurrency(limiteTotalCartoes);
            if(summaryCardExpensesEl) summaryCardExpensesEl.textContent = formatCurrency(limiteUsadoCartoes);
            if(summaryCardAvailableEl) summaryCardAvailableEl.textContent = formatCurrency(disponivelCartoes);
            if(summaryCardDueEl) summaryCardDueEl.textContent = formatCurrency(totalAPagarCartoes);
            if(summaryTotalReserveEl) summaryTotalReserveEl.textContent = formatCurrency(valorTotalReserva);
            if (totalValueSpan) { totalValueSpan.textContent = formatCurrency(balancoGeral); totalValueSpan.className = `text-xl sm:text-2xl font-bold ${balancoGeral >= 0 ? 'text-green-700' : 'text-red-700'}`; }
        }
     function generateReport(isFiltered = false) {
    let despesasFiltradas = allDespesas;
    let receitasFiltradas = allReceitas;

    // Obter as datas de início e fim dos novos campos
    const reportStartDateInput = document.getElementById('reportStartDate');
    const reportEndDateInput = document.getElementById('reportEndDate');

    if (isFiltered && reportStartDateInput && reportEndDateInput) {
        const startDate = reportStartDateInput.value ? new Date(reportStartDateInput.value + 'T00:00:00Z') : null;
        const endDate = reportEndDateInput.value ? new Date(reportEndDateInput.value + 'T23:59:59Z') : null;

        // Se ambas as datas forem selecionadas, aplicar o filtro por período
        if (startDate !== null && endDate !== null) {
            despesasFiltradas = allDespesas.filter(d => {
                const dataDespesa = new Date(d.date + 'T00:00:00Z');
                return dataDespesa >= startDate && dataDespesa <= endDate;
            });

            receitasFiltradas = allReceitas.filter(r => {
                const dataReceita = new Date(r.date + 'T00:00:00Z');
                return dataReceita >= startDate && dataReceita <= endDate;
            });
        } else if (isFiltered && reportMonthSelect && reportYearInput) {
            // Lógica de filtragem por mês e ano existente (manteremos por enquanto, caso queira ter ambas as opções)
            const mesSelecionado = reportMonthSelect.value !== "" ? parseInt(reportMonthSelect.value) : null;
            const anoSelecionado = reportYearInput.value ? parseInt(reportYearInput.value) : new Date().getFullYear();

            if (mesSelecionado !== null) {
                despesasFiltradas = allDespesas.filter(d => {
                    if (d.expenseNature === 'variavel') {
                        const dataDespesa = new Date(d.date + 'T00:00:00Z');
                        return dataDespesa.getUTCMonth() === mesSelecionado && dataDespesa.getUTCFullYear() === anoSelecionado;
                    } else {
                        const inicioRecorrencia = new Date(d.startDate + 'T00:00:00Z');
                        const dataFiltroFimMes = new Date(Date.UTC(anoSelecionado, mesSelecionado + 1, 0));
                        return inicioRecorrencia <= dataFiltroFimMes && d.dueDate;
                    }
                });
                receitasFiltradas = allReceitas.filter(r => {
                    if (r.incomeNature === 'variavel') {
                        const dataReceita = new Date(r.date + 'T00:00:00Z');
                        return dataReceita.getUTCMonth() === mesSelecionado && dataReceita.getUTCFullYear() === anoSelecionado;
                    } else {
                        const inicioRecorrencia = new Date(r.startDate + 'T00:00:00Z');
                        const dataFiltroFimMes = new Date(Date.UTC(anoSelecionado, mesSelecionado + 1, 0));
                        return inicioRecorrencia <= dataFiltroFimMes && r.day;
                    }
                });
            }
        }
    }
}          
            const reportCreditCardTableBody = document.getElementById('reportCreditCardTableBody');
            if (reportCreditCardTableBody) {
                reportCreditCardTableBody.innerHTML = '';
                creditCards.forEach(card => {
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
                reserves.forEach(reserve => {
                    const row = reportReserveTableBody.insertRow();
                    row.insertCell(0).textContent = reserve.description;
                    row.insertCell(1).textContent = formatCurrency(reserve.value);
                    row.insertCell(2).textContent = reserve.source;
                    row.insertCell(3).textContent = reserve.location;
                });
            }
            const reportAllReceitasTableBody = document.getElementById('reportAllReceitasTableBody');
            if(reportAllReceitasTableBody){
                reportAllReceitasTableBody.innerHTML = '';
                receitasFiltradas.forEach(item => { 
                    const row = reportAllReceitasTableBody.insertRow();
                    row.insertCell(0).textContent = item.date || item.day;
                    row.insertCell(1).textContent = item.incomeNature === 'fixa' ? 'Fixa' : 'Variável';
                    row.insertCell(2).textContent = item.description;
                    row.insertCell(3).textContent = formatCurrency(item.value);
                    let receiptDetail = item.receiptMethod;
                    if (item.receiptMethod === 'Reserva Financeira' && item.reserveAccountId) {
                        const reserve = reserves.find(r => r.id === item.reserveAccountId);
                        receiptDetail += ` (${reserve ? reserve.description : 'Reserva Removida'})`;
                    }
                    row.insertCell(4).textContent = receiptDetail;
                });
            }
            const reportAllDespesasTableBody = document.getElementById('reportAllDespesasTableBody');
            if(reportAllDespesasTableBody){
                reportAllDespesasTableBody.innerHTML = '';
                despesasFiltradas.forEach(item => { 
                    const row = reportAllDespesasTableBody.insertRow();
                    row.insertCell(0).textContent = item.date || item.dueDate;
                    row.insertCell(1).textContent = item.expenseNature === 'fixa' ? 'Fixa' : 'Variável';
                    row.insertCell(2).textContent = item.category;
                    row.insertCell(3).textContent = item.description;
                    row.insertCell(4).textContent = formatCurrency(item.value);
                    let paymentDetail = item.paymentMethod;
                    if (item.paymentMethod === 'Crédito' && item.creditCardId) {
                        const card = creditCards.find(c => c.id === item.creditCardId);
                        paymentDetail += ` (${card ? card.bank : 'Cartão Removido'})`;
                    } else if (item.paymentMethod === 'Reserva Financeira' && item.reserveAccountId) {
                        const reserve = reserves.find(r => r.id === item.reserveAccountId);
                        paymentDetail += ` (${reserve ? reserve.description : 'Reserva Removida'})`;
                    }
                    row.insertCell(5).textContent = paymentDetail;
                    row.insertCell(6).textContent = item.observations || '-';
                });
            }
            const reportValesAlimentacaoTableBody = document.getElementById('reportValesAlimentacaoTableBody');
            if(reportValesAlimentacaoTableBody){
                reportValesAlimentacaoTableBody.innerHTML = '';
                valesAlimentacao.forEach(vale => {
                    const row = reportValesAlimentacaoTableBody.insertRow();
                    row.insertCell(0).textContent = vale.nome;
                    row.insertCell(1).textContent = formatCurrency(vale.saldo);
                    row.insertCell(2).textContent = vale.dataUltimaCarga || '-';
                });
            }
        
        function copyReportToExcel() { 
            let csvContent = "FINANBASIC - Relatório Detalhado\n\n";
            const createTableCSV = (title, headers, data, rowFn) => {
                csvContent += `${title}\n`;
                csvContent += headers.join('\t') + '\n';
                data.forEach(item => csvContent += rowFn(item).join('\t') + '\n');
                csvContent += '\n';
            };
            createTableCSV("Detalhes dos Cartões de Crédito", ["Banco", "Limite Total (R$)", "Limite Usado (R$)", "Disponível (R$)", "Dia Fech.", "Dia Pag."], creditCards, c => [c.bank, c.limit.toFixed(2), c.usedLimit.toFixed(2), (c.limit - c.usedLimit).toFixed(2), c.closingDay || '', c.paymentDay || '']);
            createTableCSV("Detalhes da Reserva Financeira", ["Descrição", "Valor (R$)", "Fonte", "Local"], reserves, r => [r.description, r.value.toFixed(2), r.source, r.location]);
            createTableCSV("Detalhes das Receitas", ["Data/Dia Rec.", "Tipo", "Descrição", "Valor (R$)", "Forma Rec."], allReceitas, i => { 
                let receiptDetail = i.receiptMethod;
                if (i.receiptMethod === 'Reserva Financeira' && i.reserveAccountId) receiptDetail += ` (${reserves.find(r=>r.id === i.reserveAccountId)?.description || 'N/A'})`;
                return [i.date || i.day, i.incomeNature, i.description, i.value.toFixed(2), receiptDetail];
            });
            createTableCSV("Detalhes das Despesas", ["Data/Venc.", "Tipo", "Categoria", "Descrição", "Valor (R$)", "Pagamento", "Observações"], allDespesas, e => {
                let paymentDetail = e.paymentMethod;
                if (e.paymentMethod === 'Crédito' && e.creditCardId) paymentDetail += ` (${creditCards.find(c=>c.id === e.creditCardId)?.bank || 'N/A'})`;
                if (e.paymentMethod === 'Reserva Financeira' && e.reserveAccountId) paymentDetail += ` (${reserves.find(r=>r.id === e.reserveAccountId)?.description || 'N/A'})`;
                return [e.date || e.dueDate, e.expenseNature, e.category, e.description, e.value.toFixed(2), paymentDetail, e.observations || '-'];
            });
            createTableCSV("Detalhes dos Vales Alimentação", ["Nome", "Saldo Atual (R$)", "Última Carga"], valesAlimentacao, v => [v.nome, v.saldo.toFixed(2), v.dataUltimaCarga || '-']);
            
            const textarea = document.createElement('textarea');
            textarea.value = csvContent.replace(/\./g, ','); 
            document.body.appendChild(textarea);
            textarea.select();
            try {
                document.execCommand('copy');
                showMessageBox('Dados copiados para a área de transferência! Cole no Excel.');
            } catch (err) {
                showMessageBox('Falha ao copiar. Por favor, copie manualmente.');
                console.error('Falha ao copiar dados: ', err);
            }
            document.body.removeChild(textarea);
        }

