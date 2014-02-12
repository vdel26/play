function onClick () {
   // chrome.runtime.sendMessage({ method: 'browserActionSetUp'});
   chrome.tabs.query({ currentWindow: true }, createTabList);
}

function createTabList (tabList) {
    var ul = document.querySelector('ul');
    tabList.forEach(function (tab) {
        // create document fragment <li class='current'><li>
        var newItem = document.createElement('li');
        newItem.textContent = tab.title;
        ul.appendChild(newItem);
    });
}

function getMediaTab () {
    // send message to eventjs to see if there is
    // a media tab currently set
}

document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('button')[0].addEventListener('click', onClick);
});