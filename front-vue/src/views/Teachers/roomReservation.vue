<template>
    <!-- Main Content -->
    <div class="animate-fade-in mt-8 mb-8">
        <!-- Header Section -->
        <div class="mb-12 text-center">
            <h1 class="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                Reserva de Sales
            </h1>
            <p class="text-gray-300 mt-3 text-lg">Selecciona una sala i fes la teva reserva</p>
        </div>

        <!-- Rooms List -->
        <div class="max-w-4xl mx-auto px-4 space-y-6">
            <div v-for="room in rooms" :key="room.id" class="animate-fade-in" :style="{ animationDelay: `${rooms.indexOf(room) * 150}ms` }">
                <roomCard :room="room" @open-reservation="openReservationModal" />
            </div>
        </div>

        <!-- Empty State -->
        <div v-if="rooms.length === 0" class="text-center py-16">
            <div class="bg-slate-800/50 rounded-2xl p-8 max-w-md mx-auto">
                <svg class="w-16 h-16 mx-auto mb-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1"
                        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p class="text-xl text-gray-400">No hi ha sales disponibles en aquest moment</p>
            </div>
        </div>
    </div>

    <!-- Reservation Modal - Outside of main content -->
    <Teleport to="body">
        <div v-if="showModal" class="modal">
            <div class="modal-backdrop" @click="closeModal"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h3 class="modal-title">Nova Reserva - {{ selectedRoom?.room_name }}</h3>
                    <button class="close-button" @click="closeModal">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div class="modal-body">
                    <div class="form-group">
                        <label class="form-label">Data</label>
                        <input type="date" v-model="selectedDate" @change="filterHoursByDate"
                            class="form-input" />
                    </div>

                    <div class="form-group">
                        <label class="form-label">Hora</label>
                        <select v-model="selectedHour" class="form-select">
                            <option value="" disabled>Selecciona una hora</option>
                            <option v-for="hour in filteredHours" :key="hour" :value="hour">
                                {{ hour }}
                            </option>
                        </select>
                    </div>
                </div>

                <div class="modal-footer">
                    <button @click="closeModal" class="cancel-button">
                        Cancel·lar
                    </button>
                    <button @click="reserveRoom" v-if="selectedDate && selectedHour" class="confirm-button">
                        Confirmar Reserva
                    </button>
                </div>
            </div>
        </div>
    </Teleport>
</template>

<script setup>
import roomCard from "@/components/RoomReservation/roomCard.vue";
import { onMounted, ref, computed } from "vue";
import { getAllRooms, getReservationsFromRoom, createNewReservation } from "@/services/communicationsScripts/roomReservationsComManager";
import { useAppStore } from '@/stores/index.js';

const appStore = useAppStore();
const rooms = ref([]);
const showModal = ref(false);
const selectedRoom = ref(null);
const selectedDate = ref("");
const selectedHour = ref("");
const filteredHours = ref([]);
const reservations = ref([]);

onMounted(async () => {
    rooms.value = await getAllRooms();
    rooms.value = rooms.value.filter((room) => room.available == true);
});

function openReservationModal(room) {
    selectedRoom.value = room;
    showModal.value = true;
    loadReservations();
}

async function loadReservations() {
    if (selectedRoom.value) {
        reservations.value = await getReservationsFromRoom(selectedRoom.value.id);
    }
}

function closeModal() {
    showModal.value = false;
    selectedRoom.value = null;
    selectedDate.value = "";
    selectedHour.value = "";
    filteredHours.value = [];
}

function filterHoursByDate() {
    if (!selectedRoom.value || !selectedDate.value) return;

    const day = new Date(selectedDate.value).getDay();
    selectedHour.value = ""; // Reset selected hour when date changes

    let availableHours = [];
    switch (day) {
        case 1:
            availableHours = selectedRoom.value.room_hours_available_monday || [];
            break;
        case 2:
            availableHours = selectedRoom.value.room_hours_available_tuesday || [];
            break;
        case 3:
            availableHours = selectedRoom.value.room_hours_available_wednesday || [];
            break;
        case 4:
            availableHours = selectedRoom.value.room_hours_available_thursday || [];
            break;
        case 5:
            availableHours = selectedRoom.value.room_hours_available_friday || [];
            break;
        default:
            availableHours = [];
    }

    filteredHours.value = availableHours.filter((hour) => {
        return !reservations.value.some((reservation) => {
            const reservedDate = new Date(reservation.start_time);
            return (
                reservedDate.toDateString() === new Date(selectedDate.value).toDateString() &&
                reservedDate.getHours() === parseInt(hour.split(":")[0])
            );
        });
    });
}

function reserveRoom() {
    if (!selectedRoom.value || !selectedDate.value || !selectedHour.value) return;

    const newReservation = {
        room_id: selectedRoom.value.id,
        start_time: new Date(`${selectedDate.value}T${selectedHour.value.split("-")[0]}`),
        end_time: new Date(`${selectedDate.value}T${selectedHour.value.split("-")[1]}`),
        user_id: appStore.user.id,
    };

    createNewReservation(newReservation)
        .then((response) => {
            closeModal();
            // Opcional: Recargar las reservas o actualizar el estado
        })
        .catch((error) => {
            console.error("Error al crear la reserva:", error);
        });
}
</script>

<style scoped>
.animate-fade-in {
    animation: fadeIn 0.5s ease forwards;
    opacity: 0;
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

/* Modal Styles - Now with higher z-index */
.modal {
    position: fixed;
    inset: 0;
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
}

.modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(4px);
}

.modal-content {
    position: relative;
    background: #1E293B;
    border-radius: 1rem;
    width: 100%;
    max-width: 32rem;
    border: 1px solid rgba(148, 163, 184, 0.1);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.modal-header {
    padding: 1.5rem;
    border-bottom: 1px solid rgba(148, 163, 184, 0.1);
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.modal-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #F1F5F9;
}

.close-button {
    color: #94A3B8;
    padding: 0.5rem;
    border-radius: 0.5rem;
    transition: all 0.2s ease;
}

.close-button:hover {
    background: rgba(148, 163, 184, 0.1);
    color: #E2E8F0;
}

.modal-body {
    padding: 1.5rem;
}

.form-group {
    margin-bottom: 1.5rem;
}

.form-label {
    display: block;
    color: #E2E8F0;
    font-size: 0.875rem;
    font-weight: 500;
    margin-bottom: 0.5rem;
}

.form-input,
.form-select {
    width: 100%;
    background: rgba(51, 65, 85, 0.3);
    border: 1px solid rgba(148, 163, 184, 0.1);
    border-radius: 0.5rem;
    padding: 0.75rem;
    color: #F1F5F9;
    font-size: 0.875rem;
}

.form-input:focus,
.form-select:focus {
    outline: none;
    border-color: #3B82F6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}

.modal-footer {
    padding: 1.5rem;
    border-top: 1px solid rgba(148, 163, 184, 0.1);
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
}

.cancel-button {
    padding: 0.75rem 1.5rem;
    border: 1px solid rgba(148, 163, 184, 0.2);
    border-radius: 0.5rem;
    color: #E2E8F0;
    font-weight: 500;
    transition: all 0.2s ease;
}

.cancel-button:hover {
    background: rgba(148, 163, 184, 0.1);
}

.confirm-button {
    padding: 0.75rem 1.5rem;
    background: linear-gradient(to right, #3B82F6, #2563EB);
    border-radius: 0.5rem;
    color: white;
    font-weight: 500;
    transition: all 0.2s ease;
}

.confirm-button:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
}
</style>