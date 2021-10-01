// Get all elements
    // Add new button
    const addNewButton = getElement("#add__new");
    // Open Button
    const openButton = getElement("#open");
    // Website List
    const websiteListUI = getElement('.website__list');

// Add constants - includs list item templates

let websiteList = [];

// Add event handler functions
    // populateList
    function populateList() {
        fetchFromChromeStorage('omswebsites');
    }
    // save
    async function save() {
        let tab = await getCurrentTab();
        let tabToBeSaved = {
            'url': tab
        }
        websiteList.push(tabToBeSaved);
        let res = await addToChromeStorage('omswebsites', websiteList);
    }
    async function getCurrentTab() {
        let queryOptions = { active: true, currentWindow: true };
        let tab = await chrome.tabs.query(queryOptions);
        return tab[0].url;
    }
    // open
    function open() {
        websiteList.forEach(website => {
            chrome.tabs.create({
                url: website.url
            });
        });
    }
    // removeFromList
    function removeFromList(websiteToBeDeleted) {
        websiteList = websiteList.filter(website => website.url != websiteToBeDeleted)
        chrome.storage.sync.set({'omswebsites': websiteList}, function() {
            fetchFromChromeStorage('arpit');
            return null;
        }); 
    }
    // clearAll
    function clearAll(websiteToBeDeleted) {
        chrome.storage.sync.set({'omswebsites': []}, function() {
            websiteList = [];
            fetchFromChromeStorage('arpit');
            return null;
        }); 
    }

// Utility function
    // Add to chrome storage
    async function addToChromeStorage(key1, value) {
        let key = key1;
        chrome.storage.sync.set({'omswebsites': value}, function() {
            fetchFromChromeStorage('arpit');
            return null;
        });      
    }
    // Fetch from chrome storage
    function fetchFromChromeStorage(key) {
        chrome.storage.sync.get(['omswebsites'], function(data) {
            websiteList = data['omswebsites'] || [];
            createWebsiteTree();
        });
    }
    // Get elements
    function getElement(selector) {
        let ele = document.querySelector(selector);
        return ele;
    }
    //Create UI for website list
    function createWebsiteTree() {
        let finalListUI = '';
        websiteList.reverse().forEach(website => {
            if(website.url.length > 40)
                website.displayURL = website.url.substring(0, 40) + "....";
            else
                website.displayURL = website.url;
            const listItem = `
            <div class="list__item">
                <h3>${website.displayURL}</h3>
                <svg id="${hashCode(website.url)}" width="14" height="18" viewBox="0 0 14 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 16C1 17.1 1.9 18 3 18H11C12.1 18 13 17.1 13 16V4H1V16ZM3 6H11V16H3V6ZM10.5 1L9.5 0H4.5L3.5 1H0V3H14V1H10.5Z" fill="#C18888"/>
                </svg>
            </div>`;
            finalListUI += listItem
        });
        websiteListUI.innerHTML = finalListUI;
        websiteList.forEach(website => {
            getElement('#' + hashCode(website.url)+'').addEventListener('click', () => removeFromList(website.url));
        })
    }
    //Hash function
    function hashCode(s) {
        var hash = 0, i, chr;
        if (s.length === 0) return hash;
        for (i = 0; i < s.length; i++) {
          chr   = s.charCodeAt(i);
          hash  = ((hash << 5) - hash) + chr;
          hash |= 0; // Convert to 32bit integer
        }
        return 'a' + hash + '';
    };

// Add event hadlers to elements
openButton.addEventListener('click', () => {
    open();
});

addNewButton.addEventListener('click', () => {
    save();
});



// init function
function init() {
    populateList();
}

// call init function
init();