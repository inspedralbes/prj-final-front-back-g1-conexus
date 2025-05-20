<template>
  <div
    class="bg-slate-900/10 backdrop-blur-sm rounded-xl p-6 shadow-2xl animate-fade-in border border-slate-700/30 mt-9 mb-9"
  >
    <!-- Capçalera -->
    <div class="flex justify-between items-center mb-8">
      <div>
        <h2 class="text-2xl font-bold text-white mb-2">
          <span
            class="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400"
          >
            Registre de notes
          </span>
        </h2>
        <p class="text-gray-400 text-sm">
          Gestiona les avaluacions i tasques del curs
        </p>
      </div>
      <div class="flex items-center gap-4">
        <router-link to="/teachers/grades">
          <button
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
            Tornar a la página d'avaluacions
          </button>
        </router-link>
        <button
          @click="goToCreateTask()"
          class="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg shadow hover:from-purple-600 hover:to-blue-600 transition-all duration-300 flex items-center text-sm font-medium"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
              clip-rule="evenodd"
            />
          </svg>
          Crear nueva tarea
        </button>
      </div>
    </div>

    <!-- Filtro -->
    <div class="mb-6 bg-slate-800/50 rounded-xl p-4 border border-slate-700/30">
      <label class="flex items-center space-x-2 text-gray-300 cursor-pointer">
        <input
          type="checkbox"
          @click="changeFilter()"
          class="w-5 h-5 bg-slate-700 border-slate-600 rounded text-purple-500 focus:ring-purple-500/30"
        />
        <span>Ocultar tasques tancades</span>
      </label>
    </div>

    <!-- Tabla de tareas -->
    <div
      class="bg-slate-800/50 rounded-xl border border-slate-700/30 overflow-hidden"
    >
      <div class="p-4 bg-slate-700/50 border-b border-slate-600/50">
        <h3 class="text-lg font-semibold text-white">Llistat de tasques</h3>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-slate-700/30 border-b border-slate-600/50">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
              >
                Tasca
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
              >
                Tancada
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
              >
                Accions
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-700/50">
            <tr
              v-for="task in filteredTasks"
              :key="task.id"
              class="hover:bg-slate-700/20 transition-colors"
            >
              <td
                class="px-6 py-4 whitespace-nowrap text-sm font-medium text-white"
              >
                {{ task.task_name }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <span
                  :class="[
                    'px-3 py-1 rounded-full text-xs font-medium',
                    task.task_ended
                      ? 'bg-red-500/20 text-red-300'
                      : 'bg-green-500/20 text-green-300',
                  ]"
                >
                  {{ task.task_ended ? "Sí" : "No" }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <div class="flex items-center space-x-3">
                  <button
                    @click="goToEvaluar(task.id)"
                    class="px-3 py-1.5 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20 transition-all duration-300 text-sm"
                  >
                    Evaluar
                  </button>
                  <button
                    v-if="task.task_ended"
                    @click="reopenTask(task)"
                    class="px-3 py-1.5 bg-green-500/10 text-green-400 rounded-lg hover:bg-green-500/20 transition-all duration-300 text-sm"
                  >
                    Reobrir
                  </button>
                  <button
                    v-else
                    @click="close(task)"
                    class="px-3 py-1.5 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-all duration-300 text-sm"
                  >
                    Tancar
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
<script setup>
import { useRoute } from "vue-router";
import { computed } from "vue";
import { useRouter } from "vue-router";
import { onMounted, ref } from "vue";
import {
  getTasksFromCourse,
  updateTask,
} from "@/services/communicationsScripts/gradesComManager.js";
const route = useRoute();
const tasks = ref([]);
const courseId = ref(null);
const hideClosed = ref(false);
const router = useRouter();

const filteredTasks = computed(() => {
  return tasks.value.filter((task) => !hideClosed.value || !task.task_ended);
});

onMounted(async () => {
  courseId.value = route.params.courseId;
  tasks.value = await getTasksFromCourse(courseId.value);
});

function reopenTask(task) {
  task.task_ended = false;
  updateTask(task, task.id)
    .then((response) => {
      console.log("Tasca reoberta:", response);
      getTasksFromCourse(courseId.value).then((result) => {
        tasks.value = result;
      });
    })
    .catch((error) => {
      console.error("Error reobrint tasca:", error);
    });
}

function close(task) {
  task.task_ended = true;
  updateTask(task, task.id)
    .then((response) => {
      console.log("Tasca tancada:", response);
      getTasksFromCourse(courseId.value).then((result) => {
        tasks.value = result;
      });
    })
    .catch((error) => {
      console.error("Error tancant tasca:", error);
    });
}

function goToCreateTask() {
  router.push({ name: "createTask", params: { courseId: courseId.value } });
}

function changeFilter() {
  hideClosed.value = !hideClosed.value;
}

function goToEvaluar(taskId) {
  router.push({
    name: "evaluate",
    params: { taskId: taskId, courseId: courseId.value },
  });
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