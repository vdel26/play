function onButtonClick () {
  // chrome.runtime.sendMessage({ method: 'browserActionSetUp'});
  // chrome.tabs.query({ currentWindow: true }, createTabList);
}

function onListItemClick (evt) {
  var target = evt.target;

  // save selected tab
  chrome.storage.local.set({ currentTabId: target.dataset.id });

  // change selected tab
  document.querySelector('li.current').classList.remove('current');
  target.classList.add('current');
}

function createTabList (tabList, currentTabId) {
  var ul = document.querySelector('ul');

  tabList.forEach(function (tab) {
    var newItem = document.createElement('li');

    newItem.textContent = tab.title;
    newItem.dataset.id = tab.id;
    if (tab.id === currentTabId)
      newItem.classList.add('current');

    ul.appendChild(newItem);
  });
}

function buildList (tabList) {
  chrome.storage.local.get('currentTabId', function (response) {
    var currentTabId = parseInt(response.currentTabId, 10) || '';
    createTabList(tabList, currentTabId);
  });
}

document.addEventListener('DOMContentLoaded', function () {
  document.querySelector('button').addEventListener('click', onButtonClick);
  document.querySelector('ul').addEventListener('click', onListItemClick);
  chrome.tabs.query({ currentWindow: true }, buildList);
});