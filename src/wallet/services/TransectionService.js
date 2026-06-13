import Wallet from "../models/Wallet.js";

class TransactionService {

    constructor() {

        this.STORAGE_KEY =
            "wallet_transactions";

        this.WALLET_KEY =
            "wallets";

        this.LEDGER_KEY =
            "ledger_entries";

        this.TRANSACTION_TYPES = {

            DEPOSIT: "deposit",
            WITHDRAW: "withdraw",
            BET: "bet",
            WIN: "win",
            LOSS: "loss",
            BONUS: "bonus",
            REWARD: "reward",
            REFUND: "refund"
        };

        this.STATUS = {

            SUCCESS: "success",
            FAILED: "failed",
            PENDING: "pending",
            REVERSED: "reversed"
        };
    }

    /* =========================
        STORAGE HELPERS
    ========================= */

    _getWallets() {

        return JSON.parse(
            localStorage.getItem(
                this.WALLET_KEY
            ) || "[]"
        );
    }

    _saveWallets(wallets) {

        localStorage.setItem(
            this.WALLET_KEY,
            JSON.stringify(wallets)
        );
    }

    _getTransactions() {

        return JSON.parse(
            localStorage.getItem(
                this.STORAGE_KEY
            ) || "[]"
        );
    }

    _saveTransactions(list) {

        localStorage.setItem(
            this.STORAGE_KEY,
            JSON.stringify(list)
        );
    }

    _getLedger() {

        return JSON.parse(
            localStorage.getItem(
                this.LEDGER_KEY
            ) || "[]"
        );
    }

    _saveLedger(list) {

        localStorage.setItem(
            this.LEDGER_KEY,
            JSON.stringify(list)
        );
    }

    /* =========================
        WALLET RESOLUTION
    ========================= */

    getWallet(userId) {

        const wallets =
            this._getWallets();

        let wallet =
            wallets.find(
                w =>
                    w.userId === userId
            );

        if (!wallet) {

            wallet =
                new Wallet({

                    userId,

                    balance: 0,

                    bonusBalance: 0
                });

            wallets.push(
                wallet.toJSON()
            );

            this._saveWallets(wallets);
        }

        return wallet;
    }

    saveWallet(wallet) {

        const wallets =
            this._getWallets();

        const index =
            wallets.findIndex(
                w =>
                    w.userId ===
                    wallet.userId
            );

        if (index === -1) {

            wallets.push(
                wallet.toJSON()
            );

        } else {

            wallets[index] =
                wallet.toJSON();
        }

        this._saveWallets(wallets);
    }

    /* =========================
        CORE TRANSACTION ENGINE
    ========================= */

    createTransaction({
        userId,
        type,
        amount,
        meta = {},
        source = "system"
    }) {

        if (!userId || !type) {

            throw new Error(
                "Invalid transaction payload"
            );
        }

        amount =
            Number(amount);

        if (amount <= 0) {

            throw new Error(
                "Invalid transaction amount"
            );
        }

        const wallet =
            Wallet.fromJSON(
                this.getWallet(userId)
            );

        const transaction = {

            id:
                crypto.randomUUID(),

            userId,

            type,

            amount,

            status:
                this.STATUS.SUCCESS,

            balanceBefore:
                wallet.balance,

            balanceAfter: 0,

            meta,

            source,

            timestamp:
                Date.now()
        };

        /* =========================
            APPLY TRANSACTION RULES
        ========================= */

        switch (type) {

            case this.TRANSACTION_TYPES.DEPOSIT:

                wallet.credit(amount);
                wallet.totalDeposited += amount;

                break;

            case this.TRANSACTION_TYPES.WITHDRAW:

                if (!wallet.debit(amount)) {

                    transaction.status =
                        this.STATUS.FAILED;

                    throw new Error(
                        "Insufficient balance"
                    );
                }

                wallet.totalWithdrawn += amount;

                break;

            case this.TRANSACTION_TYPES.BET:

                if (!wallet.debit(amount)) {

                    transaction.status =
                        this.STATUS.FAILED;

                    throw new Error(
                        "Bet failed: insufficient balance"
                    );
                }

                wallet.addWager(amount);

                break;

            case this.TRANSACTION_TYPES.WIN:

                wallet.addWin(amount);

                break;

            case this.TRANSACTION_TYPES.LOSS:

                wallet.addLoss(amount);

                break;

            case this.TRANSACTION_TYPES.BONUS:

                wallet.addBonus(amount);

                break;

            case this.TRANSACTION_TYPES.REWARD:

                wallet.claimReward(amount);

                break;

            case this.TRANSACTION_TYPES.REFUND:

                wallet.credit(amount);

                break;

            default:

                throw new Error(
                    "Unknown transaction type"
                );
        }

        transaction.balanceAfter =
            wallet.balance;

        /* =========================
            LEDGER ENTRY
        ========================= */

        const ledger =
            this._getLedger();

        ledger.push({

            id:
                crypto.randomUUID(),

            transactionId:
                transaction.id,

            userId,

            type,

            debit:
                type === "withdraw" ||
                type === "bet"
                    ? amount
                    : 0,

            credit:
                type === "deposit" ||
                type === "win" ||
                type === "bonus" ||
                type === "reward" ||
                type === "refund"
                    ? amount
                    : 0,

            balanceAfter:
                wallet.balance,

            timestamp:
                Date.now()
        });

        /* =========================
            PERSIST DATA
        ========================= */

        const transactions =
            this._getTransactions();

        transactions.push(transaction);

        this._saveTransactions(transactions);

        this._saveLedger(ledger);

        this.saveWallet(wallet);

        return transaction;
    }

    /* =========================
        QUERY ENGINE
    ========================= */

    getUserTransactions(userId) {

        return this._getTransactions().filter(
            t =>
                t.userId === userId
        );
    }

    getLedger(userId) {

        return this._getLedger().filter(
            l =>
                l.userId === userId
        );
    }

    getBalance(userId) {

        const wallet =
            this.getWallet(userId);

        return wallet.balance;
    }

    /* =========================
        ANALYTICS ENGINE
    ========================= */

    getStats(userId) {

        const tx =
            this.getUserTransactions(
                userId
            );

        return {

            totalTransactions:
                tx.length,

            totalDeposits:
                tx.filter(
                    t =>
                        t.type === "deposit"
                )
                .reduce(
                    (a, b) =>
                        a + b.amount,
                    0
                ),

            totalWithdrawals:
                tx.filter(
                    t =>
                        t.type === "withdraw"
                )
                .reduce(
                    (a, b) =>
                        a + b.amount,
                    0
                ),

            totalWins:
                tx.filter(
                    t =>
                        t.type === "win"
                )
                .reduce(
                    (a, b) =>
                        a + b.amount,
                    0
                ),

            totalLosses:
                tx.filter(
                    t =>
                        t.type === "loss"
                )
                .reduce(
                    (a, b) =>
                        a + b.amount,
                    0
                )
        };
    }

    /* =========================
        ROLLBACK ENGINE
    ========================= */

    reverseTransaction(transactionId) {

        const transactions =
            this._getTransactions();

        const tx =
            transactions.find(
                t =>
                    t.id ===
                    transactionId
            );

        if (!tx) {

            throw new Error(
                "Transaction not found"
            );
        }

        const wallet =
            Wallet.fromJSON(
                this.getWallet(
                    tx.userId
                )
            );

        switch (tx.type) {

            case this.TRANSACTION_TYPES.DEPOSIT:

                wallet.debit(tx.amount);
                break;

            case this.TRANSACTION_TYPES.WITHDRAW:

                wallet.credit(tx.amount);
                break;

            case this.TRANSACTION_TYPES.BET:

                wallet.credit(tx.amount);
                break;

            case this.TRANSACTION_TYPES.WIN:

                wallet.debit(tx.amount);
                break;

            default:

                throw new Error(
                    "Cannot reverse this type"
                );
        }

        tx.status =
            this.STATUS.REVERSED;

        this.saveWallet(wallet);
        this._saveTransactions(transactions);

        return tx;
    }
}

const transactionService =
    new TransactionService();

export default transactionService;
