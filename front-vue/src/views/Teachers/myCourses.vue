<template>
  <div>
    <div
      class="bg-slate-900/10 backdrop-blur-sm rounded-xl p-6 shadow-2xl animate-fade-in border border-slate-700/30 mt-9 mb-9"
    >
      <!-- Capçalera -->
      <div class="flex justify-between items-center mb-8">
        <div>
          <h2 class="text-2xl font-bold text-white mb-2 flex items-center">
            <span
              class="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-green-400"
            >
              Gestió de Cursos
            </span>
            <!-- Indicador de sección -->
            <span
              v-if="actualRoute === 'teacher-grades'"
              class="ml-3 bg-indigo-500/20 text-indigo-400 px-3 py-1 rounded-full text-sm font-medium"
            >
              Avaluació
            </span>
            <span
              v-if="actualRoute === 'teacher-assistence'"
              class="ml-3 bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm font-medium"
            >
              Assistència
            </span>
          </h2>
          <p class="text-gray-400 text-sm">
            <span v-if="actualRoute === 'teacher-grades'">
              Accedeix a les funcions d'avaluació i gestió de notes dels teus
              cursos assignats
            </span>
            <span v-else-if="actualRoute === 'teacher-assistence'">
              Gestiona el control d'assistència dels alumnes en els teus cursos
            </span>
          </p>
        </div>
        <div class="flex items-center gap-4">
          <!-- Icono de la sección -->
          <div
            v-if="actualRoute === 'teacher-grades'"
            class="bg-indigo-500/10 p-3 rounded-lg border border-indigo-500/20"
          >
            <svg
              class="w-8 h-8 text-indigo-400"
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
          <div
            v-else-if="actualRoute === 'teacher-assistence'"
            class="bg-blue-500/10 p-3 rounded-lg border border-blue-500/20"
          >
            <svg
              class="w-8 h-8 text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </div>
          <div
            class="bg-green-500/10 p-3 rounded-lg border border-green-500/20"
          >
            <svg
              class="w-8 h-8 text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </div>
        </div>
      </div>

      <!-- Descripción de la sección -->
      <div
        class="mb-8 bg-slate-800/50 rounded-xl p-6 border border-slate-700/30"
      >
        <div class="flex items-start">
          <!-- Icono específico según la sección -->
          <div
            v-if="actualRoute === 'teacher-grades'"
            class="bg-indigo-500/20 p-3 rounded-lg mr-4"
          >
            <svg
              class="w-6 h-6 text-indigo-400"
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
          <div
            v-else-if="actualRoute === 'teacher-assistence'"
            class="bg-blue-500/20 p-3 rounded-lg mr-4"
          >
            <svg
              class="w-6 h-6 text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <div v-else class="bg-green-500/20 p-3 rounded-lg mr-4">
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
              <span v-if="actualRoute === 'teacher-grades'">
                Sobre Gestió de Notes i Avaluació
              </span>
              <span v-else-if="actualRoute === 'teacher-assistence'">
                Sobre Gestió d'Assistència
              </span>
              <span v-else> Sobre Gestió de Cursos </span>
            </h3>
            <p class="text-gray-300">
              <span v-if="actualRoute === 'teacher-grades'">
                Aquesta secció permet gestionar les notes i avaluacions dels
                alumnes en els teus cursos. Selecciona un curs per accedir a les
                funcions d'avaluació i qualificació.
              </span>
              <span v-else-if="actualRoute === 'teacher-assistence'">
                Aquesta secció permet controlar l'assistència dels alumnes en
                els teus cursos. Selecciona un curs per registrar i gestionar
                l'assistència a les classes.
              </span>
              <span v-else>
                Aquesta secció permet gestionar les notes i l'assistència dels
                alumnes en els teus cursos. Selecciona un curs i accedeix a les
                funcions d'avaluació o control d'assistència segons les teves
                necessitats.
              </span>
            </p>
          </div>
        </div>
      </div>

      <!-- Estado sin cursos -->
      <div v-if="courses.length === 0" class="text-center py-12 text-gray-400">
        <div
          class="bg-slate-800/50 p-8 rounded-xl border border-slate-700/30 max-w-md mx-auto"
        >
          <svg
            class="w-16 h-16 mx-auto text-gray-600 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p class="text-lg mb-2">No s'han trobat cursos</p>
          <p class="text-sm text-gray-500">
            No tens cap curs assignat actualment
          </p>
        </div>
      </div>

      <!-- Lista de cursos -->
      <div v-else>
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-white">Els meus cursos</h3>
          <div
            class="bg-green-500/10 px-3 py-1 rounded-full text-green-400 text-sm font-medium"
          >
            {{ courses.length }} cursos
          </div>
        </div>

        <!-- Tarjetas de cursos en lugar de tabla para mejor visualización -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div
            v-for="course in courses"
            :key="course.id"
            class="p-6 bg-slate-800/50 rounded-xl border border-slate-700/30 hover:border-slate-600 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/5 group"
          >
            <div class="flex justify-between items-start">
              <div>
                <h2
                  class="text-xl font-semibold text-white group-hover:text-green-400 transition-colors"
                >
                  {{ course.course_name }}
                </h2>
                <p
                  class="text-gray-300 mt-2 group-hover:text-gray-200 transition-colors"
                >
                  {{ course.course_description }}
                </p>
              </div>
              <span
                class="bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap"
              >
                Curs Assignat
              </span>
            </div>
            <div class="mt-6 flex space-x-3 justify-end">
              <button
                @click="goToAssistance(course.id)"
                v-if="actualRoute === 'teacher-assistence'"
                class="px-4 py-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20 transition-all duration-300 text-sm flex items-center"
              >
                <svg
                  class="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                Assistència
              </button>
              <button
                @click="goToGrades(course.id)"
                v-if="actualRoute === 'teacher-grades'"
                class="px-4 py-2 bg-indigo-500/10 text-indigo-400 rounded-lg hover:bg-indigo-500/20 transition-all duration-300 text-sm flex items-center"
              >
                <svg
                  class="w-4 h-4 mr-2"
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
                Avaluació
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAppStore } from "@/stores/index.js";
import { onMounted, ref } from "vue";
import { getCoursesFromUser } from "@/services/communicationsScripts/mainManager.js";
import { useRouter } from "vue-router";

const store = useAppStore();
const courses = ref([]);
const route = useRouter();
import { computed } from "vue";

const actualRoute = computed(() => route.currentRoute.value.name);
onMounted(async () => {
  courses.value = await getCoursesFromUser(store.getUserId());
});

function goToGrades(courseId) {
  route.push({ name: "grades", params: { courseId } });
}

function goToAssistance(courseId) {
  route.push({ name: "attendance", params: { courseId } });
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
