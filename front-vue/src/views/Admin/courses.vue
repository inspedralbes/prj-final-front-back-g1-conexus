<template>
    <div>
        <button @click="toggleCreateCourse">Crear nou curs</button>
        <div>
            <h1>Gestió de Cursos</h1>
            <h2>Llistat de Cursos</h2>
            <div v-for="course in courses" :key="course.id">
                <courseCardAdmin :course="course" />
            </div>
        </div>

        <div v-if="showCreateCourse" class="modal">

            <div class="modal-content" style="max-height: 80vh; overflow-y: auto;">
                <h3>Crear Curs</h3>
                <form @submit.prevent="callCreateCourse">
                    <div class="form-group">
                        <label for="course_name">Nom del curs:</label>
                        <input type="text" id="course_name" v-model="newCourse.course_name" required />
                    </div>
                    <div class="form-group">
                        <label for="course_description">Descripció:</label>
                        <textarea id="course_description" v-model="newCourse.course_description" required></textarea>
                    </div>
                    <div class="form-group">
                        <label for="course_department_id">Departament:</label>
                        <select id="course_department_id" v-model="newCourse.course_department_id" @change="getTeachersFromDepartment(newCourse.course_department_id)" required>
                            <option v-for="department in departments" :key="department.id" :value="department.id">{{ department.name }}</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="course_teacher_id">Professor:</label>
                        <select id="course_teacher_id" v-model="newCourse.course_teacher_id" required>
                            <option v-for="teacher in teachers" :key="teacher.id" :value="teacher.id">{{ teacher.name }}</option>
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
                                    <select :id="`startHour-${day}-${index}`" v-model="range.startHour"
                                        class="time-select">
                                        <option v-for="hour in 24" :key="hour" :value="hour">{{ hour }}</option>
                                    </select>
                                    :
                                    <select :id="`startMinute-${day}-${index}`" v-model="range.startMinute"
                                        class="time-select">
                                        <option v-for="minute in [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55]"
                                            :key="minute" :value="minute">{{ minute }}</option>
                                    </select>
                                    -
                                    <label :for="`endHour-${day}-${index}`" class="time-label">Fi:</label>
                                    <select :id="`endHour-${day}-${index}`" v-model="range.endHour" class="time-select">
                                        <option v-for="hour in 24" :key="hour" :value="hour">{{ hour }}</option>
                                    </select>
                                    :
                                    <select :id="`endMinute-${day}-${index}`" v-model="range.endMinute"
                                        class="time-select">
                                        <option v-for="minute in [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55]"
                                            :key="minute" :value="minute">{{ minute }}</option>
                                    </select>
                                    <button type="button" @click="removeTimeRange(day, index)"
                                        class="remove-button">Eliminar</button>
                                </div>
                                <button type="button" @click="addTimeRange(day)" class="add-button">Afegir rang
                                    horari</button>
                            </div>
                        </div>
                    </div>
                    <div>
                        <input type="submit" value="Guardar canvis" class="submit-button" />
                    <button class="close-button" @click="toggleModal">Tancar</button>
                    </div>
                    
                </form>
               
            </div>
        </div>
    </div>

</template>
<script setup>
import { ref, onMounted } from 'vue';
import { getAllCourses, createCourse, getAllDepartments, getAllTeachersFromDepartment } from '@/services/communicationsScripts/mainManager.js';
import { useRouter } from 'vue-router';
import courseCardAdmin from '@/components/Courses/courseCardAdmin.vue';

const departments= ref([]);
const teachers= ref([]);    
const router = useRouter();
const courses = ref([]);
const showCreateCourse = ref(false);
const newCourse = ref({
    course_name: '',
    course_description: '',
    course_hours_available: [],
    course_department_id: null,
    course_teacher_id: null,
});
const courseHours = ref({
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: [],
    sunday: [],
});
const dayEnabled = ref({
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
    sunday: false,
});
const translatedDays = {
    monday: 'Dilluns',
    tuesday: 'Dimarts',
    wednesday: 'Dimecres',
    thursday: 'Dijous',
    friday: 'Divendres',
    saturday: 'Dissabte',
    sunday: 'Diumenge',
};

function translatedDay(day) {
    return translatedDays[day] || day;
}

function addTimeRange(day) {
    if (dayEnabled.value[day]) {
        courseHours.value[day].push({ startHour: 0, startMinute: 0, endHour: 0, endMinute: 0 });
    }
}
function removeTimeRange(day, index) {
    if (dayEnabled.value[day]) {
        courseHours.value[day].splice(index, 1);
    }
}
function deleteAllHorsFromDay(day) {
    if (!dayEnabled.value[day]) {
        courseHours.value[day] = [];
    }
}

onMounted(async () => {
    const response = await getAllCourses();
    courses.value = response;
    console.log(courses.value);
    departments.value = await getAllDepartments();
});

async function getTeachersFromDepartment(departmentId) {

    return await getAllTeachersFromDepartment(departmentId).then((response) => {
        console.log(response);
        teachers.value = response;
    });
}

function toggleCreateCourse() {
    showCreateCourse.value = !showCreateCourse.value;
}
function callCreateCourse() {
    newCourse.value.course_hours_available = {
        monday: courseHours.value.monday.map(range => `${range.startHour}:${range.startMinute.toString().padStart(2, '0')}-${range.endHour}:${range.endMinute.toString().padStart(2, '0')}`),
        tuesday: courseHours.value.tuesday.map(range => `${range.startHour}:${range.startMinute.toString().padStart(2, '0')}-${range.endHour}:${range.endMinute.toString().padStart(2, '0')}`),
        wednesday: courseHours.value.wednesday.map(range => `${range.startHour}:${range.startMinute.toString().padStart(2, '0')}-${range.endHour}:${range.endMinute.toString().padStart(2, '0')}`),
        thursday: courseHours.value.thursday.map(range => `${range.startHour}:${range.startMinute.toString().padStart(2, '0')}-${range.endHour}:${range.endMinute.toString().padStart(2, '0')}`),
        friday: courseHours.value.friday.map(range => `${range.startHour}:${range.startMinute.toString().padStart(2, '0')}-${range.endHour}:${range.endMinute.toString().padStart(2, '0')}`),
    };
    createCourse(newCourse.value).then(async () => {
        courses.value = await getAllCourses();
        toggleCreateCourse();

    }).catch((error) => {
        console.error('Error creating course:', error);
    });
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

    max-width: 70%;
    color: black;
    /* Black text color */
}
.modal-contet form {
    display: flex;
    flex-direction: column;
    
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