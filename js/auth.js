// ===============================
// AUTH SYSTEM (PRO FIXED)
// ===============================

const AuthService = {

    isEmpty(v) {
        return !v || v.toString().trim() === "";
    },

    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    },

    isValidPassword(password) {
        return password && password.length >= 6;
    },

    // ===========================
    // REGISTER
    // ===========================
    register(data) {

        if (this.isEmpty(data.email) || this.isEmpty(data.password)) {
            return { success: false, message: "All fields required" };
        }

        if (!this.isValidEmail(data.email)) {
            return { success: false, message: "Invalid email" };
        }

        if (!this.isValidPassword(data.password)) {
            return { success: false, message: "Min 6 char password" };
        }

        const newUser = {
            id: Date.now(),
            fullName: data.fullName || "User",
            email: data.email.toLowerCase(),
            password: data.password,

            wallet: 0,
            points: 0,
            vip: 0,

            referralCode: "REF-" + Math.random().toString(36).slice(2, 8).toUpperCase(),

            createdAt: new Date().toISOString()
        };

        const res = StorageService.addUser(newUser);

        if (!res.success) return res;

        StorageService.setCurrentUser(newUser);

        return { success: true, user: newUser };
    },

    // ===========================
    // LOGIN
    // ===========================
    login(email, password) {

        if (this.isEmpty(email) || this.isEmpty(password)) {
            return { success: false, message: "Fill all fields" };
        }

        const user = StorageService.findUserByEmail(email.toLowerCase());

        if (!user || user.password !== password) {
            return { success: false, message: "Wrong email or password" };
        }

        user.lastLogin = new Date().toISOString();

        StorageService.updateUser(user);
        StorageService.setCurrentUser(user);

        return { success: true, user };
    },

    logout() {
        StorageService.logout();
        window.location.href = "index.html";
    }
};
