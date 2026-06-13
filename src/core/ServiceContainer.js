import ServiceContainer from "./ServiceContainer.js";
export default class ServiceContainer {

    constructor() {

        this.services = new Map();

        this.singletons = new Map();
    }

    register(name, factory) {

        if (this.services.has(name)) {
            throw new Error(
                `Service already registered: ${name}`
            );
        }

        this.services.set(name, factory);

        return this;
    }

    singleton(name, factory) {

        if (this.singletons.has(name)) {
            throw new Error(
                `Singleton already registered: ${name}`
            );
        }

        this.singletons.set(name, {
            factory,
            instance: null
        });

        return this;
    }

    resolve(name) {

        if (this.singletons.has(name)) {

            const entry =
                this.singletons.get(name);

            if (!entry.instance) {

                entry.instance =
                    entry.factory(this);
            }

            return entry.instance;
        }

        if (this.services.has(name)) {

            return this.services
                .get(name)(this);
        }

        throw new Error(
            `Service not found: ${name}`
        );
    }

    has(name) {

        return (
            this.services.has(name) ||
            this.singletons.has(name)
        );
    }

    remove(name) {

        this.services.delete(name);

        this.singletons.delete(name);
    }

    clear() {

        this.services.clear();

        this.singletons.clear();
    }
}
