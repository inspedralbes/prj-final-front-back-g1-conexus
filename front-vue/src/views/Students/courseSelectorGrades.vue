<template>
    <div class="animate-fade-in max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <!-- Capçalera -->
        <div class="mb-8 text-center">
            <h1 class="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                Els Meus Cursos
            </h1>
            <p class="text-gray-300 mt-2">Cursos als que estàs inscrit</p>
        </div>

        <!-- Llista de cursos -->
        <div v-if="courses.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="course in courses" :key="course.course_id"
                class="bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-slate-700 hover:border-blue-400/30">
                <div class="p-6">
                    <h2 class="text-xl font-semibold text-white mb-3">{{ course.course_name }}</h2>
                    <p class="text-gray-300 mb-4 line-clamp-3">{{ course.course_description }}</p>

                    <div class="flex justify-end">
                        <button @click="goToGrades(course.course_id)"
                            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200">
                            <svg class="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Veure Notes
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
            <h3 class="mt-2 text-lg font-medium text-white">No estàs inscrit a cap curs</h3>
            <p class="mt-1 text-gray-400">
                Contacta amb el teu tutor per inscriure't a cursos
            </p>
        </div>
    </div>
</template>

<script setup>
import { useAppStore } from '@/stores/index.js'
import { onMounted, ref } from 'vue'
import { getCoursesWithUser } from '@/services/communicationsScripts/mainManager.js'
import { useRouter } from 'vue-router'

const store = useAppStore()
const courses = ref([])
const router = useRouter()
const user = store.user

onMounted(async () => {
    try {
        courses.value = await getCoursesWithUser(user.id)
        console.log('Cursos carregats:', courses.value)
    } catch (error) {
        console.error('Error carregant cursos:', error)
    }
})

function goToGrades(id) {
    console.log('Anant a notes del curs:', id)
    router.push({ name: 'grades-from-course-student', params: { id } })
}   
</script>