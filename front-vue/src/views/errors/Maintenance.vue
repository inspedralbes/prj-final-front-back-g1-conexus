<template>
    <div class="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-center px-4">
        <div class="max-w-md w-full bg-slate-800 p-8 rounded-lg shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-amber-500 mx-auto mb-4" fill="none"
                viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>

            <h1 class="text-2xl font-bold text-white mb-2">Servei en manteniment</h1>

            <p class="text-gray-300 mb-6">
                El servei {{ serviceName }} no està disponible en aquest moment. Els nostres tècnics estan treballant
                per solucionar-ho el més aviat possible.
            </p>

            <div class="flex justify-center space-x-4">
                <button @click="goBack"
                    class="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors">
                    Tornar enrere
                </button>
                <button @click="goHome"
                    class="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors">
                    Anar a la pàgina principal
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAppStore } from '@/stores'; // Importamos el store de Pinia

const router = useRouter();
const route = useRoute();
const appStore = useAppStore(); // Usamos el store de Pinia

const serviceName = computed(() => {
    const service = route.params.service || '';
    switch (service) {
        case 'canteen': return 'Cantina';
        case 'chat': return 'Chat';
        case 'assistances': return 'Assistències';
        case 'grades': return 'Notes';
        case 'rooms': return 'Aules';
        case 'incidents': return 'Incidències';
        case 'lostObjects': return 'Objectes perduts';
        default: return service || 'sol·licitat';
    }
});

const goBack = () => {
    router.go(-1);
};

const goHome = () => {
    // Obtenemos el rol del usuario directamente del store de Pinia
    const userRole = appStore.user?.typeusers?.name || '';

    switch (userRole) {
        case 'Administrador':
            router.push('/admin/panel');
            break;
        case 'Professor':
            router.push('/teachers/panel');
            break;
        case 'Estudiant':
            router.push('/students/panel');
            break;
        case 'Tècnic':
            router.push('/technicians/panel');
            break;
        case 'Cantina':
            router.push('/canteen/panel');
            break;
        default:
            router.push('/');
            break;
    }
};
</script>