<template>
  <div
    class="dark:bg-gray-800 bg-white p-6 rounded-xl shadow-lg shadow-black/30 my-4"
  >
    <h2 class="text-xl font-semibold border-b border-gray-600 pb-4 mb-4">
      Tarjetas de visita
    </h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Tarjeta 1 -->
      <div class="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-md">
        <h3 class="text-xl font-semibold text-gray-800 dark:text-white">
          Tarjeta 1
        </h3>
        <p class="text-gray-600 dark:text-gray-300">
          Información de la tarjeta 1
        </p>
      </div>

      <!-- Tarjeta 2 -->
      <div class="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-md">
        <h3 class="text-xl font-semibold text-gray-800 dark:text-white">
          Tarjeta 2
        </h3>
        <p class="text-gray-600 dark:text-gray-300">
          Información de la tarjeta 2
        </p>
      </div>

      <!-- Tarjeta 3 -->
      <div class="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-md">
        <h3 class="text-xl font-semibold text-gray-800 dark:text-white">
          Tarjeta 3
        </h3>
        <p class="text-gray-600 dark:text-gray-300">
          Información de la tarjeta 3
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  user: Object,
  profile: String,
});

const user = computed(() => props.user);
const profile = computed(() => props.profile);
</script>