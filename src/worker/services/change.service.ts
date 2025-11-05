import { TabChangeCallback } from "../../callbacks/change.callbacks";
import Tab from "../../models/tab.model";

export default class ChangeService {
    tabCallbacks: TabChangeCallback[] = [];
    durationBetweenChange: number = 1000;
    private browser: typeof browser;

    constructor(durationBetweenChange: number, browserAPI: typeof browser) {
        this.durationBetweenChange = durationBetweenChange;
        this.browser = browserAPI;

        this.browser.tabs.onActivated.addListener((tab) => {
            this.browser.tabs.get(tab.tabId).then((tab) => {
                const tabModel = { URL: tab.url || '', name: tab.title || '' } as Tab;
                this.tabCallbacks.forEach(callback => callback(tabModel));
            });
        });
    }

    registerTab(tabCallback: TabChangeCallback) {
        this.tabCallbacks.push(tabCallback);
    }
}
