import walletService from "../../wallet/services/WalletService.js";
import transactionService from "../../wallet/services/TransactionService.js";

class GameEngine {

    constructor() {

        this.STORAGE_KEY =
            "game_history";

        this.MIN_BET = 10;
        this.MAX_BET = 100000;

        this.XP_MULTIPLIER = 2;
    }

    generateGameId() {

        if (
            typeof crypto !== "undefined" &&
            crypto.randomUUID
        ) {
            return crypto.randomUUID();
        }

        return (
            "game-" +
            Date.now() +
            "-" +
            Math.random()
                .toString(36)
                .slice(2)
        );
    }
    
        validateBet(amount) {

    if (
        typeof amount !== "number"
    ) {
        throw new Error(
            "Invalid bet amount"
        );
    }

    if (
        amount < this.MIN_BET
    ) {
        throw new Error(
            `Minimum bet is ${this.MIN_BET}`
        );
    }

    if (
        amount > this.MAX_BET
    ) {
        throw new Error(
            `Maximum bet is ${this.MAX_BET}`
        );
    }

    return true;
        }

    getBalance(userId) {

        return walletService
            .getBalance(userId);
    }

    hasEnoughBalance(
        userId,
        amount
    ) {

        const balance =
            this.getBalance(userId);

        return balance >= amount;
    }

    generateRandomNumber(
        min = 1,
        max = 100
    ) {

        return Math.floor(
            Math.random() *
            (max - min + 1)
        ) + min;
    }

    calculateReward(
        betAmount,
        multiplier
    ) {

        return Number(
            (
                betAmount *
                multiplier
            ).toFixed(2)
        );
    }

    createGameRecord(data) {

        return {

            id:
                this.generateGameId(),

            createdAt:
                new Date()
                    .toISOString(),

            ...data
        };
    }

    getHistory() {

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

    saveHistory(history) {

        localStorage.setItem(
            this.STORAGE_KEY,
            JSON.stringify(history)
        );
    }

    addHistory(record) {

        const history =
            this.getHistory();

        history.unshift(
            record
        );

        this.saveHistory(
            history
        );
    }

    processWin({
        userId,
        gameType,
        betAmount,
        multiplier
    }) {

        const reward =
            this.calculateReward(
                betAmount,
                multiplier
            );

        walletService.credit(
            userId,
            reward
        );

        transactionService.create({
            userId,
            type: "WIN",
            amount: reward
        });

        const record =
            this.createGameRecord({

                userId,
                gameType,
                result: "WIN",
                betAmount,
                reward,
                multiplier
            });

        this.addHistory(
            record
        );

        return record;
    }

    processLoss({
    userId,
    gameType,
    betAmount
}) {

    transactionService.create({

        userId,

        type: "LOSS",

        amount: betAmount
    });

    const record =
        this.createGameRecord({

            userId,

            gameType,

            result: "LOSS",

            betAmount
        });

    this.addHistory(
        record
    );

    return record;
    }

    placeBet({
    userId,
    gameType,
    betAmount,
    prediction,
    outcome,
    multiplier = 2
}) {

    this.validateBet(
        betAmount
    );

    if (
        !this.hasEnoughBalance(
            userId,
            betAmount
        )
    ) {

        throw new Error(
            "Insufficient balance"
        );
    }

    // Deduct bet first
    walletService.debit(
        userId,
        betAmount
    );

    const win =
        prediction === outcome;

    if (win) {

        return this.processWin({

            userId,
            gameType,
            betAmount,
            multiplier
        });
    }

    return this.processLoss({

        userId,
        gameType,
        betAmount
    });
}

        const win =
            prediction === outcome;

        if (win) {

            return this.processWin({

                userId,
                gameType,
                betAmount,
                multiplier
            });
        }

        return this.processLoss({

            userId,
            gameType,
            betAmount
        });
    }

    getUserHistory(
        userId
    ) {

        return this.getHistory()
            .filter(
                game =>
                    game.userId ===
                    userId
            );
    }

    getStatistics(userId) {

    const games =
        this.getUserHistory(
            userId
        );

    const wins =
        games.filter(
            g =>
                g.result ===
                "WIN"
        ).length;

    const losses =
        games.filter(
            g =>
                g.result ===
                "LOSS"
        ).length;

    const totalWagered =
        games.reduce(

            (
                total,
                game
            ) =>

                total +
                (
                    game.betAmount ||
                    0
                ),

            0
        );

    const totalWon =
        games.reduce(

            (
                total,
                game
            ) =>

                total +
                (
                    game.reward ||
                    0
                ),

            0
        );

    return {

        totalGames:
            games.length,

        wins,

        losses,

        totalWagered,

        totalWon,

        netProfit:
            totalWon -
            totalWagered,

        winRate:
            games.length
                ? Number(

                      (
                          wins /
                          games.length
                      ) * 100

                  ).toFixed(2)
                : 0
    };
    }

const gameEngine =
    new GameEngine();

export default gameEngine;
