import { db } from "../core/db.js";
import { Security } from "../core/security.js";
import { CONFIG } from "../core/config.js";

export const AuthService = {

    register({ email, password, name }) {

        if (db.findUserByEmail(email)) {
            return { success: false, message: "User already exists" };
        }

        const user = {
            id: Date.now().toString(),
            name,
            email,
            password: Security.hashPassword(password),

            // 🔥 START FROM ZERO
            wallet: CONFIG.WALLET.INITIAL_BALANCE,
            xp: 0,
            level: 1,

            createdAt: new Date(),
            lastLogin: null
        };

        db.createUser(user);

        return { success: true, user };
    },

    login({ email, password }) {

        const user = db.findUserByEmail(email);

        if (!user) {
            return { success: false, message: "User not found" };
        }

        if (!Security.verifyPassword(password, user.password)) {
            return { success: false, message: "Invalid password" };
        }

        user.lastLogin = new Date();

        return {
            success: true,
            user
        };
    }
};
