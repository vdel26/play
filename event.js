/**
 * methods accessible from other scripts
 */
var methods = {};


/**
 * Set up all event listeners
 */
function initialize () {
  chrome.browserAction.onClicked.addListener(function () {
    chrome.browserAction.setPopup({popup: 'popup.html'});
  });

  chrome.commands.onCommand.addListener(onPlayPauseCommand);

  chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (methods.hasOwnProperty(request.method))
      return methods[request.method]();
  });
}


/**
 * Inject content script in tab and test if
 * it contains a valid player
 * @param  {Number}   mediaTabId
 * @param  {Function} callback
 */
function injectScript (mediaTabId, callback) {
  chrome.tabs.executeScript(mediaTabId, { file: 'inject.js' }, function(){
    chrome.tabs.sendMessage(mediaTabId, { method: 'identifyPlayer' }, callback);
  });
}


/**
 * Inject script in the tab selected by the user
 * @param  {Function} callback
 */
function injectInTab (cb) {
  chrome.storage.local.get('currentTabId', function (result) {
    var currentTabId = parseInt(result.currentTabId, 10);
    if (!currentTabId) return false;

    injectScript(currentTabId, cb);
  });
}


function playMedia () {
  chrome.storage.local.get('currentTabId', function (result) {
    var currentTabId = parseInt(result.currentTabId, 10);
    if (!currentTabId) return false;

    chrome.tabs.sendMessage(currentTabId, { method: 'playPause' },
      function (response) {
        if (!response) {
          // reinject content script and try to play again
          injectInTab(playMedia);
        }
      });
  });
}


/**
 * Keyboard shortcut event handler
 */
function onPlayPauseCommand(command) {
  playMedia();
}


methods.injectInTab = injectInTab;
methods.playMedia = playMedia;


/**
 * Initialize when extension is loaded
 */
initialize();