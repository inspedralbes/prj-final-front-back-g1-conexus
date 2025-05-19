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

        <!-- Llistat de sales en format llista -->
        <div class="backdrop-blur-sm rounded-xl p-6 shadow-lg">
            <h2 class="text-xl font-semibold text-gray-300 mb-6 border-b border-slate-700 pb-2">
                <svg class="w-6 h-6 inline-block mr-2 text-blue-400" fill="none" stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Llistat de Sales
            </h2>
            <!-- Selector para mostrar/ocultar sales no disponibles -->
            <div class="mb-4 flex items-center gap-2">
                <input
                    type="checkbox"
                    id="showUnavailable"
                    v-model="showUnavailable"
                    class="accent-blue-500 w-4 h-4"
                />
                <label for="showUnavailable" class="text-gray-300 cursor-pointer select-none">
                    Mostrar sales no disponibles
                </label>
            </div>
            <div v-if="rooms.length === 0" class="text-center py-8 text-gray-400">
                <svg class="w-12 h-12 mx-auto mb-4 text-slate-600" fill="none" stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1"
                        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                No hi ha sales registrades
            </div>

            <div v-else class="space-y-4">
                <div v-for="(room, index) in visibleRooms" :key="room.id"
                    class="animate-fade-in rounded-lg overflow-hidden" :style="{ animationDelay: `${index * 150}ms` }">

                    <!-- Capçalera de la sala (sempre visible) -->
                    <div class="bg-slate-700/50 p-4 flex items-center justify-between cursor-pointer hover:bg-slate-700/70 transition-colors"
                        @click="toggleRoomExpanded(room.id)">
                        <div class="flex items-center">
                            <svg class="w-5 h-5 mr-3 text-blue-400" fill="none" stroke="currentColor"
                                viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                            <div>
                                <h3 class="font-semibold text-gray-200">{{ room.room_name }}</h3>
                                <p class="text-sm text-gray-400 truncate max-w-md">{{ room.room_description }}</p>
                            </div>
                        </div>
                        <div class="flex flex-col items-center justify-center w-40">
                            <h5 v-if="room.available" class="text-green-500 font-semibold mb-2 text-center">
                                Sala disponible
                            </h5>
                            <h5 v-else class="text-red-500 font-semibold mb-2 text-center">
                                La sala no està disponible
                            </h5>
                        </div>
                        <div class="flex items-center">
                            <!-- Contador de horarios disponibles -->
                            <span class="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs mr-4">
                                {{ getTotalHoursCount(room) }} hores disponibles
                            </span>

                            <!-- Icono para expandir/colapsar -->
                            <svg class="w-5 h-5 text-gray-400 transform transition-transform"
                                :class="expandedRooms.includes(room.id) ? 'rotate-180' : ''" fill="none"
                                stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>

                    <!-- Contenido expandido de la sala -->
                    <div v-if="expandedRooms.includes(room.id)"
                        class="bg-slate-800/50 p-6 border border-slate-700/50 border-t-0 rounded-b-lg animate-expand">
                        <div class="grid grid-cols-1 md:grid-cols-5 gap-6">
                            <!-- Columna izquierda: Info general -->
                            <div class="md:col-span-2 space-y-4">
                                <div>
                                    <h4 class="text-sm font-semibold text-gray-400 mb-2">Descripció</h4>
                                    <p class="text-gray-300">{{ room.room_description }}</p>
                                </div>

                                <div class="flex space-x-2 pt-4">
                                    <button @click="showEditModal(room)"
                                        class="flex-1 py-2 px-4 bg-blue-500/20 rounded-lg hover:bg-blue-500/30 transition-colors text-blue-400 flex items-center justify-center">
                                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                        Editar
                                    </button>
                                    <button @click="showDeleteConfirm(room)"
                                        class="flex-1 py-2 px-4 bg-red-500/20 rounded-lg hover:bg-red-500/30 transition-colors text-red-400 flex items-center justify-center">
                                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                        Eliminar
                                    </button>
                                </div>
                            </div>

                            <!-- Columna derecha: Horarios -->
                            <div class="md:col-span-3">
                                <h4 class="text-sm font-semibold text-gray-400 mb-3 flex items-center">
                                    <svg class="w-4 h-4 mr-1 text-purple-400" fill="none" stroke="currentColor"
                                        viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    HORARI DE DISPONIBILITAT
                                </h4>

                                <div class="overflow-x-auto bg-slate-700/30 rounded-lg">
                                    <table class="w-full text-sm text-gray-400">
                                        <thead class="text-xs text-gray-300 bg-slate-700/50">
                                            <tr>
                                                <th class="px-4 py-2 text-left">Dia</th>
                                                <th class="px-4 py-2">Horari</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-if="room.room_hours_available_monday.length > 0"
                                                class="border-b border-slate-700/50">
                                                <td class="px-4 py-3 font-medium">Dilluns</td>
                                                <td class="px-4 py-3">
                                                    <div class="flex flex-wrap gap-2">
                                                        <span v-for="hour in room.room_hours_available_monday"
                                                            :key="hour"
                                                            class="bg-slate-600/50 px-2 py-1 rounded text-blue-300">
                                                            {{ hour }}
                                                        </span>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr v-if="room.room_hours_available_tuesday.length > 0"
                                                class="border-b border-slate-700/50">
                                                <td class="px-4 py-3 font-medium">Dimarts</td>
                                                <td class="px-4 py-3">
                                                    <div class="flex flex-wrap gap-2">
                                                        <span v-for="hour in room.room_hours_available_tuesday"
                                                            :key="hour"
                                                            class="bg-slate-600/50 px-2 py-1 rounded text-blue-300">
                                                            {{ hour }}
                                                        </span>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr v-if="room.room_hours_available_wensday.length > 0"
                                                class="border-b border-slate-700/50">
                                                <td class="px-4 py-3 font-medium">Dimecres</td>
                                                <td class="px-4 py-3">
                                                    <div class="flex flex-wrap gap-2">
                                                        <span v-for="hour in room.room_hours_available_wensday"
                                                            :key="hour"
                                                            class="bg-slate-600/50 px-2 py-1 rounded text-blue-300">
                                                            {{ hour }}
                                                        </span>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr v-if="room.room_hours_available_thursday.length > 0"
                                                class="border-b border-slate-700/50">
                                                <td class="px-4 py-3 font-medium">Dijous</td>
                                                <td class="px-4 py-3">
                                                    <div class="flex flex-wrap gap-2">
                                                        <span v-for="hour in room.room_hours_available_thursday"
                                                            :key="hour"
                                                            class="bg-slate-600/50 px-2 py-1 rounded text-blue-300">
                                                            {{ hour }}
                                                        </span>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr v-if="room.room_hours_available_friday.length > 0">
                                                <td class="px-4 py-3 font-medium">Divendres</td>
                                                <td class="px-4 py-3">
                                                    <div class="flex flex-wrap gap-2">
                                                        <span v-for="hour in room.room_hours_available_friday"
                                                            :key="hour"
                                                            class="bg-slate-600/50 px-2 py-1 rounded text-blue-300">
                                                            {{ hour }}
                                                        </span>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr v-if="!hasAnyHours(room)" class="border-b border-slate-700/50">
                                                <td colspan="2" class="px-4 py-3 text-center text-gray-500">
                                                    No hi ha horaris disponibles per aquesta sala
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>


    </div>
    <!-- Modal de confirmació d'eliminació -->
    <div v-if="roomToDelete" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="fixed inset-0 bg-black/60 backdrop-blur-sm" @click="roomToDelete = null"></div>
        <div
            class="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 max-w-md w-full border border-slate-700/50 shadow-2xl z-10 animate-fade-in">
            <h3 class="text-xl font-bold text-white mb-3">Confirmar eliminació</h3>
            <p class="text-gray-300 mb-6">Estàs segur que vols eliminar la sala <span
                    class="font-semibold text-white">{{ roomToDelete.room_name }}</span>? Aquesta acció no es pot
                desfer.</p>

            <div class="flex justify-end space-x-3">
                <button @click="roomToDelete = null"
                    class="px-4 py-2 border border-slate-600 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors">
                    Cancel·lar
                </button>
                <button @click="confirmDelete"
                    class="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg shadow hover:from-red-600 hover:to-red-700 transition-all duration-300">
                    Eliminar
                </button>
            </div>
        </div>
    </div>

    <!-- Componente para la edición de salas (reutilizamos el componente) -->
    <room-edit-modal v-if="roomToEdit" :room="roomToEdit" @close="roomToEdit = null"
        @room-updated="handleRoomUpdated" />
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { getAllRooms, deleteRoom, updateRoom } from '@/services/communicationsScripts/roomReservationsComManager';
import { useRouter } from 'vue-router';
import RoomEditModal from '@/components/RoomReservation/RoomEditModal.vue';

const router = useRouter();
const rooms = ref([]);
const visibleCount = ref(0);
const animationInterval = ref(null);
const expandedRooms = ref([]);
const roomToDelete = ref(null);
const roomToEdit = ref(null);
const showUnavailable = ref(false);


// Mostrar las tarjetas progresivamente
const visibleRooms = computed(() => {
    let filtered = rooms.value;
    if (!showUnavailable.value) {
        filtered = filtered.filter(room => room.available);
    }
    return filtered.slice(0, visibleCount.value);
});

onMounted(async () => {
    loadRooms();
});

async function loadRooms() {
    try {
        const response = await getAllRooms();

        // Asegurarse de que todos los objetos room tenen les propietats de horarios inicializadas
        rooms.value = response.map(room => ({
            ...room,
            room_hours_available_monday: room.room_hours_available_monday || [],
            room_hours_available_tuesday: room.room_hours_available_tuesday || [],
            room_hours_available_wensday: room.room_hours_available_wensday || [],
            room_hours_available_thursday: room.room_hours_available_thursday || [],
            room_hours_available_friday: room.room_hours_available_friday || []
        }));

        console.log('Sales carregades:', rooms.value);

        // Mostrar las salas progresivamente
        visibleCount.value = 0;
        clearInterval(animationInterval.value);

        animationInterval.value = setInterval(() => {
            if (visibleCount.value < rooms.value.length) {
                visibleCount.value++;
            } else {
                clearInterval(animationInterval.value);
            }
        }, 150);
    } catch (error) {
        console.error('Error carregant sales:', error);
    }
}

function toggleRoomExpanded(roomId) {
    if (expandedRooms.value.includes(roomId)) {
        expandedRooms.value = expandedRooms.value.filter(id => id !== roomId);
    } else {
        expandedRooms.value.push(roomId);
    }
}

function getTotalHoursCount(room) {
    if (!room) return 0;

    // Verificar que cada propiedad existe i és un array abans d'accedir a length
    const mondayLength = Array.isArray(room.room_hours_available_monday) ? room.room_hours_available_monday.length : 0;
    const tuesdayLength = Array.isArray(room.room_hours_available_tuesday) ? room.room_hours_available_tuesday.length : 0;
    const wednesdayLength = Array.isArray(room.room_hours_available_wensday) ? room.room_hours_available_wensday.length : 0;
    const thursdayLength = Array.isArray(room.room_hours_available_thursday) ? room.room_hours_available_thursday.length : 0;
    const fridayLength = Array.isArray(room.room_hours_available_friday) ? room.room_hours_available_friday.length : 0;

    return mondayLength + tuesdayLength + wednesdayLength + thursdayLength + fridayLength;
}

function hasAnyHours(room) {
    return room && getTotalHoursCount(room) > 0;
}

function showDeleteConfirm(room) {
    roomToDelete.value = room;
}

function confirmDelete() {
    if (!roomToDelete.value) return;

    deleteRoom(roomToDelete.value.id)
        .then(() => {
            rooms.value = rooms.value.filter(room => room.id !== roomToDelete.value.id);
            roomToDelete.value = null;
        })
        .catch(error => {
            console.error('Error eliminant sala:', error);
        });
}

function showEditModal(room) {
    roomToEdit.value = { ...room }; // Clonar per evitar modificacions directes
}

function handleRoomUpdated(updatedRoom) {
    // Actualitzar la sala a la llista
    const index = rooms.value.findIndex(r => r.id === updatedRoom.id);
    if (index !== -1) {
        rooms.value[index] = updatedRoom;
    }
    roomToEdit.value = null;
}

function goToNewRoom() {
    router.push({ name: 'new-room' });
}
</script>

<style scoped>
.animate-fade-in {
    animation: fadeIn 0.5s ease forwards;
    opacity: 0;
}

.animate-expand {
    animation: expand 0.3s ease-out forwards;
    transform-origin: top;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes expand {
    from {
        opacity: 0;
        transform: scaleY(0);
    }

    to {
        opacity: 1;
        transform: scaleY(1);
    }
}

button {
    transition: all 0.2s ease;
}

button:hover {
    transform: translateY(-2px);
}
</style>