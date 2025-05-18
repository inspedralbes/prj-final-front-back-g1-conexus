<template>
    <div class="mt-9 mb-9 py-8 px-4 sm:px-6">
        <div
            class="max-w-6xl mx-auto bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-slate-700/50">
            <!-- Cabecera -->
            <div class="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
                <div class="flex items-center justify-between">
                    <h1 class="text-2xl font-bold flex items-center">
                        <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        Gestió de Cursos
                    </h1>
                    <button @click="toggleCreateCourse"
                        class="flex items-center text-sm bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors">
                        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                        </svg>
                        Nou Curs
                    </button>
                </div>
            </div>

            <!-- Contenido -->
            <div class="p-6">
                <!-- Filtros y búsqueda -->
                <div class="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div class="relative w-full sm:w-64">
                        <input type="text" v-model="searchQuery" placeholder="Cercar cursos..."
                            class="w-full pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        <svg class="w-5 h-5 text-slate-400 absolute left-3 top-2.5" fill="none" stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <div class="flex items-center space-x-2">
                        <label class="text-sm text-slate-300">Filtrar per:</label>
                        <select v-model="filterBy"
                            class="bg-slate-700/50 border border-slate-600 rounded-lg text-white px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500">
                            <option value="all">Tots</option>
                            <option value="department">Departament</option>
                        </select>
                    </div>
                </div>

                <!-- Lista vacía -->
                <div v-if="filteredCourses.length === 0" class="text-center py-12">
                    <svg class="w-16 h-16 mx-auto text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1"
                            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p class="mt-4 text-slate-400">No s'han trobat cursos</p>
                    <button @click="toggleCreateCourse"
                        class="mt-4 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg shadow hover:from-blue-600 hover:to-indigo-700 transition-all duration-300">
                        Crear primer curs
                    </button>
                </div>

                <!-- Lista de cursos -->
                <div v-else>
                    <div class="overflow-x-auto bg-slate-800/30 rounded-xl border border-slate-700/50">
                        <table class="min-w-full divide-y divide-slate-700/70">
                            <thead class="bg-slate-700/30">
                                <tr>
                                    <th
                                        class="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                                        Curs
                                    </th>
                                    <th
                                        class="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                                        Professor
                                    </th>
                                    <th
                                        class="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                                        Horari
                                    </th>
                                    <th
                                        class="px-6 py-3 text-right text-xs font-medium text-slate-300 uppercase tracking-wider">
                                        Accions
                                    </th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-700/50">
                                <tr v-for="course in filteredCourses" :key="(course.course?.id || course.id || index)"
                                    class="hover:bg-slate-700/20 transition-colors cursor-pointer"
                                    @click="selectCourse(course)">
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="flex items-center">
                                            <div>
                                                <div class="text-sm font-medium text-white">
                                                    {{ course.course?.course_name || course.course_name || 'Sense nom' }}
                                                </div>
                                                <div class="text-xs text-slate-400 truncate max-w-xs">
                                                    {{ course.course?.course_description || course.course_description || 'Sense descripció' }}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="text-sm text-slate-300">
                                            {{ ((course.course?.course_teacher_id || course.course_teacher_id) && 
                                                (course.course?.teacher?.name || course.teacher?.name)) ? 
                                                (course.course?.teacher?.name || course.teacher?.name) : 'Sense professor' }}
                                        </div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="flex flex-wrap gap-1">
                                            <span v-if="hasScheduleDays(course)" v-for="day in getScheduleDays(course)"
                                                :key="day"
                                                class="px-2 py-0.5 text-xs rounded-full bg-blue-500/20 text-blue-300">
                                                {{ translatedDay(day) }}
                                            </span>
                                            <span v-else class="text-sm text-slate-400">No definit</span>
                                        </div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                        <button @click.stop="toggleModal(course)"
                                            class="text-blue-400 hover:text-blue-300 transition-colors">
                                            <span class="px-3 py-1 bg-blue-500/10 rounded-md">Editar</span>
                                        </button>
                                        <button @click.stop="callDeleteCourse(course.course?.id || course.id)"
                                            class="text-red-400 hover:text-red-300 transition-colors"
                                            :disabled="!(course.course?.id || course.id)">
                                            <span class="px-3 py-1 bg-red-500/10 rounded-md">Eliminar</span>
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal para crear curso -->
        <transition name="fade">
            <div v-if="showCreateCourse" class="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div class="fixed inset-0 bg-black/60 backdrop-blur-sm" @click="toggleCreateCourse"></div>
                <transition name="pop">
                    <div
                        class="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 w-full max-w-2xl border border-slate-700/50 shadow-2xl z-10">
                        <div class="flex justify-between items-center mb-4">
                            <h2 class="text-xl font-bold text-white">
                                {{ isEditing ? 'Editar Curs' : 'Crear Nou Curs' }}
                            </h2>
                            <button @click="toggleCreateCourse" class="text-gray-400 hover:text-white">
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <form @submit.prevent="callCreateCourse" class="space-y-4">
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-300 mb-2">Nom del curs</label>
                                    <input type="text" v-model="newCourse.course_name"
                                        class="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-3 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required placeholder="Ex: Matemàtiques Aplicades" />
                                </div>

                                <div>
                                    <label class="block text-sm font-medium text-gray-300 mb-2">Departament</label>
                                    <select v-model="newCourse.course_department_id"
                                        @change="getTeachersFromDepartment(newCourse.course_department_id)"
                                        class="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-3 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required>
                                        <option value="" disabled selected>Selecciona un departament</option>
                                        <option v-for="department in departments" :key="department.id"
                                            :value="department.id">
                                            {{ department.name }}
                                        </option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-gray-300 mb-2">Descripció</label>
                                <textarea v-model="newCourse.course_description"
                                    class="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-3 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[100px]"
                                    required placeholder="Descriu el contingut del curs..."></textarea>
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-gray-300 mb-2">Professor</label>
                                <select v-model="newCourse.course_teacher_id"
                                    class="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-3 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                    <option :value="null">Sense professor assignat</option>
                                    <option v-for="teacher in teachers" :key="teacher.id" :value="teacher.id">
                                        {{ teacher.name }}
                                    </option>
                                </select>
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-gray-300 mb-2">Horari del curs</label>

                                <!-- Selector de días con pestañas -->
                                <div class="mb-4 border-b border-slate-700">
                                    <div class="flex flex-wrap -mb-px">
                                        <button v-for="(ranges, day) in courseHours" :key="day" type="button"
                                            @click="activeDay = day"
                                            :class="{ 'text-blue-400 border-blue-400': activeDay === day, 'text-gray-400 border-transparent hover:text-gray-300': activeDay !== day }"
                                            class="mr-2 py-2 px-4 border-b-2 font-medium text-sm flex items-center">
                                            <input type="checkbox" :id="`enable-${day}`" v-model="dayEnabled[day]"
                                                @click.stop="deleteAllHorsFromDay(day)"
                                                class="mr-2 rounded bg-slate-600 border-slate-500 text-blue-500 focus:ring-blue-500" />
                                            {{ translatedDay(day) }}
                                        </button>
                                    </div>
                                </div>

                                <!-- Contenido de la pestaña activa -->
                                <div v-if="dayEnabled[activeDay]" class="bg-slate-700/30 rounded-lg p-4">
                                    <div v-if="courseHours[activeDay].length === 0"
                                        class="text-center py-4 text-gray-500">
                                        No hi ha horaris afegits per aquest dia
                                    </div>

                                    <div v-else class="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                                        <div v-for="(range, index) in courseHours[activeDay]" :key="index"
                                            class="flex flex-wrap items-center gap-4 bg-slate-600/30 p-4 rounded-lg">
                                            <div class="flex-1 min-w-[200px]">
                                                <label class="block text-xs text-gray-400 mb-1">Hora d'inici</label>
                                                <div class="flex items-center space-x-2">
                                                    <select v-model="range.startHour"
                                                        class="flex-1 bg-slate-700 border border-slate-600 rounded text-gray-200 px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500">
                                                        <option v-for="hour in 24" :key="hour" :value="hour">{{
                                                            String(hour).padStart(2, '0') }}:00</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div class="flex-1 min-w-[200px]">
                                                <label class="block text-xs text-gray-400 mb-1">Hora de fi</label>
                                                <div class="flex items-center space-x-2">
                                                    <select v-model="range.endHour"
                                                        class="flex-1 bg-slate-700 border border-slate-600 rounded text-gray-200 px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500">
                                                        <option v-for="hour in 24" :key="hour" :value="hour">{{
                                                            String(hour).padStart(2, '0') }}:00</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <button type="button" @click="removeTimeRange(activeDay, index)"
                                                class="p-2 text-red-400 hover:text-red-300 transition-colors"
                                                title="Eliminar rang">
                                                <svg class="w-5 h-5" fill="none" stroke="currentColor"
                                                    viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                        stroke-width="2"
                                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>

                                    <button type="button" @click="addTimeRange(activeDay)"
                                        class="mt-4 w-full flex items-center justify-center text-sm text-blue-400 hover:text-blue-300 transition-colors py-2 border border-dashed border-slate-600 rounded-lg">
                                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M12 4v16m8-8H4" />
                                        </svg>
                                        Afegir nou rang horari
                                    </button>
                                </div>
                            </div>

                            <div class="flex justify-end space-x-3 pt-4 border-t border-slate-700">
                                <button type="button" @click="toggleCreateCourse"
                                    class="px-6 py-2 border border-slate-600 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors">
                                    Cancel·lar
                                </button>
                                <button type="submit"
                                    class="px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg shadow hover:from-green-600 hover:to-green-700 transition-all duration-300"
                                    :disabled="submitting">
                                    <span v-if="submitting">Guardant...</span>
                                    <span v-else>{{ isEditing ? 'Guardar canvis' : 'Crear curs' }}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </transition>
            </div>
        </transition>

        <!-- Modal para ver detalles del curso -->
        <transition name="fade">
            <div v-if="selectedCourse" class="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div class="fixed inset-0 bg-black/60 backdrop-blur-sm" @click="selectedCourse = null"></div>
                <transition name="pop">
                    <div
                        class="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 w-full max-w-2xl border border-slate-700/50 shadow-2xl z-10">
                        <div class="flex justify-between items-center mb-4">
                            <h2 class="text-xl font-bold text-white">{{ selectedCourse.course.course_name }}</h2>
                            <button @click="selectedCourse = null" class="text-gray-400 hover:text-white">
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div class="overflow-y-auto max-h-[calc(80vh-100px)] pr-2">
                            <div class="bg-slate-700/20 p-4 rounded-lg mb-4">
                                <h3 class="text-md font-medium text-slate-300 mb-2">Descripció</h3>
                                <p class="text-white text-sm">{{ selectedCourse.course.course_description }}</p>
                            </div>

                            <div class="bg-slate-700/20 p-4 rounded-lg mb-4">
                                <h3 class="text-md font-medium text-slate-300 mb-2">Professor</h3>
                                <p class="text-white text-sm" v-if="selectedCourse.course.course_teacher_id">
                                    {{ selectedCourse.course.teacher.name }}
                                </p>
                                <p class="text-slate-400 text-sm" v-else>
                                    Sense professor assignat
                                </p>
                            </div>

                            <div class="bg-slate-700/20 p-4 rounded-lg mb-4">
                                <h3 class="text-md font-medium text-slate-300 mb-2">Horari</h3>
                                <div v-if="selectedSchedule.monday && selectedSchedule.monday.length > 0" class="mb-2">
                                    <h4 class="text-sm font-medium text-slate-300">Dilluns:</h4>
                                    <ul class="list-disc list-inside text-white text-sm ml-2">
                                        <li v-for="hours in selectedSchedule.monday" :key="hours">{{ hours }}</li>
                                    </ul>
                                </div>
                                <div v-if="selectedSchedule.tuesday && selectedSchedule.tuesday.length > 0"
                                    class="mb-2">
                                    <h4 class="text-sm font-medium text-slate-300">Dimarts:</h4>
                                    <ul class="list-disc list-inside text-white text-sm ml-2">
                                        <li v-for="hours in selectedSchedule.tuesday" :key="hours">{{ hours }}</li>
                                    </ul>
                                </div>
                                <div v-if="selectedSchedule.wednesday && selectedSchedule.wednesday.length > 0"
                                    class="mb-2">
                                    <h4 class="text-sm font-medium text-slate-300">Dimecres:</h4>
                                    <ul class="list-disc list-inside text-white text-sm ml-2">
                                        <li v-for="hours in selectedSchedule.wednesday" :key="hours">{{ hours }}</li>
                                    </ul>
                                </div>
                                <div v-if="selectedSchedule.thursday && selectedSchedule.thursday.length > 0"
                                    class="mb-2">
                                    <h4 class="text-sm font-medium text-slate-300">Dijous:</h4>
                                    <ul class="list-disc list-inside text-white text-sm ml-2">
                                        <li v-for="hours in selectedSchedule.thursday" :key="hours">{{ hours }}</li>
                                    </ul>
                                </div>
                                <div v-if="selectedSchedule.friday && selectedSchedule.friday.length > 0" class="mb-2">
                                    <h4 class="text-sm font-medium text-slate-300">Divendres:</h4>
                                    <ul class="list-disc list-inside text-white text-sm ml-2">
                                        <li v-for="hours in selectedSchedule.friday" :key="hours">{{ hours }}</li>
                                    </ul>
                                </div>
                                <p v-if="!hasAnySchedule(selectedSchedule)" class="text-slate-400 text-sm">
                                    No hi ha horaris definits
                                </p>
                            </div>
                        </div>

                        <div class="flex justify-end space-x-3 pt-4 border-t border-slate-700 mt-4">
                            <button type="button" @click="toggleModal(selectedCourse)"
                                class="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors">
                                Editar
                            </button>
                            <button type="button" @click="callDeleteCourse(selectedCourse.course?.id || selectedCourse.id)"
                                class="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors">
                                Eliminar
                            </button>
                        </div>
                    </div>
                </transition>
            </div>
        </transition>

        <!-- Reutilizar el componente modal para editar un curso -->
        <transition name="fade">
            <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div class="fixed inset-0 bg-black/60 backdrop-blur-sm" @click="toggleModal()"></div>
                <div class="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 w-full max-w-2xl border border-slate-700/50 shadow-2xl z-10">
                    <div class="flex justify-between items-center mb-4">
                        <h2 class="text-xl font-bold text-white">Editar Curs</h2>
                        <button @click="toggleModal()" class="text-gray-400 hover:text-white">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <form @submit.prevent="sendUpdateCourse" class="space-y-4 overflow-y-auto max-h-[calc(80vh-120px)]">
                        <div>
                            <label class="block text-sm font-medium text-gray-300 mb-2">Nom del curs</label>
                            <input type="text" v-model="editingCourse.course.course_name"
                                class="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-3 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required />
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-300 mb-2">Descripció</label>
                            <textarea v-model="editingCourse.course.course_description"
                                class="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-3 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[100px]"
                                required></textarea>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-300 mb-2">Departament</label>
                            <select v-model="editingCourse.course.course_department_id"
                                @change="changeTeachers()"
                                class="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-3 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required>
                                <option v-for="department in departments" :key="department.id" :value="department.id">
                                    {{ department.name }}
                                </option>
                            </select>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-300 mb-2">Professor</label>
                            <select v-model="editingCourse.course.course_teacher_id"
                                class="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-3 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                <option :value="null">Sense professor assignat</option>
                                <option v-for="teacher in teachers" :key="teacher.id" :value="teacher.id">
                                    {{ teacher.name }}
                                </option>
                            </select>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-300 mb-2">Horari del curs</label>

                            <!-- Selector de días con pestañas -->
                            <div class="mb-4 border-b border-slate-700">
                                <div class="flex flex-wrap -mb-px">
                                    <button v-for="(ranges, day) in editingHours" :key="day" type="button"
                                        @click="activeDay = day"
                                        :class="{ 'text-blue-400 border-blue-400': activeDay === day, 'text-gray-400 border-transparent hover:text-gray-300': activeDay !== day }"
                                        class="mr-2 py-2 px-4 border-b-2 font-medium text-sm flex items-center">
                                        <input type="checkbox" :id="`enable-edit-${day}`" v-model="editingDayEnabled[day]"
                                            @click.stop="removeAllEditingTimeRanges(day)"
                                            class="mr-2 rounded bg-slate-600 border-slate-500 text-blue-500 focus:ring-blue-500" />
                                        {{ translatedDay(day) }}
                                    </button>
                                </div>
                            </div>

                            <!-- Contenido de la pestaña activa -->
                            <div v-if="editingDayEnabled[activeDay]" class="bg-slate-700/30 rounded-lg p-4">
                                <div v-if="editingHours[activeDay].length === 0" class="text-center py-4 text-gray-500">
                                    No hi ha horaris afegits per aquest dia
                                </div>

                                <div v-else class="space-y-3 max-h-[200px] overflow-y-auto pr-2">
                                    <div v-for="(range, index) in editingHours[activeDay]" :key="index"
                                        class="flex flex-wrap items-center gap-4 bg-slate-600/30 p-4 rounded-lg">
                                        <div class="flex-1 min-w-[200px]">
                                            <label class="block text-xs text-gray-400 mb-1">Hora d'inici</label>
                                            <div class="flex items-center space-x-2">
                                                <select v-model="range.startHour"
                                                    class="flex-1 bg-slate-700 border border-slate-600 rounded text-gray-200 px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500">
                                                    <option v-for="hour in 24" :key="hour" :value="hour">{{
                                                        String(hour).padStart(2, '0') }}:00</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div class="flex-1 min-w-[200px]">
                                            <label class="block text-xs text-gray-400 mb-1">Hora de fi</label>
                                            <div class="flex items-center space-x-2">
                                                <select v-model="range.endHour"
                                                    class="flex-1 bg-slate-700 border border-slate-600 rounded text-gray-200 px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500">
                                                    <option v-for="hour in 24" :key="hour" :value="hour">{{
                                                        String(hour).padStart(2, '0') }}:00</option>
                                                </select>
                                            </div>
                                        </div>

                                        <button type="button" @click="removeEditingTimeRange(activeDay, index)"
                                            class="p-2 text-red-400 hover:text-red-300 transition-colors" title="Eliminar rang">
                                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                <button type="button" @click="addEditingTimeRange(activeDay)"
                                    class="mt-4 w-full flex items-center justify-center text-sm text-blue-400 hover:text-blue-300 transition-colors py-2 border border-dashed border-slate-600 rounded-lg">
                                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M12 4v16m8-8H4" />
                                    </svg>
                                    Afegir nou rang horari
                                </button>
                            </div>
                        </div>

                        <div class="flex justify-end space-x-3 pt-4 border-t border-slate-700">
                            <button type="button" @click="toggleModal()"
                                class="px-6 py-2 border border-slate-600 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors">
                                Cancel·lar
                            </button>
                            <button type="submit"
                                class="px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg shadow hover:from-green-600 hover:to-green-700 transition-all duration-300">
                                Guardar canvis
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </transition>

        <!-- Modal de confirmación para eliminar -->
        <transition name="fade">
            <div v-if="showDeleteConfirm" class="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div class="fixed inset-0 bg-black/60 backdrop-blur-sm" @click="showDeleteConfirm = false"></div>
                <div class="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 w-full max-w-md border border-slate-700/50 shadow-2xl z-10">
                    <div class="flex items-center mb-4 text-red-500">
                        <svg class="w-8 h-8 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <h2 class="text-xl font-bold text-white">Confirmar eliminació</h2>
                    </div>
                    
                    <p class="mb-6 text-gray-300">Estàs segur que vols eliminar el curs <span class="font-semibold text-white">{{ courseToDelete?.course?.course_name }}</span>? Aquesta acció no es pot desfer.</p>
                    
                    <div class="flex justify-end space-x-3">
                        <button @click="showDeleteConfirm = false"
                            class="px-4 py-2 border border-slate-600 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors">
                            Cancel·lar
                        </button>
                        <button @click="confirmDeleteCourse"
                            class="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors">
                            Eliminar
                        </button>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getAllCourses, createCourse, getAllDepartments, getAllTeachersFromDepartment, deleteCourse, updateCourse } from '@/services/communicationsScripts/mainManager.js';

const router = useRouter();
const departments = ref([]);
const teachers = ref([]);
const courses = ref([]);
const showCreateCourse = ref(false);
const showModal = ref(false);
const showDeleteConfirm = ref(false);
const activeDay = ref('monday');
const submitting = ref(false);
const searchQuery = ref('');
const filterBy = ref('all');
const selectedCourse = ref(null);
const selectedSchedule = ref({});
const editingCourse = ref(null);
const editingHours = ref({});
const editingDayEnabled = ref({});
const isEditing = ref(false);
const courseToDelete = ref(null);

const newCourse = ref({
    course_name: '',
    course_description: '',
    course_hours_available: [],
    course_department_id: null,
    course_teacher_id: null,
});

const courseHours = ref({
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: []
});

const dayEnabled = ref({
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false
});

const translatedDays = {
    monday: 'Dilluns',
    tuesday: 'Dimarts',
    wednesday: 'Dimecres',
    thursday: 'Dijous',
    friday: 'Divendres',
};

// Filtrado de cursos según la búsqueda
const filteredCourses = computed(() => {
    if (!courses.value || courses.value.length === 0) return [];
    if (!searchQuery.value) return courses.value;

    const query = searchQuery.value.toLowerCase();
    return courses.value.filter(course => {
        if (!course?.course) return false;

        return (course.course.course_name?.toLowerCase().includes(query)) ||
            (course.course.course_description?.toLowerCase().includes(query));
    });
});

function translatedDay(day) {
    return translatedDays[day] || day;
}

function hasScheduleDays(course) {
    // Verificar si estamos recibiendo el objeto anidado o el objeto directo
    const courseData = course.course || course;
    if (!courseData?.course_hours_available) return false;
    
    const days = Object.keys(courseData.course_hours_available);
    return days.some(day => {
        return courseData.course_hours_available[day] && 
               courseData.course_hours_available[day].length > 0;
    });
}

function getScheduleDays(course) {
    const days = [];
    // Verificar si estamos recibiendo el objeto anidado o el objeto directo
    const courseData = course.course || course;
    const schedule = courseData?.course_hours_available || {};
    
    Object.keys(schedule).forEach(day => {
        if (schedule[day] && schedule[day].length > 0) {
            days.push(day);
        }
    });
    
    return days;
}

function hasAnySchedule(schedule) {
    return Object.keys(schedule).some(day => {
        return schedule[day] && schedule[day].length > 0;
    });
}

function selectCourse(course) {
    // Verificar si estamos recibiendo el objeto anidado o el objeto directo
    if (!course) return;
    
    selectedCourse.value = course;
    const courseData = course.course || course;
    
    selectedSchedule.value = {
        monday: courseData.course_hours_available?.monday || [],
        tuesday: courseData.course_hours_available?.tuesday || [],
        wednesday: courseData.course_hours_available?.wednesday || [],
        thursday: courseData.course_hours_available?.thursday || [],
        friday: courseData.course_hours_available?.friday || []
    };
}

function addTimeRange(day) {
    if (dayEnabled.value[day]) {
        courseHours.value[day].push({ startHour: 8, startMinute: 0, endHour: 9, endMinute: 0 });
    }
}

function removeTimeRange(day, index) {
    if (dayEnabled.value[day]) {
        courseHours.value[day].splice(index, 1);
    }
}

function deleteAllHorsFromDay(day) {
    if (!dayEnabled.value[day]) {
        courseHours.value[day] = [];
    }
}

function addEditingTimeRange(day) {
    if (editingDayEnabled.value[day]) {
        editingHours.value[day].push({ startHour: 8, startMinute: 0, endHour: 9, endMinute: 0 });
    }
}

function removeEditingTimeRange(day, index) {
    if (editingDayEnabled.value[day]) {
        editingHours.value[day].splice(index, 1);
    }
}

function toggleCreateCourse() {
    showCreateCourse.value = !showCreateCourse.value;
    if (!showCreateCourse.value) {
        resetForm();
    }
}

function toggleModal(course = null) {
    if (course?.course) {
        editingCourse.value = JSON.parse(JSON.stringify(course));
        editingHours.value = {
            monday: [],
            tuesday: [],
            wednesday: [],
            thursday: [],
            friday: []
        };
        editingDayEnabled.value = {
            monday: false,
            tuesday: false,
            wednesday: false,
            thursday: false,
            friday: false
        };

        if (course.course.course_hours_available) {
            Object.keys(editingHours.value).forEach((day) => {
                if (course.course.course_hours_available[day] && course.course.course_hours_available[day].length > 0) {
                    editingHours.value[day] = course.course.course_hours_available[day].map((hours) => {
                        try {
                            const [startTime, endTime] = hours.split('-');
                            const [startHour, startMinute] = startTime.split(':').map(Number);
                            const [endHour, endMinute] = endTime.split(':').map(Number);
                            return {
                                startHour: isNaN(startHour) ? 0 : startHour,
                                startMinute: isNaN(startMinute) ? 0 : startMinute,
                                endHour: isNaN(endHour) ? 0 : endHour,
                                endMinute: isNaN(endMinute) ? 0 : endMinute
                            };
                        } catch (error) {
                            console.error('Error al processar horari:', hours);
                            return { startHour: 0, startMinute: 0, endHour: 0, endMinute: 0 };
                        }
                    });
                    editingDayEnabled.value[day] = true;
                } else {
                    editingHours.value[day] = [];
                    editingDayEnabled.value[day] = false;
                }
            });
        }

        // Si hay un curso seleccionado, cerrar la vista de detalles
        selectedCourse.value = null;
    }
    showModal.value = !showModal.value;
}

async function getTeachersFromDepartment(departmentId) {
    if (!departmentId) return;
    teachers.value = await getAllTeachersFromDepartment(departmentId);
}

async function changeTeachers() {
    const departmentId = editingCourse.value.course.course_department_id;
    teachers.value = await getAllTeachersFromDepartment(departmentId);
}

async function callCreateCourse() {
    try {
        submitting.value = true;

        // Formatear las horas antes de enviar
        const formattedHours = {};
        for (const day in courseHours.value) {
            if (dayEnabled.value[day]) {
                formattedHours[day] = courseHours.value[day].map(range =>
                    `${range.startHour.toString().padStart(2, '0')}:${range.startMinute.toString().padStart(2, '0')}-${range.endHour.toString().padStart(2, '0')}:${range.endMinute.toString().padStart(2, '0')}`
                );
            } else {
                formattedHours[day] = [];
            }
        }

        newCourse.value.course_hours_available = formattedHours;

        await createCourse(newCourse.value);
        courses.value = await getAllCourses();
        toggleCreateCourse();
        resetForm();
    } catch (error) {
        console.error('Error al crear el curs:', error);
    } finally {
        submitting.value = false;
    }
}

function sendUpdateCourse() {
    const updatedCourse = {
        id: editingCourse.value.course.id,
        course_name: editingCourse.value.course.course_name,
        course_description: editingCourse.value.course.course_description,
        course_hours_available: {
            monday: editingHours.value.monday.map(range => `${range.startHour}:${String(range.startMinute).padStart(2, '0')}-${range.endHour}:${String(range.endMinute).padStart(2, '0')}`),
            tuesday: editingHours.value.tuesday.map(range => `${range.startHour}:${String(range.startMinute).padStart(2, '0')}-${range.endHour}:${String(range.endMinute).padStart(2, '0')}`),
            wednesday: editingHours.value.wednesday.map(range => `${range.startHour}:${String(range.startMinute).padStart(2, '0')}-${range.endHour}:${String(range.endMinute).padStart(2, '0')}`),
            thursday: editingHours.value.thursday.map(range => `${range.startHour}:${String(range.startMinute).padStart(2, '0')}-${range.endHour}:${String(range.endMinute).padStart(2, '0')}`),
            friday: editingHours.value.friday.map(range => `${range.startHour}:${String(range.startMinute).padStart(2, '0')}-${range.endHour}:${String(range.endMinute).padStart(2, '0')}`),
        },
        course_department_id: editingCourse.value.course.course_department_id,
        course_teacher_id: editingCourse.value.course.course_teacher_id,
    };

    updateCourse(editingCourse.value.course.id, updatedCourse).then(async () => {
        showModal.value = false;
        courses.value = await getAllCourses();
    });
}

function callDeleteCourse(courseId) {
    if (!courseId) return;
    
    // Buscar el curso a eliminar
    const course = courses.value.find(c => 
        (c.course?.id === courseId) || (c.id === courseId)
    );
    
    if (course) {
        courseToDelete.value = course;
        showDeleteConfirm.value = true;
    }
}

async function confirmDeleteCourse() {
    if (!courseToDelete.value?.course?.id) return;
    
    try {
        await deleteCourse(courseToDelete.value.course.id);
        // Cerrar modales
        showDeleteConfirm.value = false;
        selectedCourse.value = null;
        // Recargar lista de cursos
        courses.value = await getAllCourses();
    } catch (error) {
        console.error('Error en eliminar el curs:', error);
    }
}

function resetForm() {
    newCourse.value = {
        course_name: '',
        course_description: '',
        course_hours_available: [],
        course_department_id: null,
        course_teacher_id: null,
    };

    // Resetear horarios
    for (const day in courseHours.value) {
        courseHours.value[day] = [];
        dayEnabled.value[day] = false;
    }
}

onMounted(async () => {
    try {
        // Obtener datos
        const rawCourses = await getAllCourses() || [];
        departments.value = await getAllDepartments() || [];
        
        // Transformar datos para adaparlos al formato esperado
        courses.value = rawCourses.map(course => {
            // Si ya tiene el formato esperado, mantenerlo
            if (course && course.course) {
                return course;
            }
            // Si no, transformarlo al formato esperado
            return {
                course: course
            };
        });
        
        // Filtrar cualquier elemento nulo o indefinido
        courses.value = courses.value.filter(item => item && item.course);
    } catch (error) {
        console.error('Error al carregar dades inicials:', error);
        courses.value = [];
        departments.value = [];
    }
});
</script>

<style scoped>
.animate-fade-in {
    animation: fadeIn 0.3s ease forwards;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(5px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.pop-enter-active,
.pop-leave-active {
    transition: all 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28);
}

.pop-enter-from,
.pop-leave-to {
    opacity: 0;
    transform: scale(0.9) translateY(10px);
}

/* Barra de desplazamiento */
::-webkit-scrollbar {
    width: 8px;
    height: 8px;
}

::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 4px;
}

::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.2);
}

/* Estilos para el modal */
.modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 50;
}

.modal-content {
    background-color: white;
    padding: 24px;
    border-radius: 8px;
    width: 80%;
    max-width: 600px;
    color: black;
}

.form-group {
    margin-bottom: 16px;
}

.form-group label {
    display: block;
    margin-bottom: 8px;
    font-weight: bold;
    color: black;
}

.form-group input,
.form-group textarea,
.form-group select {
    width: 100%;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
}

.submit-button {
    background-color: #2196f3;
    color: white;
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.close-button {
    margin-top: 16px;
    background-color: #2196f3;
    color: white;
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.add-button,
.remove-button {
    margin-top: 8px;
    padding: 4px 8px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.add-button {
    background-color: #2196f3;
    color: white;
}

.remove-button {
    background-color: #f44336;
    color: white;
}

.day-group {
    margin-bottom: 16px;
}

.day-header {
    font-weight: bold;
    margin-bottom: 8px;
    color: black;
}

.day-schedule {
    margin-left: 16px;
}

.time-range {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
}

.time-label {
    margin-right: 8px;
    color: black;
}

.time-select {
    margin-right: 8px;
    padding: 4px;
    border: 1px solid #ccc;
    border-radius: 4px;
}

.time-select:focus {
    outline: none;
    border-color: #2196f3;
}
</style>