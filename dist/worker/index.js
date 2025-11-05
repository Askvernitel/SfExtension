/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/worker/controllers/change.controller.ts":
/*!*****************************************************!*\
  !*** ./src/worker/controllers/change.controller.ts ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ChangeController)
/* harmony export */ });
class ChangeController {
    constructor(changeService) {
        this.changeService = changeService;
    }
    onTabChange(callback) {
        this.changeService.registerTab(callback);
    }
}


/***/ }),

/***/ "./src/worker/services/change.service.ts":
/*!***********************************************!*\
  !*** ./src/worker/services/change.service.ts ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ChangeService)
/* harmony export */ });
class ChangeService {
    constructor(durationBetweenChange, browserAPI) {
        this.tabCallbacks = [];
        this.durationBetweenChange = 1000;
        this.durationBetweenChange = durationBetweenChange;
        this.browser = browserAPI;
        this.browser.tabs.onActivated.addListener((tab) => {
            this.browser.tabs.get(tab.tabId).then((tab) => {
                const tabModel = { URL: tab.url || '', name: tab.title || '' };
                this.tabCallbacks.forEach(callback => callback(tabModel));
            });
        });
    }
    registerTab(tabCallback) {
        this.tabCallbacks.push(tabCallback);
    }
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!*****************************!*\
  !*** ./src/worker/index.ts ***!
  \*****************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _services_change_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./services/change.service */ "./src/worker/services/change.service.ts");
/* harmony import */ var _controllers_change_controller__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./controllers/change.controller */ "./src/worker/controllers/change.controller.ts");


let changeService = new _services_change_service__WEBPACK_IMPORTED_MODULE_0__["default"](1000, browser);
let changeController = new _controllers_change_controller__WEBPACK_IMPORTED_MODULE_1__["default"](changeService);
changeController.onTabChange((tab) => {
    console.log("Tab changed to: ", tab.URL);
});
// Fuzzy matching score function
function calculateMatchScore(text, query) {
    const lowerText = text.toLowerCase();
    const lowerQuery = query.toLowerCase();
    // Exact match gets highest score
    if (lowerText === lowerQuery)
        return 1000;
    // Starts with query gets high score
    if (lowerText.startsWith(lowerQuery))
        return 500;
    // Contains query as substring
    if (lowerText.includes(lowerQuery))
        return 100;
    // Fuzzy match - count matching characters in order
    let score = 0;
    let textIndex = 0;
    for (const char of lowerQuery) {
        const foundIndex = lowerText.indexOf(char, textIndex);
        if (foundIndex !== -1) {
            score += 10;
            textIndex = foundIndex + 1;
        }
    }
    return score;
}
// Find best matching tab
async function findBestMatchingTab(query) {
    try {
        const tabs = await browser.tabs.query({});
        let bestMatch = null;
        let bestScore = 0;
        for (const tab of tabs) {
            const title = tab.title || '';
            const url = tab.url || '';
            // Calculate scores for both title and URL
            const titleScore = calculateMatchScore(title, query);
            const urlScore = calculateMatchScore(url, query);
            // Use the higher score
            const score = Math.max(titleScore, urlScore);
            if (score > bestScore && score > 0) {
                bestScore = score;
                bestMatch = tab;
            }
        }
        console.log('Best match found with score:', bestScore, bestMatch?.title);
        // Only return a match if the score is significant
        return bestScore > 10 ? bestMatch : null;
    }
    catch (error) {
        console.error('Error querying tabs:', error);
        return null;
    }
}
// Message listener
browser.runtime.onMessage.addListener(async (message, sender) => {
    console.log('Background received message:', message);
    if (message.action === 'searchTabs' && message.query) {
        const matchingTab = await findBestMatchingTab(message.query);
        if (matchingTab && matchingTab.id) {
            try {
                // Switch to the tab
                await browser.tabs.update(matchingTab.id, { active: true });
                // Focus the window containing the tab
                if (matchingTab.windowId) {
                    await browser.windows.update(matchingTab.windowId, { focused: true });
                }
                const response = {
                    found: true,
                    tabId: matchingTab.id
                };
                return Promise.resolve(response);
            }
            catch (error) {
                console.error('Error switching to tab:', error);
                return Promise.resolve({ found: false });
            }
        }
        else {
            return Promise.resolve({ found: false });
        }
    }
    if (message.action === 'toggleSearchBar') {
        // Forward to content script in active tab
        try {
            const tabs = await browser.tabs.query({ active: true, currentWindow: true });
            if (tabs[0]?.id) {
                await browser.tabs.sendMessage(tabs[0].id, { action: 'toggleSearchBar' });
            }
        }
        catch (error) {
            console.error('Error toggling search bar:', error);
        }
    }
    return Promise.resolve();
});
console.log('Background worker loaded');

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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UUFBQyxPQUFPLEtBQUssRUFBRSxDQUFDO1lBQ2IsT0FBTyxDQUFDLEtBQUssQ0FBQyw0QkFBNEIsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUN2RCxDQUFDO0lBQ0wsQ0FBQztJQUVELE9BQU8sT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDO0FBQzdCLENBQUMsQ0FDSixDQUFDO0FBRUYsT0FBTyxDQUFDLEdBQUcsQ0FBQywwQkFBMEIsQ0FBQyxDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vc3JjL3dvcmtlci9jb250cm9sbGVycy9jaGFuZ2UuY29udHJvbGxlci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvd29ya2VyL3NlcnZpY2VzL2NoYW5nZS5zZXJ2aWNlLnRzIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly8vd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovLy93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovLy93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovLy8uL3NyYy93b3JrZXIvaW5kZXgudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgVGFiQ2hhbmdlQ2FsbGJhY2sgfSBmcm9tIFwiLi4vLi4vY2FsbGJhY2tzL2NoYW5nZS5jYWxsYmFja3NcIjtcbmltcG9ydCBDaGFuZ2VTZXJ2aWNlIGZyb20gXCIuLi9zZXJ2aWNlcy9jaGFuZ2Uuc2VydmljZVwiO1xuXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENoYW5nZUNvbnRyb2xsZXJ7XG4gICAgY2hhbmdlU2VydmljZSE6Q2hhbmdlU2VydmljZTtcbiAgICBwdWJsaWMgY29uc3RydWN0b3IoY2hhbmdlU2VydmljZTpDaGFuZ2VTZXJ2aWNlKXtcbiAgICAgICAgdGhpcy5jaGFuZ2VTZXJ2aWNlPWNoYW5nZVNlcnZpY2U7XG4gICAgfVxuXG4gICAgcHVibGljIG9uVGFiQ2hhbmdlKGNhbGxiYWNrOlRhYkNoYW5nZUNhbGxiYWNrKXtcbiAgICAgICAgdGhpcy5jaGFuZ2VTZXJ2aWNlLnJlZ2lzdGVyVGFiKGNhbGxiYWNrKTtcbiAgICB9XG5cblxuXG59IiwiaW1wb3J0IHsgVGFiQ2hhbmdlQ2FsbGJhY2sgfSBmcm9tIFwiLi4vLi4vY2FsbGJhY2tzL2NoYW5nZS5jYWxsYmFja3NcIjtcbmltcG9ydCBUYWIgZnJvbSBcIi4uLy4uL21vZGVscy90YWIubW9kZWxcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2hhbmdlU2VydmljZSB7XG4gICAgdGFiQ2FsbGJhY2tzOiBUYWJDaGFuZ2VDYWxsYmFja1tdID0gW107XG4gICAgZHVyYXRpb25CZXR3ZWVuQ2hhbmdlOiBudW1iZXIgPSAxMDAwO1xuICAgIHByaXZhdGUgYnJvd3NlcjogdHlwZW9mIGJyb3dzZXI7XG5cbiAgICBjb25zdHJ1Y3RvcihkdXJhdGlvbkJldHdlZW5DaGFuZ2U6IG51bWJlciwgYnJvd3NlckFQSTogdHlwZW9mIGJyb3dzZXIpIHtcbiAgICAgICAgdGhpcy5kdXJhdGlvbkJldHdlZW5DaGFuZ2UgPSBkdXJhdGlvbkJldHdlZW5DaGFuZ2U7XG4gICAgICAgIHRoaXMuYnJvd3NlciA9IGJyb3dzZXJBUEk7XG5cbiAgICAgICAgdGhpcy5icm93c2VyLnRhYnMub25BY3RpdmF0ZWQuYWRkTGlzdGVuZXIoKHRhYikgPT4ge1xuICAgICAgICAgICAgdGhpcy5icm93c2VyLnRhYnMuZ2V0KHRhYi50YWJJZCkudGhlbigodGFiKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgdGFiTW9kZWwgPSB7IFVSTDogdGFiLnVybCB8fCAnJywgbmFtZTogdGFiLnRpdGxlIHx8ICcnIH0gYXMgVGFiO1xuICAgICAgICAgICAgICAgIHRoaXMudGFiQ2FsbGJhY2tzLmZvckVhY2goY2FsbGJhY2sgPT4gY2FsbGJhY2sodGFiTW9kZWwpKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICByZWdpc3RlclRhYih0YWJDYWxsYmFjazogVGFiQ2hhbmdlQ2FsbGJhY2spIHtcbiAgICAgICAgdGhpcy50YWJDYWxsYmFja3MucHVzaCh0YWJDYWxsYmFjayk7XG4gICAgfVxufVxuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJcbmltcG9ydCBDaGFuZ2VTZXJ2aWNlIGZyb20gXCIuL3NlcnZpY2VzL2NoYW5nZS5zZXJ2aWNlXCI7XG5pbXBvcnQgQ2hhbmdlQ29udHJvbGxlciBmcm9tIFwiLi9jb250cm9sbGVycy9jaGFuZ2UuY29udHJvbGxlclwiO1xuaW1wb3J0IFRhYiBmcm9tIFwiLi4vbW9kZWxzL3RhYi5tb2RlbFwiO1xuXG5sZXQgY2hhbmdlU2VydmljZTpDaGFuZ2VTZXJ2aWNlID0gbmV3IENoYW5nZVNlcnZpY2UoMTAwMCxicm93c2VyKTtcbmxldCBjaGFuZ2VDb250cm9sbGVyOkNoYW5nZUNvbnRyb2xsZXIgPSBuZXcgQ2hhbmdlQ29udHJvbGxlcihjaGFuZ2VTZXJ2aWNlKTtcblxuY2hhbmdlQ29udHJvbGxlci5vblRhYkNoYW5nZSgodGFiOlRhYik9Pntcblx0Y29uc29sZS5sb2coXCJUYWIgY2hhbmdlZCB0bzogXCIsIHRhYi5VUkwpO1xufSk7XG5cblxuXG4vLyAuL3NyYy93b3JrZXIvaW5kZXgudHNcblxuaW50ZXJmYWNlIFNlYXJjaFRhYnNNZXNzYWdlIHtcbiAgICBhY3Rpb246IHN0cmluZztcbiAgICBxdWVyeT86IHN0cmluZztcbn1cblxuaW50ZXJmYWNlIFNlYXJjaFJlc3BvbnNlIHtcbiAgICBmb3VuZDogYm9vbGVhbjtcbiAgICB0YWJJZD86IG51bWJlcjtcbn1cblxuLy8gRnV6enkgbWF0Y2hpbmcgc2NvcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIGNhbGN1bGF0ZU1hdGNoU2NvcmUodGV4dDogc3RyaW5nLCBxdWVyeTogc3RyaW5nKTogbnVtYmVyIHtcbiAgICBjb25zdCBsb3dlclRleHQgPSB0ZXh0LnRvTG93ZXJDYXNlKCk7XG4gICAgY29uc3QgbG93ZXJRdWVyeSA9IHF1ZXJ5LnRvTG93ZXJDYXNlKCk7XG4gICAgXG4gICAgLy8gRXhhY3QgbWF0Y2ggZ2V0cyBoaWdoZXN0IHNjb3JlXG4gICAgaWYgKGxvd2VyVGV4dCA9PT0gbG93ZXJRdWVyeSkgcmV0dXJuIDEwMDA7XG4gICAgXG4gICAgLy8gU3RhcnRzIHdpdGggcXVlcnkgZ2V0cyBoaWdoIHNjb3JlXG4gICAgaWYgKGxvd2VyVGV4dC5zdGFydHNXaXRoKGxvd2VyUXVlcnkpKSByZXR1cm4gNTAwO1xuICAgIFxuICAgIC8vIENvbnRhaW5zIHF1ZXJ5IGFzIHN1YnN0cmluZ1xuICAgIGlmIChsb3dlclRleHQuaW5jbHVkZXMobG93ZXJRdWVyeSkpIHJldHVybiAxMDA7XG4gICAgXG4gICAgLy8gRnV6enkgbWF0Y2ggLSBjb3VudCBtYXRjaGluZyBjaGFyYWN0ZXJzIGluIG9yZGVyXG4gICAgbGV0IHNjb3JlID0gMDtcbiAgICBsZXQgdGV4dEluZGV4ID0gMDtcbiAgICBcbiAgICBmb3IgKGNvbnN0IGNoYXIgb2YgbG93ZXJRdWVyeSkge1xuICAgICAgICBjb25zdCBmb3VuZEluZGV4ID0gbG93ZXJUZXh0LmluZGV4T2YoY2hhciwgdGV4dEluZGV4KTtcbiAgICAgICAgaWYgKGZvdW5kSW5kZXggIT09IC0xKSB7XG4gICAgICAgICAgICBzY29yZSArPSAxMDtcbiAgICAgICAgICAgIHRleHRJbmRleCA9IGZvdW5kSW5kZXggKyAxO1xuICAgICAgICB9XG4gICAgfVxuICAgIFxuICAgIHJldHVybiBzY29yZTtcbn1cblxuLy8gRmluZCBiZXN0IG1hdGNoaW5nIHRhYlxuYXN5bmMgZnVuY3Rpb24gZmluZEJlc3RNYXRjaGluZ1RhYihxdWVyeTogc3RyaW5nKTogUHJvbWlzZTxicm93c2VyLnRhYnMuVGFiIHwgbnVsbD4ge1xuICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHRhYnMgPSBhd2FpdCBicm93c2VyLnRhYnMucXVlcnkoe30pO1xuICAgICAgICBcbiAgICAgICAgbGV0IGJlc3RNYXRjaDogYnJvd3Nlci50YWJzLlRhYiB8IG51bGwgPSBudWxsO1xuICAgICAgICBsZXQgYmVzdFNjb3JlID0gMDtcbiAgICAgICAgXG4gICAgICAgIGZvciAoY29uc3QgdGFiIG9mIHRhYnMpIHtcbiAgICAgICAgICAgIGNvbnN0IHRpdGxlID0gdGFiLnRpdGxlIHx8ICcnO1xuICAgICAgICAgICAgY29uc3QgdXJsID0gdGFiLnVybCB8fCAnJztcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8gQ2FsY3VsYXRlIHNjb3JlcyBmb3IgYm90aCB0aXRsZSBhbmQgVVJMXG4gICAgICAgICAgICBjb25zdCB0aXRsZVNjb3JlID0gY2FsY3VsYXRlTWF0Y2hTY29yZSh0aXRsZSwgcXVlcnkpO1xuICAgICAgICAgICAgY29uc3QgdXJsU2NvcmUgPSBjYWxjdWxhdGVNYXRjaFNjb3JlKHVybCwgcXVlcnkpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyBVc2UgdGhlIGhpZ2hlciBzY29yZVxuICAgICAgICAgICAgY29uc3Qgc2NvcmUgPSBNYXRoLm1heCh0aXRsZVNjb3JlLCB1cmxTY29yZSk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmIChzY29yZSA+IGJlc3RTY29yZSAmJiBzY29yZSA+IDApIHtcbiAgICAgICAgICAgICAgICBiZXN0U2NvcmUgPSBzY29yZTtcbiAgICAgICAgICAgICAgICBiZXN0TWF0Y2ggPSB0YWI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIGNvbnNvbGUubG9nKCdCZXN0IG1hdGNoIGZvdW5kIHdpdGggc2NvcmU6JywgYmVzdFNjb3JlLCBiZXN0TWF0Y2g/LnRpdGxlKTtcbiAgICAgICAgXG4gICAgICAgIC8vIE9ubHkgcmV0dXJuIGEgbWF0Y2ggaWYgdGhlIHNjb3JlIGlzIHNpZ25pZmljYW50XG4gICAgICAgIHJldHVybiBiZXN0U2NvcmUgPiAxMCA/IGJlc3RNYXRjaCA6IG51bGw7XG4gICAgICAgIFxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIHF1ZXJ5aW5nIHRhYnM6JywgZXJyb3IpO1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG59XG5cbi8vIE1lc3NhZ2UgbGlzdGVuZXJcbmJyb3dzZXIucnVudGltZS5vbk1lc3NhZ2UuYWRkTGlzdGVuZXIoXG4gICAgYXN5bmMgKG1lc3NhZ2U6IFNlYXJjaFRhYnNNZXNzYWdlLCBzZW5kZXI6IGJyb3dzZXIucnVudGltZS5NZXNzYWdlU2VuZGVyKSA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdCYWNrZ3JvdW5kIHJlY2VpdmVkIG1lc3NhZ2U6JywgbWVzc2FnZSk7XG4gICAgICAgIFxuICAgICAgICBpZiAobWVzc2FnZS5hY3Rpb24gPT09ICdzZWFyY2hUYWJzJyAmJiBtZXNzYWdlLnF1ZXJ5KSB7XG4gICAgICAgICAgICBjb25zdCBtYXRjaGluZ1RhYiA9IGF3YWl0IGZpbmRCZXN0TWF0Y2hpbmdUYWIobWVzc2FnZS5xdWVyeSk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmIChtYXRjaGluZ1RhYiAmJiBtYXRjaGluZ1RhYi5pZCkge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFN3aXRjaCB0byB0aGUgdGFiXG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IGJyb3dzZXIudGFicy51cGRhdGUobWF0Y2hpbmdUYWIuaWQsIHsgYWN0aXZlOiB0cnVlIH0pO1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgLy8gRm9jdXMgdGhlIHdpbmRvdyBjb250YWluaW5nIHRoZSB0YWJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG1hdGNoaW5nVGFiLndpbmRvd0lkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhd2FpdCBicm93c2VyLndpbmRvd3MudXBkYXRlKG1hdGNoaW5nVGFiLndpbmRvd0lkLCB7IGZvY3VzZWQ6IHRydWUgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHJlc3BvbnNlOiBTZWFyY2hSZXNwb25zZSA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvdW5kOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGFiSWQ6IG1hdGNoaW5nVGFiLmlkXG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCdFcnJvciBzd2l0Y2hpbmcgdG8gdGFiOicsIGVycm9yKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh7IGZvdW5kOiBmYWxzZSB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoeyBmb3VuZDogZmFsc2UgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIGlmIChtZXNzYWdlLmFjdGlvbiA9PT0gJ3RvZ2dsZVNlYXJjaEJhcicpIHtcbiAgICAgICAgICAgIC8vIEZvcndhcmQgdG8gY29udGVudCBzY3JpcHQgaW4gYWN0aXZlIHRhYlxuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBjb25zdCB0YWJzID0gYXdhaXQgYnJvd3Nlci50YWJzLnF1ZXJ5KHsgYWN0aXZlOiB0cnVlLCBjdXJyZW50V2luZG93OiB0cnVlIH0pO1xuICAgICAgICAgICAgICAgIGlmICh0YWJzWzBdPy5pZCkge1xuICAgICAgICAgICAgICAgICAgICBhd2FpdCBicm93c2VyLnRhYnMuc2VuZE1lc3NhZ2UodGFic1swXS5pZCwgeyBhY3Rpb246ICd0b2dnbGVTZWFyY2hCYXInIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignRXJyb3IgdG9nZ2xpbmcgc2VhcmNoIGJhcjonLCBlcnJvcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgICB9XG4pO1xuXG5jb25zb2xlLmxvZygnQmFja2dyb3VuZCB3b3JrZXIgbG9hZGVkJyk7Il0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9