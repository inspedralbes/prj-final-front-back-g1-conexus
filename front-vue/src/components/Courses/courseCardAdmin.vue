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
            <button class="delete-button" @click="deleteCourse(course.id)">Eliminar</button>
        </div>
    </div>

    <div v-if="showModal" class="modal">
        <div class="modal-content">
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
                    <label for="course_hours">Horari disponible:</label>
                    <div v-for="(ranges, day) in schedule" :key="day" class="day-group">
                        <h4>
                            <input type="checkbox" :id="`enable-${day}`" v-model="schedule[day].enabled" />
                            <label :for="`enable-${day}`">{{ day }}</label>
                        </h4>
                        <div v-if="schedule[day].enabled">
                            <div v-for="(range, index) in ranges" :key="index" class="time-range">
                                <label :for="`startHour-${day}-${index}`">Inici:</label>
                                <select :id="`startHour-${day}-${index}`" v-model="range.startHour">
                                    <option v-for="hour in 24" :key="hour" :value="hour">{{ hour }}</option>
                                </select>
                                :
                                <select :id="`startMinute-${day}-${index}`" v-model="range.startMinute">
                                    <option v-for="minute in [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55]" :key="minute" :value="minute">{{ minute }}</option>
                                </select>
                                -
                                <label :for="`endHour-${day}-${index}`">Fi:</label>
                                <select :id="`endHour-${day}-${index}`" v-model="range.endHour">
                                    <option v-for="hour in 24" :key="hour" :value="hour">{{ hour }}</option>
                                </select>
                                :
                                <select :id="`endMinute-${day}-${index}`" v-model="range.endMinute">
                                    <option v-for="minute in [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55]" :key="minute" :value="minute">{{ minute }}</option>
                                </select>
                                <button type="button" class="remove-button" @click="removeTimeRange(day, index)">Eliminar</button>
                            </div>
                            <button type="button" class="add-button" @click="addTimeRange(day)">Afegir rang horari</button>
                        </div>
                    </div>
                </div>
                <input type="submit" value="Guardar canvis" class="submit-button" />
            </form>
            <button class="close-button" @click="toggleModal">Tancar</button>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { deleteCourse } from '@/services/communicationsScripts/mainManager.js';
import { updateCourse } from '@/services/communicationsScripts/mainManager.js';

const router = useRouter();
const showModal = ref(false);
const course = defineProps({
    course: {
        type: Object,
        required: true,
    },
});
const schedule = ref([]);

onMounted(() => {
    schedule.value.monday = course.course.course_hours_available.monday;
    schedule.value.tuesday = course.course.course_hours_available.tuesday;
    schedule.value.wednesday = course.course.course_hours_available.wednesday;
    schedule.value.thursday = course.course.course_hours_available.thursday;
    schedule.value.friday = course.course.course_hours_available.friday;
});

function toggleModal() {
    showModal.value = !showModal.value;
}

function sendUpdateCourse() {
    const updatedCourse = {
        id: course.course.id,
        course_name: course.course.course_name,
        course_description: course.course.course_description,
        course_hours_available: {
            monday: schedule.value.monday,
            tuesday: schedule.value.tuesday,
            wednesday: schedule.value.wednesday,
            thursday: schedule.value.thursday,
            friday: schedule.value.friday,
        },
    };
    updateCourse(updatedCourse).then(() => {
        showModal.value = false;
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
    background-color: #2196f3; /* Blue color */
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
    color: black; /* Black text color */
}

.form-group {
    margin-bottom: 16px;
}

.form-group label {
    display: block;
    margin-bottom: 8px;
    font-weight: bold;
    color: black; /* Black text color */
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
    background-color: #2196f3; /* Blue color */
    color: white;
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.close-button {
    margin-top: 16px;
    background-color: #2196f3; /* Blue color */
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
    background-color: #2196f3; /* Blue color */
    color: white;
}

.remove-button {
    background-color: #f44336;
    color: white;
}
</style>
