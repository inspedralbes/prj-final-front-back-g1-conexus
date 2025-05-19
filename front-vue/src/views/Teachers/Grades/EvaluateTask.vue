<template>
    <div class="container">
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
        <button @click="goBack()">Tornar</button>
    </div>
</template>
<script setup>
import { useRoute } from 'vue-router'
import { onMounted, ref } from 'vue'
import { useAppStore } from '@/stores/index.js'
import { getTask, updateGrade } from '@/services/communicationsScripts/gradesComManager.js'
import { useRouter } from 'vue-router'

const route = useRoute()
const taskId = route.params.taskId
const courseId = route.params.courseId
const users = ref([])
const router = useRouter()

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

function goBack() {
    router.push({ name: "teacher-grades", params: { courseId: courseId } })
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

/* Dialog transitions */
.fade-enter-active, .fade-leave-active {
    transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
    opacity: 0;
}
.pop-enter-active, .pop-leave-active {
    transition: all 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28);
}
.pop-enter-from, .pop-leave-to {
    opacity: 0;
    transform: scale(0.9) translateY(10px);
}

/* Smooth transitions */
input, textarea, select, button {
    transition: all 0.2s ease;
}

/* Button hover effect */
button:hover {
    transform: translateY(-1px);
}

/* Date input dark style */
input[type="date"] {
    color-scheme: dark;
}

/* Tooltip styles */
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
    box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06);
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
    border-radius: 12px;
    box-shadow: 0 2px 16px rgba(0,0,0,0.18);
    color: #e2e8f0; /* light text */
}

h1 {
    margin-bottom: 12px;
    color: #f1f5f9;
    letter-spacing: 1px;
}

button {
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
button:hover {
    background: #1d4ed8;
    color: #fff;
    transform: translateY(-1px) scale(1.03);
}

table {
    border-collapse: collapse;
    width: 100%;
    margin-top: 20px;
    background: rgba(17, 24, 39, 0.7);
    border-radius: 8px;
    overflow: hidden;
    color: #e2e8f0;
    font-size: 1.08rem;
    box-shadow: 0 1px 8px rgba(0,0,0,0.10);
}

th, td {
    border: 1px solid #334155;
    padding: 10px 12px;
    color: #e2e8f0;
}

th {
    background-color: rgba(51, 65, 85, 0.92);
    text-align: left;
    font-weight: 600;
    letter-spacing: 0.5px;
}

td {
    text-align: left;
    background: rgba(30, 41, 59, 0.65);
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
    background: rgba(30,41,59,0.92);
    color: #f1f5f9;
    border: 1px solid #334155;
    border-radius: 4px;
    padding: 7px 12px;
    font-size: 1rem;
    transition: border 0.2s, box-shadow 0.2s;
    box-shadow: 0 1px 2px rgba(0,0,0,0.08);
}

input:focus,
textarea:focus,
select:focus {
    border-color: #2563eb;
    outline: none;
    box-shadow: 0 0 0 2px #2563eb33;
}

input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
}
input[type="number"] {
    appearance: textfield;
    width: 70px;
    text-align: center;
    font-weight: 500;
    color: #38bdf8;
    background: rgba(17,24,39,0.85);
    border: 1px solid #334155;
}

input[type="number"]:focus {
    border-color: #38bdf8;
    color: #fbbf24;
    background: rgba(30,41,59,0.98);
}

::-webkit-input-placeholder { color: #64748b; }
::-moz-placeholder { color: #64748b; }
:-ms-input-placeholder { color: #64748b; }
::placeholder { color: #64748b; }
</style>