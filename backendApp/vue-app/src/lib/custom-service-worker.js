self.addEventListener('push', function(event) {

  var notificationText;
  if (event.data) {
    notificationText = event.data.text()
  } else {
    notificationText = "Hey, the status of your order has changed!"
  }

  var title = 'AltSzama!';

  var body = {
    'body': notificationText,
    'tag': 'AltSzama'
  };

  event.waitUntil(
    self.registration.showNotification(title, body)
  );
});