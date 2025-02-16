import { refreshToken } from "@/services/communicationsScripts/mainManager";
const PUSH_NOTIFICATIONS_URL = import.meta.env.VITE_URL_BACK_PUSH_NOTIFICATIONS;

export const subscribeToPushNotifications = async (user) => {
    if ("serviceWorker" in navigator && "PushManager" in window) {
        try {
            const registration = await navigator.serviceWorker.register(
                "./service-worker.js"
            );
            console.log("Service Worker registrado!", registration);

            const permission = await Notification.requestPermission();
            if (permission === "granted") {
                console.log("Permiso para notificaciones concedido");

                const subscription = await registration.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: urlBase64ToUint8Array(
                        import.meta.env.VITE_PUBLIC_VAPID_KEY
                    ),
                });

                console.log("Suscripción a notificaciones push: ", subscription);

                const response = await fetch(`${PUSH_NOTIFICATIONS_URL}/subscribe`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                    body: JSON.stringify({ user_id: user.id, subscription })
                });

                if (response.status === 401) {
                    console.log("subscribeToPushNotifications 401, refreshToken");
                    const refreshResult = await refreshToken();

                    if (refreshResult.error) {
                        return { error: 'No se pudo renovar el token. Inicia sesión nuevamente.' };
                    }

                    return subscribeToPushNotifications(user);
                }

                if (!response.ok) {
                    throw new Error("Failed to subscribe to push notifications");
                }

                return response.json();
            } else {
                console.log("Permiso para notificaciones denegado");
            }
        } catch (error) {
            console.error(error);
        }
    } else {
        console.warn("Service Workers no soportados");
    }
}

function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}