// avoid conflicts in case this script is injected 
// multiple times on the same page without reloading
var injected = injected || (function(){

  // will contain methods accessible from event script
  var methods = {};

  function detectSite () {
    // youtube, soundcloud
  }

  methods.identifyPlayer = function () {
    if (document.querySelectorAll('embed').length > 0) return 'youtube-embed';
    else if (document.querySelectorAll('video').length > 0) return 'youtube-html5';
    else throw new Error('Unknown player');
  };

  methods.playPause = function () {
    // youtube
    switch (identifyPlayer()) {
      case 'youtube-embed':
        return document.querySelectorAll('embed')[0].playVideo();
      case 'youtube-html5':
        return document.querySelectorAll('video')[0].play();
    }
  };

  chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    var data = {};

    if (methods.hasOwnProperty(request.method))
      data = methods[request.method]();

    sendResponse({ data: data });
    return true;
  });

  return true;
})();