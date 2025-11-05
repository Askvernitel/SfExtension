



export class ServiceRegistry {
	serviceRegistry: Map<string, object>

	constructor() {
		this.serviceRegistry = new Map<string, object>
	}

	private find(serviceName: string) {

		return this.serviceRegistry.get(serviceName);
	}

	private registerService(name: string, service: object): boolean {
		if (!this.find(name)) {
			return false;
		}
		this.serviceRegistry.set(name, service);
		return true;
	}

	Service<T extends { new(...args: any[]): {} }>(constructor: T) {
		return new constructor();
	}
}


