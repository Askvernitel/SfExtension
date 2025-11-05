function Service(constructor) {
    return class extends constructor {
    };
}
export class ServiceRegistry {
    constructor() {
        this.registry = new Map;
    }
    find(serviceName) {
        return this.registry.get(serviceName);
    }
    registerService(name, service) {
        if (!this.find(name)) {
            return false;
        }
        this.registry.set(name, service);
        return true;
    }
    static Inject() {
    }
}
//# sourceMappingURL=service.decorator.js.map