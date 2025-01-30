self.addEventListener('push', function (event) {
    const data = event.data.json();
    console.log('Push recibido:', data);

    const options = {
        body: data.message,
        icon: '/path/to/icon.png',
        badge: '/path/to/badge.png'
    };

    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
});