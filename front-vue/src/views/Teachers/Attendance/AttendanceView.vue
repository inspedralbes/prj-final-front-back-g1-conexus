<template>
    <div class="attendance-view">
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
                <tr v-for="student in students" :key="index">
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
table {
    border-collapse: collapse;
    width: 100%;
    margin-top: 20px;
}
th, td {
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
.pageTitle {
    font-size: 24px;
    margin-bottom: 20px;
}
.day-picker {
    display: flex;
    flex-direction: column;
    margin-bottom: 20px;
}
label {
    margin-bottom: 5px;
}
select {
    margin-bottom: 10px;
    padding: 5px;
    border-radius: 4px;
    border: 1px solid #ccc;
}
.attendance-list {
    margin-top: 20px;
}
.attendance-list table {
    width: 100%;
    border-collapse: collapse;
}
.attendance-list th, .attendance-list td {
    border: 1px solid #ddd;
    padding: 8px;
}
.attendance-list th {
    background-color: #f2f2f2;
    text-align: left;
}
.attendance-list td {
    text-align: left;
}
.attendance-list tr:nth-child(even) {
    background-color: #f9f9f9;
}
.attendance-list tr:hover {
    background-color: #f1f1f1;
}
.attendance-list select {
    width: 100%;
    padding: 5px;
    border-radius: 4px;
    border: 1px solid #ccc;
}
*{
    font-family: 'Arial', sans-serif;
}
</style>