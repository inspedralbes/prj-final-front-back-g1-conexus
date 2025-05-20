<template>
  <div
    class="bg-slate-900/10 backdrop-blur-sm rounded-xl p-6 shadow-2xl animate-fade-in border border-slate-700/30 mt-9 mb-9"
  >
    <!-- Capçalera -->
    <div class="flex justify-between items-center mb-8">
      <div>
        <h2 class="text-2xl font-bold text-white mb-2">
          <span
            class="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-green-400"
          >
            Avaluació de tasca
          </span>
        </h2>
        <p class="text-gray-400 text-sm">
          Registra les qualificacions dels alumnes
        </p>
      </div>
      <div class="bg-green-500/10 p-3 rounded-lg border border-green-500/20">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-8 w-8 text-green-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
    </div>

    <!-- Tabla de alumnos y notas -->
    <div
      class="bg-slate-800/50 rounded-xl border border-slate-700/30 overflow-hidden mb-6"
    >
      <div class="p-4 bg-slate-700/50 border-b border-slate-600/50">
        <h3 class="text-lg font-semibold text-white">
          Qualificacions dels alumnes
        </h3>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-slate-700/30 border-b border-slate-600/50">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
              >
                Alumne
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
              >
                Nota
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-700/50">
            <tr
              v-for="alumn in users"
              :key="alumn.user_id"
              class="hover:bg-slate-700/20 transition-colors"
            >
              <td
                class="px-6 py-4 whitespace-nowrap text-sm font-medium text-white"
              >
                {{ alumn.name }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <input
                  type="number"
                  v-model="alumn.grades"
                  @change="sendNewScore(alumn)"
                  class="w-20 px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-center font-medium"
                  min="0"
                  max="10"
                  step="0.1"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Botón de volver -->
    <div class="flex justify-end">
      <button
        @click="goBack()"
        class="px-4 py-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20 transition-all duration-300 flex items-center"
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
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        Tornar
      </button>
    </div>
  </div>
</template>
<script setup>
import { useRoute } from "vue-router";
import { onMounted, ref } from "vue";
import { useAppStore } from "@/stores/index.js";
import {
  getTask,
  updateGrade,
} from "@/services/communicationsScripts/gradesComManager.js";
import { useRouter } from "vue-router";

const route = useRoute();
const taskId = route.params.taskId;
const courseId = route.params.courseId;
const users = ref([]);
const router = useRouter();

onMounted(async () => {
  const store = useAppStore();
  users.value = await getTask(taskId, courseId);
  console.log(users.value);
});

function sendNewScore(alumn) {
  const id = alumn.user_id;
  const grade = alumn.grades;
  console.log(id, grade, taskId);
  updateGrade(id, grade, taskId);
}

function goBack() {
  router.push({ name: "teacher-grades", params: { courseId: courseId } });
}
</script>
<style scoped>
/* Animació d'aparició */
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
</style>