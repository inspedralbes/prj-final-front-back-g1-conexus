<template>
    <div class="min-h-screen bg-slate-900 py-8 px-4 sm:px-6 mt-9">
        <div
            class="max-w-4xl mx-auto bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-slate-700/50">
            <!-- Capçalera -->
            <div class="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
                <div class="flex items-center justify-between">
                    <h1 class="text-2xl font-bold flex items-center">
                        <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                        </svg>
                        Crear Nova Sala
                    </h1>
                    <button @click="GoBack()"
                        class="flex items-center text-sm bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors">
                        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Tornar
                    </button>
                </div>
            </div>

            <!-- Formulari -->
            <form @submit.prevent="createRoom" class="p-6 space-y-6">
                <!-- Nom i Descripció -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label class="block text-sm font-medium text-gray-300 mb-2">Nom de la sala</label>
                        <input type="text" id="roomName" v-model="roomName" required
                            class="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-3 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Ex: Aula 101" />
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-300 mb-2">Descripció</label>
                        <textarea id="roomDescription" v-model="roomDescription" required
                            class="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-3 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[100px]"
                            placeholder="Descripció de la sala..."></textarea>
                    </div>
                </div>

                <!-- Horari -->
                <div>
                    <label class="block text-sm font-medium text-gray-300 mb-4">Horari disponible</label>

                    <!-- Pestanyes de dies -->
                    <div class="mb-4 border-b border-slate-700">
                        <div class="flex flex-wrap -mb-px">
                            <button v-for="(ranges, day) in roomHours" :key="day" type="button" @click="activeDay = day"
                                :class="{
                                    'text-blue-400 border-blue-400': activeDay === day,
                                    'text-gray-400 border-transparent hover:text-gray-300': activeDay !== day
                                }" class="mr-2 py-2 px-4 border-b-2 font-medium text-sm flex items-center">
                                <input type="checkbox" :id="`enable-${day}`" v-model="dayEnabled[day]"
                                    @click.stop="handleDayToggle(day)"
                                    class="mr-2 rounded bg-slate-600 border-slate-500 text-blue-500 focus:ring-blue-500" />
                                {{ translatedDay(day) }}
                            </button>
                        </div>
                    </div>

                    <!-- Contingut de la pestanya activa -->
                    <div v-if="dayEnabled[activeDay]" class="bg-slate-700/30 rounded-lg p-4">
                        <div v-if="roomHours[activeDay].length === 0" class="text-center py-4 text-gray-500">
                            No hi ha horaris afegits per aquest dia
                        </div>

                        <div v-else class="space-y-4">
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
                                    class="p-2 text-red-400 hover:text-red-300 transition-colors" title="Eliminar rang">
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

                <!-- Resum d'horaris -->
                <div class="bg-slate-700/30 p-4 rounded-lg">
                    <h3 class="text-sm font-medium text-gray-300 mb-3">Resum d'horaris seleccionats</h3>
                    <div class="space-y-2">
                        <div v-for="(enabled, day) in dayEnabled" :key="day"
                            v-show="enabled && roomHours[day].length > 0"
                            class="flex items-center justify-between text-sm">
                            <span class="font-medium text-blue-400">{{ translatedDay(day) }}</span>
                            <div class="flex flex-wrap gap-2">
                                <span v-for="(range, index) in roomHours[day]" :key="index"
                                    class="bg-slate-600/50 px-2 py-1 rounded text-gray-300">
                                    {{ formatHourRange(range) }}
                                </span>
                            </div>
                        </div>
                        <div v-if="!hasAnyHours" class="text-center text-gray-500 py-2">
                            No hi ha horaris seleccionats encara
                        </div>
                    </div>
                </div>

                <!-- Botons d'acció -->
                <div class="flex justify-end space-x-3 pt-4 border-t border-slate-700">
                    <button type="button" @click="GoBack()"
                        class="px-6 py-2 border border-slate-600 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors">
                        Cancel·lar
                    </button>
                    <button type="submit"
                        :class="{ 'opacity-50 cursor-not-allowed': !isFormValid, 'hover:from-green-600 hover:to-green-700': isFormValid }"
                        class="px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg shadow transition-all duration-300"
                        :disabled="!isFormValid">
                        Crear Sala
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { createNewRoom } from '@/services/communicationsScripts/roomReservationsComManager';
import { useRouter } from 'vue-router';

const router = useRouter();
const activeDay = ref('monday'); // Pestanya activa per defecte

const roomName = ref('');
const roomDescription = ref('');
const roomHours = ref({
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
});
const dayEnabled = ref({
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
});

const hasAnyHours = computed(() => {
    return Object.keys(dayEnabled.value).some(day =>
        dayEnabled.value[day] && roomHours.value[day].length > 0
    );
});

const isFormValid = computed(() => {
    return roomName.value.trim() !== '' &&
        roomDescription.value.trim() !== '' &&
        hasAnyHours.value;
});

function GoBack() {
    router.push({ name: 'admin-config-rooms' });
}

function handleDayToggle(day) {
    if (!dayEnabled.value[day]) {
        roomHours.value[day] = [];
    } else {
        if (roomHours.value[day].length === 0) {
            roomHours.value[day] = [{ startHour: 8, startMinute: 0, endHour: 9, endMinute: 0 }];
        }
    }
}

function addTimeRange(day) {
    roomHours.value[day].push({ startHour: 8, startMinute: 0, endHour: 9, endMinute: 0 });
}

function removeTimeRange(day, index) {
    roomHours.value[day].splice(index, 1);
}

function formatHourRange(range) {
    return `${String(range.startHour).padStart(2, '0')}:00-${String(range.endHour).padStart(2, '0')}:00`;
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

function createRoom() {
    if (!isFormValid.value) return;

    const roomData = {
        room_name: roomName.value,
        room_description: roomDescription.value,
        room_hours_available: formatRoomHours(roomHours.value, dayEnabled.value),
    };

    createNewRoom(roomData)
        .then(response => {
            console.log('Sala creada correctament:', response.data);
            router.push({ name: 'admin-config-rooms' });
        })
        .catch(error => {
            console.error('Error creant la sala:', error);
        });
}

function translatedDay(day) {
    const translations = {
        monday: 'Dilluns',
        tuesday: 'Dimarts',
        wednesday: 'Dimecres',
        thursday: 'Dijous',
        friday: 'Divendres',
    };
    return translations[day] || day;
}
</script>

<style scoped>
/* Animacions */
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

/* Transicions per a les pestanyes */
.tab-enter-active,
.tab-leave-active {
    transition: opacity 0.3s ease;
}

.tab-enter-from,
.tab-leave-to {
    opacity: 0;
}

/* Barra de desplaçament */
::-webkit-scrollbar {
    width: 8px;
    height: 8px;
}

::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 4px;
}

::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.2);
}
</style>