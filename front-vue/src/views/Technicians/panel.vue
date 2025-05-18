<template>
    <div class="bg-slate-900/10 backdrop-blur-sm rounded-xl p-6 shadow-2xl animate-fade-in">
        <!-- Capçalera -->
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <h2 class="text-2xl font-bold text-white mb-4 md:mb-0">
                <span class="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                    Panell del Tècnic
                </span>
            </h2>
            
            <div class="flex items-center space-x-4">
                <div class="text-right">
                    <p class="text-gray-300 text-sm">Benvingut/da</p>
                    <p class="text-white font-medium">{{ store.user.name || store.user.nom || 'Tècnic' }}</p>
                </div>
                <div class="h-10 w-10 rounded-full bg-slate-700 flex items-center justify-center overflow-hidden">
                    <img v-if="userProfileImage" :src="userProfileImage" alt="Perfil" class="h-full w-full object-cover" />
                    <svg v-else class="h-6 w-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                </div>
            </div>
        </div>

        <!-- Estadístiques Ràpides -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div class="bg-slate-800/50 rounded-lg p-4 border-l-4 border-blue-500">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-gray-400 text-sm">Incidències Actives</p>
                        <p class="text-2xl font-bold text-white">{{ activeIncidents }}</p>
                    </div>
                    <div class="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                        <svg class="h-5 w-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                </div>
                <p class="text-xs text-gray-400 mt-2">+{{ todayIncidents }} avui</p>
            </div>

            <div class="bg-slate-800/50 rounded-lg p-4 border-l-4 border-green-500">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-gray-400 text-sm">Solucions Registrades</p>
                        <p class="text-2xl font-bold text-white">{{ registeredSolutions }}</p>
                    </div>
                    <div class="h-10 w-10 rounded-full bg-green-500/20 flex items-center justify-center">
                        <svg class="h-5 w-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                    </div>
                </div>
                <p class="text-xs text-gray-400 mt-2">+{{ thisWeekSolutions }} aquesta setmana</p>
            </div>

            <div class="bg-slate-800/50 rounded-lg p-4 border-l-4 border-purple-500">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-gray-400 text-sm">Assignacions Pendents</p>
                        <p class="text-2xl font-bold text-white">{{ pendingAssignments }}</p>
                    </div>
                    <div class="h-10 w-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                        <svg class="h-5 w-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                    </div>
                </div>
                <p class="text-xs text-gray-400 mt-2">{{ urgentCount }} urgent{{ urgentCount !== 1 ? 's' : '' }}</p>
            </div>
        </div>

        <!-- Incidències Recents -->
        <div class="bg-slate-800/50 rounded-xl p-6 mb-8">
            <div class="flex justify-between items-center mb-6">
                <h3 class="text-lg font-semibold text-white">Incidències Recents</h3>
                <router-link to="/technicians/incidents" class="text-blue-400 hover:text-blue-300 text-sm flex items-center">
                    Veure totes
                    <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                </router-link>
            </div>

            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead>
                        <tr class="text-gray-400 text-left border-b border-gray-700">
                            <th class="pb-3 px-4">ID</th>
                            <th class="pb-3 px-4">Descripció</th>
                            <th class="pb-3 px-4">Estat</th>
                            <th class="pb-3 px-4">Data</th>
                            <th class="pb-3 px-4 text-right">Accions</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-700">
                        <tr v-for="incident in recentIncidents" :key="incident.id" class="hover:bg-slate-700/50 transition-colors">
                            <td class="py-4 px-4 text-gray-300">#{{ incident.id }}</td>
                            <td class="py-4 px-4 text-white font-medium">{{ incident.description }}</td>
                            <td class="py-4 px-4">
                                <span :class="`px-2 py-1 rounded-full text-xs ${getStatusClass(incident.status)}`">
                                    {{ incident.status }}
                                </span>
                            </td>
                            <td class="py-4 px-4 text-gray-400">{{ incident.date }}</td>
                            <td class="py-4 px-4 text-right">
                                <button @click="viewIncident(incident.id)" class="text-blue-400 hover:text-blue-300 p-1">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Assignacions i Solucions -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <!-- Assignacions Urgents -->
            <div class="bg-slate-800/50 rounded-xl p-6">
                <div class="flex justify-between items-center mb-6">
                    <h3 class="text-lg font-semibold text-white">Assignacions Urgents</h3>
                    <router-link to="/technicians/assignations" class="text-blue-400 hover:text-blue-300 text-sm flex items-center">
                        Veure totes
                        <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                        </svg>
                    </router-link>
                </div>

                <div v-if="loading" class="text-center py-4 text-gray-500">
                    <p>Carregant assignacions...</p>
                </div>

                <div v-else class="space-y-4">
                    <div v-for="assignment in urgentAssignments" :key="assignment.id" class="bg-slate-700/30 rounded-lg p-4 border-l-4 border-red-500">
                        <div class="flex justify-between items-start">
                            <div>
                                <h4 class="text-white font-medium mb-1">{{ assignment.title }}</h4>
                                <p class="text-gray-400 text-sm mb-2">{{ assignment.description }}</p>
                                <div class="flex flex-wrap gap-2 text-xs text-gray-500">
                                    <span>
                                        <svg class="w-3 h-3 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Data: {{ assignment.deadline }}
                                    </span>
                                    <span v-if="assignment.room">
                                        <svg class="w-3 h-3 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                        Aula: {{ assignment.room }}
                                    </span>
                                </div>
                            </div>
                            <button @click="viewAssignment(assignment.id)" class="text-blue-400 hover:text-blue-300 p-1">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <div v-if="urgentAssignments.length === 0" class="text-center py-6 text-gray-500">
                        No tens assignacions pendents
                    </div>
                </div>
            </div>

            <!-- Solucions Recents -->
            <div class="bg-slate-800/50 rounded-xl p-6">
                <div class="flex justify-between items-center mb-6">
                    <h3 class="text-lg font-semibold text-white">Les meves Solucions</h3>
                    <router-link to="/technicians/solutions" class="text-blue-400 hover:text-blue-300 text-sm flex items-center">
                        Veure totes
                        <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                        </svg>
                    </router-link>
                </div>

                <div class="space-y-4">
                    <div v-for="solution in mySolutions" :key="solution.id" class="bg-slate-700/30 rounded-lg p-4 border-l-4 border-green-500">
                        <div class="flex justify-between items-start">
                            <div>
                                <h4 class="text-white font-medium mb-1">{{ solution.title }}</h4>
                                <p class="text-gray-400 text-sm line-clamp-2">{{ solution.description }}</p>
                                <div class="flex items-center mt-2 space-x-3 text-xs">
                                    <span class="text-gray-500">
                                        <svg class="w-3 h-3 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        {{ solution.date }}
                                    </span>
                                    <span class="text-gray-500">
                                        <svg class="w-3 h-3 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        {{ solution.timeSpent }}
                                    </span>
                                </div>
                            </div>
                            <button @click="viewSolution(solution.id)" class="text-blue-400 hover:text-blue-300 p-1">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <div v-if="mySolutions.length === 0" class="text-center py-6 text-gray-500">
                        Encara no has registrat cap solució
                    </div>
                </div>
            </div>
        </div>

        <!-- Accions Ràpides -->
        <div class="mt-8 bg-slate-800/50 rounded-xl p-6">
            <h3 class="text-lg font-semibold text-white mb-6">Accions Ràpides</h3>
            
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <router-link to="/technicians/incidents" class="bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 rounded-lg p-4 flex flex-col items-center text-center transition-colors">
                    <div class="h-12 w-12 rounded-full bg-blue-500/20 flex items-center justify-center mb-3">
                        <svg class="h-6 w-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <span class="text-white font-medium">Nova Incidència</span>
                    <span class="text-gray-400 text-xs mt-1">Registra un nou problema</span>
                </router-link>

                <router-link to="/technicians/solutions" class="bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 rounded-lg p-4 flex flex-col items-center text-center transition-colors">
                    <div class="h-12 w-12 rounded-full bg-green-500/20 flex items-center justify-center mb-3">
                        <svg class="h-6 w-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                    </div>
                    <span class="text-white font-medium">Nova Solució</span>
                    <span class="text-gray-400 text-xs mt-1">Comparteix una solució</span>
                </router-link>

                <router-link to="/technicians/lost-objects" class="bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-lg p-4 flex flex-col items-center text-center transition-colors">
                    <div class="h-12 w-12 rounded-full bg-amber-500/20 flex items-center justify-center mb-3">
                        <svg class="h-6 w-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                        </svg>
                    </div>
                    <span class="text-white font-medium">Objecte Perdut</span>
                    <span class="text-gray-400 text-xs mt-1">Registra un objecte</span>
                </router-link>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAppStore } from '@/stores/index.js';
import { getAllReports } from "@/services/communicationsScripts/incidentsManager";

const store = useAppStore();
const router = useRouter();

const recentIncidents = ref([]);
const urgentAssignments = ref([]);
const allReports = ref([]);
const loading = ref(true);
const mySolutions = ref([]);

// URL de la imagen de perfil del usuario
const userProfileImage = computed(() => {
    // Si el usuario tiene una imagen de perfil en el store, úsala
    if (store.user.profile) {
        return store.user.profile;
    }
    
    // Otras propiedades possibles donde podría estar la URL de la imagen
    if (store.user.profileImage) {
        return store.user.profileImage;
    }
    
    if (store.user.avatar) {
        return store.user.avatar;
    }
    
    // Si el usuario tiene un correo, intentamos usar una imagen predeterminada basada en el ID
    if (store.user.id) {
        const baseUrl = import.meta.env.VITE_IMAGE_URL || 'https://i.pravatar.cc';
        return `${baseUrl}/${store.user.id}`;
    }
    
    // Si no hay imagen, retornamos null y se mostrará el icono por defecto
    return null;
});

const fetchAssignments = async () => {
    try {
        loading.value = true;
        allReports.value = await getAllReports();
        
        // Filtrar les incidències assignades al usuario actual
        const myAssignedReports = allReports.value.filter(report => 
            report.user_assigned === store.user.id && report.status !== 'revised'
        );
        
        // Preparar els dades per mostrar en urgentAssignments
        urgentAssignments.value = myAssignedReports.map(report => ({
            id: report.id,
            title: `Incidència #${report.id}`,
            description: report.report || "Sense descripció",
            deadline: report.created_at ? new Date(report.created_at).toLocaleDateString() : "Sense data",
            room: report.Room?.room_name || "Desconeguda"
        }));
        
        // Actualitzar les incidències recents
        recentIncidents.value = allReports.value
            .slice(0, 4)
            .map(report => ({
                id: report.id,
                description: report.report || "Sense descripció",
                status: report.status === 'pending' ? 'Pendent' : 
                       report.status === 'revising' ? 'En progrés' : 'Resolt',
                date: report.created_at ? new Date(report.created_at).toLocaleDateString() : "Sense data"
            }));
        
        // Afegir les incidències resoltes pel tècnic actual
        const myResolvedReports = allReports.value.filter(report => 
            report.user_assigned === store.user.id && report.status === 'revised'
        );
        
        mySolutions.value = myResolvedReports.map(report => ({
            id: report.id,
            title: `Incidència #${report.id}`,
            description: report.note || report.report || "Sense descripció",
            date: report.updated_at ? new Date(report.updated_at).toLocaleDateString() : "Sense data",
            timeSpent: "Completat",
            room: report.Room?.room_name || "Desconeguda"
        }));
        
    } catch (error) {
        console.error("Error obtenint les assignacions:", error);
    } finally {
        loading.value = false;
    }
};

// Propiedades computades per les estadístiques
const activeIncidents = computed(() => {
    return allReports.value.filter(report => report.status !== 'revised').length;
});

const todayIncidents = computed(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return allReports.value.filter(report => {
        const reportDate = new Date(report.created_at);
        reportDate.setHours(0, 0, 0, 0);
        return reportDate.getTime() === today.getTime();
    }).length;
});

const registeredSolutions = computed(() => {
    return allReports.value.filter(report => report.status === 'revised').length;
});

const thisWeekSolutions = computed(() => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay()); // Domingo como primer día de la semana
    startOfWeek.setHours(0, 0, 0, 0);
    
    return allReports.value.filter(report => {
        if (report.status !== 'revised') return false;
        const reportDate = new Date(report.updated_at || report.created_at);
        return reportDate >= startOfWeek;
    }).length;
});

const pendingAssignments = computed(() => {
    return allReports.value.filter(report => 
        report.user_assigned === store.user.id && report.status !== 'revised'
    ).length;
});

const urgentCount = computed(() => {
    // Podemos definir urgente como los que tienen más de X días o cualquier otro criterio
    const threshold = new Date();
    threshold.setDate(threshold.getDate() - 3); // Más de 3 días se considera urgente
    
    return allReports.value.filter(report => {
        if (report.user_assigned !== store.user.id || report.status === 'revised') return false;
        const reportDate = new Date(report.created_at);
        return reportDate < threshold;
    }).length;
});

const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
        case 'pendent':
            return 'bg-amber-500/20 text-amber-400';
        case 'en progrés':
            return 'bg-blue-500/20 text-blue-400';
        case 'resolt':
            return 'bg-green-500/20 text-green-400';
        default:
            return 'bg-gray-500/20 text-gray-400';
    }
};

const viewIncident = (id) => {
    router.push(`/technicians/incidents/${id}`);
};

const viewAssignment = (id) => {
    router.push(`/technicians/assignations/${id}`);
};

const viewSolution = (id) => {
    router.push(`/technicians/solutions/${id}`);
};

// En un entorn real, faríem una crida a l'API per obtenir les dades
onMounted(() => {
    // Carrega les dades de l'API
    fetchAssignments();
});
</script>

<style scoped>
.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.animate-fade-in {
    animation: fadeIn 0.5s ease-in-out;
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