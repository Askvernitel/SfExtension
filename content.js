// This script runs on every page
console.log('Page Info Extension loaded on:', window.location.href);
// Add a listener for messages from the popup
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
	if (message.action === 'getPageInfo') {
		sendResponse({
			title: document.title,
			url: window.location.href,
			linkCount: document.querySelectorAll('a').length,
			imageCount: document.querySelectorAll('img').length
		});
	}
});

// Example: Add a subtle border to the page when extension is active
document.body.style.outline = '2px solid #4CAF50';
setTimeout(() => {
	document.body.style.outline = '';
}, 2000);
