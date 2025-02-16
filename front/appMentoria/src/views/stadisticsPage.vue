<template>
  <div
    v-if="!isLoading"
    class="bg-gray-100 dark:bg-gray-900 min-h-screen py-12 px-6"
  >
    <!-- Encabezado -->
    <h1
      class="text-3xl font-bold text-gray-900 dark:text-white text-center mb-8"
    >
      {{ $t("StadisticsPage.title") }}
    </h1>

    <!-- Contenedor Principal -->
    <div class="space-y-8 max-w-4xl mx-auto">
      <!-- Gráfico de Usuarios -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2
          class="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4 text-center"
        >
          {{ $t("StadisticsPage.userGraph") }}
        </h2>
        <div class="space-y-4">
          <div v-for="(folder, folderName) in images.users" :key="folderName">
            <h3 class="text-lg font-semibold text-gray-700 dark:text-gray-300">
              {{ folderName }}
            </h3>
            <div v-for="(image, index) in folder.images" :key="index">
              <img
                :src="URLSTADISTICS + image"
                alt="Gràfic d'usuaris"
                class="w-full rounded-md object-contain cursor-pointer"
                @click="openImage(image)"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Gráfico de Comentarios -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2
          class="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4 text-center"
        >
          {{ $t("StadisticsPage.commentGraph") }}
        </h2>
        <div class="space-y-4">
          <div
            v-for="(folder, folderName) in images.comments"
            :key="folderName"
          >
            <h3 class="text-lg font-semibold text-gray-700 dark:text-gray-300">
              {{ folderName }}
            </h3>
            <div v-for="(image, index) in folder.images" :key="index">
              <img
                :src="URLSTADISTICS + image"
                alt="Gràfic de comentaris"
                class="w-full rounded-md object-contain cursor-pointer"
                @click="openImage(image)"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Gráfico de Publicaciones -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2
          class="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4 text-center"
        >
          {{ $t("StadisticsPage.postGraph") }}
        </h2>
        <div class="space-y-4">
          <div
            v-for="(folder, folderName) in images.publications"
            :key="folderName"
          >
            <h3 class="text-lg font-semibold text-gray-700 dark:text-gray-300">
              {{ folderName }}
            </h3>
            <div v-for="(image, index) in folder.images" :key="index">
              <img
                :src="URLSTADISTICS + image"
                alt="Gràfic de publicacions"
                class="w-full rounded-md object-contain cursor-pointer"
                @click="openImage(image)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Loading -->
  <div
    v-else
    class="flex items-center justify-center min-h-screen bg-white dark:bg-neutral-800"
  >
    <Loading />
  </div>

  <!-- Modal para ampliar imágenes -->
  <div
    v-if="selectedImage"
    class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
  >
    <img
      :src="URLSTADISTICS + selectedImage"
      alt="Imagen ampliada"
      class="max-w-full max-h-full rounded-lg"
    />
    <button
      @click="closeImage"
      class="absolute top-4 right-4 text-white text-xl"
    >
      &times;
    </button>
  </div>
</template>

<script setup>
import Loading from "@/components/Loading.vue";
import { ref, onMounted } from "vue";

const URLSTADISTICS = import.meta.env.VITE_URL_BACK_STADISTICS;
let isLoading = ref(true);
const selectedImage = ref(null);

const images = ref({
  comments: {},
  publications: {},
  users: {},
});

// Función para cargar las imágenes desde el backend
const fetchImages = async () => {
  try {
    const response = await fetch(`${URLSTADISTICS}/images`); // Ajusta el endpoint si es necesario
    const data = await response.json();

    // Actualiza las imágenes con las rutas obtenidas
    images.value.comments = data.comments;
    images.value.publications = data.publications;
    images.value.users = data.users;
  } catch (error) {
    console.error("Error cargando las imágenes:", error);
  } finally {
    isLoading.value = false;
  }
};

// Abrir imagen en modal
const openImage = (image) => {
  selectedImage.value = image;
};

// Cerrar modal
const closeImage = () => {
  selectedImage.value = null;
};

// Cargar las imágenes cuando el componente se monta
onMounted(async () => {
  fetchImages();
});
</script>

<style scoped>
img {
  transition: transform 0.2s;
}
img:hover {
  transform: scale(1.05);
}
</style>