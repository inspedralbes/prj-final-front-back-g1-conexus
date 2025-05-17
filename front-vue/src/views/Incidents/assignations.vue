<template>
    <div class="bg-slate-900/10 backdrop-blur-sm rounded-xl p-6 shadow-2xl animate-fade-in border border-slate-700/30">
        <!-- Capçalera -->
        <div class="flex justify-between items-center mb-8">
            <h2 class="text-2xl font-bold text-white">
                <span class="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                    Incidències Assignades a Mi
                </span>
            </h2>
        </div>

        <!-- Filtres -->
        <div class="mb-6 flex flex-col sm:flex-row sm:items-center gap-4 bg-slate-800/50 p-4 rounded-lg border border-slate-700/30">
            <div class="flex items-center gap-2">
                <span class="text-gray-300">Filtrar per:</span>
                <select 
                    v-model="selectedFilter"
                    class="bg-slate-700/50 border border-slate-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
                >
                    <option value="all">Tots</option>
                    <option value="day">Avui</option>
                    <option value="week">Aquesta setmana</option>
                    <option value="month">Aquest mes</option>
                </select>
            </div>
            <div v-if="selectedFilter !== 'all'" class="text-gray-400 text-sm flex items-center">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                {{ filterDescription }}
            </div>
        </div>

        <!-- Estats de càrrega -->
        <div v-if="loading" class="text-center py-8">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p class="text-gray-500 mt-4">Carregant incidències...</p>
        </div>

        <div v-else-if="filteredReports.length === 0" class="text-center py-8 text-gray-500">
            <svg class="w-12 h-12 mx-auto text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p class="mt-2">No tens incidències assignades</p>
        </div>

        <!-- Llistat d'incidències -->
        <div v-else class="space-y-4">
            <div 
                v-for="report in filteredReports" 
                :key="report.id"
                class="p-4 bg-slate-800/50 rounded-lg border border-slate-700/30 hover:border-slate-600 transition-colors duration-300"
            >
                <div class="flex justify-between items-start">
                    <div>
                        <h2 class="text-lg font-semibold text-white">Incidència #{{ report.id }}</h2>
                        <p class="text-gray-400 text-sm mt-1">
                            <span class="text-gray-500">Reportat per:</span> {{ report.User?.name || 'Desconegut' }}
                        </p>
                    </div>

                    <div class="flex space-x-2">
                        <span 
                            :class="{
                                'bg-amber-500/20 text-amber-300': report.status === 'pending',
                                'bg-blue-500/20 text-blue-300': report.status === 'revising',
                                'bg-green-500/20 text-green-300': report.status === 'revised'
                            }"
                            class="px-2 py-1 rounded-full text-xs font-medium"
                        >
                            {{ 
                                report.status === 'pending' ? 'Pendent' : 
                                report.status === 'revising' ? 'En revisió' : 
                                'Completat' 
                            }}
                        </span>
                    </div>
                </div>

                <div class="mt-3 space-y-2">
                    <p class="text-gray-300">
                        <span class="text-gray-500 font-medium">Descripció:</span> {{ report.report }}
                    </p>
                    <p class="text-gray-300">
                        <span class="text-gray-500 font-medium">Aula:</span> {{ report.Room?.room_name || 'Desconeguda' }}
                    </p>
                    <p class="text-gray-400 text-sm">
                        <svg class="w-3 h-3 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {{ formatDate(report.createdAt) }}
                    </p>
                </div>

                <!-- Accions -->
                <div class="mt-4 flex justify-between items-center pt-3 border-t border-slate-700/50">
                    <button 
                        @click="closeReport(report.id)" 
                        class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 text-sm rounded-lg transition-colors duration-300 flex items-center"
                    >
                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        </svg>
                        Tancar incidència
                    </button>
                    <button 
                        @click="unassignReport(report.id)" 
                        class="text-red-400 hover:text-red-300 transition-colors duration-300 text-sm flex items-center"
                    >
                        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Desassignar
                    </button>
                </div>

                <!-- Imatge de l'incident -->
                <div v-if="report.image" class="mt-4">
                    <img 
                        :src="`${baseURL}${report.image}`" 
                        alt="Imatge de l'incident"
                        class="max-w-full h-auto rounded-lg border border-slate-700/50 max-h-60 object-contain mx-auto"
                    >
                </div>
            </div>
        </div>

        <!-- Modal de confirmació -->
        <div 
            v-if="reportToClose !== null" 
            class="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
        >
            <div class="bg-slate-800 p-6 rounded-xl shadow-2xl max-w-md w-full border border-slate-700/50">
                <h3 class="text-xl font-bold text-white mb-4">Tancar incidència</h3>
                <p class="text-gray-300 mb-4">Estàs segur que vols tancar aquesta incidència? Aquest procés no es pot desfer.</p>
                
                <textarea 
                    v-model="closureComment" 
                    placeholder="Afegeix un comentari de tancament (opcional)"
                    class="w-full bg-slate-700/50 border border-slate-600 text-white rounded-lg p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
                    rows="3"
                ></textarea>
                
                <div class="grid grid-cols-2 gap-4">
                    <button 
                        @click="confirmCloseReport(reportToClose)" 
                        class="bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition-colors duration-300 flex items-center justify-center"
                    >
                        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        </svg>
                        Confirmar
                    </button>
                    <button 
                        @click="cancelCloseReport" 
                        class="bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition-colors duration-300 flex items-center justify-center"
                    >
                        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Cancel·lar
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { getAllReports, updateReport as updateReportApi } from "@/services/communicationsScripts/incidentsManager";
import { useAppStore } from '@/stores/index.js';

const store = useAppStore();
const allReports = ref([]);
const loading = ref(true);
const baseURL = import.meta.env.VITE_INCIDENT_URL;
const reportToClose = ref(null);
const closureComment = ref('');
const selectedFilter = ref('all');

const formatDate = (dateString) => {
    if (!dateString) return 'Data no disponible';
    const options = { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('ca-ES', options);
};

const filterDescription = computed(() => {
    switch (selectedFilter.value) {
        case 'day': return 'Incidències d\'avui';
        case 'week': return 'Incidències d\'aquesta setmana';
        case 'month': return 'Incidències d\'aquest mes';
        default: return '';
    }
});

const filteredReports = computed(() => {
    let reports = allReports.value.filter(report => 
        report.user_assigned === store.user.id && report.status !== 'revised'
    );

    if (selectedFilter.value === 'all') return reports;

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    return reports.filter(report => {
        const reportDate = new Date(report.createdAt);
        
        switch (selectedFilter.value) {
            case 'day': return reportDate >= today;
            case 'week': return reportDate >= startOfWeek;
            case 'month': return reportDate >= startOfMonth;
            default: return true;
        }
    });
});

onMounted(async () => {
    await loadAssignedReports();
});

const loadAssignedReports = async () => {
    try {
        loading.value = true;
        allReports.value = await getAllReports();
    } catch (error) {
        console.error("Error obtenint informes assignats:", error);
    } finally {
        loading.value = false;
    }
};

const closeReport = (reportId) => {
    reportToClose.value = reportId;
    closureComment.value = '';
};

const cancelCloseReport = () => {
    reportToClose.value = null;
    closureComment.value = '';
};

const confirmCloseReport = async (reportId) => {
    try {
        await updateReportApi(reportId, { 
            status: 'revised', 
            note: closureComment.value || 'Incidència tancada satisfactòriament'
        });
        
        const report = allReports.value.find(r => r.id === reportId);
        if (report) report.status = 'revised';
        
        reportToClose.value = null;
        closureComment.value = '';
    } catch (error) {
        console.error("Error tancant la incidència:", error);
    }
};

const unassignReport = async (reportId) => {
    try {
        await updateReportApi(reportId, { user_assigned: null });
        const index = allReports.value.findIndex(report => report.id === reportId);
        if (index !== -1) allReports.value[index].user_assigned = null;
    } catch (error) {
        console.error("Error desassignant l'informe:", error);
    }
};
</script>

<style scoped>
.animate-fade-in {
    animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}

select {
    transition: all 0.3s ease;
}

select:focus {
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
}
</style>