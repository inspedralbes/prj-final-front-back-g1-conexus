<template>
    <div class="container">
        <h1>My Courses</h1>
        <div class="course-list">
            <div class="course-item" v-for="course in courses" :key="course.course_id">
                <h2>{{ course.course_name }}</h2>
                <p>{{ course.course_description }}</p>
                <div class="Buttons">
                    <button @click="goToAttendance(course.course_id)">Seleccionar</button>
        
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { useAppStore } from '@/stores/index.js'
import { onMounted, ref } from 'vue'
import { getCoursesWithUser } from '@/services/communicationsScripts/mainManager.js'
import { useRouter } from 'vue-router'

const store = useAppStore()
const courses = ref([])
const route = useRouter()
onMounted(async () => {
    courses.value = await getCoursesWithUser(3)
    console.log(courses.value)
})

function goToAttendance(id) {
    route.push({ name: 'grades-from-course-student', params: { id } })
}   

</script>
<style scoped>
.container {
    padding: 20px;
}
.course-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
}
.course-item {
    border: 1px solid #ccc;
    padding: 20px;
    border-radius: 5px;
    box-sizing: border-box;
}
.course-item h2 {
    margin: 0 0 10px;
}
.course-item p {
    margin: 0 0 20px;
}
.course-item .Buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
}
.course-item button {
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    background-color: #007bff;
    color: white;
    cursor: pointer;
    flex: 1 1 auto;
}
.course-item button:hover {
    background-color: #0056b3;
}
.course-item button:active {
    background-color: #004085;
}
.course-item button:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.5);
}
.course-item button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
}
.course-item button:disabled:hover {
    background-color: #ccc;
}
.course-item button:disabled:active {
    background-color: #ccc;
}
*{
    font-family: 'Arial', sans-serif;
}
/* Responsive adjustments */
@media (max-width: 768px) {
    .course-list {
        grid-template-columns: 1fr;
    }
    .course-item {
        width: 100%;
    }
    .course-item .Buttons {
        flex-direction: column;
    }
    .course-item button {
        width: 100%;
    }
}
</style>