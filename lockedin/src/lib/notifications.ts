"use client";

export type NotificationSupport = "supported" | "unsupported" | "denied" | "default" | "granted";

export function notificationSupport(): NotificationSupport {
  if (typeof window === "undefined" || !("Notification" in window) || !("serviceWorker" in navigator)) {
    return "unsupported";
  }
  return Notification.permission;
}

export async function enableNotifications(): Promise<NotificationSupport> {
  if (notificationSupport() === "unsupported") return "unsupported";

  const permission = await Notification.requestPermission();
  if (permission !== "granted") return permission;

  await navigator.serviceWorker.register("/notifications-sw.js");
  await navigator.serviceWorker.ready;
  return "granted";
}

export async function showTestNotification() {
  let support: NotificationSupport;
  try {
    support = await enableNotifications();
  } catch {
    // A browser can allow notifications while refusing service-worker setup.
    // Keep the foreground test useful in that case.
    support = notificationSupport();
  }
  if (support !== "granted") return support;

  const title = "Lock in is ready";
  const options = {
    body: "Notifications are connected. Your next focus reminder can appear here.",
    tag: "lockin-notification-test",
    data: { url: "/lockin" },
  };

  try {
    const registration = await navigator.serviceWorker.ready;
    await registration.showNotification(title, options);
  } catch {
    // Foreground fallback for browsers that expose Notification but do not
    // support service-worker notifications in the current context.
    new Notification(title, options);
  }

  return "granted" as const;
}

/** Send a device notification only after the user has already granted permission. */
export async function notifyDevice(title: string, body: string, tag: string) {
  if (notificationSupport() !== "granted") return false;

  const options = {
    body,
    tag,
    data: { url: "/lockin" },
  };

  try {
    const registration = await navigator.serviceWorker.getRegistration();
    if (registration) {
      await registration.showNotification(title, options);
    } else {
      new Notification(title, options);
    }
  } catch {
    new Notification(title, options);
  }

  return true;
}
