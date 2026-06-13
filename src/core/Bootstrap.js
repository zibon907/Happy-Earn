import Application from "./Application.js";

class Bootstrap {

    constructor() {

        this.app = null;

        this.started = false;
    }

    async start() {

        if (this.started) {
            return;
        }

        this.started = true;

        try {

            this.showBootMessage();

            this.app = new Application();

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
                error?.message ||
                "Unknown application error"
            );
        }
    }

    initializeDOM() {

        document.body.classList.add(
            "app-ready"
        );

        document.documentElement.setAttribute(
            "data-app-status",
            "ready"
        );
    }

    initializeEvents() {

        window.addEventListener(
            "error",
            (event) => {

                console.error(
                    "[GLOBAL ERROR]",
                    {
                        message: event.message,
                        source: event.filename,
                        line: event.lineno,
                        column: event.colno,
                        error: event.error
                    }
                );
            }
        );

        window.addEventListener(
            "unhandledrejection",
            (event) => {

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
            `
            color:#00e5ff;
            font-size:14px;
            font-weight:bold;
            `
        );
    }

    showReadyMessage() {

        console.log(
            "%cPLATFORM READY",
            `
            color:#22c55e;
            font-size:14px;
            font-weight:bold;
            `
        );
    }

    renderFatalError(message) {

        const safeMessage =
            String(message)
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;");

        document.body.innerHTML = `
            <div
                style="
                    min-height:100vh;
                    display:flex;
                    align-items:center;
                    justify-content:center;
                    background:#0b1120;
                    color:#ffffff;
                    font-family:Inter,Arial,sans-serif;
                    padding:24px;
                "
            >
                <div
                    style="
                        max-width:600px;
                        text-align:center;
                    "
                >
                    <h1>
                        Application Error
                    </h1>

                    <p>
                        ${safeMessage}
                    </p>
                </div>
            </div>
        `;
    }
}

const bootstrap = new Bootstrap();

Object.freeze(bootstrap);

export default bootstrap;
