import ServiceContainer
from "./ServiceContainer.js";

import ModuleLoader
from "./ModuleLoader.js";

export default class Application {

    constructor() {

        this.version = "1.0.0";

        this.started = false;

        this.container =
            new ServiceContainer();

        this.modules =
            new ModuleLoader();
    }

    async boot() {

        if (this.started) {

            return;
        }

        console.log(
            "[APP] Booting Platform..."
        );

        await this.registerCoreServices();

        await this.loadModules();

        this.started = true;

        console.log(
            "[APP] Boot Complete"
        );
    }

    async registerCoreServices() {

        this.container.singleton(
            "eventBus",
            () => ({
                emit() {},
                on() {}
            })
        );

        this.container.singleton(
            "config",
            () => ({
                environment:
                    "development"
            })
        );
    }

    async loadModules() {

        console.log(
            "[APP] Loading Modules..."
        );
    }

    getContainer() {

        return this.container;
    }

    getModules() {

        return this.modules;
    }
}
