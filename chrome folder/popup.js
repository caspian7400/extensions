var selectedFolderName;
//helper functions
function getAccordionItem(id, bodyContent, btnContent) {
    const accItem = document.createElement("div");
    const header = document.createElement("h2");
    const btn = document.createElement("button");
    const collapse = document.createElement("div");
    const body = document.createElement("div");
    accItem.id = `15${btnContent}`;
    accItem.className = "accordion-item";
    header.className = "accordion-header";
    btn.className = "accordion-button collapsed";
    btn.type = "button";
    btn.setAttribute("data-bs-toggle", "collapse");
    btn.setAttribute("data-bs-target", `#flush-collapse${id}`);
    btn.setAttribute("aria-expanded", "false");
    btn.setAttribute("aria-controls", `flush-collapse${id}`);
    btn.innerHTML = btnContent;
    btn.addEventListener("click", () => {
        const openBtn = document.getElementById("EXTopenFolder");
        const deleteBtn = document.getElementById("EXTdeleteFolder");
        selectedFolderName = btnContent;
        if (btn.getAttribute("aria-expanded") === "true") {
            openBtn.removeAttribute("disabled");
            deleteBtn.removeAttribute("disabled");
        }
        else {
            openBtn.setAttribute("disabled", "true");
            deleteBtn.setAttribute("disabled", "true");
        }
    });
    collapse.id = `flush-collapse${id}`;
    collapse.className = "accordion-collapse collapse";
    collapse.setAttribute("data-bs-parent", `#folderC2`);
    body.className = "accordion-body";
    body.appendChild(bodyContent);
    collapse.appendChild(body);
    header.appendChild(btn);
    accItem.appendChild(header);
    accItem.appendChild(collapse);
    return accItem;
}

function createButton(btnClass) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = btnClass;
    return btn;
}

function createIcon(iconClass) {
    const iconElement = document.createElement('i');
    iconElement.classList.add('bi', iconClass);
    return iconElement;
}

async function getActiveTabs() {
    const tabs = await chrome.tabs.query({});
    const tabUrls = tabs.map((tabs) => tabs.url);
    const favIconUrls = tabs.map((tabs) => tabs.favIconUrl);
    if (Array.from(tabUrls).includes("chrome-extension://mdgndahepibjdahjdhikmbnihcoocalh/popup.html")) {
        tabUrls.pop();
        favIconUrls.pop();
    }
    const [current] = await chrome.tabs.query({ active: true, currentWindow: true });
    return { tabUrls: tabUrls, favIconUrls: favIconUrls, current: current };
}

function getAllFolders() {
    console.log("fetching folders");
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get(null, (res) => {
            console.log(res);
            resolve(res);
        });
    });
}

(async () => {
    // define variables
    const toastTrigger = document.getElementById("saveFolderBtn");
    const toastLiveExample = document.getElementById("liveToast");
    const accordion = document.getElementById("folderC2");
    const container2 = document.getElementById("saveC2");
    const input = document.getElementById("folderName");
    const reload = document.getElementById("EXTreloadBtn");
    const save = document.getElementById("saveFolderBtn");
    const open = document.getElementById("EXTopenFolder");
    const selectFolder = document.getElementsByClassName("accordion-button");
    const deleteFolder = document.getElementById("EXTdeleteFolder");
    var { tabUrls, favIconUrls } = await getActiveTabs();
    // save menu
    const fillSaveMenu = async () => {
        if (document.getElementById("saveElementWrapper")) {
            document.getElementById("saveElementWrapper").remove();
            const obj = await getActiveTabs();
            tabUrls = obj.tabUrls;
            favIconUrls = obj.favIconUrls;
        }
        const wrapper = document.createElement("div");
        wrapper.id = "saveElementWrapper";
        for (var i = 0; i < tabUrls.length; i++) {
            const img = document.createElement("img");
            const element = document.createElement("div");
            const btn = createButton("btn btn-outline-dark");
            const trash = createIcon('bi-trash');
            trash.addEventListener("click", () => {
                trash.parentElement.parentElement.remove();
            })
            img.src = favIconUrls[i];
            img.style.maxWidth = "20px";
            img.style.height = "auto";
            img.style.marginLeft = "8px";
            element.style.padding = "10px";
            element.style.color = "black";
            element.style.width = "100%";
            element.style.wordBreak = "break-all";
            element.innerHTML = tabUrls[i];
            element.appendChild(img);
            btn.style.border = "none";
            btn.style.padding = "4px 8px";
            btn.style.marginLeft = "4px";
            btn.append(trash);
            element.appendChild(btn);
            wrapper.appendChild(element);
        }
        container2.appendChild(wrapper);
        return;
    }
    // fill folder menu 
    const fillFolderMenu = async () => {
        const folders = await getAllFolders();
        if (document.getElementById("saveFolderWrapper")) {
            document.getElementById("saveFolderWrapper").remove();
        }
        const keys = Object.keys(folders);
        const wrapper = document.createElement("div");
        wrapper.id = "saveFolderWrapper";
        for (var i = 0; i < keys.length; i++) {
            const { urls, favIconUrls } = JSON.parse(folders[keys[i]]);
            const container = document.createElement("div");
            container.className = "container";
            for (var j = 0; j < urls.length; j++) {
                const img = document.createElement("img");
                const urlContainer = document.createElement("div");
                container.style.display = "flex";
                container.style.flexDirection = "column";
                urlContainer.innerHTML = urls[j];
                urlContainer.setAttribute("folderName", urls[j]);
                img.src = favIconUrls[j];
                img.style.maxWidth = "20px";
                img.style.height = "auto";
                img.style.marginLeft = "8px";
                urlContainer.appendChild(img);
                container.appendChild(urlContainer);
            }
            const accItem = getAccordionItem(i, container, keys[i]);
            wrapper.appendChild(accItem);
        }
        accordion.appendChild(wrapper);
    }
    var saveMenuCall = await fillSaveMenu();
    var folderMenuCall = await fillFolderMenu();

    // add all event handlers
    if (toastTrigger) {
        const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample);
        toastTrigger.addEventListener("click", () => {
            toastBootstrap.show();
        })
    }

    reload.addEventListener("click", async () => {
        const fun1 = await fillSaveMenu();
        const fun2 = await fillFolderMenu();
    });

    save.addEventListener("click", () => {
        const folderName = input.value;
        var testPrefs = JSON.stringify({ "urls": tabUrls, "favIconUrls": favIconUrls });
        var jsonfile = {};
        jsonfile[folderName] = testPrefs;
        chrome.storage.sync.set(jsonfile, () => console.log("tabs saved"));
        /*
        
        
        TODO when saved close menu , and show success toast


        */
    });

    open.addEventListener("click", () => {
        chrome.storage.sync.get(selectedFolderName, (result) => {
            const tabUrls = JSON.parse(result[selectedFolderName]).urls;
            Array.from(tabUrls).forEach(element => chrome.tabs.create({ url: element }));
        });
    });

    deleteFolder.addEventListener("click", async () => {
        const accItem = document.getElementById(`15${selectedFolderName}`);
        await chrome.storage.sync.remove(selectedFolderName);
        chrome.storage.sync.get(null, res => console.log(res));
        accItem.remove();
    });
})();
