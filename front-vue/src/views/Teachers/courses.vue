<template>
    <div>
        <button @click="activeTab = 0">Els meus cursos</button>
        <button @click="activeTab = 1">Els cursos sense assignar</button>
        <div v-if="activeTab === 0">
            <h2>Els meus cursos</h2>
            <div v-for="course in myCourses" :key="course.id">
                <h2>{{ course.course_name }}</h2>
                <p>{{ course.course_description }}</p>
                <div class="Buttons">
                    <button @click="leaveCourse(course.id)">Deixar el curs</button>
                </div>
            </div>
        </div>
        <div v-if="activeTab === 1">
            <h2>Cursos sense assignar</h2>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getAllCourses } from '@/services/communicationsScripts/mainManager';
import { useAppStore } from '@/stores/index.js';

const activeTab = ref(0);
const courses = ref([]);
const myCourses = ref([]);
const unassignedCourses = ref([]);

onMounted(async () => {
    courses.value = await getAllCourses();
    const appStore = useAppStore();
    const userId = appStore.user.id; // Assuming the user ID is stored in the app store

    // Filter courses into myCourses and unassignedCourses
    myCourses.value = courses.value.filter(course => course.assignedTo === userId);
    unassignedCourses.value = courses.value.filter(course => !course.assignedTo);

    console.log('My Courses:', myCourses.value);
    console.log('Unassigned Courses:', unassignedCourses.value);
});
</script>
<style scoped></style>