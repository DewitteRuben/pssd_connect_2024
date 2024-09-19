import { cleanupOutdatedCaches, precacheAndRoute } from "workbox-precaching";
import { getMessaging } from "firebase/messaging/sw";
import { initializeApp } from "firebase/app";
import { clientsClaim } from "workbox-core";
import { onBackgroundMessage } from "firebase/messaging/sw";
import { registerRoute, Route } from "workbox-routing";
import { CacheFirst } from "workbox-strategies";

self.skipWaiting();

clientsClaim();

cleanupOutdatedCaches();

precacheAndRoute(self.__WB_MANIFEST);

const firebaseImageRoute = new Route(({ url }) =>
    url.hostname === "firebasestorage.googleapis.com" &&
    url.pathname.includes("%2Fimages%2F"),
    new CacheFirst({
        cacheName: "firebase-images",
        fetchOptions: {
            mode: "cors",
            credentials: "omit",
        }
    }));

const firebaseApp = initializeApp({
    apiKey: "AIzaSyAQWJdRvxFJxZu2HWgOQfPpwVr98bgqNLU",
    authDomain: "pssd-connect-demo.firebaseapp.com",
    projectId: "pssd-connect-demo",
    storageBucket: "pssd-connect-demo.appspot.com",
    messagingSenderId: "22704590714",
    appId: "1:22704590714:web:575c320d5d9b36b22710c3"
});

const messaging = getMessaging(firebaseApp);

onBackgroundMessage(messaging, (payload) => {
    if (!payload.data) {
        console.warn("[sw.js] Unknown notification on message ", payload);
        return
    }

    const { title, body } = payload.data
    const notificationTitle = title;
    const notificationOptions = {
        body,
        icon: "/android-icon-192x192.png"
    };

    self.registration.showNotification(notificationTitle, notificationOptions)
})


self.addEventListener("notificationclick", event => {
    const rootUrl = new URL("/", location).href;
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


registerRoute(firebaseImageRoute)