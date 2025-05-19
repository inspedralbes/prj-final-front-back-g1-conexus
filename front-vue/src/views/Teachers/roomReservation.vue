<template>
    <div>
        <h1 style="font-size: 2.5rem; font-weight: bold; margin-bottom: 0.5rem;">Rooms</h1>
        <h2 style="font-size: 1.5rem; color: #555; margin-bottom: 1.5rem;">Room List</h2>
        <div v-for="room in rooms" :key="room.id">
            <roomCard :room="room" />
        </div>

    </div>
</template>

<script setup>
import roomCard from "@/components/RoomReservation/roomCard.vue";
import { onMounted, ref } from "vue";
import { getAllRooms } from "@/services/communicationsScripts/roomReservationsComManager";
const rooms = ref([]);

onMounted(async () => {
    rooms.value = await getAllRooms();
    rooms.value = rooms.value.filter((room) => room.available==true);
});
</script>

<style scoped></style>