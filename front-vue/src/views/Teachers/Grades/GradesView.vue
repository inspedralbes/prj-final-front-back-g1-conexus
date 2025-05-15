<template>
    <div class="container">
        <div class="row">
            <h1>Registro de Notas</h1>
            <button @click="goToMenu()">Volver al menú</button>
            <button @click="goToCreateTask()">Crear nueva tarea</button>
            <div>
                <label>
                    <input type="checkbox" @click="changeFilter()" />
                    Ocultar tasques tancades
                </label>
            </div>
            <table>
                <tr>
                    <th>Tasca</th>
                    <th>Tancada</th>
                </tr>

                <tr v-for="task in filteredTasks" :key="task.id">
                    <td>{{ task.task_name }}</td>
                    <td>{{ task.task_ended ? 'Sí' : 'No' }}</td>
                    <td><button @click="goToEvaluar(task.id)">Evaluar</button></td>
                    <td>
                        <button v-if="task.task_ended" @click="reopenTask(task)">Reobrir</button>
                        <button v-else @click="close(task)">Tancar</button>
                    </td>
                </tr>

            </table>

        </div>
    </div>
</template>
<script setup>
import { useRoute } from 'vue-router'
// Removed unused import
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { onMounted, ref } from 'vue'
import { getTasksFromCourse, updateTask } from '@/services/communicationsScripts/gradesComManager.js'
const route = useRoute()
const tasks = ref([]);
const courseId = ref(null)
const hideClosed = ref(false)
const router = useRouter()


const filteredTasks = computed(() => {
    return tasks.value.filter(task => !hideClosed.value || !task.task_ended);
});

onMounted(async () => {
    courseId.value = route.params.courseId
    tasks.value = await getTasksFromCourse(courseId.value)
}
)

function reopenTask(task) {
    task.task_ended = false
    updateTask(task, task.id)
        .then((response) => {
            console.log('Tasca reoberta:', response.data);
        })
        .catch((error) => {
            console.error('Error reobrint tasca:', error);
        });

}

function close(task) {
    task.task_ended = true
    updateTask(task, task.id)
        .then((response) => {
            console.log('Tasca tancada:', response.data);
        })
        .catch((error) => {
            console.error('Error tancant tasca:', error);
        });
}

function goToCreateTask() {
    router.push({ name: 'createTask', params: { courseId: courseId.value } })
}

function changeFilter() {
    hideClosed.value = !hideClosed.value
}
function goToMenu() {
    router.push({ name: 'home' })
}

function goToEvaluar(taskId) {
    router.push({ name: 'evaluate', params: { taskId: taskId, courseId: courseId.value } })
}
</script>
<style scoped>
table {
    border-collapse: collapse;
    width: 100%;
    margin-top: 20px;
}

th,
td {
    border: 1px solid #ddd;
    padding: 8px;
}

th {
    background-color: #f2f2f2;
    text-align: left;
}

td {
    text-align: left;
}
</style>