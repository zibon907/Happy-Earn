export default class User {

    constructor(data = {}) {

        this.id =
            data.id ||
            crypto.randomUUID();

        this.username =
            data.username || "";

        this.email =
            data.email || "";

        this.passwordHash =
            data.passwordHash || "";

        this.role =
            data.role || "user";

        this.walletId =
            data.walletId || null;

        this.xp =
            Number(data.xp || 0);

        this.level =
            Number(data.level || 1);

        this.vipLevel =
            Number(data.vipLevel || 0);

        this.referralCode =
            data.referralCode ||
            this.generateReferralCode();

        this.referredBy =
            data.referredBy || null;

        this.isActive =
            data.isActive !== undefined
                ? data.isActive
                : true;

        this.isVerified =
            data.isVerified || false;

        this.lastLoginAt =
            data.lastLoginAt || null;

        this.createdAt =
            data.createdAt ||
            new Date().toISOString();

        this.updatedAt =
            data.updatedAt ||
            new Date().toISOString();

        this.metadata =
            data.metadata || {};
    }

    generateReferralCode() {

        return (
            "REF-" +
            Math.random()
                .toString(36)
                .substring(2, 10)
                .toUpperCase()
        );
    }

    updateProfile(payload = {}) {

        if (payload.username) {
            this.username =
                payload.username;
        }

        if (payload.email) {
            this.email =
                payload.email;
        }

        this.touch();

        return this;
    }

    addXP(amount) {

        amount = Number(amount);

        if (amount <= 0) {
            return;
        }

        this.xp += amount;

        this.calculateLevel();

        this.touch();
    }

    calculateLevel() {

        this.level =
            Math.floor(
                this.xp / 1000
            ) + 1;
    }

    promoteVIP(level) {

        if (
            level >
            this.vipLevel
        ) {
            this.vipLevel =
                level;

            this.touch();
        }
    }

    activate() {

        this.isActive = true;

        this.touch();
    }

    deactivate() {

        this.isActive = false;

        this.touch();
    }

    verify() {

        this.isVerified = true;

        this.touch();
    }

    setPasswordHash(hash) {

        this.passwordHash =
            hash;

        this.touch();
    }

    recordLogin() {

        this.lastLoginAt =
            new Date().toISOString();

        this.touch();
    }

    hasRole(role) {

        return (
            this.role === role
        );
    }

    touch() {

        this.updatedAt =
            new Date().toISOString();
    }

    toJSON() {

        return {

            id: this.id,

            username:
                this.username,

            email:
                this.email,

            passwordHash:
                this.passwordHash,

            role:
                this.role,

            walletId:
                this.walletId,

            xp:
                this.xp,

            level:
                this.level,

            vipLevel:
                this.vipLevel,

            referralCode:
                this.referralCode,

            referredBy:
                this.referredBy,

            isActive:
                this.isActive,

            isVerified:
                this.isVerified,

            lastLoginAt:
                this.lastLoginAt,

            createdAt:
                this.createdAt,

            updatedAt:
                this.updatedAt,

            metadata:
                this.metadata
        };
    }

    static fromJSON(data) {

        return new User(data);
    }
  }
