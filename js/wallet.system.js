// =========================================
// WALLET ENGINE v1.0 - ENTERPRISE GRADE
// Deposit + Withdraw + Ledger + Security Layer
// =========================================

class WalletSystem {

    constructor(core) {

        this.core = core;

        this.state = {
            locked: new Set(),
            transactions: new Map()
        };

        this.config = {
            MIN_DEPOSIT: 100,
            MAX_WITHDRAW: 5000,
            DAILY_WITHDRAW_LIMIT: 10000
        };
    }

    // =========================================
    // GET USER WALLET
    // =========================================
    getBalance(user) {
        return user.wallet || 0;
    }

    // =========================================
    // SAFE AMOUNT CHECK
    // =========================================
    isValidAmount(amount) {

        return (
            typeof amount === "number" &&
            amount > 0 &&
            isFinite(amount)
        );
    }

    // =========================================
    // LOCK SYSTEM (ANTI FRAUD)
    // =========================================
    isLocked(userId) {
        return this.state.locked.has(userId);
    }

    lock(userId) {

        this.state.locked.add(userId);

        setTimeout(() => {
            this.state.locked.delete(userId);
        }, 10000);
    }

    // =========================================
    // TRANSACTION ID
    // =========================================
    generateTxnId() {

        return "TXN_" + Math.random().toString(36).substring(2, 12);
    }

    // =========================================
    // ADD LEDGER ENTRY
    // =========================================
    addTransaction(userId, type, amount, status = "PENDING") {

        const txn = {
            id: this.generateTxnId(),
            userId,
            type,
            amount,
            status,
            createdAt: Date.now()
        };

        const list = this.core.storage.get("transactions") || [];

        list.push(txn);

        this.core.storage.set("transactions", list);

        return txn;
    }

    // =========================================
    // DEPOSIT SYSTEM (SIMULATION READY)
    // =========================================
    deposit(user, amount) {

        if (!this.core.rateLimit("deposit")) {
            return {
                success: false,
                message: "Too many deposit attempts"
            };
        }

        if (!this.isValidAmount(amount)) {
            return {
                success: false,
                message: "Invalid deposit amount"
            };
        }

        if (amount < this.config.MIN_DEPOSIT) {
            return {
                success: false,
                message: "Minimum deposit is " + this.config.MIN_DEPOSIT
            };
        }

        // simulate gateway delay
        const txn = this.addTransaction(
            user.id,
            "DEPOSIT",
            amount,
            "SUCCESS"
        );

        user.wallet = this.getBalance(user) + amount;

        user.activities.push({
            type: "DEPOSIT",
            message: `Deposited ${amount}`,
            time: Date.now()
        });

        this.core.setCurrentUser(user);
        this.updateUser(user);

        return {
            success: true,
            message: "Deposit successful",
            transaction: txn,
            balance: user.wallet
        };
    }

    // =========================================
    // WITHDRAW SYSTEM (SECURITY HEAVY)
    // =========================================
    withdraw(user, amount) {

        if (!this.core.rateLimit("withdraw")) {
            return {
                success: false,
                message: "Too many withdrawal attempts"
            };
        }

        if (this.isLocked(user.id)) {
            return {
                success: false,
                message: "Wallet temporarily locked"
            };
        }

        if (!this.isValidAmount(amount)) {
            return {
                success: false,
                message: "Invalid withdraw amount"
            };
        }

        if (amount > this.config.MAX_WITHDRAW) {
            return {
                success: false,
                message: "Exceeds max withdraw limit"
            };
        }

        if (user.wallet < amount) {
            return {
                success: false,
                message: "Insufficient balance"
            };
        }

        // SECURITY CHECK
        if (amount > user.wallet * 0.8) {
            this.lock(user.id);
        }

        // create pending transaction
        const txn = this.addTransaction(
            user.id,
            "WITHDRAW",
            amount,
            "PENDING"
        );

        // deduct immediately (escrow model)
        user.wallet -= amount;

        user.activities.push({
            type: "WITHDRAW",
            message: `Withdraw request ${amount}`,
            time: Date.now()
        });

        this.core.setCurrentUser(user);
        this.updateUser(user);

        return {
            success: true,
            message: "Withdraw request submitted",
            transaction: txn,
            balance: user.wallet
        };
    }

    // =========================================
    // APPROVE WITHDRAW (ADMIN SIMULATION)
    // =========================================
    approveWithdraw(txnId) {

        const list = this.core.storage.get("transactions") || [];

        const txn = list.find(t => t.id === txnId);

        if (!txn) return false;

        txn.status = "APPROVED";

        this.core.storage.set("transactions", list);

        return true;
    }

    // =========================================
    // REJECT WITHDRAW
    // =========================================
    rejectWithdraw(txnId, user) {

        const list = this.core.storage.get("transactions") || [];

        const txn = list.find(t => t.id === txnId);

        if (!txn) return false;

        txn.status = "REJECTED";

        // refund
        user.wallet += txn.amount;

        this.core.setCurrentUser(user);
        this.updateUser(user);

        this.core.storage.set("transactions", list);

        return true;
    }

    // =========================================
    // USER UPDATE
    // =========================================
    updateUser(updatedUser) {

        let users = this.core.storage.get("users") || [];

        users = users.map(u =>
            u.id === updatedUser.id ? updatedUser : u
        );

        this.core.storage.set("users", users);
    }

    // =========================================
    // GET LEDGER
    // =========================================
    getLedger(userId) {

        const list = this.core.storage.get("transactions") || [];

        return list.filter(t => t.userId === userId);
    }

    // =========================================
    // DAILY LIMIT CHECK
    // =========================================
    checkDailyWithdraw(userId, amount) {

        const ledger = this.getLedger(userId);

        const today = Date.now() - (24 * 60 * 60 * 1000);

        const total = ledger
            .filter(t => t.type === "WITHDRAW" && t.createdAt > today)
            .reduce((sum, t) => sum + t.amount, 0);

        return (total + amount) <= this.config.DAILY_WITHDRAW_LIMIT;
    }

    // =========================================
    // WALLET STATUS
    // =========================================
    getWalletStatus(user) {

        return {
            balance: user.wallet,
            locked: this.isLocked(user.id),
            transactions: this.getLedger(user.id).length
        };
    }
}

// =========================================
// EXPORT GLOBAL
// =========================================
window.WalletSystem = WalletSystem;
