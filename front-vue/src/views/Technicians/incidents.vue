<template>
    <div class="backdrop-blur-sm rounded-xl p-6 shadow-2xl animate-fade-in border border-slate-700/30 mt-9 mb-9">
        <!-- Capçalera -->
        <div class="flex justify-between items-center mb-8">
            <div>
                <h2 class="text-2xl font-bold text-white mb-2">
                    <span class="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                        Informes d'Incidències
                    </span>
                </h2>
                <p class="text-gray-400 text-sm">Gestiona totes les incidències del sistema</p>
            </div>
            <div class="bg-purple-500/10 p-3 rounded-lg border border-purple-500/20">
                <svg class="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
            </div>
        </div>

        <!-- Filtres -->
        <div class="mb-6 flex flex-col sm:flex-row sm:items-center gap-4 bg-slate-800/50 p-4 rounded-lg border border-slate-700/30 backdrop-blur-sm">
            <div class="flex items-center gap-2">
                <span class="text-gray-300 flex items-center">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                    </svg>
                    Filtrar per:
                </span>
                <select v-model="selectedFilter" 
                    class="bg-slate-700/50 border border-slate-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-300">
                    <option value="all">Tots</option>
                    <option value="day">Avui</option>
                    <option value="week">Aquesta setmana</option>
                    <option value="month">Aquest mes</option>
                </select>
            </div>
            <div v-if="selectedFilter !== 'all'" class="text-gray-400 text-sm flex items-center bg-slate-700/30 px-3 py-1.5 rounded-lg">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                {{ filterDescription }}
            </div>
        </div>

        <!-- Llistat d'Informes -->
        <div v-if="filteredReports.length === 0" class="text-center py-12 text-gray-400">
            <div class="bg-slate-800/50 p-8 rounded-xl border border-slate-700/30 max-w-md mx-auto">
                <svg class="w-16 h-16 mx-auto text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p class="text-lg mb-2">No hi ha informes disponibles</p>
                <p class="text-sm text-gray-500">Els nous informes apareixeran aquí</p>
            </div>
        </div>

        <div v-else class="space-y-6">
            <div v-for="report in filteredReports" :key="report.id"
                class="p-6 bg-slate-800/50 rounded-xl border border-slate-700/30 hover:border-slate-600 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/5">
                <div class="flex justify-between items-start">
                    <div>
                        <div class="flex items-center gap-3 mb-2">
                            <h2 class="text-xl font-semibold text-white">Informe #{{ report.id }}</h2>
                            <span 
                                :class="{
                                    'bg-amber-500/20 text-amber-300': report.status === 'pending',
                                    'bg-blue-500/20 text-blue-300': report.status === 'revising',
                                    'bg-green-500/20 text-green-300': report.status === 'revised'
                                }"
                                class="px-3 py-1 rounded-full text-xs font-medium"
                            >
                                {{ 
                                    report.status === 'pending' ? 'Pendent' : 
                                    report.status === 'revising' ? 'En revisió' : 
                                    'Completat' 
                                }}
                            </span>
                        </div>
                        <div class="flex items-center text-gray-400 text-sm">
                            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <span class="text-gray-500">Usuari:</span> 
                            <span class="ml-2">{{ report.User?.name || 'Desconegut' }}</span>
                            <span v-if="report.User?.email" class="text-gray-500 ml-2">({{ report.User.email }})</span>
                        </div>
                    </div>

                    <button @click="deleteReport(report.id)" 
                        class="text-red-400 hover:text-red-300 p-2 rounded-lg hover:bg-red-500/10 transition-all duration-300">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>

                <!-- Contingut de l'informe -->
                <div class="mt-4 space-y-3">
                    <div class="bg-slate-700/30 p-4 rounded-lg">
                        <p class="text-gray-300">
                            <span class="text-gray-500 font-medium">Descripció:</span> {{ report.report }}
                        </p>
                    </div>
                    <div class="flex items-center text-gray-400">
                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        <span class="text-gray-500 font-medium">Aula:</span> 
                        <span class="ml-2">{{ report.Room?.room_name || 'Desconeguda' }}</span>
                    </div>
                </div>

                <!-- Assignació i data -->
                <div class="mt-6 pt-4 border-t border-slate-700/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                    <div class="flex items-center">
                        <span class="text-gray-500 font-medium mr-2">Assignat a:</span>
                        <span v-if="report.AssignedUser" class="text-green-400 mr-2">
                            {{ report.AssignedUser.name }}
                        </span>
                        <button 
                            v-if="!report.AssignedUser"
                            @click="assignReportToMe(report.id)" 
                            class="bg-purple-600/90 hover:bg-purple-700 text-white px-4 py-2 text-sm rounded-lg transition-all duration-300 flex items-center hover:shadow-lg hover:shadow-purple-500/20">
                            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                            </svg>
                            Assignar a mi
                        </button>
                        <span v-else-if="report.AssignedUser.id === currentUser.id" class="text-blue-400 text-sm flex items-center">
                            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                            </svg>
                            (Assignat a tu)
                        </span>
                        <div v-else class="relative group">
                            <svg class="w-5 h-5 text-gray-400 ml-2 cursor-help" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-slate-800 text-white text-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                                Assignat a {{ report.AssignedUser.name }}
                            </div>
                        </div>
                    </div>

                    <div class="text-xs text-gray-500 flex items-center">
                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {{ formatDate(report.createdAt) }}
                    </div>
                </div>

                <!-- Imatge de l'incident -->
                <div v-if="report.image" class="mt-6">
                    <img :src="`${baseURL}${report.image}`" alt="Imatge de l'incident"
                        class="max-w-full h-auto rounded-lg border border-slate-700/50 max-h-60 object-contain mx-auto hover:shadow-lg transition-all duration-300">
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { deleteReport as deleteReportApi, getAllReports, updateReport as updateReportApi, assignReport } from "@/services/communicationsScripts/incidentsManager";
import { useAppStore } from '@/stores/index';

const reports = ref([]);
const baseURL = import.meta.env.VITE_INCIDENT_URL;
const appStore = useAppStore();
const currentUser = ref(appStore.user || { 
    id: 5,
    name: "Tech Support" 
});
const selectedFilter = ref('all');

const formatDate = (dateString) => {
    if (!dateString) return 'Data no disponible';
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('ca-ES', options);
};

// Computed property for filtered reports
const filteredReports = computed(() => {
    if (selectedFilter.value === 'all') return reports.value;

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    return reports.value.filter(report => {
        const reportDate = new Date(report.createdAt);
        
        switch (selectedFilter.value) {
            case 'day':
                return reportDate >= today;
            case 'week':
                return reportDate >= startOfWeek;
            case 'month':
                return reportDate >= startOfMonth;
            default:
                return true;
        }
    });
});

// Computed property for filter description
const filterDescription = computed(() => {
    switch (selectedFilter.value) {
        case 'day':
            return 'Informes d\'avui';
        case 'week':
            return 'Informes d\'aquesta setmana';
        case 'month':
            return 'Informes d\'aquest mes';
        default:
            return '';
    }
});

onMounted(async () => {
    if (!currentUser.value || !currentUser.value.id) {
        console.log("No hay usuario en el store, usando uno por defecto");
        currentUser.value = { id: 5, name: "Tech Support" };
    }
    try {
        reports.value = await getAllReports();
        console.log("Informes obtinguts:", reports.value);
    } catch (error) {
        console.error("Error obtenint informes:", error);
    }
});

const deleteReport = async (reportId) => {
    try {
        await deleteReportApi(reportId);
        reports.value = reports.value.filter(report => report.id !== reportId);
        console.log("Informe eliminat:", reportId);
    } catch (error) {
        console.error("Error eliminant l'informe:", error);
    }
};

const assignReportToMe = async (reportId) => {
    try {
        if (!currentUser.value || !currentUser.value.id) {
            console.error("Usuario no disponible");
            return;
        }

        const report = reports.value.find(r => r.id === reportId);
        if (report && report.AssignedUser) {
            console.error("Aquesta incidència ja està assignada");
            return;
        }

        const userId = currentUser.value.id;
        console.log("Asignando informe", reportId, "al usuario", userId);
        
        const updatedReport = await assignReport(reportId, userId);
        
        const index = reports.value.findIndex(report => report.id === reportId);
        if (index !== -1) {
            reports.value[index] = updatedReport;
        }
        
        console.log("Informe assignat a mi:", reportId);
    } catch (error) {
        console.error("Error assignant l'informe:", error);
    }
};
</script>

<style scoped>
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

select {
    transition: all 0.3s ease;
}

select:focus {
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
}
</style>