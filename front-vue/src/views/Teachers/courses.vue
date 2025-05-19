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
/* Fade-in animation */
.animate-fade-in {
    animation: fadeIn 0.6s ease-out forwards;
}
@keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px);}
    to { opacity: 1; transform: translateY(0);}
}

/* Main container */
.courses-container {
    max-width: 900px;
    margin: 0 auto;
    padding: 24px;
    background: rgba(30, 41, 59, 0.85);
    border-radius: 12px;
    box-shadow: 0 2px 16px rgba(0,0,0,0.18);
    color: #e2e8f0;
}

/* Tabs */
.tabs {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
}

.tab-button {
    margin-right: 8px;
    padding: 7px 18px;
    border: none;
    border-radius: 5px;
    background: #2563eb;
    color: #f1f5f9;
    cursor: pointer;
    transition: background 0.2s, transform 0.2s;
    font-weight: 500;
    box-shadow: 0 1px 4px rgba(0,0,0,0.10);
}
.tab-button.active {
    background: #f0f0f0;
    color: #1e293b;
    font-weight: 600;
}
.tab-button:hover {
    background: #1d4ed8;
    color: #fff;
    transform: translateY(-1px) scale(1.03);
}

/* Tab content */
.tab-content {
    margin-top: 20px;
    animation: fadeIn 0.6s ease-out;
}

/* Titles */
.tab-title {
    font-size: 1.5em;
    margin-bottom: 20px;
    color: #f1f5f9;
    letter-spacing: 1px;
}

/* Course card */
.course-card {
    border: 1px solid #334155;
    padding: 18px 20px;
    border-radius: 8px;
    margin-bottom: 18px;
    color: #e2e8f0;
    background: rgba(17, 24, 39, 0.7);
    box-shadow: 0 1px 8px rgba(0,0,0,0.10);
    transition: box-shadow 0.2s, background 0.2s;
}
.course-card:hover {
    background: #1e293b;
    box-shadow: 0 2px 16px rgba(0,0,0,0.18);
}

.course-title {
    font-size: 1.2em;
    margin-bottom: 10px;
    color: #f1f5f9;
    font-weight: 600;
}

.course-description {
    margin-bottom: 15px;
    color: #cbd5e1;
}

/* Buttons inside cards */
.buttons {
    display: flex;
    gap: 10px;
}

.action-button {
    padding: 7px 18px;
    border: none;
    border-radius: 5px;
    background: #2563eb;
    color: #f1f5f9;
    cursor: pointer;
    transition: background 0.2s, transform 0.2s;
    font-weight: 500;
    box-shadow: 0 1px 4px rgba(0,0,0,0.10);
}
.action-button:hover {
    background: #1d4ed8;
    color: #fff;
    transform: translateY(-1px) scale(1.03);
}

/* Font */
*{
    font-family: 'Arial', sans-serif;
}
</style>
