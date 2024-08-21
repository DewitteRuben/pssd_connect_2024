import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching';
import { getMessaging } from "firebase/messaging/sw";
import { initializeApp } from "firebase/app";
import { clientsClaim } from 'workbox-core';
import { onBackgroundMessage } from "firebase/messaging/sw";

precacheAndRoute(self.__WB_MANIFEST);

cleanupOutdatedCaches();

self.skipWaiting();

clientsClaim();

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

onBackgroundMessage(messaging, ({ notification }) => {
    const notificationTitle = notification.title;
    const notificationOptions = {
        body: notification.body,
        icon: notification.icon
    };

    self.registration.showNotification(notificationTitle, notificationOptions)
})
