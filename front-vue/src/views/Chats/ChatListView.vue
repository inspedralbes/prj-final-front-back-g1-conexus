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
        <div class="filter-container" ref="filterRef">
          <button
            class="filter-icon-btn"
            @click="(event) => toggleFilterMenu(event)"
            title="Filtrar por tipo"
            :class="{
              'filter-active': selectedUserType !== 'all',
              'menu-open': showFilterMenu,
            }"
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
              class="filter-icon"
            >
              <polygon
                points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"
              ></polygon>
            </svg>
          </button>
          <div v-if="showFilterMenu" class="filter-dropdown">
            <div
              class="filter-option"
              :class="{ active: selectedUserType === 'all' }"
              @click="selectFilter('all')"
            >
              <span>Todos los tipos</span>
            </div>
            <div
              v-for="type in filteredUserTypes"
              :key="type.id"
              class="filter-option"
              :class="{ active: selectedUserType === type.id }"
              @click="selectFilter(type.id)"
            >
              <span>{{ type.name }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="view-tabs">
        <button
          :class="['tab-button', { active: activeTab === 'existing' }]"
          @click="activeTab = 'existing'"
        >
          Existentes
        </button>
        <button
          :class="['tab-button', { active: activeTab === 'unread' }]"
          @click="activeTab = 'unread'"
        >
          No leídos
          <span v-if="unreadChatsCount > 0" class="badge">{{
            unreadChatsCount
          }}</span>
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
            :src="user.profile || '/img/default-avatar.png'"
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
          <p v-if="typingUsers[user.id]" class="typing-status">
            <span class="typing-dot"></span>
            <span class="typing-dot"></span>
            <span class="typing-dot"></span>
          </p>
          <p
            v-else-if="getUserLastMessage(user)"
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
  try {
    loading.value = true;

    // Buscar un chat existente donde participen ambos usuarios
    const existingChat = findChatWithUser(user);

    if (existingChat) {
      // Marcar el chat como eliminado localmente
      deletedChats.value.add(existingChat._id);
      saveDeletedChats();

      // console.log("Chat marcado como eliminado localmente:", existingChat._id);

      // Limpiar el mensaje no leído del usuario si existe
      if (hasNewMessages.value[user.id]) {
        hasNewMessages.value[user.id] = false;
        saveUnreadMessagesState(); // Guardar el cambio en localStorage
        appStore.updateUnreadMessagesCount(); // Actualizar contador en el store
      }

      // Forzar actualización de la UI
      filteredUsers.value = [...filteredUsers.value];
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
      // console.log(
      //   "Conectado al servidor de chat para actualizaciones en tiempo real"
      // );

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
      // console.log(`Chat ${chat._id} restaurado por nuevo mensaje`);
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

    // Agregar log de depuración
    // console.log(`Procesando mensaje para chat ${chat._id}:`);
    // console.log(
    //   `- Usuario en chat detail: ${
    //     route.name === "chat-detail" && route.params.chatId === chat._id
    //   }`
    // );
    // console.log(
    //   `- Chat en lista de activos: ${activeChats.value.has(chat._id)}`
    // );
    // console.log(
    //   `- Resultado final: ${
    //     isViewingThisChat
    //       ? "Mensaje considerado leído"
    //       : "Mensaje considerado no leído"
    //   }`
    // );

    if (!isViewingThisChat) {
      // Solo marcar como nuevo mensaje si el usuario no está viendo este chat
      hasNewMessages.value[otherUserId] = true;

      // Guardar el estado en localStorage
      saveUnreadMessagesState();

      // Trigger store update after marking new messages
      appStore.updateUnreadMessagesCount();
      // console.log(
      //   "Message marked as unread and store updated, current store count:",
      //   appStore.getUnreadCount
      // );
    } else {
      // console.log(
      //   `No marcando mensaje como no leído porque el usuario está viendo el chat ${chat._id}`
      // );
    }

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

// Función para mostrar notificación
const showNotification = (senderName, message) => {
  // Comprobar si el navegador soporta notificaciones
  if (!("Notification" in window)) {
    // console.log("Este navegador no soporta notificaciones de escritorio");
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

.filter-container {
  position: relative;
}

.filter-icon-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  color: #6c757d;
  position: relative;
}

/* Small dot indicator for when menu is open */
.filter-icon-btn::after {
  content: "";
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: transparent;
  transition: background-color 0.3s ease;
}

/* Show the indicator when the menu is open */
.filter-icon-btn.menu-open::after {
  background-color: #007bff;
}

.filter-icon-btn:hover {
  background-color: rgba(0, 123, 255, 0.1);
  color: #007bff;
}

.filter-icon {
  transition: transform 0.3s ease;
}

.filter-icon-btn:hover .filter-icon {
  transform: rotate(5deg);
}

.filter-dropdown {
  position: absolute;
  top: calc(100% + 5px);
  right: 0;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 10;
  width: 180px;
  max-height: 250px;
  overflow-y: auto;
  animation: dropdownFadeIn 0.2s ease;
  transform-origin: top right;
}

@keyframes dropdownFadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.filter-option {
  padding: 10px 15px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  border-bottom: 1px solid #f0f0f0;
}

.filter-option:last-child {
  border-bottom: none;
}

.filter-option:hover {
  background-color: #f5f5f5;
}

.filter-option.active {
  font-weight: bold;
  background-color: #f0f8ff;
  color: #007bff;
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

.tab-button .badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  font-size: 11px;
  font-weight: 600;
  line-height: 1;
  color: white;
  background-color: #dc3545;
  border-radius: 9px;
  margin-left: 5px;
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

.typing-status {
  margin: 5px 0 0;
  font-size: 13px;
  color: #6c757d;
  display: flex;
  align-items: center;
  gap: 2px;
}

.typing-dot {
  display: inline-block;
  width: 5px;
  height: 5px;
  background-color: #6c757d;
  border-radius: 50%;
  animation: typingAnimation 1.4s infinite ease-in-out;
}

.typing-dot:nth-child(1) {
  animation-delay: 0s;
}

.typing-dot:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-dot:nth-child(3) {
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

.filter-icon-btn.filter-active {
  background-color: rgba(0, 123, 255, 0.2);
  color: #007bff;
}

.filter-icon-btn.filter-active .filter-icon {
  transform: rotate(5deg);
}
</style> 