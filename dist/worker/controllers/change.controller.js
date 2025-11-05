export default class ChangeController {
    constructor(changeService) {
        this.changeService = changeService;
    }
    onTabChange(callback) {
        this.changeService.registerTab(callback);
    }
}
//# sourceMappingURL=change.controller.js.map