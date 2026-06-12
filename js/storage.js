// =========================================
// STORAGE SERVICE (ENTERPRISE SAAS LAYER)
// LocalStorage Based Data Engine
// =========================================

const StorageService = {

    // =========================================
    // STORAGE KEYS (CENTRALIZED CONFIG)
    // =========================================
    KEYS: {
        USERS: "users",
        CURRENT_USER: "currentUser",
        SETTINGS: "appSettings"
    },

    // =========================================
    // SAFE JSON PARSE
    // =========================================
    safeParse(data, fallback = null) {

        try {
            return JSON.parse(data);
        } catch (error) {
            return fallback;
        }
    },

    // =========================================
    // GET ALL USERS
    // =========================================
    getUsers() {

        const users = localStorage.getItem(this.KEYS.USERS);

        return this.safeParse(users, []);
    },

    // =========================================
    // SAVE ALL USERS
    // =========================================
    saveUsers(users) {

        if (!Array.isArray(users)) {
            console.error("Invalid users data");
            return;
        }

        localStorage.setItem(
            this.KEYS.USERS,
            JSON.stringify(users)
        );
    },

    // =========================================
    // FIND USER BY EMAIL
    // =========================================
    findUserByEmail(email) {

        const users = this.getUsers();

        return users.find(user => user.email === email) || null;
    },

    // =========================================
    // ADD NEW USER
    // =========================================
    addUser(newUser) {

        const users = this.getUsers();

        const exists = users.some(
            user => user.email === newUser.email
        );

        if (exists) {
            return {
                success: false,
                message: "User already exists"
            };
        }

        users.push(newUser);

        this.saveUsers(users);

        return {
            success: true,
            message: "User created successfully"
        };
    },

    // =========================================
    // UPDATE USER (FULL MERGE SAFE)
    // =========================================
    updateUser(updatedUser) {

        let users = this.getUsers();

        let found = false;

        users = users.map(user => {
		 id: crypto.randomUUID()
            if (user.id === updatedUser.id) {
                found = true;

                return {
                    ...user,
                    ...updatedUser
                };
            }

            return user;
        });

        if (!found) {
            console.warn("User not found for update");
        }

        this.saveUsers(users);

        this.setCurrentUser(updatedUser);
    },

    // =========================================
    // SET CURRENT SESSION USER
    // =========================================
    setCurrentUser(user) {

        if (!user || typeof user !== "object") {
            console.error("Invalid user session");
            return;
        }

        localStorage.setItem(
            this.KEYS.CURRENT_USER,
            JSON.stringify(user)
        );
    },

    // =========================================
    // GET CURRENT USER SESSION
    // =========================================
    getCurrentUser() {

        const user = localStorage.getItem(
            this.KEYS.CURRENT_USER
        );

        return this.safeParse(user, null);
    },

    // =========================================
    // REFRESH SESSION FROM USERS DB
    // =========================================
    refreshCurrentUser() {

        const current = this.getCurrentUser();

        if (!current) return null;

        const latest = this.findUserByEmail(current.email);

        if (latest) {
            this.setCurrentUser(latest);
            return latest;
        }

        return current;
    },

    // =========================================
    // DELETE USER
    // =========================================
    deleteUser(email) {

        let users = this.getUsers();

        users = users.filter(
            user => user.email !== email
        );

        this.saveUsers(users);
    },

    // =========================================
    // CLEAR SESSION (LOGOUT)
    // =========================================
    logout() {

        localStorage.removeItem(
            this.KEYS.CURRENT_USER
        );
    },

    // =========================================
    // CLEAR ALL DATA (DEV ONLY)
    // =========================================
    clearAll() {

        localStorage.removeItem(this.KEYS.USERS);
        localStorage.removeItem(this.KEYS.CURRENT_USER);
    },

    // =========================================
    // DEBUG SYSTEM
    // =========================================
    debug() {

        console.log("USERS:", this.getUsers());
        console.log("CURRENT:", this.getCurrentUser());
    }
};
