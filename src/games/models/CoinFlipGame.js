import gameEngine from "../engine/GameEngine.js";

class CoinFlipGame {

    constructor() {

        this.GAME_TYPE = "COIN_FLIP";

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
            "number"
        ) {

            throw new Error(
                "Invalid bet amount"
            );
        }

        if (
            !this.SIDES.includes(
                choice
            )
        ) {

            throw new Error(
                "Invalid coin choice"
            );
        }

        return true;
    }

    flip() {

        const index =
            Math.floor(
                Math.random() * 2
            );

        return this.SIDES[index];
    }

    checkWin(
        choice,
        result
    ) {

        return (
            choice === result
        );
    }

    async play({
        userId,
        betAmount,
        choice
    }) {

        this.validateInput({

            userId,
            betAmount,
            choice
        });

        const result =
            this.flip();

        const win =
            this.checkWin(
                choice,
                result
            );

        if (win) {

            return gameEngine
                .processWin({

                    userId,

                    gameType:
                        this.GAME_TYPE,

                    betAmount,

                    multiplier:
                        this.DEFAULT_MULTIPLIER,

                    choice,

                    result
                });
        }

        return gameEngine
            .processLoss({

                userId,

                gameType:
                    this.GAME_TYPE,

                betAmount,

                choice,

                result
            });
    }

    getRules() {

        return {

            game:
                this.GAME_TYPE,

            choices:
                this.SIDES,

            multiplier:
                this.DEFAULT_MULTIPLIER
        };
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
                (
                    heads /
                    rounds
                ) * 100,

            tailsPercent:
                (
                    tails /
                    rounds
                ) * 100
        };
    }
}

const coinFlipGame =
    new CoinFlipGame();

export default coinFlipGame;
