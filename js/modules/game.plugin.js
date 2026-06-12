export default (kernel) => {

    const rng = () =>
        crypto.getRandomValues(new Uint32Array(1))[0] / 4294967295;

    const games = {

        spin(user) {

            const reward = Math.floor(rng() * 999);

            kernel.updateState(state => {

                user.wallet = (user.wallet || 0) + reward;

                return state;
            });

            kernel.emit("game:spin", { user, reward });

            return { reward };
        },

        dice(user) {

            const roll = Math.floor(rng() * 100) + 1;

            const win = roll > 50;

            const delta = win ? 300 : -150;

            kernel.updateState(state => {

                user.wallet += delta;
                return state;
            });

            return { roll, delta };
        },

        crash(user) {

            const crashPoint = (rng() * 15).toFixed(2);

            const win = rng() > 0.5;

            const profit = win ? 800 : -200;

            user.wallet += profit;

            return { crashPoint, profit };
        }
    };

    return games;
};
