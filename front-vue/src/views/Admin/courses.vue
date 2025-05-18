<template>
    <div class="min-h-screen py-8 px-4 sm:px-6">
        <div
            class="max-w-6xl mx-auto bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-slate-700/50">
            <!-- Capçalera -->
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

            <!-- Contingut -->
            <div class="p-6">
                <!-- Filtres i cerca -->
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

                <!-- Llistat de cursos -->
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

                <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div v-for="course in filteredCourses" :key="course.id"
                        class="bg-slate-800/30 rounded-xl border border-slate-700/50 hover:border-slate-600 transition-colors overflow-hidden animate-fade-in">
                        <courseCardAdmin :course="course" />
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal per crear/editar curs -->
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

                                <!-- Selector de dies amb pestanyes -->
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

                                <!-- Contingut de la pestanya activa -->
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
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { getAllCourses, createCourse, getAllDepartments, getAllTeachersFromDepartment } from '@/services/communicationsScripts/mainManager.js';
import courseCardAdmin from '@/components/Courses/courseCardAdmin.vue';

const route = useRoute();
const departments = ref([]);
const teachers = ref([]);
const courses = ref([]);
const showCreateCourse = ref(false);
const activeDay = ref('monday');
const submitting = ref(false);
const searchQuery = ref('');
const filterBy = ref('all');

const newCourse = ref({
    course_name: '',
    course_description: '',
    course_hours_available: [],
    course_department_id: null,
    course_teacher_id: null,
});

const courseHours = ref({
    monday: [{ startHour: 8, startMinute: 0, endHour: 9, endMinute: 0 }],
    tuesday: [{ startHour: 8, startMinute: 0, endHour: 9, endMinute: 0 }],
    wednesday: [{ startHour: 8, startMinute: 0, endHour: 9, endMinute: 0 }],
    thursday: [{ startHour: 8, startMinute: 0, endHour: 9, endMinute: 0 }],
    friday: [{ startHour: 8, startMinute: 0, endHour: 9, endMinute: 0 }],
    saturday: [{ startHour: 8, startMinute: 0, endHour: 9, endMinute: 0 }],
    sunday: [{ startHour: 8, startMinute: 0, endHour: 9, endMinute: 0 }],
});

const dayEnabled = ref({
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
    sunday: false,
});

const translatedDays = {
    monday: 'Dilluns',
    tuesday: 'Dimarts',
    wednesday: 'Dimecres',
    thursday: 'Dijous',
    friday: 'Divendres',
    saturday: 'Dissabte',
    sunday: 'Diumenge',
};

// Filtrem els cursos segons la cerca
const filteredCourses = computed(() => {
    if (!searchQuery.value) return courses.value;

    const query = searchQuery.value.toLowerCase();
    return courses.value.filter(course =>
        course.course_name.toLowerCase().includes(query) ||
        course.course_description.toLowerCase().includes(query)
    );
});

function translatedDay(day) {
    return translatedDays[day] || day;
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

function toggleCreateCourse() {
    showCreateCourse.value = !showCreateCourse.value;
    if (!showCreateCourse.value) {
        resetForm();
    }
}

async function getTeachersFromDepartment(departmentId) {
    teachers.value = await getAllTeachersFromDepartment(departmentId);
}

async function callCreateCourse() {
    try {
        submitting.value = true;

        // Formatem les hores abans d'enviar
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

function resetForm() {
    newCourse.value = {
        course_name: '',
        course_description: '',
        course_hours_available: [],
        course_department_id: null,
        course_teacher_id: null,
    };

    // Resetem els horaris
    for (const day in courseHours.value) {
        courseHours.value[day] = [{ startHour: 8, startMinute: 0, endHour: 9, endMinute: 0 }];
        dayEnabled.value[day] = false;
    }
}

onMounted(async () => {
    courses.value = await getAllCourses();
    departments.value = await getAllDepartments();
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

/* Barra de desplaçament */
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
</style>