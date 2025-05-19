<template>
    <div class="animate-fade-in max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <!-- Capçalera -->
        <div class="mb-8 text-center">
            <h1 class="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                Els Meus Cursos
            </h1>
            <p class="text-gray-300 mt-3 text-lg">Cursos als que estàs inscrit</p>
        </div>

        <!-- Llista de cursos -->
        <div v-if="courses.length > 0" class="bg-slate-800/50 rounded-xl border border-slate-700 shadow-lg overflow-hidden">
            <!-- Taula de cursos -->
            <table class="w-full">
                <thead>
                    <tr class="bg-gradient-to-r from-blue-600/80 to-purple-600/80 text-white">
                        <th class="py-3 px-4 text-left">Nom del Curs</th>
                        <th class="py-3 px-4 text-left hidden md:table-cell">Descripció</th>
                        <th class="py-3 px-4 text-left w-24">Estat</th>
                        <th class="py-3 px-4 text-right w-32">Accions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="course in paginatedCourses" :key="course.course_id" 
                        class="border-t border-slate-700 hover:bg-slate-700/30 transition-colors">
                        <td class="py-3 px-4 font-medium text-white">{{ course.course_name }}</td>
                        <td class="py-3 px-4 text-gray-300 hidden md:table-cell">
                            <span class="line-clamp-1">{{ course.course_description }}</span>
                        </td>
                        <td class="py-3 px-4">
                            <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-900/50 text-blue-300">
                                <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Actiu
                            </span>
                        </td>
                        <td class="py-3 px-4 text-right">
                            <button @click="goToGrades(course.course_id)" 
                                class="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
                                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Notes
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>

            <!-- Paginació -->
            <div class="bg-slate-800/80 px-4 py-3 flex items-center justify-between border-t border-slate-700">
                <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                        <p class="text-sm text-gray-400">
                            Mostrant <span class="font-medium text-gray-300">{{ startIndex + 1 }}</span> a 
                            <span class="font-medium text-gray-300">{{ endIndex }}</span> de 
                            <span class="font-medium text-gray-300">{{ courses.length }}</span> cursos
                        </p>
                    </div>
                    <div>
                        <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                            <button @click="prevPage" :disabled="currentPage === 1"
                                class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-slate-600 bg-slate-700 text-sm font-medium text-gray-300 hover:bg-slate-600 disabled:opacity-50 disabled:hover:bg-slate-700">
                                <span class="sr-only">Anterior</span>
                                <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                                </svg>
                            </button>
                            
                            <span v-for="page in totalPages" :key="page">
                                <button @click="goToPage(page)" 
                                    :class="[
                                        currentPage === page 
                                            ? 'bg-blue-600 text-white border-blue-600' 
                                            : 'bg-slate-700 text-gray-300 border-slate-600 hover:bg-slate-600',
                                        'relative inline-flex items-center px-4 py-2 border text-sm font-medium'
                                    ]">
                                    {{ page }}
                                </button>
                            </span>
                            
                            <button @click="nextPage" :disabled="currentPage === totalPages"
                                class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-slate-600 bg-slate-700 text-sm font-medium text-gray-300 hover:bg-slate-600 disabled:opacity-50 disabled:hover:bg-slate-700">
                                <span class="sr-only">Següent</span>
                                <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                                </svg>
                            </button>
                        </nav>
                    </div>
                </div>
                
                <!-- Versió mòbil de paginació -->
                <div class="flex sm:hidden justify-between w-full">
                    <button @click="prevPage" :disabled="currentPage === 1"
                        class="relative inline-flex items-center px-4 py-2 border border-slate-600 text-sm font-medium rounded-md text-gray-300 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:hover:bg-slate-700">
                        Anterior
                    </button>
                    <span class="text-sm text-gray-300">
                        {{ currentPage }} / {{ totalPages }}
                    </span>
                    <button @click="nextPage" :disabled="currentPage === totalPages"
                        class="ml-3 relative inline-flex items-center px-4 py-2 border border-slate-600 text-sm font-medium rounded-md text-gray-300 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:hover:bg-slate-700">
                        Següent
                    </button>
                </div>
            </div>
        </div>

        <!-- Missatge si no hi ha cursos -->
        <div v-else class="text-center py-16">
            <div class="inline-block bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
                <svg class="mx-auto h-16 w-16 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 class="mt-4 text-xl font-semibold text-white">No estàs inscrit a cap curs</h3>
                <p class="mt-2 text-gray-300 max-w-md mx-auto">
                    Contacta amb el teu tutor per inscriure't a cursos i començar a aprendre
                </p>
                <button class="mt-4 px-6 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white transition-colors duration-200">
                    Contactar amb tutor
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useAppStore } from '@/stores/index.js'
import { onMounted, ref, computed } from 'vue'
import { getCoursesWithUser } from '@/services/communicationsScripts/mainManager.js'
import { useRouter } from 'vue-router'

const store = useAppStore()
const courses = ref([])
const router = useRouter()
const user = store.user

// Variables per a paginació
const itemsPerPage = 10
const currentPage = ref(1)

onMounted(async () => {
    try {
        courses.value = await getCoursesWithUser(user.id)
        console.log('Cursos carregats:', courses.value)
    } catch (error) {
        console.error('Error carregant cursos:', error)
    }
})

// Funció per navegar a les notes
function goToGrades(id) {
    console.log('Anant a notes del curs:', id)
    router.push({ name: 'grades-from-course-student', params: { id } })
}

// Funcions per a la paginació
const totalPages = computed(() => Math.ceil(courses.value.length / itemsPerPage))
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage)
const endIndex = computed(() => Math.min(startIndex.value + itemsPerPage, courses.value.length))
const paginatedCourses = computed(() => 
    courses.value.slice(startIndex.value, endIndex.value)
)

function prevPage() {
    if (currentPage.value > 1) {
        currentPage.value--
    }
}

function nextPage() {
    if (currentPage.value < totalPages.value) {
        currentPage.value++
    }
}

function goToPage(page) {
    currentPage.value = page
}
</script>

<style>
.line-clamp-1 {
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>