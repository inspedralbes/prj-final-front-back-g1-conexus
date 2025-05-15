<template>
  <div class="chat-container">
    <div class="chat-header">
      <button class="back-button" @click="goBack">
        <i class="fas fa-arrow-left"></i> Volver
      </button>
      <h2>{{ chatName }}</h2>
    </div>

    <div class="chat-messages" ref="messagesContainer">
      <div v-if="loading" class="loading-container">
        <p>Cargando mensajes...</p>
      </div>

      <div v-else-if="messages.length === 0" class="empty-chat-message">
        <p>¡Bienvenido al chat!</p>
        <p>Envía un mensaje para comenzar a conversar.</p>
      </div>

      <div
        v-for="(message, index) in messages"
        :key="index"
        class="message"
        :class="{
          'own-message': message.userId.toString() === currentUserId.toString(),
          'other-message':
            message.userId.toString() !== currentUserId.toString(),
          sending: message.sending,
          failed: message.failed,
        }"
      >
        <div class="message-header">
          <span class="user-name">{{ message.userName }}</span>
          <span class="timestamp">{{ formatDate(message.timestamp) }}</span>
        </div>
        <div
          class="message-content"
          v-if="message.hasLinks"
          v-html="formatMessageWithLinks(message)"
        ></div>
        <div class="message-content" v-else>{{ message.message }}</div>

        <!-- Link Previews -->
        <div
          v-if="message.linkPreviews && message.linkPreviews.length > 0"
          class="link-previews"
        >
          <div
            v-for="(preview, previewIndex) in message.linkPreviews"
            :key="previewIndex"
            class="link-preview"
            @click="openLink(preview.url)"
          >
            <div class="preview-content">
              <div v-if="preview.image" class="preview-image">
                <img :src="preview.image" :alt="preview.title || preview.url" />
              </div>
              <div class="preview-text">
                <div class="preview-title">
                  {{ preview.title || "Sin título" }}
                </div>
                <div v-if="preview.description" class="preview-description">
                  {{ truncateText(preview.description, 100) }}
                </div>
                <div class="preview-site">
                  {{ preview.siteName || extractDomain(preview.url) }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="message.sending" class="message-status sending">
          Enviando...
        </div>
        <div
          v-if="message.failed"
          class="message-status failed"
          @click="retryMessage(message, index)"
        >
          Error al enviar - Haz clic para reintentar
        </div>
        <button
          v-if="
            message.userId.toString() === currentUserId.toString() &&
            !message.sending &&
            !message.failed &&
            message.id
          "
          class="delete-message-btn"
          @click="deleteMessage(message)"
          title="Eliminar mensaje"
        >
          <i class="fas fa-trash"></i>
        </button>
      </div>
    </div>

    <div class="typing-indicator" v-if="someoneIsTyping">
      <div class="typing-dots">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>

    <div class="chat-input">
      <!-- Área para mostrar los productos de cantina -->
      <div v-if="hasCantinaItems" class="cantina-order-container">
        <div class="cantina-order-header">
          <h4>🛒 Pedido de Cantina</h4>
          <button
            class="remove-order-btn"
            @click="clearCantinaOrder"
            title="Eliminar pedido"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div class="cantina-order-items">
          <div
            v-for="(item, index) in appStore.cartCantinaItems"
            :key="index"
            class="cantina-order-item"
          >
            <span class="item-quantity">{{ item.quantity }}x</span>
            <span class="item-name">{{ item.product_name }}</span>
            <span class="item-price"
              >{{ formatPrice(item.product_price * item.quantity) }} €</span
            >
          </div>
        </div>
        <div class="cantina-order-total">
          Total: {{ calculateCantinaTotal() }} €
        </div>
      </div>

      <!-- Popup para insertar enlaces -->
      <div v-if="showLinkPopup" class="link-popup">
        <div class="link-popup-content">
          <h4>Insertar enlace</h4>
          <div class="link-input-group">
            <label for="linkUrl">URL del enlace:</label>
            <input
              id="linkUrl"
              v-model="linkUrl"
              placeholder="https://ejemplo.com"
              type="url"
            />
          </div>
          <div class="link-popup-buttons">
            <button @click="insertLink" class="insert-link-btn">
              Insertar
            </button>
            <button @click="showLinkPopup = false" class="cancel-link-btn">
              Cancelar
            </button>
          </div>
        </div>
      </div>

      <!-- Popup para insertar emojis -->
      <div v-if="showEmojiPicker" class="emoji-popup">
        <div class="emoji-popup-content">
          <div class="emoji-categories">
            <button
              v-for="(category, index) in emojiCategories"
              :key="index"
              @click="selectEmojiCategory(category)"
              :class="{ active: currentEmojiCategory === category }"
              class="emoji-category-btn"
            >
              {{ categoryEmojis[index] }}
            </button>
          </div>
          <div class="emoji-grid">
            <button
              v-for="(emoji, index) in currentCategoryEmojis"
              :key="index"
              @click="addEmoji(emoji)"
              class="emoji-btn"
            >
              {{ emoji }}
            </button>
          </div>
        </div>
      </div>

      <!-- Área para mostrar el enlace activo -->
      <div v-if="activeLink" class="active-link-container">
        <div class="active-link">
          <span class="link-prefix">@</span>
          <a
            :href="activeLink"
            target="_blank"
            rel="noopener noreferrer"
            class="link-text"
            >{{ activeLink }}</a
          >
          <button
            class="remove-link-btn"
            @click="removeActiveLink"
            title="Eliminar enlace"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>

      <div class="input-row">
        <div class="input-container">
          <div class="message-input-wrapper" ref="messageInputWrapper">
            <textarea
              ref="messageInput"
              v-model="newMessage"
              @keydown.ctrl.enter.prevent="handleCtrlEnter"
              @keydown.enter.exact="handleEnterKey"
              placeholder="Escriu un missatge..."
              @input="handleTyping"
              rows="1"
              class="message-textarea"
            ></textarea>
          </div>
          <button
            class="link-button"
            @click="openLinkPopup"
            title="Insertar enlace personalizado"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path
                d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"
              ></path>
              <path
                d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"
              ></path>
            </svg>
          </button>
          <button
            class="emoji-button"
            @click="toggleEmojiPicker"
            title="Insertar emoji"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
              <line x1="9" y1="9" x2="9.01" y2="9"></line>
              <line x1="15" y1="9" x2="15.01" y2="9"></line>
            </svg>
          </button>
        </div>
        <button @click="sendMessage">Enviar</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, computed, watch } from "vue";
import io from "socket.io-client";
import { useRoute, useRouter } from "vue-router";
import chatManager from "@/services/communicationsScripts/chatsComManager";
import { useAppStore } from "@/stores";

// Obtener el store de la aplicación
const appStore = useAppStore();
const route = useRoute();
const router = useRouter();

// Variables del chat
const socket = ref(null);
const messages = ref([]);
const newMessage = ref("");
const chatName = ref("Chat");
const loading = ref(true);
const activeLink = ref(null); // Nueva variable para almacenar el enlace activo

// Usar datos del usuario actual desde el store
const currentUserId = computed(() =>
  appStore.getUserId() ? appStore.getUserId().toString() : null
);

const currentUserName = computed(
  () => appStore.getUser()?.name || appStore.getUser()?.username || "Usuario"
);

const messagesContainer = ref(null);
const isTyping = ref(false);
const typingTimeout = ref(null);
const someoneIsTyping = ref(false);
const typingUserName = ref("");
const chatId = computed(() => route.params.chatId);
// Caché para evitar mensajes duplicados
const processedMessages = ref(new Set());

// Variables para el popup de inserción de enlace
const showLinkPopup = ref(false);
const linkUrl = ref("");

// Variables para el selector de emojis
const showEmojiPicker = ref(false);
const currentEmojiCategory = ref("smileys");
const emojiCategories = [
  "smileys",
  "people",
  "animals",
  "food",
  "activities",
  "travel",
  "objects",
  "symbols",
];
const categoryEmojis = ["😀", "👋", "🐶", "🍎", "⚽", "✈️", "💡", "❤️"];

// Emojis por categoría
const emojis = {
  smileys: [
    "😀",
    "😃",
    "😄",
    "😁",
    "😆",
    "😅",
    "😂",
    "🤣",
    "😊",
    "😇",
    "🙂",
    "🙃",
    "😉",
    "😌",
    "😍",
    "🥰",
    "😘",
    "😗",
    "😙",
    "😚",
    "😋",
    "😛",
    "😝",
    "😜",
    "🤪",
    "🤨",
    "🧐",
    "🤓",
    "😎",
    "🤩",
    "🥳",
  ],
  people: [
    "👋",
    "👌",
    "✌️",
    "🤞",
    "🤟",
    "🤘",
    "🤙",
    "👈",
    "👉",
    "👆",
    "👇",
    "👍",
    "👎",
    "✊",
    "👊",
    "🤛",
    "🤜",
    "👏",
    "🙌",
    "👐",
    "🤲",
    "🙏",
    "✍️",
    "💪",
    "🦾",
    "🦿",
    "🦵",
    "🦶",
    "👂",
    "🦻",
  ],
  animals: [
    "🐶",
    "🐱",
    "🐭",
    "🐹",
    "🐰",
    "🦊",
    "🐻",
    "🐼",
    "🐨",
    "🐯",
    "🦁",
    "🐮",
    "🐷",
    "🐽",
    "🐸",
    "🐵",
    "🙈",
    "🙉",
    "🙊",
    "🐒",
    "🐔",
    "🐧",
    "🐦",
    "🐤",
    "🐣",
    "🐥",
    "🦆",
    "🦅",
    "🦉",
    "🦇",
  ],
  food: [
    "🍎",
    "🍐",
    "🍊",
    "🍋",
    "🍌",
    "🍉",
    "🍇",
    "🍓",
    "🍈",
    "🍒",
    "🍑",
    "🥭",
    "🍍",
    "🥥",
    "🥝",
    "🍅",
    "🍆",
    "🥑",
    "🥦",
    "🥬",
    "🥒",
    "🌶️",
    "🌽",
    "🥕",
    "🧄",
    "🧅",
    "🥔",
    "🍠",
    "🥐",
    "🥯",
  ],
  activities: [
    "⚽",
    "🏀",
    "🏈",
    "⚾",
    "🥎",
    "🎾",
    "🏐",
    "🏉",
    "🥏",
    "🎱",
    "🪀",
    "🏓",
    "🏸",
    "🏒",
    "🏑",
    "🥍",
    "🏏",
    "🪃",
    "🥅",
    "⛳",
    "🪁",
    "🏹",
    "🎣",
    "🤿",
    "🥊",
    "🥋",
    "🎽",
    "🛹",
    "🛼",
    "🛷",
  ],
  travel: [
    "✈️",
    "🚀",
    "🚁",
    "🚂",
    "🚃",
    "🚄",
    "🚅",
    "🚆",
    "🚇",
    "🚈",
    "🚉",
    "🚊",
    "🚝",
    "🚞",
    "🚋",
    "🚌",
    "🚍",
    "🚎",
    "🚐",
    "🚑",
    "🚒",
    "🚓",
    "🚔",
    "🚕",
    "🚖",
    "🚗",
    "🚘",
    "🚙",
    "🚚",
    "🚛",
  ],
  objects: [
    "💡",
    "🔦",
    "🧯",
    "🛢️",
    "💸",
    "💵",
    "💴",
    "💶",
    "💷",
    "💰",
    "💳",
    "💎",
    "⚖️",
    "🔧",
    "🔨",
    "⚒️",
    "🛠️",
    "⛏️",
    "🔩",
    "⚙️",
    "🧱",
    "⛓️",
    "🧲",
    "🔫",
    "💣",
    "🧨",
    "🪓",
    "🔪",
    "🗡️",
    "⚔️",
  ],
  symbols: [
    "❤️",
    "🧡",
    "💛",
    "💚",
    "💙",
    "💜",
    "🖤",
    "🤍",
    "🤎",
    "💔",
    "❣️",
    "💕",
    "💞",
    "💓",
    "💗",
    "💖",
    "💘",
    "💝",
    "💟",
    "☮️",
    "✝️",
    "☪️",
    "🕉️",
    "☸️",
    "✡️",
    "🔯",
    "🕎",
    "☯️",
    "☦️",
    "🛐",
  ],
};

// Obtener emojis de la categoría actual
const currentCategoryEmojis = computed(() => {
  return emojis[currentEmojiCategory.value] || [];
});

// Función para seleccionar una categoría de emojis
const selectEmojiCategory = (category) => {
  currentEmojiCategory.value = category;
};

// Navegación
const goBack = () => {
  router.push({ name: "chats-list" });
};

// Referencia para el mensaje de pedido de cantina
const cantinaOrderMessage = ref(null);

// Verificar si hay productos en el carrito de cantina
const hasCantinaItems = computed(() => appStore.cartCantinaItems.length > 0);

// Función para formatear precio
const formatPrice = (price) => {
  return Number(price).toFixed(2);
};

// Calcular el total del pedido de cantina
const calculateCantinaTotal = () => {
  return formatPrice(
    appStore.cartCantinaItems.reduce((total, item) => {
      return total + item.product_price * item.quantity;
    }, 0)
  );
};

// Función para limpiar el pedido de cantina
const clearCantinaOrder = () => {
  // Eliminar todos los items del carrito
  while (appStore.cartCantinaItems.length > 0) {
    appStore.removeFromCartCantina(appStore.cartCantinaItems[0]);
  }
};

// Generar mensaje con los productos del carrito
const generateCantinaOrderMessage = () => {
  if (!hasCantinaItems.value) {
    return null;
  }

  let message = "🛒 *Nuevo Pedido*\n\n";

  appStore.cartCantinaItems.forEach((item) => {
    message += `• ${item.quantity}x ${item.product_name} - ${formatPrice(
      item.product_price * item.quantity
    )} €\n`;
  });

  message += `\n*Total: ${calculateCantinaTotal()} €*`;

  return message;
};

// Conectar al socket cuando el componente se monta
onMounted(async () => {
  // Verificar si el usuario está autenticado
  if (!currentUserId.value) {
    console.warn("No se puede iniciar el chat: usuario no autenticado");
    router.push("/login");
    return;
  }

  // Verificar si hay un pedido de cantina en la URL
  if (route.query.order) {
    cantinaOrderMessage.value = decodeURIComponent(route.query.order);
    // Ya no colocamos el mensaje en el input
  }

  // Cargar datos del chat
  await loadChatData();

  // Conectar al socket
  connectSocket();

  // Marcar mensajes como leídos
  await markMessagesAsRead();

  // Emitir evento de chat visto
  dispatchChatViewEvent("entered");

  // Verificar si hay enlaces en el campo de entrada
  nextTick(() => {
    highlightLinksInInput();
  });

  // Ajustar altura del textarea al montar
  nextTick(() => {
    adjustTextareaHeight();
  });
});

// Observar cambios en el ID del chat
watch(
  () => route.params.chatId,
  async (newChatId, oldChatId) => {
    if (newChatId !== oldChatId) {
      loading.value = true;
      messages.value = [];
      processedMessages.value.clear();

      // Emitir evento de salida del chat anterior
      if (oldChatId) {
        const exitEvent = new CustomEvent("chat-view-exited", {
          detail: {
            chatId: oldChatId,
            userId: currentUserId.value,
          },
        });
        window.dispatchEvent(exitEvent);
      }

      // Desconectar del chat anterior
      if (socket.value && oldChatId) {
        socket.value.emit("leave_chat", {
          chatId: oldChatId,
          userId: currentUserId.value,
        });
      }

      // Cargar datos del nuevo chat
      await loadChatData();

      // Unirse al nuevo chat
      if (socket.value) {
        socket.value.emit("join_chat", {
          chatId: chatId.value,
          userId: currentUserId.value,
          userName: currentUserName.value,
        });
      }

      // Marcar mensajes como leídos para el nuevo chat
      await markMessagesAsRead();

      // Emitir evento de entrada al nuevo chat
      if (newChatId) {
        const enterEvent = new CustomEvent("chat-view-entered", {
          detail: {
            chatId: newChatId,
            userId: currentUserId.value,
          },
        });
        window.dispatchEvent(enterEvent);
      }
    }
  }
);

// Observar cambios en el mensaje para aplicar estilos de enlaces
watch(newMessage, () => {
  highlightLinksInInput();
});

// Cargar datos del chat
const loadChatData = async () => {
  try {
    if (!chatId.value) {
      console.error("No se proporcionó ID de chat");
      router.push({ name: "chats-list" });
      return;
    }

    loading.value = true;
    // console.log(`Intentando cargar chat con ID: ${chatId.value}`);

    // Intentar cargar el chat directamente por ID
    let chatData;
    try {
      chatData = await chatManager.getChatById(chatId.value);
    } catch (error) {
      console.error(`Error al cargar chat por ID ${chatId.value}:`, error);
      chatData = null;
    }

    // Si no se encuentra el chat, intentar buscarlo entre todos los chats disponibles
    if (!chatData) {
      // console.log(
      //   "Chat no encontrado directamente, buscando entre todos los chats..."
      // );
      try {
        // Obtener todos los chats y filtrar por el ID actual
        const allChats = await chatManager.getAllChats();
        chatData = allChats.find((chat) => chat._id === chatId.value);

        if (!chatData) {
          // Buscar chats donde participa el usuario actual
          const userChats = allChats.filter(
            (chat) =>
              chat.teachers &&
              chat.teachers.includes(parseInt(currentUserId.value))
          );

          // console.log(
          //   `Encontrados ${userChats.length} chats donde participa el usuario actual`
          // );

          if (userChats.length > 0) {
            // Si no se encuentra el chat específico pero hay otros chats del usuario,
            // redirigir al primero de ellos
            // console.log("Redirigiendo al primer chat disponible del usuario");
            router.replace({
              name: "chat-detail",
              params: { chatId: userChats[0]._id },
            });
            return;
          }
        }
      } catch (fallbackError) {
        console.error(
          "Error en la búsqueda alternativa de chats:",
          fallbackError
        );
      }
    }

    if (!chatData) {
      console.error("No se encontró el chat ni alternativas");
      router.push({ name: "chats-list" });
      return;
    }

    // console.log("Chat encontrado:", chatData);

    // Establecer nombre del chat
    chatName.value = chatData.name || "Chat";

    // Cargar mensajes
    if (chatData.interaction && chatData.interaction.length > 0) {
      // console.log(`Cargando ${chatData.interaction.length} mensajes`);

      // Convertir los mensajes al formato esperado
      messages.value = chatData.interaction.map((msg) => {
        // Verificar si el mensaje es del usuario actual o de otro
        const isOwnMessage = msg.teacherId === currentUserId.value.toString();

        // Verificar si hay enlaces en el mensaje
        const hasLinks = msg.hasLinks || false;
        const links = msg.links || [];
        const linkPreviews = msg.linkPreviews || [];

        // Si no hay información de enlaces pero podría contener URLs, detectarlas
        const detectedLinks = !hasLinks ? detectLinks(msg.message) : [];
        const finalHasLinks = hasLinks || detectedLinks.length > 0;
        const finalLinks = hasLinks ? links : detectedLinks;

        return {
          id: msg._id,
          userId: msg.teacherId,
          userName: isOwnMessage
            ? currentUserName.value
            : `Profesor ${msg.teacherId}`,
          message: msg.message,
          hasLinks: finalHasLinks,
          links: finalLinks,
          linkPreviews: linkPreviews,
          timestamp: new Date(msg.date),
        };
      });

      // Ordenar mensajes por fecha
      messages.value.sort(
        (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
      );
    } else {
      // console.log("El chat no tiene mensajes");
      messages.value = [];
    }

    // Actualizar estado
    loading.value = false;

    // Hacer scroll al final de los mensajes
    await nextTick();
    scrollToBottom();
  } catch (error) {
    console.error("Error al cargar datos del chat:", error);
    loading.value = false;
    router.push({ name: "chats-list" });
  }
};

// Limpiar cuando el componente se desmonta
onUnmounted(() => {
  // Desconectar socket
  disconnectSocket();

  // Emitir evento de chat no visto
  dispatchChatViewEvent("exited");
});

// Función para marcar los mensajes de un chat como leídos
const markMessagesAsRead = async () => {
  try {
    if (!chatId.value || !currentUserId.value) return;

    // Obtener los datos del chat para saber con quién estamos hablando
    const data = await chatManager.getChatById(chatId.value);
    if (!data || !data.teachers) return;

    // Identificar al otro usuario en el chat
    const otherUserId = data.teachers.find(
      (teacherId) => teacherId !== parseInt(currentUserId.value)
    );

    if (!otherUserId) return;

    // console.log(`Marcando mensajes como leídos para el usuario ${otherUserId}`);

    // Obtener el estado actual de los mensajes no leídos
    const storageKey = `chat_unread_${currentUserId.value}`;
    const unreadData = localStorage.getItem(storageKey);

    if (unreadData) {
      const unreadMessages = JSON.parse(unreadData);

      // Si hay mensajes no leídos de este usuario, marcarlos como leídos
      if (unreadMessages[otherUserId]) {
        // console.log(
        //   `Usuario ${otherUserId} tenía mensajes no leídos, marcando como leídos`
        // );
        delete unreadMessages[otherUserId];

        // Guardar el nuevo estado
        localStorage.setItem(storageKey, JSON.stringify(unreadMessages));

        // Actualizar el contador global
        appStore.updateUnreadMessagesCount();
        // console.log(
        //   "Contador de mensajes no leídos actualizado:",
        //   appStore.getUnreadCount
        // );
      }
    }

    // Asegurarse de que este chat se considera activo
    // (esto es redundante con el evento dispatchChatViewEvent, pero es una garantía adicional)
    const chatActiveEvent = new CustomEvent("chat-view-entered", {
      detail: {
        chatId: chatId.value,
        userId: currentUserId.value,
      },
    });
    window.dispatchEvent(chatActiveEvent);
  } catch (error) {
    console.error("Error al marcar mensajes como leídos:", error);
  }
};

// Conectar al servidor de socket.io
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
    });

    // Evento de conexión establecida
    socket.value.on("connect", () => {
      // console.log("Conectado al servidor de chat");

      // Registrar el usuario
      socket.value.emit("register_user", {
        userId: currentUserId.value,
        userName: currentUserName.value,
      });

      // Unirse al chat actual (solo si tenemos un chatId)
      if (chatId.value) {
        // console.log(
        //   `Uniendo al usuario ${currentUserId.value} al chat ${chatId.value}`
        // );
        socket.value.emit("join_chat", {
          chatId: chatId.value,
          userId: currentUserId.value,
          userName: currentUserName.value,
        });
      } else {
        console.warn("No hay chatId disponible para unirse");
      }
    });

    // Evento de desconexión
    socket.value.on("disconnect", () => {
      // console.log("Desconectado del servidor de chat");
    });

    // Registrar todos los manejadores de eventos
    setupSocketEventHandlers();
  } catch (error) {
    console.error("Error al conectar con socket.io:", error);
  }
};

// Configurar los manejadores de eventos del socket
const setupSocketEventHandlers = () => {
  // Escuchar nuevos mensajes
  socket.value.on("new_message", (data) => {
    // console.log("Nuevo mensaje recibido del socket:", data);

    // Extraer la información del mensaje según la estructura del backend
    let messageData = null;

    // Si el mensaje tiene una estructura completa (viene del backend directamente)
    if (
      data.interaction &&
      Array.isArray(data.interaction) &&
      data.interaction.length > 0
    ) {
      // Tome el último mensaje de la interacción
      const lastInteraction = data.interaction[data.interaction.length - 1];
      messageData = {
        id: lastInteraction._id,
        userId: lastInteraction.teacherId,
        message: lastInteraction.message,
        hasLinks: lastInteraction.hasLinks || false,
        links: lastInteraction.links || [],
        linkPreviews: lastInteraction.linkPreviews || [],
        timestamp: new Date(lastInteraction.date),
      };
    } else if (data.message && data.userId) {
      // Si es un mensaje formateado para el front
      messageData = {
        id: data.id || Date.now().toString(),
        userId: data.userId,
        message: data.message,
        hasLinks: data.hasLinks || false,
        links: data.links || [],
        linkPreviews: data.linkPreviews || [],
        timestamp: data.timestamp || new Date(),
      };
    } else if (
      data.chatId &&
      data.interaction &&
      !Array.isArray(data.interaction)
    ) {
      // Si interaction es un solo objeto (no un array)
      const msg = data.interaction;
      messageData = {
        id: msg._id || Date.now().toString(),
        userId: msg.teacherId,
        message: msg.message,
        hasLinks: msg.hasLinks || false,
        links: msg.links || [],
        linkPreviews: msg.linkPreviews || [],
        timestamp: new Date(msg.date) || new Date(),
      };
    }

    // Si no pudimos extraer datos válidos, salir
    if (!messageData) {
      console.error("No se pudo extraer información válida del mensaje:", data);
      return;
    }

    // Si no tenemos información de enlaces pero el mensaje contiene URLs, detectarlas
    if (!messageData.hasLinks) {
      const detectedLinks = detectLinks(messageData.message);
      if (detectedLinks.length > 0) {
        messageData.hasLinks = true;
        messageData.links = detectedLinks;
      }
    }

    // Comprobar si el mensaje tiene formato de enlace con nombre personalizado: "nombre (url)"
    const customLinkRegex = /^(.+?)\s*\((https?:\/\/[^\s)]+)\)$/;
    const customLinkMatch = messageData.message.match(customLinkRegex);

    if (customLinkMatch && customLinkMatch.length === 3) {
      // Si el mensaje tiene el formato "nombre (url)", extraer el nombre y la URL
      const customName = customLinkMatch[1].trim();
      const actualUrl = customLinkMatch[2].trim();

      // Guardar el mensaje original para referencia
      messageData.actualMessage = messageData.message;

      // Actualizar el mensaje para mostrar solo el nombre personalizado
      messageData.message = customName;

      // Asegurarse de que la URL esté en la lista de enlaces
      if (!messageData.links.includes(actualUrl)) {
        messageData.links = [actualUrl];
      }

      // Marcar el mensaje como que tiene enlaces
      messageData.hasLinks = true;

      console.log("Mensaje con enlace personalizado procesado:", {
        original: messageData.actualMessage,
        displayText: messageData.message,
        url: actualUrl,
      });
    }

    // Determinar el nombre del usuario
    const isCurrentUser =
      messageData.userId.toString() === currentUserId.value.toString();
    messageData.userName = isCurrentUser
      ? currentUserName.value
      : `Profesor ${messageData.userId}`;

    // Crear una clave única para este mensaje
    const msgSignature = `${messageData.userId}_${
      messageData.message
    }_${new Date(messageData.timestamp).getTime()}`;

    // Si este mensaje ya fue procesado, ignorarlo
    if (processedMessages.value.has(msgSignature)) {
      // console.log("Mensaje ya procesado anteriormente, ignorando");
      return;
    }

    // Buscar si ya existe un mensaje local similar
    const existingIndex = messages.value.findIndex((msg) => {
      // Si los mensajes tienen el mismo contenido y autor, y están cercanos en tiempo
      const isSameContent =
        msg.message === messageData.message ||
        (msg.actualMessage && msg.actualMessage.includes(messageData.message));
      const isSameAuthor =
        msg.userId.toString() === messageData.userId.toString();
      const timeDiff = Math.abs(
        new Date(msg.timestamp) - new Date(messageData.timestamp)
      );
      const isCloseInTime = timeDiff < 30000; // 30 segundos

      // También comprobar por URLs comunes entre los mensajes
      let hasSameLinks = false;
      if (
        msg.links &&
        messageData.links &&
        msg.links.length > 0 &&
        messageData.links.length > 0
      ) {
        hasSameLinks = msg.links.some((link) =>
          messageData.links.includes(link)
        );
      }

      return (isSameContent || hasSameLinks) && isSameAuthor && isCloseInTime;
    });

    // Marcar el mensaje como procesado
    processedMessages.value.add(msgSignature);

    if (existingIndex === -1) {
      // Si no existe mensaje similar, agregar este nuevo
      // console.log("Mensaje nuevo, agregando:", messageData);
      messages.value.push(messageData);
      scrollToBottom();
    } else {
      // Si ya existe un mensaje similar, actualizar sus propiedades si es necesario
      // console.log("Mensaje similar encontrado en índice:", existingIndex);

      // Si el mensaje existente es local y el nuevo tiene ID del servidor, actualizar
      if (messages.value[existingIndex].local && messageData.id) {
        // console.log("Actualizando mensaje local con datos del servidor");
        messages.value[existingIndex].id = messageData.id;
        messages.value[existingIndex].hasLinks = messageData.hasLinks;
        messages.value[existingIndex].links = messageData.links;
        messages.value[existingIndex].linkPreviews = messageData.linkPreviews;
        messages.value[existingIndex].sending = false;
      }
    }

    // Limitar el tamaño del caché (mantener solo los últimos 100 mensajes)
    if (processedMessages.value.size > 100) {
      // Convertir a array, eliminar los primeros elementos y reconvertir a Set
      const messagesArray = Array.from(processedMessages.value);
      processedMessages.value = new Set(messagesArray.slice(-50)); // Mantener solo los últimos 50
    }
  });

  // Escuchar cuando alguien está escribiendo
  socket.value.on("user_typing", (data) => {
    if (data.userId.toString() !== currentUserId.value.toString()) {
      someoneIsTyping.value = data.isTyping;
      typingUserName.value = data.userName || `Profesor ${data.userId}`;
    }
  });

  // Escuchar cuando un usuario se une al chat
  socket.value.on("user_joined", (data) => {
    // console.log(
    //   `${data.userName || "Profesor " + data.userId} se ha unido al chat`
    // );
  });

  // Escuchar cuando un usuario deja el chat
  socket.value.on("user_left", (data) => {
    // console.log(
    //   `${data.userName || "Profesor " + data.userId} ha salido del chat`
    // );
  });

  // Escuchar errores
  socket.value.on("error", (error) => {
    console.error("Error en socket:", error);
  });

  // Escuchar cuando un mensaje es eliminado
  socket.value.on("message_deleted", (data) => {
    // console.log("Mensaje eliminado:", data);

    // Encontrar y eliminar el mensaje de la lista local
    const messageIndex = messages.value.findIndex(
      (msg) => msg.id === data.messageId
    );
    if (messageIndex !== -1) {
      // console.log(`Eliminando mensaje en índice ${messageIndex}`);
      messages.value.splice(messageIndex, 1);
    }
  });
};

// Desconectar del socket
const disconnectSocket = () => {
  if (socket.value) {
    // Dejar el chat actual antes de desconectar
    if (chatId.value) {
      socket.value.emit("leave_chat", {
        chatId: chatId.value,
        userId: currentUserId.value,
      });
    }

    socket.value.disconnect();
    socket.value = null;
  }
};

// Función para formatear un mensaje con enlaces clickables
const formatMessageWithLinks = (message) => {
  if (!message.links || message.links.length === 0) {
    return message.message;
  }

  let formattedMessage = message.message;

  // Manejar el caso especial cuando hay un enlace con @ y texto adicional separado por salto de línea
  if (formattedMessage.includes("@http") && formattedMessage.includes("\n")) {
    // Dividir el mensaje en líneas
    const lines = formattedMessage.split("\n");

    // Formatear cada línea por separado
    const formattedLines = lines.map((line) => {
      // Si la línea contiene un enlace con @, aplicar formato solo al enlace
      if (line.startsWith("@http")) {
        // Extraer la URL (quitar el @ del principio)
        const url = line.substring(1);
        const safeUrl = url.replace(/"/g, "&quot;");

        try {
          // Validar que sea una URL válida
          new URL(safeUrl);
          return `<a href="${safeUrl}" target="_blank" rel="noopener noreferrer" class="message-link">@${url}</a>`;
        } catch (e) {
          console.error("Error con URL en formatMessageWithLinks:", e);
          return line; // Si la URL no es válida, mostrar el texto plano
        }
      } else {
        // Si la línea no contiene un enlace con @, devolverla sin cambios
        return line;
      }
    });

    // Unir las líneas formateadas con saltos de línea HTML
    return formattedLines.join("<br>");
  }

  // Si tenemos un mensaje personalizado (con nombre diferente del enlace)
  if (
    (message.actualMessage && message.actualMessage !== message.message) ||
    message.message.match(/^.+?\s*\(https?:\/\/[^\s)]+\)$/) === null
  ) {
    // Si hay un enlace válido, hacemos que todo el texto sea clickeable para el primer enlace
    if (message.links && message.links.length > 0) {
      const safeLink = message.links[0].replace(/"/g, "&quot;");
      try {
        // Validar que sea una URL válida antes de crear el enlace
        new URL(safeLink);
        return `<a href="${safeLink}" target="_blank" rel="noopener noreferrer" class="message-link">${formattedMessage}</a>`;
      } catch (e) {
        console.error("Error con URL en formatMessageWithLinks:", e);
        return formattedMessage; // Si la URL no es válida, mostrar el texto plano
      }
    }
  } else {
    // Comportamiento tradicional: reemplazar cada enlace con una etiqueta <a>
    message.links.forEach((link) => {
      try {
        const safeLink = link.replace(/"/g, "&quot;");

        // Buscar tanto el enlace normal como con @ delante
        const patterns = [
          link.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), // Enlace normal escapado
          "@" + link.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), // Enlace con @ escapado
        ];

        patterns.forEach((pattern) => {
          const linkRegex = new RegExp(pattern, "g");
          const replacement = pattern.startsWith("@")
            ? `<a href="${safeLink}" target="_blank" rel="noopener noreferrer" class="message-link">@${link}</a>`
            : `<a href="${safeLink}" target="_blank" rel="noopener noreferrer" class="message-link">${link}</a>`;

          formattedMessage = formattedMessage.replace(linkRegex, replacement);
        });
      } catch (e) {
        console.error("Error al formatear enlace:", e);
      }
    });
    return formattedMessage;
  }

  return formattedMessage;
};

// Función para detectar enlaces en un mensaje
const detectLinks = (text) => {
  if (!text) return [];

  // Buscar URLs explícitas
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const explicitLinks = text.match(urlRegex) || [];

  // Buscar URLs con formato @http:// o @https://
  const atUrlRegex = /@(https?:\/\/[^\s]+)/g;
  const atLinks = [];
  let match;

  while ((match = atUrlRegex.exec(text)) !== null) {
    if (match[1]) {
      atLinks.push(match[1]);
    }
  }

  // Buscar también URLs en formato "texto (https://ejemplo.com)"
  const urlWithTextRegex = /\(https?:\/\/[^\s)]+\)/g;
  const linksInParentheses = text.match(urlWithTextRegex) || [];

  // Procesar los enlaces en paréntesis para extraer solo la URL
  const extractedLinks = linksInParentheses
    .map((link) => {
      // Extraer solo la URL entre paréntesis
      const matches = link.match(/\((https?:\/\/[^\s)]+)\)/);
      return matches ? matches[1] : null;
    })
    .filter((link) => link !== null);

  // Combinar todos los conjuntos de enlaces y eliminar duplicados
  const allLinks = [...explicitLinks, ...atLinks, ...extractedLinks];
  return [...new Set(allLinks)]; // Eliminar duplicados
};

// Función original para enviar mensajes
const originalSendMessage = async () => {
  if (!currentUserId.value) {
    console.error("No se puede enviar mensaje: usuario no autenticado");
    return;
  }

  // Solo enviar si hay un enlace activo o un mensaje de texto
  if ((activeLink.value || newMessage.value.trim()) && chatId.value) {
    try {
      // Crear el mensaje completo: enlace + texto (si ambos existen)
      let fullMessage = "";

      if (activeLink.value) {
        fullMessage = `@${activeLink.value}`;

        if (newMessage.value.trim()) {
          fullMessage += `\n${newMessage.value.trim()}`;
        }
      } else {
        fullMessage = newMessage.value.trim();
      }

      const tempId = Date.now().toString();

      // Detectar enlaces en el mensaje
      const links = activeLink.value
        ? [activeLink.value]
        : detectLinks(fullMessage);
      const hasLinks = links.length > 0 || activeLink.value !== null;

      // Limpiar los campos de entrada
      newMessage.value = "";
      const linkToSend = activeLink.value;
      activeLink.value = null;

      // Agregar el mensaje localmente para que aparezca inmediatamente
      const localMessage = {
        id: tempId,
        userId: currentUserId.value,
        userName: currentUserName.value,
        message: fullMessage,
        hasLinks: hasLinks,
        links: links,
        linkPreviews: [],
        timestamp: new Date(),
        sending: true,
        local: true,
      };

      // Si había un enlace activo, agregar previsualización básica
      if (linkToSend) {
        localMessage.linkPreviews = [
          {
            url: linkToSend,
            title: extractDomain(linkToSend),
            description: "",
            siteName: extractDomain(linkToSend),
          },
        ];
      }

      // Agregar el mensaje a la lista
      messages.value.push(localMessage);

      // Hacer scroll para mostrar el nuevo mensaje
      scrollToBottom();

      // Enviar el mensaje a través del API
      const result = await chatManager.sendMessage(
        chatId.value,
        currentUserId.value,
        fullMessage // Enviamos el mensaje completo al servidor
      );

      // Actualizar el mensaje local con el ID real
      const messageIndex = messages.value.findIndex((m) => m.id === tempId);
      if (messageIndex !== -1) {
        // Si el último mensaje recibido tiene el interaction array, actualizar
        if (result.interaction && result.interaction.length > 0) {
          const newMsg = result.interaction[result.interaction.length - 1];
          messages.value[messageIndex] = {
            ...messages.value[messageIndex],
            id: newMsg._id,
            hasLinks: newMsg.hasLinks || hasLinks,
            links: newMsg.links || links,
            linkPreviews: newMsg.linkPreviews || localMessage.linkPreviews,
            sending: false,
            local: true, // Mantener la marca para evitar duplicación
          };
        } else {
          // Solo marcar como enviado si no tenemos el ID real
          messages.value[messageIndex].sending = false;
        }
      }
    } catch (error) {
      console.error("Error al enviar mensaje:", error);
      // Marcar el mensaje como fallido
      const failedMessageIndex = messages.value.findIndex((m) => m.sending);
      if (failedMessageIndex !== -1) {
        messages.value[failedMessageIndex].failed = true;
        messages.value[failedMessageIndex].sending = false;
      }
    }
  }
};

// Nueva función de envío de mensaje que usa la original y limpia el carrito
const sendMessage = async () => {
  // Verificar si hay un pedido de cantina para enviar
  if (hasCantinaItems.value && !newMessage.value.trim()) {
    // Crear el mensaje completo con el pedido
    let fullMessage = generateCantinaOrderMessage();

    // Enviar el mensaje directamente sin colocarlo en el input
    try {
      const tempId = Date.now().toString();

      // Detectar enlaces en el mensaje
      const links = detectLinks(fullMessage);
      const hasLinks = links.length > 0;

      // Agregar el mensaje localmente para que aparezca inmediatamente
      const localMessage = {
        id: tempId,
        userId: currentUserId.value,
        userName: currentUserName.value,
        message: fullMessage,
        hasLinks: hasLinks,
        links: links,
        linkPreviews: [],
        timestamp: new Date(),
        sending: true,
        local: true,
      };

      // Agregar el mensaje a la lista
      messages.value.push(localMessage);

      // Hacer scroll para mostrar el nuevo mensaje
      scrollToBottom();

      // Enviar el mensaje a través del API
      const result = await chatManager.sendMessage(
        chatId.value,
        currentUserId.value,
        fullMessage
      );

      // Actualizar el mensaje local con el ID real
      const messageIndex = messages.value.findIndex((m) => m.id === tempId);
      if (messageIndex !== -1) {
        // Si el último mensaje recibido tiene el interaction array, actualizar
        if (result.interaction && result.interaction.length > 0) {
          const newMsg = result.interaction[result.interaction.length - 1];
          messages.value[messageIndex] = {
            ...messages.value[messageIndex],
            id: newMsg._id,
            hasLinks: newMsg.hasLinks || hasLinks,
            links: newMsg.links || links,
            linkPreviews: newMsg.linkPreviews || [],
            sending: false,
            local: true, // Mantener la marca para evitar duplicación
          };
        } else {
          // Solo marcar como enviado si no tenemos el ID real
          messages.value[messageIndex].sending = false;
        }
      }

      // Limpiar el carrito después de enviar
      clearCantinaOrder();
    } catch (error) {
      console.error("Error al enviar pedido de cantina:", error);
      // Mostrar error al usuario
    }
  } else {
    // Si hay texto en el input o no hay productos en el carrito, usar la función original
    await originalSendMessage();
  }
};

// Manejar evento de escritura
const handleTyping = () => {
  if (!isTyping.value && chatId.value) {
    isTyping.value = true;
    socket.value.emit("typing", {
      chatId: chatId.value,
      userId: currentUserId.value,
      userName: currentUserName.value,
      isTyping: true,
    });
  }

  // Limpiar timeout anterior
  if (typingTimeout.value) {
    clearTimeout(typingTimeout.value);
  }

  // Establecer nuevo timeout
  typingTimeout.value = setTimeout(() => {
    isTyping.value = false;
    if (chatId.value) {
      socket.value.emit("typing", {
        chatId: chatId.value,
        userId: currentUserId.value,
        userName: currentUserName.value,
        isTyping: false,
      });
    }
  }, 1000);

  // Ajustar altura del textarea
  adjustTextareaHeight();
};

// Función para ajustar la altura del textarea según el contenido
const adjustTextareaHeight = () => {
  if (messageInput.value) {
    messageInput.value.style.height = "auto";
    messageInput.value.style.height = messageInput.value.scrollHeight + "px";
  }
};

// Función para manejar Ctrl+Enter (insertar salto de línea)
const handleCtrlEnter = (event) => {
  // Insertar un salto de línea en la posición del cursor
  const cursorPosition = event.target.selectionStart;
  const textBefore = newMessage.value.substring(0, cursorPosition);
  const textAfter = newMessage.value.substring(cursorPosition);

  newMessage.value = textBefore + "\n" + textAfter;

  // Restaurar la posición del cursor después del salto de línea
  nextTick(() => {
    if (messageInput.value) {
      messageInput.value.selectionStart = cursorPosition + 1;
      messageInput.value.selectionEnd = cursorPosition + 1;
      adjustTextareaHeight();
    }
  });
};

// Función para manejar la tecla Enter (enviar mensaje)
const handleEnterKey = (event) => {
  // Si no se presiona Ctrl, enviar el mensaje
  if (!event.ctrlKey) {
    event.preventDefault();
    sendMessage();
  }
};

// Función para eliminar el enlace activo
const removeActiveLink = () => {
  activeLink.value = null;
};

// Función para resaltar enlaces en el campo de entrada
const messageInputWrapper = ref(null);
const messageInput = ref(null);

const highlightLinksInInput = () => {
  // Aplicar estilos al input cuando contiene enlaces
  if (messageInput.value) {
    const text = newMessage.value;
    const hasLinks = text.includes("@http://") || text.includes("@https://");

    if (hasLinks) {
      messageInput.value.classList.add("has-links");
    } else {
      messageInput.value.classList.remove("has-links");
    }
  }
};

// Formatear fecha para mostrar
const formatDate = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleTimeString();
};

// Hacer scroll hasta el último mensaje
const scrollToBottom = async () => {
  await nextTick();
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
};

// Reintentar enviar un mensaje fallido
const retryMessage = async (message, index) => {
  if (message.failed && chatId.value) {
    try {
      // console.log("Reintentando enviar mensaje:", message);

      // Marcar el mensaje como en proceso de envío
      messages.value[index].failed = false;
      messages.value[index].sending = true;

      // Asegurarse de que el mensaje tenga información de enlaces
      if (!message.hasLinks) {
        const links = detectLinks(message.message);
        message.hasLinks = links.length > 0;
        message.links = links;
        message.linkPreviews = [];
      }

      // Solo usar la API para evitar duplicaciones
      // console.log(
      //   `Reenviando mensaje a la API. Chat: ${chatId.value}, teacherId: ${message.userId}`
      // );
      const result = await chatManager.sendMessage(
        chatId.value,
        message.userId,
        message.message
      );

      // console.log("Respuesta de la API al reenviar mensaje:", result);

      // Actualizar el mensaje con el ID real
      if (result.interaction && result.interaction.length > 0) {
        const newMsg = result.interaction[result.interaction.length - 1];
        messages.value[index] = {
          ...messages.value[index],
          id: newMsg._id,
          hasLinks: newMsg.hasLinks || message.hasLinks,
          links: newMsg.links || message.links,
          linkPreviews: newMsg.linkPreviews || [],
          sending: false,
          failed: false,
          local: true, // Mantener la marca para evitar duplicación
        };
        // console.log(
        //   "Mensaje actualizado después del reintento:",
        //   messages.value[index]
        // );
      } else {
        // Solo marcar como enviado si no tenemos el ID real
        messages.value[index].sending = false;
        messages.value[index].failed = false;
      }
    } catch (error) {
      console.error("Error al reenviar mensaje:", error);
      // Marcar el mensaje como fallido nuevamente
      messages.value[index].failed = true;
      messages.value[index].sending = false;
    }
  }
};

// Función para emitir eventos de cambio de vista de chat
const dispatchChatViewEvent = (action) => {
  if (!chatId.value) return;

  const eventName =
    action === "entered" ? "chat-view-entered" : "chat-view-exited";

  // Usar CustomEvent para poder enviar datos adicionales
  const event = new CustomEvent(eventName, {
    detail: {
      chatId: chatId.value,
      userId: currentUserId.value,
      timestamp: new Date(),
    },
  });

  // console.log(`Emitiendo evento ${eventName} para chat ${chatId.value}`);
  window.dispatchEvent(event);
};

// Función para eliminar un mensaje
const deleteMessage = async (message) => {
  if (!message.id || !chatId.value) return;

  try {
    // console.log(
    //   `Intentando eliminar mensaje ${message.id} del chat ${chatId.value}`
    // );

    // Mostrar confirmación
    if (!confirm("¿Estás seguro de que deseas eliminar este mensaje?")) {
      return;
    }

    // Si estamos usando sockets, enviar evento de eliminación
    if (socket.value) {
      socket.value.emit("delete_message", {
        chatId: chatId.value,
        messageId: message.id,
        userId: currentUserId.value,
      });
    } else {
      // Si no hay socket, usar directamente el API
      await chatManager.deleteMessage(chatId.value, message.id);

      // Eliminar el mensaje localmente
      const messageIndex = messages.value.findIndex(
        (msg) => msg.id === message.id
      );
      if (messageIndex !== -1) {
        messages.value.splice(messageIndex, 1);
      }
    }
  } catch (error) {
    console.error("Error al eliminar mensaje:", error);
    alert("No se pudo eliminar el mensaje. Inténtalo de nuevo.");
  }
};

// Función para truncar texto largo
const truncateText = (text, maxLength) => {
  if (!text) return "";
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
};

// Función para extraer el dominio de una URL
const extractDomain = (url) => {
  try {
    const domain = new URL(url).hostname;
    return domain.replace("www.", "");
  } catch (e) {
    return url;
  }
};

// Función para abrir un enlace en una nueva pestaña
const openLink = (url) => {
  try {
    // Nos aseguramos de que la URL esté bien formada
    let validUrl = url;

    // Si no comienza con http:// o https://, añadir https://
    if (!validUrl.startsWith("http://") && !validUrl.startsWith("https://")) {
      validUrl = "https://" + validUrl;
    }

    // Intentar crear un objeto URL para validar (lanzará error si es inválida)
    new URL(validUrl);

    // Abrir la URL en una nueva pestaña
    window.open(validUrl, "_blank", "noopener,noreferrer");
  } catch (error) {
    console.error("Error al abrir URL:", error, "URL:", url);
    // Mostrar mensaje de error al usuario
    alert("No se pudo abrir el enlace. URL incorrecta o inaccesible.");
  }
};

// Función para abrir/cerrar el selector de emojis
const toggleEmojiPicker = () => {
  showEmojiPicker.value = !showEmojiPicker.value;
  // Cerrar el popup de enlaces si está abierto
  if (showEmojiPicker.value) {
    showLinkPopup.value = false;
  }
};

// Función para añadir un emoji al mensaje
const addEmoji = (emoji) => {
  // Obtener la posición actual del cursor
  const cursorPosition = messageInput.value.selectionStart;

  // Insertar el emoji en la posición del cursor
  const textBefore = newMessage.value.substring(0, cursorPosition);
  const textAfter = newMessage.value.substring(cursorPosition);

  // Añadir el emoji
  newMessage.value = textBefore + emoji + textAfter;

  // Restaurar el cursor después del emoji
  nextTick(() => {
    if (messageInput.value) {
      const newPosition = cursorPosition + emoji.length;
      messageInput.value.selectionStart = newPosition;
      messageInput.value.selectionEnd = newPosition;
      messageInput.value.focus();
    }

    // Cerrar el selector de emojis
    showEmojiPicker.value = false;
  });
};

// Función para abrir el popup de inserción de enlace
const openLinkPopup = () => {
  showLinkPopup.value = true;
  // Cerrar el selector de emojis si está abierto
  showEmojiPicker.value = false;
};

// Función para insertar un enlace
const insertLink = async () => {
  if (!linkUrl.value) {
    // Mostrar mensaje de error si no hay URL
    alert("Por favor, introduce una URL válida");
    return;
  }

  try {
    // Normalizar y validar la URL
    let normalizedUrl = linkUrl.value.trim();

    // Si no comienza con http:// o https://, añadir https://
    if (
      !normalizedUrl.startsWith("http://") &&
      !normalizedUrl.startsWith("https://")
    ) {
      normalizedUrl = "https://" + normalizedUrl;
    }

    // Validar la URL usando el constructor URL (lanzará error si es inválida)
    try {
      new URL(normalizedUrl);
    } catch (e) {
      alert("La URL introducida no es válida. Por favor, verifica el formato.");
      console.error("URL inválida:", normalizedUrl, e);
      return;
    }

    // Establecer el enlace activo
    activeLink.value = normalizedUrl;

    // Cerrar el popup
    showLinkPopup.value = false;
    linkUrl.value = "";

    // Enfocar el campo de mensaje
    setTimeout(() => {
      if (messageInput.value) {
        messageInput.value.focus();
      }
    }, 100);
  } catch (error) {
    console.error("Error al insertar enlace:", error);
    alert("No se pudo insertar el enlace. Inténtalo de nuevo.");
  }
};
</script>

<style scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  color: #333; /* Color base para el texto */
}

.chat-header {
  padding: 10px;
  background-color: #f5f5f5;
  border-radius: 8px 8px 0 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #333; /* Color para el texto del encabezado */
}

.back-button {
  background: none;
  border: none;
  color: #007bff;
  font-size: 14px;
  cursor: pointer;
  padding: 5px 10px;
  display: flex;
  align-items: center;
  gap: 5px;
}

.back-button:hover {
  text-decoration: underline;
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: #6c757d;
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
  margin: auto;
  padding: 20px;
  color: #6c757d;
  background-color: #f8f9fa;
  border-radius: 8px;
  width: 80%;
  max-width: 400px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.empty-chat-message p {
  margin: 5px 0;
}

.typing-indicator {
  padding: 5px 10px;
  margin-bottom: 10px;
  align-self: flex-start;
  background-color: #f0f0f0;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  max-width: 50px;
}

.typing-dots {
  display: inline-flex;
  align-items: center;
  height: 20px;
  padding: 0 5px;
}

.typing-dots span {
  display: inline-block;
  width: 6px;
  height: 6px;
  margin: 0 2px;
  background-color: #6c757d;
  border-radius: 50%;
  opacity: 0.8;
  animation: typingAnimation 1.4s infinite ease-in-out;
}

.typing-dots span:nth-child(1) {
  animation-delay: 0s;
}

.typing-dots span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-dots span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typingAnimation {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-4px);
  }
}

.message {
  position: relative;
  margin-bottom: 15px;
  padding: 10px;
  border-radius: 8px;
  background-color: #f0f0f0;
  max-width: 70%;
  color: #333;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: opacity 0.3s ease;
  margin-right: auto; /* Por defecto, mensajes alineados a la izquierda */
}

.message.sending {
  opacity: 0.8;
}

.message.failed {
  border: 1px solid #dc3545;
}

.own-message {
  margin-left: auto;
  margin-right: 0; /* Anular el valor por defecto para mensajes propios */
  background-color: #007bff;
  color: white;
  font-weight: 500;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.other-message {
  margin-right: auto;
  margin-left: 0;
  background-color: #f0f0f0;
  color: #333;
}

.message-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
  font-size: 0.8em;
  opacity: 0.8;
}

.own-message .message-header {
  color: rgba(255, 255, 255, 0.9);
}

.other-message .message-header {
  color: rgba(51, 51, 51, 0.9);
}

.message-content {
  word-wrap: break-word;
  font-size: 1.05em;
  color: inherit;
}

/* Styles for clickable links */
:deep(.message-link) {
  color: #0078d7;
  text-decoration: underline;
  cursor: pointer;
  word-break: break-all;
  transition: color 0.2s ease;
}

:deep(.message-link:hover) {
  color: #005a9e;
}

/* Estilo especial para enlaces con @ */
:deep(.message-link[href^="http"]:not(.no-style)) {
  background-color: rgba(0, 120, 215, 0.1);
  border: 1px solid rgba(0, 120, 215, 0.2);
  border-radius: 4px;
  padding: 2px 6px;
  margin: 0 2px;
  text-decoration: none;
  display: inline-block;
  transition: all 0.2s ease;
}

:deep(.message-link[href^="http"]:hover:not(.no-style)) {
  background-color: rgba(0, 120, 215, 0.2);
  border-color: rgba(0, 120, 215, 0.3);
}

/* Estilo para enlaces en mensajes propios */
.own-message :deep(.message-link) {
  color: #ffffff;
  text-decoration: underline;
  font-weight: 500;
}

/* Estilo especial para enlaces con @ en mensajes propios */
.own-message :deep(.message-link[href^="http"]:not(.no-style)) {
  background-color: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  text-decoration: none;
}

.own-message :deep(.message-link[href^="http"]:hover:not(.no-style)) {
  background-color: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.4);
}

.own-message :deep(.message-link:hover) {
  color: #e6e6e6;
}

/* Estilo para el input con enlaces */
.input-container input.has-links {
  background-color: #f0f8ff;
}

/* Estilos para el contenedor del input */
.message-input-wrapper {
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
}

/* Estilo base para el input */
.input-container input {
  flex: 1;
  padding: 10px;
  border: none;
  color: #000;
  outline: none;
  width: 100%;
  transition: all 0.2s ease;
}

/* Estilo específico para enlaces en el input */
.input-container input.has-links {
  background-color: #f0f8ff;
  border-left: 3px solid rgba(0, 120, 215, 0.3);
}

.input-container input.has-links::placeholder {
  color: rgba(0, 120, 215, 0.6);
}

.message-status {
  position: absolute;
  bottom: -18px;
  right: 0;
  font-size: 0.7em;
  padding: 2px 6px;
  border-radius: 10px;
  background-color: #f8f9fa;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  color: #333;
}

.message-status.sending {
  color: #6c757d;
}

.message-status.failed {
  color: #dc3545;
  cursor: pointer;
}

.chat-input {
  display: flex;
  flex-direction: column;
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 0 0 8px 8px;
}

.input-row {
  display: flex;
  flex-direction: row;
  gap: 10px;
  width: 100%;
}

.input-container {
  flex: 1;
  display: flex;
  flex-direction: row;
  align-items: center;
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
  background-color: white;
}

.message-input-wrapper {
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
}

.link-button {
  position: relative;
  background: none;
  border: none;
  color: #6c757d;
  font-size: 14px;
  cursor: pointer;
  padding: 0 12px;
  height: 100%;
  display: flex;
  align-items: center;
  transition: all 0.2s ease;
}

.link-button:hover {
  color: #007bff;
  background-color: rgba(0, 123, 255, 0.1);
}

.emoji-button {
  position: relative;
  background: none;
  border: none;
  color: #6c757d;
  font-size: 14px;
  cursor: pointer;
  padding: 0 12px;
  height: 100%;
  display: flex;
  align-items: center;
  transition: all 0.2s ease;
}

.emoji-button:hover {
  color: #007bff;
  background-color: rgba(0, 123, 255, 0.1);
}

button {
  padding: 12px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  font-weight: 500;
}

button:hover:not(:disabled) {
  background-color: #0056b3;
}

button:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}

/* Estilo para el botón de eliminar mensaje */
.delete-message-btn {
  position: absolute;
  top: 5px;
  right: 5px;
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  font-size: 12px;
  padding: 2px 5px;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s;
}

.other-message .delete-message-btn {
  color: rgba(0, 0, 0, 0.5);
}

.message:hover .delete-message-btn {
  opacity: 1;
}

.delete-message-btn:hover {
  color: #dc3545;
}

/* Link Preview Styles */
.link-previews {
  margin-top: 10px;
  width: 100%;
}

.link-preview {
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 5px;
  cursor: pointer;
  border: 1px solid #e0e0e0;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  max-width: 300px;
}

.link-preview:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.own-message .link-preview {
  background-color: rgba(255, 255, 255, 0.9);
  color: #333;
}

.preview-content {
  display: flex;
  flex-direction: column;
}

.preview-image {
  width: 100%;
  height: 150px;
  overflow: hidden;
  position: relative;
}

.preview-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.preview-text {
  padding: 10px;
}

.preview-title {
  font-weight: bold;
  font-size: 14px;
  margin-bottom: 5px;
  color: #333;
}

.preview-description {
  font-size: 12px;
  color: #666;
  margin-bottom: 5px;
  line-height: 1.4;
}

.preview-site {
  font-size: 11px;
  color: #999;
  display: flex;
  align-items: center;
}

/* Responsive adjustments for mobile */
@media (max-width: 576px) {
  .link-preview {
    max-width: 250px;
  }

  .preview-image {
    height: 120px;
  }
}

/* Link Popup Styles */
.link-popup {
  position: absolute;
  bottom: 70px;
  left: 10px;
  right: 10px;
  max-width: 500px;
  margin: 0 auto;
  z-index: 1000;
  animation: fadeIn 0.2s ease;
}

.link-popup-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  border: 1px solid #ddd;
  max-width: 450px;
  width: 100%;
  margin: 0 auto;
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

.link-popup-content h4 {
  margin-top: 0;
  margin-bottom: 15px;
  color: #333;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
}

.link-input-group {
  margin-bottom: 15px;
}

.link-input-group label {
  display: block;
  margin-bottom: 5px;
  font-size: 14px;
  color: #555;
  font-weight: 500;
}

.link-input-group input {
  width: 100%;
  padding: 8px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.link-popup-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.insert-link-btn {
  padding: 8px 15px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.cancel-link-btn {
  padding: 8px 15px;
  background-color: #6c757d;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.insert-link-btn:hover {
  background-color: #0056b3;
}

.cancel-link-btn:hover {
  background-color: #5a6268;
}

/* Responsive adjustments */
@media (max-width: 576px) {
  .link-popup {
    bottom: 70px;
    left: 10px;
    right: 10px;
  }

  .chat-input {
    padding: 15px 10px;
  }

  button {
    padding: 10px 15px;
  }
}

.helper-text {
  display: block;
  font-size: 12px;
  color: #6c757d;
  margin-top: 5px;
  font-style: italic;
}

/* Estilo para el textarea de mensaje */
.message-textarea {
  flex: 1;
  padding: 10px;
  border: none;
  color: #000;
  outline: none;
  width: 100%;
  resize: none;
  overflow-y: hidden;
  line-height: 1.5;
  font-family: inherit;
  font-size: inherit;
  min-height: 40px;
  max-height: 120px;
}

/* Estilos para el área de enlace activo */
.active-link-container {
  width: 100%;
  padding: 8px 10px;
  background-color: #f5f5f5;
  border-radius: 8px 8px 0 0;
  margin-bottom: 10px;
  border-bottom: 1px solid #ddd;
}

.active-link {
  display: flex;
  align-items: center;
  background-color: rgba(0, 120, 215, 0.1);
  border: 1px solid rgba(0, 120, 215, 0.2);
  border-radius: 4px;
  padding: 6px 10px;
  position: relative;
  max-width: 100%;
  overflow: hidden;
}

.link-prefix {
  color: #007bff;
  font-weight: bold;
  margin-right: 4px;
}

.link-text {
  color: #0078d7;
  text-decoration: none;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
}

.remove-link-btn {
  background: none;
  border: none;
  color: #6c757d;
  cursor: pointer;
  padding: 4px 8px;
  font-size: 12px;
  margin-left: 8px;
  transition: color 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.remove-link-btn:hover {
  color: #dc3545;
}

.emoji-popup {
  position: absolute;
  bottom: 70px;
  right: 70px;
  z-index: 1000;
  animation: fadeIn 0.2s ease;
}

.emoji-popup-content {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  border: 1px solid #ddd;
  padding: 10px;
  width: 300px;
}

.emoji-categories {
  display: flex;
  overflow-x: auto;
  padding-bottom: 8px;
  margin-bottom: 8px;
  border-bottom: 1px solid #eee;
}

.emoji-category-btn {
  background: none;
  border: none;
  font-size: 18px;
  padding: 5px;
  cursor: pointer;
  margin-right: 5px;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.emoji-category-btn.active {
  background-color: #f0f0f0;
}

.emoji-grid {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 5px;
  max-height: 200px;
  overflow-y: auto;
}

.emoji-btn {
  background: none;
  border: none;
  font-size: 20px;
  padding: 5px;
  cursor: pointer;
  border-radius: 4px;
  transition: transform 0.1s ease;
}

.emoji-btn:hover {
  background-color: #f0f0f0;
  transform: scale(1.2);
}

/* Estilos para el contenedor de pedido de cantina */
.cantina-order-container {
  width: 100%;
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
  border: 1px solid #e9ecef;
}

.cantina-order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.cantina-order-header h4 {
  margin: 0;
  color: #28a745;
  font-size: 1rem;
}

.remove-order-btn {
  background: none;
  border: none;
  color: #6c757d;
  cursor: pointer;
  padding: 4px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.remove-order-btn:hover {
  background-color: #f1f1f1;
  color: #dc3545;
}

.cantina-order-items {
  max-height: 150px;
  overflow-y: auto;
  margin-bottom: 10px;
}

.cantina-order-item {
  display: flex;
  align-items: center;
  padding: 5px 0;
  border-bottom: 1px solid #e9ecef;
}

.cantina-order-item:last-child {
  border-bottom: none;
}

.item-quantity {
  font-weight: bold;
  margin-right: 8px;
  color: #495057;
}

.item-name {
  flex: 1;
  color: #212529;
}

.item-price {
  font-weight: bold;
  color: #28a745;
}

.cantina-order-total {
  text-align: right;
  font-weight: bold;
  color: #28a745;
  padding-top: 5px;
  border-top: 1px solid #e9ecef;
}
</style>
