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
        <div class="message-content">{{ message.message }}</div>
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
      <input
        v-model="newMessage"
        @keyup.enter="sendMessage"
        placeholder="Escribe un mensaje..."
        @input="handleTyping"
      />
      <button @click="sendMessage">Enviar</button>
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

// Navegación
const goBack = () => {
  router.push({ name: "chats-list" });
};

// Conectar al socket cuando el componente se monta
onMounted(async () => {
  // Verificar si el usuario está autenticado
  if (!currentUserId.value) {
    console.warn("No se puede iniciar el chat: usuario no autenticado");
    router.push("/login");
    return;
  }

  // Cargar datos del chat
  await loadChatData();

  // Conectar al socket
  connectSocket();

  // Marcar mensajes como leídos
  await markMessagesAsRead();

  // Emitir evento de chat visto
  dispatchChatViewEvent("entered");
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

// Cargar datos del chat
const loadChatData = async () => {
  try {
    if (!chatId.value) {
      console.error("No se proporcionó ID de chat");
      router.push({ name: "chats-list" });
      return;
    }

    loading.value = true;
    console.log(`Intentando cargar chat con ID: ${chatId.value}`);

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
      console.log(
        "Chat no encontrado directamente, buscando entre todos los chats..."
      );
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

          console.log(
            `Encontrados ${userChats.length} chats donde participa el usuario actual`
          );

          if (userChats.length > 0) {
            // Si no se encuentra el chat específico pero hay otros chats del usuario,
            // redirigir al primero de ellos
            console.log("Redirigiendo al primer chat disponible del usuario");
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

    console.log("Chat encontrado:", chatData);

    // Establecer nombre del chat
    chatName.value = chatData.name || "Chat";

    // Cargar mensajes
    if (chatData.interaction && chatData.interaction.length > 0) {
      console.log(`Cargando ${chatData.interaction.length} mensajes`);

      // Convertir los mensajes al formato esperado
      messages.value = chatData.interaction.map((msg) => {
        // Verificar si el mensaje es del usuario actual o de otro
        const isOwnMessage = msg.teacherId === currentUserId.value.toString();

        return {
          id: msg._id,
          userId: msg.teacherId,
          userName: isOwnMessage
            ? currentUserName.value
            : `Profesor ${msg.teacherId}`,
          message: msg.message,
          timestamp: new Date(msg.date),
        };
      });

      // Ordenar mensajes por fecha
      messages.value.sort(
        (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
      );
    } else {
      console.log("El chat no tiene mensajes");
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

    console.log(`Marcando mensajes como leídos para el usuario ${otherUserId}`);

    // Obtener el estado actual de los mensajes no leídos
    const storageKey = `chat_unread_${currentUserId.value}`;
    const unreadData = localStorage.getItem(storageKey);

    if (unreadData) {
      const unreadMessages = JSON.parse(unreadData);

      // Si hay mensajes no leídos de este usuario, marcarlos como leídos
      if (unreadMessages[otherUserId]) {
        console.log(
          `Usuario ${otherUserId} tenía mensajes no leídos, marcando como leídos`
        );
        delete unreadMessages[otherUserId];

        // Guardar el nuevo estado
        localStorage.setItem(storageKey, JSON.stringify(unreadMessages));

        // Actualizar el contador global
        appStore.updateUnreadMessagesCount();
        console.log(
          "Contador de mensajes no leídos actualizado:",
          appStore.getUnreadCount
        );
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
      console.log("Conectado al servidor de chat");

      // Registrar el usuario
      socket.value.emit("register_user", {
        userId: currentUserId.value,
        userName: currentUserName.value,
      });

      // Unirse al chat actual (solo si tenemos un chatId)
      if (chatId.value) {
        console.log(
          `Uniendo al usuario ${currentUserId.value} al chat ${chatId.value}`
        );
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
      console.log("Desconectado del servidor de chat");
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
    console.log("Nuevo mensaje recibido del socket:", data);

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
        timestamp: new Date(lastInteraction.date),
      };
    } else if (data.message && data.userId) {
      // Si es un mensaje formateado para el front
      messageData = {
        id: data.id || Date.now().toString(),
        userId: data.userId,
        message: data.message,
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
        timestamp: new Date(msg.date) || new Date(),
      };
    }

    // Si no pudimos extraer datos válidos, salir
    if (!messageData) {
      console.error("No se pudo extraer información válida del mensaje:", data);
      return;
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
      console.log("Mensaje ya procesado anteriormente, ignorando");
      return;
    }

    // Buscar si ya existe un mensaje local similar
    const existingIndex = messages.value.findIndex((msg) => {
      // Si los mensajes tienen el mismo contenido y autor, y están cercanos en tiempo
      const isSameContent = msg.message === messageData.message;
      const isSameAuthor =
        msg.userId.toString() === messageData.userId.toString();
      const timeDiff = Math.abs(
        new Date(msg.timestamp) - new Date(messageData.timestamp)
      );
      const isCloseInTime = timeDiff < 30000; // 30 segundos

      return isSameContent && isSameAuthor && isCloseInTime;
    });

    // Marcar el mensaje como procesado
    processedMessages.value.add(msgSignature);

    if (existingIndex === -1) {
      // Si no existe mensaje similar, agregar este nuevo
      console.log("Mensaje nuevo, agregando:", messageData);
      messages.value.push(messageData);
      scrollToBottom();
    } else {
      // Si ya existe un mensaje similar, actualizar sus propiedades si es necesario
      console.log("Mensaje similar encontrado en índice:", existingIndex);

      // Si el mensaje existente es local y el nuevo tiene ID del servidor, actualizar
      if (messages.value[existingIndex].local && messageData.id) {
        console.log("Actualizando mensaje local con datos del servidor");
        messages.value[existingIndex].id = messageData.id;
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
    console.log(
      `${data.userName || "Profesor " + data.userId} se ha unido al chat`
    );
  });

  // Escuchar cuando un usuario deja el chat
  socket.value.on("user_left", (data) => {
    console.log(
      `${data.userName || "Profesor " + data.userId} ha salido del chat`
    );
  });

  // Escuchar errores
  socket.value.on("error", (error) => {
    console.error("Error en socket:", error);
  });

  // Escuchar cuando un mensaje es eliminado
  socket.value.on("message_deleted", (data) => {
    console.log("Mensaje eliminado:", data);

    // Encontrar y eliminar el mensaje de la lista local
    const messageIndex = messages.value.findIndex(
      (msg) => msg.id === data.messageId
    );
    if (messageIndex !== -1) {
      console.log(`Eliminando mensaje en índice ${messageIndex}`);
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

// Enviar mensaje
const sendMessage = async () => {
  if (!currentUserId.value) {
    console.error("No se puede enviar mensaje: usuario no autenticado");
    return;
  }

  if (newMessage.value.trim() && chatId.value) {
    try {
      // Crear datos del mensaje para mostrar localmente
      const messageText = newMessage.value;
      const tempId = Date.now().toString();

      // Limpiar el campo de mensaje inmediatamente para mejor UX
      newMessage.value = "";

      // Agregar el mensaje localmente para que aparezca inmediatamente
      const localMessage = {
        id: tempId,
        userId: currentUserId.value,
        userName: currentUserName.value,
        message: messageText,
        timestamp: new Date(),
        sending: true, // Indicador de que el mensaje se está enviando
        local: true, // Marcar como mensaje local para evitar duplicación
      };

      console.log("Agregando mensaje local:", localMessage);
      messages.value.push(localMessage);

      // Hacer scroll para mostrar el nuevo mensaje
      scrollToBottom();

      // Enviar el mensaje a través del API
      console.log(
        `Enviando mensaje a la API. Chat: ${chatId.value}, teacherId: ${currentUserId.value}`
      );
      const result = await chatManager.sendMessage(
        chatId.value,
        currentUserId.value,
        messageText
      );

      console.log("Respuesta de la API al enviar mensaje:", result);

      // Actualizar el mensaje local con el ID real
      const messageIndex = messages.value.findIndex((m) => m.id === tempId);
      if (messageIndex !== -1) {
        // Si el último mensaje recibido tiene el interaction array, actualizar
        if (result.interaction && result.interaction.length > 0) {
          const newMsg = result.interaction[result.interaction.length - 1];
          messages.value[messageIndex] = {
            ...messages.value[messageIndex],
            id: newMsg._id,
            sending: false,
            local: true, // Mantener la marca para evitar duplicación
          };
          console.log(
            "Mensaje actualizado con ID del servidor:",
            messages.value[messageIndex]
          );
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
      console.log("Reintentando enviar mensaje:", message);

      // Marcar el mensaje como en proceso de envío
      messages.value[index].failed = false;
      messages.value[index].sending = true;

      // Solo usar la API para evitar duplicaciones
      console.log(
        `Reenviando mensaje a la API. Chat: ${chatId.value}, teacherId: ${message.userId}`
      );
      const result = await chatManager.sendMessage(
        chatId.value,
        message.userId,
        message.message
      );

      console.log("Respuesta de la API al reenviar mensaje:", result);

      // Actualizar el mensaje con el ID real
      if (result.interaction && result.interaction.length > 0) {
        const newMsg = result.interaction[result.interaction.length - 1];
        messages.value[index] = {
          ...messages.value[index],
          id: newMsg._id,
          sending: false,
          failed: false,
          local: true, // Mantener la marca para evitar duplicación
        };
        console.log(
          "Mensaje actualizado después del reintento:",
          messages.value[index]
        );
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

  console.log(`Emitiendo evento ${eventName} para chat ${chatId.value}`);
  window.dispatchEvent(event);
};

// Función para eliminar un mensaje
const deleteMessage = async (message) => {
  if (!message.id || !chatId.value) return;

  try {
    console.log(
      `Intentando eliminar mensaje ${message.id} del chat ${chatId.value}`
    );

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
  gap: 10px;
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 0 0 8px 8px;
}

input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  color: #000;
}

input:disabled {
  background-color: #e9ecef;
}

button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
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
</style> 