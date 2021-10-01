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
        alert(res);
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
    function removeFromList() {

    }

// Utility function
    // Add to chrome storage
    async function addToChromeStorage(key1, value) {
        let key = key1;
        alert(key);
        alert(JSON.stringify(value));
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
        websiteList.forEach(website => {
            if(website.url.length > 40)
                website.url = website.url.substring(0, 40) + "....";
            const listItem = `
            <div class="list__item">
                <h3>${website.url}</h3>
                <svg width="14" height="18" viewBox="0 0 14 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 16C1 17.1 1.9 18 3 18H11C12.1 18 13 17.1 13 16V4H1V16ZM3 6H11V16H3V6ZM10.5 1L9.5 0H4.5L3.5 1H0V3H14V1H10.5Z" fill="#C18888"/>
                </svg>
            </div>`;
            finalListUI += listItem
        });
        websiteListUI.innerHTML = finalListUI;
    }

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