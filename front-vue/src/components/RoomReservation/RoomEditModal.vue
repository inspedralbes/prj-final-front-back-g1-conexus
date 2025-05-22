<template>
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="fixed inset-0 bg-black/60 backdrop-blur-sm" @click="$emit('close')"></div>
        <div
            class="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 w-full max-w-5xl border border-slate-700/50 shadow-2xl z-10 max-h-[90vh] overflow-y-auto animate-fade-in">
            <div class="flex justify-between items-center mb-6">
                <h3 class="text-2xl font-bold text-white">Editar sala</h3>
                <button @click="$emit('close')" class="text-gray-400 hover:text-white">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <form @submit.prevent="sendUpdateRoom" class="space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <label class="block text-sm font-medium text-gray-300 mb-2">Nom de la sala</label>
                        <input type="text" v-model="roomName" required
                            class="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-3 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-300 mb-2">Descripció</label>
                        <textarea v-model="roomDescription" required
                            class="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-3 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[100px]"></textarea>
                    </div>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                        <input type="checkbox" v-model="roomAvailable"
                            class="mr-2 rounded bg-slate-600 border-slate-500 text-blue-500 focus:ring-blue-500" />
                        Disponible
                    </label>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-300 mb-4">Configuració d'horari</label>

                    <!-- Selector de dies amb pestanyes -->
                    <div class="mb-4 border-b border-slate-700">
                        <div class="flex flex-wrap -mb-px">
                            <button v-for="(ranges, day) in roomHours" :key="day" @click="activeDay = day" type="button"
                                :class="{ 'text-blue-400 border-blue-400': activeDay === day, 'text-gray-400 border-transparent hover:text-gray-300': activeDay !== day }"
                                class="mr-2 py-2 px-4 border-b-2 font-medium text-sm flex items-center">
                                <input type="checkbox" :id="`enable-${day}`" v-model="dayEnabled[day]"
                                    @click.stop="deleteAllHorsFromDay(day)"
                                    class="mr-2 rounded bg-slate-600 border-slate-500 text-blue-500 focus:ring-blue-500" />
                                {{ translatedDay(day) }}
                            </button>
                        </div>
                    </div>

                    <!-- Contingut de la pestanya activa -->
                    <div v-if="dayEnabled[activeDay]" class="bg-slate-700/30 rounded-lg p-6">
                        <div v-if="roomHours[activeDay].length === 0" class="text-center py-4 text-gray-500">
                            No hi ha horaris afegits per aquest dia
                        </div>

                        <div v-else class="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                            <div v-for="(range, index) in roomHours[activeDay]" :key="index"
                                class="flex flex-wrap items-center gap-4 bg-slate-600/30 p-4 rounded-lg">
                                <div class="flex-1 min-w-[200px]">
                                    <label class="block text-xs text-gray-400 mb-1">Hora d'inici</label>
                                    <div class="flex items-center space-x-2">
                                        <select v-model="range.startHour"
                                            class="flex-1 bg-slate-700 border border-slate-600 rounded text-gray-200 px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500">
                                            <option v-for="hour in 24" :key="hour" :value="hour">{{
                                                String(hour).padStart(2, '0') }}:00</option>
                                        </select>
                                    </div>
                                </div>

                                <div class="flex-1 min-w-[200px]">
                                    <label class="block text-xs text-gray-400 mb-1">Hora de fi</label>
                                    <div class="flex items-center space-x-2">
                                        <select v-model="range.endHour"
                                            class="flex-1 bg-slate-700 border border-slate-600 rounded text-gray-200 px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500">
                                            <option v-for="hour in 24" :key="hour" :value="hour">{{
                                                String(hour).padStart(2, '0') }}:00</option>
                                        </select>
                                    </div>
                                </div>

                                <button type="button" @click="removeTimeRange(activeDay, index)"
                                    class="p-2 text-red-400 hover:text-red-300 transition-colors"
                                    title="Eliminar rang">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <button type="button" @click="addTimeRange(activeDay)"
                            class="mt-4 w-full flex items-center justify-center text-sm text-blue-400 hover:text-blue-300 transition-colors py-2 border border-dashed border-slate-600 rounded-lg">
                            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M12 4v16m8-8H4" />
                            </svg>
                            Afegir nou rang horari
                        </button>
                    </div>
                </div>

                <div class="flex justify-end space-x-3 pt-4 border-t border-slate-700">
                    <button type="button" @click="$emit('close')"
                        class="px-6 py-2 border border-slate-600 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors">
                        Cancel·lar
                    </button>
                    <button type="submit"
                        class="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow hover:from-blue-600 hover:to-blue-700 transition-all duration-300">
                        Guardar canvis
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, onMounted } from 'vue';
import { updateRoom } from '@/services/communicationsScripts/roomReservationsComManager';

const props = defineProps({
    room: {
        type: Object,
        required: true
    }
});

const emit = defineEmits(['close', 'room-updated']);

const activeDay = ref('monday');
const roomName = ref('');
const roomDescription = ref('');
const roomAvailable = ref(false);
function parseTimeRanges(hours) {
    if (!hours || !Array.isArray(hours)) return [];
    return hours.map(range => {
        const [start, end] = range.split('-');
        const [startHour] = start.split(':').map(Number);
        const [endHour] = end.split(':').map(Number);
        return { startHour, startMinute: 0, endHour, endMinute: 0 };
    });
}

const roomHours = ref({
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: []
});

const dayEnabled = ref({
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
});

onMounted(() => {
    // Inicialitzar amb les dades de la sala
    roomName.value = props.room.room_name;
    roomDescription.value = props.room.room_description;
    roomAvailable.value = props.room.available;
    roomHours.value = {
        monday: parseTimeRanges(props.room.room_hours_available_monday),
        tuesday: parseTimeRanges(props.room.room_hours_available_tuesday),
        wednesday: parseTimeRanges(props.room.room_hours_available_wednesday),
        thursday: parseTimeRanges(props.room.room_hours_available_thursday),
        friday: parseTimeRanges(props.room.room_hours_available_friday)
    };
    
    dayEnabled.value = {
        monday: props.room.room_hours_available_monday && props.room.room_hours_available_monday.length > 0,
        tuesday: props.room.room_hours_available_tuesday && props.room.room_hours_available_tuesday.length > 0,
        wednesday: props.room.room_hours_available_wednesday && props.room.room_hours_available_wednesday.length > 0,
        thursday: props.room.room_hours_available_thursday && props.room.room_hours_available_thursday.length > 0,
        friday: props.room.room_hours_available_friday && props.room.room_hours_available_friday.length > 0,
    };
});

function deleteAllHorsFromDay(day) {
    if (dayEnabled.value[day]) {
        roomHours.value[day] = parseTimeRanges(props.room[`room_hours_available_${day}`] || []);
    } else {
        roomHours.value[day] = [];
    }
}

function addTimeRange(day) {
    // Afegir un rang per defecte de 8:00 a 9:00
    roomHours.value[day].push({ startHour: 8, startMinute: 0, endHour: 9, endMinute: 0 });
}

function removeTimeRange(day, index) {
    roomHours.value[day].splice(index, 1);
}

function formatRoomHours(hours, enabledDays) {
    const formattedHours = {};
    for (const day in hours) {
        if (enabledDays[day]) {
            formattedHours[day] = hours[day].map(range => {
                const { startHour, startMinute, endHour, endMinute } = range;
                return `${String(startHour).padStart(2, '0')}:${String(startMinute).padStart(2, '0')}-${String(endHour).padStart(2, '0')}:${String(endMinute).padStart(2, '0')}`;
            });
        } else {
            formattedHours[day] = [];
        }
    }
    return formattedHours;
}

function translatedDay(day) {
    const translations = {
        monday: 'Dilluns',
        tuesday: 'Dimarts',
        wednesday: 'Dimecres',
        thursday: 'Dijous',
        friday: 'Divendres'
    };
    return translations[day] || day;
}

async function sendUpdateRoom() {
    const roomData = {
        room_name: roomName.value,
        room_description: roomDescription.value,
        room_hours_available: formatRoomHours(roomHours.value, dayEnabled.value),
        available: roomAvailable.value,
    };
    
    try {
        const response = await updateRoom(props.room.id, roomData);
        
        // Preparar la sala actualizada para emitir el evento
        const updatedRoom = {
            ...props.room,
            room_name: roomName.value,
            room_description: roomDescription.value,
            room_hours_available_monday: dayEnabled.value.monday ? formatRoomHours(roomHours.value, dayEnabled.value).monday : [],
            room_hours_available_tuesday: dayEnabled.value.tuesday ? formatRoomHours(roomHours.value, dayEnabled.value).tuesday : [],
            room_hours_available_wednesday: dayEnabled.value.wednesday ? formatRoomHours(roomHours.value, dayEnabled.value).wednesday : [],
            room_hours_available_thursday: dayEnabled.value.thursday ? formatRoomHours(roomHours.value, dayEnabled.value).thursday : [],
            room_hours_available_friday: dayEnabled.value.friday ? formatRoomHours(roomHours.value, dayEnabled.value).friday : [],
            available: roomAvailable.value,
        };
        
        emit('room-updated', updatedRoom);
    } catch (error) {
    }
}
</script>

<style scoped>
.animate-fade-in {
    animation: fadeIn 0.3s ease forwards;
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
</style>