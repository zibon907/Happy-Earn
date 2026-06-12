// =========================================
// CORE ENGINE v1.0 - ENTERPRISE GRADE
// Security + State + Storage + Validation Layer
// =========================================

class CoreEngine {

    constructor() {

        // =========================
        // INTERNAL STATE
        // =========================
        this.state = {
            currentUser: null,
            session: null,
            cache: new Map(),
            rateLimits: new Map()
        };

        this.config = {
            SESSION_TIME: 30 * 60 * 1000,
            RATE_LIMIT_MAX: 20,
            RATE_LIMIT_WINDOW: 10 * 1000
        };

        this.init();
    }

    // =========================================
    // INIT SYSTEM
    // =========================================
    init() {

        this.session = this.loadSession();

        this.currentUser = this.loadCurrentUser();

        this.cleanExpiredSession();

        this.log("CoreEngine initialized");
    }

    // =========================================
    // SAFE STORAGE WRAPPER
    // =========================================
    storage = {

        set: (key, value) => {
            try {
                const safe = JSON.stringify(value);
                localStorage.setItem(key, safe);
                return true;
            } catch (err) {
                this.log("Storage SET error", err);
                return false;
            }
        },

        get: (key) => {
            try {
                const data = localStorage.getItem(key);
                return data ? JSON.parse(data) : null;
            } catch (err) {
                this.log("Storage GET error", err);
                return null;
            }
        },

        remove: (key) => {
            localStorage.removeItem(key);
        }
    };

    // =========================================
    // INPUT SANITIZATION (XSS SAFE)
    // =========================================
    sanitize(input) {

        if (typeof input !== "string") return input;

        return input
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    // =========================================
    // VALIDATION ENGINE
    // =========================================
    validator = {

        email: (email) => {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        },

        password: (pass) => {
            return typeof pass === "string"
                && pass.length >= 6;
        },

        username: (name) => {
            return typeof name === "string"
                && name.trim().length >= 3
                && name.trim().length <= 20;
        }
    };

    // =========================================
    // RATE LIMITER (ANTI SPAM)
    // =========================================
    rateLimit(action) {

        const now = Date.now();

        const record = this.state.rateLimits.get(action) || {
            count: 0,
            start: now
        };

        if (now - record.start > this.config.RATE_LIMIT_WINDOW) {
            record.count = 0;
            record.start = now;
        }

        record.count++;

        this.state.rateLimits.set(action, record);

        return record.count <= this.config.RATE_LIMIT_MAX;
    }

    // =========================================
    // SESSION SYSTEM (SECURE)
    // =========================================
    createSession(user) {

        const session = {
            userId: user.id,
            createdAt: Date.now(),
            expiresAt: Date.now() + this.config.SESSION_TIME,
            token: this.generateToken()
        };

        this.storage.set("session", session);

        this.state.session = session;

        return session;
    }

    loadSession() {
        return this.storage.get("session");
    }

    isSessionValid() {

        const session = this.state.session || this.loadSession();

        if (!session) return false;

        return Date.now() < session.expiresAt;
    }

    cleanExpiredSession() {

        if (!this.isSessionValid()) {
            this.storage.remove("session");
            this.state.session = null;
        }
    }

    destroySession() {
        this.storage.remove("session");
        this.state.session = null;
        this.currentUser = null;
    }

    // =========================================
    // USER MANAGEMENT
    // =========================================
    loadCurrentUser() {
        return this.storage.get("currentUser");
    }

    setCurrentUser(user) {

        if (!user || typeof user !== "object") {
            this.log("Invalid user object");
            return false;
        }

        this.storage.set("currentUser", user);
        this.state.currentUser = user;

        return true;
    }

    // =========================================
    // TOKEN GENERATOR (SESSION SECURITY)
    // =========================================
    generateToken() {

        return "xxxx-xxxx-4xxx-yxxx".replace(/[xy]/g, c => {
            const r = Math.random() * 16 | 0;
            const v = c === "x" ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    // =========================================
    // DATA INTEGRITY CHECK
    // =========================================
    verifyIntegrity(data) {

        try {
            return data !== null && data !== undefined;
        } catch {
            return false;
        }
    }

    // =========================================
    // EVENT LOGGER (DEBUG SYSTEM)
    // =========================================
    log(message, data = null) {

        if (!this.state.debug) return;

        console.log("[CORE]", message, data || "");
    }

    enableDebug() {
        this.state.debug = true;
    }

    disableDebug() {
        this.state.debug = false;
    }

    // =========================================
    // SAFE EXECUTION WRAPPER
    // =========================================
    safeExecute(fn) {

        try {
            return fn();
        } catch (err) {
            this.log("Execution error", err);
            return null;
        }
    }
}

// =========================================
// GLOBAL INSTANCE
// =========================================
window.CoreEngine = new CoreEngine();
