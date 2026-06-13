import User from "../models/User.js";
import passwordService from "./PasswordService.js";
import tokenService from "./TokenService.js";
import sessionService from "./SessionService.js";

class AuthService {

    constructor() {

        this.STORAGE_KEY = "users";

        this.LOGIN_HISTORY_KEY =
            "login_history";

        this.WELCOME_XP = 500;
    }

    getUsers() {

        try {

            return JSON.parse(
                localStorage.getItem(
                    this.STORAGE_KEY
                ) || "[]"
            );

        } catch {

            return [];
        }
    }

    saveUsers(users) {

        localStorage.setItem(
            this.STORAGE_KEY,
            JSON.stringify(users)
        );
    }

    findByEmail(email) {

        return this.getUsers().find(
            user =>
                user.email
                    .toLowerCase() ===
                email.toLowerCase()
        );
    }

    findByUsername(username) {

        return this.getUsers().find(
            user =>
                user.username
                    .toLowerCase() ===
                username.toLowerCase()
        );
    }

    findById(id) {

        return this.getUsers().find(
            user =>
                user.id === id
        );
    }

    validateEmail(email) {

        const pattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        return pattern.test(email);
    }

    validateUsername(username) {

        if (!username)
            return false;

        if (
            username.length < 3
        )
            return false;

        if (
            username.length > 30
        )
            return false;

        return /^[a-zA-Z0-9_]+$/.test(
            username
        );
    }

    async register(data) {

        const {

            username,
            email,
            password,
            referralCode = null

        } = data;

        if (
            !this.validateUsername(
                username
            )
        ) {

            throw new Error(
                "Invalid username"
            );
        }

        if (
            !this.validateEmail(
                email
            )
        ) {

            throw new Error(
                "Invalid email"
            );
        }

        const passwordCheck =
            passwordService.validate(
                password
            );

        if (
            !passwordCheck.valid
        ) {

            throw new Error(
                passwordCheck.errors.join(
                    ", "
                )
            );
        }

        if (
            this.findByEmail(
                email
            )
        ) {

            throw new Error(
                "Email already exists"
            );
        }

        if (
            this.findByUsername(
                username
            )
        ) {

            throw new Error(
                "Username already exists"
            );
        }

        const hash =
            await passwordService.hash(
                password
            );

        const user =
            new User({

                username,
                email,
                passwordHash:
                    hash,

                referredBy:
                    referralCode,

                xp:
                    this.WELCOME_XP,

                level: 1,

                vipLevel: 0,

                isVerified:
                    false,

                isActive:
                    true
            });

        const users =
            this.getUsers();

        users.push(
            user.toJSON()
        );

        this.saveUsers(
            users
        );

        this.audit(
            "REGISTER",
            user.id
        );

        return user;
    }

    async login(
        email,
        password,
        rememberMe = false
    ) {

        const user =
            this.findByEmail(
                email
            );

        if (!user) {

            throw new Error(
                "User not found"
            );
        }

        const valid =
            await passwordService.verify(
                password,
                user.passwordHash
            );

        if (!valid) {

            throw new Error(
                "Incorrect password"
            );
        }

        if (
            !user.isActive
        ) {

            throw new Error(
                "Account disabled"
            );
        }

        const accessToken =
            tokenService.createAccessToken(
                user.id
            );

        const refreshToken =
            tokenService.createRefreshToken(
                user.id
            );

        const sessionToken =
            tokenService.createSessionToken(
                user.id
            );

        tokenService.saveTokens(
            accessToken,
            refreshToken,
            sessionToken
        );

        if (
            rememberMe
        ) {

            tokenService.rememberMe(
                refreshToken
            );
        }

        sessionService.create(
            user
        );

        sessionService.startMonitoring();

        this.recordLogin(
            user.id
        );

        this.updateLastLogin(
            user.id
        );

        return {

            success: true,

            user,

            accessToken,

            refreshToken,

            sessionToken
        };
    }

    logout() {

        sessionService.logout();

        tokenService.clearTokens();

        return true;
    }

    getCurrentUser() {

        const token =
            tokenService.getAccessToken();

        if (!token)
            return null;

        const userId =
            tokenService.getUserId(
                token
            );

        if (!userId)
            return null;

        return this.findById(
            userId
        );
    }

    updateLastLogin(
        userId
    ) {

        const users =
            this.getUsers();

        const user =
            users.find(
                u =>
                    u.id === userId
            );

        if (!user)
            return;

        user.lastLoginAt =
            new Date()
                .toISOString();

        user.updatedAt =
            new Date()
                .toISOString();

        this.saveUsers(
            users
        );
    }

    recordLogin(
        userId
    ) {

        const history =
            JSON.parse(
                localStorage.getItem(
                    this.LOGIN_HISTORY_KEY
                ) || "[]"
            );

        history.unshift({

            id:
                crypto.randomUUID(),

            userId,

            device:
                navigator.userAgent,

            loginAt:
                new Date()
                    .toISOString()
        });

        localStorage.setItem(
            this.LOGIN_HISTORY_KEY,
            JSON.stringify(
                history.slice(
                    0,
                    1000
                )
            )
        );
    }

    getLoginHistory() {

        return JSON.parse(
            localStorage.getItem(
                this.LOGIN_HISTORY_KEY
            ) || "[]"
        );
    }

    audit(
        action,
        userId
    ) {

        const logs =
            JSON.parse(
                localStorage.getItem(
                    "auth_audit"
                ) || "[]"
            );

        logs.unshift({

            id:
                crypto.randomUUID(),

            action,

            userId,

            timestamp:
                new Date()
                    .toISOString()
        });

        localStorage.setItem(
            "auth_audit",
            JSON.stringify(
                logs.slice(
                    0,
                    1000
                )
            )
        );
    }

    isLoggedIn() {

        return (
            sessionService.isAuthenticated()
        );
    }
}

const authService =
    new AuthService();

export default authService;
