import { getMessaging, getToken } from "firebase/messaging";
import { VAPID_KEY } from "./firebase";
import { serviceWorkerRegistration } from "../main";

export const getMessagingToken = async () => {
  const hasPermission = await hasNotificationPermission();

  const messaging = getMessaging();

  if (hasPermission) {
    return getToken(messaging, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration,
    });
  }

  throw new Error("noNotificationPermissions");
};

const hasNotificationPermission = () => {
  return new Promise((res, rej) => {
    Notification.requestPermission()
      .then((permission) => res(permission === "granted"))
      .catch(rej);
  });
};
