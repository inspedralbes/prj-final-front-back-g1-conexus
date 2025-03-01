<template>
  <div class="bg-containersTheme p-6 rounded-md">
    <!-- Header -->
    <h2
      class="text-xl font-semibold border-b border-buttonColorPrimary text-textThemeColor pb-4 mb-4"
    >
      {{ $t("calendar.title") }}
    </h2>
    <!-- Table -->
    <div
      class="border-b border-buttonColorPrimary pb-6 bg-containersTheme"
      v-if="availability"
    >
      <div class="bg-textThemeColor mt-6 overflow-hidden">
        <table v-if="availability" class="min-w-full border-collapse">
          <thead class="bg-bgTheme border-b border-buttonColorTertiary">
            <tr class="bg-containersTheme">
              <th
                class="py-3 px-4 text-left text-sm font-medium text-textThemeColor"
              >
                {{ $t("calendar.day") }}
              </th>
              <th
                class="py-3 px-4 text-left text-sm font-medium text-textThemeColor"
              >
                {{ $t("calendar.availability") }}
              </th>
            </tr>
          </thead>
          <tbody class="bg-containersTheme border-buttonColorTertiary">
            <tr
              v-for="object in availability"
              :key="day"
              class="border-b last:border-none border-buttonColorTertiary"
            >
              <td class="py-3 px-4 text-sm text-textThemeColor">
                {{ formatDay(object.day) }}
              </td>
              <td
                class="py-3 px-4 text-sm text-textThemeColor"
                :class="
                  formatHours(object.startTime, object.endTime)
                    ? 'text-green-600'
                    : 'text-red-500'
                "
              >
                {{
                  formatHours(object.startTime, object.endTime) ||
                  "No disponible"
                }}
              </td>
            </tr>
          </tbody>
        </table>
        <table v-else>
          <tbody>
            <tr>
              <td class="py-3 px-4 text-sm text-text-textThemeColor">
                {{ $t("calendar.noAvailability") }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <!-- Edit button -->
    <button
      @click="$router.push('/editProfile/calendar')"
      v-if="id === userId"
      class="flex items-center space-x-1 mt-6 bg-buttonColorPrimary hover:bg-buttonColorPrimary text-textThemeColor py-2 px-4 rounded-lg shadow"
    >
      <svg
        class="w-5 h-5 text-textThemeColor"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          fill-rule="evenodd"
          d="M5 8a4 4 0 1 1 7.796 1.263l-2.533 2.534A4 4 0 0 1 5 8Zm4.06 5H7a4 4 0 0 0-4 4v1a2 2 0 0 0 2 2h2.172a2.999 2.999 0 0 1-.114-1.588l.674-3.372a3 3 0 0 1 .82-1.533L9.06 13Zm9.032-5a2.907 2.907 0 0 0-2.056.852L9.967 14.92a1 1 0 0 0-.273.51l-.675 3.373a1 1 0 0 0 1.177 1.177l3.372-.675a1 1 0 0 0 .511-.273l6.07-6.07a2.91 2.91 0 0 0-.944-4.742A2.907 2.907 0 0 0 18.092 8Z"
          clip-rule="evenodd"
        />
      </svg>
      <span>{{ $t("calendar.edit") }}</span>
    </button>
  </div>
</template>

<script setup>
import { useAppStore } from "@/stores";
import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const userId = ref(useAppStore().getUser().id);
const props = defineProps(["availabilityJson", "id"]);
var availability = ref(props.availabilityJson);
var id = ref(props.id);

const formatHours = (startTime, endTime) => {
  if (!startTime || !endTime) return null;
  return `${startTime} - ${endTime}`;
};
const formatDay = (day) => {
  switch (day) {
    case "monday":
      return t("calendar.monday");
    case "tuesday":
      return t("calendar.tuesday");
    case "wednesday":
      return t("calendar.wednesday");
    case "thursday":
      return t("calendar.thursday");
    case "friday":
      return t("calendar.friday");
    case "saturday":
      return t("calendar.saturday");
    case "sunday":
      return t("calendar.sunday");
  }

  console.log(day);
};
onMounted(() => {
  console.log("availability", availability);
});
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
