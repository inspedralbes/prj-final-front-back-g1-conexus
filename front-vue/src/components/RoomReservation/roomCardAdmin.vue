<template>
    <div
        class="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-700/50">
        <!-- Capçalera de la sala -->
        <div class="flex items-start justify-between mb-4">
            <div>
                <h3 class="text-xl font-bold text-gray-200 flex items-center">
                    <svg class="w-5 h-5 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    {{ props.room.room_name }}
                </h3>
                <p class="text-gray-400 mt-1">{{ props.room.room_description }}</p>
            </div>
            <div class="flex space-x-2">
                <button @click="showModal = true"
                    class="p-2 bg-blue-500/20 rounded-lg hover:bg-blue-500/30 transition-colors text-blue-400"
                    title="Editar sala">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                </button>
                <button @click="eliminar(room.id)"
                    class="p-2 bg-red-500/20 rounded-lg hover:bg-red-500/30 transition-colors text-red-400"
                    title="Eliminar sala">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </button>
            </div>
        </div>

        <!-- Horari de disponibilitat -->
        <div class="mb-4">
            <h4 class="text-sm font-semibold text-gray-400 mb-2 flex items-center">
                <svg class="w-4 h-4 mr-1 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                DISPONIBILITAT
            </h4>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <!-- Dilluns -->
                <div v-if="props.room.room_hours_available_monday.length > 0" class="bg-slate-700/30 rounded-lg p-3">
                    <h5 class="font-medium text-gray-300 mb-1">Dilluns</h5>
                    <ul class="space-y-1">
                        <li v-for="hour in props.room.room_hours_available_monday" :key="hour"
                            class="text-sm text-gray-400">
                            {{ hour }}
                        </li>
                    </ul>
                </div>

                <!-- Dimarts -->
                <div v-if="props.room.room_hours_available_tuesday.length > 0" class="bg-slate-700/30 rounded-lg p-3">
                    <h5 class="font-medium text-gray-300 mb-1">Dimarts</h5>
                    <ul class="space-y-1">
                        <li v-for="hour in props.room.room_hours_available_tuesday" :key="hour"
                            class="text-sm text-gray-400">
                            {{ hour }}
                        </li>
                    </ul>
                </div>

                <!-- Dimecres -->
                <div v-if="props.room.room_hours_available_wensday.length > 0" class="bg-slate-700/30 rounded-lg p-3">
                    <h5 class="font-medium text-gray-300 mb-1">Dimecres</h5>
                    <ul class="space-y-1">
                        <li v-for="hour in props.room.room_hours_available_wensday" :key="hour"
                            class="text-sm text-gray-400">
                            {{ hour }}
                        </li>
                    </ul>
                </div>

                <!-- Dijous -->
                <div v-if="props.room.room_hours_available_thursday.length > 0" class="bg-slate-700/30 rounded-lg p-3">
                    <h5 class="font-medium text-gray-300 mb-1">Dijous</h5>
                    <ul class="space-y-1">
                        <li v-for="hour in props.room.room_hours_available_thursday" :key="hour"
                            class="text-sm text-gray-400">
                            {{ hour }}
                        </li>
                    </ul>
                </div>

                <!-- Divendres -->
                <div v-if="props.room.room_hours_available_friday.length > 0" class="bg-slate-700/30 rounded-lg p-3">
                    <h5 class="font-medium text-gray-300 mb-1">Divendres</h5>
                    <ul class="space-y-1">
                        <li v-for="hour in props.room.room_hours_available_friday" :key="hour"
                            class="text-sm text-gray-400">
                            {{ hour }}
                        </li>
                    </ul>
                </div>
            </div>
        </div>

        <!-- Modal d'edició -->
        <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div class="fixed inset-0 bg-black/60 backdrop-blur-sm" @click="showModal = false"></div>
            <div
                class="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 w-full max-w-2xl border border-slate-700/50 shadow-2xl z-10">
                <h3 class="text-xl font-bold text-white mb-4">Editar sala</h3>

                <form @submit.prevent="sendUpdateRoom" class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-300 mb-1">Nom de la sala:</label>
                        <input type="text" v-model="roomName" required
                            class="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-300 mb-1">Descripció:</label>
                        <textarea v-model="roomDescription" required
                            class="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[100px]"></textarea>
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-300 mb-2">Horari disponible:</label>
                        <div class="space-y-4">
                            <div v-for="(ranges, day) in roomHours" :key="day" class="bg-slate-700/30 rounded-lg p-4">
                                <div class="flex items-center mb-3">
                                    <input type="checkbox" :id="`enable-${day}`" v-model="dayEnabled[day]"
                                        @click="deleteAllHorsFromDay(day)"
                                        class="mr-2 rounded bg-slate-600 border-slate-500 text-blue-500 focus:ring-blue-500" />
                                    <label :for="`enable-${day}`" class="font-medium text-gray-300">{{
                                        translatedDay(day) }}</label>
                                </div>

                                <div v-if="dayEnabled[day]" class="space-y-3 max-h-[200px] overflow-y-auto pr-2">
                                    <div v-for="(range, index) in ranges" :key="index"
                                        class="flex flex-wrap items-center gap-2 bg-slate-600/30 p-3 rounded-lg">
                                        <div class="flex items-center space-x-1">
                                            <label class="text-xs text-gray-400">Inici:</label>
                                            <select v-model="range.startHour"
                                                class="bg-slate-700 border border-slate-600 rounded text-gray-200 px-2 py-1 text-sm focus:ring-blue-500 focus:border-blue-500">
                                                <option v-for="hour in 24" :key="hour" :value="hour">{{
                                                    String(hour).padStart(2, '0') }}</option>
                                            </select>
                                            <span>:</span>
                                            <select v-model="range.startMinute"
                                                class="bg-slate-700 border border-slate-600 rounded text-gray-200 px-2 py-1 text-sm focus:ring-blue-500 focus:border-blue-500">
                                                <option v-for="minute in [0, 15, 30, 45]" :key="minute" :value="minute">
                                                    {{ String(minute).padStart(2, '0') }}</option>
                                            </select>
                                        </div>

                                        <div class="flex items-center space-x-1">
                                            <label class="text-xs text-gray-400">Fi:</label>
                                            <select v-model="range.endHour"
                                                class="bg-slate-700 border border-slate-600 rounded text-gray-200 px-2 py-1 text-sm focus:ring-blue-500 focus:border-blue-500">
                                                <option v-for="hour in 24" :key="hour" :value="hour">{{
                                                    String(hour).padStart(2, '0') }}</option>
                                            </select>
                                            <span>:</span>
                                            <select v-model="range.endMinute"
                                                class="bg-slate-700 border border-slate-600 rounded text-gray-200 px-2 py-1 text-sm focus:ring-blue-500 focus:border-blue-500">
                                                <option v-for="minute in [0, 15, 30, 45]" :key="minute" :value="minute">
                                                    {{ String(minute).padStart(2, '0') }}</option>
                                            </select>
                                        </div>

                                        <button type="button" @click="removeTimeRange(day, index)"
                                            class="ml-auto text-red-400 hover:text-red-300 transition-colors"
                                            title="Eliminar rang">
                                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>

                                    <button type="button" @click="addTimeRange(day)"
                                        class="flex items-center text-sm text-blue-400 hover:text-blue-300 transition-colors mt-2">
                                        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M12 4v16m8-8H4" />
                                        </svg>
                                        Afegir rang horari
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="flex justify-end space-x-3 pt-4">
                        <button type="button" @click="showModal = false"
                            class="px-4 py-2 border border-slate-600 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors">
                            Cancel·lar
                        </button>
                        <button type="submit"
                            class="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow hover:from-blue-600 hover:to-blue-700 transition-all duration-300">
                            Guardar canvis
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, toRefs } from 'vue';
import { updateRoom } from '@/services/communicationsScripts/roomReservationsComManager';
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
    room: {
        type: Object,
        required: true
    }
});

const emit = defineEmits(['callDeleteRoom']);

const showModal = ref(false);
const { room } = toRefs(props);

const roomName = ref(room.value.room_name);
const roomDescription = ref(room.value.room_description);

function parseTimeRanges(hours) {
    return hours.map(range => {
        const [start, end] = range.split('-');
        const [startHour, startMinute] = start.split(':').map(Number);
        const [endHour, endMinute] = end.split(':').map(Number);
        return { startHour, startMinute, endHour, endMinute };
    });
}

const roomHours = ref({
    monday: room.value.room_hours_available_monday ? parseTimeRanges(room.value.room_hours_available_monday) : [],
    tuesday: room.value.room_hours_available_tuesday ? parseTimeRanges(room.value.room_hours_available_tuesday) : [],
    wensday: room.value.room_hours_available_wensday ? parseTimeRanges(room.value.room_hours_available_wensday) : [],
    thursday: room.value.room_hours_available_thursday ? parseTimeRanges(room.value.room_hours_available_thursday) : [],
    friday: room.value.room_hours_available_friday ? parseTimeRanges(room.value.room_hours_available_friday) : []
});

const dayEnabled = ref({
    monday: room.value.room_hours_available_monday.length > 0,
    tuesday: room.value.room_hours_available_tuesday.length > 0,
    wensday: room.value.room_hours_available_wensday.length > 0,
    thursday: room.value.room_hours_available_thursday.length > 0,
    friday: room.value.room_hours_available_friday.length > 0,
});

function deleteAllHorsFromDay(day) {
    if (dayEnabled.value[day]) {
        roomHours.value[day] = parseTimeRanges(room.value[`room_hours_available_${day}`]);
    } else {
        roomHours.value[day] = [];
    }
    roomHours.value[day] = [];
}

function addTimeRange(day) {
    roomHours.value[day].push({ startHour: 8, startMinute: 0, endHour: 9, endMinute: 0 });
}

function removeTimeRange(day, index) {
    roomHours.value[day].splice(index, 1);
}

function eliminar(id) {
    emit('callDeleteRoom', props.room.id);
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

function sendUpdateRoom() {
    const roomData = {
        room_name: roomName.value,
        room_description: roomDescription.value,
        room_hours_available: formatRoomHours(roomHours.value, dayEnabled.value),
    };
    updateRoom(props.room.id, roomData)
        .then(response => {
            console.log('Sala actualitzada correctament:', response.data);
            showModal.value = false;
        })
        .catch(error => {
            console.error('Error actualitzant la sala:', error);
        });
}

function translatedDay(day) {
    const translations = {
        monday: 'Dilluns',
        tuesday: 'Dimarts',
        wensday: 'Dimecres',
        thursday: 'Dijous',
        friday: 'Divendres'
    };
    return translations[day] || day;
}
</script>

<style scoped>
.animate-fade-in {
    animation: fadeIn 0.3s ease forwards;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(5px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Estils per a la barra de desplaçament */
::-webkit-scrollbar {
    width: 6px;
}

::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 3px;
}

::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.2);
}
</style>