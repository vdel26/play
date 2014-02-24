/**
* avoid conflicts in case this script is injected
* multiple times on the same page without reloading
*/
var injected = injected || (function(){

  /**
   * methods accessible from other scripts
   */
  var methods = {};

  methods.identifyPlayer = function () {
    if (/youtube/.test(window.location.host)) {
      if (document.querySelectorAll('embed').length > 0) return 'youtube-embed';
      else if (document.querySelectorAll('video').length > 0) return 'youtube-html5';
      else throw new Error('Unknown Youtube player');
    }
    else if (/soundcloud/.test(window.location.host)) {
      if (document.querySelectorAll('.playControl').length > 0) return 'soundcloud';
      else throw new Error('Unknown Soundcloud player');
    }
  };


  methods.playPause = function () {
    var player;

    switch (this.identifyPlayer()) {
      case 'youtube-embed':
        player = document.querySelectorAll('embed')[0];
        return player.getPlayerState() > 1 ? player.playVideo() : player.stopVideo();

      case 'youtube-html5':
        player = document.querySelectorAll('video')[0];
        return player.paused ? player.play() : player.pause();

      case 'soundcloud':
        return document.querySelectorAll('.playControl')[0].click();
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