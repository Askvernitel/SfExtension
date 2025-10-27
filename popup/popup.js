// Get current tab info
browser.tabs.query({ active: true, currentWindow: true }).then(tabs => {
	const tab = tabs[0];
	document.getElementById('pageTitle').textContent = tab.title;
	document.getElementById('pageUrl').textContent = tab.url;
});

// Highlight all links on the page
document.getElementById('highlightBtn').addEventListener('click', () => {
	browser.tabs.executeScript({
		code: `
      const links = document.querySelectorAll('a');
      links.forEach(link => {
        link.style.backgroundColor = 'yellow';
        link.style.padding = '2px';
      });
      links.length;
    `
	}).then(result => {
		showStatus(`Highlighted ${result[0]} links!`);
	});
});

// Scroll to top
document.getElementById('scrollTopBtn').addEventListener('click', () => {
	browser.tabs.executeScript({
		code: 'window.scrollTo({top: 0, behavior: "smooth"});'
	}).then(() => {
		showStatus('Scrolled to top!');
	});
});

// Count images
document.getElementById('countBtn').addEventListener('click', () => {
	browser.tabs.executeScript({
		code: 'document.querySelectorAll("img").length;'
	}).then(result => {
		showStatus(`Found ${result[0]} images on this page!`);
	});
});

function showStatus(message) {
	const status = document.getElementById('status');
	status.textContent = message;
	status.className = 'success';
	status.style.display = 'block';
	setTimeout(() => {
		status.style.display = 'none';
	}, 3000);
}
