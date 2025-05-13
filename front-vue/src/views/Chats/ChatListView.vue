<template>
  <div class="chat-list-container">
    <h2>Conversaciones</h2>

    <div class="filters">
      <div class="search-bar">
        <input
          type="text"
          v-model="searchTerm"
          @input="filterUsers"
          placeholder="Buscar usuario..."
          class="search-input"
        />
        <select
          v-model="selectedUserType"
          @change="filterUsers"
          class="user-type-select"
        >
          <option value="all">Todos los tipos</option>
          <option
            v-for="type in filteredUserTypes"
            :key="type.id"
            :value="type.id"
          >
            {{ type.name }}
          </option>
        </select>
      </div>

      <div class="view-tabs">
        <button
          :class="['tab-button', { active: activeTab === 'existing' }]"
          @click="activeTab = 'existing'"
        >
          Existentes
        </button>
        <button
          :class="['tab-button', { active: activeTab === 'all' }]"
          @click="activeTab = 'all'"
        >
          Todos
        </button>
      </div>
    </div>

    <div v-if="loading" class="loading">
      <p>Cargando usuarios...</p>
    </div>

    <div v-else-if="error" class="error">
      <p>{{ error }}</p>
    </div>

    <div v-else-if="displayedUsers.length === 0" class="empty-list">
      <p v-if="activeTab === 'existing'">No tienes conversaciones existentes</p>
      <p v-else>No se encontraron usuarios</p>
    </div>

    <ul v-else class="user-list">
      <li v-for="user in displayedUsers" :key="user.id" class="user-item">
        <div class="user-avatar" @click="selectUser(user)">
          <img
            :src="user.profileImage || '/img/default-avatar.png'"
            :alt="user.name || user.username"
            onerror="this.src='/img/default-avatar.png'"
          />
          <div
            v-if="hasNewMessages[user.id]"
            class="new-message-indicator"
          ></div>
        </div>
        <div class="user-info" @click="selectUser(user)">
          <h3>{{ user.name || user.username }}</h3>
          <p class="user-type">{{ getUserTypeName(user.typeUsers_id) }}</p>
          <p
            v-if="getUserLastMessage(user)"
            class="last-message"
            :class="{ 'new-message': hasNewMessages[user.id] }"
          >
            {{ getUserLastMessage(user) }}
          </p>
        </div>
        <button
          v-if="hasExistingChat(user)"
          @click="deleteUserChat(user)"
          class="delete-button"
          title="Eliminar conversación"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path
              d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"
            />
            <path
              fill-rule="evenodd"
              d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"
            />
          </svg>
        </button>
      </li>
    </ul>

    <!-- Canteen Chat Button -->
    <button
      @click="startCanteenChat"
      class="canteen-chat-button"
      title="Chat con cantina"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        fill="currentColor"
        viewBox="0 0 16 16"
      >
        <path
          d="M5 6a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5A.5.5 0 0 1 5 6zm0 2a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5A.5.5 0 0 1 5 8zm0 2a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5zm8-6a4 4 0 0 1-3.479 3.972v.026a2.5 2.5 0 0 1 .5 4.476.5.5 0 0 1-.461-.865 1.5 1.5 0 0 0-.3-2.615v.026a3 3 0 0 1 1.3-5.026A4 4 0 0 1 13 4z"
        />
      </svg>
      <span>Chat Cantina</span>
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import {
  getAllUsers,
  getAllTypeUsers,
} from "@/services/communicationsScripts/mainManager";
import chatManager from "@/services/communicationsScripts/chatsComManager";
import { useAppStore } from "@/stores";
import io from "socket.io-client";

// Estado
const users = ref([]);
const userTypes = ref([]);
const loading = ref(true);
const error = ref(null);
const searchTerm = ref("");
const selectedUserType = ref("all");
const existingChats = ref([]);
const activeTab = ref("existing"); // "existing" o "all"
const userMessages = ref({}); // Para almacenar el último mensaje de cada usuario
const canteenUserId = ref(null); // Para almacenar el ID del usuario cantina
const socket = ref(null); // Socket.io connection
const hasNewMessages = ref({}); // Para marcar chats con mensajes nuevos

// Obtener el store de la aplicación
const appStore = useAppStore();
const router = useRouter();

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
    // Solo usuarios con chats existentes
    return filteredUsers.value.filter((user) => hasExistingChat(user));
  } else {
    // Todos los usuarios filtrados
    return filteredUsers.value;
  }
});

// Comprobar si hay un chat existente con este usuario
const hasExistingChat = (user) => {
  return existingChats.value.some(
    (chat) =>
      chat.teachers &&
      chat.teachers.includes(parseInt(currentUserId.value)) &&
      chat.teachers.includes(parseInt(user.id))
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
  console.log("Estado de mensajes no leídos guardado:", unreadState);
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
      console.log("Estado de mensajes no leídos cargado:", parsedState);
    }
  } catch (error) {
    console.error("Error al cargar estado de mensajes no leídos:", error);
  }
};

// Iniciar chat con la cantina
const startCanteenChat = async () => {
  try {
    loading.value = true;

    // Buscar explícitamente el usuario cantina (tipo 5)
    const canteenUser = users.value.find((user) => user.typeUsers_id === 5);

    if (!canteenUser) {
      throw new Error(
        "No se pudo encontrar el usuario de cantina (typeUser 5)"
      );
    }

    // Guardar el ID para referencias futuras
    canteenUserId.value = canteenUser.id;
    console.log("Usuario cantina identificado:", canteenUser);

    // Verificar si ya existe un chat entre el usuario actual y la cantina
    const existingChat = existingChats.value.find(
      (chat) =>
        chat.teachers &&
        chat.teachers.includes(parseInt(currentUserId.value)) &&
        chat.teachers.includes(parseInt(canteenUserId.value))
    );

    let chatId;

    if (existingChat) {
      // Usar el chat existente
      chatId = existingChat._id;
      console.log("Usando chat de cantina existente:", chatId);
    } else {
      // Crear un nuevo chat con la cantina
      const canteenName = canteenUser.name || canteenUser.username || "Cantina";

      console.log("Creando nuevo chat con cantina:", {
        currentUserId: currentUserId.value,
        canteenUserId: canteenUserId.value,
      });

      const newChat = await chatManager.createChat({
        name: `Chat con ${canteenName}`,
        teachers: [
          parseInt(currentUserId.value),
          parseInt(canteenUserId.value),
        ],
        interaction: [],
      });

      chatId = newChat._id;
      console.log("Nuevo chat con cantina creado:", newChat);

      // Actualizar la lista de chats existentes
      await loadUserChats();
    }

    // Navegar al chat
    router.push({
      name: "chat-detail",
      params: { chatId },
    });
  } catch (error) {
    console.error("Error al iniciar chat con cantina:", error);
    error.value =
      "No se pudo iniciar el chat con la cantina. Intente de nuevo más tarde.";
  } finally {
    loading.value = false;
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
    const existingChat = existingChats.value.find(
      (chat) =>
        chat.teachers &&
        chat.teachers.includes(parseInt(currentUserId.value)) &&
        chat.teachers.includes(parseInt(user.id))
    );

    let chatId;

    if (existingChat) {
      // Usar el chat existente
      chatId = existingChat._id;
      console.log("Usando chat existente:", chatId);
    } else {
      // Crear un nuevo chat entre estos usuarios
      const newChat = await chatManager.createChat({
        name: `Chat entre ${appStore.getUser().name || "Usuario"} y ${
          user.name || user.username || "Usuario"
        }`,
        teachers: [parseInt(currentUserId.value), parseInt(user.id)],
        interaction: [],
      });

      chatId = newChat._id;
      console.log("Nuevo chat creado:", newChat);

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
          console.log(`Suscrito a actualizaciones del chat: ${chat._id}`);
        }
      }
    }
  },
  { deep: true }
);

// Cargar los chats del usuario actual y extraer los últimos mensajes
const loadUserChats = async () => {
  try {
    const chatsResponse = await chatManager.getChatsByUser(
      parseInt(currentUserId.value)
    );
    existingChats.value = chatsResponse;
    console.log("Chats del usuario cargados:", existingChats.value);

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
  } catch (error) {
    console.error("Error al cargar chats del usuario:", error);
    // Intentar con el método alternativo como fallback
    const allChats = await chatManager.getAllChats();
    existingChats.value = allChats.filter(
      (chat) =>
        chat.teachers && chat.teachers.includes(parseInt(currentUserId.value))
    );
  }
};

const deleteUserChat = async (user) => {
  try {
    loading.value = true;

    // Buscar un chat existente donde participen ambos usuarios
    const existingChat = existingChats.value.find(
      (chat) =>
        chat.teachers &&
        chat.teachers.includes(parseInt(currentUserId.value)) &&
        chat.teachers.includes(parseInt(user.id))
    );

    if (existingChat) {
      // Eliminar el chat
      await chatManager.deleteChat(existingChat._id);
      console.log("Chat eliminado:", existingChat._id);

      // Recargar la lista de chats
      await loadUserChats();
    }
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
    socket.value = io("http://localhost:3007", {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

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
          console.log(`Suscrito a actualizaciones del chat: ${chat._id}`);
        }
      }
    });

    // Escuchar nuevos mensajes
    socket.value.on("new_message", handleNewMessage);

    // Evento de desconexión
    socket.value.on("disconnect", () => {
      console.log("Desconectado del servidor de chat");
    });
  } catch (error) {
    console.error("Error al conectar al socket para actualizaciones:", error);
  }
};

// Función para manejar nuevos mensajes recibidos
const handleNewMessage = (data) => {
  console.log("Nueva notificación de mensaje recibida:", data);

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
      const chat = existingChats.value.find(
        (c) => c._id === messageInfo.chatId
      );

      if (chat) {
        // Encontrar el otro usuario en el chat
        const otherUserId = chat.teachers.find(
          (teacherId) => teacherId !== parseInt(currentUserId.value)
        );

        if (otherUserId) {
          // Actualizar el último mensaje
          userMessages.value[otherUserId] =
            messageInfo.message.length > 30
              ? messageInfo.message.substring(0, 30) + "..."
              : messageInfo.message;

          // Marcar como nuevo mensaje
          hasNewMessages.value[otherUserId] = true;

          // Guardar el estado en localStorage
          saveUnreadMessagesState();

          // Trigger store update after marking new messages
          appStore.updateUnreadMessagesCount();
          console.log(
            "Message marked as unread and store updated, current store count:",
            appStore.getUnreadCount
          );

          // Encontrar nombre del usuario que envió el mensaje
          const sender = users.value.find(
            (user) => user.id.toString() === otherUserId.toString()
          );
          const senderName = sender
            ? sender.name || sender.username
            : "Usuario";

          // Solo mostrar notificación si el documento está visible (usuario en la web)
          if (document.visibilityState === "visible") {
            showNotification(senderName, messageInfo.message);
          }
        }
      }
    }
  } catch (error) {
    console.error("Error al procesar notificación de mensaje:", error);
  }
};

// Función para mostrar notificación
const showNotification = (senderName, message) => {
  // Comprobar si el navegador soporta notificaciones
  if (!("Notification" in window)) {
    console.log("Este navegador no soporta notificaciones de escritorio");
    return;
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

// Cargar datos
onMounted(async () => {
  try {
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

    // Buscar usuario de cantina (typeUsers_id = 5)
    const canteenUser = usersResponse.find((user) => user.typeUsers_id === 5);
    if (canteenUser) {
      canteenUserId.value = canteenUser.id;
      console.log("Usuario de cantina encontrado:", canteenUser);
    }

    // Usar todos los usuarios (filtrado se hace en el computed property)
    users.value = usersResponse;

    // Cargar estado de mensajes no leídos desde localStorage
    loadUnreadMessagesState();

    // Cargar chats existentes para el usuario actual
    await loadUserChats();

    // Conectar al socket para actualizaciones en tiempo real
    connectToSocket();

    // Escuchar cambios de visibilidad para controlar notificaciones
    document.addEventListener("visibilitychange", () => {
      console.log("Cambio de visibilidad:", document.visibilityState);
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
  // Desconectar socket
  if (socket.value) {
    socket.value.disconnect();
    socket.value = null;
  }
});
</script>

<style scoped>
.chat-list-container {
  display: flex;
  flex-direction: column;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  height: 100vh;
  color: #333;
  position: relative;
}

h2 {
  margin-bottom: 20px;
  color: #333;
}

.filters {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
  gap: 15px;
}

.search-bar {
  display: flex;
  gap: 10px;
  width: 100%;
}

.search-input {
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  flex: 1;
}

.user-type-select {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  min-width: 120px;
}

.view-tabs {
  display: flex;
  border-bottom: 1px solid #ddd;
}

.tab-button {
  padding: 10px 20px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 15px;
  color: #6c757d;
  position: relative;
  transition: all 0.3s ease;
}

.tab-button.active {
  color: #007bff;
  font-weight: 500;
}

.tab-button.active:after {
  content: "";
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 100%;
  height: 3px;
  background-color: #007bff;
}

.tab-button:hover {
  color: #007bff;
}

.loading,
.error,
.empty-list {
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

.user-info {
  flex: 1;
  overflow: hidden;
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

.delete-button {
  background: none;
  border: none;
  padding: 8px;
  margin-left: auto;
  cursor: pointer;
  color: #6c757d;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.delete-button:hover {
  background-color: rgba(220, 53, 69, 0.1);
  color: #dc3545;
}

/* Botones nuevos */
.canteen-chat-button {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 10px;
  padding: 12px 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 10;
}

.canteen-chat-button:hover {
  background-color: #218838;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}
</style> 