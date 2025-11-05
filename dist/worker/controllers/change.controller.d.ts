import { TabChangeCallback } from "../../callbacks/change.callbacks";
import ChangeService from "../services/change.service";
export default class ChangeController {
    changeService: ChangeService;
    constructor(changeService: ChangeService);
    onTabChange(callback: TabChangeCallback): void;
}
//# sourceMappingURL=change.controller.d.ts.map