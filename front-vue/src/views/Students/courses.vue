<template>
    <div class="animate-fade-in max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <!-- Capçalera -->
        <div class="mb-8 text-center">
            <h1 class="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                Cursos Disponibles
            </h1>
            <p class="text-gray-300 mt-2">Descobreix i inscriu-te als cursos que t'interessen</p>
        </div>

        <!-- Barra de cerca -->
        <div class="relative mb-8 max-w-2xl mx-auto">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </div>
            <input type="text" v-model="searchQuery" placeholder="Cerca cursos..."
                class="block w-full pl-10 pr-3 py-3 border border-slate-700 rounded-lg bg-slate-800/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
        </div>

        <!-- Llista de cursos -->
        <div v-if="filteredCourses.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="course in filteredCourses" :key="course.id"
                class="bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-slate-700 hover:border-blue-400/30">
                <div class="p-6">
                    <div class="flex items-center justify-between mb-3">
                        <h2 class="text-xl font-semibold text-white truncate">{{ course.course_name }}</h2>
                        <span
                            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400">
                            Nou
                        </span>
                    </div>
                    <p class="text-gray-300 mb-4 line-clamp-3">{{ course.course_description }}</p>

                    <div class="flex justify-end">
                        <button @click="inscribe(course.id)"
                            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200">
                            <svg class="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Inscriure'm
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Missatge si no hi ha cursos -->
        <div v-else class="text-center py-12">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 class="mt-2 text-lg font-medium text-white">No s'han trobat cursos</h3>
            <p class="mt-1 text-gray-400">
                {{ searchQuery ? "No hi ha cursos que coincideixin amb la teva cerca" : "Actualment no hi ha cursos disponibles" }}
            </p>
            <div class="mt-6">
                <button v-if="searchQuery" @click="searchQuery = ''"
                    class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    Tornar a veure tots els cursos
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { getCoursesWithoutUser, inscribeUser } from '@/services/communicationsScripts/mainManager.js';
import { useAppStore } from '@/stores/index.js';

const store = useAppStore();
const courses = ref([]);
const searchQuery = ref('');

// Obtenir cursos quan el component es munti
onMounted(async () => {
    try {
        courses.value = await getCoursesWithoutUser(store.user.id);
    } catch (error) {
        console.error('Error carregant cursos:', error);
    }
});

// Funció per inscriure's a un curs
async function inscribe(id) {
    try {
        await inscribeUser(id, store.user.id);
        // Eliminar el curs de la llista després de la inscripció
        courses.value = courses.value.filter(course => course.id !== id);
    } catch (error) {
        console.error("Error en inscriure's al curs:", error);
        // Podries afegir aquí una notificació més elegant
        alert("S'ha produït un error en inscriure't al curs");
    }
}

// Cursos filtrats per la cerca
const filteredCourses = computed(() => {
    if (!searchQuery.value) {
        return courses.value;
    }
    const query = searchQuery.value.toLowerCase();
    return courses.value.filter(course =>
        course.course_name.toLowerCase().includes(query) ||
        (course.course_description && course.course_description.toLowerCase().includes(query))
    );
});
</script>