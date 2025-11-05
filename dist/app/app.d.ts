import Config from "../config/config";
import { ServiceRegistry } from "../decorators/service.decorator";
export default class App {
    config: Config;
    _serviceRegistry: ServiceRegistry;
    bootstrap(config: Config): void;
    initServices(): void;
    get serviceRegistry(): ServiceRegistry;
    set serviceRegistry(serviceRegistry: ServiceRegistry);
}
//# sourceMappingURL=app.d.ts.map