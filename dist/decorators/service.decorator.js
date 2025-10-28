"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ServiceRegistry {
    serviceRegistry;
    find(serviceName) {
        return this.serviceRegistry.get(serviceName);
    }
    registerService(name, service) {
        if (!this.find(name)) {
            return false;
        }
        this.serviceRegistry[name] = service;
        return true;
    }
}
//# sourceMappingURL=service.decorator.js.map