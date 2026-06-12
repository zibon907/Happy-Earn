import { kernel } from "./core.kernel.js";
import gamePlugin from "./modules/game.plugin.js";
import walletPlugin from "./modules/wallet.plugin.js";

// attach modules dynamically
kernel.register("game", gamePlugin);
kernel.register("wallet", walletPlugin);

// event debugging layer
kernel.on("game:spin", (data) => {
    console.log("[SPIN EVENT]", data);
});

kernel.on("state:update", (state) => {
    console.log("[STATE UPDATED]", state);
});

// runtime demo user
const user = {
    id: "u1",
    wallet: 1000
};

// use system
const game = kernel.get("game");
const wallet = kernel.get("wallet");

game.spin(user);
game.dice(user);

wallet.credit(user, 500);
