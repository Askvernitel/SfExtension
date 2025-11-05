// ./src/content/view.ts

interface SearchMessage {
    action: string;
}

class SearchBarView {
    private container: HTMLDivElement | null = null;
    private searchInput: HTMLInputElement | null = null;
    private isVisible: boolean = false;

    constructor() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.initialize();
                this.setupKeyboardShortcuts();
            });
        } else {
            this.initialize();
            this.setupKeyboardShortcuts();
        }
    }

    private initialize(): void {
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

    private setupEventListeners(): void {
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
            } else if (e.key === 'Escape') {
                this.hide();
            }
        });
    }

    private setupKeyboardShortcuts(): void {
        // Listen for Ctrl+Space to toggle search bar
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.code === 'Space') {
                e.preventDefault();
                console.log('Ctrl+Space pressed, toggling search bar');
                this.toggle();
            } else if (e.key === 'Escape' && this.isVisible) {
                this.hide();
            }
        });
        
        // Listen for messages from background script (Firefox)
        browser.runtime.onMessage.addListener(
            (message: SearchMessage) => {
                console.log('Message received:', message);
                if (message.action === 'toggleSearchBar') {
                    this.toggle();
                    return Promise.resolve({ success: true });
                }
                return Promise.resolve();
            }
        );
    }

    private async handleSearch(): Promise<void> {
        const query = this.searchInput?.value.trim();
        if (!query) return;

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
            } else {
                // Search with default search engine (Google)
                const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
                window.location.href = searchUrl;
            }

            this.hide();
        } catch (error) {
            console.error('Error searching tabs:', error);
            // Fallback to normal search if something goes wrong
            const isUrl = /^(https?:\/\/|www\.)/.test(query) || 
                          (query.includes('.') && !query.includes(' '));
            
            if (isUrl) {
                const url = query.startsWith('http') ? query : `https://${query}`;
                window.location.href = url;
            } else {
                const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
                window.location.href = searchUrl;
            }
            this.hide();
        }
    }

    public show(): void {
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

    public hide(): void {
        if (this.container && this.searchInput) {
            console.log('Hiding search bar');
            this.container.style.display = 'none';
            this.searchInput.value = '';
            this.isVisible = false;
        }
    }

    public toggle(): void {
        if (this.isVisible) {
            this.hide();
        } else {
            this.show();
        }
    }
}

// Initialize the search bar when content script loads
const searchBar = new SearchBarView();

console.log('Search bar content script loaded. Press Ctrl+Space to open.');

// Export for potential use in other scripts
export default searchBar;