import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching';
import { getMessaging } from "firebase/messaging/sw";
import { initializeApp } from "firebase/app";
import { clientsClaim } from 'workbox-core';
import { onBackgroundMessage } from "firebase/messaging/sw";

self.skipWaiting();

clientsClaim();

cleanupOutdatedCaches();

precacheAndRoute(self.__WB_MANIFEST);

const firebaseApp = initializeApp({
    apiKey: "AIzaSyA3-pw6utfIFyi1yDC7qHIlyj33g-TAJDQ",
    authDomain: "pssd-app.firebaseapp.com",
    databaseURL: "https://pssd-app-default-rtdb.firebaseio.com",
    projectId: "pssd-app",
    storageBucket: "pssd-app.appspot.com",
    messagingSenderId: "141538485092",
    appId: "1:141538485092:web:76fb20bbbe96bc6c649071",
    measurementId: "G-T1N612GH4R"
});

const messaging = getMessaging(firebaseApp);

onBackgroundMessage(messaging, (payload) => {
    if (!payload.data) {
        console.warn('[sw.js] Unknown notification on message ', payload);
        return
    }

    const { title, body } = payload.data
    const notificationTitle = title;
    const notificationOptions = {
        body,
        icon: '/android-icon-192x192.png'
    };

    self.registration.showNotification(notificationTitle, notificationOptions)
})


self.addEventListener('notificationclick', event => {
    const rootUrl = new URL('/', location).href;
    event.notification.close();
    // Enumerate windows, and call window.focus(), or open a new one.
    event.waitUntil(
        clients.matchAll().then(matchedClients => {
            for (let client of matchedClients) {
                if (client.url === rootUrl) {
                    return client.focus();
                }
            }
            return clients.openWindow("/");
        })
    );
});
