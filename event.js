// keep in storage API (chrome.storage)
var state = {
  initialTab: null,
  mediaTab:   null,
  mode:       null,
  save: function save () {
    chrome.storage.local.set(this, function () {
      // state correctly saved
    });
  },
  get: function get () {
    // body...
  }
};


// inject content script into media tab
// send message to activate it (get player and its state)
function injectScript (mediaTabId, callback) {
  chrome.tabs.executeScript(mediaTabId, { file: 'inject.js' }, function(){
    chrome.tabs.sendMessage(mediaTabId, { method: 'identifyPlayer' }, callback);
  });
}


// detect user indicated tab, save it and
// try to play/pause
function storeMediaTab (activeInfo) {
  state.mediaTab = activeInfo.tabId;
  chrome.tabs.onActivated.removeListener(storeMediaTab);
  
  alert('Media tab correctly saved');
  chrome.tabs.update(state.initialTab, {'active': true, 'selected': true});
  
  injectScript(state.mediaTab, function (response) {
    chrome.storage.local.set({'isPlayer': response.data}, function () {
      //alert('is there a player? ' + response.data.toString());
      if ('string' === typeof response.data) {
        playPause();
      }
    });
    
    // TODO: only attach listener once after player has been saved
    return chrome.browserAction.onClicked.addListener(playPause);
  });
}


function playPause () {
  chrome.storage.local.get('isPlayer', function (result) {
    if (result.isPlayer.length <= 0) {
      return false;
    }
    return chrome.tabs.sendMessage(state.mediaTab,
    { method: 'playPause' }, function (response) {
      return alert('playpause came back');
    });
  });
}


// user click on button initializes extension
function initialize () {
  chrome.browserAction.onClicked.addListener(function () {
    chrome.tabs.query({ currentWindow: true, active: true }, function (activeTabs) {
      state.initialTab = activeTabs[0].id;
      chrome.tabs.onActivated.addListener(storeMediaTab);
    });
  });
}

// on chrome start
initialize();