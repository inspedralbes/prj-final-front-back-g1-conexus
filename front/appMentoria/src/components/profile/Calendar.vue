<template>
  <!-- Header -->
  <h2 class="text-xl font-semibold border-b border-gray-600 pb-4 mb-4">Horari de disponibilitat</h2>

  <!-- Table -->
  <div class="border-b border-gray-600 pb-6">
    <div class="bg-white dark:bg-gray-700 mt-6 rounded-md shadow-md overflow-hidden">
      <table class="min-w-full border-collapse">
        <thead>
          <tr class="bg-gray-200 dark:bg-gray-900">
            <th class="py-3 px-4 text-left text-sm font-medium text-gray-600 dark:text-gray-300">
              Dia
            </th>
            <th class="py-3 px-4 text-left text-sm font-medium text-gray-600 dark:text-gray-300">
              Hores disponibles
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(hours, day) in availibility" :key="day" class="border-b last:border-none">
            <td class="py-3 px-4 text-sm text-gray-800 dark:text-white">{{ formatDay(day) }}</td>
            <td class="py-3 px-4 text-sm" :class="hours ? 'text-green-600' : 'text-red-500'">
              {{ hours || 'No disponible' }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <!-- Edit button -->
  <button @click="$router.push('/editProfile')"
    class="flex items-center space-x-1 mt-6 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg shadow">
    <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
      fill="currentColor" viewBox="0 0 24 24">
      <path fill-rule="evenodd"
        d="M5 8a4 4 0 1 1 7.796 1.263l-2.533 2.534A4 4 0 0 1 5 8Zm4.06 5H7a4 4 0 0 0-4 4v1a2 2 0 0 0 2 2h2.172a2.999 2.999 0 0 1-.114-1.588l.674-3.372a3 3 0 0 1 .82-1.533L9.06 13Zm9.032-5a2.907 2.907 0 0 0-2.056.852L9.967 14.92a1 1 0 0 0-.273.51l-.675 3.373a1 1 0 0 0 1.177 1.177l3.372-.675a1 1 0 0 0 .511-.273l6.07-6.07a2.91 2.91 0 0 0-.944-4.742A2.907 2.907 0 0 0 18.092 8Z"
        clip-rule="evenodd" />
    </svg>
    <span>Editar</span>
  </button>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  availibilityJson: String,
});

const availibility = computed(() => {
  try {
    return JSON.parse(props.availibilityJson);
  } catch (error) {
    console.error('Error parsing availibility JSON:', error);
    return {};
  }
});

const formatDay = (day) => {
  const daysMap = {
    monday: 'Dilluns',
    tuesday: 'Dimarts',
    wednesday: 'Dimecres',
    thursday: 'Dijous',
    friday: 'Divendres',
    saturday: 'Dissabte',
    sunday: 'Diumenge',
  };
  return daysMap[day] || day;
};
</script>

<style scoped>
/* Estilos para que la tabla sea más compacta en dispositivos móviles */
@media (max-width: 768px) {
  .table-responsive {
    font-size: 0.875rem;
  }

  .table-responsive th,
  .table-responsive td {
    padding: 0.5rem;
  }
}
</style>
