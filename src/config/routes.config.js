const RoutesConfig = Object.freeze({

    PUBLIC: {

        HOME: "/",

        LOGIN: "/login.html",

        REGISTER: "/register.html"
    },

    USER: {

        DASHBOARD: "/dashboard.html",

        WALLET: "/dashboard.html#wallet",

        REWARDS: "/dashboard.html#rewards",

        LEADERBOARD: "/dashboard.html#leaderboard",

        PROFILE: "/dashboard.html#profile"
    },

    ADMIN: {

        HOME: "/admin/index.html",

        USERS: "/admin/index.html#users",

        WALLETS: "/admin/index.html#wallets",

        TRANSACTIONS: "/admin/index.html#transactions",

        SETTINGS: "/admin/index.html#settings",

        LOGS: "/admin/index.html#logs"
    },

    GAMES: {

        DICE: "/dashboard.html#dice",

        COINFLIP: "/dashboard.html#coinflip",

        SPINWHEEL: "/dashboard.html#spinwheel",

        AVIATOR: "/dashboard.html#aviator"
    },

    ERRORS: {

        NOT_FOUND: "/404.html",

        FORBIDDEN: "/403.html"
    }

});

export default RoutesConfig;
