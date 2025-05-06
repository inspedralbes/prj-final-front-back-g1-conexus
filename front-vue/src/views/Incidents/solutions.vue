<template>
    <div class="p-6 bg-slate-900/50 backdrop-blur-sm rounded-xl shadow-lg border border-slate-700/50">
        <h1
            class="text-2xl font-bold text-white mb-6 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-400">
            Incidències Resoltes
        </h1>

        <div v-if="loading" class="text-center py-8">
            <p class="text-slate-400">Carregant incidències resoltes...</p>
        </div>

        <div v-else-if="closedReports.length === 0" class="text-center py-8">
            <p class="text-slate-400">No hi ha incidències resoltes</p>
        </div>

        <div v-else class="space-y-4">
            <div v-for="report in closedReports" :key="report.id"
                class="p-4 bg-slate-800/50 rounded-lg border border-slate-700/30 hover:border-slate-600 transition-colors">
                <div class="flex justify-between items-start">
                    <div>
                        <h2 class="text-lg font-semibold text-white">Informe #{{ report.id }}</h2>
                        <p class="text-slate-300 text-sm mt-1">
                            <span class="text-slate-400">Reportat per:</span> {{ report.User?.name || 'Desconegut' }}
                        </p>
                        <p class="text-slate-300 text-sm">
                            <span class="text-slate-400">Resolt per:</span> {{ report.AssignedUser?.name || 'Tècnic no especificat' }}
                        </p>
                    </div>

                    <div class="flex space-x-2">
                        <span class="bg-green-500/20 text-green-300 px-2 py-1 rounded text-xs font-medium">
                            Resolt
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
                    <p v-if="report.closure_comment" class="text-slate-300">
                        <span class="text-slate-400 font-medium">Comentari de tancament:</span> {{ report.closure_comment }}
                    </p>
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
import { getAllReports } from "@/services/communicationsScripts/incidentsManager";

// Estado
const closedReports = ref([]);
const loading = ref(true);
const baseURL = import.meta.env.VITE_INCIDENT_URL;

// Cargar las incidencias al montar el componente
onMounted(async () => {
    try {
        loading.value = true;
        // Obtener todas las incidencias
        const allReports = await getAllReports();
        
        // Filtrar solo las que tienen estado "revised" (cerradas/resueltas)
        closedReports.value = allReports.filter(report => report.status === 'revised');
        
        console.log("Incidències tancades:", closedReports.value);
    } catch (error) {
        console.error("Error obtenint informes tancats:", error);
    } finally {
        loading.value = false;
    }
});
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

/* Estilos específicos para incidencias cerradas */
.bg-green-500\/20 {
    background-color: rgba(34, 197, 94, 0.2);
}

/* Transiciones suaves */
.transition-colors {
    transition-property: color, background-color, border-color;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 150ms;
}

/* Hover effects */
.hover\:border-slate-600:hover {
    --tw-border-opacity: 1;
    border-color: rgb(71 85 105 / var(--tw-border-opacity));
}
</style>