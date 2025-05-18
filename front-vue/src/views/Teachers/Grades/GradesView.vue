<template>
    <div class="container animate-fade-in">
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
    router.push({ name: 'teacher' })
}

function goToEvaluar(taskId) {
    router.push({ name: 'evaluate', params: { taskId: taskId, courseId: courseId.value } })
}
</script>
<style scoped>
/* Animació d'aparició */
.animate-fade-in {
    animation: fadeIn 0.6s ease-out forwards;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Transicions pels diàlegs */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.pop-enter-active,
.pop-leave-active {
    transition: all 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28);
}

.pop-enter-from,
.pop-leave-to {
    opacity: 0;
    transform: scale(0.9) translateY(10px);
}

/* Transicions suaus */
input,
textarea,
select,
button {
    transition: all 0.2s ease;
}

/* Efectes hover */
button:hover {
    transform: translateY(-1px);
}

/* Estils per inputs de tipus date */
input[type="date"] {
    color-scheme: dark;
}

.tooltip .tooltiptext {
    visibility: hidden;
    width: max-content;
    background-color: #1e293b;
    color: #e2e8f0;
    text-align: center;
    border-radius: 8px;
    padding: 6px 6px;
    position: absolute;
    z-index: 1;
    bottom: 125%;
    left: 50%;
    transform: translateX(-50%) translateY(5px);
    opacity: 0;
    transition: all 0.2s cubic-bezier(0.18, 0.89, 0.32, 1.28);
    font-size: 0.75rem;
    border: 1px solid #334155;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.tooltip:hover .tooltiptext {
    visibility: visible;
    opacity: 1;
    transform: translateX(-50%) translateY(0);
}

.tooltip .tooltiptext::after {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: #1e293b transparent transparent transparent;
}

/* Semitransparent background and dark theme styles */
.container {
    max-width: 900px;
    margin: 0 auto;
    padding: 24px;
    background: rgba(30, 41, 59, 0.85); /* dark blue-gray, semitransparent */
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.12);
    color: #e2e8f0; /* light text */
}

.row {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

h1 {
    margin-bottom: 12px;
    color: #f1f5f9;
    letter-spacing: 1px;
}

button {
    margin-right: 8px;
    padding: 6px 16px;
    border: none;
    border-radius: 4px;
    background: #2563eb;
    color: #f1f5f9;
    cursor: pointer;
    transition: background 0.2s, transform 0.2s;
    font-weight: 500;
    box-shadow: 0 1px 2px rgba(0,0,0,0.08);
}

button:hover {
    background: #1d4ed8;
    color: #fff;
    transform: translateY(-1px);
}

table {
    border-collapse: collapse;
    width: 100%;
    margin-top: 20px;
    background: rgba(17, 24, 39, 0.7);
    border-radius: 6px;
    overflow: hidden;
    color: #e2e8f0;
}

th,
td {
    border: 1px solid #334155;
    padding: 8px;
    color: #e2e8f0;
}

th {
    background-color: rgba(51, 65, 85, 0.85);
    text-align: left;
    font-weight: 600;
    letter-spacing: 0.5px;
}

td {
    text-align: left;
    background: rgba(30, 41, 59, 0.6);
}

tr > td:last-child,
tr > td:nth-last-child(2) {
    white-space: nowrap;
}

label {
    font-size: 1rem;
    user-select: none;
    color: #cbd5e1;
    display: flex;
    align-items: center;
    gap: 6px;
}

input[type="checkbox"] {
    accent-color: #2563eb;
    width: 18px;
    height: 18px;
    border-radius: 4px;
    border: 1px solid #334155;
    background: #1e293b;
    transition: border 0.2s, box-shadow 0.2s;
}

input[type="checkbox"]:focus {
    outline: 2px solid #2563eb;
    box-shadow: 0 0 0 2px #2563eb33;
}

input,
textarea,
select {
    background: #1e293b;
    color: #e2e8f0;
    border: 1px solid #334155;
    border-radius: 4px;
    padding: 6px 10px;
    font-size: 1rem;
    transition: border 0.2s, box-shadow 0.2s;
}

input:focus,
textarea:focus,
select:focus {
    border-color: #2563eb;
    outline: none;
    box-shadow: 0 0 0 2px #2563eb33;
}
</style>