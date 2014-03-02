function onButtonClick () {
  // chrome.runtime.sendMessage({ method: 'browserActionSetUp'});
  chrome.runtime.sendMessage({ method: 'playMedia' });
  console.log('onButtonClick');
}


function onListItemClick (evt) {
  var target = evt.target,
      button = document.querySelector('button'),
      currentLi;

  // save selected tab
  chrome.storage.local.set({ currentTabId: target.dataset.id });

  // change selected tab
  currentLi = document.querySelector('li.current');
  if (currentLi)
    currentLi.classList.remove('current');
  target.classList.add('current');

  // change message
  button.innerText = '\u21E7 + alt + P';
  button.classList.add('playing-message');

  // inject script in the selected tag
  chrome.runtime.sendMessage({ method: 'injectInTab' });
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


/**
 * Attach listeners and build tab list
 */
document.addEventListener('DOMContentLoaded', function () {
  document.querySelector('button').addEventListener('click', onButtonClick);
  document.querySelector('ul').addEventListener('click', onListItemClick);
  chrome.tabs.query({ currentWindow: true }, buildList);

  // insert Analytics
  var _gaq = _gaq || [];
  _gaq.push(['_setAccount', 'UA-48558460-1']);
  _gaq.push(['_trackPageview']);
  var ga = document.createElement('script');
  ga.type = 'text/javascript';
  ga.async = true;
  ga.src = 'https://ssl.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0];
  s.parentNode.insertBefore(ga, s);
});
