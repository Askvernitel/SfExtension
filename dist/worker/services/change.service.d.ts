import { TabChangeCallback } from "../../callbacks/change.callbacks";
export default class ChangeService {
    tabCallbacks: TabChangeCallback[];
    durationBetweenChange: number;
    private browser;
    constructor(durationBetweenChange: number, browserAPI: typeof browser);
    registerTab(tabCallback: TabChangeCallback): void;
}
//# sourceMappingURL=change.service.d.ts.map