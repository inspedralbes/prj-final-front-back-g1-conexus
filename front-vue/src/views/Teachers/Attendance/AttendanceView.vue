<template>
    <div class="container animate-fade-in attendance-view">
        <button @click="goToMenu()">Tornar al menu</button>
        <h1 class="pageTitle">Asistencia al curs {{ hoursAvailable.course_name }} </h1>
        <div dayPicker class="day-picker">
            <label for="date">Data:</label>
            <input type="date" id="date"  v-model="selectedDate" @change="getAttendanceOfTheDay()"/>
            <label for="hour" v-if="thereIsClassThatDay()">Hora:</label>
            <select id="hour" v-model="selectedHour" v-if="thereIsClassThatDay()" @change="updateSelectedHour">
                <option v-for="hour in hoursAvailable[selectedDate && new Date(selectedDate).toLocaleString('en-US', { weekday: 'long' }).toLowerCase()] || []" :key="hour">{{ hour }}</option>
            </select>
            <h1 v-else>No hi ha clase aquest dia</h1>
        </div>
        <div class="attendance-list">
            <table v-if="attendance!=null && hoursAvailable!=null && thereIsClassAtThatHour()">
                <tr>
                    <th>ID</th>
                    <th>Nom</th>
                    <th>Status</th>
                </tr>
                <tr v-for="student in students" :key="student.user_id">
                    <td>{{ student.user_id }}</td>
                    <td>{{ student.name }}</td>
                    <td>
                        <select v-model="student.attendance" @change="sendUpdateAtendance(student.user_id, student.attendance)">
                            <option value="not selected">No seleccionat</option>
                            <option value="unjustified">Falta</option>
                            <option value="late">Retard</option>
                            <option value="yes">Present</option>
                            <option value="justified">Falta justificada</option>
                        </select>
                    </td>
                </tr>
            </table>
        </div>
    </div>
</template>


<script setup>
import { useRoute } from 'vue-router'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/index.js'
import { onMounted, ref } from 'vue'
import { getHoursOfCourse,  getAlumns } from '@/services/communicationsScripts/mainManager'
import {getAttendanceFromDay,updateAttendance} from '@/services/communicationsScripts/attendanceComManager.js'

const selectedDate = ref(new Date().toISOString().substr(0, 10))
const attendance = ref([])
const hoursAvailable = ref([])
const selectedHour=ref(null)
const students=ref([]);
const route = useRoute()
const courseId = route.params.courseId
const router=useRouter()

onMounted(async () => {
    hoursAvailable.value = await getHoursOfCourse(courseId)
    // attendance.value = await getAttendanceFromCourse(courseId, new Date().toISOString())
    console.log(attendance.value)
    students.value = await getAlumns(courseId)
    // students.forEach(student => {
    //     student.attendance="not selected"
    // });
    console.log(students.value)
    getAttendanceOfTheDay()
})
async function getAttendanceOfTheDay() {
    const date = new Date(selectedDate.value).toISOString()
    const data=await getAttendanceFromDay(courseId, date)
    students.value.forEach(student => {
        student.attendance = "not selected";
    });
    data.forEach(record => {
        if(record.hour==selectedHour.value){
            students.value.forEach(student => {
                if (student.id == record.student_id) {
                    student.attendance = record.status;
                }
            });
        }
    });
}

function goToMenu() {
    router.push({ name: 'teacher' })
}

function thereIsClassThatDay() {
    console.log("Selected date: ", selectedDate.value)
    console.log("Hours available: ", hoursAvailable.value)
    const dayOfWeek = new Date(selectedDate.value).toLocaleString('en-US', { weekday: 'long' }).toLowerCase();
    switch (dayOfWeek) {
        case 'monday':
            return hoursAvailable.value.monday!=null;
        case 'tuesday':
            return hoursAvailable.value.tuesday!=null;
        case 'wednesday':
            return hoursAvailable.value.wednesday!=null;
        case 'thursday':
            return hoursAvailable.value.thursday!=null;
        case 'friday':
            return hoursAvailable.value.friday!=null;
        case 'saturday':
            return hoursAvailable.value.saturday!=null;
        case 'sunday':
            return hoursAvailable.value.sunday!=null;
        default:
            return false;
    }
}

function thereIsClassAtThatHour() {
    const dayOfWeek = new Date(selectedDate.value).toLocaleString('en-US', { weekday: 'long' }).toLowerCase();
    const selectedHourValue = selectedHour.value;
    return (
        hoursAvailable.value[dayOfWeek] &&
        hoursAvailable.value[dayOfWeek].some(hourRange => hourRange.includes(selectedHourValue))
    );
}

function sendUpdateAtendance(id, status) {
    let adaptedSelectedHour = selectedHour.value.split(" ")[0]
    let adaptedSelectedDate = selectedDate.value.split("T")[0]
    console.log("Selected date: ", adaptedSelectedDate)
    console.log("Selected hour: ", adaptedSelectedHour)
    updateAttendance(courseId, id,adaptedSelectedHour,status,adaptedSelectedDate).then(() => {
        console.log("Actualitzat")
    }).catch((error) => {
        console.log(error)
    })

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

/* Container and dark theme */
.container {
    max-width: 900px;
    margin: 0 auto;
    padding: 24px;
    background: rgba(30, 41, 59, 0.85);
    border-radius: 12px;
    box-shadow: 0 2px 16px rgba(0,0,0,0.18);
    color: #e2e8f0;
}

/* Headings */
h1, .pageTitle {
    margin-bottom: 12px;
    color: #f1f5f9;
    letter-spacing: 1px;
    font-size: 24px;
}

/* Button styles */
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

/* Table styles */
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
.attendance-list tr:nth-child(even) {
    background-color: rgba(30,41,59,0.35);
}
.attendance-list tr:hover {
    background-color: #1e293b;
}

/* Day picker styles */
.day-picker {
    display: flex;
    flex-direction: column;
    margin-bottom: 20px;
    gap: 8px;
}

/* Label styles */
label {
    font-size: 1rem;
    user-select: none;
    color: #cbd5e1;
    display: flex;
    align-items: center;
    gap: 6px;
}

/* Input, select, textarea styles */
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
select {
    margin-bottom: 10px;
}

/* Date input dark style */
input[type="date"] {
    color-scheme: dark;
}

/* Placeholder color */
::-webkit-input-placeholder { color: #64748b; }
::-moz-placeholder { color: #64748b; }
:-ms-input-placeholder { color: #64748b; }
::placeholder { color: #64748b; }

/* Font */
*{
    font-family: 'Arial', sans-serif;
}
</style>

