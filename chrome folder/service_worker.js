chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "contextMenu1",
        title: "save tabs",
        contexts: ["page"],
    });

    chrome.contextMenus.create({
        id: "contextMenu2",
        title: "open folder",
        contexts: ["page"],
    });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "contextMenu1") {
        chrome.windows.create({ url: "popup.html", type: "popup", width: 400, height: 600 });
    }
    if (info.menuItemId === "contextMenu2") {
        openFolder();
    }
});

chrome.commands.onCommand.addListener((command) => {
    if (command === "saveState" || command === "openFolder") {
        chrome.windows.create({ url: "popup.html", type: "popup", width: 400, height: 600 });
    }
});



