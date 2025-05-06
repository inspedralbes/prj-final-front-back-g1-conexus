<template>
    <button @click="goToNewRoom" >Crear nova sala</button>

</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { getAllRooms } from '@/services/communicationsScripts/roomReservationsComManager';
import { useRouter } from 'vue-router';

const router = useRouter();

const rooms= ref([]);

onMounted(async () => {
    const response = await getAllRooms();
    rooms.value = response.data;
});

function goToNewRoom() {
    // Logic to navigate to the new room creation page
    // For example, using Vue Router:
    router.push({ name: 'new-room' });
}
</script>

<style scoped>
</style>