<template>
    <div class="container">
        <!-- <h1>{{ task.task_name }}</h1> -->
        <table>
            <tr>
                <th>Alumne</th>
                <th>Nota</th>
            </tr>
            <tr v-for="alumn in users">
                <td>{{ alumn.name }}</td>
                <td><input type="number" v-model="alumn.grades" @change="sendNewScore(alumn)"></td>
            </tr>
        </table>
    </div>
</template>
<script setup>
import { useRoute } from 'vue-router'
import { onMounted, ref } from 'vue'
import { useAppStore } from '@/stores/index.js'
import { getTask, updateGrade } from '@/services/gradesComManager.js'

const route = useRoute()
const taskId = route.params.taskId
const courseId = route.params.courseId
const users = ref([])

onMounted(async () => {
    const store = useAppStore();
    users.value = await getTask(taskId, courseId)
    console.log(users.value)
})

function sendNewScore(alumn) {
    const id = alumn.user_id
    const grade = alumn.grades
    console.log(id, grade, taskId)
    updateGrade(id, grade, taskId)
}
</script>
<style scoped></style>