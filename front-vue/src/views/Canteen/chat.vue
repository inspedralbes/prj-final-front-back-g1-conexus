<template>
  <div class="animate-fade-in max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
    <!-- Capçalera -->
    <div class="mb-8 text-center">
      <h1
        class="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400"
      >
        Comandes Actives
      </h1>
      <p class="text-gray-300 mt-2">Gestiona les comandes de la cantina</p>
    </div>

    <div
      v-if="loading"
      class="text-center py-8 bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-lg border border-slate-700"
    >
      <div class="spinner mx-auto mb-4 h-8 w-8 text-blue-400"></div>
      <p class="text-gray-300">Carregant comandes...</p>
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
      <p class="mt-1 text-gray-400">
        Actualment no hi ha comandes a la cantina
      </p>
    </div>

    <div v-else class="orders-container">
      <!-- Panel de Comandes -->
      <div class="orders-panel">
        <!-- NOVES COMANDES -->
        <div class="order-section">
          <div
            class="order-section-header"
            @click="toggleSection('new')"
            :class="{ active: openSection === 'new' }"
          >
            <h3>
              <span class="category-icon">🛒</span>
              Noves Comandes
              <span v-if="newOrders.length > 0" class="category-count">{{
                newOrders.length
              }}</span>
            </h3>
            <span class="section-arrow">{{
              openSection === "new" ? "▼" : "▶"
            }}</span>
          </div>
          <div v-show="openSection === 'new'" class="order-content">
            <div v-if="newOrders.length > 0" class="order-list">
              <div
                v-for="order in newOrders"
                :key="order.id"
                class="order-item"
              >
                <div class="order-info">
                  <div class="order-customer">
                    <img
                      :src="getUserAvatar(order.chat)"
                      :alt="order.customerName"
                      class="customer-avatar"
                      onerror="this.src='/img/default-avatar.png'"
                    />
                    <div>
                      <h4>{{ order.customerName }}</h4>
                      <p class="order-time">
                        {{ formatTimeAgo(order.timestamp) }}
                      </p>
                    </div>
                  </div>
                  <div class="order-summary">
                    <p class="order-products">
                      {{ formatOrderSummary(order) }}
                    </p>
                  </div>
                </div>
                <div class="order-actions">
                  <button class="view-chat-btn" @click="openChat(order.chat)">
                    Veure Xat
                  </button>
                  <button
                    class="mark-preparing-btn"
                    @click="markAsPreparing(order.id)"
                  >
                    Preparar
                  </button>
                </div>
              </div>
            </div>
            <p v-else class="empty-category">No hi ha comandes noves</p>
          </div>
        </div>

        <!-- EN PREPARACIÓ -->
        <div class="order-section">
          <div
            class="order-section-header"
            @click="toggleSection('preparing')"
            :class="{ active: openSection === 'preparing' }"
          >
            <h3>
              <span class="category-icon">👨‍🍳</span>
              En Preparació
              <span v-if="preparingOrders.length > 0" class="category-count">{{
                preparingOrders.length
              }}</span>
            </h3>
            <span class="section-arrow">{{
              openSection === "preparing" ? "▼" : "▶"
            }}</span>
          </div>
          <div v-show="openSection === 'preparing'" class="order-content">
            <div v-if="preparingOrders.length > 0" class="order-list">
              <div
                v-for="order in preparingOrders"
                :key="order.id"
                class="order-item"
              >
                <div class="order-info">
                  <div class="order-customer">
                    <img
                      :src="getUserAvatar(order.chat)"
                      :alt="order.customerName"
                      class="customer-avatar"
                      onerror="this.src='/img/default-avatar.png'"
                    />
                    <div>
                      <h4>{{ order.customerName }}</h4>
                      <p class="order-time">
                        {{ formatTimeAgo(order.timestamp) }}
                      </p>
                    </div>
                  </div>
                  <div class="order-summary">
                    <p class="order-products">
                      {{ formatOrderSummary(order) }}
                    </p>
                  </div>
                </div>
                <div class="order-actions">
                  <button class="view-chat-btn" @click="openChat(order.chat)">
                    Veure Xat
                  </button>
                  <button class="mark-ready-btn" @click="markAsReady(order.id)">
                    Llesta per a recollir
                  </button>
                </div>
              </div>
            </div>
            <p v-else class="empty-category">No hi ha comandes en preparació</p>
          </div>
        </div>

        <!-- LLESTES PER A RECOLLIR -->
        <div class="order-section">
          <div
            class="order-section-header"
            @click="toggleSection('ready')"
            :class="{ active: openSection === 'ready' }"
          >
            <h3>
              <span class="category-icon">✅</span>
              Llestes per a recollir
              <span v-if="readyOrders.length > 0" class="category-count">{{
                readyOrders.length
              }}</span>
            </h3>
            <span class="section-arrow">{{
              openSection === "ready" ? "▼" : "▶"
            }}</span>
          </div>
          <div v-show="openSection === 'ready'" class="order-content">
            <div v-if="readyOrders.length > 0" class="order-list">
              <div
                v-for="order in readyOrders"
                :key="order.id"
                class="order-item"
              >
                <div class="order-info">
                  <div class="order-customer">
                    <img
                      :src="getUserAvatar(order.chat)"
                      :alt="order.customerName"
                      class="customer-avatar"
                      onerror="this.src='/img/default-avatar.png'"
                    />
                    <div>
                      <h4>{{ order.customerName }}</h4>
                      <p class="order-time">
                        {{ formatTimeAgo(order.timestamp) }}
                      </p>
                      <p class="removal-timer" v-if="order.removalTime">
                        S'eliminarà en
                        {{ formatRemovalTime(order.removalTime) }}
                      </p>
                    </div>
                  </div>
                  <div class="order-summary">
                    <p class="order-products">
                      {{ formatOrderSummary(order) }}
                    </p>
                  </div>
                </div>
                <div class="order-actions">
                  <button class="view-chat-btn" @click="openChat(order.chat)">
                    Veure Xat
                  </button>
                </div>
              </div>
            </div>
            <p v-else class="empty-category">
              No hi ha comandes llestes per a recollir
            </p>
          </div>
        </div>
      </div>
    </div>
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

// Nuevas variables para sistema de pedidos
const ordersMap = ref({}); // Mapa para almacenar los pedidos por ID de chat
const removalTimers = {}; // Mapa para almacenar los temporizadores

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

    // Actualizar la lista principal de usuarios
    users.value = usersResponse;

    // Actualizar la caché de usuarios con los datos más recientes
    if (Array.isArray(usersResponse)) {
      usersResponse.forEach((user) => {
        usersCache[user.id] = {
          name: user.name || user.username,
          profile: user.profile,
          typeUsersId: user.typeUsers_id,
          updating: false,
        };
      });
    }

    // Obtener todos los chats
    let chatsList = [];
    try {
      // Intentar obtener los chats específicos del usuario cantina
      chatsList = await chatManager.getChatsByUser(currentUserId.value);
      console.log("chatsList", chatsList);
      console.log("currentUserId.value", currentUserId.value);
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

  // Primero verificar en la caché de usuarios
  if (usersCache[otherUserId] && usersCache[otherUserId].name) {
    return usersCache[otherUserId].name;
  }

  // Buscar el usuario en la lista de usuarios
  const user = users.value.find((u) => u.id === otherUserId);

  // Si encontramos el usuario, actualizar la caché y devolver el nombre
  if (user) {
    const userName = user.name || user.username || `Profesor ${otherUserId}`;
    // Actualizar la caché
    usersCache[otherUserId] = {
      ...usersCache[otherUserId],
      name: userName,
      profile: user.profile,
      typeUsersId: user.typeUsers_id,
    };
    return userName;
  }

  // Si no encontramos al usuario, programar una actualización asíncrona
  // y devolver un valor temporal mientras tanto
  // updateUserInfoAsync(otherUserId);
  return `Profesor ${otherUserId}`;
};

// Obtener el avatar del usuario
const getUserAvatar = (chat) => {
  if (!chat || !chat.teachers) return "/img/default-avatar.png";

  const otherUserId = chat.teachers.find(
    (teacherId) => teacherId !== parseInt(currentUserId.value)
  );

  if (!otherUserId) return "/img/default-avatar.png";

  // Usar caché para reducir solicitudes
  if (usersCache[otherUserId] && usersCache[otherUserId].profile) {
    return usersCache[otherUserId].profile;
  }

  const user = users.value.find((u) => u.id === otherUserId);
  if (user && user.profile) {
    // Guardar en caché
    usersCache[otherUserId] = {
      ...usersCache[otherUserId],
      profile: user.profile,
    };
    return user.profile;
  }

  return "/img/default-avatar.png";
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

    // Determinar si recibimos un objeto de chat o un ID
    let chatId;
    let chatObj;

    if (typeof chat === "string") {
      // Si es un string, asumimos que es un ID
      chatId = chat;
      chatObj = chats.value.find((c) => c._id === chatId);
    } else if (chat && chat._id) {
      // Si tiene _id, es un objeto de chat directo
      chatId = chat._id;
      chatObj = chat;
    } else if (chat && chat.chat && chat.chat._id) {
      // Si tiene chat._id, es un objeto de pedido
      chatId = chat.chat._id;
      chatObj = chat.chat;
    } else {
      console.error("Formato de chat no reconocido:", chat);
      throw new Error("Formato de chat no reconocido");
    }

    if (!chatObj) {
      console.error(`Chat con ID ${chatId} no encontrado`);
      throw new Error(`Chat no encontrado: ${chatId}`);
    }

    activeChat.value = chatId;
    chatName.value = getUserName(chatObj);

    // Cargar los mensajes del chat
    await loadChatMessages(chatId);

    // Marcar mensajes como leídos
    const otherUserId = getUserId(chatObj);
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

    // Actualizar el estado del pedido según el mensaje
    if (message.includes("Comanda rebuda")) {
      // Marcar como "en preparación"
      appStore.setOrderAsPreparing(activeChat.value);
      console.log(`Pedido ${activeChat.value} marcado como "en preparación"`);
      refreshChatCategories();
    } else if (message.includes("llesta per a recollir")) {
      // Marcar como "listo"
      appStore.setOrderAsReady(activeChat.value);
      console.log(`Pedido ${activeChat.value} marcado como "listo"`);
      refreshChatCategories();
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

// Cargar y enviar el menú disponible
const sendMenuResponse = async () => {
  try {
    menuLoading.value = true;

    // Si ya tenemos el menú cargado, lo usamos, sino lo cargamos
    if (menuItems.value.length === 0) {
      const items = await getAllEnabledCanteenItems();
      menuItems.value = items || [];
    }

    // Formatear el mensaje con los ítems del menú
    let menuMessage = "🍽️ *MENÚ DISPONIBLE* 🍽️\n\n";

    if (menuItems.value.length === 0) {
      menuMessage += "No hay productos disponibles en este momento.";
    } else {
      menuItems.value.forEach((item) => {
        const price = Number(item.product_price).toFixed(2);
        menuMessage += `• ${item.product_name} - ${price} €\n`;
      });
    }

    // Enviar el mensaje formateado
    await sendQuickResponse(menuMessage);
  } catch (err) {
    console.error("Error al cargar el menú:", err);
  } finally {
    menuLoading.value = false;
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

      try {
        // Extraer información relevante del mensaje según el formato
        let messageInfo = {
          chatId: null,
          userId: null,
          userName: null,
          message: null,
          timestamp: null,
          messageId: null,
        };

        // Manejar diferentes formatos de datos que pueden venir del servidor
        if (data.chatId && data.userId && data.message) {
          // Formato simple
          messageInfo = {
            chatId: data.chatId,
            userId: data.userId,
            userName: data.userName || "Usuario",
            message: data.message,
            timestamp: data.timestamp || new Date(),
            messageId: data._id || Date.now().toString(),
          };
        } else if (
          data.interaction &&
          typeof data.interaction === "object" &&
          !Array.isArray(data.interaction)
        ) {
          // Objeto de interacción individual
          messageInfo = {
            chatId: data.chatId || data._id,
            userId: data.interaction.teacherId,
            message: data.interaction.message,
            timestamp: data.interaction.date || new Date(),
            messageId: data.interaction._id || Date.now().toString(),
          };
        } else if (
          data._id &&
          data.teachers &&
          data.interaction &&
          Array.isArray(data.interaction) &&
          data.interaction.length > 0
        ) {
          // Objeto de chat completo con array de interacciones
          const lastMsg = data.interaction[data.interaction.length - 1];
          messageInfo = {
            chatId: data._id,
            userId: lastMsg.teacherId,
            message: lastMsg.message,
            timestamp: lastMsg.date || new Date(),
            messageId: lastMsg._id || Date.now().toString(),
          };
        }

        // Si no se pudo extraer la información mínima necesaria, salir
        if (!messageInfo.chatId || !messageInfo.message) {
          console.error("❌ Formato de mensaje no reconocido:", data);
          return;
        }

        // Asegurarnos de tener la información de usuarios actualizada
        try {
          // Verificar si el usuario existe en la lista actual
          const userId = messageInfo.userId;
          const userExists = users.value.some((u) => u.id === parseInt(userId));

          // Si no existe, actualizar la lista de usuarios
          if (!userExists) {
            console.log("Actualizando información de usuarios...");
            const updatedUsers = await getAllUsers();
            if (updatedUsers && updatedUsers.length > 0) {
              users.value = updatedUsers;
            }
          }
        } catch (err) {
          console.error("Error al actualizar información de usuarios:", err);
        }

        // Detectar si es un pedido y el mensaje no es del usuario cantina
        if (messageInfo.userId.toString() !== currentUserId.value.toString()) {
          // Buscar el remitente para mostrar su nombre
          let senderName = "Usuario";
          const otherUserId = messageInfo.userId;
          const otherUser = users.value.find(
            (u) => u.id === parseInt(otherUserId)
          );
          if (otherUser) {
            senderName =
              otherUser.name || otherUser.username || `Usuario ${otherUserId}`;

            // Actualizar caché de usuarios
            usersCache[otherUserId] = {
              name: otherUser.name || otherUser.username,
              profile: otherUser.profile,
              typeUsersId: otherUser.typeUsers_id,
            };
          }

          // Detectar si es un pedido por su contenido
          if (
            messageInfo.message.includes("🛒") ||
            messageInfo.message.includes("Nuevo Pedido") ||
            messageInfo.message.includes("Total:") ||
            (messageInfo.message.includes("Pedido") &&
              messageInfo.message.includes("€"))
          ) {
            // Obtener el estado actual del chat
            const currentStatus = appStore.getOrderStatus(messageInfo.chatId);
            console.log(
              `Estado actual del chat ${messageInfo.chatId}: ${currentStatus}`
            );

            // Si ya existe en otra categoría, registrar el cambio
            if (currentStatus && currentStatus !== "new") {
              console.log(
                `⚠️ Chat ${messageInfo.chatId} movido de "${currentStatus}" a "new"`
              );
            }

            // SIEMPRE marcar el chat como pedido nuevo cuando llega un nuevo mensaje de pedido
            // Esto sobreescribe cualquier estado anterior (como "ready")
            appStore.setOrderAsNew(messageInfo.chatId);
            console.log(
              `Nuevo pedido detectado en chat ${messageInfo.chatId} - Actualizado a estado "new"`
            );

            // Actualizar el sistema de órdenes
            setTimeout(() => {
              processChatsIntoOrders();
            }, 200);

            // Forzar actualización de listas computadas y refrescar categorías
            refreshChatCategories();

            // Mostrar notificación de nuevo pedido
            showOrderNotification(senderName);
          }
        }

        // Si estamos viendo este chat, actualizar los mensajes en tiempo real
        if (activeChat.value === messageInfo.chatId) {
          // Verificar si el mensaje ya existe para evitar duplicados
          const messageExists = messages.value.some(
            (m) =>
              m.id === messageInfo.messageId ||
              (m.message === messageInfo.message &&
                m.userId === messageInfo.userId.toString() &&
                Math.abs(
                  new Date(m.timestamp) - new Date(messageInfo.timestamp)
                ) < 5000)
          );

          if (!messageExists) {
            // Buscar el remitente para mostrar su nombre
            let senderName = "Usuario";
            if (
              messageInfo.userId.toString() === currentUserId.value.toString()
            ) {
              senderName = currentUserName.value;
            } else {
              // Buscar el otro usuario en el chat
              const otherUserId = messageInfo.userId;
              // Primero intentar buscar en la caché
              if (usersCache[otherUserId] && usersCache[otherUserId].name) {
                senderName = usersCache[otherUserId].name;
              } else {
                // Si no está en caché, buscarlo en la lista de usuarios
                const otherUser = users.value.find(
                  (u) => u.id === parseInt(otherUserId)
                );
                if (otherUser) {
                  senderName =
                    otherUser.name ||
                    otherUser.username ||
                    `Usuario ${otherUserId}`;

                  // Actualizar caché para futuras referencias
                  usersCache[otherUserId] = {
                    name: senderName,
                    profile: otherUser.profile,
                    typeUsersId: otherUser.typeUsers_id,
                  };
                }
              }
            }

            // Añadir el nuevo mensaje a la lista actual
            const newMessage = {
              id: messageInfo.messageId,
              userId: messageInfo.userId.toString(),
              userName: messageInfo.userName || senderName,
              message: messageInfo.message,
              timestamp: new Date(messageInfo.timestamp),
            };

            messages.value.push(newMessage);

            // Ordenar mensajes por fecha (por si acaso)
            messages.value.sort(
              (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
            );

            // Hacer scroll al final
            await nextTick();
            scrollToBottom();

            console.log("✅ Mensaje añadido al chat activo");
          }
        } else {
          // Si no estamos en este chat, buscar el chat en la lista y actualizar su último mensaje
          const chatIndex = chats.value.findIndex(
            (chat) => chat._id === messageInfo.chatId
          );

          if (chatIndex !== -1) {
            // Marcar como no leído
            const otherUserId = getUserId(chats.value[chatIndex]);
            if (otherUserId) {
              hasNewMessages.value[otherUserId] = true;
            }

            // Actualizar último mensaje en la lista de chats
            if (
              chats.value[chatIndex].interaction &&
              Array.isArray(chats.value[chatIndex].interaction)
            ) {
              // Verificar si este mensaje ya está en el array de interacciones
              const msgExists = chats.value[chatIndex].interaction.some(
                (msg) =>
                  msg._id === messageInfo.messageId ||
                  (msg.message === messageInfo.message &&
                    msg.teacherId === messageInfo.userId.toString() &&
                    Math.abs(
                      new Date(msg.date) - new Date(messageInfo.timestamp)
                    ) < 5000)
              );

              if (!msgExists) {
                // Añadir el mensaje a las interacciones del chat
                chats.value[chatIndex].interaction.push({
                  _id: messageInfo.messageId,
                  teacherId: messageInfo.userId.toString(),
                  message: messageInfo.message,
                  date: messageInfo.timestamp,
                });

                console.log(
                  "✅ Mensaje añadido a la lista de interacciones del chat"
                );
              }
            }

            // Forzar actualización reactiva del array de chats
            chats.value = [...chats.value];
          } else {
            // Si no existe el chat en nuestra lista, forzar actualización
            console.log(
              "⚠️ Chat no encontrado en la lista actual, actualizando..."
            );
            await forceRefreshChats();
          }
        }

        // Mostrar notificación si el mensaje no es propio
        if (messageInfo.userId.toString() !== currentUserId.value.toString()) {
          // Buscar nombre del remitente
          let senderName = "Usuario";
          const otherUserId = messageInfo.userId;

          // Primero intentar buscar en la caché
          if (usersCache[otherUserId] && usersCache[otherUserId].name) {
            senderName = usersCache[otherUserId].name;
          } else {
            // Si no está en caché, buscarlo en la lista de usuarios
            const otherUser = users.value.find(
              (u) => u.id === parseInt(otherUserId)
            );
            if (otherUser) {
              senderName =
                otherUser.name ||
                otherUser.username ||
                `Usuario ${otherUserId}`;

              // Actualizar caché para futuras referencias
              usersCache[otherUserId] = {
                name: senderName,
                profile: otherUser.profile,
                typeUsersId: otherUser.typeUsers_id,
              };
            }
          }

          showNotification(senderName, messageInfo.message);
        }
      } catch (error) {
        console.error("❌ Error al procesar mensaje nuevo:", error);
      }
    });

    // Escuchar cuando se crea un nuevo chat con cantina
    socket.value.on("new_chat_for_canteen", async (data) => {
      console.log("🆕 Notificación de nuevo chat para cantina:", data);

      // Forzar actualización de la lista de chats
      await forceRefreshChats();

      // Mostrar notificación visual
      showNotification("Nuevo chat", "Se ha creado un nuevo chat");
    });

    // Escuchar cualquier evento de nuevo chat (respaldo)
    socket.value.on("new_chat_created", async (data) => {
      console.log("📝 Notificación general de nuevo chat:", data);
      await forceRefreshChats();
    });

    // Escuchar el evento de primer mensaje en un chat (respaldo)
    socket.value.on("chat_first_message", async (data) => {
      console.log("🔔 Notificación de primer mensaje en chat:", data);
      await forceRefreshChats();
    });

    // Manejar reconexiones
    socket.value.on("reconnect", () => {
      console.log("🔄 Reconectado al servidor de chat");

      // Re-suscribirse a todos los chats al reconectar
      chats.value.forEach((chat) => {
        socket.value.emit("join_chat", {
          chatId: chat._id,
          userId: currentUserId.value,
          userName: currentUserName.value,
        });
      });

      // Re-suscribirse a las notificaciones de cantina
      socket.value.emit("join_canteen", {
        canteenId: currentUserId.value,
      });

      // Actualizar el chat activo si estamos en uno
      if (activeChat.value) {
        refreshActiveChat();
      }
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

// Función para actualizar el chat activo con la última información
let activeChatInterval; // Variable para el intervalo
const refreshActiveChat = async () => {
  if (!activeChat.value) return;

  try {
    // Obtenemos la última versión del chat desde el servidor
    const chatData = await chatManager.getChatById(activeChat.value);

    if (!chatData || !chatData.interaction) {
      console.warn("No se pudo actualizar el chat activo: datos incompletos");
      return;
    }

    // Verificar si hay nuevos mensajes que no estamos mostrando
    if (chatData.interaction.length > messages.value.length) {
      console.log(
        `🔄 Actualizando chat: ${
          chatData.interaction.length - messages.value.length
        } mensajes nuevos`
      );

      // Convertir los nuevos mensajes al formato esperado
      const updatedMessages = chatData.interaction.map((msg) => {
        const isOwnMessage = msg.teacherId === currentUserId.value.toString();
        const otherUserId = getUserId(chatData);
        const otherUser = users.value.find((u) => u.id === otherUserId);

        // Asegurarnos que se use el nombre de usuario, no el tipo
        let userName = isOwnMessage ? currentUserName.value : null;
        if (!userName && otherUser) {
          userName =
            otherUser.name || otherUser.username || `Usuario ${otherUserId}`;
        } else if (!userName) {
          userName = `Usuario ${msg.teacherId}`;
        }

        return {
          id: msg._id,
          userId: msg.teacherId,
          userName: userName,
          message: msg.message,
          timestamp: new Date(msg.date),
        };
      });

      // Buscar mensajes que no estén ya en nuestra lista
      const newMessages = updatedMessages.filter(
        (newMsg) =>
          !messages.value.some(
            (existingMsg) =>
              existingMsg.id === newMsg.id ||
              (existingMsg.message === newMsg.message &&
                existingMsg.userId === newMsg.userId &&
                Math.abs(
                  new Date(existingMsg.timestamp) - new Date(newMsg.timestamp)
                ) < 5000)
          )
      );

      // Si hay mensajes nuevos, añadirlos y hacer scroll
      if (newMessages.length > 0) {
        messages.value = [...messages.value, ...newMessages];

        // Ordenar mensajes por fecha
        messages.value.sort(
          (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
        );

        // Hacer scroll al final
        await nextTick();
        scrollToBottom();

        console.log(
          `✅ ${newMessages.length} mensajes nuevos añadidos al chat activo`
        );
      }
    }
  } catch (error) {
    console.error("Error al actualizar chat activo:", error);
  }
};

// Función específica para forzar la actualización de la lista de chats
const forceRefreshChats = async () => {
  console.log("🔄 Forzando actualización de lista de chats...");
  try {
    // Actualizar usuarios primero para tener nombres actualizados
    const updatedUsers = await getAllUsers();
    if (Array.isArray(updatedUsers) && updatedUsers.length > 0) {
      users.value = updatedUsers;

      // Actualizar caché de usuarios
      updatedUsers.forEach((user) => {
        usersCache[user.id] = {
          name: user.name || user.username,
          profile: user.profile,
          typeUsersId: user.typeUsers_id,
          updating: false,
        };
      });
    }

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

    // Asegurarse de que las categorías se actualicen correctamente
    refreshChatCategories();
  } catch (error) {
    console.error("❌ Error al actualizar lista de chats:", error);
  }
};

// Nueva función para refrescar las categorías de chat sin recargar todos los datos
const refreshChatCategories = () => {
  console.log("🔄 Actualizando categorías de pedidos...");

  // Comprobar y corregir posibles inconsistencias en estados de pedidos
  const fixedCount = appStore.checkOrderStatusConsistency();
  if (fixedCount > 0) {
    console.log(
      `✅ Se corrigieron ${fixedCount} inconsistencias en estados de pedidos`
    );
  }

  // Ejecutar procesamiento con un retraso para evitar colisiones con otras actualizaciones
  setTimeout(() => {
    try {
      // Procesar sin actualizar la UI directamente
      processChatsIntoOrders();

      // Log detallado del estado de los pedidos
      console.log("📊 Distribución actual de pedidos por categoría:");

      // Evitar dependencias del objeto reactivo directamente para el logging
      const newOrdersCount = Object.values(ordersMap.value).filter(
        (order) => order.status === "new" || !order.status
      ).length;

      const preparingOrdersCount = Object.values(ordersMap.value).filter(
        (order) => order.status === "preparing"
      ).length;

      const readyOrdersCount = Object.values(ordersMap.value).filter(
        (order) => order.status === "ready"
      ).length;

      // Mostrar resumen de pedidos nuevos
      console.log(`  ⚡ NUEVOS PEDIDOS (${newOrdersCount})`);

      // Mostrar resumen de pedidos en preparación
      console.log(`  👨‍🍳 EN PREPARACIÓN (${preparingOrdersCount})`);

      // Mostrar resumen de pedidos listos para recoger
      console.log(`  ✅ LISTOS PARA RECOGER (${readyOrdersCount})`);
    } catch (error) {
      console.error("Error al refrescar categorías:", error);
    }
  }, 50);
};

// Control de notificaciones recientes para evitar duplicados
const recentNotifications = {
  messages: new Set(),
  clearTimer: null,

  // Agregar un mensaje a la lista de notificaciones recientes
  add(title, message) {
    const signature = `${title}_${message.substring(0, 20)}`;

    // Si ya existe esta notificación, no mostrar de nuevo
    if (this.messages.has(signature)) {
      return false;
    }

    // Agregar a la lista de recientes
    this.messages.add(signature);

    // Configurar limpieza automática después de 5 segundos
    if (this.clearTimer) {
      clearTimeout(this.clearTimer);
    }

    this.clearTimer = setTimeout(() => {
      this.messages.clear();
      this.clearTimer = null;
    }, 5000);

    return true;
  },
};

// Función auxiliar para mostrar notificación
const showNotification = (title, message) => {
  // Usar el gestor global de notificaciones si existe
  if (window.notificationManager) {
    window.notificationManager.notify(title, message);
    return;
  }

  // Método de respaldo si no existe el gestor global
  // Evitar notificaciones duplicadas
  if (!recentNotifications.add(title, message)) {
    console.log("Evitando notificación duplicada:", title);
    return;
  }

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

// Configurar un intervalo para verificar nuevos chats y mensajes periódicamente como respaldo
let refreshInterval;
let activeRefreshInterval;
let userRefreshInterval;
let orderProcessInterval;
let usersCache = {};

// Variable para controlar las secciones acordeón
const openSection = ref("new"); // Por defecto, mostrar los nuevos pedidos

// Método para cambiar la sección visualizada
const toggleSection = (section) => {
  openSection.value = openSection.value === section ? null : section;
};

// Función para procesar los chats y convertirlos en pedidos
const processChatsIntoOrders = () => {
  console.log("Procesando chats en pedidos...");
  const existingOrderIds = Object.keys(ordersMap.value);

  // Crear una copia temporal para acumular cambios
  const tempOrdersMap = {};

  // Copiar los pedidos existentes al mapa temporal
  Object.keys(ordersMap.value).forEach((id) => {
    tempOrdersMap[id] = { ...ordersMap.value[id] };
  });

  // Recorrer todos los chats y crear/actualizar pedidos en el mapa temporal
  chats.value.forEach((chat) => {
    if (!chat.interaction || chat.interaction.length === 0) return;

    // Buscar mensajes de pedido del cliente (no de la cantina)
    const orderMessages = chat.interaction.filter((msg) => {
      if (msg.teacherId === currentUserId.value.toString()) return false;

      return (
        msg.message.includes("🛒") ||
        msg.message.includes("Pedido") ||
        msg.message.includes("Total:") ||
        (msg.message.includes("Pedido") && msg.message.includes("€"))
      );
    });

    if (orderMessages.length === 0) return;

    // Obtener el último mensaje de pedido
    const latestOrderMsg = orderMessages.sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    )[0];

    // Obtener información del cliente
    const customerId = chat.teachers.find(
      (id) => id !== parseInt(currentUserId.value)
    );
    const customerName = getUserName(chat);

    // Verificar si ya existe un pedido para este chat
    if (tempOrdersMap[chat._id]) {
      // Actualizar el pedido existente
      tempOrdersMap[chat._id] = {
        ...tempOrdersMap[chat._id],
        status: appStore.getOrderStatus(chat._id),
        timestamp: new Date(latestOrderMsg.date),
        message: latestOrderMsg.message,
        items: extractOrderItems(latestOrderMsg.message),
        total: extractTotal(latestOrderMsg.message),
      };
    } else {
      // Crear un nuevo pedido
      tempOrdersMap[chat._id] = {
        id: chat._id,
        chat: chat,
        customerId: customerId,
        customerName: customerName,
        status: appStore.getOrderStatus(chat._id),
        timestamp: new Date(latestOrderMsg.date),
        message: latestOrderMsg.message,
        items: extractOrderItems(latestOrderMsg.message),
        total: extractTotal(latestOrderMsg.message),
        messageId: latestOrderMsg._id,
      };
    }
  });

  // Verificar si hay pedidos que ya no están en los chats actuales
  existingOrderIds.forEach((orderId) => {
    const stillExists = chats.value.some((chat) => chat._id === orderId);
    if (!stillExists) {
      // Eliminar el pedido del mapa temporal
      delete tempOrdersMap[orderId];

      // Limpiar cualquier temporizador asociado
      if (removalTimers[orderId]) {
        clearTimeout(removalTimers[orderId]);
        delete removalTimers[orderId];
      }
    }
  });

  // Configurar temporizadores para pedidos marcados como "ready"
  Object.keys(tempOrdersMap).forEach((chatId) => {
    if (
      tempOrdersMap[chatId].status === "ready" &&
      !tempOrdersMap[chatId].removalTime &&
      !removalTimers[chatId]
    ) {
      // Tenemos que actualizar primero el mapa global para que setupRemovalTimer funcione
      ordersMap.value[chatId] = { ...tempOrdersMap[chatId] };
      setupRemovalTimer(chatId);
      // Sincronizar los cambios de vuelta al mapa temporal
      tempOrdersMap[chatId] = { ...ordersMap.value[chatId] };
    }
  });

  // Actualizar el mapa de pedidos con todos los cambios de una sola vez
  // para evitar múltiples actualizaciones reactivas
  ordersMap.value = tempOrdersMap;

  console.log(
    `Procesamiento completado: ${
      Object.keys(tempOrdersMap).length
    } pedidos activos`
  );
};

// Extraer ítems de un mensaje de pedido
const extractOrderItems = (message) => {
  const items = [];
  const lines = message.split("\n");

  for (const line of lines) {
    if (line.includes("•") || line.includes("-")) {
      const item = line.replace(/•|-/g, "").trim();
      if (item && !item.includes("Total:")) {
        items.push(item.split(" - ")[0]);
      }
    }
  }

  return items.length > 0 ? items : ["Producto no especificado"];
};

// Extraer el total de un mensaje de pedido
const extractTotal = (message) => {
  if (!message) return "?";

  // Buscar un patrón de precio total
  const totalMatch = message.match(/Total:\s*(\d+[\.,]\d+)/);
  if (totalMatch && totalMatch[1]) {
    return totalMatch[1].replace(",", ".");
  }

  // Intentar encontrar cualquier valor con formato de precio
  const priceMatch = message.match(/(\d+[\.,]\d+)\s*€/);
  return priceMatch && priceMatch[1] ? priceMatch[1].replace(",", ".") : "?";
};

// Formatear el resumen del pedido
const formatOrderSummary = (order) => {
  if (!order.items || order.items.length === 0) {
    return "Pedido sin detalles";
  }

  const displayItems = order.items.slice(0, 2);
  const remaining = order.items.length - 2;
  const summary = displayItems.join(", ");
  return `${summary}${remaining > 0 ? ` y ${remaining} más` : ""} - Total: ${
    order.total || "?"
  }€`;
};

// Configurar temporizador para eliminar automáticamente pedidos listos
const setupRemovalTimer = (orderId) => {
  // Tiempo de espera: entre 2-3 minutos (aleatorio para evitar eliminación masiva)
  const waitTime = 120000 + Math.random() * 60000; // 2-3 minutos en ms
  const removalTime = new Date(Date.now() + waitTime);

  // Guardar la hora de eliminación en el pedido para mostrarla en la UI
  if (ordersMap.value[orderId]) {
    ordersMap.value[orderId].removalTime = removalTime;
  }

  console.log(
    `⏱️ Pedido ${orderId} programado para eliminarse en ${Math.round(
      waitTime / 1000
    )} segundos`
  );

  // Configurar el temporizador
  removalTimers[orderId] = setTimeout(() => {
    console.log(
      `⌛ Tiempo cumplido para pedido ${orderId}, comprobando si debe eliminarse...`
    );

    // Verificar si el pedido aún existe y sigue en estado "ready"
    if (
      ordersMap.value[orderId] &&
      ordersMap.value[orderId].status === "ready" &&
      !newOrderDetectedSince(orderId, waitTime)
    ) {
      console.log(
        `🗑️ Eliminando pedido ${orderId} de la lista de pedidos listos`
      );
      delete ordersMap.value[orderId];
      delete removalTimers[orderId];

      // Forzar actualización de la UI
      ordersMap.value = { ...ordersMap.value };
    } else {
      console.log(
        `⚠️ El pedido ${orderId} no cumple las condiciones para ser eliminado automáticamente`
      );
      // Limpiar el temporizador pero mantener el pedido si cambió de estado o recibió nuevo pedido
      delete removalTimers[orderId];

      // Quitar la marca de tiempo de eliminación
      if (ordersMap.value[orderId]) {
        delete ordersMap.value[orderId].removalTime;
      }
    }
  }, waitTime);
};

// Verificar si se ha detectado un nuevo pedido desde hace X tiempo
const newOrderDetectedSince = (orderId, timeWindow) => {
  if (!ordersMap.value[orderId]) return false;

  // Obtener el chat asociado al pedido
  const chatId = orderId;
  const chat = chats.value.find((c) => c._id === chatId);

  if (!chat || !chat.interaction) return false;

  // Buscar mensajes de pedido recientes
  const now = Date.now();
  const thresholdTime = now - timeWindow;

  const recentOrderMessages = chat.interaction.filter((msg) => {
    // Solo considerar mensajes del cliente
    if (msg.teacherId === currentUserId.value.toString()) return false;

    // Verificar si es un mensaje de pedido
    const isOrderMessage =
      msg.message.includes("🛒") ||
      msg.message.includes("Pedido") ||
      msg.message.includes("Total:") ||
      (msg.message.includes("Pedido") && msg.message.includes("€"));

    // Verificar si es reciente
    const msgTime = new Date(msg.date).getTime();
    const isRecent = msgTime > thresholdTime;

    return isOrderMessage && isRecent;
  });

  return recentOrderMessages.length > 0;
};

// Formatear el tiempo restante para la eliminación
const formatRemovalTime = (removalTime) => {
  if (!removalTime) return "";

  const now = new Date();
  const timeLeft = new Date(removalTime) - now;

  if (timeLeft <= 0) return "unos momentos";

  const seconds = Math.floor(timeLeft / 1000);
  if (seconds < 60) return `${seconds} segundos`;

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

// Formatear el tiempo transcurrido desde la creación del pedido
const formatTimeAgo = (timestamp) => {
  if (!timestamp) return "";

  const now = new Date();
  const time = new Date(timestamp);
  const diff = now - time;

  // Menos de un minuto
  if (diff < 60000) {
    return "ahora mismo";
  }

  // Menos de una hora
  if (diff < 3600000) {
    const minutes = Math.floor(diff / 60000);
    return `hace ${minutes} min`;
  }

  // Menos de un día
  if (diff < 86400000) {
    const hours = Math.floor(diff / 3600000);
    return `hace ${hours} h`;
  }

  // Más de un día
  const days = Math.floor(diff / 86400000);
  return `hace ${days} días`;
};

// Función para marcar un pedido como "en preparación"
const markAsPreparing = (orderId) => {
  appStore.setOrderAsPreparing(orderId);

  // Limpiar cualquier temporizador si existía
  if (removalTimers[orderId]) {
    clearTimeout(removalTimers[orderId]);
    delete removalTimers[orderId];
  }

  // Actualizar el estado en el mapa de pedidos
  if (ordersMap.value[orderId]) {
    ordersMap.value[orderId].status = "preparing";
    delete ordersMap.value[orderId].removalTime;
  }

  // Enviar mensaje de confirmación automáticamente
  const chat = chats.value.find((c) => c._id === orderId);
  if (chat) {
    sendQuickResponseToChat(chat._id, "✅ Comanda rebuda");
  }

  refreshChatCategories();
};

// Función para marcar un pedido como "listo para recoger"
const markAsReady = (orderId) => {
  appStore.setOrderAsReady(orderId);

  // Actualizar el estado en el mapa de pedidos
  if (ordersMap.value[orderId]) {
    ordersMap.value[orderId].status = "ready";
  }

  // Configurar el temporizador de eliminación automática
  setupRemovalTimer(orderId);

  // Enviar mensaje de confirmación automáticamente
  const chat = chats.value.find((c) => c._id === orderId);
  if (chat) {
    sendQuickResponseToChat(
      chat._id,
      "🚚 La teva comanda esta llesta per a recollir"
    );
  }

  refreshChatCategories();
};

// Función para enviar respuesta rápida a un chat específico sin abrirlo
const sendQuickResponseToChat = async (chatId, message) => {
  try {
    // Enviar el mensaje al servidor
    await chatManager.sendMessage(chatId, currentUserId.value, message);
    console.log(`✅ Mensaje '${message}' enviado al chat ${chatId}`);
  } catch (err) {
    console.error(`❌ Error al enviar mensaje al chat ${chatId}:`, err);
  }
};

// Computar los chats filtrados por estado
const newOrders = computed(() => {
  return Object.values(ordersMap.value)
    .filter((order) => order.status === "new" || !order.status)
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
});

const preparingOrders = computed(() => {
  return Object.values(ordersMap.value)
    .filter((order) => order.status === "preparing")
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
});

const readyOrders = computed(() => {
  return Object.values(ordersMap.value)
    .filter((order) => order.status === "ready")
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
});

// Mostrar una notificación de éxito para nuevos pedidos
const showOrderNotification = (userName) => {
  // Crear notificación del sistema
  if (Notification.permission === "granted") {
    new Notification("¡Nuevo pedido!", {
      body: `Nuevo pedido de: ${userName || "Usuario"}`,
    });
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        new Notification("¡Nuevo pedido!", {
          body: `Nuevo pedido de: ${userName || "Usuario"}`,
        });
      }
    });
  }

  // También crear una notificación visual dentro de la app
  const notification = document.createElement("div");
  notification.classList.add("order-notification");
  notification.innerHTML = `
    <div class="notification-content">
      <span class="notification-icon">🛒</span>
      <div class="notification-text">
        <strong>¡Nueva comanda!</strong>
        <p>De: ${userName || "Usuario"}</p>
      </div>
      <button class="close-notification">×</button>
    </div>
  `;

  // Añadir al DOM
  document.body.appendChild(notification);

  // Añadir evento al botón de cerrar
  notification
    .querySelector(".close-notification")
    .addEventListener("click", () => {
      notification.classList.add("closing");
      setTimeout(() => {
        notification.remove();
      }, 300);
    });

  // Auto-eliminar después de 5 segundos
  setTimeout(() => {
    if (document.body.contains(notification)) {
      notification.classList.add("closing");
      setTimeout(() => {
        if (document.body.contains(notification)) {
          notification.remove();
        }
      }, 300);
    }
  }, 5000);
};

// Inicializar el sistema de pedidos en el montaje del componente
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

  // Inicializar caché de usuarios
  users.value.forEach((user) => {
    usersCache[user.id] = {
      name: user.name || user.username,
      profile: user.profile,
      typeUsersId: user.typeUsers_id,
      updating: false,
    };
  });

  // Conectar al socket para actualizaciones en tiempo real
  connectSocket();

  // Realizar procesamiento inicial de pedidos
  processChatsIntoOrders();

  // Configurar intervalo de respaldo para la lista de chats
  // Aumentamos a 45 segundos para reducir carga
  refreshInterval = setInterval(forceRefreshChats, 45000);

  // Añadir intervalo para mantener la información de usuarios actualizada
  userRefreshInterval = setInterval(async () => {
    try {
      const updatedUsers = await getAllUsers();
      if (Array.isArray(updatedUsers) && updatedUsers.length > 0) {
        users.value = updatedUsers;

        // Actualizar caché de usuarios
        updatedUsers.forEach((user) => {
          usersCache[user.id] = {
            name: user.name || user.username,
            profile: user.profile,
            typeUsersId: user.typeUsers_id,
            updating: false,
          };
        });

        // Forzar actualización de la UI después de actualizar usuarios
        chats.value = [...chats.value];
      }
    } catch (err) {
      console.error("Error al actualizar información de usuarios:", err);
    }
  }, 60000); // Actualizar usuarios cada minuto

  // Intervalo adicional para actualizar los pedidos
  const orderProcessInterval = setInterval(() => {
    processChatsIntoOrders();
  }, 30000); // Actualizar órdenes cada 30 segundos

  // Limpiar todos los intervalos al desmontar
  onUnmounted(() => {
    // Desconectar socket
    if (socket.value) {
      socket.value.disconnect();
      socket.value = null;
    }

    // Limpiar intervalos
    if (refreshInterval) {
      clearInterval(refreshInterval);
    }

    if (activeRefreshInterval) {
      clearInterval(activeRefreshInterval);
    }

    if (userRefreshInterval) {
      clearInterval(userRefreshInterval);
    }

    if (orderProcessInterval) {
      clearInterval(orderProcessInterval);
    }

    // Limpiar todos los temporizadores de eliminación
    Object.keys(removalTimers).forEach((id) => {
      clearTimeout(removalTimers[id]);
    });
  });
});
</script>

<style scoped>
/* Esta clase ya no se usa, sustituida por clases de Tailwind */
.chat-canteen-container {
  display: none;
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
  display: flex;
  align-items: center;
  gap: 10px;
}

/* Estas clases ya no se usan, sustituidas por clases de Tailwind */
.loading,
.error {
  display: none;
}

/* Este estilo ya no se usa, reemplazado por clases de Tailwind */
.empty-list {
  display: none;
}

.user-list {
  list-style: none;
  padding: 0;
  margin: 0 0 10px 0;
  overflow-y: auto;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.user-item {
  display: flex;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid rgba(238, 238, 238, 0.5);
  cursor: pointer;
  transition: background-color 0.2s ease;
  background-color: rgba(255, 255, 255, 0.6);
  border-radius: 8px;
  margin-bottom: 5px;
}

.user-item:hover {
  background-color: rgba(245, 245, 245, 0.8);
  transform: translateX(3px);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
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

/* Estilos para el nuevo diseño basado en pedidos */
.orders-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  flex: 1;
}

.orders-panel {
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex: 1;
}

.order-section {
  border-radius: 8px;
  overflow: hidden;
  background-color: rgba(248, 249, 250, 0.05);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.order-section-header {
  padding: 15px;
  background-color: rgba(248, 249, 250, 0.1);
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background-color 0.2s ease;
  border-radius: 8px;
}

.order-section-header:hover {
  background-color: rgba(248, 249, 250, 0.15);
}

.order-section-header.active {
  border-left: 4px solid #28a745;
}

.order-content {
  max-height: 500px;
  overflow-y: auto;
  padding: 10px;
  background-color: rgba(248, 249, 250, 0.02);
}

.order-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.order-item {
  background-color: rgba(255, 255, 255, 0.05);
  padding: 15px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  transition: transform 0.2s ease, background-color 0.2s ease;
}

.order-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

.order-info {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.order-customer {
  display: flex;
  align-items: center;
  gap: 10px;
}

.customer-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.order-summary {
  margin-left: 50px;
}

.order-time {
  font-size: 12px;
  color: #adb5bd;
}

.removal-timer {
  font-size: 11px;
  color: #ff9800;
  margin-top: 2px;
}

.order-products {
  font-size: 14px;
  color: #e2e2e2;
}

.order-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.view-chat-btn {
  background-color: #3b82f6;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 13px;
  transition: background-color 0.2s ease;
}

.view-chat-btn:hover {
  background-color: #2563eb;
}

.mark-preparing-btn {
  background-color: #f59e0b;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 13px;
  transition: background-color 0.2s ease;
}

.mark-preparing-btn:hover {
  background-color: #d97706;
}

.mark-ready-btn {
  background-color: #10b981;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 13px;
  transition: background-color 0.2s ease;
}

.mark-ready-btn:hover {
  background-color: #059669;
}

.section-arrow {
  font-size: 12px;
  color: #adb5bd;
}

/* Mantener estilos adicionales... */ /* Spinner animation for loading state */
.spinner {
  border: 3px solid rgba(59, 130, 246, 0.2);
  border-radius: 50%;
  border-top: 3px solid rgba(59, 130, 246, 0.8);
  animation: spin 1s linear infinite;
}
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.animate-fade-in {
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style><!-- The empty-list class has been replaced with Tailwind classes for the "no orders" display -->