<template>
  <div class="flex flex-col p-6 bg-white dark:bg-gray-800">
    <div
      class="relative w-full max-w-3xl mx-auto bg-white dark:bg-gray-700 shadow-md rounded-lg"
    >
      <!-- Header con Filtros -->
      <div
        class="p-4 border-b flex flex-col md:flex-row justify-between items-center dark:border-gray-600"
      >
        <h2 class="text-lg font-semibold text-gray-700 dark:text-white">
          Notificacions
        </h2>

        <!-- Botones Filtros -->
        <div class="flex space-x-2 mt-4 md:mt-0">
          <button
            class="px-3 py-1 text-sm rounded-md"
            :class="
              filter === 'all'
                ? 'bg-gray-400 text-black dark:bg-gray-800 dark:text-black'
                : 'bg-gray-200 dark:bg-gray-600 dark:text-black'
            "
            @click="filter = 'all'"
          >
            Totes
          </button>
          <button
            class="px-3 py-1 text-sm rounded-md"
            :class="
              filter === 'Comentari'
                ? 'bg-blue-400 text-white dark:bg-blue-700 dark:text-black'
                : 'bg-blue-200 dark:bg-blue-700 dark:text-black'
            "
            @click="filter = 'Comentari'"
          >
            Comentaris
          </button>
          <button
            class="px-3 py-1 text-sm rounded-md"
            :class="
              filter.includes('Petició') || filter.includes('Publicació')
                ? 'bg-red-400 text-white dark:bg-red-700 dark:text-black'
                : 'bg-red-200 dark:bg-red-700 dark:text-black'
            "
            @click="togglePublicationsFilter"
          >
            Publicacions
          </button>
          <!-- <button
            class="px-3 py-1 text-sm rounded-md"
            :class="
              filter === 'Chat'
                ? 'bg-green-400 text-black dark:bg-emerald-700 dark:text-black'
                : 'bg-green-200 dark:bg-emerald-400 dark:text-black'
            "
            @click="filter = 'Chat'"
          >
            Chat
          </button> -->
        </div>
      </div>

      <!-- Lista de Notificaciones -->
      <ul class="divide-y divide-gray-200 dark:divide-gray-600">
        <NotificationItem
          v-for="notification in filteredNotifications"
          :key="notification.id"
          :name="notification.type"
          :message="notification.description"
          :icon="notification.icon"
          @remove="removeNotification(notification.id)"
          @markAsRead="markAsRead(notification.id)"
        >
          <!-- Mostrar etiqueta junto al tipo de notificación -->
          <span
            v-if="notification.tag"
            class="ml-2 inline-block text-xs font-semibold text-white py-1 px-2 rounded-full"
            :class="{
              'bg-green-500': notification.tag === 'Petició',
              'bg-blue-500': notification.tag === 'Publicació',
              'bg-orange-500': notification.tag === 'Comentari',
            }"
          >
            {{ notification.tag }}
          </span>
        </NotificationItem>
      </ul>

      <!-- Sin Notificaciones -->
      <div
        v-if="filteredNotifications.length === 0"
        class="p-4 text-center text-gray-500 dark:text-gray-400"
      >
        No hi ha notificacions per mostrar.
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import NotificationItem from "./NotificationItem.vue";
import { getNotifications } from "@/services/communicationManager";
import { useAppStore } from "@/stores/index";
import { updateNotificationRevision } from "@/services/communicationManager";

// Obtener datos del usuario desde Pinia
const appStore = useAppStore();
const user_id = appStore.getUser()?.id;

// Variables de estado
const notifications = ref([]);
const filter = ref("all");

// Función para obtener las notificaciones del backend
const fetchNotifications = async () => {
  try {
    if (!user_id) {
      console.error("Error: user_id no está definido.");
      return;
    }

    const rawNotifications = await getNotifications(user_id);

    // Mapear datos de la base de datos a un formato más legible
    notifications.value = rawNotifications.map((n) => ({
      id: n.id,
      description: n.description,
      type: getNotificationType(n),
      icon: getNotificationIcon(getNotificationType(n)),
      tag: getNotificationTag(n),
      revised: n.revised,
    }));
  } catch (error) {
    console.error("Error al carregar les notificacions:", error);
  }
};

// Determinar el tipo de notificación
const getNotificationType = (notification) => {
  // Si tiene comment_id, es un comentario
  if (notification.comment_id) {
    return "Comentari";
  }

  // Si tiene request_id y publication_id, es tanto una solicitud como una publicación
  if (notification.request_id && notification.publication_id) {
    return ["Petició", "Publicació"];
  }

  // Si solo tiene request_id, es una solicitud
  if (notification.request_id) {
    return "Petició";
  }

  // Si solo tiene publication_id, es una publicación
  if (notification.publication_id) {
    return "Publicació";
  }

  // Si tiene report_id, es un reporte
  if (notification.report_id) {
    return "Report";
  }

  return "General"; // Si no hay campos con datos, lo considera general
};

// Obtener el tag de la notificación
// Obtener el tag de la notificación
const getNotificationTag = (notification) => {
  // Verificar el contenido de description

  // Verificar si la descripción existe y convertir a minúsculas para la comparación
  const description = notification.description?.toLowerCase() || "";

  // Verificar si la descripción contiene alguno de los términos
  if (description.includes("publicació")) {
    return "Publicació";
  }
  if (description.includes("comentari")) {
    return "Comentari";
  }
  if (description.includes("petició")) {
    return "Petició";
  }

  return "";
};

// Obtener icono según el tipo
const getNotificationIcon = (type) => {
  const icons = {
    Chat: "📨",
    Petició: "📝",
    Publicació: "📢",
    Comentari: "💬",
    General: "📌",
  };
  return icons[type] || "📌";
};

const togglePublicationsFilter = () => {
  // Si ambos tipos ya están en el filtro, los eliminamos
  if (filter.value.includes("Petició") && filter.value.includes("Publicació")) {
    filter.value = filter.value.filter(
      (f) => f !== "Petició" && f !== "Publicació"
    );
  } else {
    // Si no están ambos, los agregamos
    filter.value = ["Petició", "Publicació"];
  }
};

// Filtrar notificaciones
const filteredNotifications = computed(() => {
  if (filter.value.length === 0 || filter.value.includes("all")) {
    return notifications.value;
  }

  return notifications.value.filter((n) => filter.value.includes(n.type));
});

// Marcar notificación como leída
const markAsRead = async (id) => {
  try {
    // Llamada PUT para actualizar la notificación en el servidor
    const response = await updateNotificationRevision(id);
    if (!response.ok) {
      throw new Error("Error al marcar como leída");
    }

    const responseData = await response.json();
    // Actualizar la notificación localmente (marcarla como leída)
    await fetchNotifications();
  } catch (error) {
    console.error(error);
  }
};

// Eliminar notificación
const removeNotification = (id) => {
  notifications.value = notifications.value.filter((n) => n.id !== id);
};

onMounted(fetchNotifications);
</script>

<style scoped>
button.bg-gray-400 {
  background-color: #b0b0b0;
}
button.bg-blue-400 {
  background-color: #4a90e2;
}
button.bg-red-400 {
  background-color: #e74c3c;
}

button.bg-gray-200 {
  background-color: #e0e0e0;
}
button.bg-blue-200 {
  background-color: #d6eaff;
}
button.bg-red-200 {
  background-color: #fcdede;
}
</style>
