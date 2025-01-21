<template>
  <li
    class="flex items-center justify-between p-4 bg-white dark:bg-gray-800 dark:text-white rounded-lg"
  >
    <!-- Información de la notificación -->
    <div class="flex items-center">
      <span class="text-2xl mr-4">{{ icon }}</span>
      <div>
        <p class="text-sm font-semibold">{{ name }}</p>
        <p
          class="text-gray-600 dark:text-gray-400 text-xs mt-1 font-medium leading-tight"
        >
          {{ message }}
        </p>
      </div>
    </div>
    <!-- Botones con Iconos -->
    <div class="flex p-3 space-x-2 items-center">
      <button
        class="p-2 text-gray-600 bg-green-200 dark:bg-green-400 rounded-full hover:bg-green-300 dark:hover:bg-green-500 transition"
        @click="$emit('markAsRead')"
      >
        <!-- Icono de ojo -->
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 12m0 0a3 3 0 11-6 0 3 3 0 016 0zm9 0c0 5.25-7.5 9-12 9S0 17.25 0 12 7.5 3 12 3s12 3.75 12 9z"
          />
        </svg>
      </button>
      <button
        class="p-2 text-gray-600 bg-red-200 dark:bg-red-400 rounded-full hover:bg-red-300 dark:hover:bg-red-500 transition"
        @click="$emit('remove')"
      >
        <!-- Icono de eliminar -->
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
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
  </li>
</template>

<script setup>
defineProps({
  name: String,
  message: String,
  icon: String,
  type: String,
});
</script>

<style scoped>
button.bg-green-200 {
  background-color: #a5d6a7;
}
button.bg-green-200:hover {
  background-color: #81c784;
}
button.bg-red-200 {
  background-color: #ef9a9a;
}
button.bg-red-200:hover {
  background-color: #e57373;
}
</style>
