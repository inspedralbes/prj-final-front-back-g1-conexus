<template>
    <div class="course-card">
        <h2>{{ course.course.course_name }}</h2>
        <p>{{ course.course.course_description }}</p>
        <p>Professor: {{ course.course.teacher.name }}</p>
        <p>Horari:</p>
        <div v-if="schedule.monday && schedule.monday.length > 0">
            <p>Dilluns:</p>
            <ul>
                <li v-for="hours in schedule.monday" :key="hours">{{ hours }}</li>
            </ul>
        </div>
        <div v-if="schedule.tuesday && schedule.tuesday.length > 0">
            <p>Dimarts:</p>
            <ul>
                <li v-for="hours in schedule.tuesday" :key="hours">{{ hours }}</li>
            </ul>
        </div>
        <div v-if="schedule.wednesday && schedule.wednesday.length > 0">
            <p>Dimecres:</p>
            <ul>
                <li v-for="hours in schedule.wednesday" :key="hours">{{ hours }}</li>
            </ul>
        </div>
        <div v-if="schedule.thursday && schedule.thursday.length > 0">
            <p>Dijous:</p>
            <ul>
                <li v-for="hours in schedule.thursday" :key="hours">{{ hours }}</li>
            </ul>
        </div>
        <div v-if="schedule.friday && schedule.friday.length > 0">
            <p>Divendres:</p>
            <ul>
                <li v-for="hours in schedule.friday" :key="hours">{{ hours }}</li>
            </ul>
        </div>
        <div class="button-group">
            <button class="edit-button" @click="toggleModal">Editar</button>
            <button class="delete-button" @click="callDeleteCourse(course.course.id)">Eliminar</button>
        </div>
    </div>

    <div v-if="showModal" class="modal">
        <div class="modal-content"  style="max-height: 80vh; overflow-y: auto;">
            <h3>Editar Curs</h3>
            <form @submit.prevent="sendUpdateCourse">
                <div class="form-group">
                    <label for="course_name">Nom del curs:</label>
                    <input type="text" id="course_name" v-model="course.course.course_name" required />
                </div>
                <div class="form-group">
                    <label for="course_description">Descripció:</label>
                    <textarea id="course_description" v-model="course.course.course_description" required></textarea>
                </div>
                <div class="form-group">
                    <label for="course_department_id">Departament:</label>
                    <select id="course_department_id" v-model="course.course.course_department_id" required @change="changeTeachers()">
                        <option v-for="department in departments" :key="department.id" :value="department.id">
                            {{ department.name }}
                        </option>
                    </select>
                 </div>
                 <div class="form-group">
                 <label for="course_teacher_id">Profesor</label>
                    <select id="course_teacher_id" v-model="course.course.course_teacher_id" required>
                        <option v-for="teacher in teachers" :key="teacher.id" :value="teacher.id">
                            {{ teacher.name }}
                        </option>
                    </select>
                 </div>
                <div class="form-group" style="max-height: 300px; overflow-y: auto;">
                    <div v-for="(ranges, day) in courseHours" :key="day" class="day-group">
                        <h4 class="day-header">
                            <input type="checkbox" :id="`enable-${day}`" v-model="dayEnabled[day]"
                                @click="deleteAllHorsFromDay(day)" />
                            <label :for="`enable-${day}`">{{ translatedDay(day) }}</label>
                        </h4>
                        <div v-if="dayEnabled[day]" class="day-schedule">
                            <div v-for="(range, index) in ranges" :key="index" class="time-range">
                                <label :for="`startHour-${day}-${index}`" class="time-label">Inici:</label>
                                <select :id="`startHour-${day}-${index}`" v-model="range.startHour" class="time-select">
                                    <option v-for="hour in 24" :key="hour" :value="hour">{{ hour }}</option>
                                </select>
                                :
                                <select :id="`startMinute-${day}-${index}`" v-model="range.startMinute" class="time-select">
                                    <option v-for="minute in [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55]"
                                        :key="minute" :value="minute">{{ String(minute).padStart(2, '0') }}</option>
                                </select>
                                -
                                <label :for="`endHour-${day}-${index}`" class="time-label">Fi:</label>
                                <select :id="`endHour-${day}-${index}`" v-model="range.endHour" class="time-select">
                                    <option v-for="hour in 24" :key="hour" :value="hour">{{ hour }}</option>
                                </select>
                                :
                                <select :id="`endMinute-${day}-${index}`" v-model="range.endMinute" class="time-select">
                                    <option v-for="minute in [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55]"
                                        :key="minute" :value="minute">{{ String(minute).padStart(2, '0') }}</option>
                                </select>
                                <button type="button" @click="removeTimeRange(day, index)" class="remove-button">Eliminar</button>
                            </div>
                            <button type="button" @click="addTimeRange(day)" class="add-button">Afegir rang horari</button>
                        </div>
                    </div>
                </div>
                <input type="submit" value="Guardar canvis" class="submit-button" />
            </form>
            <button class="close-button" @click="toggleModal">Tancar</button>
        </div>
    </div>

    <div v-if="showCreateModal" class="modal">
    
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { deleteCourse } from '@/services/communicationsScripts/mainManager.js';
import { updateCourse } from '@/services/communicationsScripts/mainManager.js';
import { getAllDepartments } from '@/services/communicationsScripts/mainManager.js';
import { getAllTeachersFromDepartment } from '@/services/communicationsScripts/mainManager.js';

const router = useRouter();
const showModal = ref(false);
const showCreateModal = ref(false);

const departments = ref([]);
const teachers = ref([]);
const course = defineProps({
    course: {
        type: Object,
        required: true,
    },
});
const schedule = ref([]);
const courseHours = ref({
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: []
});
const dayEnabled = ref({
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false
    });
function deleteAllHorsFromDay(day) {
    courseHours.value[day] = [];
}

function addTimeRange(day) {
    courseHours.value[day].push({ startHour: 0, startMinute: '00', endHour: 0, endMinute: '00' });
}

function removeTimeRange(day, index) {
    courseHours.value[day].splice(index, 1);
}

async function changeTeachers() {
    const departmentId = course.course.course_department_id;
    teachers.value = await getAllTeachersFromDepartment(departmentId);
}

function callDeleteCourse (courseId){
   deleteCourse(courseId).then(() => {
        router.go(0); // Refresh the page to remove the deleted course card
    });
};

onMounted(async () => {
    schedule.value.monday = course.course.course_hours_available.monday;
    schedule.value.tuesday = course.course.course_hours_available.tuesday;
    schedule.value.wednesday = course.course.course_hours_available.wednesday;
    schedule.value.thursday = course.course.course_hours_available.thursday;
    schedule.value.friday = course.course.course_hours_available.friday;
    courseHours.value.monday = schedule.value.monday.map((hours) => {
        const [startHour, startMinute, endHour, endMinute] = hours.split('-').map(Number);
        return { startHour, startMinute, endHour, endMinute };
    }); 
    departments.value = await getAllDepartments();
    teachers.value =await getAllTeachersFromDepartment(course.course.course_department_id);
});

function toggleModal() {
    showModal.value = !showModal.value;
    if (showModal.value) {
        Object.keys(schedule.value).forEach((day) => {
            if (schedule.value[day] && schedule.value[day].length > 0) {
                courseHours.value[day] = schedule.value[day].map((hours) => {
                    const [startTime, endTime] = hours.split('-');
                    const [startHour, startMinute] = startTime.split(':').map(Number);
                    const [endHour, endMinute] = endTime.split(':').map(Number);
                    return { startHour, startMinute, endHour, endMinute };
                });
                dayEnabled.value[day] = true;
            } else {
                courseHours.value[day] = [];
                dayEnabled.value[day] = false;
            }
        });
    }
}

function sendUpdateCourse() {
    const updatedCourse = {
        id: course.course.id,
        course_name: course.course.course_name,
        course_description: course.course.course_description,
        course_hours_available: {
            monday: courseHours.value.monday.map(range => `${range.startHour}:${String(range.startMinute).padStart(2, '0')}-${range.endHour}:${String(range.endMinute).padStart(2, '0')}`),
            tuesday: courseHours.value.tuesday.map(range => `${range.startHour}:${String(range.startMinute).padStart(2, '0')}-${range.endHour}:${String(range.endMinute).padStart(2, '0')}`),
            wednesday: courseHours.value.wednesday.map(range => `${range.startHour}:${String(range.startMinute).padStart(2, '0')}-${range.endHour}:${String(range.endMinute).padStart(2, '0')}`),
            thursday: courseHours.value.thursday.map(range => `${range.startHour}:${String(range.startMinute).padStart(2, '0')}-${range.endHour}:${String(range.endMinute).padStart(2, '0')}`),
            friday: courseHours.value.friday.map(range => `${range.startHour}:${String(range.startMinute).padStart(2, '0')}-${range.endHour}:${String(range.endMinute).padStart(2, '0')}`),
        },
        course_department_id: course.course.course_department_id,   
        course_teacher_id: course.course.course_teacher_id,
    };
    updateCourse(course.course.id,updatedCourse).then(() => {
        showModal.value = false;
    });
}

function translatedDay(day) {
    const days = {
        monday: 'Dilluns',
        tuesday: 'Dimarts',
        wednesday: 'Dimecres',
        thursday: 'Dijous',
        friday: 'Divendres',
    };
    return days[day] || day;
}


</script>

<style scoped>
.course-card {
    border: 1px solid #ccc;
    border-radius: 8px;
    padding: 16px;
    margin: 16px 0;
    background-color: #f9f9f9;
}

.course-card h2 {
    margin-bottom: 8px;
    color: #333;
}

.course-card p {
    margin: 4px 0;
    color: #555;
}

.button-group {
    margin-top: 16px;
}

.edit-button,
.delete-button {
    padding: 8px 16px;
    margin-right: 8px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    background-color: #2196f3;
    /* Blue color */
    color: white;
}

.modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
}

.modal-content {
    background-color: white;
    padding: 24px;
    border-radius: 8px;
    width: 80%;
    max-width: 600px;
    color: black;
    /* Black text color */
}

.form-group {
    margin-bottom: 16px;
}

.form-group label {
    display: block;
    margin-bottom: 8px;
    font-weight: bold;
    color: black;
    /* Black text color */
}

.form-group input,
.form-group textarea,
.form-group select {
    width: 100%;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
}

.submit-button {
    background-color: #2196f3;
    /* Blue color */
    color: white;
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.close-button {
    margin-top: 16px;
    background-color: #2196f3;
    /* Blue color */
    color: white;
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.add-button,
.remove-button {
    margin-top: 8px;
    padding: 4px 8px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.add-button {
    background-color: #2196f3;
    /* Blue color */
    color: white;
}

.remove-button {
    background-color: #f44336;
    color: white;
}

li {
    color: black;
}
.day-group {
    margin-bottom: 16px;
}
.day-header {
    font-weight: bold;
    margin-bottom: 8px;
    color: black;
}
.day-schedule {
    margin-left: 16px;
}
.time-range {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
}
.time-label {
    margin-right: 8px;
    color: black;
}
.time-select {
    margin-right: 8px;
    padding: 4px;
    border: 1px solid #ccc;
    border-radius: 4px;
}
.time-select:focus {
    outline: none;
    border-color: #2196f3;
    /* Blue color */
}
</style>
