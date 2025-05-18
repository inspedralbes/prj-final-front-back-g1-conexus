<template>
    <div class="animate-fade-in mt-8 mb-8">
        <!-- Capçalera -->
        <div class="mb-8 text-center">
            <h1 class="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                Gestió de Sales
            </h1>
            <p class="text-gray-300 mt-2">Administra les sales disponibles per a reserves</p>
        </div>

        <!-- Botó d'acció principal -->
        <div class="flex justify-end mb-6">
            <button @click="goToNewRoom"
                class="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg hover:from-green-600 hover:to-green-700 transition-all shadow-lg flex items-center">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                Crear nova sala
            </button>
        </div>

        <!-- Llistat de sales -->
        <div class="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 shadow-lg">
            <h2 class="text-xl font-semibold text-gray-300 mb-6 border-b border-slate-700 pb-2">
                <svg class="w-6 h-6 inline-block mr-2 text-blue-400" fill="none" stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Llistat de Sales
            </h2>

            <div v-if="rooms.length === 0" class="text-center py-8 text-gray-400">
                <svg class="w-12 h-12 mx-auto mb-4 text-slate-600" fill="none" stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1"
                        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                No hi ha sales registrades
            </div>

            <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div v-for="room in rooms" :key="room.id" class="animate-fade-in">
                    <roomCardAdmin :room="room" @callDeleteRoom="callDeleteRoom" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getAllRooms, deleteRoom } from '@/services/communicationsScripts/roomReservationsComManager';
import { useRouter } from 'vue-router';
import roomCardAdmin from '@/components/RoomReservation/roomCardAdmin.vue';

const router = useRouter();
const rooms = ref([]);

onMounted(async () => {
    try {
        const response = await getAllRooms();
        rooms.value = response;
        console.log('Sales carregades:', rooms.value);
    } catch (error) {
        console.error('Error carregant sales:', error);
    }
});

function callDeleteRoom(roomId) {
    deleteRoom(roomId)
        .then(() => {
            rooms.value = rooms.value.filter(room => room.id !== roomId);
        })
        .catch(error => {
            console.error('Error eliminant sala:', error);
        });
}

function goToNewRoom() {
    router.push({ name: 'new-room' });
}
</script>

<style scoped>
.animate-fade-in {
    animation: fadeIn 0.5s ease forwards;
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

button {
    transition: all 0.2s ease;
}

button:hover {
    transform: translateY(-2px);
}
</style>