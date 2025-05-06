<template>
    <div>
        <h1>Rooms</h1>
        <h2>RoomList</h2>
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
});
</script>

<style scoped></style>