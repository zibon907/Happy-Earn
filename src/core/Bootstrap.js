import Application from "./src/core/Application.js";

class Bootstrap {

    constructor() {

        this.app = null;
        this.started = false;
    }

    async start() {

        if (this.started) return;

        this.started = true;

        try {

            this.showBootMessage();

            this.app = new Application();

            if (!this.app || typeof this.app.boot !== "function") {
                throw new Error("Application failed to load or invalid constructor");
            }

            await this.app.boot();

            window.App = this.app;

            this.initializeDOM();
            this.initializeEvents();

            this.showReadyMessage();

        } catch (error) {

            console.error("[BOOTSTRAP ERROR]", error);

            this.renderFatalError(
                error?.message || "Unknown application error"
            );
        }
    }

    initializeDOM() {

        document.body.classList.add("app-ready");

        document.documentElement.setAttribute(
            "data-app-status",
            "ready"
        );
    }

    initializeEvents() {

        window.addEventListener("error", (event) => {
            console.error("[GLOBAL ERROR]", event.error);
        });

        window.addEventListener("unhandledrejection", (event) => {
            console.error("[PROMISE ERROR]", event.reason);
        });
    }

    showBootMessage() {

        console.log(
            "%cBOOTSTRAP START",
            "color:#00e5ff;font-size:14px;font-weight:bold"
        );
    }

    showReadyMessage() {

        console.log(
            "%cPLATFORM READY",
            "color:#22c55e;font-size:14px;font-weight:bold"
        );
    }

    renderFatalError(message) {

        const safe = String(message)
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");

        document.body.innerHTML = `
            <div style="
                min-height:100vh;
                display:flex;
                align-items:center;
                justify-content:center;
                background:#0b1120;
                color:#fff;
                font-family:Arial;
                padding:20px;
            ">
                <div>
                    <h1>Application Error</h1>
                    <p>${safe}</p>
                </div>
            </div>
        `;
    }
}

export default new Bootstrap();
