// keep state in local storage API (chrome.storage.local)
var state = {
  initialTab: null,
  mediaTab:   null,
  mode:       null // should be isPlayer?
};

function saveState () {
  chrome.storage.local.set({ state: state });
}

function getState (callback) {
  chrome.storage.local.get('state', callback);
}

// inject content script into media tab
// send message to activate it (get player and its state)
// returns a string with the player or throws error
function injectScript (mediaTabId, callback) {
  chrome.tabs.executeScript(mediaTabId, { file: 'inject.js' }, function(){
    chrome.tabs.sendMessage(mediaTabId, { method: 'identifyPlayer' }, callback);
  });
}


// detect user indicated tab, save it and
// try to play/pause
function storeMediaTab (activeInfo) {
  // save media tab and go back to initial tab
  state.mediaTab = activeInfo.tabId;
  chrome.tabs.onActivated.removeListener(storeMediaTab);
  alert('Media tab correctly saved');
  chrome.tabs.update(state.initialTab, {'active': true, 'selected': true});

  
  injectScript(state.mediaTab, function (response) {
    chrome.storage.local.set({'isPlayer': response.data}, function () {
      if ('string' === typeof response.data) {
        playPause();
      }
    });

    // chrome.browserAction.onClicked.removeListener(browserActionSetUp);
    // chrome.browserAction.onClicked.addListener(playPause);
  });
}


// browser action click handler once there is a
// media tab stored
function playPause () {
  chrome.storage.local.get('isPlayer', function (result) {
    if (result.isPlayer.length <= 0) return false;

    return chrome.tabs.sendMessage(state.mediaTab, { method: 'playPause' },
     function (response) {
        return alert('playpause came back');
    });
  });
}


// browser action event handler
function browserActionSetUp() {
  chrome.tabs.query({ currentWindow: true, active: true }, function (activeTabs) {
    state.initialTab = activeTabs[0].id;
    chrome.tabs.onActivated.addListener(storeMediaTab);
  });
}

// set event listeners
function initialize () {
  // chrome.browserAction.onClicked.addListener(browserActionSetUp);
  chrome.commands.onCommand.addListener(onPlayPauseCommand);
  chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.method === 'browserActionSetUp') {
      browserActionSetUp();
    }
  });
}

function cleanUp () {
  // erase localstorage before shutting down
}

// keyboard shortcut event handler
function onPlayPauseCommand(command) {
  playPause();
}

// on chrome start
initialize();