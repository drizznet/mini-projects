/* lockIn's notification service worker. */
self.addEventListener("message", (event) => {
  if (event.data?.type !== "SHOW_NOTIFICATION") return;

  const { title, options } = event.data;
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
      const focusClient = clients.find((client) => "focus" in client);
      if (focusClient) {
        focusClient.navigate("/lockin");
        return focusClient.focus();
      }
      return self.clients.openWindow("/lockin");
    }),
  );
});
