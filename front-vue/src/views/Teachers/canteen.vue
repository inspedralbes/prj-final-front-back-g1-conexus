<template>
  <div class="animate-fade-in mt-9 mb-9">
    <!-- Capçalera -->
    <div class="flex justify-between items-center mb-8">
      <div>
        <h2 class="text-2xl font-bold text-white mb-2">
          <span
            class="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400"
          >
            Cantina
          </span>
        </h2>
        <p class="text-gray-400 text-sm">
          Explora i demana del nostre menú diari
        </p>
      </div>
      <div class="bg-purple-500/10 p-3 rounded-lg border border-purple-500/20">
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
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Menú del día - Ocupa 2 columnas -->
      <div class="lg:col-span-2 space-y-8">
        <!-- Menú del día Card -->
        <div
          class="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 shadow-xl border border-slate-700/30 hover:shadow-lg hover:shadow-purple-500/5 transition-all duration-300"
        >
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-xl font-semibold text-white flex items-center">
              <svg
                class="w-6 h-6 mr-2 text-yellow-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
                />
              </svg>
              Menú del Dia
            </h3>
            <span
              class="px-3 py-1 bg-green-500/10 text-green-400 rounded-lg text-sm font-medium border border-green-500/20"
            >
              Disponible ara
            </span>
          </div>

          <!-- Menú del día content -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Mensaje de menú no disponible -->
            <div class="col-span-2 text-center py-6">
              <p class="text-gray-400 italic">
                Menú del dia no disponible actualment
              </p>
            </div>

            <!-- Estos elementos están comentados temporalmente -->
            <!-- 
            <div
              v-for="(item, index) in menuOptions"
              :key="`menu-${index}`"
              @click="addToCart(item)"
              class="bg-slate-700/40 rounded-lg p-4 hover:bg-slate-700/60 transition-all duration-300 cursor-pointer border border-slate-600/30 hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/5"
            >
              <div class="flex justify-between mb-3">
                <h4 class="font-medium text-white">{{ item.name }}</h4>
                <span class="text-purple-400 font-bold">{{ formatPrice(item.price) }} €</span>
              </div>
              <ul class="text-gray-300 text-sm space-y-1 mb-3">
                <li class="flex items-start" v-if="item.description">
                  <svg
                    class="w-4 h-4 text-green-400 mt-0.5 mr-2 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>{{ item.description }}</span>
                </li>
              </ul>
              <button
                class="w-full py-2 px-4 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-lg shadow-md transition-all duration-300 flex items-center justify-center"
              >
                <svg
                  class="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                Afegir al Carret
              </button>
            </div>
            -->
          </div>
        </div>

        <!-- Entrepans Card -->
        <div
          class="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 shadow-xl border border-slate-700/30 hover:shadow-lg hover:shadow-purple-500/5 transition-all duration-300"
        >
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-xl font-semibold text-white flex items-center">
              <svg
                class="w-6 h-6 mr-2 text-yellow-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M16 4v12l-4-2-4 2V4M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              Entrepans i Snacks
            </h3>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div
              v-for="(item, index) in sandwichItems"
              :key="`sandwich-${index}`"
              @click="addToCart(item)"
              class="flex justify-between items-center p-3 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 transition-all duration-300 cursor-pointer border border-slate-600/20 hover:border-purple-500/20"
            >
              <div>
                <h4 class="font-medium text-white">{{ item.name }}</h4>
                <p class="text-xs text-gray-400">{{ item.description }}</p>
              </div>
              <div class="flex items-center">
                <span class="text-purple-400 font-bold mr-3"
                  >{{ formatPrice(item.price) }} €</span
                >
                <button
                  class="p-1.5 rounded-full bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 transition-colors border border-purple-500/10"
                >
                  <svg
                    class="w-4 h-4"
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
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Begudes Card -->
        <div
          class="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 shadow-xl border border-slate-700/30 hover:shadow-lg hover:shadow-purple-500/5 transition-all duration-300"
        >
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-xl font-semibold text-white flex items-center">
              <svg
                class="w-6 h-6 mr-2 text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              Begudes
            </h3>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            <div
              v-for="(item, index) in drinkItems"
              :key="`drink-${index}`"
              @click="addToCart(item)"
              class="p-3 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 transition-all duration-300 cursor-pointer border border-slate-600/20 hover:border-purple-500/20 flex justify-between items-center"
            >
              <span class="text-white">{{ item.name }}</span>
              <div class="flex items-center">
                <span class="text-purple-400 font-bold mr-3"
                  >{{ formatPrice(item.price) }} €</span
                >
                <button
                  class="p-1.5 rounded-full bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 transition-colors border border-purple-500/10"
                >
                  <svg
                    class="w-4 h-4"
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
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Carret de compra - Ocupa 1 columna -->
      <div class="space-y-6">
        <!-- Carret Card -->
        <div
          class="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 shadow-xl border border-slate-700/30 sticky top-6"
        >
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-xl font-semibold text-white flex items-center">
              <svg
                class="w-6 h-6 mr-2 text-purple-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              El teu Carret
            </h3>
            <span
              v-if="cart.length > 0"
              class="w-6 h-6 flex items-center justify-center bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-full text-xs font-bold"
            >
              {{ cart.length }}
            </span>
          </div>

          <!-- Cart Items -->
          <div v-if="cart.length === 0" class="py-8 text-center text-gray-400">
            <svg
              class="w-12 h-12 mx-auto text-gray-500 mb-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <p>El teu carret està buit</p>
            <p class="text-sm mt-2">Afegeix productes del menú per començar</p>
          </div>

          <div
            v-else
            class="space-y-3 max-h-[400px] overflow-y-auto pr-2 -mr-2 mb-4 custom-scrollbar"
          >
            <div
              v-for="(item, index) in cart"
              :key="`cart-${index}`"
              class="flex justify-between items-center p-3 rounded-lg bg-slate-700/30 border border-slate-600/20 hover:border-slate-600/40 transition-all duration-200"
            >
              <div class="flex-1">
                <h4 class="font-medium text-white text-sm">
                  {{ item.product_name || item.name }}
                </h4>
                <div class="flex items-center mt-1">
                  <button
                    @click="decreaseQuantity(index)"
                    class="p-1 rounded-full bg-slate-600/50 text-white hover:bg-slate-600 transition-colors"
                  >
                    <svg
                      class="w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="3"
                        d="M20 12H4"
                      />
                    </svg>
                  </button>
                  <span class="mx-2 text-white">{{ item.quantity || 1 }}</span>
                  <button
                    @click="increaseQuantity(index)"
                    class="p-1 rounded-full bg-slate-600/50 text-white hover:bg-slate-600 transition-colors"
                  >
                    <svg
                      class="w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="3"
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </button>
                </div>
              </div>
              <div class="text-right">
                <p class="text-purple-400 font-bold">
                  {{
                    formatPrice(
                      (item.product_price || item.price) * (item.quantity || 1)
                    )
                  }}
                  €
                </p>
                <button
                  @click="removeFromCart(index)"
                  class="text-red-400 hover:text-red-300 text-xs mt-1 transition-colors duration-200"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>

          <!-- Cart Total -->
          <div
            v-if="cart.length > 0"
            class="border-t border-slate-700/50 pt-4 mt-4"
          >
            <div class="flex justify-between items-center mb-4">
              <span class="text-gray-300">Subtotal:</span>
              <span class="text-white font-bold"
                >{{ formatPrice(calculateTotal()) }} €</span
              >
            </div>

            <button
              @click="startChat"
              class="w-full py-3 px-4 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-lg shadow-md transition-all duration-300 flex items-center justify-center font-medium transform hover:-translate-y-0.5"
            >
              <svg
                class="w-5 h-5 mr-2"
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
              Demanar per Xat
            </button>
          </div>
        </div>

        <!-- Horari Card -->
        <div
          class="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 shadow-xl border border-slate-700/30 hover:shadow-lg hover:shadow-purple-500/5 transition-all duration-300"
        >
          <div class="flex items-center mb-4">
            <svg
              class="w-6 h-6 mr-2 text-green-400"
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
            <h3 class="text-xl font-semibold text-white">Horari</h3>
          </div>

          <div class="space-y-2">
            <div class="flex justify-between text-sm">
              <span class="text-gray-400">Dilluns a Divendres:</span>
              <span class="text-white">8:00 - 17:00</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-400">Dissabte:</span>
              <span class="text-white">Tancat</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-400">Diumenge:</span>
              <span class="text-white">Tancat</span>
            </div>
          </div>

          <div
            class="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center"
          >
            <div
              class="w-2 h-2 rounded-full bg-green-400 mr-2 animate-pulse"
            ></div>
            <span class="text-green-400 text-sm">Obert Ara</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Notification Toast -->
    <div
      v-if="showNotification"
      class="fixed bottom-6 right-6 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg shadow-lg transition-all duration-500 animate-fade-in"
    >
      <div class="flex items-center">
        <svg
          class="w-6 h-6 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M5 13l4 4L19 7"
          />
        </svg>
        Producte afegit al carret
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { useAppStore } from "@/stores";
import { getAllUsers } from "@/services/communicationsScripts/mainManager";
import chatManager from "@/services/communicationsScripts/chatsComManager";
import { getAllCanteenItems } from "@/services/communicationsScripts/canteenComManager";

const router = useRouter();
const appStore = useAppStore();

// Estado de carga y errores
const loading = ref(true);
const error = ref(null);
const showNotification = ref(false);
const chatLoading = ref(false);
const chatError = ref(null);
const canteenUserId = ref(null);

// Items del menú y del carrito
const menuItems = ref([]);
const cart = computed(() => {
  // Agrupar productos del mismo tipo
  const groupedItems = {};

  appStore.cartCantinaItems.forEach((item) => {
    const productId = item.product_id || item.id;
    if (!groupedItems[productId]) {
      groupedItems[productId] = {
        id: item.id || item.product_id,
        product_id: item.product_id || item.id,
        product_name: item.product_name || item.name || "Producto sin nombre",
        product_price: parseFloat(item.product_price || item.price || 0),
        quantity: 0,
        // Mantener referencia al primer item para poder eliminarlo después
        originalItem: item,
      };
    }
    // Incrementar la cantidad
    groupedItems[productId].quantity += 1;
  });

  // Convertir objeto a array
  return Object.values(groupedItems);
});

// Datos para mostrar en la UI
const menuOptions = computed(() => {
  return menuItems.value
    .filter(
      (item) =>
        item.product_name.toLowerCase().includes("menú") ||
        item.product_category === "menu"
    )
    .map((item) => ({
      id: item.id || item.product_id,
      name: item.product_name,
      description: item.product_description || "Menú completo",
      price: item.product_price,
      type: "menu",
    }));
});

const sandwichItems = computed(() => {
  return menuItems.value
    .filter(
      (item) =>
        item.product_name.toLowerCase().includes("entrepà") ||
        item.product_category === "sandwich"
    )
    .map((item) => ({
      id: item.id || item.product_id,
      name: item.product_name,
      description: item.product_description || "Entrepà",
      price: item.product_price,
      type: "sandwich",
    }));
});

const drinkItems = computed(() => {
  return menuItems.value
    .filter(
      (item) =>
        item.product_name.toLowerCase().includes("beguda") ||
        item.product_category === "drink"
    )
    .map((item) => ({
      id: item.id || item.product_id,
      name: item.product_name,
      price: item.product_price,
      type: "drink",
    }));
});

// ID del usuario actual
const currentUserId = computed(() =>
  appStore.getUserId() ? appStore.getUserId().toString() : null
);

// Función para formatear precios
const formatPrice = (price) => {
  return Number(price).toFixed(2);
};

// Añadir al carrito
const addToCart = (item) => {
  // Asegurarse de que el precio sea un número
  const price = parseFloat(item.price);

  if (isNaN(price)) {
    console.error("Error: Precio inválido para el item", item);
    return; // No añadir item con precio inválido
  }

  // Crear objeto de ítem para el carrito
  const cartItem = {
    id: item.id,
    product_id: item.id,
    product_name: item.name,
    product_price: price,
    quantity: 1,
  };

  appStore.addToCartCantina(cartItem);

  // Mostrar notificación
  showNotification.value = true;
  setTimeout(() => {
    showNotification.value = false;
  }, 2000);
};

// Eliminar del carrito
const removeFromCart = (index) => {
  const item = cart.value[index];

  // Eliminar todos los items con el mismo product_id
  const itemsToRemove = [...appStore.cartCantinaItems].filter(
    (i) => (i.product_id || i.id) === (item.product_id || item.id)
  );

  itemsToRemove.forEach((itemToRemove) => {
    appStore.removeFromCartCantina(itemToRemove);
  });
};

// Aumentar cantidad
const increaseQuantity = (index) => {
  const item = cart.value[index];

  // Asegurarse de que el precio sea un número
  let price = 0;
  if (item.product_price !== undefined) {
    price = parseFloat(item.product_price);
  } else if (item.price !== undefined) {
    price = parseFloat(item.price);
  }

  if (isNaN(price)) {
    console.error("Precio inválido en increaseQuantity:", item);
    return; // No aumentar si el precio es inválido
  }

  // Añadir un item adicional con la misma estructura
  appStore.addToCartCantina({
    id: item.id || item.product_id,
    product_id: item.product_id || item.id,
    product_name: item.product_name,
    product_price: price,
    quantity: 1,
  });
};

// Disminuir cantidad
const decreaseQuantity = (index) => {
  const item = cart.value[index];

  if (item.quantity <= 1) {
    // Si solo queda uno, eliminar el elemento
    // Usamos originalItem para asegurarnos de eliminar el correcto
    appStore.removeFromCartCantina(item.originalItem);
  } else {
    // Si hay más de uno, solo eliminar uno
    // Buscar un item con el mismo product_id
    const itemToRemove = appStore.cartCantinaItems.find(
      (i) => (i.product_id || i.id) === (item.product_id || item.id)
    );

    if (itemToRemove) {
      appStore.removeFromCartCantina(itemToRemove);
    }
  }
};

// Calcular total
const calculateTotal = () => {
  return cart.value.reduce((total, item) => {
    // Asegurarse de que price sea un número válido
    let price = 0;
    if (item.product_price !== undefined) {
      price = parseFloat(item.product_price);
    } else if (item.price !== undefined) {
      price = parseFloat(item.price);
    }

    // Asegurarse de que quantity sea un número válido
    const quantity = item.quantity || 1;

    // Si el precio no es un número válido, usar 0
    if (isNaN(price)) {
      console.error("Precio inválido para item:", item);
      price = 0;
    }

    return total + price * quantity;
  }, 0);
};

// Generar mensaje de pedido para el chat
const generateOrderMessage = () => {
  if (cart.value.length === 0) {
    return null;
  }

  let message = "🛒 *Nuevo Pedido*\n\n";

  // Agrupar por producto para mostrar cantidad x producto
  const groupedItems = {};

  cart.value.forEach((item) => {
    const productId = item.product_id || item.id;
    if (!groupedItems[productId]) {
      // Asegurarse de que el precio sea un número
      let price = 0;
      if (item.product_price !== undefined) {
        price = parseFloat(item.product_price);
      } else if (item.price !== undefined) {
        price = parseFloat(item.price);
      }

      if (isNaN(price)) {
        console.error("Precio inválido en generateOrderMessage:", item);
        price = 0;
      }

      groupedItems[productId] = {
        name: item.product_name || item.name,
        price: price,
        quantity: 0,
      };
    }
    groupedItems[productId].quantity += 1;
  });

  // Generar mensaje para cada producto agrupado
  Object.values(groupedItems).forEach((item) => {
    const totalItemPrice = item.price * item.quantity;
    message += `• ${item.quantity}x ${item.name} - ${formatPrice(
      totalItemPrice
    )} €\n`;
  });

  message += `\n*Total: ${formatPrice(calculateTotal())} €*`;

  return message;
};

// Iniciar chat con la cantina
const startChat = async () => {
  try {
    if (cart.value.length === 0) return;

    chatLoading.value = true;
    chatError.value = null;

    // Buscar explícitamente el usuario cantina (tipo 5)
    const usersResponse = await getAllUsers();
    const canteenUser = usersResponse.find((user) => user.typeUsers_id === 5);

    if (!canteenUser) {
      throw new Error("No se pudo encontrar el usuario de cantina");
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

    // Generar mensaje de pedido
    const orderMessage = generateOrderMessage();

    // Navegar al chat con el pedido
    router.push({
      name: "chat-detail",
      params: { chatId },
      query: orderMessage ? { order: encodeURIComponent(orderMessage) } : {},
    });
  } catch (err) {
    console.error("Error al iniciar chat con cantina:", err);
    chatError.value =
      "No se pudo iniciar el chat con la cantina. Intente de nuevo más tarde.";
  } finally {
    chatLoading.value = false;
  }
};

// Cargar productos de la cantina
const loadMenuItems = async () => {
  try {
    loading.value = true;
    error.value = null;

    const items = await getAllCanteenItems();

    if (!items || items.length === 0) {
      // Si no hay productos, cargar datos de ejemplo
      menuItems.value = [
        // Menús
        {
          id: "menu1",
          product_id: "menu1",
          product_name: "Menú Complet #1",
          product_description: "Primer, segon, postre i beguda",
          product_price: 8.5,
          product_category: "menu",
        },
        {
          id: "menu2",
          product_id: "menu2",
          product_name: "Menú Complet #2",
          product_description: "Primer, segon, postre i beguda",
          product_price: 8.5,
          product_category: "menu",
        },
        // Sandwiches
        {
          id: "sand1",
          product_id: "sand1",
          product_name: "Entrepà de Pernil",
          product_description: "Pernil ibèric amb tomàquet",
          product_price: 3.8,
          product_category: "sandwich",
        },
        {
          id: "sand2",
          product_id: "sand2",
          product_name: "Entrepà de Formatge",
          product_description: "Formatge semi-curat amb tomàquet",
          product_price: 3.5,
          product_category: "sandwich",
        },
        {
          id: "sand3",
          product_id: "sand3",
          product_name: "Entrepà Mixte",
          product_description: "Pernil dolç i formatge fos",
          product_price: 3.6,
          product_category: "sandwich",
        },
        {
          id: "sand4",
          product_id: "sand4",
          product_name: "Entrepà de Tonyina",
          product_description: "Tonyina amb olivada i enciam",
          product_price: 3.75,
          product_category: "sandwich",
        },
        {
          id: "sand5",
          product_id: "sand5",
          product_name: "Entrepà Vegetal",
          product_description: "Enciam, tomàquet, pastanaga i formatge",
          product_price: 3.5,
          product_category: "sandwich",
        },
        {
          id: "sand6",
          product_id: "sand6",
          product_name: "Croissant",
          product_description: "Croissant de mantega",
          product_price: 1.8,
          product_category: "sandwich",
        },
        // Bebidas
        {
          id: "drink1",
          product_id: "drink1",
          product_name: "Aigua (50cl)",
          product_price: 1.2,
          product_category: "drink",
        },
        {
          id: "drink2",
          product_id: "drink2",
          product_name: "Coca-Cola",
          product_price: 1.8,
          product_category: "drink",
        },
        {
          id: "drink3",
          product_id: "drink3",
          product_name: "Coca-Cola Zero",
          product_price: 1.8,
          product_category: "drink",
        },
        {
          id: "drink4",
          product_id: "drink4",
          product_name: "Fanta Taronja",
          product_price: 1.8,
          product_category: "drink",
        },
        {
          id: "drink5",
          product_id: "drink5",
          product_name: "Fanta Llimona",
          product_price: 1.8,
          product_category: "drink",
        },
        {
          id: "drink6",
          product_id: "drink6",
          product_name: "Nestea",
          product_price: 1.8,
          product_category: "drink",
        },
        {
          id: "drink7",
          product_id: "drink7",
          product_name: "Aquarius",
          product_price: 1.9,
          product_category: "drink",
        },
        {
          id: "drink8",
          product_id: "drink8",
          product_name: "Suc de Taronja",
          product_price: 2.2,
          product_category: "drink",
        },
        {
          id: "drink9",
          product_id: "drink9",
          product_name: "Cafè amb llet",
          product_price: 1.5,
          product_category: "drink",
        },
      ];
    } else {
      menuItems.value = items;
    }
  } catch (err) {
    console.error("Error al cargar productos de cantina:", err);
    error.value =
      "No se pudieron cargar los productos del menú. Por favor, inténtalo de nuevo más tarde.";

    // Cargar datos de ejemplo en caso de error
    menuItems.value = [];
  } finally {
    loading.value = false;
  }
};

// Al cargar el componente
onMounted(async () => {
  // Verificar si el usuario está autenticado
  if (!currentUserId.value) {
    error.value = "Debes iniciar sesión para acceder al menú de cantina";
    loading.value = false;
    return;
  }

  // Cargar productos del menú
  await loadMenuItems();
});
</script>

<style scoped>
/* Animación de aparición */
.animate-fade-in {
  animation: fadeIn 0.6s ease-out forwards;
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

/* Estil per a fer scroll suau en el carret amb colors que combinen amb el tema */
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

/* Efecte pulsant per "Obert Ara" */
@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Limitar línies de text */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>