export default class ChangeService {
    constructor(durationBetweenChange, browserApi) {
        this.tabCallbacks = [];
        this.durationBetweenChange = 1000;
        this.durationBetweenChange = durationBetweenChange;
        console.log("HEHEHEH");
        browser.action.onClicked.addListener((tab) => {
            console.log(tab.url);
            console.log("Notifying tab change...");
            this.tabCallbacks.forEach(callback => {
                callback({ URL: tab.url, name: tab.url });
            });
        });
        setInterval(() => {
        }, durationBetweenChange);
    }
    registerTab(tabCallback) {
        this.tabCallbacks.push(tabCallback);
    }
}
//# sourceMappingURL=change.service.js.map