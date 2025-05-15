<template>
  <div class="canteen-page-container">
    <h2>Servicio de Cantina</h2>

    <div class="canteen-content">
      <div class="menu-section">
        <h3>Menú Disponible</h3>
        <div v-if="loading" class="loading-spinner">
          <div class="spinner"></div>
          <p>Cargando productos...</p>
        </div>

        <div v-else-if="error" class="error-message">
          <p>{{ error }}</p>
        </div>

        <div v-else-if="menuItems.length === 0" class="empty-menu">
          <p>No hay productos disponibles en este momento.</p>
        </div>

        <div v-else class="menu-items-grid">
          <div v-for="item in menuItems" :key="item.id" class="menu-item-card">
            <div class="menu-item-name">{{ item.product_name }}</div>
            <div class="menu-item-price">
              {{ formatPrice(item.product_price) }} €
            </div>
          </div>
        </div>
      </div>

      <div class="chat-section">
        <div class="chat-info">
          <h3>¿Tienes preguntas sobre el menú?</h3>
          <p>
            Inicia un chat con el servicio de cantina para realizar consultas
            sobre el menú, horarios o cualquier otra información.
          </p>

          <button
            @click="startCanteenChat"
            class="canteen-chat-button"
            :disabled="chatLoading"
            title="Iniciar chat con cantina"
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
            <span>{{
              chatLoading ? "Iniciando chat..." : "Iniciar Chat con Cantina"
            }}</span>
          </button>

          <div v-if="chatError" class="chat-error">
            {{ chatError }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { getAllUsers } from "@/services/communicationsScripts/mainManager";
import chatManager from "@/services/communicationsScripts/chatsComManager";
import { getAllEnabledCanteenItems } from "@/services/communicationsScripts/canteenComManager";
import { useAppStore } from "@/stores";

// Estado
const loading = ref(true);
const error = ref(null);
const menuItems = ref([]);
const canteenUserId = ref(null);
const chatLoading = ref(false);
const chatError = ref(null);

// Obtener el store de la aplicación
const appStore = useAppStore();
const router = useRouter();

// Usuario actual
const currentUserId = computed(() =>
  appStore.getUserId() ? appStore.getUserId().toString() : null
);

// Formatear precio para mostrar dos decimales
const formatPrice = (price) => {
  return Number(price).toFixed(2);
};

// Cargar productos de la cantina
const loadMenuItems = async () => {
  try {
    loading.value = true;
    error.value = null;

    const items = await getAllEnabledCanteenItems();

    if (!items) {
      throw new Error("No se pudieron cargar los productos del menú");
    }

    menuItems.value = items;
  } catch (err) {
    console.error("Error al cargar productos de cantina:", err);
    error.value =
      "No se pudieron cargar los productos del menú. Por favor, inténtalo de nuevo más tarde.";
  } finally {
    loading.value = false;
  }
};

// Iniciar chat con la cantina
const startCanteenChat = async () => {
  try {
    chatLoading.value = true;
    chatError.value = null;

    // Buscar explícitamente el usuario cantina (tipo 5)
    const usersResponse = await getAllUsers();
    const canteenUser = usersResponse.find((user) => user.typeUsers_id === 5);

    if (!canteenUser) {
      throw new Error(
        "No se pudo encontrar el usuario de cantina (typeUser 5)"
      );
    }

    // Guardar el ID para referencias futuras
    canteenUserId.value = canteenUser.id;

    // Verificar si ya existe un chat entre el usuario actual y la cantina
    const allChats = await chatManager.getAllChats();
    const existingChat = allChats.find(
      (chat) =>
        chat.teachers &&
        chat.teachers.includes(parseInt(currentUserId.value)) &&
        chat.teachers.includes(parseInt(canteenUserId.value))
    );

    let chatId;

    if (existingChat) {
      // Usar el chat existente
      chatId = existingChat._id;
    } else {
      // Crear un nuevo chat con la cantina
      const canteenName = canteenUser.name || canteenUser.username || "Cantina";

      const newChat = await chatManager.createChat({
        name: `Chat de ${appStore.getUser().name} con ${canteenName}`,
        teachers: [
          parseInt(currentUserId.value),
          parseInt(canteenUserId.value),
        ],
        interaction: [],
        requesterId: currentUserId.value,
      });

      chatId = newChat._id;
    }

    // Navegar al chat
    router.push({
      name: "chat-detail",
      params: { chatId },
    });
  } catch (error) {
    console.error("Error al iniciar chat con cantina:", error);
    chatError.value =
      "No se pudo iniciar el chat con la cantina. Intente de nuevo más tarde.";
  } finally {
    chatLoading.value = false;
  }
};

onMounted(async () => {
  // Verificar si el usuario está autenticado
  if (!currentUserId.value) {
    error.value = "Debes iniciar sesión para acceder al chat de cantina";
    loading.value = false;
    return;
  }

  // Cargar productos del menú
  await loadMenuItems();
});
</script>

<style scoped>
.canteen-page-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

h2 {
  margin-bottom: 30px;
  color: #333;
  text-align: center;
  font-size: 2rem;
}

h3 {
  margin-bottom: 20px;
  color: #444;
  font-size: 1.5rem;
}

.canteen-content {
  display: grid;
  grid-template-columns: 1fr;
  gap: 30px;
}

@media (min-width: 768px) {
  .canteen-content {
    grid-template-columns: 3fr 2fr;
  }
}

.menu-section,
.chat-section {
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 25px;
}

.menu-items-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 15px;
}

.menu-item-card {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.menu-item-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.menu-item-name {
  font-weight: bold;
  margin-bottom: 8px;
  color: #333;
}

.menu-item-price {
  color: #28a745;
  font-weight: 600;
  font-size: 1.1rem;
}

.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-left-color: #28a745;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 15px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.error-message,
.empty-menu {
  text-align: center;
  padding: 30px;
  color: #6c757d;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.error-message {
  color: #dc3545;
  border-left: 4px solid #dc3545;
}

.chat-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.chat-info p {
  margin-bottom: 25px;
  color: #6c757d;
  line-height: 1.6;
}

.canteen-chat-button {
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 10px;
  padding: 15px 30px;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 16px;
  width: auto;
  margin: 0 auto;
}

.canteen-chat-button:hover:not(:disabled) {
  background-color: #218838;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

.canteen-chat-button:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
  opacity: 0.7;
}

.chat-error {
  margin-top: 15px;
  color: #dc3545;
  font-size: 0.9rem;
}
</style>
