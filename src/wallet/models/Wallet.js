export default class Wallet {

    constructor(data = {}) {

        this.id =
            data.id ||
            crypto.randomUUID();

        this.userId =
            data.userId || null;

        this.balance =
            Number(
                data.balance || 0
            );

        this.bonusBalance =
            Number(
                data.bonusBalance || 0
            );

        this.lockedBalance =
            Number(
                data.lockedBalance || 0
            );

        this.totalDeposited =
            Number(
                data.totalDeposited || 0
            );

        this.totalWithdrawn =
            Number(
                data.totalWithdrawn || 0
            );

        this.totalWon =
            Number(
                data.totalWon || 0
            );

        this.totalLost =
            Number(
                data.totalLost || 0
            );

        this.totalWagered =
            Number(
                data.totalWagered || 0
            );

        this.totalRewardsClaimed =
            Number(
                data.totalRewardsClaimed || 0
            );

        this.vipMultiplier =
            Number(
                data.vipMultiplier || 1
            );

        this.lastDailyClaim =
            data.lastDailyClaim || null;

        this.createdAt =
            data.createdAt ||
            new Date().toISOString();

        this.updatedAt =
            data.updatedAt ||
            new Date().toISOString();
    }

    credit(amount) {

        amount = Number(amount);

        if (amount <= 0)
            return;

        this.balance += amount;

        this.touch();
    }

    debit(amount) {

        amount = Number(amount);

        if (amount <= 0)
            return false;

        if (
            this.balance < amount
        ) {
            return false;
        }

        this.balance -= amount;

        this.touch();

        return true;
    }

    addBonus(amount) {

        amount = Number(amount);

        this.bonusBalance += amount;

        this.touch();
    }

    consumeBonus(amount) {

        amount = Number(amount);

        if (
            this.bonusBalance < amount
        ) {
            return false;
        }

        this.bonusBalance -= amount;

        this.touch();

        return true;
    }

    lock(amount) {

        amount = Number(amount);

        if (
            this.balance < amount
        ) {
            return false;
        }

        this.balance -= amount;

        this.lockedBalance += amount;

        this.touch();

        return true;
    }

    unlock(amount) {

        amount = Number(amount);

        if (
            this.lockedBalance < amount
        ) {
            return false;
        }

        this.lockedBalance -= amount;

        this.balance += amount;

        this.touch();

        return true;
    }

    addWin(amount) {

        amount = Number(amount);

        this.totalWon += amount;

        this.credit(amount);
    }

    addLoss(amount) {

        amount = Number(amount);

        this.totalLost += amount;

        this.touch();
    }

    addWager(amount) {

        amount = Number(amount);

        this.totalWagered += amount;

        this.touch();
    }

    claimReward(amount) {

        amount = Number(amount);

        this.totalRewardsClaimed += amount;

        this.credit(amount);

        this.touch();
    }

    updateVIP(multiplier) {

        this.vipMultiplier =
            Number(multiplier);

        this.touch();
    }

    touch() {

        this.updatedAt =
            new Date().toISOString();
    }

    toJSON() {

        return {

            id: this.id,

            userId: this.userId,

            balance:
                this.balance,

            bonusBalance:
                this.bonusBalance,

            lockedBalance:
                this.lockedBalance,

            totalDeposited:
                this.totalDeposited,

            totalWithdrawn:
                this.totalWithdrawn,

            totalWon:
                this.totalWon,

            totalLost:
                this.totalLost,

            totalWagered:
                this.totalWagered,

            totalRewardsClaimed:
                this.totalRewardsClaimed,

            vipMultiplier:
                this.vipMultiplier,

            lastDailyClaim:
                this.lastDailyClaim,

            createdAt:
                this.createdAt,

            updatedAt:
                this.updatedAt
        };
    }

    static fromJSON(data) {

        return new Wallet(data);
    }
}
