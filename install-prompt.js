if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js');
}

(function () {
  const banner   = document.getElementById('install-banner');
  const msg      = document.getElementById('install-banner-msg');
  const btn      = document.getElementById('install-btn');
  const dismiss  = document.getElementById('install-dismiss-btn');
  const DISMISSED = 'pwa-install-dismissed';
  let deferred = null;

  function showBanner() {
    if (localStorage.getItem(DISMISSED)) return;
    banner.hidden = false;
  }

  // Android / Chrome — capture and hold the native install event
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferred = e;
    showBanner();
  });

  // Hide banner if installed via the browser's own UI
  window.addEventListener('appinstalled', () => {
    banner.hidden = true;
  });

  // iOS Safari — show manual share-sheet instructions
  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent.toLowerCase());
  if (isIOS && !navigator.standalone) {
    msg.textContent = 'Tap the Share icon, then "Add to Home Screen"';
    btn.textContent = 'Got it';
    showBanner();
  }

  btn.addEventListener('click', async () => {
    if (deferred) {
      // Android: trigger the native install prompt
      await deferred.prompt();
      await deferred.userChoice;
      deferred = null;
      banner.hidden = true;
    } else {
      // iOS: close without permanently dismissing so the hint
      // reappears next visit if the user hasn't installed yet
      banner.hidden = true;
    }
  });

  dismiss.addEventListener('click', () => {
    banner.hidden = true;
    localStorage.setItem(DISMISSED, '1');
  });
})();
