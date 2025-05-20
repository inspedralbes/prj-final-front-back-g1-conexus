<template>
  <div>
    <div class="animate-fade-in max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <!-- Capçalera -->
      <div class="mb-8 text-center">
        <h1
          class="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400"
        >
          Administració de Menú
        </h1>
        <p class="text-gray-300 mt-2">
          Gestiona els productes disponibles a la cantina
        </p>
      </div>

      <div class="flex justify-end mb-6">
        <button
          @click="toggleShowModal()"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
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
              d="M12 4v16m8-8H4"
            ></path>
          </svg>
          Crear nou producte
        </button>
      </div>

      <!-- Barra de búsqueda y filtros -->
      <div class="mb-6 flex flex-col md:flex-row gap-4">
        <div class="relative flex-grow">
          <div
            class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
          >
            <svg
              class="w-5 h-5 text-gray-400"
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
          <input
            type="text"
            placeholder="Buscar productes..."
            class="block w-full pl-10 pr-3 py-2 border border-slate-700 rounded-md bg-slate-800/50 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            v-model="searchTerm"
          />
        </div>
        <div class="w-full md:w-64">
          <select
            v-model="statusFilter"
            class="block w-full px-3 py-2 border border-slate-700 rounded-md bg-slate-800/50 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">Tots els productes</option>
            <option value="enabled">Disponibles</option>
            <option value="disabled">No disponibles</option>
          </select>
        </div>
      </div>

      <!-- Contador de resultados -->
      <div v-if="canteenItems.length > 0" class="mb-4 text-sm text-gray-400">
        Mostrant {{ filteredItems.length }} de
        {{ canteenItems.length }} productes
        <button
          v-if="searchTerm || statusFilter !== 'all'"
          @click="resetFilters"
          class="ml-2 text-blue-400 hover:text-blue-300 transition-colors"
        >
          Netejar filtres
        </button>
      </div>

      <!-- List view for canteen items -->
      <div
        v-if="filteredItems.length > 0"
        class="bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden border border-slate-700"
      >
        <div class="overflow-hidden">
          <ul class="divide-y divide-slate-700">
            <li
              v-for="item in filteredItems"
              :key="item.id"
              class="p-4 hover:bg-slate-700/50 transition-colors duration-200"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-4">
                  <div class="flex-shrink-0">
                    <div
                      class="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 flex items-center justify-center text-white font-bold"
                    >
                      {{ item.product_name.charAt(0) }}
                    </div>
                  </div>
                  <div>
                    <h3 class="text-lg font-medium text-white">
                      {{ item.product_name }}
                    </h3>
                    <p class="text-blue-400 font-semibold">
                      {{ item.product_price }}€
                    </p>
                  </div>
                </div>
                <div class="flex space-x-2">
                  <!-- Edit button -->
                  <button
                    @click="toggleEditModal(item)"
                    class="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors duration-200 flex items-center justify-center"
                    title="Editar"
                  >
                    <svg
                      class="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </button>

                  <!-- Enable/Disable button -->
                  <button
                    v-if="item.product_enabled"
                    @click="disableItem(item)"
                    class="p-2 bg-amber-500 hover:bg-amber-600 text-white rounded-md transition-colors duration-200 flex items-center justify-center"
                    title="Deshabilitar"
                  >
                    <svg
                      class="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                      />
                    </svg>
                  </button>
                  <button
                    v-else
                    @click="enableItem(item)"
                    class="p-2 bg-green-500 hover:bg-green-600 text-white rounded-md transition-colors duration-200 flex items-center justify-center"
                    title="Habilitar"
                  >
                    <svg
                      class="w-5 h-5"
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
                  </button>

                  <!-- Delete button -->
                  <button
                    @click="deleteItem(item.id)"
                    class="p-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors duration-200 flex items-center justify-center"
                    title="Eliminar"
                  >
                    <svg
                      class="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <!-- Status indicator -->
              <div class="mt-2">
                <span
                  v-if="item.product_enabled"
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                >
                  Disponible
                </span>
                <span
                  v-else
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"
                >
                  No disponible
                </span>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <!-- Sin productos mensaje -->
      <div
        v-if="filteredItems.length === 0"
        class="text-center py-12 bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden border border-slate-700"
      >
        <svg
          class="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h3 class="mt-2 text-lg font-medium text-white">
          {{
            canteenItems.length === 0
              ? "No hi ha productes"
              : "No s'han trobat productes"
          }}
        </h3>
        <p class="mt-1 text-gray-400">
          {{
            canteenItems.length === 0
              ? "Afegeix productes al menú de la cantina"
              : searchTerm
              ? `No hi ha coincidències amb "${searchTerm}"`
              : "Intenta amb altres filtres"
          }}
        </p>

        <div class="mt-6" v-if="canteenItems.length === 0">
          <button
            @click="toggleShowModal()"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
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
                d="M12 4v16m8-8H4"
              ></path>
            </svg>
            Afegir primer producte
          </button>
        </div>

        <div class="mt-6" v-else>
          <button
            @click="resetFilters"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
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
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              ></path>
            </svg>
            Netejar filtres
          </button>
        </div>
      </div>
    </div>

    <!-- Modal crear nuevo producto -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 px-4 animate-fade-in"
    >
      <div
        class="bg-slate-800/90 rounded-xl shadow-xl border border-slate-700 max-w-md w-full p-6 transform transition-all"
        @click.stop
      >
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold text-white">Crear nou producte</h2>
          <button
            @click="toggleShowModal()"
            class="text-gray-400 hover:text-white focus:outline-none"
          >
            <svg
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form @submit.prevent="createNewProduct" class="space-y-4">
          <div class="space-y-2">
            <label
              for="productName"
              class="block text-sm font-medium text-gray-300"
              >Nom del producte</label
            >
            <input
              type="text"
              id="productName"
              v-model="newProductName"
              required
              class="w-full rounded-md bg-slate-700/80 border border-slate-600 text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Introdueix el nom del producte"
            />
          </div>

          <div class="space-y-2">
            <label
              for="productPrice"
              class="block text-sm font-medium text-gray-300"
              >Preu (€)</label
            >
            <div class="relative rounded-md shadow-sm">
              <input
                type="number"
                id="productPrice"
                v-model.number="newProductPrice"
                step="0.01"
                required
                class="w-full rounded-md bg-slate-700/80 border border-slate-600 text-white pl-3 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="0.00"
              />
              <div
                class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none"
              >
                <span class="text-gray-400">€</span>
              </div>
            </div>
          </div>

          <div
            class="flex justify-end space-x-3 pt-5 mt-4 border-t border-slate-700"
          >
            <button
              type="button"
              @click="toggleShowModal()"
              class="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
            >
              Cancelar
            </button>
            <button
              type="submit"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              <svg
                class="w-5 h-5 mr-1.5"
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
              Crear
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal editar producto -->
    <div
      v-if="showEditModal"
      class="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 px-4 animate-fade-in"
    >
      <div
        class="bg-slate-800/90 rounded-xl shadow-xl border border-slate-700 max-w-md w-full p-6 transform transition-all"
        @click.stop
      >
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold text-white">Editar producte</h2>
          <button
            @click="toggleEditModal()"
            class="text-gray-400 hover:text-white focus:outline-none"
          >
            <svg
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form
          v-if="currentEditItem"
          @submit.prevent="editProduct"
          class="space-y-4"
        >
          <div class="space-y-2">
            <label
              for="editProductName"
              class="block text-sm font-medium text-gray-300"
              >Nom del producte</label
            >
            <input
              type="text"
              id="editProductName"
              v-model="currentEditItem.product_name"
              required
              class="w-full rounded-md bg-slate-700/80 border border-slate-600 text-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div class="space-y-2">
            <label
              for="editProductPrice"
              class="block text-sm font-medium text-gray-300"
              >Preu (€)</label
            >
            <div class="relative rounded-md shadow-sm">
              <input
                type="number"
                id="editProductPrice"
                v-model.number="currentEditItem.product_price"
                step="0.01"
                required
                class="w-full rounded-md bg-slate-700/80 border border-slate-600 text-white pl-3 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <div
                class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none"
              >
                <span class="text-gray-400">€</span>
              </div>
            </div>
          </div>

          <div
            class="flex justify-end space-x-3 pt-5 mt-4 border-t border-slate-700"
          >
            <button
              type="button"
              @click="toggleEditModal()"
              class="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
            >
              Cancelar
            </button>
            <button
              type="submit"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              <svg
                class="w-5 h-5 mr-1.5"
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
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal de confirmación de eliminación -->
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 px-4 animate-fade-in"
    >
      <div
        class="bg-slate-800/90 rounded-xl shadow-xl border border-slate-700 max-w-md w-full p-6 transform transition-all"
        @click.stop
      >
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold text-white">Eliminar producte</h2>
          <button
            @click="showDeleteModal = false"
            class="text-gray-400 hover:text-white focus:outline-none"
          >
            <svg
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <p class="text-gray-300">
          Estàs segur que vols eliminar el producte
          <span class="font-semibold text-white">{{ productToDeleteName }}</span
          >?
        </p>
        <p class="text-gray-400 mt-2 text-sm">
          Aquesta acció no es pot desfer.
        </p>

        <div
          class="flex justify-end space-x-3 pt-5 mt-4 border-t border-slate-700"
        >
          <button
            type="button"
            @click="showDeleteModal = false"
            class="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
          >
            Cancel·lar
          </button>
          <button
            type="button"
            @click="confirmDelete()"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
          >
            <svg
              class="w-5 h-5 mr-1.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              ></path>
            </svg>
            Eliminar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { onMounted } from "vue";
import {
  getAllCanteenItems,
  createItem,
  deleteItem as removeItem,
  updateItem,
} from "@/services/communicationsScripts/canteenComManager";
import { ref, computed } from "vue";

const canteenItems = ref([]);
const showModal = ref(false);
const showEditModal = ref(false);
const showDeleteModal = ref(false);
const currentEditItem = ref(null);
const itemToDelete = ref(null);
const productToDeleteName = ref("");
const newProductName = ref("");
const newProductPrice = ref(0);
const searchTerm = ref("");
const statusFilter = ref("all");

// Productos filtrados según búsqueda y estado
const filteredItems = computed(() => {
  return canteenItems.value.filter((item) => {
    // Filtro por texto de búsqueda (case insensitive)
    const matchesSearch = item.product_name
      .toLowerCase()
      .includes(searchTerm.value.toLowerCase());

    // Filtro por estado
    let matchesStatus = true;
    if (statusFilter.value === "enabled") {
      matchesStatus = item.product_enabled === true;
    } else if (statusFilter.value === "disabled") {
      matchesStatus = item.product_enabled === false;
    }

    return matchesSearch && matchesStatus;
  });
});

const toggleShowModal = () => {
  showModal.value = !showModal.value;
};

const toggleEditModal = (item = null) => {
  if (item) {
    currentEditItem.value = item;
  }
  showEditModal.value = !showEditModal.value;
  if (!showEditModal.value) {
    currentEditItem.value = null;
  }
};

function createNewProduct() {
  createItem({
    product_name: newProductName.value,
    product_price: newProductPrice.value,
    product_enabled: true,
  })
    .then(async (response) => {
      console.log("Producte creat:", response.data);
      canteenItems.value = await getAllCanteenItems();
      newProductName.value = "";
      newProductPrice.value = 0;
    })
    .catch((error) => {
      console.error("Error creating product:", error);
    });
  toggleShowModal();
}

function editProduct() {
  updateItem(currentEditItem.value)
    .then(async (response) => {
      console.log("Producte editat:", response.data);
      canteenItems.value = await getAllCanteenItems();
    })
    .catch((error) => {
      console.error("Error editant producte:", error);
    });
  toggleEditModal();
}

function enableItem(item) {
  item.product_enabled = true;
  updateItem(item)
    .then(async (response) => {
      console.log("Producte habilitat:", response.data);
      canteenItems.value = await getAllCanteenItems();
    })
    .catch((error) => {
      console.error("Error habilitant producte:", error);
    });
}

function disableItem(item) {
  item.product_enabled = false;
  updateItem(item)
    .then(async (response) => {
      console.log("Producte deshabilitat:", response.data);
      canteenItems.value = await getAllCanteenItems();
    })
    .catch((error) => {
      console.error("Error deshabilitant producte:", error);
    });
}

function deleteItem(id) {
  // Encontrar el producto por ID para obtener su nombre
  const productToDelete = canteenItems.value.find((item) => item.id === id);

  if (productToDelete) {
    itemToDelete.value = id;
    productToDeleteName.value = productToDelete.product_name;
    showDeleteModal.value = true;
  } else {
    console.error("Producte no trobat amb ID:", id);
  }
}

async function confirmDelete() {
  try {
    await removeItem(itemToDelete.value);
    canteenItems.value = await getAllCanteenItems();
    showDeleteModal.value = false;
    itemToDelete.value = null;
    productToDeleteName.value = "";
  } catch (error) {
    console.error("Error eliminant el producte:", error);
  }
}

function resetFilters() {
  searchTerm.value = "";
  statusFilter.value = "all";
}

onMounted(async () => {
  let response = await getAllCanteenItems();
  canteenItems.value = response;
  console.log("Canteen items:", canteenItems.value);
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
/* All styles have been replaced with Tailwind classes */
</style>