<template>
  <div class="chat-canteen-container">
    <h2>Chats de la Cantina</h2>

    <div v-if="loading" class="loading">
      <p>Cargando chats...</p>
    </div>

    <div v-else-if="error" class="error">
      <p>{{ error }}</p>
    </div>

    <div v-else-if="activeChat" class="chat-detail">
      <div class="chat-header">
        <button class="back-button" @click="goBack">
          <i class="fas fa-arrow-left"></i> Volver
        </button>
        <h3>{{ chatName }}</h3>
      </div>

      <div class="chat-messages" ref="messagesContainer">
        <div v-if="chatLoading" class="loading-spinner">
          <p>Cargando mensajes...</p>
        </div>

        <div v-else-if="messages.length === 0" class="empty-chat-message">
          <p>No hay mensajes en este chat.</p>
        </div>

        <div
          v-for="(message, index) in messages"
          :key="index"
          class="message"
          :class="{
            'own-message':
              message.userId.toString() === currentUserId.toString(),
            'other-message':
              message.userId.toString() !== currentUserId.toString(),
          }"
        >
          <div class="message-header">
            <span class="user-name">{{ message.userName }}</span>
            <span class="timestamp">{{ formatDate(message.timestamp) }}</span>
          </div>
          <div class="message-content">{{ message.message }}</div>
        </div>
      </div>

      <div class="quick-responses">
        <h4>Respuestas rápidas</h4>
        <div class="response-buttons">
          <span
            class="response-btn"
            @click="sendQuickResponse('✅ Comanda rebuda')"
            >✅ Comanda rebuda</span
          >
          <span
            class="response-btn"
            @click="
              sendQuickResponse('🚚 La teva comanda esta llesta per a recollir')
            "
            >🚚 La teva comanda esta llesta per a recollir</span
          >
          <span
            class="response-btn"
            @click="sendQuickResponse('❌ No està disponible')"
            >❌ No està disponible</span
          >
        </div>
      </div>
    </div>

    <div v-else-if="chats.length === 0" class="empty-list">
      <p>No hay chats activos</p>
    </div>

    <ul v-else class="user-list">
      <li
        v-for="chat in chats"
        :key="chat._id"
        class="user-item"
        @click="openChat(chat)"
      >
        <div class="user-avatar">
          <img
            :src="getUserAvatar(chat)"
            :alt="getUserName(chat)"
            onerror="this.src='/img/default-avatar.png'"
          />
          <div
            v-if="hasNewMessages[getUserId(chat)]"
            class="new-message-indicator"
          ></div>
        </div>
        <div class="user-info">
          <h3>{{ getUserName(chat) }}</h3>
          <p class="user-type">{{ getUserType(chat) }}</p>
          <p
            v-if="getLastMessage(chat)"
            class="last-message"
            :class="{ 'new-message': hasNewMessages[getUserId(chat)] }"
          >
            {{ getLastMessage(chat) }}
          </p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch, onUnmounted, nextTick } from "vue";
import { useRouter, useRoute } from "vue-router";
import {
  getAllUsers,
  getAllTypeUsers,
} from "@/services/communicationsScripts/mainManager";
import chatManager from "@/services/communicationsScripts/chatsComManager";
import { useAppStore } from "@/stores";
import io from "socket.io-client";

// Estado
const loading = ref(true);
const error = ref(null);
const chats = ref([]);
const activeChat = ref(null);
const chatName = ref("");
const messages = ref([]);
const chatLoading = ref(false);
const hasNewMessages = ref({});
const socket = ref(null);
const userTypes = ref([]);
const users = ref([]);
const messagesContainer = ref(null);

// Obtener el store y router
const appStore = useAppStore();
const router = useRouter();
const route = useRoute();

// Id de usuario actual (cantina)
const currentUserId = computed(() =>
  appStore.getUserId() ? appStore.getUserId().toString() : null
);

const currentUserName = computed(
  () => appStore.getUser()?.name || appStore.getUser()?.username || "Cantina"
);

// Verificar si el usuario está autorizado (debe ser tipo cantina)
const isCanteenUser = computed(() => {
  return appStore.getUser()?.typeUsers_id === 5;
});

// Métodos
// Cargar todos los chats donde participa la cantina
const loadChats = async () => {
  try {
    loading.value = true;
    error.value = null;

    // Cargar tipos de usuarios
    const typesResponse = await getAllTypeUsers();
    userTypes.value = typesResponse;

    // Cargar todos los usuarios
    const usersResponse = await getAllUsers();
    users.value = usersResponse;

    // Obtener todos los chats
    let chatsList = [];
    try {
      // Intentar obtener los chats específicos del usuario cantina
      chatsList = await chatManager.getChatsByUser(currentUserId.value);
    } catch (err) {
      console.error(
        "Error al obtener chats por usuario, usando getAllChats:",
        err
      );

      // Si falla, obtener todos los chats y filtrar los de la cantina
      const allChats = await chatManager.getAllChats();
      chatsList = allChats.filter(
        (chat) =>
          chat.teachers && chat.teachers.includes(parseInt(currentUserId.value))
      );
    }

    // Filtrar solo chats que tienen al menos un mensaje
    chats.value = chatsList.filter(
      (chat) => chat.interaction && chat.interaction.length > 0
    );

    console.log("Chats cargados:", chats.value);
  } catch (err) {
    console.error("Error al cargar los chats:", err);
    error.value =
      "Error al cargar los chats. Por favor, inténtelo de nuevo más tarde.";
  } finally {
    loading.value = false;
  }
};

// Obtener el nombre del usuario con el que se está chateando
const getUserName = (chat) => {
  if (!chat || !chat.teachers) return "Usuario desconocido";

  // Encontrar el ID del otro usuario (que no sea la cantina)
  const otherUserId = chat.teachers.find(
    (teacherId) => teacherId !== parseInt(currentUserId.value)
  );

  if (!otherUserId) return "Usuario desconocido";

  // Buscar el usuario en la lista de usuarios
  const user = users.value.find((u) => u.id === otherUserId);
  return user ? user.name || user.username : `Profesor ${otherUserId}`;
};

// Obtener el avatar del usuario
const getUserAvatar = (chat) => {
  if (!chat || !chat.teachers) return "/img/default-avatar.png";

  const otherUserId = chat.teachers.find(
    (teacherId) => teacherId !== parseInt(currentUserId.value)
  );

  if (!otherUserId) return "/img/default-avatar.png";

  const user = users.value.find((u) => u.id === otherUserId);
  return user && user.profile ? user.profile : "/img/default-avatar.png";
};

// Obtener el tipo de usuario
const getUserType = (chat) => {
  if (!chat || !chat.teachers) return "Usuario";

  const otherUserId = chat.teachers.find(
    (teacherId) => teacherId !== parseInt(currentUserId.value)
  );

  if (!otherUserId) return "Usuario";

  const user = users.value.find((u) => u.id === otherUserId);
  if (!user) return "Usuario";

  const userType = userTypes.value.find((t) => t.id === user.typeUsers_id);
  return userType ? userType.name : "Usuario";
};

// Obtener el ID del otro usuario en el chat
const getUserId = (chat) => {
  if (!chat || !chat.teachers) return null;

  return chat.teachers.find(
    (teacherId) => teacherId !== parseInt(currentUserId.value)
  );
};

// Obtener el último mensaje del chat
const getLastMessage = (chat) => {
  if (!chat || !chat.interaction || chat.interaction.length === 0) return "";

  const lastMsg = chat.interaction[chat.interaction.length - 1];
  return lastMsg.message.length > 30
    ? lastMsg.message.substring(0, 30) + "..."
    : lastMsg.message;
};

// Abrir un chat específico
const openChat = async (chat) => {
  try {
    chatLoading.value = true;
    activeChat.value = chat._id;
    chatName.value = getUserName(chat);

    // Cargar los mensajes del chat
    await loadChatMessages(chat._id);

    // Marcar mensajes como leídos
    const otherUserId = getUserId(chat);
    if (otherUserId && hasNewMessages.value[otherUserId]) {
      hasNewMessages.value[otherUserId] = false;
    }

    chatLoading.value = false;

    // Hacer scroll al final de los mensajes
    await nextTick();
    scrollToBottom();
  } catch (err) {
    console.error("Error al abrir el chat:", err);
    chatLoading.value = false;
    error.value =
      "Error al abrir el chat. Por favor, inténtelo de nuevo más tarde.";
  }
};

// Cargar los mensajes de un chat
const loadChatMessages = async (chatId) => {
  try {
    const chatData = await chatManager.getChatById(chatId);

    if (!chatData || !chatData.interaction) {
      messages.value = [];
      return;
    }

    // Convertir los mensajes al formato esperado
    messages.value = chatData.interaction.map((msg) => {
      const isOwnMessage = msg.teacherId === currentUserId.value.toString();
      const otherUserId = getUserId(chatData);
      const otherUser = users.value.find((u) => u.id === otherUserId);

      return {
        id: msg._id,
        userId: msg.teacherId,
        userName: isOwnMessage
          ? currentUserName.value
          : otherUser
          ? otherUser.name || otherUser.username
          : `Profesor ${msg.teacherId}`,
        message: msg.message,
        timestamp: new Date(msg.date),
      };
    });

    // Ordenar mensajes por fecha
    messages.value.sort(
      (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
    );
  } catch (err) {
    console.error("Error al cargar los mensajes:", err);
    throw err;
  }
};

// Volver a la lista de chats
const goBack = () => {
  activeChat.value = null;
  chatName.value = "";
  messages.value = [];
};

// Formatear la fecha de los mensajes
const formatDate = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Enviar respuesta rápida
const sendQuickResponse = async (message) => {
  if (!activeChat.value) return;

  try {
    // Agregar mensaje temporalmente a la UI
    const tempMessage = {
      id: Date.now().toString(),
      userId: currentUserId.value,
      userName: currentUserName.value,
      message: message,
      timestamp: new Date(),
      sending: true,
    };

    messages.value.push(tempMessage);

    // Hacer scroll al final de los mensajes
    await nextTick();
    scrollToBottom();

    // Enviar el mensaje al servidor
    await chatManager.sendMessage(
      activeChat.value,
      currentUserId.value,
      message
    );

    // Actualizar estado del mensaje
    const messageIndex = messages.value.findIndex(
      (m) => m.id === tempMessage.id
    );
    if (messageIndex !== -1) {
      messages.value[messageIndex].sending = false;
    }
  } catch (err) {
    console.error("Error al enviar respuesta rápida:", err);
    // Marcar mensaje como fallido
    const messageIndex = messages.value.findIndex((m) => m.sending);
    if (messageIndex !== -1) {
      messages.value[messageIndex].failed = true;
      messages.value[messageIndex].sending = false;
    }
  }
};

// Hacer scroll al final de los mensajes
const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
};

// Socket setup - reemplazamos la configuración actual con una más directa
const connectSocket = () => {
  try {
    // Verificar que tenemos los datos necesarios
    if (!currentUserId.value) {
      console.error("No se puede conectar al socket: falta ID de usuario");
      return;
    }

    // Iniciar conexión con socket.io
    socket.value = io("http://localhost:3007", {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      forceNew: true, // Forzar nueva conexión
    });

    // Evento de conexión establecida
    socket.value.on("connect", () => {
      console.log("🟢 Conectado al servidor de chat");

      // Registrar el usuario de cantina con una marca especial
      socket.value.emit("register_user", {
        userId: currentUserId.value,
        userName: currentUserName.value,
        isCanteen: true, // Marcar como cantina para tratamiento especial
      });

      // Unirse a todos los chats existentes
      chats.value.forEach((chat) => {
        socket.value.emit("join_chat", {
          chatId: chat._id,
          userId: currentUserId.value,
          userName: currentUserName.value,
        });
      });

      // Subscripción especial a notificaciones de cantina
      socket.value.emit("join_canteen", {
        canteenId: currentUserId.value,
      });

      console.log("🔔 Suscripción a eventos de cantina activada");
    });

    // Escuchar nuevos mensajes
    socket.value.on("new_message", async (data) => {
      console.log("📩 Mensaje nuevo recibido:", data);

      // Si estamos viendo este chat, actualizar los mensajes
      if (activeChat.value === data.chatId) {
        // Código existente para actualizar mensajes
        // ...
      } else {
        // Marcar como mensaje no leído y actualizar lista
        const chatIndex = chats.value.findIndex(
          (chat) => chat._id === data.chatId
        );
        if (chatIndex !== -1) {
          const otherUserId = getUserId(chats.value[chatIndex]);
          if (otherUserId) {
            hasNewMessages.value[otherUserId] = true;
          }

          // Actualizar último mensaje
          // ...
        } else {
          // Si no existe el chat en nuestra lista, forzar actualización
          console.log(
            "⚠️ Chat no encontrado en la lista actual, actualizando..."
          );
          forceRefreshChats();
        }
      }
    });

    // Escuchar cuando se crea un nuevo chat con cantina
    socket.value.on("new_chat_for_canteen", async (data) => {
      console.log("🆕 Notificación de nuevo chat para cantina:", data);

      // Forzar actualización de la lista de chats
      forceRefreshChats();

      // Mostrar notificación visual
      showNotification("Nuevo chat", "Se ha creado un nuevo chat");
    });

    // Escuchar cualquier evento de nuevo chat (respaldo)
    socket.value.on("new_chat_created", async (data) => {
      console.log("📝 Notificación general de nuevo chat:", data);
      forceRefreshChats();
    });

    // Escuchar el evento de primer mensaje en un chat (respaldo)
    socket.value.on("chat_first_message", async (data) => {
      console.log("🔔 Notificación de primer mensaje en chat:", data);
      forceRefreshChats();
    });

    // Manejar desconexiones
    socket.value.on("disconnect", () => {
      console.log("🔴 Desconectado del servidor de chat");
    });

    // Reportar errores
    socket.value.on("error", (error) => {
      console.error("🚨 Error de socket:", error);
    });
  } catch (error) {
    console.error("Error al conectar con socket.io:", error);
  }
};

// Función específica para forzar la actualización de la lista de chats
const forceRefreshChats = async () => {
  console.log("🔄 Forzando actualización de lista de chats...");
  try {
    // Obtener todos los chats directamente
    const allChats = await chatManager.getAllChats();

    // Filtrar solo los relevantes para cantina con al menos un mensaje
    const relevantChats = allChats.filter(
      (chat) =>
        chat.teachers &&
        chat.teachers.includes(parseInt(currentUserId.value)) &&
        chat.interaction &&
        chat.interaction.length > 0
    );

    // Verificar si hay chats nuevos
    const currentChatIds = new Set(chats.value.map((c) => c._id));
    const newChats = relevantChats.filter(
      (chat) => !currentChatIds.has(chat._id)
    );

    if (newChats.length > 0) {
      console.log(`✅ Se encontraron ${newChats.length} chats nuevos`);

      // Añadir los nuevos chats a la lista
      newChats.forEach((newChat) => {
        chats.value.push(newChat);
        console.log(`➕ Añadido nuevo chat: ${newChat._id}`);

        // Marcar como no leído
        const otherUserId = getUserId(newChat);
        if (otherUserId) {
          hasNewMessages.value[otherUserId] = true;
        }
      });

      // Actualizar la lista completa (importante para reactivity)
      chats.value = [...chats.value];
    } else {
      console.log("ℹ️ No se encontraron chats nuevos");
    }
  } catch (error) {
    console.error("❌ Error al actualizar lista de chats:", error);
  }
};

// Función auxiliar para mostrar notificación
const showNotification = (title, message) => {
  if (Notification.permission === "granted") {
    new Notification(title, { body: message });
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        new Notification(title, { body: message });
      }
    });
  }
};

// Solicitar permisos de notificación al inicio
const requestNotificationPermission = () => {
  if (
    Notification.permission !== "granted" &&
    Notification.permission !== "denied"
  ) {
    Notification.requestPermission();
  }
};

// Configurar un intervalo para verificar nuevos chats periódicamente como respaldo
let refreshInterval;

// Modificar onMounted para incluir las nuevas funciones
onMounted(async () => {
  // Verificar si el usuario es de tipo cantina
  if (!isCanteenUser.value) {
    error.value =
      "Acceso no autorizado. Esta página es solo para el usuario de cantina.";
    loading.value = false;
    return;
  }

  // Solicitar permisos para notificaciones
  requestNotificationPermission();

  // Cargar chats
  await loadChats();

  // Conectar al socket para actualizaciones en tiempo real
  connectSocket();

  // Configurar intervalo de respaldo
  refreshInterval = setInterval(forceRefreshChats, 15000);
});

// Modificar onUnmounted para limpiar el intervalo
onUnmounted(() => {
  // Desconectar socket
  if (socket.value) {
    socket.value.disconnect();
    socket.value = null;
  }

  // Limpiar intervalo
  if (refreshInterval) {
    clearInterval(refreshInterval);
  }
});
</script>

<style scoped>
.chat-canteen-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  height: 100vh;
  display: flex;
  flex-direction: column;
}

h2 {
  margin-bottom: 20px;
  color: #333;
  text-align: center;
  font-size: 1.8rem;
}

h3 {
  margin: 0;
  font-size: 1.2rem;
}

.loading,
.error {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  background-color: #f5f5f5;
  border-radius: 8px;
  color: #6c757d;
}

.error {
  color: #dc3545;
}

.empty-list {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  background-color: #f5f5f5;
  border-radius: 8px;
  color: #6c757d;
}

.user-list {
  list-style: none;
  padding: 0;
  margin: 0;
  overflow-y: auto;
  flex: 1;
}

.user-item {
  display: flex;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.user-item:hover {
  background-color: #f5f5f5;
}

.user-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 15px;
  background-color: #e9ecef;
  flex-shrink: 0;
  position: relative;
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.new-message-indicator {
  position: absolute;
  bottom: 3px;
  right: 3px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: #28a745;
  border: 2px solid white;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(40, 167, 69, 0.7);
  }

  70% {
    transform: scale(1);
    box-shadow: 0 0 0 6px rgba(40, 167, 69, 0);
  }

  100% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(40, 167, 69, 0);
  }
}

.user-info {
  flex: 1;
}

.user-info h3 {
  margin: 0;
  font-size: 16px;
  color: #333;
}

.user-type {
  margin: 5px 0 0;
  font-size: 14px;
  color: #6c757d;
}

.last-message {
  margin: 5px 0 0;
  font-size: 13px;
  color: #6c757d;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.last-message.new-message {
  font-weight: bold;
  color: #212529;
}

/* Estilos para la vista de chat */
.chat-detail {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.chat-header {
  padding: 10px;
  background-color: #f5f5f5;
  border-radius: 8px 8px 0 0;
  display: flex;
  gap: 15px;
  align-items: center;
}

.back-button {
  background: none;
  border: none;
  color: #007bff;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
}

.back-button:hover {
  text-decoration: underline;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background-color: #fff;
  border: 1px solid #ddd;
  display: flex;
  flex-direction: column;
}

.empty-chat-message {
  text-align: center;
  padding: 40px;
  color: #6c757d;
}

.message {
  margin-bottom: 15px;
  padding: 10px;
  border-radius: 8px;
  background-color: #f0f0f0;
  max-width: 70%;
  color: #333;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.own-message {
  margin-left: auto;
  background-color: #007bff;
  color: white;
}

.other-message {
  margin-right: auto;
}

.message-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
  font-size: 0.8em;
  opacity: 0.8;
}

.message-content {
  word-wrap: break-word;
}

.quick-responses {
  padding: 15px;
  background-color: #f5f5f5;
  border-radius: 0 0 8px 8px;
}

.quick-responses h4 {
  margin-top: 0;
  margin-bottom: 10px;
  color: #333;
  font-size: 1rem;
}

.response-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.response-btn {
  padding: 10px 15px;
  background-color: #28a745;
  color: white;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.response-btn:hover {
  background-color: #218838;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.loading-spinner {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
}
</style>