self.addEventListener("push", event => {
  let notificationText;
  if (event.data) {
    notificationText = event.data.text();
  } else {
    notificationText = "Hey, the status of your order has changed!";
  }

  const title = "AltSzama!";

  const body = {
    body: notificationText,
    tag: "AltSzama"
  };

  event.waitUntil(self.registration.showNotification(title, body));
});
