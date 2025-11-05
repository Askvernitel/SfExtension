export declare class ServiceRegistry {
    serviceRegistry: Map<string, object>;
    constructor();
    private find;
    private registerService;
    Service<T extends {
        new (...args: any[]): {};
    }>(constructor: T): void;
}
//# sourceMappingURL=service.decorator.d.ts.map