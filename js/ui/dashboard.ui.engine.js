// =========================================
// DASHBOARD UI ENGINE v1.0
// Goldsbet-style UI Orchestration Layer
// State → UI Binding → Live Updates → Modules
// =========================================

class DashboardUIEngine {

    constructor(user, storage, gameEngine) {

        this.user = user;
        this.storage = storage;
        this.game = gameEngine;

        this.state = {
            mounted: false,
            live: true,
            lastRender: 0
        };

        this.dom = {};

        this.timers = [];
    }

    // =========================================
    // INIT SYSTEM
    // =========================================
    init() {

        this.cacheDOM();
        this.bindEvents();
        this.renderAll();
        this.startLiveSync();

        this.state.mounted = true;
    }

    // =========================================
    // DOM CACHE (PERFORMANCE OPTIMIZED)
    // =========================================
    cacheDOM() {

        this.dom = {

            balance: document.getElementById("walletValue"),
            username: document.getElementById("userName"),
            email: document.getElementById("userEmail"),

            vip: document.getElementById("userVip"),
            referral: document.getElementById("referralCode"),
            referralCount: document.getElementById("referralCount"),

            history: document.getElementById("activityList"),

            spinBtn: document.getElementById("spinBtn"),
            diceBtn: document.getElementById("diceBtn"),
            aviatorBtn: document.getElementById("aviatorBtn"),

            logoutBtn: document.getElementById("logoutBtn")
        };
    }

    // =========================================
    // GLOBAL RENDER
    // =========================================
    renderAll() {

        this.renderHeader();
        this.renderWallet();
        this.renderVIP();
        this.renderReferral();
        this.renderHistory();
    }

    // =========================================
    // HEADER
    // =========================================
    renderHeader() {

        this.setText(this.dom.username, this.user.fullName);
        this.setText(this.dom.email, this.user.email);
    }

    // =========================================
    // WALLET RENDER (ANIMATED COUNTER)
    // =========================================
    renderWallet() {

        if (!this.dom.balance) return;

        const target = this.user.wallet || 0;

        this.animateNumber(this.dom.balance, target, "৳");
    }

    // =========================================
    // VIP SYSTEM UI
    // =========================================
    renderVIP() {

        const levels = ["Bronze", "Silver", "Gold", "Platinum", "Diamond"];

        const level = levels[this.user.vipLevel || 0];

        if (this.dom.vip) {
            this.dom.vip.textContent = level;
        }
    }

    // =========================================
    // REFERRAL UI
    // =========================================
    renderReferral() {

        this.setText(this.dom.referral, this.user.referralCode);
        this.setText(this.dom.referralCount, this.user.totalReferrals || 0);
    }

    // =========================================
    // HISTORY UI (LIVE FEED STYLE)
    // =========================================
    renderHistory() {

        if (!this.dom.history) return;

        const history = this.game.getHistory?.() || [];

        this.dom.history.innerHTML = "";

        history.slice(0, 10).forEach(item => {

            const el = document.createElement("div");

            el.className = "timeline-item";

            el.innerHTML = `
                <strong>${item.game}</strong>
                <p>${item.result} | Bet: ${item.bet} | Profit: ${item.profit || 0}</p>
            `;

            this.dom.history.appendChild(el);
        });
    }

    // =========================================
    // EVENT BINDING (GAME ACTIONS)
    // =========================================
    bindEvents() {

        if (this.dom.spinBtn) {

            this.dom.spinBtn.onclick = () => {

                const result = this.game.playSpin(this.user, 50);

                this.onGameResult(result);
            };
        }

        if (this.dom.diceBtn) {

            this.dom.diceBtn.onclick = () => {

                const result = this.game.playDice(this.user, 50, 50);

                this.onGameResult(result);
            };
        }

        if (this.dom.aviatorBtn) {

            this.dom.aviatorBtn.onclick = () => {

                const result = this.game.playAviator(this.user, 50);

                this.onGameResult(result);
            };
        }

        if (this.dom.logoutBtn) {

            this.dom.logoutBtn.onclick = () => {

                this.logout();
            };
        }
    }

    // =========================================
    // GAME RESULT HANDLER
    // =========================================
    onGameResult(result) {

        if (!result.success) {
            this.toast(result.message);
            return;
        }

        this.user = result.balance
            ? this.user
            : this.user;

        this.user.wallet = result.balance;

        this.storage.setCurrentUser(this.user);

        this.renderWallet();
        this.renderHistory();

        this.toast(
            `${result.data.game} → ${result.data.result}`
        );
    }

    // =========================================
    // LIVE SYNC SYSTEM (REALTIME UI FEEL)
    // =========================================
    startLiveSync() {

        const loop = setInterval(() => {

            this.renderWallet();

        }, 4000);

        this.timers.push(loop);
    }

    // =========================================
    // NUMBER ANIMATION ENGINE
    // =========================================
    animateNumber(el, target, prefix = "") {

        let current = 0;

        const step = Math.ceil(target / 30);

        const interval = setInterval(() => {

            current += step;

            if (current >= target) {
                current = target;
                clearInterval(interval);
            }

            el.textContent = prefix + current;

        }, 20);
    }

    // =========================================
    // TEXT HELPER
    // =========================================
    setText(el, value) {

        if (el) el.textContent = value;
    }

    // =========================================
    // TOAST SYSTEM (BET STYLE NOTIFICATION)
    // =========================================
    toast(msg) {

        const t = document.createElement("div");

        t.className = "toast-notification";

        t.textContent = msg;

        document.body.appendChild(t);

        setTimeout(() => {
            t.remove();
        }, 2500);
    }

    // =========================================
    // LOGOUT
    // =========================================
    logout() {

        this.storage.logout();

        window.location.href = "index.html";
    }

    // =========================================
    // CLEANUP
    // =========================================
    destroy() {

        this.timers.forEach(t => clearInterval(t));
    }
}

// =========================================
// BOOTSTRAP
// =========================================
document.addEventListener("DOMContentLoaded", () => {

    const user = StorageService.getCurrentUser();

    const game = new GameEngine({
        storage: StorageService,
        setCurrentUser: StorageService.setCurrentUser.bind(StorageService)
    });

    const dashboard = new DashboardUIEngine(
        user,
        StorageService,
        game
    );

    dashboard.init();
});
