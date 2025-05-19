<template>
  <div class="card">
    <h3 class="room-title">{{ props.room.room_name }}</h3>
    <h4 class="room-desc">{{ props.room.room_description }}</h4>

    <div>
      <h5>Disponibilitat</h5>
      <ul>
        <li v-if="props.room.room_hours_available_monday">
          Dilluns:
          <ul>
            <li
              v-for="hour in props.room.room_hours_available_monday"
              :key="hour"
            >
              {{ hour }}
            </li>
          </ul>
        </li>
        <li v-if="props.room.room_hours_available_tuesday">
          Dimarts:
          <ul>
            <li
              v-for="hour in props.room.room_hours_available_tuesday"
              :key="hour"
            >
              {{ hour }}
            </li>
          </ul>
        </li>
        <li v-if="props.room.room_hours_available_wednesday">
          Dimecres:
          <ul>
            <li
              v-for="hour in props.room.room_hours_available_wednesday"
              :key="hour"
            >
              {{ hour }}
            </li>
          </ul>
        </li>
        <li v-if="props.room.room_hours_available_thursday">
          Dijous:
          <ul>
            <li
              v-for="hour in props.room.room_hours_available_thursday"
              :key="hour"
            >
              {{ hour }}
            </li>
          </ul>
        </li>
        <li v-if="props.room.room_hours_available_friday">
          Divendres:
          <ul>
            <li
              v-for="hour in props.room.room_hours_available_friday"
              :key="hour"
            >
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
          <button @click="reserveRoom" v-if="selectedDate && selectedHour">
            Confirmar Reserva
          </button>
          <button @click="showModal = false">Cancel·lar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, ref, computed, onMounted } from "vue";
import {
  getReservationsFromRoom,
  createNewReservation,
} from "@/services/communicationsScripts/roomReservationsComManager";
const props = defineProps({
  room: {
    type: Object,
    required: true,
  },
});
const filteredHours = ref([]);
const showModal = ref(false);
const selectedDate = ref("");
const reservations = ref([]);
const selectedHour = ref(""); // Selected hour for reservation
// Combine all hours into a single array
const allHours = computed(() => {
  return [
    ...(props.room.room_hours_available_monday || []),
    ...(props.room.room_hours_available_tuesday || []),
    ...(props.room.room_hours_available_wednesday || []),
    ...(props.room.room_hours_available_thursday || []),
    ...(props.room.room_hours_available_friday || []),
  ];
});

onMounted(async () => {
  // Fetch reservations for the room
  reservations.value = await getReservationsFromRoom(props.room.id);
  console.log(reservations.value);
});
function reserveRoom() {
  const newReservation = {
    room_id: props.room.id,
    start_time: new Date(
      `${selectedDate.value}T${selectedHour.value.split("-")[0]}`
    ),
    end_time: new Date(
      `${selectedDate.value}T${selectedHour.value.split("-")[1]}`
    ),
    user_id: 1,
  };
  createNewReservation(newReservation)
    .then((response) => {
      console.log("Reserva creada:", response);
    })
    .catch((error) => {
      console.error("Error al crear la reserva:", error);
    });
  showModal.value = false; // Close the modal after reservation
}
function filterHoursByDate() {
  const day = new Date(selectedDate.value).getDay();
  selectedHour.value = ""; // Reset selected hour when date changes
  console.log(day);
  switch (day) {
    case 1:
      filteredHours.value = (
        props.room.room_hours_available_monday || []
      ).filter((hour) => {
        return !reservations.value.some((reservation) => {
          const reservedDate = new Date(reservation.start_time);
          return (
            reservedDate.toDateString() ===
              new Date(selectedDate.value).toDateString() &&
            reservedDate.getHours() === parseInt(hour.split(":")[0])
          );
        });
      });
      break;
    case 2:
      filteredHours.value = (
        props.room.room_hours_available_tuesday || []
      ).filter((hour) => {
        return !reservations.value.some((reservation) => {
          const reservedDate = new Date(reservation.start_time);
          return (
            reservedDate.toDateString() ===
              new Date(selectedDate.value).toDateString() &&
            reservedDate.getHours() === parseInt(hour.split(":")[0])
          );
        });
      });
      break;
    case 3:
      filteredHours.value = (
        props.room.room_hours_available_wednesday || []
      ).filter((hour) => {
        return !reservations.value.some((reservation) => {
          const reservedDate = new Date(reservation.start_time);
          return (
            reservedDate.toDateString() ===
              new Date(selectedDate.value).toDateString() &&
            reservedDate.getHours() === parseInt(hour.split(":")[0])
          );
        });
      });
      break;
    case 4:
      filteredHours.value = (
        props.room.room_hours_available_thursday || []
      ).filter((hour) => {
        return !reservations.value.some((reservation) => {
          const reservedDate = new Date(reservation.start_time);
          return (
            reservedDate.toDateString() ===
              new Date(selectedDate.value).toDateString() &&
            reservedDate.getHours() === parseInt(hour.split(":")[0])
          );
        });
      });
      break;
    case 5:
      filteredHours.value = (
        props.room.room_hours_available_friday || []
      ).filter((hour) => {
        return !reservations.value.some((reservation) => {
          const reservedDate = new Date(reservation.start_time);
          return (
            reservedDate.toDateString() ===
              new Date(selectedDate.value).toDateString() &&
            reservedDate.getHours() === parseInt(hour.split(":")[0])
          );
        });
      });
      break;
    default:
      filteredHours.value = []; // No hours available for weekends
  }
}
</script>

<style scoped>
/* Fade-in animation */
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

/* Card container */
.card {
  max-width: 600px;
  margin: 18px auto;
  padding: 24px;
  background: rgba(30, 41, 59, 0.85);
  border-radius: 12px;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.18);
  color: #e2e8f0;
  transition: box-shadow 0.2s;
}
.card:hover {
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.22);
}
.card h3 {
  margin: 0 0 8px 0;
  font-size: 1.5em;
  color: #f1f5f9;
  letter-spacing: 0.5px;
}
.card h4 {
  margin: 0 0 16px 0;
  font-size: 1.1em;
  color: #94a3b8;
  font-weight: 400;
}
.card h5 {
  margin: 12px 0 6px 0;
  color: #cbd5e1;
  font-size: 1.08em;
  font-weight: 500;
}
.card ul {
  list-style-type: none;
  padding: 0;
  margin: 0 0 10px 0;
}
.card ul > li {
  margin-bottom: 6px;
}
.card ul ul {
  margin-left: 16px;
  margin-top: 2px;
}
.card ul ul li {
  font-size: 0.98em;
  color: #e2e8f0;
  background: rgba(17, 24, 39, 0.18);
  border-radius: 4px;
  padding: 2px 8px;
  display: inline-block;
  margin-right: 4px;
  margin-bottom: 2px;
}

/* Button styles */
button {
  margin-right: 8px;
  padding: 7px 18px;
  border: none;
  border-radius: 5px;
  background: #2563eb;
  color: #f1f5f9;
  cursor: pointer;
  transition: background 0.2s, transform 0.2s;
  font-weight: 500;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
}
button:hover {
  background: #1d4ed8;
  color: #fff;
  transform: translateY(-1px) scale(1.03);
}

/* Modal styles */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(15, 23, 42, 0.65);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 50;
}
.modal-content {
  background: rgba(30, 41, 59, 0.98);
  padding: 32px 28px 24px 28px;
  border-radius: 12px;
  text-align: center;
  color: #e2e8f0;
  min-width: 320px;
  box-shadow: 0 4px 32px rgba(0, 0, 0, 0.22);
  animation: fadeIn 0.5s;
}
.modal-content h3 {
  color: #f1f5f9;
  margin-bottom: 14px;
  font-size: 1.18em;
  font-weight: 600;
}
.modal-content select,
.modal-content input[type="date"] {
  margin-bottom: 18px;
  margin-top: 6px;
  width: 80%;
  background: rgba(30, 41, 59, 0.92);
  color: #f1f5f9;
  border: 1px solid #334155;
  border-radius: 4px;
  padding: 7px 12px;
  font-size: 1rem;
  transition: border 0.2s, box-shadow 0.2s;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
}
.modal-content input[type="date"] {
  color-scheme: dark;
}
.modal-content button {
  margin-top: 10px;
  margin-bottom: 0;
}

/* Placeholder color */
::-webkit-input-placeholder {
  color: #64748b;
}
::-moz-placeholder {
  color: #64748b;
}
:-ms-input-placeholder {
  color: #64748b;
}
::placeholder {
  color: #64748b;
}

/* Font */
* {
  font-family: "Arial", sans-serif;
}
</style>
