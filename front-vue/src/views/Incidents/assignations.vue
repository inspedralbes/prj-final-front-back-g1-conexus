<template>
    <div class="p-6 bg-slate-900/50 backdrop-blur-sm rounded-xl shadow-lg border border-slate-700/50">
        <h1
            class="text-2xl font-bold text-white mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
            Incidències Assignades a Mi
        </h1>

        <div v-if="loading" class="text-center py-8">
            <p class="text-slate-400">Carregant incidències...</p>
        </div>

        <div v-else-if="myReports.length === 0" class="text-center py-8">
            <p class="text-slate-400">No tens incidències assignades</p>
        </div>

        <div v-else class="space-y-4">
            <div v-for="report in myReports" :key="report.id"
                class="p-4 bg-slate-800/50 rounded-lg border border-slate-700/30 hover:border-slate-600 transition-colors">
                <div class="flex justify-between items-start">
                    <div>
                        <h2 class="text-lg font-semibold text-white">Informe #{{ report.id }}</h2>
                        <p class="text-slate-300 text-sm mt-1">
                            <span class="text-slate-400">Reportat per:</span> {{ report.User?.name || 'Desconegut' }}
                        </p>
                    </div>

                    <div class="flex space-x-2">
                        <span 
                            :class="{
                                'bg-yellow-500/20 text-yellow-300': report.status === 'pending',
                                'bg-blue-500/20 text-blue-300': report.status === 'revising',
                                'bg-green-500/20 text-green-300': report.status === 'revised'
                            }"
                            class="px-2 py-1 rounded text-xs font-medium"
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
                    <p class="text-slate-300">
                        <span class="text-slate-400 font-medium">Descripció:</span> {{ report.report }}
                    </p>
                    <p class="text-slate-300">
                        <span class="text-slate-400 font-medium">Aula:</span> {{ report.Room?.room_name || 'Desconeguda' }}
                    </p>
                </div>

                <div class="mt-4 flex justify-between items-center">
                    <button 
                            @click="closeReport(report.id)" 
                            class="bg-green-600 hover:bg-green-700 text-white px-3 py-1 text-sm rounded transition-colors">
                            Tancar incidència
                        </button>
                    <button @click="unassignReport(report.id)" class="text-red-400 hover:text-red-300 transition-colors text-sm">
                        Desassignar
                    </button>
                </div>

                <div v-if="reportToClose === report.id" class="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
                    <div class="bg-slate-800 p-6 rounded-lg shadow-lg max-w-md w-full border border-slate-700">
                        <h3 class="text-xl font-bold text-white mb-4">Tancar incidència</h3>
                        <p class="text-slate-300 mb-4">Estàs segur que vols tancar aquesta incidència? Aquest procés no es pot desfer.</p>
                        
                        <div class="grid grid-cols-2 gap-4">
                            <textarea 
                                v-model="closureComment" 
                                placeholder="Afegeix un comentari de tancament (opcional)"
                                class="col-span-2 bg-slate-700 border border-slate-600 text-white rounded p-2 mb-4"
                                rows="3"
                            ></textarea>
                            
                            <button 
                                @click="confirmCloseReport(report.id)" 
                                class="bg-green-600 hover:bg-green-700 text-white py-2 rounded transition-colors">
                                Confirmar
                            </button>
                            <button 
                                @click="cancelCloseReport" 
                                class="bg-red-600 hover:bg-red-700 text-white py-2 rounded transition-colors">
                                Cancel·lar
                            </button>
                        </div>
                    </div>
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
import { getAllReports, updateReport as updateReportApi } from "@/services/communicationsScripts/incidentsManager";

const myReports = ref([]);
const loading = ref(true);
const baseURL = import.meta.env.VITE_INCIDENT_URL;

const reportToClose = ref(null);
const closureComment = ref('');

const currentUser = ref({ 
    id: 5, 
    name: "Tech Support" 
});

onMounted(async () => {
    try {
        loading.value = true;
        const allReports = await getAllReports();
        
        myReports.value = allReports.filter(report => 
            report.user_assigned === currentUser.value.id
        );
        
        console.log("Mis incidències assignades:", myReports.value);
    } catch (error) {
        console.error("Error obtenint informes assignats:", error);
    } finally {
        loading.value = false;
    }
});


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
            closure_comment: closureComment.value || 'Incidència tancada satisfactòriament'
        });
        
        const report = myReports.value.find(r => r.id === reportId);
        if (report) {
            report.status = 'revised';
        }
        
        reportToClose.value = null;
        closureComment.value = '';
        
        console.log("Incidència tancada:", reportId);
    } catch (error) {
        console.error("Error tancant la incidència:", error);
    }
};
const unassignReport = async (reportId) => {
    try {
        await updateReportApi(reportId, { user_assigned: null });
        myReports.value = myReports.value.filter(report => report.id !== reportId);
        console.log("Informe desassignat:", reportId);
    } catch (error) {
        console.error("Error desassignant l'informe:", error);
    }
};
</script>

<style scoped>
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

select,
button {
    transition: all 0.2s ease;
}

button:hover {
    filter: brightness(1.1);
}
</style>