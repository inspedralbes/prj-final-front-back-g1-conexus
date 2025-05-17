<template>
    <div class="bg-slate-900/10 backdrop-blur-sm rounded-xl p-6 shadow-2xl animate-fade-in border border-slate-700/30">
        <!-- Capçalera -->
        <div class="flex justify-between items-center mb-8">
            <h2 class="text-2xl font-bold text-white">
                <span class="bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-400">
                    Incidències Resoltes
                </span>
            </h2>
        </div>

        <!-- Estat de càrrega -->
        <div v-if="loading" class="text-center py-8">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p class="text-gray-500 mt-4">Carregant incidències resoltes...</p>
        </div>

        <!-- Sense incidències -->
        <div v-else-if="closedReports.length === 0" class="text-center py-8 text-gray-500">
            <svg class="w-12 h-12 mx-auto text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <p class="mt-2">No hi ha incidències resoltes</p>
        </div>

        <!-- Llistat d'incidències -->
        <div v-else class="space-y-4">
            <div 
                v-for="report in closedReports" 
                :key="report.id"
                class="p-4 bg-slate-800/50 rounded-lg border border-slate-700/30 hover:border-slate-600 transition-colors duration-300"
            >
                <div class="flex justify-between items-start">
                    <div>
                        <h2 class="text-lg font-semibold text-white">Incidència #{{ report.id }}</h2>
                        <div class="flex flex-wrap gap-x-4 gap-y-2 mt-1 text-sm">
                            <p class="text-gray-400">
                                <span class="text-gray-500">Reportat per:</span> {{ report.User?.name || 'Desconegut' }}
                            </p>
                            <p class="text-gray-400">
                                <span class="text-gray-500">Resolt per:</span> {{ report.AssignedUser?.name || 'Tècnic no especificat' }}
                            </p>
                        </div>
                    </div>

                    <span class="bg-green-500/20 text-green-300 px-2 py-1 rounded-full text-xs font-medium">
                        Resolt
                    </span>
                </div>

                <div class="mt-3 space-y-2">
                    <p class="text-gray-300">
                        <span class="text-gray-500 font-medium">Descripció:</span> {{ report.report }}
                    </p>
                    <p class="text-gray-300">
                        <span class="text-gray-500 font-medium">Aula:</span> {{ report.Room?.room_name || 'Desconeguda' }}
                    </p>
                    <p class="text-gray-300">
                        <span class="text-gray-500 font-medium">Nota tècnica:</span> {{ report.note || 'Sense notes afegides' }}
                    </p>
                </div>

                <!-- Data i hora -->
                <div class="mt-3 pt-3 border-t border-slate-700/50">
                    <p class="text-gray-400 text-sm flex items-center">
                        <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Resolta el {{ formatDate(report.updatedAt) }}
                    </p>
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
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getAllReports } from "@/services/communicationsScripts/incidentsManager";

const closedReports = ref([]);
const loading = ref(true);
const baseURL = import.meta.env.VITE_INCIDENT_URL;

const formatDate = (dateString) => {
    if (!dateString) return 'Data no disponible';
    const options = { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric',
        hour: '2-digit', 
        minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('ca-ES', options);
};

onMounted(async () => {
    try {
        loading.value = true;
        const allReports = await getAllReports();
        closedReports.value = allReports.filter(report => report.status === 'revised');
    } catch (error) {
        console.error("Error obtenint informes tancats:", error);
    } finally {
        loading.value = false;
    }
});
</script>

<style scoped>
.animate-fade-in {
    animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}

.bg-green-500\/20 {
    background-color: rgba(34, 197, 94, 0.2);
}
</style>