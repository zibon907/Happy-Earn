// ===============================
// STORAGE ENGINE (SAFE + CLEAN)
// ===============================

const StorageService = {

    KEYS: {
        USERS: "users",
        CURRENT_USER: "currentUser"
    },

    safeParse(data, fallback = null) {
        try {
            return JSON.parse(data);
        } catch {
            return fallback;
        }
    },

    getUsers() {
        return this.safeParse(localStorage.getItem(this.KEYS.USERS), []);
    },

    saveUsers(users) {
        localStorage.setItem(this.KEYS.USERS, JSON.stringify(users));
    },

    findUserByEmail(email) {
        const users = this.getUsers();
        return users.find(u => u.email === email) || null;
    },

    addUser(user) {
        const users = this.getUsers();

        const exists = users.some(u => u.email === user.email);
        if (exists) {
            return { success: false, message: "User already exists" };
        }

        users.push(user);
        this.saveUsers(users);

        return { success: true };
    },

    updateUser(updatedUser) {
        let users = this.getUsers();

        users = users.map(u =>
            u.email === updatedUser.email ? updatedUser : u
        );

        this.saveUsers(users);
    },

    setCurrentUser(user) {
        localStorage.setItem(this.KEYS.CURRENT_USER, JSON.stringify(user));
    },

    getCurrentUser() {
        return this.safeParse(localStorage.getItem(this.KEYS.CURRENT_USER), null);
    },

    logout() {
        localStorage.removeItem(this.KEYS.CURRENT_USER);
    }
};
