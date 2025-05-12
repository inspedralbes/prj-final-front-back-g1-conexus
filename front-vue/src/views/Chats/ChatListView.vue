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
          <option v-for="type in userTypes" :key="type.id" :value="type.id">
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
        </div>
        <div class="user-info" @click="selectUser(user)">
          <h3>{{ user.name || user.username }}</h3>
          <p class="user-type">{{ getUserTypeName(user.typeUsers_id) }}</p>
          <p v-if="getUserLastMessage(user)" class="last-message">
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
import { ref, onMounted, computed, watch } from "vue";
import { useRouter } from "vue-router";
import {
  getAllUsers,
  getAllTypeUsers,
} from "@/services/communicationsScripts/mainManager";
import chatManager from "@/services/communicationsScripts/chatsComManager";
import { useAppStore } from "@/stores";

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

// Usuarios filtrados (todos los que no son estudiantes)
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

    // Filtrar por tipo de usuario (1, 3, 4)
    const matchesType =
      selectedUserType.value === "all" ||
      user.typeUsers_id === parseInt(selectedUserType.value);

    // No mostrar al usuario actual
    const isNotCurrentUser = user.id.toString() !== currentUserId.value;

    return matchesSearch && matchesType && isNotCurrentUser;
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

const selectUser = async (user) => {
  try {
    loading.value = true;

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

    // Filtrar tipos de usuarios (excluir estudiantes)
    userTypes.value = typesResponse.filter((type) => type.id !== 2);

    // Cargar todos los usuarios
    const usersResponse = await getAllUsers();
    if (usersResponse.error) {
      throw new Error(usersResponse.error);
    }

    // Filtrar usuarios con tipos 1, 3 y 4 (excluir estudiantes)
    users.value = usersResponse.filter((user) =>
      [1, 3, 4].includes(user.typeUsers_id)
    );

    // Cargar chats existentes para el usuario actual
    await loadUserChats();

    loading.value = false;
  } catch (error) {
    console.error("Error al cargar datos:", error);
    error.value =
      "Error al cargar usuarios. Por favor, intente de nuevo más tarde.";
    loading.value = false;
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
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
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
</style> 