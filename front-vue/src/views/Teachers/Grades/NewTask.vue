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
            Nova Tasca
          </span>
        </h2>
        <p class="text-gray-400 text-sm">Crea una nova tasca d'avaluació</p>
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
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
          />
        </svg>
      </div>
    </div>

    <!-- Descripción de la sección -->
    <div class="mb-8 bg-slate-800/50 rounded-xl p-6 border border-slate-700/30">
      <div class="flex items-start">
        <div class="bg-green-500/20 p-3 rounded-lg mr-4">
          <svg
            class="w-6 h-6 text-green-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
        </div>
        <div>
          <h3 class="text-lg font-semibold text-white mb-2">
            Creació de Nova Tasca
          </h3>
          <p class="text-gray-300">
            En aquest formulari pots crear una nova tasca d'avaluació.
            Introdueix el nom i una descripció opcional per a la tasca.
          </p>
        </div>
      </div>
    </div>

    <!-- Formulario -->
    <div
      class="bg-slate-800/50 rounded-xl p-6 border border-slate-700/30 mb-6 space-y-6"
    >
      <div>
        <label
          for="task_name"
          class="block text-sm font-medium text-gray-300 mb-2"
        >
          Nom de la tasca: <span class="text-red-400">*</span>
        </label>
        <input
          type="text"
          id="task_name"
          v-model="task_name"
          class="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
          placeholder="Introdueix el nom de la tasca"
          :class="{ 'border-red-500 focus:ring-red-500': nameError }"
        />
        <p v-if="nameError" class="mt-2 text-sm text-red-400">
          {{ nameError }}
        </p>
      </div>

      <div>
        <label
          for="taskDescription"
          class="block text-sm font-medium text-gray-300 mb-2"
        >
          Descripció:
        </label>
        <textarea
          id="taskDescription"
          v-model="task_description"
          class="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
          rows="4"
          placeholder="Introdueix una descripció"
        ></textarea>
      </div>
    </div>

    <!-- Botones -->
    <div class="flex justify-between items-center">
      <button
        @click="goBack()"
        class="px-4 py-2 bg-slate-700/50 text-gray-300 rounded-lg hover:bg-slate-600/50 transition-all duration-300 flex items-center"
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

      <button
        @click="sendCreateTask"
        class="px-6 py-2 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-lg shadow hover:from-blue-600 hover:to-green-600 transition-all duration-300 flex items-center font-medium"
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
        Crear Tasca
      </button>
    </div>
  </div>
</template>
<script setup>
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { createTask } from "@/services/communicationsScripts/gradesComManager.js";
import { useRouter } from "vue-router";
const task_name = ref("");
const task_description = ref("");
const courseId = ref(null);
const nameError = ref("");
const router = useRouter();
onMounted(() => {
  const route = useRoute();
  courseId.value = route.params.courseId;
});

function validateForm() {
  // Resetear errores
  nameError.value = "";

  // Validar nombre de la tarea
  if (!task_name.value.trim()) {
    nameError.value = "El nom de la tasca és obligatori";
    return false;
  }

  return true;
}

function sendCreateTask() {
  // Validar formulario
  if (!validateForm()) {
    return;
  }

  const task = {
    task_name: task_name.value,
    task_description: task_description.value,
    course_id: courseId.value,
  };
  createTask(task).then(() => {
    router.push({ name: "grades", params: { courseId: courseId.value } });
  });
}
function goBack() {
  router.push({ name: "grades", params: { courseId: courseId.value } });
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