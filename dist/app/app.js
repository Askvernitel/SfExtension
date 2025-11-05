import { ServiceRegistry } from "../decorators/service.decorator";
export default class App {
    bootstrap(config) {
        this.config = config;
        if (config.serviceOn) {
            this.initServices();
        }
    }
    initServices() {
        let reg = new ServiceRegistry();
        this.serviceRegistry = reg;
    }
    get serviceRegistry() {
        return this._serviceRegistry;
    }
    set serviceRegistry(serviceRegistry) {
        this._serviceRegistry = serviceRegistry;
    }
}
//# sourceMappingURL=app.js.map