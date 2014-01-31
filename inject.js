// avoid conflicts in case this script is injected 
// multiple times on the same page without reloading
var injected = injected || (function(){

  // will contain methods accessible from event script
  var methods = {};

  methods.identifyPlayer = function () {
    if ((new RegExp('youtube')).test(window.location.host)) {
      if (document.querySelectorAll('embed').length > 0) return 'youtube-embed';
      else if (document.querySelectorAll('video').length > 0) return 'youtube-html5';
      else throw new Error('Unknown Youtube player');
    }
    else if ((new RegExp('soundcloud')).test(window.location.host)) {
      if (document.querySelectorAll('.playControl')[0].length > 0) return 'soundcloud';
      else throw new Error('Unknown Soundcloud player');
    }
  };

  methods.playPause = function () {
    switch (identifyPlayer()) {
      case 'youtube-embed':
        return document.querySelectorAll('embed')[0].playVideo();
      case 'youtube-html5':
        return document.querySelectorAll('video')[0].play();
      case 'soundcloud':
        return document.querySelectorAll('.playControl')[0].click();
    }
  };

  chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    var data = {};

    if (methods.hasOwnProperty(request.method)) {
      data = methods[request.method]();
    }

    sendResponse({ data: data });
    return true;
  });

  return true;
})();

// TODO: try to reduce number of DOM queries per action to 1