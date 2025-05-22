<template>
    <div class="animate-fade-in mt-9 mb-9">
        <!-- Capçalera -->
        <div class="mb-8 text-center">
            <h1 class="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                Benvingut/uda, {{ store.user.name }}!
            </h1>
            <p class="text-gray-300 mt-2">Panell principal de l'estudiant</p>
        </div>

        <!-- Targetes d'Accés Ràpid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <!-- Notes -->
            <router-link to="/students/grades"
                class="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-slate-700/30">
                <div class="flex items-center justify-between">
                    <div>
                        <h3 class="text-lg font-semibold text-gray-300">Notes</h3>
                        <p class="text-sm text-gray-400 mt-1">Consulta les teves qualificacions</p>
                    </div>
                    <div class="p-3 rounded-full bg-blue-500/20">
                        <svg class="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                </div>
            </router-link>

            <!-- Assistència -->
            <router-link to="/students/assistence"
                class="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-slate-700/30">
                <div class="flex items-center justify-between">
                    <div>
                        <h3 class="text-lg font-semibold text-gray-300">Assistència</h3>
                        <p class="text-sm text-gray-400 mt-1">Control d'assistència a classe</p>
                    </div>
                    <div class="p-3 rounded-full bg-purple-500/20">
                        <svg class="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                    </div>
                </div>
            </router-link>

            <!-- Incidències -->
            <router-link to="/students/incidents"
                class="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-slate-700/30">
                <div class="flex items-center justify-between">
                    <div>
                        <h3 class="text-lg font-semibold text-gray-300">Incidències</h3>
                        <p class="text-sm text-gray-400 mt-1">Gestiona les teves incidències</p>
                    </div>
                    <div class="p-3 rounded-full bg-red-500/20">
                        <svg class="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                </div>
            </router-link>

            <!-- Inscripcions -->
            <router-link to="/students/inscriptions"
                class="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-slate-700/30">
                <div class="flex items-center justify-between">
                    <div>
                        <h3 class="text-lg font-semibold text-gray-300">Inscripcions</h3>
                        <p class="text-sm text-gray-400 mt-1">Matrícula i cursos</p>
                    </div>
                    <div class="p-3 rounded-full bg-green-500/20">
                        <svg class="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                </div>
            </router-link>
        </div>

        <!-- Horari -->
        <div class="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 shadow-lg mb-8">
            <div class="flex justify-between items-center mb-4">
                <h2 class="text-xl font-semibold text-gray-300">El teu horari</h2>
                <router-link to="/students/inscriptions"
                    class="text-sm text-blue-400 hover:text-blue-300 transition-colors">
                    Veure els meus cursos
                </router-link>
            </div>

            <div v-if="loading" class="flex justify-center py-8">
                <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-400"></div>
            </div>

            <div v-else-if="error" class="text-center py-6 text-red-400">
                {{ error }}
            </div>

            <div v-else-if="schedule.length === 0" class="text-center py-6 text-gray-400">
                No hi ha horari disponible. Comprova les teves inscripcions.
            </div>

            <div v-else class="overflow-x-auto">
                <table class="w-full text-sm text-left text-gray-400">
                    <thead class="text-xs text-gray-300 border-b border-slate-700">
                        <tr>
                            <th class="px-4 py-3">Hora</th>
                            <th class="px-4 py-3">Dilluns</th>
                            <th class="px-4 py-3">Dimarts</th>
                            <th class="px-4 py-3">Dimecres</th>
                            <th class="px-4 py-3">Dijous</th>
                            <th class="px-4 py-3">Divendres</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(timeSlot, index) in schedule" :key="index"
                            class="border-b border-slate-700 hover:bg-slate-700/30">
                            <td class="px-4 py-3 font-medium">{{ timeSlot.time }}</td>
                            <td v-for="(day, dayIndex) in ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']"
                                :key="dayIndex" class="px-4 py-3">
                                <div v-if="timeSlot[day]" class="flex items-center">
                                    <span class="w-2 h-2 rounded-full mr-2" :class="{ 'bg-blue-400': true }"></span>
                                    {{ timeSlot[day].subject }}
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Tasques Pendents -->
        <div class="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 shadow-lg">
            <div class="flex justify-between items-center mb-4">
                <h2 class="text-xl font-semibold text-gray-300">Tasques pendents</h2>
                <router-link to="/students/grades" class="text-sm text-blue-400 hover:text-blue-300 transition-colors">
                    Veure totes
                </router-link>
            </div>

            <div v-if="loadingTasks" class="flex justify-center py-8">
                <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-400"></div>
            </div>

            <div v-else-if="errorTasks" class="text-center py-6 text-red-400">
                {{ errorTasks }}
            </div>

            <div v-else class="space-y-3">
                <div v-for="task in pendingTasks" :key="task.id"
                    class="flex items-center p-3 hover:bg-slate-700/30 rounded-lg transition-colors">
                    <input type="checkbox"
                        class="w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 rounded focus:ring-blue-500">
                    <div class="ml-3 flex-1">
                        <div class="flex items-center justify-between">
                            <p class="font-medium">{{ task.task_name }}</p>
                            <span class="text-xs px-2 py-1 rounded-full bg-blue-500/20 text-blue-400">
                                Pendent
                            </span>
                        </div>
                        <p class="text-sm text-gray-400 mt-1">{{ task.course_name }} · {{
                            formatDate(task.task_created_at) }}</p>
                        <p v-if="task.task_description" class="text-sm text-gray-400 mt-1 line-clamp-2">
                            {{ task.task_description }}
                        </p>
                    </div>
                </div>

                <div v-if="pendingTasks.length === 0" class="text-center py-4 text-gray-400">
                    No tens tasques pendents!
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAppStore } from '@/stores/index.js';
import { getCoursesWithUser, getHoursOfCourse } from '@/services/communicationsScripts/mainManager.js';
import { getTasksFromCourse } from '@/services/communicationsScripts/gradesComManager.js';

const store = useAppStore();
const userId = store.user.id;

// Variables para horario
const schedule = ref([]);
const loading = ref(true);
const error = ref(null);

// Variables para tareas
const pendingTasks = ref([]);
const loadingTasks = ref(true);
const errorTasks = ref(null);

// Función para formatear fechas
const formatDate = (dateString) => {
    if (!dateString) return 'Data no disponible';
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
};

// Crear horario basado en los cursos
const createScheduleFromCourses = async (courses) => {
    try {
        const timeSlots = [
            '08:00 - 09:00',
            '09:00 - 10:00',
            '10:00 - 11:00',
            '11:00 - 12:00',
            '12:00 - 13:00',
            '13:00 - 14:00',
            '14:00 - 15:00',
            '15:00 - 16:00'
        ];

        const scheduleTemplate = timeSlots.map(time => ({
            time,
            monday: null,
            tuesday: null,
            wednesday: null,
            thursday: null,
            friday: null
        }));

        for (const course of courses) {
            const courseId = course.course_id;
            const courseName = course.course_name || 'Assignatura';

            try {
                // Obtener detalles del curso
                const courseDetails = await getHoursOfCourse(courseId);

                // Si no hay detalles, continuar con el siguiente curso
                if (!courseDetails) continue;

                // Procesamiento directo de los datos tal como vienen de la API
                // Esto maneja el formato específico que está llegando
                processCourseHours(courseDetails, scheduleTemplate, courseName);

            } catch (err) {
                console.error(`Error al procesar horario del curso ${courseId}:`, err);
            }
        }


        // Devolver solo los slots que tienen al menos una clase asignada
        return scheduleTemplate.filter(slot =>
            slot.monday || slot.tuesday || slot.wednesday || slot.thursday || slot.friday
        );
    } catch (err) {
        console.error('Error al crear horario:', err);
        throw err;
    }
};

// Nueva función para procesar los horarios tal como vienen de la API
const processCourseHours = (courseDetails, scheduleTemplate, courseName) => {
    // Procesar los días de la semana directamente
    processDay('monday', courseDetails.monday, scheduleTemplate, courseName);
    processDay('tuesday', courseDetails.tuesday, scheduleTemplate, courseName);
    processDay('wednesday', courseDetails.wednesday, scheduleTemplate, courseName);
    processDay('thursday', courseDetails.thursday, scheduleTemplate, courseName);
    processDay('friday', courseDetails.friday, scheduleTemplate, courseName);

    // Tratar el caso especial de 'wednesday' (error ortográfico en la BD)
    if (courseDetails.wednesday) {
        processDay('wednesday', courseDetails.wednesday, scheduleTemplate, courseName);
    }
};

// Función para procesar un día específico
const processDay = (day, slots, scheduleTemplate, courseName) => {
    if (!slots || !Array.isArray(slots)) return;

    slots.forEach(timeRange => {
        // Ejemplo: "09:00-10:00" o "9:00-10:00"
        const times = timeRange.split('-');
        if (times.length !== 2) return;

        let startTime = times[0].trim();

        // Agregar un cero a la hora si es necesario (9:00 -> 09:00)
        if (startTime.length === 4) {
            startTime = "0" + startTime;
        }

        // Buscar slots de tiempo que correspondan
        scheduleTemplate.forEach(slot => {
            const slotTimes = slot.time.split(' - ');
            const slotStart = slotTimes[0];

            if (slotStart === startTime) {
                slot[day] = {
                    subject: courseName,
                    type: 'class'
                };
            }
        });
    });
};

// Inicializar datos al cargar el componente
onMounted(async () => {
    try {
        // 1. Obtener cursos del usuario
        loading.value = true;
        const userCoursesResponse = await getCoursesWithUser(userId);

        if (userCoursesResponse?.error) {
            error.value = userCoursesResponse.error;
            return;
        }

        const userCourses = userCoursesResponse || [];

        if (userCourses.length > 0) {


            // 2. Crear horario basado en los cursos
            schedule.value = await createScheduleFromCourses(userCourses);

            // 3. Obtener tareas de los cursos
            loadingTasks.value = true;
            const allTasks = [];

            for (const course of userCourses) {
                try {
                    const courseId = course.course_id;
                    const tasks = await getTasksFromCourse(courseId);

                    if (Array.isArray(tasks)) {
                        tasks.forEach(task => {
                            allTasks.push({
                                ...task,
                                course_name: course.course_name || 'Assignatura'
                            });
                        });
                    }
                } catch (err) {
                    console.error(`Error al obtener tareas del curso ${course.course_id}:`, err);
                }
            }

            // Filtrar tareas no completadas
            pendingTasks.value = allTasks
                .filter(task => !task.task_ended)
                .slice(0, 5); // Mostrar máximo 5 tareas pendientes

        }
    } catch (err) {
        console.error('Error al inicializar datos:', err);
        error.value = 'Error al cargar les dades. Si us plau, intenta-ho més tard.';
    } finally {
        loading.value = false;
        loadingTasks.value = false;
    }
});
</script>

<style>
    .line-clamp-2 {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }
</style>