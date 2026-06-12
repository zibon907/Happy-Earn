export default (kernel) => {

    return {

        credit(user, amount) {

            kernel.updateState(state => {

                user.wallet = (user.wallet || 0) + amount;

                return state;
            });

            kernel.emit("wallet:credit", { user, amount });
        },

        debit(user, amount) {

            kernel.updateState(state => {

                user.wallet = Math.max(0, user.wallet - amount);

                return state;
            });

            kernel.emit("wallet:debit", { user, amount });
        },

        snapshot(user) {

            return {
                id: user.id,
                wallet: user.wallet,
                ts: Date.now()
            };
        }
    };
};
