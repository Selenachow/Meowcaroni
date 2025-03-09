chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({ catEnabled: true });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "closeTab") {
        chrome.tabs.remove(sender.tab.id);
    }
});