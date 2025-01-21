<template>
  <li
    class="flex flex-col p-4 bg-white dark:bg-gray-800 dark:text-white rounded-lg shadow-md mb-4"
  >
    <!-- Información de la publicación -->
    <div class="flex items-center mb-4">
      <span v-if="fullImageUrl" class="mr-4">
        <img
          :src="fullImageUrl"
          alt="Imagen"
          class="w-20 h-20 rounded-lg object-cover"
        />
      </span>
      <div class="flex-1">
        <p
          class="text-lg font-semibold text-gray-800 dark:text-white"
          :class="isReported ? 'font-bold text-red-500' : ''"
        >
          <span v-if="isReported" class="text-red-500">*</span>
          {{ title }}
          <span v-if="isReported" class="text-red-500">*</span>
        </p>
        <p
          class="text-gray-600 dark:text-gray-400 text-sm mt-1 leading-tight"
          :class="isReported ? 'italic' : ''"
        >
          <span v-if="isReported" class="text-red-500">*</span>
          {{ description }}
          <span v-if="isReported" class="text-red-500">*</span>
        </p>
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
          <span :class="text_ia === 0 ? 'text-yellow-500' : 'text-green-500'">
            {{ textIaStatus }}
          </span>
        </p>
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
          <span :class="image_ia === 0 ? 'text-yellow-500' : 'text-green-500'">
            {{ imageIaStatus }}
          </span>
        </p>
        <p
          v-if="availability !== null"
          class="text-xs text-gray-500 dark:text-gray-400 mt-2"
        >
          Disponibilidad: {{ availability ? "Disponible" : "No disponible" }}
        </p>
        <p v-if="isReported" class="text-xs text-red-500 font-medium mt-2">
          Reports: {{ reports }}
        </p>
      </div>
    </div>

    <!-- Línea de separación -->
    <hr class="border-gray-300 dark:border-gray-600 mb-4" />

    <!-- Pie de publicación: Usuario, likes o acciones opcionales -->
    <div
      class="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400"
    >
      <span> Data: {{ created_at }} </span>

      <!-- Icono de estado IA: reloj si ambos son 0, cruz roja si tiene reportes, tick verde si no tiene reportes -->
      <span v-if="isProcessing" class="text-yellow-500" title="En proceso"
        >Pendent de revisar
        <i class="fas fa-clock"></i>
      </span>
      <span v-else-if="isReported" class="text-red-500" title="Reportado"
        >Reportat
        <i class="fas fa-times-circle"></i>
      </span>
      <span v-else class="text-green-500" title="No Reportado"
        >Publicat
        <i class="fas fa-check-circle"></i>
      </span>
    </div>
  </li>
</template>
      
  <script setup>
import { computed } from "vue";

const props = defineProps({
  id: Number,
  typesPublications_id: Number,
  title: String,
  description: String,
  image: String,
  availability: Boolean,
  user_id: Number,
  reports: Number,
  text_ia: Number,
  image_ia: Number,
  created_at: String,
  expired_at: String,
});

const baseUrl = import.meta.env.VITE_URL_BACK_COMMUNITY;

// Computed property para generar la URL completa de la imagen
const fullImageUrl = computed(() => {
  return props.image ? `${baseUrl}${props.image}` : null;
});

// Computed property para mostrar el estado de verificación por IA del texto
const textIaStatus = computed(() => {
  return props.text_ia === 0
    ? "Text no verificat per IA"
    : "Text verificat per IA";
});

// Computed property para mostrar el estado de verificación por IA de la imagen
const imageIaStatus = computed(() => {
  return props.image_ia === 0
    ? "Imatge no verificat per IA"
    : "Imatge verificat per IA";
});

// Computed property para determinar si el estado es 'En proceso' (tanto texto como imagen IA en 0)
const isProcessing = computed(() => {
  return props.text_ia === 0 && props.image_ia === 0;
});

// Computed property para determinar si tiene reportes (es decir, si hay cruz roja)
const isReported = computed(() => {
  return props.text_ia === 1 && props.image_ia === 1 && props.reports > 0;
});
</script>
      
  <style scoped>
/* Estilos personalizados pueden ir aquí si se necesitan */
</style>