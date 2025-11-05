import Config from "../config/config";
import { ServiceRegistry } from "../decorators/service.decorator";
import ChangeController from "../worker/controllers/change.controller";
import ChangeService from "../worker/services/change.service";



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
		this.serviceRegistry = reg;

	}
	get serviceRegistry(): ServiceRegistry {
		return this._serviceRegistry;
	}

	set serviceRegistry(serviceRegistry: ServiceRegistry) {
		this._serviceRegistry = serviceRegistry;
	}
}
