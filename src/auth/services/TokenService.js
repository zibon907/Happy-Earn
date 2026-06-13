class TokenService {

    constructor() {

        this.STORAGE_KEYS = {

            ACCESS_TOKEN:
                "access_token",

            REFRESH_TOKEN:
                "refresh_token",

            SESSION_TOKEN:
                "session_token"
        };

        this.EXPIRY = {

            ACCESS:
                1000 * 60 * 30,

            REFRESH:
                1000 * 60 * 60 * 24 * 30,

            SESSION:
                1000 * 60 * 60 * 12
        };
    }

    generateUUID() {

        if (
            crypto &&
            crypto.randomUUID
        ) {
            return crypto.randomUUID();
        }

        return (
            Date.now() +
            "-" +
            Math.random()
                .toString(36)
                .substring(2)
        );
    }

    generateTokenPayload(
        userId,
        type = "access"
    ) {

        const now =
            Date.now();

        let expiresAt =
            now +
            this.EXPIRY.ACCESS;

        if (
            type === "refresh"
        ) {
            expiresAt =
                now +
                this.EXPIRY.REFRESH;
        }

        if (
            type === "session"
        ) {
            expiresAt =
                now +
                this.EXPIRY.SESSION;
        }

        return {

            tokenId:
                this.generateUUID(),

            userId,

            type,

            issuedAt: now,

            expiresAt,

            device:
                navigator.userAgent,

            version: 1
        };
    }

    encode(payload) {

        return btoa(
            JSON.stringify(payload)
        );
    }

    decode(token) {

        try {

            return JSON.parse(
                atob(token)
            );

        } catch {

            return null;
        }
    }

    createAccessToken(
        userId
    ) {

        const payload =
            this.generateTokenPayload(
                userId,
                "access"
            );

        return this.encode(
            payload
        );
    }

    createRefreshToken(
        userId
    ) {

        const payload =
            this.generateTokenPayload(
                userId,
                "refresh"
            );

        return this.encode(
            payload
        );
    }

    createSessionToken(
        userId
    ) {

        const payload =
            this.generateTokenPayload(
                userId,
                "session"
            );

        return this.encode(
            payload
        );
    }

    isExpired(token) {

        const payload =
            this.decode(token);

        if (!payload)
            return true;

        return (
            Date.now() >
            payload.expiresAt
        );
    }

    validate(token) {

        const payload =
            this.decode(token);

        if (!payload) {

            return {

                valid: false,

                reason:
                    "INVALID_TOKEN"
            };
        }

        if (
            this.isExpired(
                token
            )
        ) {

            return {

                valid: false,

                reason:
                    "TOKEN_EXPIRED"
            };
        }

        return {

            valid: true,

            payload
        };
    }

    getUserId(token) {

        const result =
            this.validate(
                token
            );

        if (
            !result.valid
        ) {
            return null;
        }

        return result.payload
            .userId;
    }

    saveTokens(
        accessToken,
        refreshToken,
        sessionToken
    ) {

        localStorage.setItem(
            this.STORAGE_KEYS
                .ACCESS_TOKEN,
            accessToken
        );

        localStorage.setItem(
            this.STORAGE_KEYS
                .REFRESH_TOKEN,
            refreshToken
        );

        localStorage.setItem(
            this.STORAGE_KEYS
                .SESSION_TOKEN,
            sessionToken
        );
    }

    getAccessToken() {

        return localStorage.getItem(
            this.STORAGE_KEYS
                .ACCESS_TOKEN
        );
    }

    getRefreshToken() {

        return localStorage.getItem(
            this.STORAGE_KEYS
                .REFRESH_TOKEN
        );
    }

    getSessionToken() {

        return localStorage.getItem(
            this.STORAGE_KEYS
                .SESSION_TOKEN
        );
    }

    clearTokens() {

        localStorage.removeItem(
            this.STORAGE_KEYS
                .ACCESS_TOKEN
        );

        localStorage.removeItem(
            this.STORAGE_KEYS
                .REFRESH_TOKEN
        );

        localStorage.removeItem(
            this.STORAGE_KEYS
                .SESSION_TOKEN
        );
    }

    refreshAccessToken() {

    const refreshToken =
        this.getRefreshToken();

    const validation =
        this.validate(
            refreshToken
        );

    if (!validation.valid) {
        return null;
    }

    const newAccessToken =
        this.createAccessToken(
            validation.payload.userId
        );

    localStorage.setItem(
        this.STORAGE_KEYS.ACCESS_TOKEN,
        newAccessToken
    );

    return newAccessToken;
}

    revokeAll() {

        this.clearTokens();
    }

    isLoggedIn() {

        const token =
            this.getAccessToken();

        if (!token)
            return false;

        return this.validate(
            token
        ).valid;
    }

    getCurrentSession() {

        const token =
            this.getSessionToken();

        if (!token)
            return null;

        const result =
            this.validate(
                token
            );

        if (
            !result.valid
        ) {
            return null;
        }

        return result.payload;
    }

    rememberMe(
        refreshToken
    ) {

        localStorage.setItem(
            "remember_me",
            refreshToken
        );
    }

    getRememberedToken() {

        return localStorage.getItem(
            "remember_me"
        );
    }

    clearRememberedToken() {

        localStorage.removeItem(
            "remember_me"
        );
    }
}

const tokenService =
    new TokenService();

export default tokenService;
