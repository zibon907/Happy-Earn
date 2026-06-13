import gameEngine from "../engine/GameEngine.js";

class CoinFlipGame {

    constructor() {

        this.GAME_TYPE =
            "COIN_FLIP";

        this.SIDES = [
            "HEADS",
            "TAILS"
        ];

        this.DEFAULT_MULTIPLIER = 2;
    }

    validateInput({
        userId,
        betAmount,
        choice
    }) {

        if (!userId) {

            throw new Error(
                "User ID required"
            );
        }

        if (
            typeof betAmount !==
                "number" ||
            isNaN(betAmount)
        ) {

            throw new Error(
                "Invalid bet amount"
            );
        }

        const normalizedChoice =
            String(choice)
                .toUpperCase()
                .trim();

        if (
            !this.SIDES.includes(
                normalizedChoice
            )
        ) {

            throw new Error(
                "Invalid coin choice"
            );
        }

        return normalizedChoice;
    }

    flip() {

        const index =
            Math.floor(
                Math.random() * 2
            );

        return this.SIDES[index];
    }

    getRandomSeed() {

        return (
            Date.now() +
            Math.random()
        );
    }

    createResultObject({
        userId,
        betAmount,
        choice,
        outcome,
        gameResult
    }) {

        return {

            gameType:
                this.GAME_TYPE,

            userId,

            betAmount,

            prediction:
                choice,

            outcome,

            result:
                gameResult.result,

            reward:
                gameResult.reward || 0,

            gameId:
                gameResult.id,

            playedAt:
                new Date()
                    .toISOString()
        };
    }

    async play({
        userId,
        betAmount,
        choice
    }) {

        const normalizedChoice =
            this.validateInput({

                userId,
                betAmount,
                choice
            });

        const outcome =
            this.flip();

        const gameResult =
            gameEngine.placeBet({

                userId,

                gameType:
                    this.GAME_TYPE,

                betAmount,

                prediction:
                    normalizedChoice,

                outcome,

                multiplier:
                    this.DEFAULT_MULTIPLIER
            });

        return this.createResultObject({

            userId,

            betAmount,

            choice:
                normalizedChoice,

            outcome,

            gameResult
        });
    }

    getRules() {

        return {

            game:
                this.GAME_TYPE,

            multiplier:
                this.DEFAULT_MULTIPLIER,

            minimumChoices:
                2,

            choices:
                [...this.SIDES]
        };
    }

    getAvailableChoices() {

        return [
            ...this.SIDES
        ];
    }

    simulate(
        rounds = 1000
    ) {

        let heads = 0;
        let tails = 0;

        for (
            let i = 0;
            i < rounds;
            i++
        ) {

            const result =
                this.flip();

            if (
                result ===
                "HEADS"
            ) {

                heads++;

            } else {

                tails++;
            }
        }

        return {

            rounds,

            heads,

            tails,

            headsPercent:
                Number(
                    (
                        heads /
                        rounds
                    ) * 100
                ).toFixed(2),

            tailsPercent:
                Number(
                    (
                        tails /
                        rounds
                    ) * 100
                ).toFixed(2)
        };
    }

    healthCheck() {

        return {

            game:
                this.GAME_TYPE,

            status:
                "ACTIVE",

            multiplier:
                this.DEFAULT_MULTIPLIER,

            timestamp:
                new Date()
                    .toISOString()
        };
    }
}

const coinFlipGame =
    new CoinFlipGame();

export default coinFlipGame;
