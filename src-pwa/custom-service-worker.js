/*
 * This file (which will be your service worker)
 * is picked up by the build system ONLY if
 * quasar.conf > pwa > workboxPluginMode is set to "InjectManifest"
 */

 navigator.serviceWorker.register('register-service-worker.js');

 function showNotification() {
   Notification.requestPermission(function(result) {
     if (result === 'granted') {
       navigator.serviceWorker.ready.then(function(registration) {
         registration.showNotification('PWA Sample', {
           body: 'Buzz! Buzz!',
           icon: '../statics/icon.png',
           vibrate: [200, 100, 200, 100, 200, 100, 200],
           tag: 'vibration-sample'
         });
       });
     }
   });
 }

 var notification = window.Notification.createNotification("http://userserve-ak.last.fm/serve/64s/318711.jpg", "Olá!", "Esta é a mensagem");
    notification.show();
