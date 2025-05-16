<template>
    <button @click="goToNewRoom" >Crear nova sala</button>
    <div>
        <h1>Gestió de Sales</h1>
        <h2>Llistat de Sales</h2>
        <div v-for="room in rooms" :key="room.id">
            <roomCardAdmin :room="room" @callDeleteRoom="callDeleteRoom"/>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { getAllRooms,deleteRoom } from '@/services/communicationsScripts/roomReservationsComManager';
import { useRouter } from 'vue-router';
import roomCardAdmin from '@/components/RoomReservation/roomCardAdmin.vue';
const router = useRouter();

const rooms= ref([]);

onMounted(async () => {
    const response = await getAllRooms();
    rooms.value = response;
    console.log(rooms.value);
});

function callDeleteRoom(roomId) {
    deleteRoom(roomId)
        .then(() => {
            rooms.value = rooms.value.filter(room => room.id !== roomId);
        })
        .catch(error => {
            console.error('Error deleting room:', error);
        });
}

function goToNewRoom() {
    // Logic to navigate to the new room creation page
    // For example, using Vue Router:
    router.push({ name: 'new-room' });
}

</script>

<style scoped>
</style>