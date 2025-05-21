<template>
  <div class="container mx-auto px-5 py-6 min-h-screen flex flex-col items-center animate-fade-in"
    style="max-width: 900px; margin-top: 2rem; padding-top: 2rem">
    <!-- Capçalera -->
    <div class="mb-12 mt-6 text-center w-full">
      <h2 class="text-2xl font-bold text-white mb-2">
        <span class="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
          Xats de Cantina
        </span>
      </h2>
      <p class="text-gray-400 text-sm">
        Gestiona les teves converses amb professors
      </p>
    </div>

    <!-- Estados de carga y vacíos -->
    <div v-if="loading" class="flex-1 flex items-center justify-center bg-slate-800/30 rounded-xl p-8 w-full">
      <div class="flex flex-col items-center">
        <div class="w-10 h-10 border-4 border-slate-600 border-t-purple-500 rounded-full animate-spin mb-4"></div>
        <p class="text-gray-400">Carregant xats...</p>
      </div>
    </div>

    <div v-else-if="error"
      class="flex-1 flex items-center justify-center bg-slate-800/30 rounded-xl p-8 border border-red-500/20 w-full">
      <p class="text-red-400">{{ error }}</p>
    </div>

    <div v-else-if="activeChat"
      class="chat-detail bg-slate-800/30 rounded-xl border border-slate-700/30 flex flex-col h-full flex-1 overflow-hidden w-full"
      style="max-height: calc(100vh - 180px); height: 600px">
      <div class="chat-header bg-slate-800/50 border-b border-slate-700/50 p-4 flex items-center">
        <button class="back-button p-2 text-gray-400 hover:text-purple-400 mr-2" @click="goBack">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"
            stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <h3 class="text-white font-medium">Xat amb {{ chatName }}</h3>
      </div>

      <div class="chat-messages flex-1 overflow-y-auto p-4 space-y-4" ref="messagesContainer"
        style="height: 100%; overflow-y: auto; scroll-behavior: smooth">
        <div v-if="chatLoading" class="flex justify-center items-center h-full">
          <div class="spinner h-8 w-8"></div>
        </div>

        <div v-else-if="messages.length === 0" class="flex justify-center items-center h-full">
          <div class="text-center p-6 bg-slate-700/30 rounded-xl max-w-md mx-auto">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-12 h-12 text-gray-500 mx-auto mb-4" fill="none"
              viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p class="text-gray-400">No hi ha missatges en aquest xat</p>
          </div>
        </div>

        <template v-else>
          <div v-for="(message, index) in messages" :key="index" class="message max-w-3/4" :class="{
            'ml-auto bg-blue-600/20 border border-blue-500/30 text-white':
              message.userId.toString() === currentUserId.toString(),
            'mr-auto bg-slate-700/50 text-white':
              message.userId.toString() !== currentUserId.toString(),
            'order-message border-green-500/30 bg-green-900/20':
              isOrderMessage(message.message),
          }">
            <div class="message-header flex justify-between text-xs opacity-70 mb-1">
              <span>{{ message.userName }}</span>
              <span>{{ formatDate(message.timestamp) }}</span>
            </div>
            <div class="message-content" v-html="formatMessage(message.message)"></div>
          </div>
          <!-- Elemento invisible para hacer scroll automático -->
          <div ref="endOfMessages"></div>
        </template>
      </div>

      <div class="chat-input p-4 bg-slate-800/50 border-t border-slate-700/50">
        <div class="flex items-end gap-2">
          <textarea v-model="newMessage" placeholder="Utilitzeu només respostes ràpides..."
            class="flex-1 bg-slate-700/20 border border-slate-600/30 rounded-lg p-3 text-gray-500 resize-none focus:outline-none min-h-[40px] max-h-[120px]"
            rows="1" disabled></textarea>
          <button
            class="bg-gradient-to-r from-blue-400/50 to-purple-400/50 text-white/70 px-4 py-3 rounded-lg font-medium cursor-not-allowed"
            disabled>
            Enviar
          </button>
        </div>

        <div class="quick-responses mt-4">
          <h4 class="text-sm text-gray-400 mb-2">
            Respostes ràpides
            <span class="text-blue-400 font-medium">(només disponibles)</span>
          </h4>
          <div class="flex flex-wrap gap-2">
            <button class="response-btn" @click="sendQuickResponse('✅ Comanda rebuda')">
              ✅ Comanda rebuda
            </button>
            <button class="response-btn" @click="
              sendQuickResponse(
                '🚚 La teva comanda està llesta per a recollir'
              )
              ">
              🚚 Llesta per a recollir
            </button>
            <button class="response-btn" @click="sendQuickResponse('❌ No està disponible')">
              ❌ No disponible
            </button>
            <button class="response-btn menu-btn" @click="sendMenuResponse" :class="{ 'opacity-50': menuLoading }"
              :disabled="menuLoading">
              🍽️ Enviar menú disponible
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="chats.length === 0" class="flex-1 flex items-center justify-center bg-slate-800/30 rounded-xl p-8">
      <div class="text-center">
        <svg class="w-16 h-16 mx-auto text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
        <p class="text-gray-400">No hi ha xats actius</p>
      </div>
    </div>

    <!-- Lista de chats organizada con filtros y búsqueda -->
    <div v-if="!activeChat && !loading && !error && chats.length > 0" class="flex-1 flex flex-col w-full">
      <!-- Filtros y búsqueda -->
      <div class="mb-4 bg-slate-800/50 rounded-xl p-4 border border-slate-700/30">
        <div class="flex flex-col md:flex-row gap-3">
          <!-- Barra de búsqueda -->
          <div class="relative flex-1">
            <input v-model="searchQuery" type="text" placeholder="Cerca per nom o contingut..."
              class="w-full bg-slate-700/30 border border-slate-600/50 rounded-lg px-4 py-2 pl-10 text-white placeholder-gray-400" />
            <svg class="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor"
              viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <!-- Botón de actualización -->
          <button @click="refreshChats"
            class="flex items-center gap-2 px-4 py-2 rounded-md bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 transition-colors text-sm"
            :class="{ 'opacity-50 cursor-wait': refreshing }" :disabled="refreshing">
            <svg class="w-4 h-4" :class="{ 'animate-spin': refreshing }" fill="none" stroke="currentColor"
              viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {{ refreshing ? "Actualitzant..." : "Actualitzar" }}
          </button>
        </div>

        <!-- Filtros de estado -->
        <div class="flex flex-wrap justify-center gap-2 mt-3">
          <button @click="currentFilter = 'all'" class="px-3 py-2 rounded-md text-sm font-medium transition-colors"
            :class="currentFilter === 'all'
                ? 'bg-blue-500 text-white'
                : 'bg-slate-700/30 text-gray-300 hover:bg-slate-700/50'
              ">
            Tots ({{ filteredChats.length }})
          </button>
          <button @click="currentFilter = 'new'" class="px-3 py-2 rounded-md text-sm font-medium transition-colors"
            :class="currentFilter === 'new'
                ? 'bg-blue-500 text-white'
                : 'bg-slate-700/30 text-gray-300 hover:bg-slate-700/50'
              ">
            <span class="flex items-center">
              <span class="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
              Nous ({{ getFilteredChatsByStatus("new").length }})
            </span>
          </button>
          <button @click="currentFilter = 'preparing'"
            class="px-3 py-2 rounded-md text-sm font-medium transition-colors" :class="currentFilter === 'preparing'
                ? 'bg-blue-500 text-white'
                : 'bg-slate-700/30 text-gray-300 hover:bg-slate-700/50'
              ">
            <span class="flex items-center">
              <span class="w-2 h-2 bg-yellow-400 rounded-full mr-2"></span>
              En preparació ({{ getFilteredChatsByStatus("preparing").length }})
            </span>
          </button>
          <button @click="currentFilter = 'ready'" class="px-3 py-2 rounded-md text-sm font-medium transition-colors"
            :class="currentFilter === 'ready'
                ? 'bg-blue-500 text-white'
                : 'bg-slate-700/30 text-gray-300 hover:bg-slate-700/50'
              ">
            <span class="flex items-center">
              <span class="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
              Llestes ({{ getFilteredChatsByStatus("ready").length }})
            </span>
          </button>
        </div>
      </div>

      <!-- Lista de chats con indicador de estado -->
      <ul class="flex-1 overflow-y-auto space-y-2 custom-scrollbar mx-auto w-full" style="max-height: 500px">
        <div v-if="filteredChats.length === 0" class="text-center p-4 text-gray-400">
          No s'han trobat xats amb els filtres actuals
        </div>

        <li v-for="chat in filteredChats" :key="chat._id"
          class="flex items-center p-4 rounded-xl border hover:border-slate-600 transition-all duration-300 cursor-pointer"
          :class="getChatStatusClass(chat)" @click="openChat(chat)">
          <!-- Indicador de estado -->
          <div class="w-3 h-3 rounded-full mr-3" :class="getChatStatusDot(chat)"></div>

          <div class="flex-1 overflow-hidden">
            <div class="flex justify-between items-center">
              <h3 class="font-medium text-white flex items-center">
                {{ getUserName(chat) }}
                <span v-if="getChatStatusText(chat)" class="ml-2 text-xs px-2 py-0.5 rounded-full"
                  :class="getChatStatusBadge(chat)">
                  {{ getChatStatusText(chat) }}
                </span>
              </h3>
              <span class="text-xs text-gray-400">{{
                getLastMessageTime(chat)
              }}</span>
            </div>
            <p class="text-sm text-gray-400">
              {{ getUserType(chat) }}
            </p>
            <p class="text-xs truncate mt-1" :class="{
              'text-white font-medium': hasNewMessages[chat._id],
              'text-gray-400': !hasNewMessages[chat._id],
            }">
              {{ getLastMessage(chat) }}
            </p>
          </div>
          <div v-if="hasNewMessages[chat._id]" class="w-3 h-3 bg-purple-500 rounded-full animate-pulse ml-2"></div>
        </li>
      </ul>
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

// Variables del estado
const API_URL = import.meta.env.VITE_CHAT_URL;
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
const searchQuery = ref("");
const currentFilter = ref("all");
const refreshing = ref(false);

// Referencias para el DOM
const endOfMessages = ref(null);

// Obtenir l'store i router
const appStore = useAppStore();
const router = useRouter();

// Id d'usuari actual (cantina)
const currentUserId = computed(() =>
  appStore.getUserId() ? appStore.getUserId().toString() : null
);

const currentUserName = computed(
  () => appStore.getUser()?.name || appStore.getUser()?.username || "Cantina"
);

// Verificar si l'usuari està autoritzat (ha de ser tipus cantina)
const isCanteenUser = computed(() => {
  return appStore.getUser()?.typeUsers_id === 5;
});

// Métodos para persistencia de mensajes no leídos
const getUnreadMessagesStorageKey = () => {
  return `cantina_unread_messages_${currentUserId.value}`;
};

const saveUnreadMessagesState = () => {
  if (currentUserId.value) {
    localStorage.setItem(
      getUnreadMessagesStorageKey(),
      JSON.stringify(hasNewMessages.value)
    );
  }
};

const loadUnreadMessagesState = () => {
  if (currentUserId.value) {
    const savedState = localStorage.getItem(getUnreadMessagesStorageKey());
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        hasNewMessages.value = parsedState;
      } catch (e) {
        console.error("Error loading unread messages state:", e);
      }
    }
  }
};

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
      const cacheData = {};
      usersResponse.forEach((user) => {
        cacheData[user.id] = {
          name: user.name || user.username,
          profile: user.profile,
          typeUsersId: user.typeUsers_id,
        };
      });
      usersCache.value = cacheData;
    }

    // Obtener todos los chats
    let chatsList = [];
    // try {
    //   // Intentar obtener los chats específicos del usuario cantina
    //   chatsList = await chatManager.getChatsByUser(
    //     parseInt(currentUserId.value)
    //   );
    // } catch (err) {
    //   console.error(
    //     "Error al obtenir chats per usuari, usant getAllChats:",
    //     err
    //   );

    //   // Si falla, obtener todos los chats y filtrar los de la cantina
    //   const allChats = await chatManager.getAllChats();
    //   chatsList = allChats.filter(
    //     (chat) =>
    //       chat.teachers && chat.teachers.includes(parseInt(currentUserId.value))
    //   );
    // }

    const allChats = await chatManager.getAllChats();
    
    chatsList = allChats.filter(
      (chat) => chat.teachers && chat.teachers.includes(parseInt(currentUserId.value))
    );

    // Filtrar solo chats que tienen al menos un mensaje
    chats.value = chatsList.filter(
      (chat) => chat.interaction && chat.interaction.length > 0
    );

    console.log("Chats carregats:", chats.value);

    // Cargar el estado de mensajes no leídos desde localStorage
    loadUnreadMessagesState();

    // Cargar menú items para respuestas rápidas
    await loadMenuItems();
  } catch (err) {
    console.error("Error al carregar els chats:", err);
    error.value =
      "Error al carregar els chats. Si us plau, torni-ho a intentar més tard.";
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
    console.error("Error al carregar ítems del menú:", error);
  }
};

// Obtener el nombre del usuario con el que se está chateando
const getUserName = (chat) => {
  if (!chat || !chat.teachers) return "Usuari desconegut";

  // Encontrar el ID del otro usuari (que no sea la cantina)
  const otherUserId = chat.teachers.find(
    (teacherId) => teacherId !== parseInt(currentUserId.value)
  );

  if (!otherUserId) return "Usuari desconegut";

  // Primero verificar en la caché de usuaris
  if (usersCache.value[otherUserId] && usersCache.value[otherUserId].name) {
    return usersCache.value[otherUserId].name;
  }

  // Buscar el usuari en la llista d'usuaris
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

// Obtener el tipo de usuario
const getUserType = (chat) => {
  if (!chat || !chat.teachers) return "";

  const otherUserId = chat.teachers.find(
    (teacherId) => teacherId !== parseInt(currentUserId.value)
  );

  if (!otherUserId) return "";

  // Buscar el tipo de usuario en la caché
  if (
    usersCache.value[otherUserId] &&
    usersCache.value[otherUserId].typeUsersId
  ) {
    const typeId = usersCache.value[otherUserId].typeUsersId;
    const type = userTypes.value.find((t) => t.id === typeId);
    return type ? type.name : "Usuari";
  }

  // Buscar el usuario en la lista
  const user = users.value.find((u) => u.id === otherUserId);
  if (user && user.typeUsers_id) {
    const type = userTypes.value.find((t) => t.id === user.typeUsers_id);
    return type ? type.name : "Usuari";
  }

  return "Usuari";
};

// Obtener el último mensaje de un chat
const getLastMessage = (chat) => {
  if (!chat || !chat.interaction || chat.interaction.length === 0) {
    return "No hi ha missatges";
  }

  const lastMsg = chat.interaction[chat.interaction.length - 1];
  const message = lastMsg.message || "";

  // Acortar el mensaje si es molt llarg
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

// Formatear mensaje con emojis y formato
const formatMessage = (message) => {
  if (!message) return "";

  // Reemplazar saltos de línea con <br>
  let formattedMessage = message.replace(/\n/g, "<br>");

  // Resaltar parts importants com preus i totals
  formattedMessage = formattedMessage.replace(
    /(\d+(?:\.\d+)?)\s*€/g,
    '<span class="text-green-400">$1 €</span>'
  );

  formattedMessage = formattedMessage.replace(
    /\*([^*]+)\*/g,
    '<span class="font-bold">$1</span>'
  );

  return formattedMessage;
};

// Verificar si un mensaje es una orden
const isOrderMessage = (message) => {
  return (
    message &&
    (message.includes("*Nou Pedido*") ||
      message.includes("🛒") ||
      message.includes("pedido") ||
      message.includes("comanda"))
  );
};

// Scroll fins al final dels missatges
const scrollToBottom = () => {
  nextTick(() => {
    // Utilitzar l'element de referència al final dels missatges per fer scroll
    if (endOfMessages.value) {
      endOfMessages.value.scrollIntoView({ behavior: "smooth" });
    }
    // Mètode alternatiu utilitzant el contenidor de missatges
    else if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }
  });
};

// Observar canvis en els missatges per fer scroll
watch(messages, () => {
  if (activeChat.value && messages.value.length > 0) {
    scrollToBottom();
  }
});

// Abrir un chat específico
const openChat = async (chat) => {
  try {
    chatLoading.value = true;
    activeChat.value = chat;

    // Establecer nombre del chat
    chatName.value = getUserName(chat);

    // Marcar missatges com llegits
    if (hasNewMessages.value[chat._id]) {
      hasNewMessages.value[chat._id] = false;
      // Guardar l'estat actualitzat
      saveUnreadMessagesState();
    }

    // Carregar missatges
    const chatData = await chatManager.getChatById(chat._id);
    if (!chatData || !chatData.interaction) {
      throw new Error("No s'han pogut carregar els missatges");
    }

    // Convertir missatges al format desitjat
    messages.value = chatData.interaction.map((msg) => {
      const isCurrentUser = msg.teacherId === currentUserId.value.toString();
      return {
        id: msg._id,
        userId: msg.teacherId,
        userName: isCurrentUser ? "Cantina" : getUserName(chat),
        message: msg.message,
        timestamp: new Date(msg.date),
      };
    });

    chatLoading.value = false;

    // Fer scroll a l'últim missatge después de renderizar
    scrollToBottom();
  } catch (error) {
    console.error("Error al obrir xat:", error);
    chatLoading.value = false;
    error.value =
      "Error al carregar els missatges. Si us plau, torna-ho a provar.";
  }
};

// Volver a la lista de chats
const goBack = () => {
  activeChat.value = null;
  messages.value = [];
  chatName.value = "";
  newMessage.value = "";
};

// Enviar mensaje
const sendMessage = async () => {
  // La función principal de envío sólo es llamada desde las respuestas rápidas
  if (!activeChat.value) return;

  try {
    const messageText = newMessage.value.trim();

    // Solo continuar si el mensaje viene de una respuesta rápida
    if (!messageText) return;

    // Agregar mensaje localmente primero para UI inmediata
    messages.value.push({
      id: Date.now().toString(),
      userId: currentUserId.value,
      userName: currentUserName.value,
      message: messageText,
      timestamp: new Date(),
    });

    // Limpiar input
    newMessage.value = "";

    // Scroll al fondo
    await nextTick();
    scrollToBottom();

    // Enviar mensaje al servidor
    await chatManager.sendMessage(
      activeChat.value._id,
      currentUserId.value,
      messageText
    );
  } catch (error) {
    console.error("Error al enviar missatge:", error);
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
    let menuMessage = "🍽️ *Menú disponible avui:*\n\n";

    if (menuItems.value && menuItems.value.length > 0) {
      menuItems.value.forEach((item) => {
        menuMessage += `• ${item.product_name} - ${Number(
          item.product_price
        ).toFixed(2)} €\n`;
      });
    } else {
      menuMessage +=
        "Lo sentimos, no hi ha productes disponibles en aquest moment.";
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

// Conectar al socket
const connectSocket = () => {
  try {
    // Iniciar connexió amb socket.io
    socket.value = io(API_URL, {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    // Esdeveniment de connexió establerta
    socket.value.on("connect", () => {
      console.log("Connectat al servidor de chat");

      // Registrar l'usuari per rebre notificacions
      socket.value.emit("register_user", {
        userId: currentUserId.value,
        userName: currentUserName.value,
      });

      // Unir-se a tots els xats per rebre actualitzacions
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

    // Configurar listeners per missatges, etc.
    setupSocketListeners();
  } catch (error) {
    console.error("Error al connectar amb socket.io:", error);
  }
};

// Configurar listeners del socket
const setupSocketListeners = () => {
  if (!socket.value) return;

  // Escuchar nous missatges
  socket.value.on("new_message", handleNewMessage);

  // Escuchar quan es crea un nou chat
  socket.value.on("new_chat_created", handleNewChat);
};

// Manejar nous missatges
const handleNewMessage = (data) => {
  try {
    // Extraer informació del missatge
    let messageInfo = {
      chatId: null,
      userId: null,
      message: null,
    };

    // Procesar diferents formats
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

    // No procesar missatges propis
    if (messageInfo.userId === currentUserId.value) {
      return;
    }

    // Si es un chat obert actualment, añadir el mensaje
    if (activeChat.value && activeChat.value._id === messageInfo.chatId) {
      // Encontrar el usuari que envió el mensaje
      const userName = getUserName(activeChat.value);

      // Añadir mensaje a la lista
      messages.value.push({
        id: Date.now().toString(),
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
      // Guardar el estado actualizado
      saveUnreadMessagesState();

      // Actualizar la lista de chats si es necesario
      const chatExists = chats.value.some((c) => c._id === messageInfo.chatId);
      if (!chatExists) {
        loadChats(); // Recargar chats si es un chat nuevo
      }
    }
  } catch (error) {
    console.error("Error al processar nou missatge:", error);
  }
};

// Manejar nou chat
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

// Lista de chats filtrada
const filteredChats = computed(() => {
  // Primero filtramos por la búsqueda
  let result = chats.value;

  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim();
    result = result.filter((chat) => {
      // Buscar en nombre del usuario
      const userName = getUserName(chat).toLowerCase();
      if (userName.includes(query)) return true;

      // Buscar en el último mensaje
      const lastMessage = getLastMessage(chat).toLowerCase();
      if (lastMessage.includes(query)) return true;

      return false;
    });
  }

  // Luego aplicar filtro por estado
  if (currentFilter.value !== "all") {
    result = getFilteredChatsByStatus(currentFilter.value);
  }

  return result;
});

// Función para obtener chats filtrados por estado
const getFilteredChatsByStatus = (status) => {
  return chats.value.filter((chat) => getChatStatus(chat) === status);
};

// Función para determinar el estado de un chat según sus mensajes
const getChatStatus = (chat) => {
  // Si hay mensajes no leídos, es nuevo
  if (hasNewMessages.value[chat._id]) {
    return "new";
  }

  // Si no, verificamos el último estado según los mensajes
  const messages = chat.interaction || [];

  // Recorrer los mensajes en orden inverso para encontrar el más reciente
  for (let i = messages.length - 1; i >= 0; i--) {
    const msg = messages[i];

    // Verificar si es un mensaje de la cantina
    if (msg.teacherId.toString() === currentUserId.value.toString()) {
      if (
        msg.message.includes("🚚 La teva comanda està llesta per a recollir")
      ) {
        return "ready";
      } else if (msg.message.includes("✅ Comanda rebuda")) {
        return "preparing";
      }
    }
  }

  // Si llegamos aquí sin clasificación y el último mensaje es del cliente, es nuevo
  if (messages.length > 0) {
    const lastMsg = messages[messages.length - 1];
    if (lastMsg.teacherId.toString() !== currentUserId.value.toString()) {
      return "new";
    }
  }

  // Si no tiene ningún estado específico, considerarlo sin clasificar
  return "new";
};

// Clase CSS para el fondo del chat según su estado
const getChatStatusClass = (chat) => {
  const status = getChatStatus(chat);
  switch (status) {
    case "new":
      return "bg-slate-800/50 border-blue-500/30";
    case "preparing":
      return "bg-slate-800/50 border-yellow-500/30";
    case "ready":
      return "bg-slate-800/50 border-green-500/30";
    default:
      return "bg-slate-800/50 border-slate-700/30";
  }
};

// Clase para el indicador de estado (punto de color)
const getChatStatusDot = (chat) => {
  const status = getChatStatus(chat);
  switch (status) {
    case "new":
      return "bg-blue-400";
    case "preparing":
      return "bg-yellow-400";
    case "ready":
      return "bg-green-400";
    default:
      return "bg-gray-400";
  }
};

// Texto del estado para mostrar en el badge
const getChatStatusText = (chat) => {
  const status = getChatStatus(chat);
  switch (status) {
    case "new":
      return "Nou";
    case "preparing":
      return "En preparació";
    case "ready":
      return "Llest";
    default:
      return "";
  }
};

// Clase para el badge de estado
const getChatStatusBadge = (chat) => {
  const status = getChatStatus(chat);
  switch (status) {
    case "new":
      return "bg-blue-500/20 text-blue-300";
    case "preparing":
      return "bg-yellow-500/20 text-yellow-300";
    case "ready":
      return "bg-green-500/20 text-green-300";
    default:
      return "bg-gray-500/20 text-gray-300";
  }
};

// Hora del último mensaje formateada
const getLastMessageTime = (chat) => {
  if (!chat.interaction || chat.interaction.length === 0) {
    return "";
  }

  const lastMsg = chat.interaction[chat.interaction.length - 1];
  return formatDate(new Date(lastMsg.date));
};

// Función para actualizar la lista de chats
const refreshChats = async () => {
  try {
    refreshing.value = true;
    await loadChats();
  } catch (error) {
    console.error("Error al actualitzar la llista de xats:", error);
  } finally {
    refreshing.value = false;
  }
};
</script>

<style>
/* Estils per spinner */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.spinner {
  border: 4px solid rgba(124, 58, 237, 0.1);
  border-left-color: rgba(124, 58, 237, 0.8);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

/* Animacions personalitzades */
@keyframes pulse {
  0% {
    opacity: 0.5;
  }

  50% {
    opacity: 1;
  }

  100% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.8s ease-out forwards;
}

/* Estils per als missatges */
.message {
  padding: 1rem;
  border-radius: 0.75rem;
  max-width: 80%;
  word-break: break-word;
}

.order-message {
  border-left: 4px solid;
}

/* Estils per botons de resposta ràpida */
.response-btn {
  background-color: rgba(51, 65, 85, 0.8);
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
  border: 1px solid rgba(20, 184, 166, 0.4);
}

.menu-btn:hover {
  background-color: rgba(20, 184, 166, 0.3);
}

/* Scrollbar personalitzat */
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: rgba(124, 58, 237, 0.5) rgba(30, 41, 59, 0.5);
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(30, 41, 59, 0.5);
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(124, 58, 237, 0.5);
  border-radius: 10px;
}
</style>