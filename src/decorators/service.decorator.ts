

class ServiceRegistry {
	serviceRegistry: Map<string, object>

	constructor() {
		this.serviceRegistry = new Map<string, object>
	}

	find(serviceName: string) {

		return this.serviceRegistry.get(serviceName);
	}

	registerService(name: string, service: object): boolean {
		if (!this.find(name)) {
			return false;
		}
		this.serviceRegistry.set(name, service);
		return true;
	}
}


