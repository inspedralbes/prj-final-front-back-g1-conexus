<template>
  <div>
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
              Gestió de Departaments
            </span>
          </h2>
          <p class="text-gray-400 text-sm">
            Consulta i uneix-te als departaments del centre
          </p>
        </div>
        <div class="flex items-center gap-4">
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
                d="M3 7v4a1 1 0 001 1h3v2a1 1 0 001 1h4a1 1 0 001-1v-2h3a1 1 0 001-1V7a1 1 0 00-1-1H4a1 1 0 00-1 1zm0 10a1 1 0 001 1h16a1 1 0 001-1v-2a1 1 0 00-1-1H4a1 1 0 00-1 1v2z"
              />
            </svg>
          </div>
        </div>
      </div>

      <!-- Filtres i cerca -->
      <div
        class="mb-8 bg-slate-800/50 rounded-xl p-6 border border-slate-700/30"
      >
        <h3 class="text-lg font-semibold text-white mb-4">Filtres de cerca</h3>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Barra de cerca -->
          <div>
            <label
              for="search"
              class="block text-sm font-medium text-gray-300 mb-2"
              >Cerca per nom:</label
            >
            <div class="relative">
              <input
                type="text"
                id="search"
                v-model="searchQuery"
                placeholder="Introduïu el nom del departament..."
                class="w-full pl-12 px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
              />
              <svg
                class="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          <!-- Selector de filtre -->
          <div>
            <label
              for="filter"
              class="block text-sm font-medium text-gray-300 mb-2"
              >Filtre:</label
            >
            <div class="relative">
              <select
                id="filter"
                v-model="filterType"
                class="w-full pl-12 px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition-all appearance-none"
              >
                <option value="all">Tots els departaments</option>
                <option value="joined">El meu departament</option>
                <option value="available">Disponibles per unir-se</option>
              </select>
              <svg
                class="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 01-.293.707v4.172a1 1 0 01-.293.707l-2 2A1 1 0 0110 21v-4.586a1 1 0 01.293-.707l6.414-6.414A1 1 0 0017 8.586V4a1 1 0 01-1-1H4a1 1 0 01-1 1v2.586z"
                />
              </svg>
              <svg
                class="w-5 h-5 text-gray-400 absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- El meu departament actual -->
      <div v-if="userDepartment" class="mb-8">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-white">
            El meu departament actual
          </h3>
          <div
            class="bg-blue-500/10 px-3 py-1 rounded-full text-blue-400 text-sm font-medium"
          >
            Assignat
          </div>
        </div>

        <div
          class="p-6 bg-slate-800/50 rounded-xl border border-slate-700/30 hover:border-slate-600 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/5 group"
        >
          <div class="flex justify-between items-start">
            <div>
              <h2
                class="text-xl font-semibold text-white group-hover:text-blue-400 transition-colors"
              >
                {{
                  departments.find((dept) => dept.id === userDepartment)?.name
                }}
              </h2>
              <p
                class="text-gray-300 mt-2 group-hover:text-gray-200 transition-colors"
              >
                Departament assignat al teu perfil
              </p>
            </div>
            <span
              class="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-xs font-medium"
            >
              Assignat
            </span>
          </div>
          <div class="mt-6">
            <button
              @click="leaveDepartment(userDepartment)"
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
              Deixar departament
            </button>
          </div>
        </div>
      </div>

      <!-- Tots els departaments -->
      <div>
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-white">
            Tots els departaments
          </h3>
          <div
            class="bg-green-500/10 px-3 py-1 rounded-full text-green-400 text-sm font-medium"
          >
            {{ filteredDepartments.length }} departaments
          </div>
        </div>

        <!-- Mensaje de no resultados -->
        <div
          v-if="filteredDepartments.length === 0"
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
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p class="text-lg mb-2">No s'han trobat departaments</p>
            <p class="text-sm text-gray-500">
              Prova amb un altre terme de cerca
            </p>
          </div>
        </div>

        <!-- Lista de departamentos -->
        <div v-else class="space-y-4">
          <div
            v-for="dept in filteredDepartments"
            :key="dept.id"
            class="p-6 bg-slate-800/50 rounded-xl border border-slate-700/30 hover:border-slate-600 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/5 group"
          >
            <div class="flex justify-between items-start">
              <div>
                <h2
                  class="text-xl font-semibold text-white group-hover:text-green-400 transition-colors"
                >
                  {{ dept.name }}
                </h2>
                <p
                  class="text-gray-300 mt-2 group-hover:text-gray-200 transition-colors"
                >
                  Departament acadèmic
                </p>
              </div>
              <span
                :class="{
                  'px-3 py-1 rounded-full text-xs font-medium': true,
                  'bg-blue-500/20 text-blue-300':
                    userDepartment && dept.id === userDepartment,
                  'bg-green-500/20 text-green-300': !(
                    userDepartment && dept.id === userDepartment
                  ),
                }"
              >
                {{
                  userDepartment && dept.id === userDepartment
                    ? "Assignat"
                    : "Disponible"
                }}
              </span>
            </div>
            <div class="mt-6">
              <button
                v-if="userDepartment && dept.id === userDepartment"
                @click="leaveDepartment(dept.id)"
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
                Deixar departament
              </button>
              <button
                v-else
                @click="joinDepartment(dept.id)"
                class="px-4 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg shadow hover:from-green-600 hover:to-blue-600 transition-all duration-300 text-sm flex items-center"
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
                Unir-se al departament
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de confirmació per deixar el departament -->
    <div
      v-if="showLeaveConfirm"
      class="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div
        class="fixed inset-0 bg-black/60 backdrop-blur-sm"
        @click="showLeaveConfirm = false"
      ></div>
      <div
        class="relative bg-slate-800/90 rounded-2xl p-6 max-w-md w-full border border-slate-700/50 shadow-2xl animate-fade-in"
      >
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-bold text-white">Confirmar acció</h2>
          <button
            @click="showLeaveConfirm = false"
            class="text-gray-400 hover:text-white transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
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

        <div class="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6">
          <div class="flex items-center gap-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6 text-red-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clip-rule="evenodd"
              />
            </svg>
            <p class="text-gray-300">
              Estàs segur que vols deixar el departament
              <span class="font-medium text-white">{{
                getDepartmentName(departmentToLeave)
              }}</span
              >?
              <br />
              <span class="text-red-400 text-sm"
                >Aquesta acció no es pot desfer.</span
              >
            </p>
          </div>
        </div>

        <div class="flex justify-end space-x-4">
          <button
            @click="showLeaveConfirm = false"
            class="px-6 py-3 border border-slate-600 text-slate-300 rounded-lg hover:bg-slate-700 transition-all duration-300"
          >
            Cancel·lar
          </button>
          <button
            @click="confirmAndLeaveDepartment"
            class="px-6 py-3 bg-gradient-to-r from-red-500/90 to-red-600/90 text-white rounded-lg shadow-lg hover:shadow-red-500/20 hover:from-red-500 hover:to-red-600 transition-all duration-300 font-medium"
          >
            Deixar el departament
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useAppStore } from "@/stores/index.js";
import {
  getAllDepartments,
  updateUserDepartment,
} from "@/services/communicationsScripts/mainManager.js";

const store = useAppStore();
const departments = ref([]);
const userDepartment = ref(null);
const userId = store.getUserId();

// Variables per al modal de confirmació
const showLeaveConfirm = ref(false);
const departmentToLeave = ref(null);

// Nuevas variables para búsqueda y filtrado (solo UI, sin cambios funcionales)
const searchQuery = ref("");
const filterType = ref("all");

// Computed para filtrar departamentos según la búsqueda y filtros
const filteredDepartments = computed(() => {
  let result = departments.value;

  // Filtrar por búsqueda
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter((dept) => dept.name.toLowerCase().includes(query));
  }

  // Filtrar por tipo
  if (filterType.value === "joined") {
    result = result.filter((dept) => dept.id === userDepartment.value);
  } else if (filterType.value === "available") {
    result = result.filter((dept) => dept.id !== userDepartment.value);
  }

  return result;
});

onMounted(async () => {
  departments.value = await getAllDepartments();
  const user = await store.getUser(userId);
  userDepartment.value = user.department_id;
});

// Funció per obtenir el nom del departament pel seu ID
function getDepartmentName(departmentId) {
  const dept = departments.value.find((d) => d.id === departmentId);
  return dept ? dept.name : "";
}

// Funcions per al modal de confirmació
function leaveDepartment(departmentId) {
  departmentToLeave.value = departmentId;
  showLeaveConfirm.value = true;
}

function confirmAndLeaveDepartment() {
  updateUserDepartment(userId, null)
    .then(() => {
      userDepartment.value = null;
      store.setUserDepartment(null);
      showLeaveConfirm.value = false;
      departmentToLeave.value = null;
    })
    .catch((error) => {
      console.error(error);
      showLeaveConfirm.value = false;
    });
}

function joinDepartment(departmentId) {
  updateUserDepartment(userId, departmentId)
    .then(() => {
      userDepartment.value = departmentId;
      store.setUserDepartment(userDepartment.value);
    })
    .catch((error) => {
      console.error(error);
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

/* Estils per inputs en mode fosc */
select {
  color-scheme: dark;
}
</style>