/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
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
/*!*****************************!*\
  !*** ./src/content/view.ts ***!
  \*****************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// ./src/content/view.ts
class SearchBarView {
    constructor() {
        this.container = null;
        this.searchInput = null;
        this.isVisible = false;
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.initialize();
                this.setupKeyboardShortcuts();
            });
        }
        else {
            this.initialize();
            this.setupKeyboardShortcuts();
        }
    }
    initialize() {
        // Create container
        this.container = document.createElement('div');
        this.container.id = 'extension-search-overlay';
        this.container.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            backdrop-filter: blur(5px);
            display: none;
            justify-content: center;
            align-items: center;
            z-index: 2147483647;
            animation: fadeIn 0.2s ease-in-out;
        `;
        // Create search box wrapper
        const searchBox = document.createElement('div');
        searchBox.style.cssText = `
            background: white;
            border-radius: 12px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            width: 90%;
            max-width: 600px;
            padding: 20px;
            animation: slideDown 0.3s ease-out;
        `;
        // Create search input
        this.searchInput = document.createElement('input');
        this.searchInput.type = 'text';
        this.searchInput.placeholder = 'Search or enter URL...';
        this.searchInput.style.cssText = `
            width: 100%;
            padding: 16px 20px;
            font-size: 18px;
            border: 2px solid #e0e0e0;
            border-radius: 8px;
            outline: none;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            transition: border-color 0.2s;
            box-sizing: border-box;
        `;
        // Focus styling
        this.searchInput.addEventListener('focus', () => {
            if (this.searchInput) {
                this.searchInput.style.borderColor = '#4285f4';
            }
        });
        this.searchInput.addEventListener('blur', () => {
            if (this.searchInput) {
                this.searchInput.style.borderColor = '#e0e0e0';
            }
        });
        // Create hint text
        const hintText = document.createElement('div');
        hintText.textContent = 'Press ESC to close • Ctrl+Space to toggle';
        hintText.style.cssText = `
            margin-top: 12px;
            text-align: center;
            color: #888;
            font-size: 14px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        `;
        // Add animations
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            @keyframes slideDown {
                from { 
                    transform: translateY(-30px);
                    opacity: 0;
                }
                to { 
                    transform: translateY(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);
        // Assemble elements
        searchBox.appendChild(this.searchInput);
        searchBox.appendChild(hintText);
        this.container.appendChild(searchBox);
        document.body.appendChild(this.container);
        // Setup event listeners
        this.setupEventListeners();
        console.log('Search bar initialized and added to page');
    }
    setupEventListeners() {
        // Close on overlay click
        this.container?.addEventListener('click', (e) => {
            if (e.target === this.container) {
                this.hide();
            }
        });
        // Handle search submission
        this.searchInput?.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.handleSearch();
            }
            else if (e.key === 'Escape') {
                this.hide();
            }
        });
    }
    setupKeyboardShortcuts() {
        // Listen for Ctrl+Space to toggle search bar
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.code === 'Space') {
                e.preventDefault();
                console.log('Ctrl+Space pressed, toggling search bar');
                this.toggle();
            }
            else if (e.key === 'Escape' && this.isVisible) {
                this.hide();
            }
        });
        // Listen for messages from background script (Firefox)
        browser.runtime.onMessage.addListener((message) => {
            console.log('Message received:', message);
            if (message.action === 'toggleSearchBar') {
                this.toggle();
                return Promise.resolve({ success: true });
            }
            return Promise.resolve();
        });
    }
    async handleSearch() {
        const query = this.searchInput?.value.trim();
        if (!query)
            return;
        try {
            // Request all tabs from background script
            const response = await browser.runtime.sendMessage({
                action: 'searchTabs',
                query: query
            });
            if (response && response.found) {
                // Tab found and switched by background script
                console.log('Switched to tab:', response.tabId);
                this.hide();
                return;
            }
            // No matching tab found, proceed with URL/search
            const isUrl = /^(https?:\/\/|www\.)/.test(query) ||
                (query.includes('.') && !query.includes(' '));
            if (isUrl) {
                const url = query.startsWith('http') ? query : `https://${query}`;
                window.location.href = url;
            }
            else {
                // Search with default search engine (Google)
                const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
                window.location.href = searchUrl;
            }
            this.hide();
        }
        catch (error) {
            console.error('Error searching tabs:', error);
            // Fallback to normal search if something goes wrong
            const isUrl = /^(https?:\/\/|www\.)/.test(query) ||
                (query.includes('.') && !query.includes(' '));
            if (isUrl) {
                const url = query.startsWith('http') ? query : `https://${query}`;
                window.location.href = url;
            }
            else {
                const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
                window.location.href = searchUrl;
            }
            this.hide();
        }
    }
    show() {
        if (this.container && this.searchInput) {
            console.log('Showing search bar');
            this.container.style.display = 'flex';
            this.isVisible = true;
            // Focus input after a brief delay to ensure it's visible
            setTimeout(() => {
                this.searchInput?.focus();
            }, 100);
        }
    }
    hide() {
        if (this.container && this.searchInput) {
            console.log('Hiding search bar');
            this.container.style.display = 'none';
            this.searchInput.value = '';
            this.isVisible = false;
        }
    }
    toggle() {
        if (this.isVisible) {
            this.hide();
        }
        else {
            this.show();
        }
    }
}
// Initialize the search bar when content script loads
const searchBar = new SearchBarView();
console.log('Search bar content script loaded. Press Ctrl+Space to open.');
// Export for potential use in other scripts
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (searchBar);

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Q1AsSUFBSSxJQUFJLENBQUMsU0FBUyxJQUFJLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztZQUNyQyxPQUFPLENBQUMsR0FBRyxDQUFDLG1CQUFtQixDQUFDLENBQUM7WUFDakMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztZQUN0QyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUM7WUFDNUIsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7UUFDM0IsQ0FBQztJQUNMLENBQUM7SUFFTSxNQUFNO1FBQ1QsSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7WUFDakIsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ2hCLENBQUM7YUFBTSxDQUFDO1lBQ0osSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ2hCLENBQUM7SUFDTCxDQUFDO0NBQ0o7QUFFRCxzREFBc0Q7QUFDdEQsTUFBTSxTQUFTLEdBQUcsSUFBSSxhQUFhLEVBQUUsQ0FBQztBQUV0QyxPQUFPLENBQUMsR0FBRyxDQUFDLDZEQUE2RCxDQUFDLENBQUM7QUFFM0UsNENBQTRDO0FBQzVDLGlFQUFlLFNBQVMsRUFBQyIsInNvdXJjZXMiOlsid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly8vd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovLy93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovLy93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovLy8uL3NyYy9jb250ZW50L3ZpZXcudHMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gVGhlIHJlcXVpcmUgc2NvcGVcbnZhciBfX3dlYnBhY2tfcmVxdWlyZV9fID0ge307XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCIvLyAuL3NyYy9jb250ZW50L3ZpZXcudHNcblxuaW50ZXJmYWNlIFNlYXJjaE1lc3NhZ2Uge1xuICAgIGFjdGlvbjogc3RyaW5nO1xufVxuXG5jbGFzcyBTZWFyY2hCYXJWaWV3IHtcbiAgICBwcml2YXRlIGNvbnRhaW5lcjogSFRNTERpdkVsZW1lbnQgfCBudWxsID0gbnVsbDtcbiAgICBwcml2YXRlIHNlYXJjaElucHV0OiBIVE1MSW5wdXRFbGVtZW50IHwgbnVsbCA9IG51bGw7XG4gICAgcHJpdmF0ZSBpc1Zpc2libGU6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICAvLyBXYWl0IGZvciBET00gdG8gYmUgcmVhZHlcbiAgICAgICAgaWYgKGRvY3VtZW50LnJlYWR5U3RhdGUgPT09ICdsb2FkaW5nJykge1xuICAgICAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsICgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmluaXRpYWxpemUoKTtcbiAgICAgICAgICAgICAgICB0aGlzLnNldHVwS2V5Ym9hcmRTaG9ydGN1dHMoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5pbml0aWFsaXplKCk7XG4gICAgICAgICAgICB0aGlzLnNldHVwS2V5Ym9hcmRTaG9ydGN1dHMoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgaW5pdGlhbGl6ZSgpOiB2b2lkIHtcbiAgICAgICAgLy8gQ3JlYXRlIGNvbnRhaW5lclxuICAgICAgICB0aGlzLmNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICB0aGlzLmNvbnRhaW5lci5pZCA9ICdleHRlbnNpb24tc2VhcmNoLW92ZXJsYXknO1xuICAgICAgICB0aGlzLmNvbnRhaW5lci5zdHlsZS5jc3NUZXh0ID0gYFxuICAgICAgICAgICAgcG9zaXRpb246IGZpeGVkO1xuICAgICAgICAgICAgdG9wOiAwO1xuICAgICAgICAgICAgbGVmdDogMDtcbiAgICAgICAgICAgIHdpZHRoOiAxMDAlO1xuICAgICAgICAgICAgaGVpZ2h0OiAxMDAlO1xuICAgICAgICAgICAgYmFja2dyb3VuZDogcmdiYSgwLCAwLCAwLCAwLjcpO1xuICAgICAgICAgICAgYmFja2Ryb3AtZmlsdGVyOiBibHVyKDVweCk7XG4gICAgICAgICAgICBkaXNwbGF5OiBub25lO1xuICAgICAgICAgICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gICAgICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgICAgICAgICAgei1pbmRleDogMjE0NzQ4MzY0NztcbiAgICAgICAgICAgIGFuaW1hdGlvbjogZmFkZUluIDAuMnMgZWFzZS1pbi1vdXQ7XG4gICAgICAgIGA7XG5cbiAgICAgICAgLy8gQ3JlYXRlIHNlYXJjaCBib3ggd3JhcHBlclxuICAgICAgICBjb25zdCBzZWFyY2hCb3ggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgc2VhcmNoQm94LnN0eWxlLmNzc1RleHQgPSBgXG4gICAgICAgICAgICBiYWNrZ3JvdW5kOiB3aGl0ZTtcbiAgICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDEycHg7XG4gICAgICAgICAgICBib3gtc2hhZG93OiAwIDIwcHggNjBweCByZ2JhKDAsIDAsIDAsIDAuMyk7XG4gICAgICAgICAgICB3aWR0aDogOTAlO1xuICAgICAgICAgICAgbWF4LXdpZHRoOiA2MDBweDtcbiAgICAgICAgICAgIHBhZGRpbmc6IDIwcHg7XG4gICAgICAgICAgICBhbmltYXRpb246IHNsaWRlRG93biAwLjNzIGVhc2Utb3V0O1xuICAgICAgICBgO1xuXG4gICAgICAgIC8vIENyZWF0ZSBzZWFyY2ggaW5wdXRcbiAgICAgICAgdGhpcy5zZWFyY2hJbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG4gICAgICAgIHRoaXMuc2VhcmNoSW5wdXQudHlwZSA9ICd0ZXh0JztcbiAgICAgICAgdGhpcy5zZWFyY2hJbnB1dC5wbGFjZWhvbGRlciA9ICdTZWFyY2ggb3IgZW50ZXIgVVJMLi4uJztcbiAgICAgICAgdGhpcy5zZWFyY2hJbnB1dC5zdHlsZS5jc3NUZXh0ID0gYFxuICAgICAgICAgICAgd2lkdGg6IDEwMCU7XG4gICAgICAgICAgICBwYWRkaW5nOiAxNnB4IDIwcHg7XG4gICAgICAgICAgICBmb250LXNpemU6IDE4cHg7XG4gICAgICAgICAgICBib3JkZXI6IDJweCBzb2xpZCAjZTBlMGUwO1xuICAgICAgICAgICAgYm9yZGVyLXJhZGl1czogOHB4O1xuICAgICAgICAgICAgb3V0bGluZTogbm9uZTtcbiAgICAgICAgICAgIGZvbnQtZmFtaWx5OiAtYXBwbGUtc3lzdGVtLCBCbGlua01hY1N5c3RlbUZvbnQsICdTZWdvZSBVSScsIFJvYm90bywgc2Fucy1zZXJpZjtcbiAgICAgICAgICAgIHRyYW5zaXRpb246IGJvcmRlci1jb2xvciAwLjJzO1xuICAgICAgICAgICAgYm94LXNpemluZzogYm9yZGVyLWJveDtcbiAgICAgICAgYDtcblxuICAgICAgICAvLyBGb2N1cyBzdHlsaW5nXG4gICAgICAgIHRoaXMuc2VhcmNoSW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignZm9jdXMnLCAoKSA9PiB7XG4gICAgICAgICAgICBpZiAodGhpcy5zZWFyY2hJbnB1dCkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2VhcmNoSW5wdXQuc3R5bGUuYm9yZGVyQ29sb3IgPSAnIzQyODVmNCc7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuc2VhcmNoSW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignYmx1cicsICgpID0+IHtcbiAgICAgICAgICAgIGlmICh0aGlzLnNlYXJjaElucHV0KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZWFyY2hJbnB1dC5zdHlsZS5ib3JkZXJDb2xvciA9ICcjZTBlMGUwJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gQ3JlYXRlIGhpbnQgdGV4dFxuICAgICAgICBjb25zdCBoaW50VGV4dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBoaW50VGV4dC50ZXh0Q29udGVudCA9ICdQcmVzcyBFU0MgdG8gY2xvc2Ug4oCiIEN0cmwrU3BhY2UgdG8gdG9nZ2xlJztcbiAgICAgICAgaGludFRleHQuc3R5bGUuY3NzVGV4dCA9IGBcbiAgICAgICAgICAgIG1hcmdpbi10b3A6IDEycHg7XG4gICAgICAgICAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gICAgICAgICAgICBjb2xvcjogIzg4ODtcbiAgICAgICAgICAgIGZvbnQtc2l6ZTogMTRweDtcbiAgICAgICAgICAgIGZvbnQtZmFtaWx5OiAtYXBwbGUtc3lzdGVtLCBCbGlua01hY1N5c3RlbUZvbnQsICdTZWdvZSBVSScsIFJvYm90bywgc2Fucy1zZXJpZjtcbiAgICAgICAgYDtcblxuICAgICAgICAvLyBBZGQgYW5pbWF0aW9uc1xuICAgICAgICBjb25zdCBzdHlsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyk7XG4gICAgICAgIHN0eWxlLnRleHRDb250ZW50ID0gYFxuICAgICAgICAgICAgQGtleWZyYW1lcyBmYWRlSW4ge1xuICAgICAgICAgICAgICAgIGZyb20geyBvcGFjaXR5OiAwOyB9XG4gICAgICAgICAgICAgICAgdG8geyBvcGFjaXR5OiAxOyB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBAa2V5ZnJhbWVzIHNsaWRlRG93biB7XG4gICAgICAgICAgICAgICAgZnJvbSB7IFxuICAgICAgICAgICAgICAgICAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoLTMwcHgpO1xuICAgICAgICAgICAgICAgICAgICBvcGFjaXR5OiAwO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0byB7IFxuICAgICAgICAgICAgICAgICAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoMCk7XG4gICAgICAgICAgICAgICAgICAgIG9wYWNpdHk6IDE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICBgO1xuICAgICAgICBkb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkKHN0eWxlKTtcblxuICAgICAgICAvLyBBc3NlbWJsZSBlbGVtZW50c1xuICAgICAgICBzZWFyY2hCb3guYXBwZW5kQ2hpbGQodGhpcy5zZWFyY2hJbnB1dCk7XG4gICAgICAgIHNlYXJjaEJveC5hcHBlbmRDaGlsZChoaW50VGV4dCk7XG4gICAgICAgIHRoaXMuY29udGFpbmVyLmFwcGVuZENoaWxkKHNlYXJjaEJveCk7XG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGhpcy5jb250YWluZXIpO1xuXG4gICAgICAgIC8vIFNldHVwIGV2ZW50IGxpc3RlbmVyc1xuICAgICAgICB0aGlzLnNldHVwRXZlbnRMaXN0ZW5lcnMoKTtcbiAgICAgICAgXG4gICAgICAgIGNvbnNvbGUubG9nKCdTZWFyY2ggYmFyIGluaXRpYWxpemVkIGFuZCBhZGRlZCB0byBwYWdlJyk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzZXR1cEV2ZW50TGlzdGVuZXJzKCk6IHZvaWQge1xuICAgICAgICAvLyBDbG9zZSBvbiBvdmVybGF5IGNsaWNrXG4gICAgICAgIHRoaXMuY29udGFpbmVyPy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XG4gICAgICAgICAgICBpZiAoZS50YXJnZXQgPT09IHRoaXMuY29udGFpbmVyKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5oaWRlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIEhhbmRsZSBzZWFyY2ggc3VibWlzc2lvblxuICAgICAgICB0aGlzLnNlYXJjaElucHV0Py5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgKGUpID0+IHtcbiAgICAgICAgICAgIGlmIChlLmtleSA9PT0gJ0VudGVyJykge1xuICAgICAgICAgICAgICAgIHRoaXMuaGFuZGxlU2VhcmNoKCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGUua2V5ID09PSAnRXNjYXBlJykge1xuICAgICAgICAgICAgICAgIHRoaXMuaGlkZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHNldHVwS2V5Ym9hcmRTaG9ydGN1dHMoKTogdm9pZCB7XG4gICAgICAgIC8vIExpc3RlbiBmb3IgQ3RybCtTcGFjZSB0byB0b2dnbGUgc2VhcmNoIGJhclxuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgKGUpID0+IHtcbiAgICAgICAgICAgIGlmICgoZS5jdHJsS2V5IHx8IGUubWV0YUtleSkgJiYgZS5jb2RlID09PSAnU3BhY2UnKSB7XG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdDdHJsK1NwYWNlIHByZXNzZWQsIHRvZ2dsaW5nIHNlYXJjaCBiYXInKTtcbiAgICAgICAgICAgICAgICB0aGlzLnRvZ2dsZSgpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChlLmtleSA9PT0gJ0VzY2FwZScgJiYgdGhpcy5pc1Zpc2libGUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmhpZGUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIFxuICAgICAgICAvLyBMaXN0ZW4gZm9yIG1lc3NhZ2VzIGZyb20gYmFja2dyb3VuZCBzY3JpcHQgKEZpcmVmb3gpXG4gICAgICAgIGJyb3dzZXIucnVudGltZS5vbk1lc3NhZ2UuYWRkTGlzdGVuZXIoXG4gICAgICAgICAgICAobWVzc2FnZTogU2VhcmNoTWVzc2FnZSkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdNZXNzYWdlIHJlY2VpdmVkOicsIG1lc3NhZ2UpO1xuICAgICAgICAgICAgICAgIGlmIChtZXNzYWdlLmFjdGlvbiA9PT0gJ3RvZ2dsZVNlYXJjaEJhcicpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50b2dnbGUoKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh7IHN1Y2Nlc3M6IHRydWUgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFzeW5jIGhhbmRsZVNlYXJjaCgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgY29uc3QgcXVlcnkgPSB0aGlzLnNlYXJjaElucHV0Py52YWx1ZS50cmltKCk7XG4gICAgICAgIGlmICghcXVlcnkpIHJldHVybjtcblxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gUmVxdWVzdCBhbGwgdGFicyBmcm9tIGJhY2tncm91bmQgc2NyaXB0XG4gICAgICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGJyb3dzZXIucnVudGltZS5zZW5kTWVzc2FnZSh7XG4gICAgICAgICAgICAgICAgYWN0aW9uOiAnc2VhcmNoVGFicycsXG4gICAgICAgICAgICAgICAgcXVlcnk6IHF1ZXJ5XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaWYgKHJlc3BvbnNlICYmIHJlc3BvbnNlLmZvdW5kKSB7XG4gICAgICAgICAgICAgICAgLy8gVGFiIGZvdW5kIGFuZCBzd2l0Y2hlZCBieSBiYWNrZ3JvdW5kIHNjcmlwdFxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdTd2l0Y2hlZCB0byB0YWI6JywgcmVzcG9uc2UudGFiSWQpO1xuICAgICAgICAgICAgICAgIHRoaXMuaGlkZSgpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gTm8gbWF0Y2hpbmcgdGFiIGZvdW5kLCBwcm9jZWVkIHdpdGggVVJML3NlYXJjaFxuICAgICAgICAgICAgY29uc3QgaXNVcmwgPSAvXihodHRwcz86XFwvXFwvfHd3d1xcLikvLnRlc3QocXVlcnkpIHx8IFxuICAgICAgICAgICAgICAgICAgICAgICAgICAocXVlcnkuaW5jbHVkZXMoJy4nKSAmJiAhcXVlcnkuaW5jbHVkZXMoJyAnKSk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmIChpc1VybCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHVybCA9IHF1ZXJ5LnN0YXJ0c1dpdGgoJ2h0dHAnKSA/IHF1ZXJ5IDogYGh0dHBzOi8vJHtxdWVyeX1gO1xuICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gdXJsO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBTZWFyY2ggd2l0aCBkZWZhdWx0IHNlYXJjaCBlbmdpbmUgKEdvb2dsZSlcbiAgICAgICAgICAgICAgICBjb25zdCBzZWFyY2hVcmwgPSBgaHR0cHM6Ly93d3cuZ29vZ2xlLmNvbS9zZWFyY2g/cT0ke2VuY29kZVVSSUNvbXBvbmVudChxdWVyeSl9YDtcbiAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IHNlYXJjaFVybDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5oaWRlKCk7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdFcnJvciBzZWFyY2hpbmcgdGFiczonLCBlcnJvcik7XG4gICAgICAgICAgICAvLyBGYWxsYmFjayB0byBub3JtYWwgc2VhcmNoIGlmIHNvbWV0aGluZyBnb2VzIHdyb25nXG4gICAgICAgICAgICBjb25zdCBpc1VybCA9IC9eKGh0dHBzPzpcXC9cXC98d3d3XFwuKS8udGVzdChxdWVyeSkgfHwgXG4gICAgICAgICAgICAgICAgICAgICAgICAgIChxdWVyeS5pbmNsdWRlcygnLicpICYmICFxdWVyeS5pbmNsdWRlcygnICcpKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKGlzVXJsKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgdXJsID0gcXVlcnkuc3RhcnRzV2l0aCgnaHR0cCcpID8gcXVlcnkgOiBgaHR0cHM6Ly8ke3F1ZXJ5fWA7XG4gICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSB1cmw7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnN0IHNlYXJjaFVybCA9IGBodHRwczovL3d3dy5nb29nbGUuY29tL3NlYXJjaD9xPSR7ZW5jb2RlVVJJQ29tcG9uZW50KHF1ZXJ5KX1gO1xuICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gc2VhcmNoVXJsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5oaWRlKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgc2hvdygpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMuY29udGFpbmVyICYmIHRoaXMuc2VhcmNoSW5wdXQpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdTaG93aW5nIHNlYXJjaCBiYXInKTtcbiAgICAgICAgICAgIHRoaXMuY29udGFpbmVyLnN0eWxlLmRpc3BsYXkgPSAnZmxleCc7XG4gICAgICAgICAgICB0aGlzLmlzVmlzaWJsZSA9IHRydWU7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIEZvY3VzIGlucHV0IGFmdGVyIGEgYnJpZWYgZGVsYXkgdG8gZW5zdXJlIGl0J3MgdmlzaWJsZVxuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZWFyY2hJbnB1dD8uZm9jdXMoKTtcbiAgICAgICAgICAgIH0sIDEwMCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgaGlkZSgpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMuY29udGFpbmVyICYmIHRoaXMuc2VhcmNoSW5wdXQpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdIaWRpbmcgc2VhcmNoIGJhcicpO1xuICAgICAgICAgICAgdGhpcy5jb250YWluZXIuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgICAgIHRoaXMuc2VhcmNoSW5wdXQudmFsdWUgPSAnJztcbiAgICAgICAgICAgIHRoaXMuaXNWaXNpYmxlID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgdG9nZ2xlKCk6IHZvaWQge1xuICAgICAgICBpZiAodGhpcy5pc1Zpc2libGUpIHtcbiAgICAgICAgICAgIHRoaXMuaGlkZSgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5zaG93KCk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbi8vIEluaXRpYWxpemUgdGhlIHNlYXJjaCBiYXIgd2hlbiBjb250ZW50IHNjcmlwdCBsb2Fkc1xuY29uc3Qgc2VhcmNoQmFyID0gbmV3IFNlYXJjaEJhclZpZXcoKTtcblxuY29uc29sZS5sb2coJ1NlYXJjaCBiYXIgY29udGVudCBzY3JpcHQgbG9hZGVkLiBQcmVzcyBDdHJsK1NwYWNlIHRvIG9wZW4uJyk7XG5cbi8vIEV4cG9ydCBmb3IgcG90ZW50aWFsIHVzZSBpbiBvdGhlciBzY3JpcHRzXG5leHBvcnQgZGVmYXVsdCBzZWFyY2hCYXI7Il0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9