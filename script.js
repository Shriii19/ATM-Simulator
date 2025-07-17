        let balance = 5000.00;
        let pin = '1234';
        let currentAction = '';
        let isProcessing = false;

        function formatCurrency(amount) {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD'
            }).format(amount);
        }

        function showScreen(screenId) {
            document.querySelectorAll('.screen > div').forEach(screen => {
                screen.classList.add('hidden');
            });
            document.getElementById(screenId).classList.remove('hidden');
            document.getElementById(screenId).classList.add('fade-in');
        }

        function submitPin() {
            if (isProcessing) return;
            
            const pinInput = document.getElementById('pinInput');
            const enteredPin = pinInput.value;
            const errorDiv = document.getElementById('pinError');
            
            if (enteredPin.length !== 4) {
                showError('Please enter a 4-digit PIN');
                return;
            }
            
            isProcessing = true;
            
            // Simulate processing delay
            setTimeout(() => {
                if (enteredPin === pin) {
                    errorDiv.classList.add('hidden');
                    showScreen('mainMenu');
                } else {
                    showError('Incorrect PIN. Please try again.');
                    pinInput.value = '';
                    pinInput.focus();
                }
                isProcessing = false;
            }, 1000);
        }

        function showError(message) {
            const errorDiv = document.getElementById('pinError');
            errorDiv.textContent = message;
            errorDiv.classList.remove('hidden');
        }

        function showAction(action) {
            currentAction = action;
            const messageDiv = document.getElementById('transactionMessage');
            const balanceView = document.getElementById('balanceView');
            const transactionForm = document.getElementById('transactionForm');
            const transactionResult = document.getElementById('transactionResult');
            
            // Hide all transaction elements first
            balanceView.classList.add('hidden');
            transactionForm.classList.add('hidden');
            transactionResult.classList.add('hidden');
            
            switch(action) {
                case 'balance':
                    messageDiv.textContent = 'Account Balance Inquiry';
                    document.getElementById('balanceAmount').textContent = formatCurrency(balance);
                    balanceView.classList.remove('hidden');
                    break;
                case 'withdraw':
                    messageDiv.textContent = 'Cash Withdrawal';
                    transactionForm.classList.remove('hidden');
                    document.getElementById('amountInput').placeholder = 'Enter withdrawal amount ($)';
                    break;
                case 'deposit':
                    messageDiv.textContent = 'Cash Deposit';
                    transactionForm.classList.remove('hidden');
                    document.getElementById('amountInput').placeholder = 'Enter deposit amount ($)';
                    break;
            }
            
            showScreen('transactionScreen');
        }

        function performTransaction() {
            if (isProcessing) return;
            
            const amountInput = document.getElementById('amountInput');
            const amount = parseFloat(amountInput.value);
            const resultDiv = document.getElementById('transactionResult');
            
            if (!amount || amount <= 0) {
                showTransactionMessage('Please enter a valid amount greater than $0.00', 'error');
                return;
            }
            
            isProcessing = true;
            
            // Simulate processing delay
            setTimeout(() => {
                let message = '';
                let messageType = '';
                
                if (currentAction === 'withdraw') {
                    if (amount > balance) {
                        message = 'Insufficient funds. Your current balance is ' + formatCurrency(balance);
                        messageType = 'error';
                    } else if (amount > 500) {
                        message = 'Daily withdrawal limit is $500.00';
                        messageType = 'error';
                    } else {
                        balance -= amount;
                        message = `Transaction successful!<br>You have withdrawn ${formatCurrency(amount)}<br>Your new balance is ${formatCurrency(balance)}<br><br>Please take your cash from the dispenser.`;
                        messageType = 'success';
                    }
                } else if (currentAction === 'deposit') {
                    if (amount > 10000) {
                        message = 'Daily deposit limit is $10,000.00';
                        messageType = 'error';
                    } else {
                        balance += amount;
                        message = `Transaction successful!<br>You have deposited ${formatCurrency(amount)}<br>Your new balance is ${formatCurrency(balance)}`;
                        messageType = 'success';
                    }
                }
                
                showTransactionMessage(message, messageType);
                amountInput.value = '';
                document.getElementById('transactionForm').classList.add('hidden');
                isProcessing = false;
            }, 1500);
        }

        function showTransactionMessage(message, type) {
            const resultDiv = document.getElementById('transactionResult');
            resultDiv.innerHTML = `<div class="${type}-message">${message}</div>`;
            resultDiv.classList.remove('hidden');
        }

        function goBack() {
            showScreen('mainMenu');
        }

        function logout() {
            // Reset form
            document.getElementById('pinInput').value = '';
            document.getElementById('amountInput').value = '';
            document.getElementById('pinError').classList.add('hidden');
            currentAction = '';
            
            showScreen('loginScreen');
            document.getElementById('pinInput').focus();
        }

        // Allow Enter key for PIN submission
        document.getElementById('pinInput').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                submitPin();
            }
        });

        // Allow Enter key for transaction amount
        document.getElementById('amountInput').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performTransaction();
            }
        });

        // Focus on PIN input when page loads
        window.addEventListener('load', function() {
            document.getElementById('pinInput').focus();
        });
