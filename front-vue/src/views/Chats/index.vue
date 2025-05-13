<template>
  <div class="chat-container">
    <div class="chat-header">
      <h2>{{ chatPartnerName }}</h2>
    </div>

    <div class="chat-messages" ref="messagesContainer">
      <div v-if="messages.length === 0" class="empty-chat-message">
        <p>¡Bienvenido al chat con {{ chatPartnerName }}!</p>
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
      </div>
    </div>

    <div class="typing-indicator" v-if="someoneIsTyping">
      {{ typingUserName }} está escribiendo...
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
import { ref, onMounted, onUnmounted, nextTick, computed } from "vue";
import io from "socket.io-client";
import chatManager from "@/services/communicationsScripts/chatsComManager";
import { useAppStore } from "@/stores";

// Obtener el store de la aplicación
const appStore = useAppStore();

// Variables del chat
const socket = ref(null);
const messages = ref([]);
const newMessage = ref("");
// Usar datos del usuario actual desde el store
const currentUserId = computed(() =>
  appStore.getUserId() ? appStore.getUserId().toString() : null
);
const currentUserName = computed(
  () => appStore.getUser()?.name || appStore.getUser()?.username || "Usuario"
);
const isTeacher = computed(() => appStore.getTypeUser() === 1); // Verificar si es profesor
const messagesContainer = ref(null);
const isTyping = ref(false);
const typingTimeout = ref(null);
const someoneIsTyping = ref(false);
const typingUserName = ref("");
const chatId = ref(null); // ID del chat actual
// Caché para evitar mensajes duplicados
const processedMessages = ref(new Set());

// Variables para el compañero de chat
const chatPartnerUserId = ref(null);
const chatPartnerName = ref("Chat");

// Conectar al socket cuando el componente se monta
onMounted(async () => {
  // Verificar si el usuario está autenticado y es profesor
  if (!currentUserId.value || !isTeacher.value) {
    console.warn(
      "No se puede iniciar el chat: usuario no autenticado o no es profesor"
    );
    return;
  }

  // Primero intentar obtener los chats existentes o crear uno
  await initializeChat();

  // Luego conectar al socket si tenemos un chat
  if (chatId.value) {
    connectSocket();
  } else {
    console.warn(
      "No se pudo obtener o crear un chat. No se conectará al socket."
    );
  }
});

// Limpiar cuando el componente se desmonta
onUnmounted(() => {
  disconnectSocket();
});

// Inicializar el chat (obtener o crear uno)
const initializeChat = async () => {
  try {
    // Verificar si el usuario está autenticado y es profesor
    if (!currentUserId.value || !isTeacher.value) {
      console.warn(
        "No hay usuario autenticado o no es profesor. Usuario:",
        appStore.getUser()
      );
      return;
    }

    console.log("Inicializando chat como profesor. ID:", currentUserId.value);

    // Intentar obtener chats existentes
    const chats = await chatManager.getAllChats();
    console.log("Chats existentes:", chats);

    // Filtrar chats donde este profesor participa
    const myChats = chats.filter(
      (chat) =>
        chat.teachers && chat.teachers.includes(parseInt(currentUserId.value))
    );

    console.log("Mis chats como profesor:", myChats);

    if (myChats && myChats.length > 0) {
      // Usar el primer chat donde participa este profesor
      chatId.value = myChats[0]._id;
      console.log("Usando chat existente:", chatId.value);

      // Cargar mensajes existentes
      const chatData = await chatManager.getChatById(chatId.value);
      console.log("Datos del chat:", chatData);

      // Obtener información del compañero de chat
      updateChatPartnerInfo(chatData);

      if (chatData && chatData.interaction && chatData.interaction.length > 0) {
        console.log("Cargando mensajes del historial:", chatData.interaction);

        // Convertir los mensajes al formato esperado
        messages.value = chatData.interaction.map((msg) => {
          // Verificar si el mensaje es del usuario actual o de otro
          const isOwnMessage = msg.teacherId === currentUserId.value.toString();

          console.log(
            `Mensaje de teacherId: ${msg.teacherId}, ¿Es propio?: ${isOwnMessage}`
          );

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
      }
    } else {
      // Si no hay chats donde participe este profesor, buscar otros profesores para crear un chat
      try {
        // Aquí se podría hacer una llamada a la API para obtener otros profesores
        // Por ahora, creamos un chat con otro ID genérico (simulación)
        const otherTeacherId = parseInt(currentUserId.value) + 1; // Simulación de otro profesor

        console.log(
          "No se encontraron chats, creando uno nuevo entre profesores",
          {
            currentUserId: currentUserId.value,
            otherTeacherId,
          }
        );

        const newChat = await chatManager.createChat({
          name: `Chat profesores ${currentUserId.value} y ${otherTeacherId}`,
          teachers: [parseInt(currentUserId.value), otherTeacherId],
          interaction: [],
        });

        chatId.value = newChat._id;
        console.log("Nuevo chat creado:", newChat);

        // Obtener información del compañero de chat
        updateChatPartnerInfo(newChat);
      } catch (createError) {
        console.error("Error al crear nuevo chat:", createError);
      }
    }
  } catch (error) {
    console.error("Error al inicializar el chat:", error);
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
    console.log("Tipo de dato:", typeof data);
    console.log("Contenido JSON:", JSON.stringify(data, null, 2));

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

    console.log("Mensaje procesado:", messageData);
    console.log("¿Es del usuario actual?:", isCurrentUser);

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

  // Escuchar errores
  socket.value.on("error", (error) => {
    console.error("Error en socket:", error);
  });
};

// Desconectar del socket
const disconnectSocket = () => {
  if (socket.value) {
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
        userId: currentUserId.value, // Usar el ID como está en la base de datos
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

      // Verificar si este es el primer mensaje del chat
      const isFirstMessage = messages.value.length === 1;

      // Enviar el mensaje a través del API
      console.log(
        `Enviando mensaje a la API. Chat: ${chatId.value}, teacherId: ${currentUserId.value}`
      );
      const result = await chatManager.sendMessage(
        chatId.value,
        currentUserId.value, // teacherId como string
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

      // Si este es el primer mensaje, notificar para actualizar la lista de chats
      if (isFirstMessage && socket.value) {
        console.log("Enviando notificación de primer mensaje en el chat");

        // Emitir evento personalizado para primer mensaje
        socket.value.emit("first_message_sent", {
          chatId: chatId.value,
          userId: currentUserId.value,
          userName: currentUserName.value,
          message: messageText,
        });
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
        message.userId, // teacherId
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

// Método para obtener y actualizar la información del compañero de chat
const updateChatPartnerInfo = (chatData) => {
  if (!chatData || !chatData.teachers || !Array.isArray(chatData.teachers)) {
    console.warn("No se pueden obtener datos del compañero de chat");
    return;
  }

  // Encontrar el ID del otro usuario
  const partnerId = chatData.teachers.find(
    (teacherId) => teacherId !== parseInt(currentUserId.value)
  );

  if (partnerId) {
    chatPartnerUserId.value = partnerId.toString();

    // Intentar obtener el nombre del último mensaje recibido de ese usuario
    const partnerMessage = messages.value.find(
      (msg) => msg.userId.toString() === chatPartnerUserId.value
    );

    if (partnerMessage && partnerMessage.userName) {
      // Usar el nombre del mensaje
      chatPartnerName.value = partnerMessage.userName;
    } else {
      // Si no hay mensajes, usar un nombre genérico con su tipo
      chatPartnerName.value = `Profesor ${partnerId}`;
    }

    console.log(
      `Compañero de chat identificado: ${chatPartnerName.value} (ID: ${chatPartnerUserId.value})`
    );
  } else {
    console.warn("No se pudo identificar al compañero de chat");
    chatPartnerName.value = "Chat";
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
}

.chat-header {
  padding: 10px;
  background-color: #f5f5f5;
  border-radius: 8px 8px 0 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
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
  font-size: 0.8em;
  color: #6c757d;
  font-style: italic;
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

.message-content {
  word-wrap: break-word;
  font-size: 1.05em;
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
</style>