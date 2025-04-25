<template>
    <div class="p-6 bg-slate-900/50 backdrop-blur-sm rounded-xl shadow-lg border border-slate-700/50">
        <h1
            class="text-2xl font-bold text-white mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
            Informes d'Incidències
        </h1>

        <div v-if="reports.length === 0" class="text-center py-8">
            <p class="text-slate-400">No hi ha informes disponibles</p>
        </div>

        <div v-else class="space-y-4">
            <div v-for="report in reports" :key="report.id"
                class="p-4 bg-slate-800/50 rounded-lg border border-slate-700/30 hover:border-slate-600 transition-colors">
                <div class="flex justify-between items-start">
                    <div>
                        <h2 class="text-lg font-semibold text-white">Informe #{{ report.id }}</h2>
                        <p class="text-slate-300 text-sm mt-1">
                            <span class="text-slate-400">Usuari:</span> {{ report.User.name }}
                        </p>
                    </div>

                    <button @click="deleteReport(report.id)" class="text-red-400 hover:text-red-300 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>

                <div class="mt-3 space-y-2">
                    <p class="text-slate-300">
                        <span class="text-slate-400 font-medium">Descripció:</span> {{ report.report }}
                    </p>
                    <p class="text-slate-300">
                        <span class="text-slate-400 font-medium">Aula:</span> {{ report.Room.room_name }}
                    </p>
                </div>

                <div class="mt-3 flex items-center">
                    <span class="text-slate-400 font-medium mr-2">Estat:</span>
                    <select v-model="report.status" @change="updateReportStatus(report.id, report.status)"
                        class="bg-slate-700/50 border border-slate-600 text-white rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition">
                        <option value="pending">Pendent</option>
                        <option value="revised">Revisat</option>
                        <option value="completed">Completat</option>
                    </select>
                </div>

                <div v-if="report.image" class="mt-4">
                    <img :src="`${baseURL}${report.image}`" alt="Imatge de l'incident"
                        class="max-w-full h-auto rounded-lg border border-slate-700/50 max-h-60 object-contain">
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { deleteReport as deleteReportApi, getAllReports, updateReport as updateReportApi } from "@/services/communicationsScripts/incidentsManager";

const reports = ref([]);
const baseURL = import.meta.env.VITE_INCIDENT_URL;

onMounted(async () => {
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

const updateReportStatus = async (reportId, status) => {
    try {
        await updateReportApi(reportId, { status });
        const report = reports.value.find(report => report.id === reportId);
        if (report) {
            report.status = status;
        }
        console.log("Estat de l'informe actualitzat:", reportId);
    } catch (error) {
        console.error("Error actualitzant l'estat:", error);
    }
};
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

/* Transicions suaus */
select,
button {
    transition: all 0.2s ease;
}

/* Efecte hover per als elements de la llista */
.report-item:hover {
    transform: translateY(-2px);
}
</style>