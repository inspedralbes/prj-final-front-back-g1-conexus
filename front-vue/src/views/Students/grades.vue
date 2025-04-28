<template>
    <div class="grades">
        <h1>Notes</h1>
        <p>Aquí pots veure les notes del curs</p>
        <button @click="goToHome()">Tornar</button>
        <table>
            <tr>
                <th>Tasca</th>
                <th>Nota</th>
            </tr>
            <tr v-for="grade in grade">
                <td>{{ grade.task }}</td>
                <td>{{ grade.grade }}</td>
            </tr>
        </table>
    </div>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import {appStore} from '@/stores/index.js';

onMounted(() => {
    getGradesFromUserAndCourse(appStore.user.id);
});
</script>
<style scoped>

</style>