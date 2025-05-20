<template>
  <div class="animate-fade-in max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
    <!-- Capçalera -->
    <div class="mb-12">
      <div class="flex justify-between items-center mb-6">
        <div>
          <h1 class="text-3xl font-bold text-white mb-2">
            <span
              class="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500"
            >
              Els Meus Cursos i Avaluacions
            </span>
          </h1>
          <p class="text-gray-400 text-sm">
            Accedeix a les notes i avaluacions dels cursos als que estàs inscrit
          </p>
        </div>
        <div class="flex items-center gap-4">
          <div class="bg-blue-500/10 p-3 rounded-lg border border-blue-500/20">
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
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
          <div
            class="bg-purple-500/10 p-3 rounded-lg border border-purple-500/20"
          >
            <svg
              class="w-8 h-8 text-purple-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Llista de cursos -->
    <div
      v-if="courses.length > 0"
      class="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/30 shadow-2xl overflow-hidden"
    >
      <!-- Taula de cursos -->
      <table class="w-full">
        <thead>
          <tr
            class="bg-gradient-to-r from-blue-600/80 to-purple-600/80 text-white"
          >
            <th class="py-4 px-6 text-left font-medium">Nom del Curs</th>
            <th class="py-4 px-6 text-left font-medium hidden md:table-cell">
              Descripció
            </th>
            <th class="py-4 px-6 text-left font-medium w-24">Estat</th>
            <th class="py-4 px-6 text-right font-medium w-32">Accions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="course in paginatedCourses"
            :key="course.course_id"
            class="border-t border-slate-700/50 hover:bg-slate-700/30 transition-all duration-300"
          >
            <td class="py-4 px-6 font-medium text-white">
              {{ course.course_name }}
            </td>
            <td class="py-4 px-6 text-gray-300 hidden md:table-cell">
              <span class="line-clamp-1">{{ course.course_description }}</span>
            </td>
            <td class="py-4 px-6">
              <span
                class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-500/20"
              >
                <svg
                  class="w-3 h-3 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Actiu
              </span>
            </td>
            <td class="py-4 px-6 text-right">
              <button
                @click="goToGrades(course.course_id)"
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 transform hover:scale-105"
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
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Notes
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Paginació -->
      <div
        class="bg-slate-800/80 px-6 py-4 flex items-center justify-between border-t border-slate-700/50"
      >
        <div
          class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between"
        >
          <div>
            <p class="text-sm text-gray-400">
              Mostrant
              <span class="font-medium text-gray-300">{{
                startIndex + 1
              }}</span>
              a <span class="font-medium text-gray-300">{{ endIndex }}</span> de
              <span class="font-medium text-gray-300">{{
                courses.length
              }}</span>
              cursos
            </p>
          </div>
          <div>
            <nav
              class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
              aria-label="Pagination"
            >
              <button
                @click="prevPage"
                :disabled="currentPage === 1"
                class="relative inline-flex items-center px-3 py-2 rounded-l-md border border-slate-600 bg-slate-700/70 text-sm font-medium text-gray-300 hover:bg-slate-600 disabled:opacity-50 disabled:hover:bg-slate-700 transition-colors duration-200"
              >
                <span class="sr-only">Anterior</span>
                <svg
                  class="h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fill-rule="evenodd"
                    d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                    clip-rule="evenodd"
                  />
                </svg>
              </button>

              <span v-for="page in totalPages" :key="page">
                <button
                  @click="goToPage(page)"
                  :class="[
                    'relative inline-flex items-center px-4 py-2 border text-sm font-medium transition-colors duration-200',
                    currentPage === page
                      ? 'bg-gradient-to-r from-blue-500/90 to-purple-500/90 text-white border-blue-600 z-10'
                      : 'bg-slate-700/70 text-gray-300 border-slate-600 hover:bg-slate-600 hover:text-white',
                  ]"
                >
                  {{ page }}
                </button>
              </span>

              <button
                @click="nextPage"
                :disabled="currentPage === totalPages"
                class="relative inline-flex items-center px-3 py-2 rounded-r-md border border-slate-600 bg-slate-700/70 text-sm font-medium text-gray-300 hover:bg-slate-600 disabled:opacity-50 disabled:hover:bg-slate-700 transition-colors duration-200"
              >
                <span class="sr-only">Següent</span>
                <svg
                  class="h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fill-rule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clip-rule="evenodd"
                  />
                </svg>
              </button>
            </nav>
          </div>
        </div>

        <!-- Versió mòbil de paginació -->
        <div class="flex sm:hidden justify-between w-full">
          <button
            @click="prevPage"
            :disabled="currentPage === 1"
            class="relative inline-flex items-center px-4 py-2 border border-slate-600 text-sm font-medium rounded-lg text-gray-300 bg-slate-700/70 hover:bg-slate-600 disabled:opacity-50 disabled:hover:bg-slate-700 transition-colors duration-200"
          >
            Anterior
          </button>
          <span class="text-sm text-gray-300 flex items-center">
            <span
              class="bg-slate-700/70 px-3 py-1 rounded-lg border border-slate-600"
            >
              {{ currentPage }} / {{ totalPages }}
            </span>
          </span>
          <button
            @click="nextPage"
            :disabled="currentPage === totalPages"
            class="ml-3 relative inline-flex items-center px-4 py-2 border border-slate-600 text-sm font-medium rounded-lg text-gray-300 bg-slate-700/70 hover:bg-slate-600 disabled:opacity-50 disabled:hover:bg-slate-700 transition-colors duration-200"
          >
            Següent
          </button>
        </div>
      </div>
    </div>

    <!-- Missatge si no hi ha cursos -->
    <div v-else class="text-center py-16">
      <div
        class="inline-block bg-slate-800/50 backdrop-blur-sm p-8 rounded-2xl border border-slate-700/30 shadow-2xl transform transition-all duration-300 hover:scale-105"
      >
        <div
          class="mb-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 p-4 rounded-full inline-flex"
        >
          <svg
            class="h-16 w-16 text-purple-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 class="mt-4 text-xl font-semibold text-white">
          No estàs inscrit a cap curs
        </h3>
        <p class="mt-3 text-gray-300 max-w-md mx-auto">
          Contacta amb el teu tutor per inscriure't a cursos i començar a
          aprendre
        </p>
        <button
          class="mt-6 px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 rounded-lg text-white transition-all duration-300 shadow-lg transform hover:scale-105 font-medium"
        >
          Contactar amb tutor
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAppStore } from "@/stores/index.js";
import { onMounted, ref, computed } from "vue";
import { getCoursesWithUser } from "@/services/communicationsScripts/mainManager.js";
import { useRouter } from "vue-router";

const store = useAppStore();
const courses = ref([]);
const router = useRouter();
const user = store.user;

// Variables per a paginació
const itemsPerPage = 10;
const currentPage = ref(1);

onMounted(async () => {
  try {
    courses.value = await getCoursesWithUser(user.id);
    console.log("Cursos carregats:", courses.value);
  } catch (error) {
    console.error("Error carregant cursos:", error);
  }
});

// Funció per navegar a les notes
function goToGrades(id) {
  console.log("Anant a notes del curs:", id);
  router.push({ name: "grades-from-course-student", params: { id } });
}

// Funcions per a la paginació
const totalPages = computed(() =>
  Math.ceil(courses.value.length / itemsPerPage)
);
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage);
const endIndex = computed(() =>
  Math.min(startIndex.value + itemsPerPage, courses.value.length)
);
const paginatedCourses = computed(() =>
  courses.value.slice(startIndex.value, endIndex.value)
);

function prevPage() {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
}

function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
}

function goToPage(page) {
  currentPage.value = page;
}
</script>

<style>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

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