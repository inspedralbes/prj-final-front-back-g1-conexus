<template>
    <div class="container">
        <h1>Nova Tasca</h1>
        <button @click="goBack()">Tornar</button>
        <div class="form-group">
            <label for="taskName">Nom de la tasca:</label>
            <input type="text" id="task_name" v-model="task_name" />
        </div>
        <div class="form-group">
            <label for="taskDescription">Descripció:</label>
            <textarea id="taskDescription" v-model="task_description"></textarea>
        </div>
        <button @click="sendCreateTask">Crear Tasca</button>
    </div>
</template>
<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { userData } from '@/stores/userData.js'
import { createTask } from '@/services/gradesComManager.js'
import { useRouter } from 'vue-router'
const task_name = ref('')
const task_description = ref('')
const courseId = ref(null)
const router= useRouter()
onMounted(() => {
    const route = useRoute()
    courseId.value = route.params.courseId
})

function sendCreateTask() {
    const task = {
        task_name: task_name.value,
        task_description: task_description.value,
        course_id: courseId.value,
    }
    createTask(task).then(() => {
        router.push({ name: 'grades', params: { courseId: courseId.value } })
    })
}
function goBack() {
    router.push({ name: 'grades', params: { courseId: courseId.value } })
}
</script>
<style scoped></style>