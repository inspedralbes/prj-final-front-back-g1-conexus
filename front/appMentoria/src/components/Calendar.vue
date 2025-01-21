<template>
  <div class="bg-gray-100 dark:bg-gray-900">
    <div class="max-w-4xl mx-auto mt-8 p-4">
      <!-- Header -->
      <div class="bg-gray-300 dark:bg-gray-700 p-6 rounded-md shadow-md text-center">
        <h2 class="text-2xl font-semibold text-gray-800 dark:text-white">
          Horari de disponibilitat
        </h2>
      </div>

      <!-- Table -->
      <div class="bg-white dark:bg-gray-700 mt-6 rounded-md shadow-md overflow-hidden">
        <table class="min-w-full border-collapse">
          <thead>
            <tr class="bg-gray-200 dark:bg-gray-800">
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
  </div>
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
