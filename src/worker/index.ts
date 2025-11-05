
import ChangeService from "./services/change.service";
import ChangeController from "./controllers/change.controller";
import Tab from "../models/tab.model";

let changeService:ChangeService = new ChangeService(1000,browser);
let changeController:ChangeController = new ChangeController(changeService);

changeController.onTabChange((tab:Tab)=>{
	console.log("Tab changed to: ", tab.URL);
});



// ./src/worker/index.ts

interface SearchTabsMessage {
    action: string;
    query?: string;
}

interface SearchResponse {
    found: boolean;
    tabId?: number;
}

// Fuzzy matching score function
function calculateMatchScore(text: string, query: string): number {
    const lowerText = text.toLowerCase();
    const lowerQuery = query.toLowerCase();
    
    // Exact match gets highest score
    if (lowerText === lowerQuery) return 1000;
    
    // Starts with query gets high score
    if (lowerText.startsWith(lowerQuery)) return 500;
    
    // Contains query as substring
    if (lowerText.includes(lowerQuery)) return 100;
    
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
async function findBestMatchingTab(query: string): Promise<browser.tabs.Tab | null> {
    try {
        const tabs = await browser.tabs.query({});
        
        let bestMatch: browser.tabs.Tab | null = null;
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
        
    } catch (error) {
        console.error('Error querying tabs:', error);
        return null;
    }
}

// Message listener
browser.runtime.onMessage.addListener(
    async (message: SearchTabsMessage, sender: browser.runtime.MessageSender) => {
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
                    
                    const response: SearchResponse = {
                        found: true,
                        tabId: matchingTab.id
                    };
                    
                    return Promise.resolve(response);
                } catch (error) {
                    console.error('Error switching to tab:', error);
                    return Promise.resolve({ found: false });
                }
            } else {
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
            } catch (error) {
                console.error('Error toggling search bar:', error);
            }
        }
        
        return Promise.resolve();
    }
);

console.log('Background worker loaded');