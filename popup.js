function onClick () {
   chrome.runtime.sendMessage({ method: 'browserActionSetUp'});
}

document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('button')[0].addEventListener('click', onClick);
});