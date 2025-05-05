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
            <tr v-for="grade in grades">
                <td>{{ grade.task_name }}</td>
                <td>{{ grade.grade }}</td>
            </tr>
        </table>
    </div>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import {useAppStore} from '@/stores/index.js';
import { getGradesFromUserAndCourse } from '@/services/communicationsScripts/gradesComManager.js';
import { useRouter } from 'vue-router';

const router=useRouter();
const courseId = ref(null);
const grades = ref([]);
onMounted(async () => {
    const route = useRoute();
    courseId.value = route.params.id;
    console.log(courseId.value);
    grades.value=await getGradesFromUserAndCourse(3, route.params.id);
    console.log(grades.value);
});
function goToHome() {
    router.push({ name: 'student-grades' });
}
</script>
<style scoped>

</style>