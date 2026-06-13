import gameEngine from "../engine/GameEngine.js";

class DiceGame {

    constructor() {

        this.GAME_TYPE = "DICE";

        this.MIN_TARGET = 2;
        this.MAX_TARGET = 98;

        this.MIN_MULTIPLIER = 1.01;
        this.MAX_MULTIPLIER = 95;
    }

    validateInput({
        userId,
        betAmount,
        target,
        direction
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
            target <
                this.MIN_TARGET ||
            target >
                this.MAX_TARGET
        ) {

            throw new Error(
                "Invalid target"
            );
        }

        if (
            direction !== "OVER" &&
            direction !== "UNDER"
        ) {

            throw new Error(
                "Invalid direction"
            );
        }

        return true;
    }

    rollDice() {

        return Number(
            (
                Math.random() *
                100
            ).toFixed(2)
        );
    }

    calculateMultiplier(
        target,
        direction
    ) {

        let chance = 0;

        if (
            direction === "OVER"
        ) {

            chance =
                100 - target;

        } else {

            chance =
                target;
        }

        const multiplier =
            99 / chance;

        return Number(
            multiplier.toFixed(2)
        );
    }

    checkWin(
        roll,
        target,
        direction
    ) {

        if (
            direction === "OVER"
        ) {

            return (
                roll > target
            );
        }

        return (
            roll < target
        );
    }

    async play({
        userId,
        betAmount,
        target,
        direction
    }) {

        this.validateInput({

            userId,
            betAmount,
            target,
            direction
        });

        const roll =
            this.rollDice();

        const win =
            this.checkWin(
                roll,
                target,
                direction
            );

        const multiplier =
            this.calculateMultiplier(
                target,
                direction
            );

        if (win) {

            return gameEngine
                .processWin({

                    userId,

                    gameType:
                        this.GAME_TYPE,

                    betAmount,

                    multiplier,

                    roll,

                    target,

                    direction
                });
        }

        return gameEngine
            .processLoss({

                userId,

                gameType:
                    this.GAME_TYPE,

                betAmount,

                roll,

                target,

                direction
            });
    }

    getRules() {

        return {

            game:
                this.GAME_TYPE,

            minTarget:
                this.MIN_TARGET,

            maxTarget:
                this.MAX_TARGET,

            minMultiplier:
                this.MIN_MULTIPLIER,

            maxMultiplier:
                this.MAX_MULTIPLIER
        };
    }
}

const diceGame =
    new DiceGame();

export default diceGame;
