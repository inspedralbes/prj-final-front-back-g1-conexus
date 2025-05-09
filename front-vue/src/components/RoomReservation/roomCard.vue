<template>
    <div class="card">
        <h3>{{ props.room.room_name }}</h3>
        <h4>{{ props.room.room_description }}</h4>
        <div>
            <h5>Disponibilitat</h5>
            <ul>
                <li v-if="props.room.room_hours_available_monday">
                    Dilluns: <ul>
                        <li v-for="hour in props.room.room_hours_available_monday" :key="hour">
                            {{ hour }}
                        </li>
                    </ul>
                </li>
                <li v-if="props.room.room_hours_available_tuesday">
                    Dimarts: <ul>
                        <li v-for="hour in props.room.room_hours_available_tuesday" :key="hour">
                            {{ hour }}
                        </li>
                    </ul>
                </li>
                <li v-if="props.room.room_hours_available_wensday">
                    Dimecres: <ul>
                        <li v-for="hour in props.room.room_hours_available_wensday" :key="hour">
                            {{ hour }}
                        </li>
                    </ul>
                </li>
                <li v-if="props.room.room_hours_available_thursday">
                    Dijous: <ul>
                        <li v-for="hour in props.room.room_hours_available_thursday" :key="hour">
                            {{ hour }}
                        </li>
                    </ul>
                </li>
                <li v-if="props.room.room_hours_available_friday">
                    Divendres: <ul>
                        <li v-for="hour in props.room.room_hours_available_friday" :key="hour">
                            {{ hour }}
                        </li>
                    </ul>
                </li>
            </ul>
            <button @click="showModal = true">Reservar</button>
        </div>

        <!-- Modal -->
        <div v-if="showModal" class="modal">
            <div class="modal-content">
                <h3>Selecciona una data</h3>
                <input type="date" v-model="selectedDate" @change="filterHoursByDate" />
                <h3>Selecciona una hora</h3>
                <select v-model="selectedHour">
                    <option v-for="hour in filteredHours" :key="hour" :value="hour">
                        {{ hour }}
                    </option>
                </select>
          
                <div>
                    <button @click="reserveRoom" v-if="selectedDate&&selectedHour">Confirmar Reserva</button>
                    <button @click="showModal = false">Cancel·lar</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { defineProps, ref, computed, onMounted } from 'vue';
import {getReservationsFormRoom, createNewReservation} from "@/services/communicationsScripts/roomReservationsComManager";
const props = defineProps({
    room: {
        type: Object,
        required: true
    }
});
const filteredHours = ref([]);
const showModal = ref(false);
const selectedDate = ref(""); 
const reservations=ref([])
const selectedHour = ref(""); // Selected hour for reservation
// Combine all hours into a single array
const allHours = computed(() => {
    return [
        ...(props.room.room_hours_available_monday || []),
        ...(props.room.room_hours_available_tuesday || []),
        ...(props.room.room_hours_available_wensday || []),
        ...(props.room.room_hours_available_thursday || []),
        ...(props.room.room_hours_available_friday || [])
    ];
});

onMounted(async () => {
    // Fetch reservations for the room
    reservations.value = await getReservationsFormRoom(props.room.id);
    console.log(reservations.value);
});
function reserveRoom() {
    const newReservation = {
        room_id: props.room.id,
        start_time: new Date(`${selectedDate.value}T${selectedHour.value.split('-')[0]}`),
        end_time: new Date(`${selectedDate.value}T${selectedHour.value.split('-')[1]}`),
        user_id: 1 
    };
    createNewReservation(newReservation).then(response => {
        console.log("Reserva creada:", response);
    }).catch(error => {
        console.error("Error al crear la reserva:", error);
    })
    showModal.value = false; // Close the modal after reservation
}
function filterHoursByDate() {
   const day= new Date(selectedDate.value).getDay(); 
   selectedHour.value = ""; // Reset selected hour when date changes
    console.log(day);
    switch (day) {
        case 1:
            filteredHours.value = (props.room.room_hours_available_monday || []).filter(hour => {
                return !reservations.value.some(reservation => {
                    const reservedDate = new Date(reservation.start_time);
                    return reservedDate.toDateString() === new Date(selectedDate.value).toDateString() &&
                           reservedDate.getHours() === parseInt(hour.split(':')[0]);
                });
            });
            break;
        case 2:
            filteredHours.value = (props.room.room_hours_available_tuesday || []).filter(hour => {
                return !reservations.value.some(reservation => {
                    const reservedDate = new Date(reservation.start_time);
                    return reservedDate.toDateString() === new Date(selectedDate.value).toDateString() &&
                           reservedDate.getHours() === parseInt(hour.split(':')[0]);
                });
            });
            break;
        case 3:
            filteredHours.value = (props.room.room_hours_available_wensday || []).filter(hour => {
                return !reservations.value.some(reservation => {
                    const reservedDate = new Date(reservation.start_time);
                    return reservedDate.toDateString() === new Date(selectedDate.value).toDateString() &&
                           reservedDate.getHours() === parseInt(hour.split(':')[0]);
                });
            });
            break;
        case 4:
            filteredHours.value = (props.room.room_hours_available_thursday || []).filter(hour => {
                return !reservations.value.some(reservation => {
                    const reservedDate = new Date(reservation.start_time);
                    return reservedDate.toDateString() === new Date(selectedDate.value).toDateString() &&
                           reservedDate.getHours() === parseInt(hour.split(':')[0]);
                });
            });
            break;
        case 5:
            filteredHours.value = (props.room.room_hours_available_friday || []).filter(hour => {
                return !reservations.value.some(reservation => {
                    const reservedDate = new Date(reservation.start_time);
                    return reservedDate.toDateString() === new Date(selectedDate.value).toDateString() &&
                           reservedDate.getHours() === parseInt(hour.split(':')[0]);
                });
            });
            break;
        default:
            filteredHours.value = []; // No hours available for weekends
    }
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
    color:black;
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
</style>