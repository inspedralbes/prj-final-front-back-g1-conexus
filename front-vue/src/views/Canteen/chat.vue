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

    <div v-else-if="chats.length === 0" class="empty-list">
      <p>No hay chats activos</p>
    </div>

    <div v-else class="chats-container">
      <!-- Acordeón de categorías -->
      <div class="chats-accordion">
        <!-- NUEVOS PEDIDOS -->
        <div class="accordion-section">
          <div
            class="accordion-header"
            @click="toggleSection('new')"
            :class="{ active: openSection === 'new' }"
          >
            <h3>
              <span class="category-icon">🛒</span>
              Noves comandes
              <span v-if="newOrderChats.length > 0" class="category-count">{{
                newOrderChats.length
              }}</span>
            </h3>
            <span class="accordion-arrow">{{
              openSection === "new" ? "▼" : "▶"
            }}</span>
          </div>
          <div v-show="openSection === 'new'" class="accordion-content">
            <ul v-if="newOrderChats.length > 0" class="user-list">
              <li
                v-for="chat in newOrderChats"
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
                </div>
              </li>
            </ul>
            <p v-else class="empty-category">No hay nuevos pedidos</p>
          </div>
        </div>

        <!-- EN PREPARACIÓN -->
        <div class="accordion-section">
          <div
            class="accordion-header"
            @click="toggleSection('preparing')"
            :class="{ active: openSection === 'preparing' }"
          >
            <h3>
              <span class="category-icon">👨‍🍳</span>
              En Preparació
              <span
                v-if="preparingOrderChats.length > 0"
                class="category-count"
                >{{ preparingOrderChats.length }}</span
              >
            </h3>
            <span class="accordion-arrow">{{
              openSection === "preparing" ? "▼" : "▶"
            }}</span>
          </div>
          <div v-show="openSection === 'preparing'" class="accordion-content">
            <ul v-if="preparingOrderChats.length > 0" class="user-list">
              <li
                v-for="chat in preparingOrderChats"
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
                </div>
              </li>
            </ul>
            <p v-else class="empty-category">No hay pedidos en preparación</p>
          </div>
        </div>

        <!-- LISTOS PARA RECOGER -->
        <div class="accordion-section">
          <div
            class="accordion-header"
            @click="toggleSection('ready')"
            :class="{ active: openSection === 'ready' }"
          >
            <h3>
              <span class="category-icon">✅</span>
              Llest per recollir
              <span v-if="readyOrderChats.length > 0" class="category-count">{{
                readyOrderChats.length
              }}</span>
            </h3>
            <span class="accordion-arrow">{{
              openSection === "ready" ? "▼" : "▶"
            }}</span>
          </div>
          <div v-show="openSection === 'ready'" class="accordion-content">
            <ul v-if="readyOrderChats.length > 0" class="user-list">
              <li
                v-for="chat in readyOrderChats"
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
                </div>
              </li>
            </ul>
            <p v-else class="empty-category">
              No hay pedidos listos para recoger
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
import { getAllCanteenItems } from "@/services/communicationsScripts/canteenComManager";

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

    // Actualizar el estado del pedido según el mensaje
    if (message.includes("Comanda rebuda")) {
      // Marcar como "en preparación"
      appStore.setOrderAsPreparing(activeChat.value);
      console.log(`Pedido ${activeChat.value} marcado como "en preparación"`);
    } else if (message.includes("llesta per a recollir")) {
      // Marcar como "listo"
      appStore.setOrderAsReady(activeChat.value);
      console.log(`Pedido ${activeChat.value} marcado como "listo"`);
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
      const items = await getAllCanteenItems();
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
          }

          // Detectar si es un pedido por su contenido
          if (
            messageInfo.message.includes("🛒") ||
            messageInfo.message.includes("Nuevo Pedido") ||
            messageInfo.message.includes("Total:") ||
            (messageInfo.message.includes("Pedido") &&
              messageInfo.message.includes("€"))
          ) {
            // Marcar el chat como pedido nuevo
            appStore.setOrderAsNew(messageInfo.chatId);
            console.log(`Nuevo pedido detectado en chat ${messageInfo.chatId}`);

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
              const otherUser = users.value.find(
                (u) => u.id === parseInt(otherUserId)
              );
              if (otherUser) {
                senderName =
                  otherUser.name ||
                  otherUser.username ||
                  `Usuario ${otherUserId}`;
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
          const otherUser = users.value.find(
            (u) => u.id === parseInt(otherUserId)
          );
          if (otherUser) {
            senderName =
              otherUser.name || otherUser.username || `Usuario ${otherUserId}`;
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

// Configurar un intervalo para verificar nuevos chats y mensajes periódicamente como respaldo
let refreshInterval;
let activeRefreshInterval;
let usersCache = {};

// Variable para controlar las secciones acordeón
const openSection = ref("new"); // Por defecto, mostrar los nuevos pedidos

// Método para cambiar la sección visualizada
const toggleSection = (section) => {
  openSection.value = openSection.value === section ? null : section;
};

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

  // Inicializar caché de usuarios
  users.value.forEach((user) => {
    usersCache[user.id] = {
      name: user.name || user.username,
      profile: user.profile,
      typeUsersId: user.typeUsers_id,
    };
  });

  // Conectar al socket para actualizaciones en tiempo real
  connectSocket();

  // Configurar intervalo de respaldo para la lista de chats
  // Aumentamos a 45 segundos para reducir carga
  refreshInterval = setInterval(forceRefreshChats, 45000);
});

// Watch para gestionar el chat activo
watch(activeChat, (newVal, oldVal) => {
  // Limpiar intervalo anterior si existía
  if (activeRefreshInterval) {
    clearInterval(activeRefreshInterval);
    activeRefreshInterval = null;
  }

  // Si hay un nuevo chat activo, configurar intervalo de actualización
  if (newVal) {
    // Actualizar inicialmente y luego cada 8 segundos (reducido de 3 segundos)
    refreshActiveChat();
    activeRefreshInterval = setInterval(refreshActiveChat, 8000);
  }
});

// Modificar onUnmounted para limpiar los intervalos
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
});

// Computar los chats filtrados por estado
const newOrderChats = computed(() => {
  const newChatsIds = appStore.getCanteenOrdersByStatus("new");
  return chats.value.filter(
    (chat) =>
      newChatsIds.includes(chat._id) || !appStore.canteenOrderStatus[chat._id]
  );
});

const preparingOrderChats = computed(() => {
  const preparingChatsIds = appStore.getCanteenOrdersByStatus("preparing");
  return chats.value.filter((chat) => preparingChatsIds.includes(chat._id));
});

const readyOrderChats = computed(() => {
  const readyChatsIds = appStore.getCanteenOrdersByStatus("ready");
  return chats.value.filter((chat) => readyChatsIds.includes(chat._id));
});

// Mostrar una notificación de éxito para nuevos pedidos
const showOrderNotification = (userName) => {
  // Crear un elemento de notificación
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
</script>

<style scoped>
.chat-canteen-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: transparent;
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

/* Estilos para el acordeón */
.chats-container {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background-color: transparent;
  max-height: calc(100vh - 120px); /* Altura máxima ajustada */
}

.chats-accordion {
  background-color: transparent;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: none;
  display: flex;
  flex-direction: column;
}

.accordion-section {
  border-bottom: 1px solid rgba(233, 236, 239, 0.5);
  background-color: transparent;
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
  flex: 0 0 auto;
}

.accordion-section:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.accordion-header,
.section-header {
  padding: 15px;
  background-color: rgba(248, 249, 250, 0.5);
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background-color 0.2s ease;
  border-radius: 8px;
}

.accordion-header:hover,
.section-header:hover {
  background-color: rgba(233, 236, 239, 0.7);
}

.accordion-header.active,
.section-header.active {
  background-color: rgba(233, 236, 239, 0.7);
  border-left: 4px solid #28a745;
}

.accordion-arrow {
  font-size: 12px;
  color: #6c757d;
}

.section-content {
  max-height: none;
  overflow-y: auto;
  transition: all 0.3s ease;
  background-color: transparent;
  padding: 0 5px;
  flex: 1;
}

/* Ocultar la barra de desplazamiento pero mantener la funcionalidad */
.accordion-content::-webkit-scrollbar,
.section-content::-webkit-scrollbar,
.chat-messages::-webkit-scrollbar,
.user-list::-webkit-scrollbar {
  width: 0;
  height: 0;
  display: none;
}

.accordion-content,
.section-content,
.chat-messages,
.user-list {
  -ms-overflow-style: none; /* IE y Edge */
  scrollbar-width: none; /* Firefox */
}

.category-icon {
  font-size: 20px;
  margin-right: 10px;
}

.category-count {
  background-color: #dc3545;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  margin-left: 8px;
}

.empty-category {
  padding: 20px;
  text-align: center;
  color: #6c757d;
  background-color: rgba(255, 255, 255, 0.6);
  border-radius: 8px;
}

.response-btn.menu-btn {
  background-color: #007bff;
}

.response-btn.menu-btn:hover {
  background-color: #0069d9;
}

.response-btn.menu-btn.loading {
  opacity: 0.7;
  cursor: not-allowed;
  position: relative;
}

.response-btn.menu-btn.loading::after {
  content: "";
  position: absolute;
  width: 16px;
  height: 16px;
  top: 50%;
  right: 15px;
  margin-top: -8px;
  border: 2px solid rgba(255, 255, 255, 0.5);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;
}

/* Estilos para notificaciones */
.order-notification {
  position: fixed;
  top: 20px;
  right: 20px;
  background-color: white;
  border-left: 4px solid #28a745;
  border-radius: 4px;
  padding: 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 9999;
  max-width: 300px;
  transform: translateX(0);
  animation: slideIn 0.3s ease-out;
}

.notification-content {
  display: flex;
  padding: 15px;
  align-items: center;
}

.notification-icon {
  background-color: #ebf9f0;
  color: #28a745;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
  font-size: 20px;
}

.notification-text {
  flex: 1;
}

.notification-text strong {
  display: block;
  color: #212529;
  margin-bottom: 3px;
}

.notification-text p {
  color: #6c757d;
  margin: 0;
  font-size: 14px;
}

.close-notification {
  background: none;
  border: none;
  color: #adb5bd;
  font-size: 18px;
  cursor: pointer;
  padding: 0;
  margin-left: 10px;
  line-height: 1;
}

.close-notification:hover {
  color: #6c757d;
}

.order-notification.closing {
  animation: slideOut 0.3s ease-in forwards;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideOut {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>