<template>
    <div class="container">
        <h1>My Courses</h1>
        <div class="course-list">
        <div class="course-item" v-for="course in courses" :key="course.id" @click="goToCourse(course.id)">
            <h2>{{ course.course_name }}</h2>
            <p>{{ course.course_description }}</p>
        </div>
        </div>
    </div>
</template>
<script setup>
import { useRoute } from 'vue-router'
import { userData } from '@/stores/userData.js'
import { onMounted, ref } from 'vue'
import { getCoursesFromUser } from '@/services/mainComManager.js'

const store = userData()
const courses = ref([])
onMounted(async () => {
    courses.value = await getCoursesFromUser(store.userId)
    console.log(courses.value)
})
</script>
<style scoped >

</style>