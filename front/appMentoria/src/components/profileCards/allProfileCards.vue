<template>
  <div
    class="dark:bg-gray-800 bg-white p-6 rounded-xl shadow-lg shadow-black/30 my-4"
  >
    <div class="flex justify-between items-center">
      <h2 class="text-xl font-semibold border-b border-gray-600 pb-4 mb-4">
        {{ $t("cardsProfile.title") }}
      </h2>
      <button
        v-if="!hasCards"
        @click="generateDefaultCard"
        class="flex items-center space-x-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg shadow transition-colors"
      >
        <svg
          class="w-6 h-6"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 4v16m8-8H4"
          />
        </svg>
        <span>{{ $t("cardsProfile.generarCard") }}</span>
      </button>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Recorremos las tarjetas del usuario y las vacías -->
      <div
        v-for="(card, index) in getCardsToShow"
        :key="index"
        class="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-md flex flex-col justify-center items-center"
      >
        <!-- Si hay tarjeta, mostramos la imagen, de lo contrario el icono de "+" -->
        <div v-if="card.front">
          <img
            :src="getImageUrl(card.front)"
            alt="Frontal de la tarjeta"
            class="w-full h-auto rounded-lg"
          />
        </div>
        <div v-else>
          <button @click="$router.push('/myCard')">
            <svg
              class="w-16 h-16 text-gray-800 dark:text-white"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
              cursor="pointer"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 4v16m8-8H4"
              />
            </svg>
          </button>
        </div>
        <div v-if="card.front" class="flex items-end justify-end mt-6">
          <button
            class="flex items-end space-x-1 mt-2 bg-red-600 hover:bg-red-700 text-white py-2 px-2 rounded-lg shadow transition-colors"
          >
            <svg
              class="w-6 h-6 dark:text-white"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                fill-rule="evenodd"
                d="M8.586 2.586A2 2 0 0 1 10 2h4a2 2 0 0 1 2 2v2h3a1 1 0 1 1 0 2v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V8a1 1 0 0 1 0-2h3V4a2 2 0 0 1 .586-1.414ZM10 6h4V4h-4v2Zm1 4a1 1 0 1 0-2 0v8a1 1 0 1 0 2 0v-8Zm4 0a1 1 0 1 0-2 0v8a1 1 0 1 0 2 0v-8Z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useAppStore } from "@/stores/index";

// Usamos el store de Pinia para obtener los datos del usuario
const appStore = useAppStore();
const user = computed(() => appStore.user);
const profile = computed(() => appStore.profile);

// Función para obtener la URL completa de la imagen
const getImageUrl = (path) => {
  const baseUrl = import.meta.env.VITE_URL_BACK_CARDS; // Reemplaza esto con la URL de tu servidor
  return baseUrl + path;
};

// Computed para obtener las tarjetas a mostrar
const getCardsToShow = computed(() => {
  if (!user.value || !user.value.cards) {
    console.log("No hay tarjetas en el usuario");
    return [{ front: null }, { front: null }, { front: null }];
  }

  console.log("cards", user.value.cards);
  const cards = user.value.cards || [];
  const filledCards = [...cards];

  // Agregar objetos vacíos hasta completar las 3 tarjetas
  while (filledCards.length < 3) {
    filledCards.push({ front: null }); // Añadimos tarjetas vacías con 'front' null
  }

  return filledCards;
});

// Computed para verificar si hay tarjetas
const hasCards = computed(() => {
  return user.value && user.value.cards && user.value.cards.length > 0;
});

// Función para generar una tarjeta predeterminada
const generateDefaultCard = () => {
  // Aquí puedes agregar la lógica para generar una tarjeta predeterminada
  console.log("Generar tarjeta predeterminada");
};
</script>