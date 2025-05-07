<template>
    <div>
        <button @click="goToNewCourse">Crear nou curs</button>
        <div>
            <h1>Gestió de Cursos</h1>
            <h2>Llistat de Cursos</h2>
            <div v-for="course in courses" :key="course.id">
                <courseCardAdmin :course="course" />
            </div>
        </div>
    </div>

</template>
<script setup>
import { ref, onMounted } from 'vue';
import { getAllCourses } from '@/services/communicationsScripts/mainManager.js';
import { useRouter } from 'vue-router';
import courseCardAdmin from '@/components/Courses/courseCardAdmin.vue';

const router = useRouter();
const courses = ref([]);
onMounted(async () => {
    const response = await getAllCourses();
    courses.value = response;
    console.log(courses.value);
});
</script>
<style scoped></style>