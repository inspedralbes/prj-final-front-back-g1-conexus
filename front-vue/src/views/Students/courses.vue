<template>
    <div class="container">
        <h1>Cursos</h1>
        <p>Aquí pots apuntarte a diferents cursos</p>
        
        <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="Cerca cursos..." 
            class="search-bar"
        />

        <div class="course-list">
            <div 
                class="course-item" 
                v-for="course in filteredCourses" 
                :key="course.id"
            >
                <h2>{{ course.course_name }}</h2>
                <p>{{ course.course_description }}</p>
                <div class="Buttons">
                    <button @click="inscribe(course.id)">Inscriure</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
// Removed unused import
import { getCoursesWithoutUser, inscribeUser } from '@/services/communicationsScripts/mainManager.js';
import { useAppStore } from '@/stores/index.js';
import { computed } from 'vue';
const store = useAppStore();
const courses = ref([]);
const searchQuery = ref('');

onMounted(async () => {
    courses.value = await getCoursesWithoutUser(useAppStore().user.id);
    console.log(courses.value);
});

function inscribe(id) {
    inscribeUser(id, store.user.id).then(() => {
        courses.value = courses.value.filter(course => course.id !== id);
    }).catch((error) => {
        console.error(error);
        alert("Error al inscriure's al curs");
    });
}

// Computed property to filter courses based on search query
const filteredCourses = computed(() => {
    if (!searchQuery.value) {
        return courses.value;
    }
    return courses.value.filter(course => 
        course.course_name.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
});
</script>

<style scoped>
.search-bar {
    margin-bottom: 20px;
    padding: 10px;
    width: 100%;
    box-sizing: border-box;
    color: black;
}
.course-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
}
.course-item {
    border: 1px solid #ccc;
    padding: 20px;
    border-radius: 5px;
    box-sizing: border-box;
}
.course-item h2 {
    margin: 0 0 10px;
}
.course-item p {
    margin: 0 0 20px;
}
.course-item .Buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
}
.course-item button {
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    background-color: #007bff;
    color: white;
    cursor: pointer;
    flex: 1 1 auto;
}
.course-item button:hover {
    background-color: #0056b3;
}
.course-item button:active {
    background-color: #004085;
}
.course-item button:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.5);
}
.course-item button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
}
.course-item button:disabled:hover {
    background-color: #ccc;
}
.course-item button:disabled:active {
    background-color: #ccc;
}
*{
    font-family: 'Arial', sans-serif;
}

</style>