<template>
  <div class="animate-fade-in mt-9 mb-9">
    <!-- Capçalera -->
    <div class="mb-8 text-center">
      <h1
        class="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400"
      >
        Panell del Professor
      </h1>
      <p class="text-gray-300 mt-2">
        Benvingut/uda al teu espai personal de gestió
      </p>
    </div>

    <!-- Barra de búsqueda con filtros -->
    <div class="mb-8 bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 shadow-lg">
      <div class="flex flex-col gap-4">
        <!-- Input de búsqueda -->
        <div class="relative">
          <div
            class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"
          >
            <svg
              class="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>
          </div>
          <input
            type="text"
            class="block w-full pl-10 pr-3 py-2.5 border border-gray-600 rounded-lg bg-slate-700/50 text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Buscar professors..."
            v-model="searchQuery"
            @keydown.enter="searchTeachers"
          />
        </div>

        <!-- Filtros desplegables -->
        <div class="flex flex-wrap gap-4">
          <!-- Filtro por departamento -->
          <div class="relative">
            <select
              v-model="selectedDepartment"
              class="block w-full px-4 py-2.5 pr-12 border border-gray-600 rounded-lg bg-slate-700/50 text-white focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Tots els departaments</option>
              <option v-for="dep in departments" :key="dep.id" :value="dep.id">
                {{ dep.name }}
              </option>
            </select>
            <button
              @click="filterByDepartment"
              class="ml-2 px-2 py-1 bg-blue-500/20 text-blue-400 rounded hover:bg-blue-500/30 absolute right-10 top-1/2 transform -translate-y-1/2"
            >
              +
            </button>
          </div>

          <!-- Filtro por curso -->
          <div class="relative">
            <select
              v-model="selectedCourse"
              class="block w-full px-4 py-2.5 pr-12 border border-gray-600 rounded-lg bg-slate-700/50 text-white focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Tots els cursos</option>
              <option
                v-for="course in courses"
                :key="course.id"
                :value="course.id"
              >
                {{ course.course_name }}
              </option>
            </select>
            <button
              @click="filterByCourse"
              class="ml-2 px-2 py-1 bg-blue-500/20 text-blue-400 rounded hover:bg-blue-500/30 absolute right-10 top-1/2 transform -translate-y-1/2"
            >
              +
            </button>
          </div>
        </div>

        <!-- Tags de filtros activos -->
        <div v-if="filterTags.length > 0" class="flex flex-wrap gap-2 mt-2">
          <div
            v-for="(tag, index) in filterTags"
            :key="index"
            class="flex items-center gap-1 px-3 py-1 rounded-full text-sm"
            :class="getTagClass(tag.type)"
          >
            <span>{{ tag.label }}</span>
            <button @click="removeTag(index)" class="ml-1 focus:outline-none">
              <svg
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Resultados de la búsqueda -->
      <div
        v-if="searchResults.length > 0"
        class="mt-6 border-t border-slate-700 pt-4"
      >
        <h3 class="text-lg font-semibold text-gray-300 mb-3">
          Resultats de la cerca
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="teacher in searchResults"
            :key="teacher.id"
            class="bg-slate-700/30 rounded-lg p-4 hover:bg-slate-700/50 transition-colors cursor-pointer"
          >
            <div class="flex items-center gap-3">
              <div
                class="w-12 h-12 rounded-full overflow-hidden bg-blue-500/20 flex items-center justify-center"
              >
                <img
                  v-if="teacher.profile"
                  :src="`${getImageUrl(teacher.profile)}`"
                  alt="Profile"
                  class="w-full h-full object-cover"
                />
                <span v-else class="text-xl text-blue-300">{{
                  getInitials(teacher.name)
                }}</span>
              </div>
              <div>
                <h4 class="font-medium text-white">{{ teacher.name }}</h4>
                <p class="text-sm text-gray-400">{{ teacher.email }}</p>
                <p
                  v-if="teacher.department_name"
                  class="text-xs text-blue-300 mt-1"
                >
                  Departament: {{ teacher.department_name }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Estado de carga o mensaje de no resultados -->
      <div v-else-if="isSearching" class="mt-6 text-center py-4">
        <div
          class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-400 mx-auto"
        ></div>
        <p class="text-gray-400 mt-2">Buscant professors...</p>
      </div>
      <div v-else-if="hasSearched" class="mt-6 text-center py-4 text-gray-400">
        No s'han trobat professors amb els criteris de cerca especificats
      </div>
    </div>

    <!-- Targetes de Resum -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <!-- Els meus cursos -->
      <div
        class="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
      >
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-lg font-semibold text-gray-300">Els meus cursos</h3>
            <p class="text-3xl font-bold mt-2">
              {{ teacherStats.courses || 0 }}
            </p>
            <p class="text-sm text-gray-400 mt-1">
              {{ teacherStats.pendingAssignments || 0 }} tasques pendents
            </p>
          </div>
          <div class="p-3 rounded-full bg-indigo-500/20">
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
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
        </div>
        <router-link
          to="/teachers/assistence"
          class="mt-4 inline-flex items-center text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          Gestionar cursos
          <svg
            class="w-4 h-4 ml-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </router-link>
      </div>

      <!-- Alumnes -->
      <div
        class="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
      >
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-lg font-semibold text-gray-300">Alumnes</h3>
            <p class="text-3xl font-bold mt-2">
              {{ teacherStats.students || 0 }}
            </p>
            <p class="text-sm text-gray-400 mt-1">
              {{ teacherStats.activeStudents || 0 }} actius aquesta setmana
            </p>
          </div>
          <div class="p-3 rounded-full bg-blue-500/20">
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
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          </div>
        </div>
        <router-link
          to="/teachers/students"
          class="mt-4 inline-flex items-center text-sm text-blue-400 hover:text-blue-300 transition-colors"
        >
          Veure alumnes
          <svg
            class="w-4 h-4 ml-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </router-link>
      </div>

      <!-- Horari -->
      <div
        class="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
      >
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-lg font-semibold text-gray-300">Horari setmana</h3>
            <p class="text-3xl font-bold mt-2">
              {{ teacherStats.hoursWeek || 0 }}h
            </p>
            <p class="text-sm text-gray-400 mt-1">
              {{ teacherStats.classesToday || 0 }} classes avui
            </p>
          </div>
          <div class="p-3 rounded-full bg-green-500/20">
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
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        </div>
        <router-link
          to="/teachers/schedule"
          class="mt-4 inline-flex items-center text-sm text-green-400 hover:text-green-300 transition-colors"
        >
          Veure horari
          <svg
            class="w-4 h-4 ml-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </router-link>
      </div>

      <!-- Aules -->
      <div
        class="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
      >
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-lg font-semibold text-gray-300">
              Reserves d'Aules
            </h3>
            <p class="text-3xl font-bold mt-2">
              {{ teacherStats.roomReservations || 0 }}
            </p>
            <p class="text-sm text-gray-400 mt-1">
              {{ teacherStats.upcomingReservations || 0 }} properes
            </p>
          </div>
          <div class="p-3 rounded-full bg-purple-500/20">
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
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          </div>
        </div>
        <router-link
          to="/teachers/roomReservation"
          class="mt-4 inline-flex items-center text-sm text-purple-400 hover:text-purple-300 transition-colors"
        >
          Gestionar reserves
          <svg
            class="w-4 h-4 ml-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </router-link>
      </div>

      <!-- Incidències -->
      <div
        class="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
      >
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-lg font-semibold text-gray-300">Incidències</h3>
            <p class="text-3xl font-bold mt-2">
              {{ teacherStats.incidents || 0 }}
            </p>
            <p class="text-sm text-gray-400 mt-1">
              {{ teacherStats.pendingIncidents || 0 }} sense resoldre
            </p>
          </div>
          <div class="p-3 rounded-full bg-red-500/20">
            <svg
              class="w-8 h-8 text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
        </div>
        <router-link
          to="/teachers/incidents"
          class="mt-4 inline-flex items-center text-sm text-red-400 hover:text-red-300 transition-colors"
        >
          Afegir incidència
          <svg
            class="w-4 h-4 ml-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </router-link>
      </div>

      <!-- Objectes Perduts -->
      <div
        class="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
      >
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-lg font-semibold text-gray-300">
              Objectes Perduts
            </h3>
            <p class="text-3xl font-bold mt-2">
              {{ teacherStats.lostObjects || 0 }}
            </p>
            <p class="text-sm text-gray-400 mt-1">
              {{ teacherStats.newLostObjects || 0 }} nous aquesta setmana
            </p>
          </div>
          <div class="p-3 rounded-full bg-yellow-500/20">
            <svg
              class="w-8 h-8 text-yellow-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
              />
            </svg>
          </div>
        </div>
        <router-link
          to="/teachers/lost-objects"
          class="mt-4 inline-flex items-center text-sm text-yellow-400 hover:text-yellow-300 transition-colors"
        >
          Veure objectes
          <svg
            class="w-4 h-4 ml-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </router-link>
      </div>
    </div>

    <!-- Recent Activity Section -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <!-- Recent Activity -->
      <div
        class="md:col-span-2 bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 shadow-lg"
      >
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold text-gray-300">Activitat Recent</h2>
          <button
            @click="loadRecentActivity"
            class="text-sm text-blue-400 hover:text-blue-300 transition-colors"
          >
            Actualitzar
          </button>
        </div>

        <div v-if="isLoadingActivity" class="flex justify-center py-4">
          <div
            class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-400"
          ></div>
        </div>

        <div
          v-else-if="recentActivity.length === 0"
          class="text-center py-4 text-gray-400"
        >
          No hi ha activitats recents
        </div>

        <div v-else class="space-y-4">
          <div
            v-for="(activity, index) in recentActivity"
            :key="index"
            class="flex items-start p-3 hover:bg-slate-700/30 rounded-lg transition-colors"
          >
            <div
              class="p-2 rounded-lg mr-3"
              :class="getActivityIconClass(activity.type).bgColor"
            >
              <svg
                class="w-5 h-5"
                :class="getActivityIconClass(activity.type).textColor"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  :d="getActivityIconClass(activity.type).icon"
                />
              </svg>
            </div>
            <div class="flex-1">
              <p class="font-medium">{{ getActivityTitle(activity) }}</p>
              <p class="text-sm text-gray-400">{{ activity.description }}</p>
            </div>
            <span class="text-xs text-gray-500">{{
              formatTimeAgo(activity.date)
            }}</span>
          </div>
        </div>
      </div>

      <!-- Upcoming Classes -->
      <div class="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 shadow-lg">
        <router-link to="/teachers/schedule">
          <h2 class="text-xl font-semibold text-gray-300 mb-4">Classes Avui</h2>
        </router-link>

        <div v-if="isLoadingClasses" class="flex justify-center py-4">
          <div
            class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-400"
          ></div>
        </div>

        <div
          v-else-if="todayClasses.length === 0"
          class="text-center py-4 text-gray-400"
        >
          No tens classes avui
        </div>

        <div v-else class="space-y-3">
          <div
            v-for="(classItem, index) in todayClasses"
            :key="index"
            class="p-3 border border-slate-700/50 rounded-lg hover:bg-slate-700/20 transition-colors"
          >
            <div class="flex justify-between items-start">
              <div>
                <h3 class="font-medium text-white">{{ classItem.course }}</h3>
                <p
                  v-if="classItem.description"
                  class="text-sm text-gray-400 mt-1 line-clamp-2"
                >
                  {{ classItem.description }}
                </p>
              </div>
              <span
                class="text-sm px-2 py-1 bg-green-500/10 text-green-400 rounded-md whitespace-nowrap ml-2"
                >{{ classItem.time }}</span
              >
            </div>
            <div class="flex items-center mt-2 text-sm text-gray-400">
              <svg
                class="w-4 h-4 mr-1 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
              <span class="truncate">{{ classItem.room }}</span>
            </div>
          </div>
        </div>

        <router-link
          to="/teachers/assistence"
          class="mt-4 inline-block text-sm text-green-400 hover:text-green-300 transition-colors"
        >
          Veure horari complet
          <svg
            class="w-4 h-4 ml-1 inline"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </router-link>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 shadow-lg">
      <h2 class="text-xl font-semibold text-gray-300 mb-4">Accions Ràpides</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <router-link
          to="/teachers/grades"
          class="flex items-center justify-center p-4 bg-blue-500/10 hover:bg-blue-500/20 rounded-lg transition-colors"
        >
          <svg
            class="w-5 h-5 mr-2 text-blue-400"
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
          <span>Nova Tasca</span>
        </router-link>

        <router-link
          to="/teachers/incidents"
          class="flex items-center justify-center p-4 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors"
        >
          <svg
            class="w-5 h-5 mr-2 text-red-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <span>Reportar Incidència</span>
        </router-link>

        <router-link
          to="/teachers/roomReservation"
          class="flex items-center justify-center p-4 bg-purple-500/10 hover:bg-purple-500/20 rounded-lg transition-colors"
        >
          <svg
            class="w-5 h-5 mr-2 text-purple-400"
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
          <span>Reservar Aula</span>
        </router-link>

        <router-link
          to="/teachers/chats"
          class="flex items-center justify-center p-4 bg-green-500/10 hover:bg-green-500/20 rounded-lg transition-colors"
        >
          <svg
            class="w-5 h-5 mr-2 text-green-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
          <span>Nou Missatge</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useAppStore } from "@/stores";
import {
  getAllCourses,
  getAlumns,
  getCoursesFromUser,
  getAllDepartments,
  getAllUsers,
  getAllTeachersFromDepartment,
} from "@/services/communicationsScripts/mainManager";
import { getReportStats } from "@/services/communicationsScripts/incidentsManager";
import {
  getAllLostObjects,
  getLostObjectsResponsesCount,
} from "@/services/communicationsScripts/lostObjectManager";
import { getReservationsFromUser } from "@/services/communicationsScripts/roomReservationsComManager";

const appStore = useAppStore();
const teacherStats = ref({
  courses: 0,
  students: 0,
  pendingAssignments: 0,
  activeStudents: 0,
  hoursWeek: 0,
  classesToday: 0,
  roomReservations: 0,
  upcomingReservations: 0,
  incidents: 0,
  pendingIncidents: 0,
  lostObjects: 0,
  newLostObjects: 0,
});

// Variables para la búsqueda y filtrado
const searchQuery = ref("");
const selectedDepartment = ref("");
const selectedCourse = ref("");
const filterTags = ref([]);
const departments = ref([]);
const courses = ref([]);
const searchResults = ref([]);
const isSearching = ref(false);
const hasSearched = ref(false);
const allTeachers = ref([]);

// Cargar departamentos y cursos para los filtros
const loadFiltersData = async () => {
  try {
    // Cargar departamentos
    const departmentsData = await getAllDepartments();
    if (Array.isArray(departmentsData)) {
      departments.value = departmentsData;
    }

    // Cargar todos los cursos
    const coursesData = await getAllCourses();
    if (Array.isArray(coursesData)) {
      courses.value = coursesData;
    }

    // Cargar todos los profesores (usuarios con typeUsers_id = 1)
    const users = await getAllUsers();
    if (Array.isArray(users)) {
      allTeachers.value = users.filter((user) => user.typeUsers_id === 1);
    }
  } catch (error) {
    console.error("Error al cargar datos para filtros:", error);
  }
};

// Función para buscar profesores basado en todos los filtros activos
const applyAllFilters = async () => {
  isSearching.value = true;
  hasSearched.value = true;
  searchResults.value = [];

  try {
    // Obtener la lista base de profesores
    let filteredTeachers = [];

    // Si hay un filtro de departamento, usar ese como base
    const departmentTag = filterTags.value.find(
      (tag) => tag.type === "department"
    );
    if (departmentTag) {
      const depTeachers = await getAllTeachersFromDepartment(
        departmentTag.value
      );
      filteredTeachers = Array.isArray(depTeachers) ? depTeachers : [];
    } else {
      // Si no hay filtro de departamento, usar todos los profesores
      filteredTeachers = [...allTeachers.value];
    }

    // Aplicar filtro de búsqueda por nombre si existe
    const searchTag = filterTags.value.find((tag) => tag.type === "search");
    if (searchTag && searchTag.value) {
      const searchTerm = searchTag.value.toLowerCase();
      filteredTeachers = filteredTeachers.filter((teacher) =>
        teacher.name?.toLowerCase().includes(searchTerm)
      );
    }

    // Aplicar filtro de curso si existe
    const courseTag = filterTags.value.find((tag) => tag.type === "course");
    if (courseTag) {
      // Obtener el curso seleccionado
      const selectedCourse = courses.value.find(
        (c) => c.id === courseTag.value || c.course_id === courseTag.value
      );
      if (selectedCourse) {
        // Filtrar profesores que tienen este curso asignado
        filteredTeachers = filteredTeachers.filter(
          (teacher) => teacher.id === selectedCourse.course_teacher_id
        );
      }
    }

    // Enriquecer los resultados con nombres de departamento
    searchResults.value = await Promise.all(
      filteredTeachers.map(async (teacher) => {
        if (teacher.department_id) {
          const department = departments.value.find(
            (d) => d.id === teacher.department_id
          );
          return {
            ...teacher,
            department_name: department ? department.name : "Desconocido",
          };
        }
        return teacher;
      })
    );
  } catch (error) {
    console.error("Error al aplicar filtros:", error);
  } finally {
    isSearching.value = false;
  }
};

// Función para buscar profesores por nombre
const searchTeachers = async () => {
  if (!searchQuery.value.trim()) return;

  // Actualizar o añadir el tag de búsqueda
  const existingTagIndex = filterTags.value.findIndex(
    (tag) => tag.type === "search"
  );
  if (existingTagIndex !== -1) {
    filterTags.value[existingTagIndex].value = searchQuery.value;
    filterTags.value[existingTagIndex].label = `Nom: ${searchQuery.value}`;
  } else {
    filterTags.value.push({
      type: "search",
      value: searchQuery.value,
      label: `Nom: ${searchQuery.value}`,
    });
  }

  searchQuery.value = "";

  // Aplicar todos los filtros
  await applyAllFilters();
};

// Función para filtrar por departamento
const filterByDepartment = async () => {
  if (!selectedDepartment.value) return;

  const department = departments.value.find(
    (dep) => dep.id === selectedDepartment.value
  );
  if (!department) return;

  // Actualizar o añadir el tag de departamento
  const existingTagIndex = filterTags.value.findIndex(
    (tag) => tag.type === "department"
  );
  if (existingTagIndex !== -1) {
    filterTags.value[existingTagIndex].value = selectedDepartment.value;
    filterTags.value[
      existingTagIndex
    ].label = `Departament: ${department.name}`;
  } else {
    filterTags.value.push({
      type: "department",
      value: selectedDepartment.value,
      label: `Departament: ${department.name}`,
    });
  }

  selectedDepartment.value = "";

  // Aplicar todos los filtros
  await applyAllFilters();
};

// Función para filtrar por curso
const filterByCourse = async () => {
  if (!selectedCourse.value) return;

  const course = courses.value.find(
    (c) => c.id === selectedCourse.value || c.course_id === selectedCourse.value
  );
  if (!course) return;

  // Actualizar o añadir el tag de curso
  const existingTagIndex = filterTags.value.findIndex(
    (tag) => tag.type === "course"
  );
  if (existingTagIndex !== -1) {
    filterTags.value[existingTagIndex].value = selectedCourse.value;
    filterTags.value[existingTagIndex].label = `Curs: ${course.course_name}`;
  } else {
    filterTags.value.push({
      type: "course",
      value: selectedCourse.value,
      label: `Curs: ${course.course_name}`,
    });
  }

  selectedCourse.value = "";

  // Aplicar todos los filtros
  await applyAllFilters();
};

// Eliminar tag de filtro y actualizar resultados
const removeTag = async (index) => {
  filterTags.value.splice(index, 1);

  // Si no quedan filtros, limpiar resultados
  if (filterTags.value.length === 0) {
    searchResults.value = [];
    hasSearched.value = false;
  } else {
    // Aplicar los filtros restantes
    await applyAllFilters();
  }
};

// Obtener clase CSS según tipo de tag
const getTagClass = (type) => {
  switch (type) {
    case "search":
      return "bg-indigo-500/20 text-indigo-300";
    case "department":
      return "bg-green-500/20 text-green-300";
    case "course":
      return "bg-blue-500/20 text-blue-300";
    default:
      return "bg-gray-500/20 text-gray-300";
  }
};

// Función para obtener iniciales del nombre para el avatar
const getInitials = (name) => {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
};

// Función para obtener la URL completa de la imagen de perfil
const getImageUrl = (profilePath) => {
  if (!profilePath) return "";
  if (profilePath.startsWith("http")) return profilePath;
  return `${import.meta.env.VITE_BACKEND_URL}${profilePath}`;
};

const recentActivity = ref([]);
const isLoadingActivity = ref(false);
const todayClasses = ref([]);
const isLoadingClasses = ref(false);

// Función para cargar estadísticas del profesor
const loadTeacherStats = async () => {
  try {
    const teacherId = appStore.getUserId();
    console.log("ID del profesor:", teacherId);

    // Obtener los cursos del profesor directamente con la API específica
    const myCourses = await getCoursesFromUser(teacherId);
    console.log("Cursos del profesor:", myCourses);

    // Filtrar los cursos para asegurarse que el profesor es el asignado
    const filteredCourses = Array.isArray(myCourses)
      ? myCourses.filter(
          (course) =>
            course.course_teacher_id === teacherId ||
            course.course_teacher_id === Number(teacherId)
        )
      : [];

    console.log(
      "Cursos filtrados donde este profesor es el asignado:",
      filteredCourses
    );
    teacherStats.value.courses = filteredCourses.length;

    // Obtener estudiantes de cada curso
    const uniqueStudentIds = new Set();

    // Para cada curso del profesor, obtener sus alumnos
    if (filteredCourses.length > 0) {
      for (const course of filteredCourses) {
        try {
          // Verificar que el curso tiene ID
          const courseId = course.id || course.course_id;
          if (!courseId) {
            console.warn("Curso sin ID:", course);
            continue;
          }

          console.log(`Obteniendo alumnos del curso ID: ${courseId}`);

          // Llamada directa a la API
          const response = await fetch(
            `${
              import.meta.env.VITE_BACKEND_URL
            }api/user-courses/course/${courseId}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
              },
            }
          );

          if (!response.ok) {
            console.error(
              `Error en la respuesta API para el curso ${courseId}:`,
              response.status
            );
            continue;
          }

          const studentsData = await response.json();
          console.log(`Estudiantes en curso ${courseId}:`, studentsData);

          if (Array.isArray(studentsData) && studentsData.length > 0) {
            // Ver la estructura del primer estudiante para depuración
            console.log("Estructura del primer estudiante:", studentsData[0]);

            studentsData.forEach((student) => {
              // Intentar diferentes propiedades donde podría estar el ID
              const studentId =
                student.user_id ||
                student.userId ||
                (student.user && student.user.id) ||
                student.id;

              if (studentId) {
                console.log(`Añadiendo estudiante con ID: ${studentId}`);
                uniqueStudentIds.add(studentId);
              } else {
                console.warn(
                  "No se pudo encontrar el ID del estudiante:",
                  student
                );
              }
            });
          } else {
            console.log(
              `No se encontraron estudiantes en el curso ${courseId}`
            );
          }
        } catch (error) {
          console.error(`Error obteniendo alumnos del curso:`, error);
        }
      }
    } else {
      console.warn("No se encontraron cursos asignados a este profesor");
    }

    console.log("Total estudiantes únicos encontrados:", uniqueStudentIds.size);
    console.log("IDs de estudiantes:", [...uniqueStudentIds]);

    teacherStats.value.students = uniqueStudentIds.size;
    teacherStats.value.activeStudents = Math.floor(uniqueStudentIds.size * 0.8); // Estimación: 80% activos

    // Datos simulados para tareas
    teacherStats.value.pendingAssignments = Math.floor(Math.random() * 10);

    // Contar clases para hoy basado en el horario real
    const today = new Date().getDay();
    const weekdays = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];
    const todayName = weekdays[today];

    let todayClassesCount = 0;
    let totalHoursWeek = 0;

    if (Array.isArray(filteredCourses)) {
      for (const course of filteredCourses) {
        if (course.course_hours_available) {
          try {
            const hoursData =
              typeof course.course_hours_available === "string"
                ? JSON.parse(course.course_hours_available)
                : course.course_hours_available;

            // Contar clases de hoy
            if (hoursData[todayName] && hoursData[todayName].length > 0) {
              todayClassesCount += hoursData[todayName].length;
            }

            // Sumar todas las horas de la semana
            Object.values(hoursData).forEach((dayHours) => {
              if (Array.isArray(dayHours)) {
                totalHoursWeek += dayHours.length;
              }
            });
          } catch (e) {
            console.warn("Error procesando horario del curso", e);
          }
        }
      }
    }

    teacherStats.value.classesToday = todayClassesCount;
    teacherStats.value.hoursWeek = totalHoursWeek;

    // Obtener reservas de aulas del profesor
    try {
      const roomReservations = await getReservationsFromUser(teacherId);
      console.log("Reservas de aulas del profesor:", roomReservations);

      // Comprobar si hay reservas y si la respuesta es un array
      if (Array.isArray(roomReservations)) {
        teacherStats.value.roomReservations = roomReservations.length;

        // Calcular reservas activas (entre start_time y end_time actual)
        const now = new Date();
        const activeReservations = roomReservations.filter((reservation) => {
          const startTime = new Date(reservation.start_time);
          const endTime = new Date(reservation.end_time);
          return startTime <= now && now <= endTime;
        });

        // Calcular reservas próximas (start_time es en el futuro)
        const upcomingReservations = roomReservations.filter((reservation) => {
          const startTime = new Date(reservation.start_time);
          return startTime > now;
        });

        teacherStats.value.upcomingReservations = upcomingReservations.length;
        console.log(
          `Reservas totales: ${roomReservations.length}, Próximas: ${upcomingReservations.length}`
        );
      } else {
        teacherStats.value.roomReservations = 0;
        teacherStats.value.upcomingReservations = 0;
      }
    } catch (error) {
      console.error("Error al cargar reservas de aulas:", error);
      teacherStats.value.roomReservations = 0;
      teacherStats.value.upcomingReservations = 0;
    }

    // Cargar estadísticas de incidencias
    const reportStats = await getReportStats();
    teacherStats.value.incidents = reportStats.total || 0;
    teacherStats.value.pendingIncidents = reportStats.pending || 0;

    // Cargar estadísticas de objetos perdidos
    try {
      const lostObjects = await getAllLostObjects();
      teacherStats.value.lostObjects = lostObjects.length || 0;

      // Calcular objetos nuevos (creados en la última semana)
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      const newObjects = lostObjects.filter((obj) => {
        const createdAt = new Date(obj.created_at || obj.createdAt);
        return createdAt > oneWeekAgo;
      });

      teacherStats.value.newLostObjects = newObjects.length;
    } catch (error) {
      console.error("Error al cargar objetos perdidos:", error);
      teacherStats.value.lostObjects = 0;
      teacherStats.value.newLostObjects = 0;
    }
  } catch (error) {
    console.error("Error al cargar estadísticas del profesor:", error);
  }
};

// Simular carga de actividad reciente
const loadRecentActivity = async () => {
  isLoadingActivity.value = true;

  try {
    // Simular retardo de red
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Datos de ejemplo para actividad reciente
    recentActivity.value = [
      {
        type: "assignment",
        title: "Nova tasca creada",
        description:
          'Has creat "Pràctica de programació" per al curs desenvolupament Web',
        date: new Date(Date.now() - 3600000), // 1 hora atrás
      },
      {
        type: "grade",
        title: "Notes actualitzades",
        description: 'Has qualificat 18 alumnes en "Examen parcial"',
        date: new Date(Date.now() - 86400000), // 1 día atrás
      },
      {
        type: "message",
        title: "Nou missatge",
        description: "Has rebut un missatge de Maria Garcia (estudiant)",
        date: new Date(Date.now() - 2 * 86400000), // 2 días atrás
      },
      {
        type: "incident",
        title: "Incidència reportada",
        description: "Has reportat un problema amb el projector a l'aula B-201",
        date: new Date(Date.now() - 3 * 86400000), // 3 días atrás
      },
      {
        type: "reservation",
        title: "Aula reservada",
        description: "Has reservat l'aula A-101 per al dia 15/06/2023",
        date: new Date(Date.now() - 5 * 86400000), // 5 días atrás
      },
    ];
  } catch (error) {
    console.error("Error al cargar actividad reciente:", error);
  } finally {
    isLoadingActivity.value = false;
  }
};

// Simular carga de clases de hoy
const loadTodayClasses = async () => {
  isLoadingClasses.value = true;

  try {
    const teacherId = appStore.getUserId();

    // Obtener cursos asignados al profesor
    const allCourses = await getAllCourses();
    const myCourses = allCourses.filter(
      (course) => course.course_teacher_id === teacherId
    );

    // Obtener el día actual (0 = domingo, 1 = lunes, etc.)
    const today = new Date().getDay();
    const weekdays = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];
    const todayName = weekdays[today];

    // Solo mostrar clases si es día laboral (lunes a viernes)
    if (today >= 1 && today <= 5) {
      // Transformar los cursos en clases para hoy
      todayClasses.value = myCourses
        .filter((course) => {
          if (!course.course_hours_available) return false;

          try {
            // Parsear el JSON de course_hours_available
            const hoursData =
              typeof course.course_hours_available === "string"
                ? JSON.parse(course.course_hours_available)
                : course.course_hours_available;

            // Verificar si hay clases para hoy
            return hoursData[todayName] && hoursData[todayName].length > 0;
          } catch (e) {
            console.warn(
              "Error parsing course hours for",
              course.course_name,
              e
            );
            return false;
          }
        })
        .flatMap((course) => {
          try {
            const hoursData =
              typeof course.course_hours_available === "string"
                ? JSON.parse(course.course_hours_available)
                : course.course_hours_available;

            // Convertir cada hora en una entrada de clase
            return hoursData[todayName].map((timeSlot) => {
              // Formatear la hora para mostrarla mejor
              const [startTime, endTime] = timeSlot.split("-");
              const formattedTime = `${startTime} - ${endTime}`;

              return {
                course: course.course_name,
                time: formattedTime,
                description: course.course_description,
                room: course.course_room || "Aula por determinar",
              };
            });
          } catch (e) {
            console.warn("Error processing course hours", e);
            return [];
          }
        });

      // Ordenar las clases por hora
      todayClasses.value.sort((a, b) => {
        const timeA = a.time.split(" - ")[0];
        const timeB = b.time.split(" - ")[0];
        return timeA.localeCompare(timeB);
      });
    } else {
      // Fin de semana, no hay clases
      todayClasses.value = [];
    }
  } catch (error) {
    console.error("Error al cargar clases de hoy:", error);
    todayClasses.value = [];
  } finally {
    isLoadingClasses.value = false;
  }
};

// Obtener clase de icono según tipo de actividad
const getActivityIconClass = (type) => {
  switch (type) {
    case "assignment":
      return {
        bgColor: "bg-blue-500/10",
        textColor: "text-blue-400",
        icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
      };
    case "grade":
      return {
        bgColor: "bg-green-500/10",
        textColor: "text-green-400",
        icon: "M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z",
      };
    case "message":
      return {
        bgColor: "bg-indigo-500/10",
        textColor: "text-indigo-400",
        icon: "M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z",
      };
    case "incident":
      return {
        bgColor: "bg-red-500/10",
        textColor: "text-red-400",
        icon: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z",
      };
    case "reservation":
      return {
        bgColor: "bg-purple-500/10",
        textColor: "text-purple-400",
        icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
      };
    default:
      return {
        bgColor: "bg-gray-500/10",
        textColor: "text-gray-400",
        icon: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
      };
  }
};

// Obtener título según tipo de actividad
const getActivityTitle = (activity) => {
  return activity.title || "Activitat";
};

// Formatear tiempo relativo
const formatTimeAgo = (date) => {
  if (!date) return "Data desconeguda";

  const now = new Date();
  const diffMs = now - new Date(date);

  if (diffMs < 0) return "Data futura";

  const diffMins = Math.round(diffMs / 60000);

  if (diffMins < 1) return "Ara mateix";
  if (diffMins < 60) return `Fa ${diffMins} min`;

  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `Fa ${diffHours} hora${diffHours > 1 ? "s" : ""}`;

  const diffDays = Math.floor(diffHours / 24);
  return `Fa ${diffDays} dia${diffDays > 1 ? "s" : ""}`;
};

// Cargar datos al montar el componente
onMounted(async () => {
  await loadTeacherStats();
  await loadRecentActivity();
  await loadTodayClasses();
  await loadFiltersData();
});
</script>

<style scoped>
/* Animación de aparición */
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
