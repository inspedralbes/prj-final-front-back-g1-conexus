<template>
  <div class="animate-fade-in max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
    <!-- Capçalera -->
    <div class="mb-8 text-center">
      <h1
        class="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400"
      >
        Xats de Cantina
      </h1>
      <p class="text-gray-300 mt-2">Gestiona les converses amb professors</p>
    </div>

    <div
      v-if="loading"
      class="text-center py-8 bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-lg border border-slate-700"
    >
      <div class="spinner mx-auto mb-4 h-8 w-8 text-blue-400"></div>
      <p class="text-gray-300">Carregant xats...</p>
    </div>

    <div
      v-else-if="error"
      class="text-center py-8 bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-lg border border-slate-700"
    >
      <svg
        class="mx-auto h-12 w-12 text-red-400 mb-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
      <p class="text-gray-300">{{ error }}</p>
    </div>

    <div v-else-if="activeChat" class="chat-detail">
      <div class="chat-header">
        <button class="back-button" @click="goBack">
          <i class="fas fa-arrow-left"></i> Tornar
        </button>
        <h3>{{ chatName }}</h3>
      </div>

      <div class="chat-messages" ref="messagesContainer">
        <div v-if="chatLoading" class="loading-spinner">
          <p>Carregant missatges...</p>
        </div>

        <div v-else-if="messages.length === 0" class="empty-chat-message">
          <p>No hi ha missatges en aquest xat.</p>
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
            'order-message': isOrderMessage(message.message),
          }"
        >
          <div class="message-header">
            <span class="user-name">{{ message.userName }}</span>
            <span class="timestamp">{{ formatDate(message.timestamp) }}</span>
          </div>
          <div class="message-content">{{ message.message }}</div>
        </div>
      </div>

      <div class="chat-input">
        <textarea
          v-model="newMessage"
          placeholder="Escriu un missatge..."
          @keydown.enter.ctrl="sendMessage"
        ></textarea>
        <button @click="sendMessage" :disabled="!newMessage.trim()">
          Enviar
        </button>
      </div>

      <div class="quick-responses">
        <h4>Respostes ràpides</h4>
        <div class="response-buttons">
          <span
            class="response-btn"
            @click="sendQuickResponse('✅ Comanda rebuda')"
            >✅ Comanda rebuda</span
          >
          <span
            class="response-btn"
            @click="
              sendQuickResponse('🚚 La teva comanda està llesta per a recollir')
            "
            >🚚 La teva comanda està llesta per a recollir</span
          >
          <span
            class="response-btn"
            @click="sendQuickResponse('❌ No està disponible')"
            >❌ No està disponible</span
          >
          <span
            class="response-btn menu-btn"
            @click="sendMenuResponse"
            :class="{ loading: menuLoading }"
          >
            🍽️ Enviar menú disponible
          </span>
        </div>
      </div>
    </div>

    <div
      v-else-if="chats.length === 0"
      class="text-center py-12 bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden border border-slate-700"
    >
      <svg
        class="mx-auto h-12 w-12 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <p class="mt-1 text-gray-400">Actualment no hi ha xats actius</p>
    </div>

    <div v-else>
      <!-- Lista de chats simplificada -->
      <div
        class="bg-slate-800/50 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg border border-slate-700"
      >
        <h2
          class="p-4 border-b border-slate-700/50 text-white font-medium text-lg"
        >
          Xats Actius
        </h2>
        <ul class="divide-y divide-slate-700/50">
          <li
            v-for="chat in chats"
            :key="chat._id"
            class="p-4 hover:bg-slate-700/30 transition-colors duration-200 cursor-pointer"
            @click="openChat(chat)"
          >
            <div class="flex items-center">
              <div class="flex-1 min-w-0">
                <p class="text-white font-medium truncate">
                  {{ getUserName(chat) }}
                </p>
                <p class="text-gray-400 text-sm truncate">
                  {{ getLastMessage(chat) }}
                </p>
              </div>
              <div
                v-if="hasNewMessages[chat._id]"
                class="ml-2 flex-shrink-0 w-3 h-3 bg-purple-500 rounded-full"
              ></div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch, onUnmounted, nextTick } from "vue";
import { useRouter } from "vue-router";
import {
  getAllUsers,
  getAllTypeUsers,
} from "@/services/communicationsScripts/mainManager";
import chatManager from "@/services/communicationsScripts/chatsComManager";
import { useAppStore } from "@/stores";
import io from "socket.io-client";
import { getAllEnabledCanteenItems } from "@/services/communicationsScripts/canteenComManager";

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
const menuItems = ref([]);
const menuLoading = ref(false);
const newMessage = ref("");
const usersCache = ref({});
const API_URL = import.meta.env.VITE_CHAT_URL;

// Obtener el store y router
const appStore = useAppStore();
const router = useRouter();

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

    // Actualizar la lista principal de usuarios
    users.value = usersResponse;

    // Actualizar la caché de usuarios con los datos más recientes
    if (Array.isArray(usersResponse)) {
      usersResponse.forEach((user) => {
        usersCache.value[user.id] = {
          name: user.name || user.username,
          profile: user.profile,
          typeUsersId: user.typeUsers_id,
        };
      });
    }

    // Obtener todos los chats
    let chatsList = [];
    try {
      // Intentar obtener los chats específicos del usuario cantina
      chatsList = await chatManager.getChatsByUser(
        parseInt(currentUserId.value)
      );
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


    // Cargar menú items para respuestas rápidas
    await loadMenuItems();
  } catch (err) {
    console.error("Error al cargar los chats:", err);
    error.value =
      "Error al cargar los chats. Por favor, inténtelo de nuevo más tarde.";
  } finally {
    loading.value = false;
  }
};

// Cargar items del menú
const loadMenuItems = async () => {
  try {
    const items = await getAllEnabledCanteenItems();
    menuItems.value = items;
  } catch (error) {
    console.error("Error al cargar ítems del menú:", error);
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

  // Primero verificar en la caché de usuarios
  if (usersCache.value[otherUserId] && usersCache.value[otherUserId].name) {
    return usersCache.value[otherUserId].name;
  }

  // Buscar el usuario en la lista de usuarios
  const user = users.value.find((u) => u.id === otherUserId);

  // Si encontramos el usuario, actualizar la caché y devolver el nombre
  if (user) {
    const userName = user.name || user.username || `Profesor ${otherUserId}`;
    // Actualizar la caché
    usersCache.value[otherUserId] = {
      ...usersCache.value[otherUserId],
      name: userName,
      profile: user.profile,
      typeUsersId: user.typeUsers_id,
    };
    return userName;
  }

  return `Profesor ${otherUserId}`;
};

// Obtener el último mensaje de un chat
const getLastMessage = (chat) => {
  if (!chat || !chat.interaction || chat.interaction.length === 0) {
    return "No hay mensajes";
  }

  const lastMsg = chat.interaction[chat.interaction.length - 1];
  const message = lastMsg.message || "";

  // Acortar el mensaje si es muy largo
  return message.length > 40 ? message.substring(0, 40) + "..." : message;
};

// Formatear fecha
const formatDate = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Verificar si un mensaje es una orden
const isOrderMessage = (message) => {
  return message && message.includes("*Nuevo Pedido*");
};

// Abrir un chat específico
const openChat = async (chat) => {
  try {
    chatLoading.value = true;
    activeChat.value = chat;

    // Establecer nombre del chat
    chatName.value = getUserName(chat);

    // Marcar mensajes como leídos
    if (hasNewMessages.value[chat._id]) {
      hasNewMessages.value[chat._id] = false;
    }

    // Cargar mensajes
    const chatData = await chatManager.getChatById(chat._id);
    if (!chatData || !chatData.interaction) {
      throw new Error("No se pudieron cargar los mensajes");
    }

    // Convertir mensajes al formato deseado
    messages.value = chatData.interaction.map((msg) => {
      return {
        id: msg._id,
        userId: msg.teacherId,
        userName:
          msg.teacherId === currentUserId.value ? "Cantina" : getUserName(chat),
        message: msg.message,
        timestamp: new Date(msg.date),
      };
    });

    // Hacer scroll al último mensaje
    await nextTick();
    scrollToBottom();

    chatLoading.value = false;
  } catch (error) {
    console.error("Error al abrir chat:", error);
    chatLoading.value = false;
    error.value = "Error al cargar los mensajes. Inténtelo de nuevo.";
  }
};

// Volver a la lista de chats
const goBack = () => {
  activeChat.value = null;
  messages.value = [];
  chatName.value = "";
};

// Enviar mensaje
const sendMessage = async () => {
  if (!newMessage.value.trim() || !activeChat.value) return;

  try {
    // Enviar mensaje
    await chatManager.sendMessage(
      activeChat.value._id,
      currentUserId.value,
      newMessage.value
    );

    // Añadir mensaje localmente
    messages.value.push({
      id: Date.now(),
      userId: currentUserId.value,
      userName: currentUserName.value,
      message: newMessage.value,
      timestamp: new Date(),
    });

    // Limpiar input y hacer scroll
    newMessage.value = "";
    await nextTick();
    scrollToBottom();
  } catch (error) {
    console.error("Error al enviar mensaje:", error);
  }
};

// Enviar respuesta rápida
const sendQuickResponse = async (responseText) => {
  if (!activeChat.value) return;

  // Asignar la respuesta al campo de mensaje y enviar
  newMessage.value = responseText;
  await sendMessage();
};

// Enviar respuesta con el menú disponible
const sendMenuResponse = async () => {
  if (!activeChat.value || menuLoading.value) return;

  try {
    menuLoading.value = true;

    // Cargar menú actualizado si no lo tenemos
    if (!menuItems.value || menuItems.value.length === 0) {
      await loadMenuItems();
    }

    // Formatear mensaje con el menú
    let menuMessage = "🍽️ *Menú disponible hoy:*\n\n";

    if (menuItems.value && menuItems.value.length > 0) {
      menuItems.value.forEach((item) => {
        menuMessage += `• ${item.product_name} - ${Number(
          item.product_price
        ).toFixed(2)} €\n`;
      });
    } else {
      menuMessage +=
        "Lo sentimos, no hay productos disponibles en este momento.";
    }

    // Enviar el mensaje
    newMessage.value = menuMessage;
    await sendMessage();
  } catch (error) {
    console.error("Error al enviar menú:", error);
  } finally {
    menuLoading.value = false;
  }
};

// Scroll al final de los mensajes
const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
};

// Formatear tiempo transcurrido
const formatTimeAgo = (timestamp) => {
  if (!timestamp) return "";

  const now = new Date();
  const date = new Date(timestamp);
  const diffInMinutes = Math.floor((now - date) / (1000 * 60));

  if (diffInMinutes < 1) return "Hace un momento";
  if (diffInMinutes < 60) return `Hace ${diffInMinutes} min`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `Hace ${diffInHours} h`;

  const diffInDays = Math.floor(diffInHours / 24);
  return `Hace ${diffInDays} ${diffInDays === 1 ? "día" : "días"}`;
};

// Conectar al socket
const connectSocket = () => {
  try {
    // Iniciar conexión con socket.io
    socket.value = io(API_URL, {
      transports: ["websocket"],
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    // Evento de conexión establecida
    socket.value.on("connect", () => {

      // Registrar el usuario para recibir notificaciones
      socket.value.emit("register_user", {
        userId: currentUserId.value,
        userName: currentUserName.value,
      });

      // Unirse a todos los chats para recibir actualizaciones
      for (const chat of chats.value) {
        if (chat._id) {
          socket.value.emit("join_chat", {
            chatId: chat._id,
            userId: currentUserId.value,
            userName: currentUserName.value,
          });
        }
      }
    });

    // Configurar listeners para mensajes, etc.
    setupSocketListeners();
  } catch (error) {
    console.error("Error al conectar con socket.io:", error);
  }
};

// Configurar listeners del socket
const setupSocketListeners = () => {
  // Escuchar nuevos mensajes
  socket.value.on("new_message", handleNewMessage);

  // Escuchar cuando se crea un nuevo chat
  socket.value.on("new_chat_created", handleNewChat);
};

// Manejar nuevos mensajes
const handleNewMessage = (data) => {
  try {
    // Extraer información del mensaje
    let messageInfo = {
      chatId: null,
      userId: null,
      message: null,
    };

    // Procesar diferentes formatos
    if (data.chatId && data.userId && data.message) {
      messageInfo = {
        chatId: data.chatId,
        userId: data.userId,
        message: data.message,
      };
    } else if (
      data.interaction &&
      Array.isArray(data.interaction) &&
      data.interaction.length > 0
    ) {
      const lastMsg = data.interaction[data.interaction.length - 1];
      messageInfo = {
        chatId: data._id || data.chatId,
        userId: lastMsg.teacherId,
        message: lastMsg.message,
      };
    } else if (
      data.chatId &&
      data.interaction &&
      !Array.isArray(data.interaction)
    ) {
      messageInfo = {
        chatId: data.chatId,
        userId: data.interaction.teacherId,
        message: data.interaction.message,
      };
    }

    // No procesar mensajes propios
    if (messageInfo.userId === currentUserId.value) {
      return;
    }

    // Si es un chat abierto actualmente, añadir el mensaje
    if (activeChat.value && activeChat.value._id === messageInfo.chatId) {
      // Buscar el otro usuario
      const userName = getUserName(activeChat.value);

      // Añadir mensaje a la lista
      messages.value.push({
        id: Date.now(), // ID temporal
        userId: messageInfo.userId,
        userName: userName,
        message: messageInfo.message,
        timestamp: new Date(),
      });

      // Hacer scroll
      nextTick(() => {
        scrollToBottom();
      });
    } else {
      // Marcar chat como con mensajes nuevos
      hasNewMessages.value[messageInfo.chatId] = true;

      // Actualizar la lista de chats si es necesario
      const chatExists = chats.value.some((c) => c._id === messageInfo.chatId);
      if (!chatExists) {
        loadChats(); // Recargar chats si es un chat nuevo
      }
    }
  } catch (error) {
    console.error("Error al procesar nuevo mensaje:", error);
  }
};

// Manejar nuevo chat
const handleNewChat = async (data) => {
  try {
    // Verificar si el chat es para la cantina
    const chatData = await chatManager.getChatById(data.chatId);
    if (
      chatData &&
      chatData.teachers &&
      chatData.teachers.includes(parseInt(currentUserId.value))
    ) {
      // Unirse al chat
      if (socket.value && socket.value.connected) {
        socket.value.emit("join_chat", {
          chatId: chatData._id,
          userId: currentUserId.value,
          userName: currentUserName.value,
        });
      }

      // Actualizar lista de chats
      loadChats();
    }
  } catch (error) {
    console.error("Error al procesar nuevo chat:", error);
  }
};

onMounted(async () => {
  // Verificar si es usuario tipo cantina
  if (!isCanteenUser.value) {
    error.value = "Solo el usuario de cantina puede acceder a esta página";
    loading.value = false;
    return;
  }

  // Cargar datos
  await loadChats();

  // Conectar al socket
  connectSocket();
});

onUnmounted(() => {
  // Desconectar socket
  if (socket.value) {
    socket.value.disconnect();
    socket.value = null;
  }
});

// Iniciar con la carga de datos
watch(
  () => currentUserId.value,
  (newVal) => {
    if (newVal) {
      loadChats();
    }
  },
  { immediate: true }
);
</script>

<style scoped>
/* Estilos para la vista de chat */
.chat-detail {
  background-color: rgba(15, 23, 42, 0.7);
  border-radius: 1rem;
  border: 1px solid rgba(51, 65, 85, 0.5);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 80vh;
}

.chat-header {
  padding: 1rem;
  background-color: rgba(30, 41, 59, 0.8);
  border-bottom: 1px solid rgba(51, 65, 85, 0.5);
  display: flex;
  align-items: center;
}

.back-button {
  background: none;
  border: none;
  color: #94a3b8;
  font-size: 0.9rem;
  cursor: pointer;
  margin-right: 1rem;
}

.back-button:hover {
  color: #cbd5e1;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.message {
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  max-width: 80%;
}

.own-message {
  background: linear-gradient(to right, #4f46e5, #7c3aed);
  color: white;
  align-self: flex-end;
}

.other-message {
  background-color: rgba(51, 65, 85, 0.8);
  color: #e2e8f0;
  align-self: flex-start;
}

.order-message {
  background-color: rgba(20, 184, 166, 0.2);
  border: 1px solid rgba(20, 184, 166, 0.4);
}

.message-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: 0.8rem;
  opacity: 0.8;
}

.chat-input {
  padding: 1rem;
  background-color: rgba(30, 41, 59, 0.8);
  border-top: 1px solid rgba(51, 65, 85, 0.5);
  display: flex;
  gap: 0.5rem;
}

.chat-input textarea {
  flex: 1;
  background-color: rgba(51, 65, 85, 0.8);
  border: 1px solid rgba(100, 116, 139, 0.5);
  color: white;
  border-radius: 0.5rem;
  padding: 0.75rem;
  resize: none;
  height: 2.5rem;
  max-height: 8rem;
  transition: height 0.2s;
}

.chat-input textarea:focus {
  outline: none;
  border-color: #7c3aed;
}

.chat-input button {
  background: linear-gradient(to right, #4f46e5, #7c3aed);
  color: white;
  border: none;
  border-radius: 0.5rem;
  padding: 0 1.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: opacity 0.2s;
}

.chat-input button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.quick-responses {
  padding: 1rem;
  background-color: rgba(30, 41, 59, 0.5);
  border-top: 1px solid rgba(51, 65, 85, 0.5);
}

.quick-responses h4 {
  color: #94a3b8;
  font-size: 0.9rem;
  margin-bottom: 0.75rem;
}

.response-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.response-btn {
  background-color: rgba(51, 65, 85, 0.8);
  border: 1px solid rgba(100, 116, 139, 0.5);
  color: #e2e8f0;
  border-radius: 0.5rem;
  padding: 0.5rem 0.75rem;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;
}

.response-btn:hover {
  background-color: rgba(71, 85, 105, 0.8);
  transform: translateY(-1px);
}

.menu-btn {
  background-color: rgba(20, 184, 166, 0.2);
  border-color: rgba(20, 184, 166, 0.4);
}

.menu-btn:hover {
  background-color: rgba(20, 184, 166, 0.3);
}

.loading-spinner {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: #94a3b8;
}

.empty-chat-message {
  text-align: center;
  color: #94a3b8;
  padding: 2rem;
}

/* Estilos para la lista de chats */
.spinner {
  border: 4px solid rgba(59, 130, 246, 0.2);
  border-left-color: currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>