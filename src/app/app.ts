import Config from "../config/config";
import { ServiceRegistry } from "../decorators/service.decorator";



export default class App {
	config!: Config;
	_serviceRegistry!: ServiceRegistry;
	bootstrap(config: Config) {
		this.config = config;
		if (config.serviceOn) {
			this.initServices();
		}
	}

	initServices() {
		let reg = new ServiceRegistry();
		this._serviceRegistry = reg;

	}
}
