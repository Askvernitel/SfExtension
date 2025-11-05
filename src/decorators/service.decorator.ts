

function Service<T extends { new(...args: any[]): {} }>(constructor: T) {
		return class extends constructor {
		}
}

export class ServiceRegistry {
	registry: Map<string, object>

	constructor() {
		this.registry = new Map<string, object>
	}

	private find(serviceName: string) {

		return this.registry.get(serviceName);
	}

	private registerService(name: string, service: object): boolean {
		if (!this.find(name)) {
			return false;
		}
		this.registry.set(name, service);
		return true;
	}

	

	public static Inject() {

	}
}


