<template>
    <div class="courses-container">
        <div class="tabs">
            <button class="tab-button" :class="{ active: activeTab === 0 }" @click="activeTab = 0">Els meus
                cursos</button>
            <button class="tab-button" :class="{ active: activeTab === 1 }" @click="activeTab = 1">Els cursos sense
                assignar</button>
        </div>
        <div class="tab-content" v-if="activeTab === 0">
            <h2 class="tab-title">Els meus cursos</h2>
            <div class="course-card" v-for="course in myCourses" :key="course.id">
                <h2 class="course-title">{{ course.course_name }}</h2>
                <p class="course-description">{{ course.course_description }}</p>
                <div class="buttons">
                    <button class="action-button" @click="leaveCourse(course.id)">Deixar el curs</button>
                </div>
            </div>
        </div>
        <div class="tab-content" v-if="activeTab === 1">
            <h2 class="tab-title">Cursos sense assignar</h2>
            <div class="course-card" v-for="course in unassignedCourses" :key="course.id">
                <h2 class="course-title">{{ course.course_name }}</h2>
                <p class="course-description">{{ course.course_description }}</p>
                <div class="buttons">
                    <button class="action-button" @click="assignCourse(course.id)">Assignar-me al curs</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getAllCourses,assignTeacher,desassignTeacher } from '@/services/communicationsScripts/mainManager';
import { useAppStore } from '@/stores/index.js';
import { useRouter } from 'vue-router';
const router = useRouter();
const store = useAppStore();
const activeTab = ref(0);
const courses = ref([]);
const myCourses = ref([]);
const unassignedCourses = ref([]);

onMounted(async () => {
    courses.value = await getAllCourses();
    const appStore = useAppStore();
    const userId = appStore.user.id; // Assuming the user ID is stored in the app store

    // Filter courses into myCourses and unassignedCourses
    myCourses.value = courses.value.filter(course => course.course_teacher_id === userId);
    unassignedCourses.value = courses.value.filter(course => course.course_teacher_id==null);

    console.log('My Courses:', myCourses.value);
    console.log('Unassigned Courses:', unassignedCourses.value);
});

function assignCourse(courseId) {
    assignTeacher(courseId, store.user.id).then(() => {
        unassignedCourses.value = unassignedCourses.value.filter(course => course.id !== courseId);
        myCourses.value.push(courses.value.find(course => course.id === courseId));
    }).catch((error) => {
        console.error(error);
        alert("Error al assignar-te al curs");
    });
}
function leaveCourse(courseId) {
    desassignTeacher(courseId, store.user.id).then(() => {
        myCourses.value = myCourses.value.filter(course => course.id !== courseId);
        unassignedCourses.value.push(courses.value.find(course => course.id === courseId));
    }).catch((error) => {
        console.error(error);
        alert("Error al deixar el curs");
    });
}
</script>

<style scoped>
.courses-container {
    padding: 20px;
}

.tabs {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
}

.tab-button {
    padding: 10px 20px;
    border: none;
    background-color: #007bff;
    cursor: pointer;
    border-radius: 5px;
    color: white;
}

.tab-button.active {
    background-color: #f0f0f0;
    color: black;
}

.tab-content {
    margin-top: 20px;
}

.tab-title {
    font-size: 1.5em;
    margin-bottom: 20px;
}

.course-card {
    border: 1px solid #ddd;
    padding: 15px;
    border-radius: 5px;
    margin-bottom: 15px;
    color:black;
    background-color: #f9f9f9;
}

.course-title {
    font-size: 1.2em;
    margin-bottom: 10px;
}

.course-description {
    margin-bottom: 15px;
}

.buttons {
    display: flex;
    gap: 10px;
}

.action-button {
    padding: 10px 15px;
    border: none;
    background-color: #007bff;
    color: white;
    cursor: pointer;
    border-radius: 5px;

}

.action-button:hover {
    background-color: #0056b3;
}
</style>