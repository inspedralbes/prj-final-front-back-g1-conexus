<template>
    <div class="new-room-container">
        <h1>Crear nova sala</h1>
        <form @submit.prevent="createRoom">
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
                        <input type="checkbox" :id="`enable-${day}`" v-model="dayEnabled[day]" @click="deleteRanges(day)"  />
                        <label :for="`enable-${day}`">{{ translatedDay(day) }}</label>
                    </h4>
                    <div v-if="dayEnabled[day]">
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
            <input type="submit" value="Crear sala" />
        </form>
        <button @click="GoBack()">Tornar al menú</button>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { createNewRoom } from '@/services/communicationsScripts/roomReservationsComManager';
import { useRouter } from 'vue-router';

const router = useRouter();

const roomName = ref('');
const roomDescription = ref('');
const roomHours = ref({
    monday: [{ startHour: 0, startMinute: 0, endHour: 0, endMinute: 0 }],
    tuesday: [{ startHour: 0, startMinute: 0, endHour: 0, endMinute: 0 }],
    wensday: [{ startHour: 0, startMinute: 0, endHour: 0, endMinute: 0 }],
    thursday: [{ startHour: 0, startMinute: 0, endHour: 0, endMinute: 0 }],
    friday: [{ startHour: 0, startMinute: 0, endHour: 0, endMinute: 0 }],
});
const dayEnabled = ref({
    monday: false,
    tuesday: false,
    wensday: false,
    thursday: false,
    friday: false,
});

function GoBack() {
    router.push({ name: 'admin-config-rooms' });
}

function addTimeRange(day) {
    roomHours.value[day].push({ startHour: 0, startMinute: 0, endHour: 0, endMinute: 0 });
}

function removeTimeRange(day, index) {
    roomHours.value[day].splice(index, 1);
}

function deleteRanges(day) {
    if (!dayEnabled.value[day]) {
        roomHours.value[day] =[];
    }
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
    const roomData = {
        room_name: roomName.value,
        room_description: roomDescription.value,
        room_hours_available: formatRoomHours(roomHours.value, dayEnabled.value),
    };
    createNewRoom(roomData)
        .then(response => {
            console.log('Room created successfully:', response.data);
            routeer.push({ name: 'admin-config-rooms' });
        })
        .catch(error => {
            console.error('Error creating room:', error);
        });
}

function translatedDay(day) {
    const translations = {
        monday: 'Dilluns',
        tuesday: 'Dimarts',
        wensday: 'Dimecres',
        thursday: 'Dijous',
        friday: 'Divendres',
    };
    return translations[day] || day;
}
</script>

<style scoped>
input[type="text"], textarea {
    color: black;
}

select {
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