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
            Els meus cursos
          </span>
        </h2>
        <p class="text-gray-400 text-sm">
          Gestiona els teus cursos i assignacions
        </p>
      </div>
      <div class="bg-purple-500/10 p-3 rounded-lg border border-purple-500/20">
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
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        </svg>
      </div>
    </div>

    <!-- Tabs -->
    <div
      class="flex space-x-4 mb-6 bg-slate-800/30 p-1.5 rounded-lg border border-slate-700/30"
    >
      <button
        class="flex-1 py-2.5 px-4 rounded-lg font-medium text-sm transition-all duration-200 flex justify-center items-center"
        :class="
          activeTab === 0
            ? 'bg-gradient-to-r from-purple-500/90 to-blue-500/90 text-white shadow-lg'
            : 'text-gray-400 hover:text-white hover:bg-slate-700/50'
        "
        @click="activeTab = 0"
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
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
        Els meus cursos
      </button>
      <button
        class="flex-1 py-2.5 px-4 rounded-lg font-medium text-sm transition-all duration-200 flex justify-center items-center"
        :class="
          activeTab === 1
            ? 'bg-gradient-to-r from-purple-500/90 to-blue-500/90 text-white shadow-lg'
            : 'text-gray-400 hover:text-white hover:bg-slate-700/50'
        "
        @click="activeTab = 1"
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
            d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"
          />
        </svg>
        Cursos sense assignar
      </button>
    </div>

    <!-- Tab Content -->
    <div v-if="activeTab === 0" class="space-y-6 animate-fade-in">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-white">Els meus cursos</h3>
        <div
          class="bg-blue-500/10 px-3 py-1 rounded-full text-blue-400 text-sm font-medium"
        >
          {{ myCourses.length }} cursos
        </div>
      </div>

      <div
        v-if="myCourses.length === 0"
        class="text-center py-12 text-gray-400"
      >
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
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
          <p class="text-lg mb-2">No tens cursos assignats</p>
          <p class="text-sm text-gray-500">
            Pots assignar-te cursos disponibles des de la pestanya "Cursos sense
            assignar"
          </p>
        </div>
      </div>

      <div v-else class="space-y-4">
        <div
          v-for="course in myCourses"
          :key="course.id"
          class="p-6 bg-slate-800/50 rounded-xl border border-slate-700/30 hover:border-slate-600 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/5 group"
        >
          <div class="flex justify-between items-start">
            <div>
              <h2
                class="text-xl font-semibold text-white group-hover:text-blue-400 transition-colors"
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
              class="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-xs font-medium"
            >
              Curs Assignat
            </span>
          </div>
          <div class="mt-6">
            <button
              @click="leaveCourse(course.id)"
              class="px-4 py-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-all duration-300 text-sm flex items-center"
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
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Deixar el curs
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="activeTab === 1" class="space-y-6 animate-fade-in">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-white">Cursos sense assignar</h3>
        <div
          class="bg-purple-500/10 px-3 py-1 rounded-full text-purple-400 text-sm font-medium"
        >
          {{ unassignedCourses.length }} cursos
        </div>
      </div>

      <div
        v-if="unassignedCourses.length === 0"
        class="text-center py-12 text-gray-400"
      >
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
              d="M5 13l4 4L19 7"
            />
          </svg>
          <p class="text-lg mb-2">No hi ha cursos disponibles</p>
          <p class="text-sm text-gray-500">
            Tots els cursos ja estan assignats
          </p>
        </div>
      </div>

      <div v-else class="space-y-4">
        <div
          v-for="course in unassignedCourses"
          :key="course.id"
          class="p-6 bg-slate-800/50 rounded-xl border border-slate-700/30 hover:border-slate-600 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/5 group"
        >
          <div class="flex justify-between items-start">
            <div>
              <h2
                class="text-xl font-semibold text-white group-hover:text-purple-400 transition-colors"
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
              class="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-xs font-medium"
            >
              Curs Disponible
            </span>
          </div>
          <div class="mt-6">
            <button
              @click="assignCourse(course.id)"
              class="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg shadow hover:from-purple-600 hover:to-blue-600 transition-all duration-300 text-sm flex items-center"
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
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Assignar-me al curs
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import {
  getAllCourses,
  assignTeacher,
  desassignTeacher,
} from "@/services/communicationsScripts/mainManager";
import { useAppStore } from "@/stores/index.js";
import { useRouter } from "vue-router";
const router = useRouter();
const store = useAppStore();
const activeTab = ref(0);
const courses = ref([]);
const myCourses = ref([]);
const unassignedCourses = ref([]);

onMounted(async () => {
  courses.value = await getAllCourses();
  const appStore = useAppStore();
  const userId = appStore.user.id; // Assuming the user ID is stored in the app store

  // Filter courses into myCourses and unassignedCourses
  myCourses.value = courses.value.filter(
    (course) => course.course_teacher_id === userId
  );
  unassignedCourses.value = courses.value.filter(
    (course) => course.course_teacher_id == null
  );

  console.log("My Courses:", myCourses.value);
  console.log("Unassigned Courses:", unassignedCourses.value);
});

function assignCourse(courseId) {
  assignTeacher(courseId, store.user.id)
    .then(() => {
      unassignedCourses.value = unassignedCourses.value.filter(
        (course) => course.id !== courseId
      );
      myCourses.value.push(
        courses.value.find((course) => course.id === courseId)
      );
    })
    .catch((error) => {
      console.error(error);
      alert("Error al assignar-te al curs");
    });
}
function leaveCourse(courseId) {
  desassignTeacher(courseId, store.user.id)
    .then(() => {
      myCourses.value = myCourses.value.filter(
        (course) => course.id !== courseId
      );
      unassignedCourses.value.push(
        courses.value.find((course) => course.id === courseId)
      );
    })
    .catch((error) => {
      console.error(error);
      alert("Error al deixar el curs");
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
