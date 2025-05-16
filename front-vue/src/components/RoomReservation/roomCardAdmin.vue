<template>
    <div class="card">
        <h3>{{ props.room.room_name }}</h3>
        <h4>{{ props.room.room_description }}</h4>
        <div>
            <h5>Disponibilitat</h5>
            <ul>
                <li v-if="props.room.room_hours_available_monday.length > 0">
                    Dilluns: <ul>
                        <li v-for="hour in props.room.room_hours_available_monday" :key="hour">
                            {{ hour }}
                        </li>
                    </ul>
                </li>
                <li v-if="props.room.room_hours_available_tuesday.length > 0">
                    Dimarts: <ul>
                        <li v-for="hour in props.room.room_hours_available_tuesday" :key="hour">
                            {{ hour }}
                        </li>
                    </ul>
                </li>
                <li v-if="props.room.room_hours_available_wensday.length > 0">
                    Dimecres: <ul>
                        <li v-for="hour in props.room.room_hours_available_wensday" :key="hour">
                            {{ hour }}
                        </li>
                    </ul>
                </li>
                <li v-if="props.room.room_hours_available_thursday.length > 0">
                    Dijous: <ul>
                        <li v-for="hour in props.room.room_hours_available_thursday" :key="hour">
                            {{ hour }}
                        </li>
                    </ul>
                </li>
                <li v-if="props.room.room_hours_available_friday.length > 0">
                    Divendres: <ul>
                        <li v-for="hour in props.room.room_hours_available_friday" :key="hour">
                            {{ hour }}
                        </li>
                    </ul>
                </li>
            </ul>
            <button @click="showModal = true">Editar</button>
            <button @click="eliminar(room.id)">Eliminar</button>
        </div>

        <!-- Modal -->
        <div v-if="showModal" class="modal">
            <div class="modal-content">
                <h3>Editar sala</h3>
                <form @submit.prevent="sendUpdateRoom">
                    <div class="form-group">
                        <label for="roomName">Nom de la sala:</label>
                        <input type="text" id="roomName" v-model="roomName" required />
                    </div>
                    <div class="form-group">
                        <label for="roomDescription">Descripció:</label>
                        <textarea id="roomDescription" v-model="roomDescription" required></textarea>
                    </div>
                    <div class="form-group">
                        <label for="roomHours">Horari disponible:</label>
                        <div v-for="(ranges, day) in roomHours" :key="day" class="day-group">
                            <h4>
                                <input type="checkbox" :id="`enable-${day}`" v-model="dayEnabled[day]" @click="deleteAllHorsFromDay(day)" />
                                <label :for="`enable-${day}`">{{ translatedDay(day) }}</label>
                            </h4>
                            <div v-if="dayEnabled[day]" style="max-height: 300px; overflow-y: auto;">
                                <div v-for="(range, index) in ranges" :key="index" class="time-range">
                                    <label :for="`startHour-${day}-${index}`">Inici:</label>
                                    <select :id="`startHour-${day}-${index}`" v-model="range.startHour">
                                        <option v-for="hour in 24" :key="hour" :value="hour">{{ hour }}</option>
                                    </select>
                                    :
                                    <select :id="`startMinute-${day}-${index}`" v-model="range.startMinute">
                                        <option v-for="minute in [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55]" :key="minute" :value="minute">{{ minute }}</option>
                                    </select>
                                    -
                                    <label :for="`endHour-${day}-${index}`">Fi:</label>
                                    <select :id="`endHour-${day}-${index}`" v-model="range.endHour">
                                        <option v-for="hour in 24" :key="hour" :value="hour">{{ hour }}</option>
                                    </select>
                                    :
                                    <select :id="`endMinute-${day}-${index}`" v-model="range.endMinute">
                                        <option v-for="minute in [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55]" :key="minute" :value="minute">{{ minute }}</option>
                                    </select>
                                    <button type="button" @click="removeTimeRange(day, index)">Eliminar</button>
                                </div>
                                <button type="button" @click="addTimeRange(day)">Afegir rang horari</button>
                            </div>
                        </div>
                    </div>
                    <input type="submit" value="Guardar canvis" />
                </form>
                <button @click="showModal = false">Tancar</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, toRefs } from 'vue';
import { useRouter } from 'vue-router';
import { getAllRooms, updateRoom } from '@/services/communicationsScripts/roomReservationsComManager';
import { defineProps, defineEmits } from 'vue';
const props = defineProps({
    room: {
        type: Object,
        required: true
    },
    callDeleteRoom: {
        type: Function,
        required: true
    }
});
const emit = defineEmits(['callDeleteRoom']);

const showModal = ref(false);
const { room } = toRefs(props);

const roomName = ref(room.value.room_name);
const roomDescription = ref(room.value.room_description);

// Helper function to parse time ranges
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
    wensday: room.value.room_hours_available_wensday.length  >0,
    thursday: room.value.room_hours_available_thursday.length >0,
    friday: room.value.room_hours_available_friday.length >0,
});


function deleteAllHorsFromDay(day) {
    if(dayEnabled.value[day]) {
        roomHours.value[day] = parseTimeRanges(room.value[`room_hours_available_${day}`]);
    } else {
        roomHours.value[day] = [];
    }
    roomHours.value[day] = [];
}

function addTimeRange(day) {
    roomHours.value[day].push({ startHour: 0, startMinute: 0, endHour: 0, endMinute: 0 });
}

function removeTimeRange(day, index) {
    roomHours.value[day].splice(index, 1);
}

function eliminar(id) {
    console.log(id);
    emit('callDeleteRoom', props.room.id);
}
function GoBack() {
    const router = useRouter();
    router.push({ name: 'admin-config-rooms' });
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
            showModal.value = false; // Close the modal after updating
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
.modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
}

.modal-content {
    background: white;
    padding: 20px;
    border-radius: 8px;
    text-align: center;
    color: black;
}

.card {
    border: 1px solid #ccc;
    border-radius: 8px;
    padding: 20px;
    margin: 10px;
    background-color: #f9f9f9;
    color: black;
}

.card h3 {
    margin: 0;
    font-size: 1.5em;
}

.card h4 {
    margin: 0;
    font-size: 1.2em;
    color: #666;
}

.card ul {
    list-style-type: none;
    padding: 0;
}

.card button {
    background-color: #007bff;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
}

input[type="text"], textarea, select {
    color: black;
    background-color: white;
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 5px;
    font-size: 14px;
}

button {
    margin-top: 5px;
    margin-left: 5px;
}
</style>