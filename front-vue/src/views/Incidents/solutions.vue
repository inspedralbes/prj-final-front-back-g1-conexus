<template>
    <div class="bg-slate-900/10 backdrop-blur-sm rounded-xl p-6 shadow-2xl animate-fade-in border border-slate-700/30">
        <!-- Capçalera -->
        <div class="flex justify-between items-center mb-8">
            <div>
                <h2 class="text-2xl font-bold text-white mb-2">
                    <span class="bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-400">
                        Incidències Resoltes
                    </span>
                </h2>
                <p class="text-gray-400 text-sm">Visualitza l'historial d'incidències resoltes</p>
            </div>
            <div class="bg-green-500/10 p-3 rounded-lg border border-green-500/20">
                <svg class="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </div>
        </div>

        <!-- Estat de càrrega -->
        <div v-if="loading" class="text-center py-12">
            <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-green-500 mx-auto"></div>
            <p class="text-gray-400 mt-4 text-lg">Carregant incidències resoltes...</p>
        </div>

        <!-- Sense incidències -->
        <div v-else-if="closedReports.length === 0" class="text-center py-12 text-gray-400">
            <div class="bg-slate-800/50 p-8 rounded-xl border border-slate-700/30 max-w-md mx-auto">
                <svg class="w-16 h-16 mx-auto text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <p class="text-lg mb-2">No hi ha incidències resoltes</p>
                <p class="text-sm text-gray-500">Les incidències resoltes apareixeran aquí</p>
            </div>
        </div>

        <!-- Llistat d'incidències -->
        <div v-else class="space-y-6">
            <div 
                v-for="report in closedReports" 
                :key="report.id"
                class="p-6 bg-slate-800/50 rounded-xl border border-slate-700/30 hover:border-slate-600 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/5"
            >
                <div class="flex justify-between items-start">
                    <div>
                        <div class="flex items-center gap-3 mb-2">
                            <h2 class="text-xl font-semibold text-white">Incidència #{{ report.id }}</h2>
                            <span class="bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-xs font-medium">
                                Resolt
                            </span>
                        </div>
                        <div class="flex flex-wrap gap-x-6 gap-y-2 mt-3">
                            <div class="flex items-center text-gray-400 text-sm">
                                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                <span class="text-gray-500">Feta per:</span> 
                                <span class="ml-2">{{ report.User?.name || 'Desconegut' }}</span>
                                <span v-if="report.User?.email" class="text-gray-500 ml-2">({{ report.User.email }})</span>
                            </div>
                            <div class="flex items-center text-gray-400 text-sm">
                                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                                <span class="text-gray-500">Resolt per:</span> 
                                <span class="ml-2">{{ report.AssignedUser?.name || 'Tècnic no especificat' }}</span>
                                <span v-if="report.AssignedUser?.email" class="text-gray-500 ml-2">({{ report.AssignedUser.email }})</span>
                            </div>
                        </div>
                    </div>
                </div>

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
                    <div class="bg-green-500/5 border border-green-500/10 p-4 rounded-lg">
                        <p class="text-gray-300">
                            <span class="text-gray-500 font-medium">Nota tècnica:</span> {{ report.note || 'Sense notes afegides' }}
                        </p>
                    </div>
                </div>

                <!-- Data i hora -->
                <div class="mt-4 pt-4 border-t border-slate-700/50">
                    <div class="flex items-center text-gray-400 text-sm">
                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Resolta el {{ formatDate(report.updatedAt) }}
                    </div>
                </div>

                <!-- Imatge de l'incident -->
                <div v-if="report.image" class="mt-6">
                    <img 
                        :src="`${baseURL}${report.image}`" 
                        alt="Imatge de l'incident"
                        class="max-w-full h-auto rounded-lg border border-slate-700/50 max-h-60 object-contain mx-auto hover:shadow-lg transition-all duration-300"
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