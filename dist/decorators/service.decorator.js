"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceRegistry = void 0;
class ServiceRegistry {
    serviceRegistry;
    constructor() {
        this.serviceRegistry = new Map;
    }
    find(serviceName) {
        return this.serviceRegistry.get(serviceName);
    }
    registerService(name, service) {
        if (!this.find(name)) {
            return false;
        }
        this.serviceRegistry.set(name, service);
        return true;
    }
    Service(constructor) {
        return;
    }
}
exports.ServiceRegistry = ServiceRegistry;
//# sourceMappingURL=service.decorator.js.map