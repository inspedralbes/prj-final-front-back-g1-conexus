self.addEventListener("push", (event) => {
    if (event.data) {
        const data = event.data.json();
        console.log("Push recibido:", data);

        self.registration.showNotification(data.title, {
            body: data.message,
            icon: "/logo.jpg", // Asegúrate de que este icono exista en tu proyecto
            // badge: "/badge.png", // Imagen pequeña opcional
        }).then(() => {
            console.log("Notificación mostrada correctamente");
        }).catch((error) => {
            console.log("Error al mostrar notificación:", error);
        });
    }
});

self.addEventListener("notificationclick", (event) => {
    event.notification.close(); // Cierra la notificación al hacer clic
    event.waitUntil(
        clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
            if (clientList.length > 0) {
                return clientList[0].focus(); // Si hay una ventana abierta, traerla al frente
            }
            return clients.openWindow("/"); // Si no hay ventanas abiertas, abrir la app
        })
    );
});

// 🔹 Interceptar peticiones y evitar bloqueos por OpaqueResponseBlocking
self.addEventListener("fetch", (event) => {
    event.respondWith(
        fetch(event.request).catch(() => new Response("Offline", { status: 503 }))
    );
});
