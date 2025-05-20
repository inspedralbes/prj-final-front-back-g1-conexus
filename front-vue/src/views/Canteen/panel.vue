<template>
  <div class="animate-fade-in mt-9 mb-9">
    <!-- Encabezado -->
    <div class="mb-8 text-center">
      <h1
        class="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400"
      >
        Panell de Cantina
      </h1>
      <p class="text-gray-300 mt-2">
        Gestió de comandes i menú del servei de cantina
      </p>
    </div>

    <!-- Tarjetas de Resumen -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <!-- Pedidos Nuevos -->
      <div
        class="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
      >
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-lg font-semibold text-gray-300">Comandes noves</h3>
            <p class="text-3xl font-bold mt-2">{{ orderStats.new || 0 }}</p>
            <p class="text-sm text-gray-400 mt-1">Pendents de preparar</p>
          </div>
          <div class="p-3 rounded-full bg-blue-500/20">
            <svg
              class="w-8 h-8 text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
          </div>
        </div>
        <router-link
          to="/canteen/chat"
          class="mt-4 inline-flex items-center text-sm text-blue-400 hover:text-blue-300 transition-colors"
        >
          Atendre comandes
          <svg
            class="w-4 h-4 ml-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </router-link>
      </div>

      <!-- Pedidos en Preparación -->
      <div
        class="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
      >
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-lg font-semibold text-gray-300">En preparació</h3>
            <p class="text-3xl font-bold mt-2">
              {{ orderStats.active - orderStats.new || 0 }}
            </p>
            <p class="text-sm text-gray-400 mt-1">Comandes en procés</p>
          </div>
          <div class="p-3 rounded-full bg-yellow-500/20">
            <svg
              class="w-8 h-8 text-yellow-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
          </div>
        </div>
        <router-link
          to="/canteen/chat"
          class="mt-4 inline-flex items-center text-sm text-yellow-400 hover:text-yellow-300 transition-colors"
        >
          Veure en preparació
          <svg
            class="w-4 h-4 ml-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </router-link>
      </div>

      <!-- Pedidos Listos -->
      <div
        class="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
      >
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-lg font-semibold text-gray-300">
              Llestes per recollir
            </h3>
            <p class="text-3xl font-bold mt-2">
              {{ orderStats.completed || 0 }}
            </p>
            <p class="text-sm text-gray-400 mt-1">Esperant recollida</p>
          </div>
          <div class="p-3 rounded-full bg-green-500/20">
            <svg
              class="w-8 h-8 text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>
        <router-link
          to="/canteen/chat"
          class="mt-4 inline-flex items-center text-sm text-green-400 hover:text-green-300 transition-colors"
        >
          Veure llestes
          <svg
            class="w-4 h-4 ml-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </router-link>
      </div>

      <!-- Productos del Menú -->
      <div
        class="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
      >
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-lg font-semibold text-gray-300">
              Productes disponibles
            </h3>
            <p class="text-3xl font-bold mt-2">
              {{ menuStats.available || 0 }}
            </p>
            <p class="text-sm text-gray-400 mt-1">
              De {{ menuStats.total || 0 }} en total
            </p>
          </div>
          <div class="p-3 rounded-full bg-purple-500/20">
            <svg
              class="w-8 h-8 text-purple-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
        </div>
        <router-link
          to="/canteen/menu-admin"
          class="mt-4 inline-flex items-center text-sm text-purple-400 hover:text-purple-300 transition-colors"
        >
          Gestionar menú
          <svg
            class="w-4 h-4 ml-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </router-link>
      </div>
    </div>

    <!-- Sección de Pedidos Recientes -->
    <div class="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 shadow-lg mb-8">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold text-gray-300">Comandes recents</h2>
        <button
          @click="loadRecentOrders"
          class="text-sm text-blue-400 hover:text-blue-300 transition-colors"
        >
          Actualitzar
        </button>
      </div>

      <div v-if="isLoadingOrders" class="flex justify-center py-4">
        <div
          class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-400"
        ></div>
      </div>

      <div
        v-else-if="recentOrders.length === 0"
        class="text-center py-4 text-gray-400"
      >
        No hi ha comandes recents
      </div>

      <div v-else class="space-y-4">
        <!-- Lista de pedidos recientes -->
        <div
          v-for="(order, index) in recentOrders"
          :key="index"
          class="flex items-start p-3 hover:bg-slate-700/30 rounded-lg transition-colors"
        >
          <!-- Icono según estado del pedido -->
          <div
            class="p-2 rounded-lg mr-3"
            :class="getOrderStatusClass(order.status).bgColor"
          >
            <svg
              class="w-5 h-5"
              :class="getOrderStatusClass(order.status).textColor"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                :d="getOrderStatusClass(order.status).icon"
              />
            </svg>
          </div>
          <div class="flex-1">
            <p class="font-medium">Comanda de {{ order.userName }}</p>
            <p class="text-sm text-gray-400">{{ getOrderSummary(order) }}</p>
          </div>
          <span class="text-xs text-gray-500">{{
            formatTimeAgo(order.timestamp)
          }}</span>
        </div>
      </div>
    </div>

    <!-- Acciones Rápidas -->
    <div class="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 shadow-lg">
      <h2 class="text-xl font-semibold text-gray-300 mb-4">
        Gestió de la Cantina
      </h2>
      <p class="text-sm text-gray-400 mb-5">
        Accedeix ràpidament a les eines de gestió de la cantina
      </p>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        <router-link
          to="/canteen/menu-admin"
          class="flex items-center justify-center p-4 bg-blue-500/10 hover:bg-blue-500/20 rounded-lg transition-colors"
        >
          <svg
            class="w-5 h-5 mr-2 text-blue-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
          <span>Nou producte</span>
        </router-link>

        <router-link
          to="/canteen/chat"
          class="flex items-center justify-center p-4 bg-purple-500/10 hover:bg-purple-500/20 rounded-lg transition-colors"
        >
          <svg
            class="w-5 h-5 mr-2 text-purple-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          <span>Veure missatges</span>
        </router-link>

        <!-- <router-link
          to="/canteen"
          class="flex items-center justify-center p-4 bg-amber-500/10 hover:bg-amber-500/20 rounded-lg transition-colors"
        >
          <svg
            class="w-5 h-5 mr-2 text-amber-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
          <span>Historial Comandes</span>
        </router-link>

        <router-link
          to="/canteen"
          class="flex items-center justify-center p-4 bg-green-500/10 hover:bg-green-500/20 rounded-lg transition-colors"
        >
          <svg
            class="w-5 h-5 mr-2 text-green-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>Horaris Cantina</span>
        </router-link> -->
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useAppStore } from "@/stores";
import { getAllCanteenItems } from "@/services/communicationsScripts/canteenComManager";
import chatManager from "@/services/communicationsScripts/chatsComManager";
import { getAllUsers } from "@/services/communicationsScripts/mainManager";

// Definir variables reactivas para almacenar las estadísticas
const orderStats = ref({
  active: 0,
  new: 0,
  completed: 0,
  completedToday: 0,
});

const menuStats = ref({
  total: 0,
  available: 0,
});

const messageStats = ref({
  total: 0,
  unread: 0,
});

const popularStats = ref({
  name: "",
  orders: 0,
});

// Variables para pedidos recientes
const recentOrders = ref([]);
const isLoadingOrders = ref(false);

// Variable para el intervalo de actualización
let statsRefreshInterval = null;

// Tienda Vuex
const store = useAppStore();

// Cargar estadísticas
const loadStats = async () => {
  try {
    // Cargar menú para obtener estadísticas
    const menuItems = await getAllCanteenItems();
    menuStats.value = {
      total: menuItems.length,
      available: menuItems.filter((item) => item.product_enabled).length,
    };

    // Obtener chats con información de pedidos
    const chats = await chatManager.getAllChats();

    // Identificar chats que pertenecen a la cantina
    const canteenChats = chats.filter(
      (chat) =>
        chat.teachers &&
        chat.interaction &&
        chat.interaction.length > 0 &&
        chat.teachers.includes(parseInt(store.getUserId()))
    );

    // Filtrar chats que contienen pedidos (mensajes con formato de pedido)
    const orderChats = canteenChats.filter((chat) => {
      // Verificar si algún mensaje tiene formato de pedido
      return chat.interaction.some(
        (msg) =>
          msg.message.includes("🛒") ||
          msg.message.includes("Pedido") ||
          msg.message.includes("Total:") ||
          msg.message.includes("€")
      );
    });

    // Contar pedidos por estado
    const newOrders = orderChats.filter(
      (chat) =>
        store.canteenOrderStatus[chat._id] === "new" ||
        !store.canteenOrderStatus[chat._id] // Si no tiene estado, se considera nuevo
    );

    const preparingOrders = orderChats.filter(
      (chat) => store.canteenOrderStatus[chat._id] === "preparing"
    );

    const readyOrders = orderChats.filter(
      (chat) => store.canteenOrderStatus[chat._id] === "ready"
    );

    // Actualizar estadísticas de pedidos con datos reales
    orderStats.value = {
      active: newOrders.length + preparingOrders.length,
      new: newOrders.length,
      completed: readyOrders.length,
      completedToday: readyOrders.filter((chat) => {
        // Verificar si el pedido se completó hoy
        const lastMessage = chat.interaction[chat.interaction.length - 1];
        if (!lastMessage || !lastMessage.date) return false;

        const messageDate = new Date(lastMessage.date);
        const today = new Date();
        return (
          messageDate.getDate() === today.getDate() &&
          messageDate.getMonth() === today.getMonth() &&
          messageDate.getFullYear() === today.getFullYear()
        );
      }).length,
    };

    // Actualizar estadísticas de mensajes con datos reales
    let totalMessages = 0;
    let unreadMessages = 0;

    canteenChats.forEach((chat) => {
      if (chat.interaction) {
        totalMessages += chat.interaction.length;

        // Contar mensajes no leídos (mensajes del cliente sin respuesta de la cantina)
        // Esto es una aproximación, lo ideal sería tener un campo en la BD para marcar mensajes como leídos
        const lastMessage = chat.interaction[chat.interaction.length - 1];
        if (
          lastMessage &&
          parseInt(lastMessage.teacherId) !== parseInt(store.getUserId())
        ) {
          unreadMessages++;
        }
      }
    });

    messageStats.value = {
      total: totalMessages,
      unread: unreadMessages,
    };

    // Cargar pedidos recientes
    await loadRecentOrders();
  } catch (error) {
    console.error("Error loading stats:", error);
  }
};

// Función para cargar pedidos recientes
const loadRecentOrders = async () => {
  isLoadingOrders.value = true;
  try {
    // Obtener todos los chats de la cantina
    const chats = await chatManager.getAllChats();
    console.log("ACTUALIZACIÓN: Todos los chats obtenidos:", chats.length);

    // Filtrar chats con pedidos relevantes para la cantina
    const orderChats = chats.filter(
      (chat) =>
        chat.interaction &&
        chat.interaction.length > 0 &&
        chat.teachers &&
        chat.teachers.includes(parseInt(store.getUserId())) &&
        // Verificar si algún mensaje tiene formato de pedido
        chat.interaction.some(
          (msg) =>
            msg.message.includes("🛒") ||
            msg.message.includes("Pedido") ||
            msg.message.includes("Total:") ||
            (msg.message.includes("Pedido") && msg.message.includes("€"))
        )
    );
    console.log("ACTUALIZACIÓN: Chats con pedidos:", orderChats.length);

    // Obtener todos los usuarios para mostrar nombres correctos
    const allUsers = await getAllUsers();
    const userMap = {};
    allUsers.forEach((user) => {
      userMap[user.id] = user.name || user.username || `Usuario ${user.id}`;
    });

    // Array para almacenar TODOS los mensajes de pedido de TODOS los chats
    const allOrderMessages = [];

    // Para cada chat, extraer TODOS los mensajes que son pedidos
    orderChats.forEach((chat) => {
      // Obtener el usuario del chat
      const otherUserId = chat.teachers.find(
        (id) => id !== parseInt(store.getUserId())
      );
      const userName = userMap[otherUserId] || `Usuario ${otherUserId}`;

      // Extraer todos los mensajes que tienen formato de pedido
      const orderMessages = chat.interaction.filter(
        (msg) =>
          msg.message.includes("🛒") ||
          msg.message.includes("Pedido") ||
          msg.message.includes("Total:") ||
          (msg.message.includes("Pedido") && msg.message.includes("€"))
      );

      // Para cada mensaje de pedido, crear un objeto de pedido y agregarlo a la lista
      orderMessages.forEach((msg) => {
        // Solo procesar mensajes que NO son del usuario cantina (solo pedidos de clientes)
        if (parseInt(msg.teacherId) !== parseInt(store.getUserId())) {
          allOrderMessages.push({
            id: chat._id,
            messageId: msg._id,
            userName: userName,
            status: store.canteenOrderStatus[chat._id] || "new",
            items: extractOrderItems(msg.message),
            timestamp: new Date(msg.date),
            total: extractTotal(msg.message),
            message: msg.message,
            date: msg.date,
          });
        }
      });
    });

    console.log(
      "ACTUALIZACIÓN: Total mensajes de pedido encontrados:",
      allOrderMessages.length
    );

    // Ordenar por fecha (más reciente primero) y tomar los 5 más recientes
    recentOrders.value = allOrderMessages
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 5);

    console.log(
      "ACTUALIZACIÓN: Pedidos recientes actualizados:",
      recentOrders.value
    );
  } catch (error) {
    console.error("Error al cargar pedidos recientes:", error);
    recentOrders.value = [];
  } finally {
    isLoadingOrders.value = false;
  }
};

// Función para simular exportación de datos
const exportOrderData = () => {
  alert("Función de exportación de informes en desarrollo");
};

// Función para mostrar el historial de pedidos
const showOrderHistory = () => {
  alert("Historial de pedidos en desarrollo");
};

// Función para ver los productos populares
const viewPopularItems = () => {
  alert("Vista de productos populares en desarrollo");
};

// Función para actualizar las estadísticas
const refreshStats = () => {
  loadStats();
};

// Extraer resumen de pedido
const getOrderSummary = (order) => {
  if (order.items && order.items.length > 0) {
    const displayItems = order.items.slice(0, 2);
    const remaining = order.items.length - 2;
    const summary = displayItems.join(", ");
    return `${summary}${remaining > 0 ? ` y ${remaining} más` : ""} - Total: ${
      order.total || "?"
    }€`;
  }
  return "Pedido sin detalles";
};

// Extraer ítems de un mensaje de pedido
const extractOrderItems = (message) => {
  // Esta es una función simulada - en realidad necesitaría una lógica más robusta
  // para extraer los ítems de un mensaje con formato de pedido
  const items = [];
  const lines = message.split("\n");

  for (const line of lines) {
    if (line.includes("•") || line.includes("-")) {
      const item = line.replace(/•|-/g, "").trim();
      if (item && !item.includes("Total:")) {
        items.push(item.split(" - ")[0]);
      }
    }
  }

  return items.length > 0 ? items : ["Producto no especificado"];
};

// Extraer el total de un mensaje de pedido
const extractTotal = (message) => {
  if (!message) return "?";

  // Buscar un patrón de precio total
  const totalMatch = message.match(/Total:\s*(\d+[\.,]\d+)/);
  if (totalMatch && totalMatch[1]) {
    return totalMatch[1].replace(",", ".");
  }

  // Intentar encontrar cualquier valor con formato de precio
  const priceMatch = message.match(/(\d+[\.,]\d+)\s*€/);
  return priceMatch && priceMatch[1] ? priceMatch[1].replace(",", ".") : "?";
};

// Formatear tiempo transcurrido
const formatTimeAgo = (dateString) => {
  try {
    if (!dateString) return "Fecha desconocida";

    const now = new Date();
    const date = new Date(dateString);

    // Verificar que la fecha sea válida
    if (isNaN(date.getTime())) return "Fecha inválida";

    const diffMs = now - date;
    if (diffMs < 0) return "Fecha futura";

    const diffMins = Math.round(diffMs / 60000);

    if (diffMins < 1) return "Justo ahora";
    if (diffMins < 60) return `Hace ${diffMins} min`;

    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24)
      return `Hace ${diffHours} hora${diffHours > 1 ? "s" : ""}`;

    const diffDays = Math.floor(diffHours / 24);
    return `Hace ${diffDays} día${diffDays > 1 ? "s" : ""}`;
  } catch (error) {
    console.error("Error al formatear fecha:", error);
    return "Fecha desconocida";
  }
};

// Obtener clase según estado del pedido
const getOrderStatusClass = (status) => {
  switch (status) {
    case "new":
      return {
        bgColor: "bg-blue-500/10",
        textColor: "text-blue-400",
        icon: "M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z",
      };
    case "preparing":
      return {
        bgColor: "bg-yellow-500/10",
        textColor: "text-yellow-400",
        icon: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9",
      };
    case "ready":
      return {
        bgColor: "bg-green-500/10",
        textColor: "text-green-400",
        icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
      };
    case "completed":
      return {
        bgColor: "bg-purple-500/10",
        textColor: "text-purple-400",
        icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
      };
    default:
      return {
        bgColor: "bg-gray-500/10",
        textColor: "text-gray-400",
        icon: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
      };
  }
};

// Cargar los datos cuando el componente se monte
onMounted(() => {
  loadStats();

  // Configurar un intervalo para actualizar las estadísticas periódicamente
  statsRefreshInterval = setInterval(() => {
    loadStats();
  }, 30000); // Actualizar cada 30 segundos
});

// Limpiar el intervalo cuando se desmonte el componente
onUnmounted(() => {
  if (statsRefreshInterval) {
    clearInterval(statsRefreshInterval);
    statsRefreshInterval = null;
  }
});
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.8s ease-in-out;
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
</style>
