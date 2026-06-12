class Kernel {

    constructor() {

        this.modules = new Map();
        this.events = new Map();
        this.state = Object.freeze({
            users: [],
            sessions: [],
            games: []
        });
    }

    // ===============================
    // MODULE REGISTRY (PLUG-IN SYSTEM)
    // ===============================
    register(name, module) {

        if (this.modules.has(name)) {
            throw new Error("Module already exists: " + name);
        }

        this.modules.set(name, module(this));

        return true;
    }

    get(name) {
        return this.modules.get(name);
    }

    // ===============================
    // EVENT SYSTEM (LIGHTWEIGHT BUS)
    // ===============================
    on(event, fn) {

        if (!this.events.has(event)) {
            this.events.set(event, []);
        }

        this.events.get(event).push(fn);
    }

    emit(event, data) {

        const listeners = this.events.get(event) || [];

        listeners.forEach(fn => fn(data));
    }

    // ===============================
    // IMMUTABLE STATE UPDATE ENGINE
    // ===============================
    updateState(fn) {

        const newState = fn(this.state);

        this.state = Object.freeze({
            ...newState
        });

        this.emit("state:update", this.state);
    }

    // ===============================
    // SECURITY LAYER (BASIC INTEGRITY CHECK)
    // ===============================
    verifyToken(token) {

        if (!token || typeof token !== "string") return false;

        return token.startsWith("VR-") && token.length > 10;
    }
}

export const kernel = new Kernel();
