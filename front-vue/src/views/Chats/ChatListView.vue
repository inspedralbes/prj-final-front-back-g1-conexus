<template>
  <div
    class="max-w-4xl mx-auto px-5 py-6 min-h-screen flex flex-col animate-fade-in"
  >
    <!-- Capçalera -->
    <div class="mb-8">
      <h2 class="text-2xl font-bold text-white mb-2">
        <span
          class="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400"
        >
          Conversacions
        </span>
      </h2>
      <p class="text-gray-400 text-sm">
        Gestiona les teves conversacione amb professors i cantina
      </p>
    </div>

    <!-- Filtros -->
    <div class="flex flex-col gap-4 mb-6">
      <div class="flex gap-3 w-full">
        <div class="flex-1 relative">
          <input
            type="text"
            v-model="searchTerm"
            @input="filterUsers"
            placeholder="Buscar usuari..."
            class="w-full px-4 py-3 pl-10 bg-slate-800/50 border border-slate-700/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all hover:border-purple-500/50"
          />
          <svg
            class="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <div class="relative" ref="filterRef">
          <button
            class="p-3 rounded-xl bg-slate-800/50 border border-slate-700/30 text-gray-400 hover:text-purple-400 hover:border-purple-500/50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
            :class="{
              'bg-purple-500/10 text-purple-400 border-purple-500/30':
                selectedUserType !== 'all' || showFilterMenu,
            }"
            @click="(event) => toggleFilterMenu(event)"
            title="Filtrar por tipo"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-5 h-5 transition-transform duration-300"
              :class="{
                'rotate-6': selectedUserType !== 'all' || showFilterMenu,
              }"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <polygon
                points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"
              ></polygon>
            </svg>
            <!-- Indicador de filtro activo -->
            <span
              v-if="selectedUserType !== 'all'"
              class="absolute bottom-1 right-1 w-2 h-2 bg-purple-500 rounded-full"
            ></span>
          </button>
          <!-- Menú desplegable -->
          <div
            v-if="showFilterMenu"
            class="absolute top-full right-0 mt-2 w-48 bg-slate-800 border border-slate-700/50 rounded-xl shadow-lg overflow-hidden z-10 animate-dropdown"
          >
            <div
              class="p-3 hover:bg-slate-700/50 cursor-pointer transition-colors border-b border-slate-700/30"
              :class="{
                'bg-purple-500/10 text-purple-400': selectedUserType === 'all',
              }"
              @click="selectFilter('all')"
            >
              <span>Tots els tipus</span>
            </div>
            <div
              v-for="type in filteredUserTypes"
              :key="type.id"
              class="p-3 hover:bg-slate-700/50 cursor-pointer transition-colors border-b border-slate-700/30 last:border-b-0"
              :class="{
                'bg-purple-500/10 text-purple-400':
                  selectedUserType === type.id,
              }"
              @click="selectFilter(type.id)"
            >
              <span>{{ type.name }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Pestañas de navegación -->
      <div class="flex border-b border-slate-700/30">
        <button
          class="px-4 py-3 text-gray-400 hover:text-purple-400 transition-colors relative"
          :class="{ 'text-purple-400 font-medium': activeTab === 'existing' }"
          @click="activeTab = 'existing'"
        >
          Existents
          <span
            v-if="activeTab === 'existing'"
            class="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-purple-500 to-blue-500"
          ></span>
        </button>
        <button
          class="px-4 py-3 text-gray-400 hover:text-purple-400 transition-colors relative flex items-center"
          :class="{ 'text-purple-400 font-medium': activeTab === 'unread' }"
          @click="activeTab = 'unread'"
        >
          No llegits
          <span
            v-if="unreadChatsCount > 0"
            class="ml-1.5 flex items-center justify-center min-w-[18px] h-5 px-1 text-xs font-semibold rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white"
          >
            {{ unreadChatsCount }}
          </span>
          <span
            v-if="activeTab === 'unread'"
            class="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-purple-500 to-blue-500"
          ></span>
        </button>
        <button
          class="px-4 py-3 text-gray-400 hover:text-purple-400 transition-colors relative"
          :class="{ 'text-purple-400 font-medium': activeTab === 'all' }"
          @click="activeTab = 'all'"
        >
          Tots
          <span
            v-if="activeTab === 'all'"
            class="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-purple-500 to-blue-500"
          ></span>
        </button>
      </div>
    </div>

    <!-- Estados de carga y vacíos -->
    <div
      v-if="loading"
      class="flex-1 flex items-center justify-center bg-slate-800/30 rounded-xl p-8"
    >
      <div class="flex flex-col items-center">
        <div
          class="w-10 h-10 border-4 border-slate-600 border-t-purple-500 rounded-full animate-spin mb-4"
        ></div>
        <p class="text-gray-400">Carregant converses...</p>
      </div>
    </div>

    <div
      v-else-if="error"
      class="flex-1 flex items-center justify-center bg-slate-800/30 rounded-xl p-8 border border-red-500/20"
    >
      <p class="text-red-400">{{ error }}</p>
    </div>

    <div
      v-else-if="displayedUsers.length === 0"
      class="flex-1 flex items-center justify-center bg-slate-800/30 rounded-xl p-8"
    >
      <div class="text-center">
        <svg
          class="w-16 h-16 mx-auto text-gray-600 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
          />
        </svg>
        <p v-if="activeTab === 'existing'" class="text-gray-400">
          No tens converses existents
        </p>
        <p v-else class="text-gray-400">No s'han trobat converses</p>
      </div>
    </div>

    <!-- Lista de Usuarios -->
    <ul v-else class="flex-1 overflow-y-auto space-y-2 custom-scrollbar">
      <li
        v-for="user in displayedUsers"
        :key="user.id"
        class="flex items-center p-3 bg-slate-800/50 rounded-xl border border-slate-700/30 hover:border-slate-600 transition-all duration-300 cursor-pointer"
      >
        <!-- Avatar section commented out
        <div class="relative" @click="selectUser(user)">
          <img
            :src="user.profile || defaultAvatar"
            :alt="user.name || user.username"
            class="w-12 h-12 rounded-full object-cover border-2 border-slate-700"
          />
          <div
            v-if="hasNewMessages[user.id]"
            class="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-800 animate-pulse"
          ></div>
        </div>
        -->
        <div class="flex-1 ml-4 overflow-hidden" @click="selectUser(user)">
          <h3 class="font-medium text-white">
            {{ user.name || user.username }}
          </h3>
          <p class="text-sm text-gray-400">
            {{ getUserTypeName(user.typeUsers_id) }}
          </p>
          <p
            v-if="typingUsers[user.id]"
            class="text-xs text-gray-400 flex items-center mt-1"
          >
            <span
              class="inline-block w-1.5 h-1.5 bg-gray-400 rounded-full mr-0.5 animate-typing-dot"
            ></span>
            <span
              class="inline-block w-1.5 h-1.5 bg-gray-400 rounded-full mr-0.5 animate-typing-dot animation-delay-200"
            ></span>
            <span
              class="inline-block w-1.5 h-1.5 bg-gray-400 rounded-full animate-typing-dot animation-delay-400"
            ></span>
          </p>
          <p
            v-else-if="getUserLastMessage(user)"
            class="text-xs truncate mt-1"
            :class="{
              'text-white font-medium': hasNewMessages[user.id],
              'text-gray-400': !hasNewMessages[user.id],
            }"
          >
            {{ getUserLastMessage(user) }}
          </p>
        </div>
        <button
          v-if="hasExistingChat(user)"
          @click="deleteUserChat(user)"
          class="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-full transition-colors focus:outline-none"
          title="Eliminar conversación"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </li>
    </ul>

    <!-- Modal de confirmación para eliminar chat -->
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 z-50 flex items-center justify-center"
    >
      <div
        class="absolute inset-0 bg-black/50"
        @click="showDeleteModal = false"
      ></div>
      <div
        class="relative bg-slate-800 rounded-lg shadow-lg p-5 border border-slate-700 w-full max-w-sm mx-4 animate-fade-in"
      >
        <div
          class="flex justify-between items-center mb-3 pb-2 border-b border-slate-700"
        >
          <h4 class="text-lg font-medium text-white">Confirmar eliminació</h4>
          <button
            @click="showDeleteModal = false"
            class="p-1 text-gray-400 hover:text-red-400 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-4 h-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
        </div>
        <p class="text-gray-300 mb-4">
          Estàs segur que vols eliminar aquesta conversa? Aquesta acció no es
          pot desfer.
        </p>
        <div class="flex gap-3 justify-end">
          <button
            @click="showDeleteModal = false"
            class="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-all"
          >
            Cancel·lar
          </button>
          <button
            @click="confirmDeleteChat"
            class="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-all hover:-translate-y-1 duration-200"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch, onUnmounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import {
  getAllUsers,
  getAllTypeUsers,
} from "@/services/communicationsScripts/mainManager";
import chatManager from "@/services/communicationsScripts/chatsComManager";
import { useAppStore } from "@/stores";
import io from "socket.io-client";

// Estado
const API_URL = import.meta.env.VITE_CHAT_URL;
const users = ref([]);
const userTypes = ref([]);
const loading = ref(true);
const error = ref(null);
const searchTerm = ref("");
const selectedUserType = ref("all");
const existingChats = ref([]);
const activeTab = ref("existing"); // "existing" o "all"
const userMessages = ref({}); // Para almacenar el último mensaje de cada usuario
const socket = ref(null); // Socket.io connection
const hasNewMessages = ref({}); // Para marcar chats con mensajes nuevos
const deletedChats = ref(new Set());
const activeChats = ref(new Set());
const typingUsers = ref({}); // Para almacenar qué usuarios están escribiendo
const showFilterMenu = ref(false);
const filterRef = ref(null); // Referencia al contenedor del filtro
const disableNotifications = ref(true);
const showDeleteModal = ref(false);
const userToDelete = ref(null);

// Imagen por defecto como data URL
const defaultAvatar =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%236B7280'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z'/%3E%3C/svg%3E";

// Obtener el store de la aplicación
const appStore = useAppStore();
const router = useRouter();
const route = useRoute();

// Usuario actual
const currentUserId = computed(() =>
  appStore.getUserId() ? appStore.getUserId().toString() : null
);

// Observar cambios en la pestaña activa para refrescar la lista
watch(activeTab, () => {
  filterUsers();
});

// Filtrar tipos de usuario para mostrar solo profesores y cantina
const filteredUserTypes = computed(() => {
  return userTypes.value.filter((type) => type.id === 1 || type.id === 5);
});

// Usuarios filtrados (solo profesores y cantina)
const filteredUsers = computed(() => {
  return users.value.filter((user) => {
    // Filtrar por término de búsqueda
    const matchesSearch =
      !searchTerm.value ||
      (user.name &&
        user.name.toLowerCase().includes(searchTerm.value.toLowerCase())) ||
      (user.username &&
        user.username.toLowerCase().includes(searchTerm.value.toLowerCase())) ||
      (user.email &&
        user.email.toLowerCase().includes(searchTerm.value.toLowerCase()));

    // Filtrar solo profesores (type 1) y cantina (type 5)
    const isTeacherOrCanteen =
      user.typeUsers_id === 1 || user.typeUsers_id === 5;

    // Filtrar por tipo de usuario seleccionado
    const matchesSelectedType =
      selectedUserType.value === "all" ||
      user.typeUsers_id === parseInt(selectedUserType.value);

    // No mostrar al usuario actual
    const isNotCurrentUser = user.id.toString() !== currentUserId.value;

    return (
      matchesSearch &&
      isTeacherOrCanteen &&
      matchesSelectedType &&
      isNotCurrentUser
    );
  });
});

// Usuarios a mostrar según la pestaña seleccionada
const displayedUsers = computed(() => {
  if (activeTab.value === "existing") {
    // Solo usuarios con chats existentes, que no hayan sido eliminados y que tengan al menos un mensaje
    return filteredUsers.value.filter((user) => {
      const chat = findChatWithUser(user);
      return (
        chat &&
        !deletedChats.value.has(chat._id) &&
        chat.interaction &&
        chat.interaction.length > 0
      );
    });
  } else if (activeTab.value === "unread") {
    // Solo usuarios con mensajes no leídos
    return filteredUsers.value.filter((user) => {
      const chat = findChatWithUser(user);
      return (
        chat &&
        !deletedChats.value.has(chat._id) &&
        hasNewMessages.value[user.id]
      );
    });
  } else {
    // Todos los usuarios filtrados
    return filteredUsers.value;
  }
});

// Comprobar si hay un chat existente con este usuario
const hasExistingChat = (user) => {
  const chat = findChatWithUser(user);
  return (
    chat &&
    !deletedChats.value.has(chat._id) &&
    chat.interaction &&
    chat.interaction.length > 0
  );
};

// Métodos
const filterUsers = () => {
  // La filtración se hace automáticamente a través del computed property
};

const getUserTypeName = (typeId) => {
  const type = userTypes.value.find((t) => t.id === typeId);
  return type ? type.name : "Usuario";
};

// Obtener el último mensaje intercambiado con un usuario
const getUserLastMessage = (user) => {
  if (!userMessages.value[user.id]) return "";
  return userMessages.value[user.id];
};

// Función para guardar el estado de mensajes no leídos en localStorage
const saveUnreadMessagesState = () => {
  const unreadState = {};

  // Solo guardar los IDs de usuarios con mensajes no leídos
  Object.entries(hasNewMessages.value).forEach(([userId, isUnread]) => {
    if (isUnread) {
      unreadState[userId] = true;
    }
  });

  localStorage.setItem(
    `chat_unread_${currentUserId.value}`,
    JSON.stringify(unreadState)
  );
  // console.log("Estado de mensajes no leídos guardado:", unreadState);
};

// Función para cargar el estado de mensajes no leídos desde localStorage
const loadUnreadMessagesState = () => {
  try {
    const savedState = localStorage.getItem(
      `chat_unread_${currentUserId.value}`
    );
    if (savedState) {
      const parsedState = JSON.parse(savedState);
      // Fusionar con el estado actual
      hasNewMessages.value = { ...hasNewMessages.value, ...parsedState };
      // console.log("Estado de mensajes no leídos cargado:", parsedState);
    }
  } catch (error) {
    console.error("Error al cargar estado de mensajes no leídos:", error);
  }
};

const selectUser = async (user) => {
  try {
    loading.value = true;

    // Clear notification for this user when entering the chat
    if (hasNewMessages.value[user.id]) {
      hasNewMessages.value[user.id] = false;
      // Guardar el cambio en localStorage
      saveUnreadMessagesState();
    }

    // Verificar si ya existe un chat entre estos usuarios
    const existingChat = findChatWithUser(user);

    let chatId;

    if (existingChat) {
      // Usar el chat existente
      chatId = existingChat._id;
      // console.log("Usando chat existente:", chatId);

      // Si el chat estaba marcado como eliminado, restaurarlo
      if (deletedChats.value.has(chatId)) {
        // console.log(`Restaurando chat eliminado: ${chatId}`);
        deletedChats.value.delete(chatId);
        saveDeletedChats();
      }
    } else {
      // Crear un nuevo chat entre estos usuarios
      const newChat = await chatManager.createChat({
        name: `Chat entre ${appStore.getUser().name || "Usuario"} y ${
          user.name || user.username || "Usuario"
        }`,
        teachers: [parseInt(currentUserId.value), parseInt(user.id)],
        interaction: [],
        requesterId: currentUserId.value,
      });

      chatId = newChat._id;
      // console.log("Nuevo chat creado:", newChat);

      // Actualizar la lista de chats existentes
      await loadUserChats();

      // Unirse al nuevo chat para recibir notificaciones
      if (socket.value && socket.value.connected) {
        socket.value.emit("join_chat", {
          chatId: chatId,
          userId: currentUserId.value,
          userName:
            appStore.getUser()?.name ||
            appStore.getUser()?.username ||
            "Usuario",
        });
      }
    }

    // Navegar al chat
    router.push({
      name: "chat-detail",
      params: { chatId },
    });
  } catch (error) {
    console.error("Error al seleccionar usuario:", error);
    error.value = "No se pudo iniciar el chat. Intente de nuevo más tarde.";
  } finally {
    loading.value = false;
  }
};

// Watch para actualizar la suscripción a los chats si cambian
watch(
  existingChats,
  (newChats) => {
    if (socket.value && socket.value.connected) {
      for (const chat of newChats) {
        if (chat._id) {
          // Suscribirse a los nuevos chats para recibir actualizaciones
          socket.value.emit("join_chat", {
            chatId: chat._id,
            userId: currentUserId.value,
            userName:
              appStore.getUser()?.name ||
              appStore.getUser()?.username ||
              "Usuario",
          });
          // console.log(`Suscrito a actualizaciones del chat: ${chat._id}`);
        }
      }
    }
  },
  { deep: true }
);

// Cargar los chats del usuario actual y extraer los últimos mensajes
const loadUserChats = async () => {
  try {
    // Intentar obtener los chats del usuario primero con getChatsByUser
    let chatsResponse;
    try {
      chatsResponse = await chatManager.getChatsByUser(
        parseInt(currentUserId.value)
      );
    } catch (error) {
      console.warn(
        "Error al obtener chats por usuario, intentando con getAllChats:",
        error
      );
      // Si falla, usar getAllChats como alternativa
      const allChats = await chatManager.getAllChats();
      chatsResponse = allChats.filter(
        (chat) =>
          chat.teachers && chat.teachers.includes(parseInt(currentUserId.value))
      );
    }

    // Si tenemos chats, actualizar la lista pero filtrando los eliminados
    if (chatsResponse && Array.isArray(chatsResponse)) {
      // Guardar todos los chats para tener el acceso completo
      existingChats.value = chatsResponse;
      // console.log("Chats del usuario cargados:", existingChats.value);

      // Extraer los últimos mensajes para cada usuario
      userMessages.value = {};

      // No reiniciar hasNewMessages para mantener estado de mensajes no leídos

      for (const chat of existingChats.value) {
        if (chat.interaction && chat.interaction.length > 0) {
          // Encontrar el ID del otro usuario
          const otherUserId = chat.teachers.find(
            (teacherId) => teacherId !== parseInt(currentUserId.value)
          );

          if (otherUserId) {
            // Obtener el último mensaje
            const lastMessage = chat.interaction[chat.interaction.length - 1];
            userMessages.value[otherUserId] =
              lastMessage.message.length > 30
                ? lastMessage.message.substring(0, 30) + "..."
                : lastMessage.message;
          }
        }
      }

      return true; // Indicar que el método se ejecutó correctamente
    } else {
      console.warn(
        "No se pudieron cargar los chats o no hay chats disponibles"
      );
      return false;
    }
  } catch (error) {
    console.error("Error grave al cargar chats del usuario:", error);
    return false;
  }
};

const deleteUserChat = async (user) => {
  userToDelete.value = user;
  showDeleteModal.value = true;
};

// Add the confirmDeleteChat function to handle actual deletion
const confirmDeleteChat = async () => {
  try {
    loading.value = true;
    showDeleteModal.value = false;

    const user = userToDelete.value;
    if (!user) return;

    // Buscar un chat existente donde participen ambos usuarios
    const existingChat = findChatWithUser(user);

    if (existingChat) {
      // Marcar el chat como eliminado localmente
      deletedChats.value.add(existingChat._id);
      saveDeletedChats();

      // Limpiar el mensaje no leído del usuario si existe
      if (hasNewMessages.value[user.id]) {
        hasNewMessages.value[user.id] = false;
        saveUnreadMessagesState(); // Guardar el cambio en localStorage
        appStore.updateUnreadMessagesCount(); // Actualizar contador en el store
      }

      // Forzar actualización de la UI
      filteredUsers.value = [...filteredUsers.value];
    }

    // Reset userToDelete
    userToDelete.value = null;
  } catch (error) {
    console.error("Error al eliminar el chat:", error);
    error.value = "No se pudo eliminar el chat. Intente de nuevo más tarde.";
  } finally {
    loading.value = false;
  }
};

// Función para conectar a Socket.io para actualizaciones en tiempo real
const connectToSocket = () => {
  try {
    // Iniciar conexión con socket.io
    socket.value = io(API_URL, {
      transports: ["websocket", "polling"], // Permitir polling como fallback
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    // Log para debugging
    console.log("Intentando conectar al socket en:", API_URL);

    // Evento de conexión establecida
    socket.value.on("connect", () => {
      console.log(
        "Conectado al servidor de chat para actualizaciones en tiempo real"
      );

      // Registrar el usuario para recibir notificaciones
      socket.value.emit("register_user", {
        userId: currentUserId.value,
        userName:
          appStore.getUser()?.name || appStore.getUser()?.username || "Usuario",
      });

      // Unirse a todos los chats existentes del usuario para recibir actualizaciones
      for (const chat of existingChats.value) {
        if (chat._id) {
          socket.value.emit("join_chat", {
            chatId: chat._id,
            userId: currentUserId.value,
            userName:
              appStore.getUser()?.name ||
              appStore.getUser()?.username ||
              "Usuario",
          });
          // console.log(`Suscrito a actualizaciones del chat: ${chat._id}`);
        }
      }
    });

    // Escuchar nuevos mensajes
    socket.value.on("new_message", handleNewMessage);

    // Escuchar cuando alguien está escribiendo
    socket.value.on("user_typing", (data) => {
      if (data.userId.toString() !== currentUserId.value.toString()) {
        // Buscar el chat correspondiente
        const chat = existingChats.value.find((c) => c._id === data.chatId);

        if (chat) {
          // Encontrar el ID del otro usuario en el chat
          const otherUserId = chat.teachers.find(
            (teacherId) => teacherId !== parseInt(currentUserId.value)
          );

          if (otherUserId) {
            // Actualizar el estado de escritura para este usuario
            typingUsers.value = {
              ...typingUsers.value,
              [otherUserId]: data.isTyping,
            };

            // Si el usuario deja de escribir, eliminar después de un tiempo
            if (!data.isTyping) {
              setTimeout(() => {
                if (typingUsers.value[otherUserId] === false) {
                  const updatedTypingUsers = { ...typingUsers.value };
                  delete updatedTypingUsers[otherUserId];
                  typingUsers.value = updatedTypingUsers;
                }
              }, 1000);
            }
          }
        }
      }
    });

    // Escuchar cuando se recibe el primer mensaje en un chat
    socket.value.on("chat_first_message", async (data) => {
      // console.log("Notificación de primer mensaje en chat recibida:", data);

      try {
        // Si tenemos los datos completos del chat
        if (data.chatData) {
          // console.log(
          //   "Datos completos del chat recibidos con el primer mensaje"
          // );

          // Verificar si este chat debe pertenecer al usuario actual
          if (
            data.chatData.teachers &&
            data.chatData.teachers.includes(parseInt(currentUserId.value))
          ) {
            // Verificar si el chat ya existe en nuestra lista
            const chatExists = existingChats.value.some(
              (chat) => chat._id === data.chatId
            );

            if (!chatExists) {
              // Añadir el chat a la lista existente inmediatamente
              existingChats.value.push(data.chatData);
              // console.log("Chat con primer mensaje añadido a la lista local");

              // Procesar el mensaje para actualizar la vista
              if (data.userId && data.message) {
                // Encontrar el ID del otro usuario
                const otherUserId = data.chatData.teachers.find(
                  (teacherId) => teacherId !== parseInt(currentUserId.value)
                );

                if (otherUserId) {
                  // Actualizar el último mensaje para este usuario
                  userMessages.value[otherUserId] =
                    data.message.length > 30
                      ? data.message.substring(0, 30) + "..."
                      : data.message;

                  // Marcar como no leído
                  hasNewMessages.value[otherUserId] = true;
                  saveUnreadMessagesState();
                  appStore.updateUnreadMessagesCount();
                }
              }
            }

            // De todas formas, recargar la lista completa para asegurar consistencia
            await loadUserChats();

            // Mostrar notificación del sistema
            showNotification(
              data.userName || "Usuario",
              data.message || "Nuevo mensaje"
            );
          }
        } else {
          // Si no tenemos datos completos, intentar obtener el chat por ID
          // console.log("Obteniendo datos del chat desde la API");
          const chatData = await chatManager.getChatById(data.chatId);

          if (
            chatData &&
            chatData.teachers &&
            chatData.teachers.includes(parseInt(currentUserId.value))
          ) {
            // Actualizar la lista de chats
            await loadUserChats();
          }
        }
      } catch (error) {
        console.error(
          "Error al procesar notificación de primer mensaje:",
          error
        );
        // Intentar recargar chats de todas formas como fallback
        await loadUserChats();
      }
    });

    // Escuchar cuando se crea un nuevo chat
    socket.value.on("new_chat_created", async (data) => {
      // console.log("Notificación de nuevo chat creado:", data);

      try {
        // Comprobar si este chat podría ser relevante para el usuario actual
        const chatData = await chatManager.getChatById(data.chatId);
        // console.log("Datos del nuevo chat recibido:", chatData);

        if (
          chatData &&
          chatData.teachers &&
          chatData.teachers.includes(parseInt(currentUserId.value))
        ) {
          // console.log("Nuevo chat relevante para este usuario");

          // Primero unirse al chat para recibir actualizaciones futuras (siempre nos unimos para recibir mensajes)
          if (socket.value && socket.value.connected) {
            socket.value.emit("join_chat", {
              chatId: chatData._id,
              userId: currentUserId.value,
              userName:
                appStore.getUser()?.name ||
                appStore.getUser()?.username ||
                "Usuario",
            });
            // console.log(`Usuario suscrito al nuevo chat: ${chatData._id}`);
          }

          // Solo añadimos el chat a la lista existente si tiene interacciones
          // (o si el chat fue creado por este usuario)
          const isCreatedByCurrentUser =
            data.requesterId === currentUserId.value;
          const hasMessages =
            chatData.interaction && chatData.interaction.length > 0;

          if (isCreatedByCurrentUser || hasMessages) {
            // console.log("Actualizando lista de chats...");

            // Verificar si el chat ya existe en nuestra lista
            const chatExists = existingChats.value.some(
              (chat) => chat._id === chatData._id
            );

            if (!chatExists) {
              // Añadir el chat a la lista existente inmediatamente
              existingChats.value.push(chatData);
              // console.log("Chat añadido a la lista local");
            }

            // De todas formas, recargar la lista completa para asegurar consistencia
            await loadUserChats();
          } else {
            // console.log(
            //   "Chat sin mensajes, no se muestra en la lista de existentes"
            // );
          }
        }
      } catch (error) {
        console.error("Error al procesar notificación de nuevo chat:", error);
        // Intentar recargar chats de todas formas como fallback
        await loadUserChats();
      }
    });

    // Evento de desconexión
    socket.value.on("disconnect", () => {
      // console.log("Desconectado del servidor de chat");
    });
  } catch (error) {
    console.error("Error al conectar al socket para actualizaciones:", error);
  }
};

// Objeto para rastrear notificaciones recientes y evitar duplicados
const recentNotifications = {
  messages: new Set(),
  clearTimer: null,

  // Agregar un mensaje a la lista de notificaciones recientes
  add(arg1, arg2, arg3) {
    // Compatibilidad con distintos formatos de parámetros
    // Puede recibir (chatId, userId, message) o (messageHash, senderName, message)
    let signature;

    if (
      typeof arg1 === "string" &&
      typeof arg2 === "string" &&
      typeof arg3 === "string"
    ) {
      // Nuevo formato: (messageHash, senderName, message)
      signature = arg1;
    } else {
      // Formato antiguo: (chatId, userId, message)
      const chatId = arg1 || "unknown";
      const userId = arg2 || "unknown";
      const message = arg3 || "";
      signature = `${chatId}_${userId}_${message.substring(0, 20)}`;
    }

    // Si ya existe esta notificación, no mostrar de nuevo
    if (this.messages.has(signature)) {
      return false;
    }

    // Agregar a la lista de recientes
    this.messages.add(signature);

    // Configurar limpieza automática después de 3 segundos
    if (this.clearTimer) {
      clearTimeout(this.clearTimer);
    }

    this.clearTimer = setTimeout(() => {
      this.messages.clear();
      this.clearTimer = null;
    }, 3000);

    return true;
  },
};

// Función para mostrar notificación
const showNotification = (senderName, message) => {
  // Si las notificaciones están deshabilitadas, salir inmediatamente
  if (disableNotifications.value) {
    return;
  }

  // Usar el gestor global de notificaciones si existe
  if (window.notificationManager) {
    window.notificationManager.notify(
      `Mensaje de ${senderName}`,
      message.substring(0, 60) + (message.length > 60 ? "..." : "")
    );
    return;
  }

  // Método de respaldo si no existe el gestor global
  // Comprobar si el navegador soporta notificaciones
  if (!("Notification" in window)) {
    return;
  }

  // Evitar notificaciones duplicadas - usar un hash del mensaje en lugar de chatId
  const messageHash = `${senderName}_${message.substring(0, 20)}`;
  if (recentNotifications && typeof recentNotifications.add === "function") {
    if (!recentNotifications.add(messageHash, senderName, message)) {
      console.log("Evitando notificación duplicada");
      return;
    }
  }

  // Mostrar notificación si está permitido
  if (Notification.permission === "granted") {
    new Notification(`Mensaje de ${senderName}`, {
      body: message.substring(0, 60) + (message.length > 60 ? "..." : ""),
      icon: "/favicon.ico",
    });
  }
  // Pedir permiso si no está decidido
  else if (Notification.permission !== "denied") {
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        new Notification(`Mensaje de ${senderName}`, {
          body: message.substring(0, 60) + (message.length > 60 ? "..." : ""),
          icon: "/favicon.ico",
        });
      }
    });
  }
};

// Función para manejar nuevos mensajes recibidos
const handleNewMessage = (data) => {
  // console.log("Nueva notificación de mensaje recibida:", data);

  try {
    // Extraer información relevante del mensaje
    let messageInfo = {
      chatId: null,
      userId: null,
      message: null,
    };

    // Manejar diferentes formatos de datos
    if (data.chatId && data.userId && data.message) {
      // Formato simple
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
      // Formato de array de interacciones
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
      // Objeto de interacción individual
      messageInfo = {
        chatId: data.chatId,
        userId: data.interaction.teacherId,
        message: data.interaction.message,
      };
    }

    // Si no es un mensaje del usuario actual, actualizar el último mensaje y mostrar notificación
    if (
      messageInfo.userId &&
      messageInfo.userId.toString() !== currentUserId.value.toString() &&
      messageInfo.message
    ) {
      // Buscar el chat correspondiente
      let chat = existingChats.value.find((c) => c._id === messageInfo.chatId);

      // Si el chat no existe en nuestra lista, intentar obtenerlo de manera optimizada
      if (!chat) {
        // console.log(
        //   "Recibido mensaje de un chat que no está en la lista. Recuperando inmediatamente..."
        // );

        // Si el chat estaba eliminado localmente, marcarlo como no eliminado
        if (deletedChats.value.has(messageInfo.chatId)) {
          // console.log(
          //   `Chat ${messageInfo.chatId} estaba eliminado, restaurándolo`
          // );
          deletedChats.value.delete(messageInfo.chatId);
          saveDeletedChats();
        }

        // Primero, intentar obtener el chat directamente por su ID para una respuesta más rápida
        chatManager
          .getChatById(messageInfo.chatId)
          .then((fetchedChat) => {
            if (fetchedChat) {
              // console.log("Chat nuevo obtenido directamente:", fetchedChat);

              // Verificar si este chat debe pertenecer al usuario actual
              if (
                fetchedChat.teachers &&
                fetchedChat.teachers.includes(parseInt(currentUserId.value))
              ) {
                // Añadir el chat a la lista existente
                existingChats.value.push(fetchedChat);
                processNewMessage(fetchedChat, messageInfo);

                // Emitir evento de unión al chat para futuras notificaciones
                if (socket.value && socket.value.connected) {
                  socket.value.emit("join_chat", {
                    chatId: fetchedChat._id,
                    userId: currentUserId.value,
                    userName:
                      appStore.getUser()?.name ||
                      appStore.getUser()?.username ||
                      "Usuario",
                  });
                  // console.log(
                  //   `Suscrito a actualizaciones del chat nuevo: ${fetchedChat._id}`
                  // );
                }
              }
            } else {
              console.error(
                "No se pudo obtener el chat con ID:",
                messageInfo.chatId
              );
              // Como plan B, recargar todos los chats
              loadUserChats().catch((err) => {
                console.error("Error al recargar todos los chats:", err);
              });
            }
          })
          .catch((err) => {
            console.error("Error al obtener el chat directo:", err);
            // Como plan B, recargar todos los chats
            loadUserChats().catch((err) => {
              console.error("Error al recargar todos los chats:", err);
            });
          });
      } else {
        // El chat ya existe en nuestra lista, procesarlo normalmente
        processNewMessage(chat, messageInfo);
      }
    }
  } catch (error) {
    console.error("Error al procesar notificación de mensaje:", error);
  }
};

// Función auxiliar para procesar un mensaje nuevo dentro de un chat
const processNewMessage = (chat, messageInfo) => {
  // Encontrar el otro usuario en el chat
  const otherUserId = chat.teachers.find(
    (teacherId) => teacherId !== parseInt(currentUserId.value)
  );

  if (otherUserId) {
    // Si el chat estaba eliminado para este usuario, restaurarlo
    if (deletedChats.value.has(chat._id)) {
      deletedChats.value.delete(chat._id);
      saveDeletedChats();
    }

    // Actualizar el último mensaje
    userMessages.value[otherUserId] =
      messageInfo.message.length > 30
        ? messageInfo.message.substring(0, 30) + "..."
        : messageInfo.message;

    // Verificar si el usuario está actualmente viendo este chat
    const isViewingThisChat = isUserViewingChat(chat._id);

    if (!isViewingThisChat) {
      // Solo marcar como nuevo mensaje si el usuario no está viendo este chat
      hasNewMessages.value[otherUserId] = true;

      // Guardar el estado en localStorage
      saveUnreadMessagesState();

      // Trigger store update after marking new messages
      appStore.updateUnreadMessagesCount();

      // Encontrar nombre del usuario que envió el mensaje
      const sender = users.value.find(
        (user) => user.id.toString() === otherUserId.toString()
      );
      const senderName = sender ? sender.name || sender.username : "Usuario";

      // Solo mostrar notificación si el documento está visible (usuario en la web)
      // y el usuario no está viendo este chat
      if (document.visibilityState === "visible" && !isViewingThisChat) {
        showNotification(senderName, messageInfo.message);
      }
    }
  }
};

// Función para verificar si el usuario está viendo un chat específico
const isUserViewingChat = (chatIdToCheck) => {
  return (
    // Verificar si está en la ruta de chat detalle con este ID
    (route.name === "chat-detail" && route.params.chatId === chatIdToCheck) ||
    // O si está en el array de chats activos
    activeChats.value.has(chatIdToCheck)
  );
};

// Función para escuchar eventos de chat activo
const setupChatViewListeners = () => {
  // Cuando un usuario entra a un chat
  window.addEventListener("chat-view-entered", (event) => {
    if (event.detail && event.detail.chatId) {
      // console.log(`Chat visto activamente: ${event.detail.chatId}`);
      activeChats.value.add(event.detail.chatId);
    }
  });

  // Cuando un usuario sale de un chat
  window.addEventListener("chat-view-exited", (event) => {
    if (event.detail && event.detail.chatId) {
      // console.log(`Chat ya no visto activamente: ${event.detail.chatId}`);
      activeChats.value.delete(event.detail.chatId);
    }
  });
};

// Función auxiliar para encontrar un chat con un usuario específico
const findChatWithUser = (user) => {
  return existingChats.value.find(
    (chat) =>
      chat.teachers &&
      chat.teachers.includes(parseInt(currentUserId.value)) &&
      chat.teachers.includes(parseInt(user.id))
  );
};

// Función para cargar chats eliminados desde localStorage
const loadDeletedChats = () => {
  try {
    const savedDeletedChats = localStorage.getItem(
      `deleted_chats_${currentUserId.value}`
    );
    if (savedDeletedChats) {
      deletedChats.value = new Set(JSON.parse(savedDeletedChats));
      // console.log("Chats eliminados cargados:", Array.from(deletedChats.value));
    }
  } catch (error) {
    console.error("Error al cargar chats eliminados:", error);
    deletedChats.value = new Set();
  }
};

// Función para guardar chats eliminados en localStorage
const saveDeletedChats = () => {
  try {
    localStorage.setItem(
      `deleted_chats_${currentUserId.value}`,
      JSON.stringify(Array.from(deletedChats.value))
    );
    // console.log("Chats eliminados guardados:", Array.from(deletedChats.value));
  } catch (error) {
    console.error("Error al guardar chats eliminados:", error);
  }
};

// Añadir un computed property para contar mensajes no leídos
const unreadChatsCount = computed(() => {
  if (!currentUserId.value) return 0;

  // Contar solo los chats no eliminados que tengan mensajes no leídos
  let count = 0;
  filteredUsers.value.forEach((user) => {
    const chat = findChatWithUser(user);
    if (
      chat &&
      !deletedChats.value.has(chat._id) &&
      hasNewMessages.value[user.id]
    ) {
      count++;
    }
  });

  return count;
});

// Añadir un watcher para actualizar la UI cuando cambie el estado de mensajes no leídos
watch(
  hasNewMessages,
  () => {
    // console.log(
    //   "Estado de mensajes no leídos actualizado:",
    //   hasNewMessages.value
    // );
    // Forzar actualización del contador
    appStore.updateUnreadMessagesCount();
  },
  { deep: true }
);

// Cerrar el menú de filtro cuando se hace clic fuera
const handleClickOutside = (event) => {
  if (filterRef.value && !filterRef.value.contains(event.target)) {
    showFilterMenu.value = false;
  }
};

// Cargar datos
onMounted(async () => {
  try {
    // Agregar listener para click outside
    document.addEventListener("click", handleClickOutside);

    // Configurar listeners para cambios en visualización de chat
    setupChatViewListeners();

    // Verificar si el usuario está autenticado
    if (!currentUserId.value) {
      error.value = "Debes iniciar sesión para ver los chats";
      loading.value = false;
      return;
    }

    // Cargar tipos de usuarios
    const typesResponse = await getAllTypeUsers();
    if (typesResponse.error) {
      throw new Error(typesResponse.error);
    }

    // Guardar todos los tipos de usuarios
    userTypes.value = typesResponse;

    // Cargar todos los usuarios
    const usersResponse = await getAllUsers();
    if (usersResponse.error) {
      throw new Error(usersResponse.error);
    }

    // Usar todos los usuarios (filtrado se hace en el computed property)
    users.value = usersResponse;

    // Cargar estado de mensajes no leídos desde localStorage
    loadUnreadMessagesState();

    // Cargar lista de chats eliminados
    loadDeletedChats();

    // Cargar chats existentes para el usuario actual
    await loadUserChats();

    // Conectar al socket para actualizaciones en tiempo real
    connectToSocket();

    // Escuchar cambios de visibilidad para controlar notificaciones
    document.addEventListener("visibilitychange", () => {
      // console.log("Cambio de visibilidad:", document.visibilityState);
    });

    loading.value = false;
  } catch (error) {
    console.error("Error al cargar datos:", error);
    error.value =
      "Error al cargar usuarios. Por favor, intente de nuevo más tarde.";
    loading.value = false;
  }
});

// Limpiar al desmontar
onUnmounted(() => {
  // Eliminar listener de click outside
  document.removeEventListener("click", handleClickOutside);

  // Desconectar socket
  if (socket.value) {
    socket.value.disconnect();
    socket.value = null;
  }

  // Limpiar event listeners
  window.removeEventListener("chat-view-entered", () => {});
  window.removeEventListener("chat-view-exited", () => {});
});

const toggleFilterMenu = (event) => {
  // Prevent the click from propagating to the document
  event.stopPropagation();
  showFilterMenu.value = !showFilterMenu.value;
};

const selectFilter = (typeId) => {
  selectedUserType.value = typeId;
  showFilterMenu.value = false;
  filterUsers();
};
</script>

<style>
/* Animaciones personalizadas que no están en Tailwind por defecto */
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
  animation: fade-in 0.6s ease-out forwards;
}

@keyframes dropdown {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(-5px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.animate-dropdown {
  animation: dropdown 0.2s ease-out forwards;
  transform-origin: top right;
}

@keyframes typing-dot {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-3px);
  }
}

.animate-typing-dot {
  animation: typing-dot 1.4s infinite ease-in-out;
}

.animation-delay-200 {
  animation-delay: 0.2s;
}

.animation-delay-400 {
  animation-delay: 0.4s;
}

/* Scrollbar personalizado */
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