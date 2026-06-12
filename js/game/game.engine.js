// =========================================
// GAME ENGINE v1.0 - CORE SIMULATION LAYER
// Aviator + Dice + Spin (Unified Engine)
// =========================================

class GameEngine {

    constructor(core) {

        this.core = core;

        this.state = {
            activeGame: null,
            history: [],
            lastPlay: new Map()
        };

        this.config = {
            COOLDOWN: 3000,
            MAX_HISTORY: 50
        };
    }

    // =========================================
    // SAFE RANDOM GENERATOR (BASE RNG)
    // =========================================
    rng(seed = null) {

        const t = Date.now();

        let x = seed || (t % 100000);

        x ^= x << 13;
        x ^= x >> 7;
        x ^= x << 17;

        const result = Math.abs(x % 10000) / 10000;

        return result;
    }

    // =========================================
    // RATE LIMIT (ANTI SPAM GAME PLAY)
    // =========================================
    canPlay(userId) {

        const last = this.state.lastPlay.get(userId);

        if (!last) return true;

        return (Date.now() - last) > this.config.COOLDOWN;
    }

    markPlay(userId) {
        this.state.lastPlay.set(userId, Date.now());
    }

    // =========================================
    // HISTORY LOGGER
    // =========================================
    addHistory(game) {

        this.state.history.unshift(game);

        if (this.state.history.length > this.config.MAX_HISTORY) {
            this.state.history.pop();
        }

        this.core.storage.set("game_history", this.state.history);
    }

    // =========================================
    // 🎯 AVIATOR GAME ENGINE
    // =========================================
    playAviator(user, betAmount) {

        if (!this.canPlay(user.id)) {
            return { success: false, message: "Cooldown active" };
        }

        if (user.wallet < betAmount) {
            return { success: false, message: "Insufficient balance" };
        }

        this.markPlay(user.id);

        // crash multiplier simulation
        let multiplier = 1;
        const crashPoint = 1 + this.rng() * 10;

        const steps = [];

        for (let i = 0; i < 20; i++) {

            multiplier += 0.1;

            steps.push(multiplier.toFixed(2));

            if (multiplier >= crashPoint) break;
        }

        const win = Math.random() > 0.5;

        let profit = 0;

        if (win) {
            profit = betAmount * crashPoint;
            user.wallet += profit;
        } else {
            user.wallet -= betAmount;
        }

        const result = {
            game: "AVIATOR",
            bet: betAmount,
            crashPoint: crashPoint.toFixed(2),
            result: win ? "WIN" : "LOSS",
            profit,
            steps,
            time: Date.now()
        };

        this.addHistory(result);

        this.core.setCurrentUser(user);

        return {
            success: true,
            data: result,
            balance: user.wallet
        };
    }

    // =========================================
    // 🎲 DICE GAME ENGINE
    // =========================================
    playDice(user, betAmount, guess = 50) {

        if (!this.canPlay(user.id)) {
            return { success: false, message: "Cooldown active" };
        }

        if (user.wallet < betAmount) {
            return { success: false, message: "Insufficient balance" };
        }

        this.markPlay(user.id);

        const roll = Math.floor(this.rng() * 100) + 1;

        const win = roll >= guess;

        let profit = 0;

        if (win) {
            profit = betAmount * 2;
            user.wallet += profit;
        } else {
            user.wallet -= betAmount;
        }

        const result = {
            game: "DICE",
            bet: betAmount,
            guess,
            roll,
            result: win ? "WIN" : "LOSS",
            profit,
            time: Date.now()
        };

        this.addHistory(result);

        this.core.setCurrentUser(user);

        return {
            success: true,
            data: result,
            balance: user.wallet
        };
    }

    // =========================================
    // 🎡 SPIN WHEEL ENGINE
    // =========================================
    playSpin(user, betAmount) {

        if (!this.canPlay(user.id)) {
            return { success: false, message: "Cooldown active" };
        }

        if (user.wallet < betAmount) {
            return { success: false, message: "Insufficient balance" };
        }

        this.markPlay(user.id);

        const segments = [
            0, 10, 20, 50, 100, 200, 500
        ];

        const index = Math.floor(this.rng() * segments.length);

        const reward = segments[index];

        let profit = 0;

        if (reward > 0) {
            profit = reward;
            user.wallet += profit;
        } else {
            user.wallet -= betAmount;
        }

        const result = {
            game: "SPIN",
            bet: betAmount,
            reward,
            result: reward > 0 ? "WIN" : "LOSS",
            profit,
            time: Date.now()
        };

        this.addHistory(result);

        this.core.setCurrentUser(user);

        return {
            success: true,
            data: result,
            balance: user.wallet
        };
    }

    // =========================================
    // GET GAME HISTORY
    // =========================================
    getHistory() {
        return this.state.history;
    }

    // =========================================
    // CLEAR HISTORY (ADMIN USE)
    // =========================================
    clearHistory() {
        this.state.history = [];
        this.core.storage.remove("game_history");
    }
}

// =========================================
// EXPORT GLOBAL
// =========================================
window.GameEngine = GameEngine;
