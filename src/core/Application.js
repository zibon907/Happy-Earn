import Application from "./Application.js";
export default class Application {

    constructor() {
        this.booted = false;
    }

    async boot() {
        this.booted = true;
        console.log("[APP] Booted");
    }
}
class Bootstrap {

    constructor() {

        this.app = null;
    }

    async start() {

        try {

            this.showBootMessage();

            this.app =
                new Application();

            await this.app.boot();

            window.App = this.app;

            this.initializeDOM();

            this.initializeEvents();

            this.showReadyMessage();

        } catch (error) {

            console.error(
                "[BOOTSTRAP ERROR]",
                error
            );

            this.renderFatalError(
                error.message
            );
        }
    }

    initializeDOM() {

        document.body.classList.add(
            "app-ready"
        );
    }

    initializeEvents() {

        window.addEventListener(
            "error",
            event => {

                console.error(
                    "[GLOBAL ERROR]",
                    event.error
                );
            }
        );

        window.addEventListener(
            "unhandledrejection",
            event => {

                console.error(
                    "[PROMISE ERROR]",
                    event.reason
                );
            }
        );
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

        document.body.innerHTML = `
            <div
                style="
                    min-height:100vh;
                    display:flex;
                    align-items:center;
                    justify-content:center;
                    background:#0b1120;
                    color:white;
                    font-family:Arial,sans-serif;
                "
            >
                <div>
                    <h1>
                        Application Error
                    </h1>

                    <p>
                        ${message}
                    </p>
                </div>
            </div>
        `;
    }
}

export default new Bootstrap();
