<template>
    <div class="animate-fade-in mt-9 mb-9">
        <!-- Encabezado -->
        <div class="mb-8 text-center">
            <h1 class="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                Panel de Administración
            </h1>
            <p class="text-gray-300 mt-2">Bienvenido al centro de control de la plataforma</p>
        </div>

        <!-- Tarjetas de Resumen -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <!-- Usuarios -->
            <div
                class="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div class="flex items-center justify-between">
                    <div>
                        <h3 class="text-lg font-semibold text-gray-300">Usuarios</h3>
                        <p class="text-3xl font-bold mt-2">{{ userStats.total || 0 }}</p>
                        <p class="text-sm text-gray-400 mt-1">+{{ userStats.registeredToday || 0 }} nuevos hoy</p>
                    </div>
                    <div class="p-3 rounded-full bg-blue-500/20">
                        <svg class="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>
                </div>
                <router-link to="/admin/config-users"
                    class="mt-4 inline-flex items-center text-sm text-blue-400 hover:text-blue-300 transition-colors">
                    Gestionar usuarios
                    <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                </router-link>
            </div>

            <!-- Aulas -->
            <div
                class="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div class="flex items-center justify-between">
                    <div>
                        <h3 class="text-lg font-semibold text-gray-300">Aulas</h3>
                        <p class="text-3xl font-bold mt-2">{{ roomStats.total || 0 }}</p>
                        <p class="text-sm text-gray-400 mt-1">{{ roomStats.maintenance || 0 }} en mantenimiento</p>
                    </div>
                    <div class="p-3 rounded-full bg-purple-500/20">
                        <svg class="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                    </div>
                </div>
                <router-link to="/admin/config-rooms"
                    class="mt-4 inline-flex items-center text-sm text-purple-400 hover:text-purple-300 transition-colors">
                    Gestionar aulas
                    <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                </router-link>
            </div>

            <!-- Incidencias -->
            <div
                class="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div class="flex items-center justify-between">
                    <div>
                        <h3 class="text-lg font-semibold text-gray-300">Incidencias</h3>
                        <p class="text-3xl font-bold mt-2">{{ reportStats.total || 0 }}</p>
                        <p class="text-sm text-gray-400 mt-1">{{ reportStats.pending || 0 }} sin resolver</p>
                    </div>
                    <div class="p-3 rounded-full bg-red-500/20">
                        <svg class="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                </div>
                <router-link to="/admin/config-incidents"
                    class="mt-4 inline-flex items-center text-sm text-red-400 hover:text-red-300 transition-colors">
                    Ver incidencias
                    <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                </router-link>
            </div>

            <!-- Objetos Perdidos -->
            <div
                class="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div class="flex items-center justify-between">
                    <div>
                        <h3 class="text-lg font-semibold text-gray-300">Objetos Perdidos</h3>
                        <p class="text-3xl font-bold mt-2">{{ lostObjectStats.total || 0 }}</p>
                        <p class="text-sm text-gray-400 mt-1">{{ lostObjectStats.reportedToday || 0 }} nuevos hoy</p>
                    </div>
                    <div class="p-3 rounded-full bg-yellow-500/20">
                        <svg class="w-8 h-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                        </svg>
                    </div>
                </div>
                <router-link to="/admin/config-lost-objects"
                    class="mt-4 inline-flex items-center text-sm text-yellow-400 hover:text-yellow-300 transition-colors">
                    Ver objetos
                    <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                </router-link>
            </div>

            <!-- Servicios -->
            <div
                class="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div class="flex items-center justify-between">
                    <div>
                        <h3 class="text-lg font-semibold text-gray-300">Servicios</h3>
                        <p class="text-3xl font-bold mt-2">{{ serviceStats.total || 0 }}</p>
                        <p class="text-sm text-gray-400 mt-1">
                            <span v-if="serviceStats.allRunning" class="text-green-400">Todos operativos</span>
                            <span v-else>{{ serviceStats.running || 0 }} operativos</span>
                        </p>
                    </div>
                    <div class="p-3 rounded-full"
                        :class="serviceStats.allRunning ? 'bg-green-500/20' : 'bg-yellow-500/20'">
                        <svg class="w-8 h-8" :class="serviceStats.allRunning ? 'text-green-400' : 'text-yellow-400'"
                            fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                </div>
                <router-link to="/admin/config-servers"
                    class="mt-4 inline-flex items-center text-sm text-green-400 hover:text-green-300 transition-colors">
                    Ver servicios
                    <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                </router-link>
            </div>

            <!-- Cursos -->
            <div
                class="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div class="flex items-center justify-between">
                    <div>
                        <h3 class="text-lg font-semibold text-gray-300">Cursos</h3>
                        <p class="text-3xl font-bold mt-2">{{ courseStats.total || 0 }}</p>
                        <p class="text-sm text-gray-400 mt-1">{{ courseStats.createdThisMonth || 0 }} nuevos este mes
                        </p>
                    </div>
                    <div class="p-3 rounded-full bg-indigo-500/20">
                        <svg class="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7m-6 4h4m-4 4h4m-4 4h4m-8-8h4m-4 4h4m-4 4h4" />
                        </svg>
                    </div>
                </div>
                <router-link to="/admin/config-courses"
                    class="mt-4 inline-flex items-center text-sm text-indigo-400 hover:text-indigo-300 transition-colors">
                    Gestionar cursos
                    <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                </router-link>
            </div>
        </div>

        <!-- Sección de Actividad Reciente -->
        <div class="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 shadow-lg mb-8">
            <div class="flex justify-between items-center mb-4">
                <h2 class="text-xl font-semibold text-gray-300">Actividad Reciente</h2>
                <button @click="loadActivities" class="text-sm text-blue-400 hover:text-blue-300 transition-colors">
                    Actualizar
                </button>
            </div>

            <div v-if="isLoadingActivities" class="flex justify-center py-4">
                <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-400"></div>
            </div>

            <div v-else-if="activities.length === 0" class="text-center py-4 text-gray-400">
                No hay actividades recientes
            </div>

            <div v-else class="space-y-4">
                <!-- Actividad de usuario -->
                <div v-for="(activity, index) in activities" :key="index"
                    class="flex items-start p-3 hover:bg-slate-700/30 rounded-lg transition-colors">
                    <!-- Icono según tipo de actividad -->
                    <div class="p-2 rounded-lg mr-3" :class="getActivityIconClass(activity.type).bgColor">
                        <svg class="w-5 h-5" :class="getActivityIconClass(activity.type).textColor" fill="none"
                            stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                :d="getActivityIconClass(activity.type).icon" />
                        </svg>
                    </div>
                    <div class="flex-1">
                        <p class="font-medium">{{ getActivityTitle(activity) }}</p>
                        <p class="text-sm text-gray-400">{{ getActivityDescription(activity) }}</p>
                    </div>
                    <span class="text-xs text-gray-500">{{ formatTimeAgo(activity.data.createdAt) }}</span>
                </div>
            </div>
        </div>

        <!-- Acciones Rápidas -->
        <div class="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 shadow-lg">
            <h2 class="text-xl font-semibold text-gray-300 mb-4">Acciones Rápidas</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <router-link to="/admin/config-users?action=new"
                    class="flex items-center justify-center p-4 bg-blue-500/10 hover:bg-blue-500/20 rounded-lg transition-colors">
                    <svg class="w-5 h-5 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                    <span>Nuevo Usuario</span>
                </router-link>

                <router-link to="/admin/new-room"
                    class="flex items-center justify-center p-4 bg-purple-500/10 hover:bg-purple-500/20 rounded-lg transition-colors">
                    <svg class="w-5 h-5 mr-2 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                    <span>Nueva Aula</span>
                </router-link>

                <router-link to="/admin/config-courses?action=new"
                    class="flex items-center justify-center p-4 bg-green-500/10 hover:bg-green-500/20 rounded-lg transition-colors">
                    <svg class="w-5 h-5 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                    <span>Nuevo Curso</span>
                </router-link>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { countUsers, getLatestActivities } from '@/services/communicationsScripts/mainManager.js';
import { getRoomsStats } from '@/services/communicationsScripts/roomsManager.js';
import { getReportStats } from '@/services/communicationsScripts/incidentsManager.js';
import { getLostObjectStats } from '@/services/communicationsScripts/lostObjectsManager.js';
import { getCourseStats } from '@/services/communicationsScripts/gradesComManager.js';
import { getAllServices } from '@/services/communicationsScripts/servicesManager.js';

// Definir variables reactivas para almacenar las estadísticas
const userStats = ref({ total: 0, registeredToday: 0 });
const roomStats = ref({ total: 0, available: 0, maintenance: 0 });
const reportStats = ref({ total: 0, pending: 0, resolved: 0 });
const lostObjectStats = ref({ total: 0, reportedToday: 0 });
const courseStats = ref({ total: 0, createdThisMonth: 0 });
const serviceStats = ref({ total: 0, running: 0, allRunning: true });

// Variables para actividades recientes
const activities = ref([]);
const isLoadingActivities = ref(false);

// Función para cargar estadísticas y actividades recientes
const loadAllStats = async () => {
    try {
        // Cargar estadísticas de usuarios
        userStats.value = await countUsers();

        // Cargar estadísticas de aulas
        roomStats.value = await getRoomsStats();

        // Cargar estadísticas de incidencias
        reportStats.value = await getReportStats();

        // Cargar estadísticas de objetos perdidos
        lostObjectStats.value = await getLostObjectStats();

        // Cargar estadísticas de cursos
        courseStats.value = await getCourseStats();

        // Cargar estadísticas de servicios
        const services = await getAllServices();
        const serviceNames = Object.keys(services);
        const totalServices = serviceNames.length;
        const runningServices = serviceNames.filter(name => services[name].state === "running").length;

        serviceStats.value = {
            total: totalServices,
            running: runningServices,
            allRunning: runningServices === totalServices
        };

        // Cargar actividades recientes
        await loadActivities();
    } catch (error) {
        console.error("Error loading stats:", error);
    }
};

// Función para cargar actividades recientes con mejor manejo de errores
const loadActivities = async () => {
    isLoadingActivities.value = true;
    try {
        console.log("Solicitando actividades recientes...");
        const result = await getLatestActivities();
        
        if (Array.isArray(result) && result.length > 0) {
            console.log(`Actividades recibidas: ${result.length}`, result);
            activities.value = result;
        } else {
            console.log("No se recibieron actividades o formato incorrecto:", result);
            activities.value = [];
        }
    } catch (error) {
        console.error("Error al cargar actividades:", error);
        activities.value = [];
    } finally {
        isLoadingActivities.value = false;
    }
};

// Formatear tiempo transcurrido con manejo de errores
const formatTimeAgo = (dateString) => {
    try {
        if (!dateString) return 'Fecha desconocida';
        
        const now = new Date();
        const date = new Date(dateString);
        
        // Verificar que la fecha sea válida
        if (isNaN(date.getTime())) return 'Fecha inválida';
        
        const diffMs = now - date;
        if (diffMs < 0) return 'Fecha futura';
        
        const diffMins = Math.round(diffMs / 60000);
        
        if (diffMins < 1) return 'Justo ahora';
        if (diffMins < 60) return `Hace ${diffMins} min`;
        
        const diffHours = Math.floor(diffMins / 60);
        if (diffHours < 24) return `Hace ${diffHours} hora${diffHours > 1 ? 's' : ''}`;
        
        const diffDays = Math.floor(diffHours / 24);
        return `Hace ${diffDays} día${diffDays > 1 ? 's' : ''}`;
    } catch (error) {
        console.error("Error al formatear fecha:", error);
        return "Fecha desconocida";
    }
};

// Obtener clase de icono según tipo de actividad
const getActivityIconClass = (type) => {
    switch (type) {
        case 'user':
            return {
                bgColor: 'bg-blue-500/10',
                textColor: 'text-blue-400',
                icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
            };
        case 'report':
            return {
                bgColor: 'bg-red-500/10',
                textColor: 'text-red-400',
                icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
            };
        case 'lostObject':
            return {
                bgColor: 'bg-yellow-500/10',
                textColor: 'text-yellow-400',
                icon: 'M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z'
            };
        case 'course':
            return {
                bgColor: 'bg-indigo-500/10',
                textColor: 'text-indigo-400',
                icon: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7m-6 4h4m-4 4h4m-4 4h4m-8-8h4m-4 4h4m-4 4h4'
            };
        case 'roomReservation':
            return {
                bgColor: 'bg-purple-500/10',
                textColor: 'text-purple-400',
                icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
            };
        case 'task':
            return {
                bgColor: 'bg-green-500/10',
                textColor: 'text-green-400',
                icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2'
            };
        default:
            return {
                bgColor: 'bg-gray-500/10',
                textColor: 'text-gray-400',
                icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
            };
    }
};

// Obtener título según tipo de actividad
const getActivityTitle = (activity) => {
    switch (activity.type) {
        case 'user':
            return 'Nuevo usuario registrado';
        case 'report':
            return 'Nueva incidencia reportada';
        case 'lostObject':
            return 'Objeto perdido registrado';
        case 'course':
            return 'Nuevo curso creado';
        case 'roomReservation':
            return 'Nueva reserva de aula';
        case 'task':
            return 'Nueva tarea creada';
        default:
            return 'Nueva actividad';
    }
};

// Obtener descripción según tipo de actividad con manejo de errores
const getActivityDescription = (activity) => {
    try {
        if (!activity || !activity.data) {
            return 'Información no disponible';
        }
        
        switch (activity.type) {
            case 'user':
                return `${activity.data.name || 'Usuario'} se ha registrado como ${activity.data.typeusers?.name || 'usuario'}`;
            case 'report':
                const reportText = activity.data.report || 'Incidencia';
                const shortReport = reportText.substring(0, 30) + (reportText.length > 30 ? '...' : '');
                return `${shortReport} en ${activity.data.Room?.room_name || 'un aula'}`;
            case 'lostObject':
                return `${activity.data.title || 'Objeto'} - ${activity.data.description?.substring(0, 20) || 'sin descripción'}${activity.data.description?.length > 20 ? '...' : ''}`;
            case 'course':
                return `${activity.data.course_name || 'Curso'} (${activity.data.course_description?.substring(0, 20) || 'sin descripción'}${activity.data.course_description?.length > 20 ? '...' : ''})`;
            case 'roomReservation':
                const roomName = activity.data.Room?.room_name || `ID: ${activity.data.room_id || '?'}`;
                return `Reserva para ${roomName} por ${activity.data.User?.name || 'un usuario'}`;
            case 'task':
                return `${activity.data.task_name || 'Tarea'} en curso ${activity.data.Course?.course_name || ''}`;
            default:
                return 'Se ha registrado una nueva actividad';
        }
    } catch (error) {
        console.error("Error generando descripción:", error);
        return "Información no disponible";
    }
};

// Cargar los datos cuando el componente se monte
onMounted(() => {
    loadAllStats();
});
</script>