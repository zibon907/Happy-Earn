// =========================================
// AUTH SYSTEM v1.0 - ENTERPRISE GRADE
// Login + Register + Security + Session Binding
// =========================================

class AuthSystem {

    constructor(core) {

        this.core = core;

        this.state = {
            loginAttempts: new Map(),
            lockedUsers: new Map()
        };

        this.config = {
            MAX_ATTEMPTS: 5,
            LOCK_TIME: 60 * 1000 * 5, // 5 min lock
            PASSWORD_MIN: 6
        };
    }

    // =========================================
    // INPUT SANITIZATION
    // =========================================
    sanitize(value) {

        return this.core.sanitize(value);
    }

    // =========================================
    // VALIDATION WRAPPER
    // =========================================
    validateEmail(email) {

        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    validatePassword(password) {

        return typeof password === "string"
            && password.length >= this.config.PASSWORD_MIN;
    }

    validateUsername(username) {

        return typeof username === "string"
            && username.trim().length >= 3
            && username.trim().length <= 20;
    }

    // =========================================
    // RATE LIMIT CHECK (ANTI BRUTE FORCE)
    // =========================================
    checkRateLimit(email) {

        const now = Date.now();

        const record = this.state.loginAttempts.get(email) || {
            count: 0,
            time: now
        };

        if (now - record.time > 60000) {
            record.count = 0;
            record.time = now;
        }

        record.count++;

        this.state.loginAttempts.set(email, record);

        if (record.count > this.config.MAX_ATTEMPTS) {

            this.state.lockedUsers.set(email, now + this.config.LOCK_TIME);

            return false;
        }

        return true;
    }

    isLocked(email) {

        const lockTime = this.state.lockedUsers.get(email);

        if (!lockTime) return false;

        if (Date.now() > lockTime) {
            this.state.lockedUsers.delete(email);
            return false;
        }

        return true;
    }

    // =========================================
    // REGISTER SYSTEM
    // =========================================
    register({ username, email, password }) {

        // =========================
        // RATE LIMIT CHECK
        // =========================
        if (!this.core.rateLimit("register")) {
            return {
                success: false,
                message: "Too many requests. Try again later."
            };
        }

        // =========================
        // SANITIZE INPUT
        // =========================
        username = this.sanitize(username);
        email = this.sanitize(email);
        password = this.sanitize(password);

        // =========================
        // VALIDATION
        // =========================
        if (!this.validateUsername(username)) {
            return {
                success: false,
                message: "Invalid username (3-20 chars required)"
            };
        }

        if (!this.validateEmail(email)) {
            return {
                success: false,
                message: "Invalid email format"
            };
        }

        if (!this.validatePassword(password)) {
            return {
                success: false,
                message: "Password too weak (min 6 chars)"
            };
        }

        // =========================
        // CHECK EXISTING USER
        // =========================
        const users = this.core.storage.get("users") || [];

        const exists = users.find(u => u.email === email);

        if (exists) {
            return {
                success: false,
                message: "User already exists"
            };
        }

        // =========================
        // CREATE USER OBJECT
        // =========================
        const newUser = {

            id: this.generateId(),

            username,
            email,
            password, // (in real backend: hashed)

            wallet: 1000,
            xp: 0,
            vip: 0,

            referrals: 0,
            totalEarned: 0,

            createdAt: Date.now(),
            lastLogin: null,

            security: {
                loginCount: 0,
                riskScore: 0
            },

            activities: [
                {
                    type: "REGISTER",
                    message: "Account created",
                    time: Date.now()
                }
            ]
        };

        users.push(newUser);

        this.core.storage.set("users", users);

        return {
            success: true,
            message: "Registration successful",
            user: newUser
        };
    }

    // =========================================
    // LOGIN SYSTEM
    // =========================================
    login(email, password) {

        // =========================
        // RATE LIMIT CHECK
        // =========================
        if (!this.core.rateLimit("login")) {
            return {
                success: false,
                message: "Too many login attempts"
            };
        }

        email = this.sanitize(email);
        password = this.sanitize(password);

        // =========================
        // LOCK CHECK
        // =========================
        if (this.isLocked(email)) {
            return {
                success: false,
                message: "Account temporarily locked"
            };
        }

        // =========================
        // VALIDATION
        // =========================
        if (!this.validateEmail(email) || !password) {
            return {
                success: false,
                message: "Invalid credentials format"
            };
        }

        const users = this.core.storage.get("users") || [];

        const user = users.find(u =>
            u.email === email && u.password === password
        );

        if (!user) {

            this.checkRateLimit(email);

            return {
                success: false,
                message: "Invalid email or password"
            };
        }

        // =========================
        // UPDATE USER SECURITY
        // =========================
        user.lastLogin = Date.now();
        user.security.loginCount += 1;

        // reset attempts
        this.state.loginAttempts.delete(email);

        // =========================
        // CREATE SESSION
        // =========================
        const session = this.core.createSession(user);

        this.core.setCurrentUser(user);

        this.updateUser(user);

        return {
            success: true,
            message: "Login successful",
            user,
            session
        };
    }

    // =========================================
    // UPDATE USER IN DB
    // =========================================
    updateUser(updatedUser) {

        let users = this.core.storage.get("users") || [];

        users = users.map(u =>
            u.id === updatedUser.id ? updatedUser : u
        );

        this.core.storage.set("users", users);
    }

    // =========================================
    // LOGOUT SYSTEM
    // =========================================
    logout() {

        this.core.destroySession();
        this.core.setCurrentUser(null);

        return {
            success: true,
            message: "Logged out successfully"
        };
    }

    // =========================================
    // ID GENERATOR
    // =========================================
    generateId() {

        return "usr_" + Math.random().toString(36).substring(2, 10);
    }

    // =========================================
    // GET CURRENT USER
    // =========================================
    getCurrentUser() {
        return this.core.loadCurrentUser();
    }
}

// =========================================
// EXPORT GLOBAL
// =========================================
window.AuthSystem = AuthSystem;
