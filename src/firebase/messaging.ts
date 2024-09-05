import {
  getMessaging,
  getToken,
  NotificationPayload,
  onMessage,
  isSupported,
} from "firebase/messaging";
import { serviceWorkerRegistration } from "../main";
import { useToast } from "@chakra-ui/react";
import React from "react";

export const useMessagingSupported = () => {
  const [supported, setSupported] = React.useState(false);

  React.useEffect(() => {
    const messagingSupported = async () => {
      const isMessagingSupported = await isSupported();
      setSupported(isMessagingSupported);
    };

    messagingSupported();
  }, []);

  return supported;
};

export const getMessagingToken = async () => {
  const hasPermission = await hasNotificationPermission();

  const messaging = getMessaging();

  if (hasPermission) {
    return getToken(messaging, {
      vapidKey: import.meta.env.VITE_PUBLIC_VAPID_KEY,
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

interface EvMap {
  "notification-received": CustomEvent<NotificationPayload>;
}

interface NotificationQueue extends EventTarget {
  addEventListener<K extends keyof EvMap>(
    event: K,
    listener: ((this: NotificationQueue, ev: EvMap[K]) => any) | null,
    options?: AddEventListenerOptions | boolean
  ): void;

  removeEventListener<K extends keyof EvMap>(
    type: string,
    callback:
      | EventListenerOrEventListenerObject
      | ((e: CustomEvent<NotificationPayload>) => void)
      | null,
    options?: EventListenerOptions | boolean
  ): void;

  addEventListener(
    type: string,
    callback: EventListenerOrEventListenerObject | null,
    options?: AddEventListenerOptions | boolean
  ): void;

  removeEventListener(
    type: string,
    callback: EventListenerOrEventListenerObject | null,
    options?: EventListenerOptions | boolean
  ): void;
}

class NotificationQueue extends EventTarget {
  constructor() {
    super();
    const messaging = getMessaging();

    onMessage(messaging, ({ data }) => {
      if (data) {
        this.dispatchEvent(new CustomEvent("notification-received", { detail: data }));
      }
    });
  }
}

const notificationQueue = new NotificationQueue();

export const useToastNotifications = () => {
  const toast = useToast();

  const onNotificationReceived = React.useCallback(
    (e: CustomEvent<NotificationPayload>) => {
      const data = e.detail;

      toast({
        title: data.title,
        description: data.body,
        status: "info",
        position: "top",
        isClosable: true,
      });
    },
    [toast]
  );

  React.useEffect(() => {
    notificationQueue.addEventListener("notification-received", onNotificationReceived);

    return () => {
      notificationQueue.removeEventListener(
        "notification-received",
        onNotificationReceived
      );
    };
  }, [onNotificationReceived, toast]);
};
