<template>
    <div class="animate-fade-in max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <!-- Capçalera -->
        <div class="mb-8 text-center">
            <h1 class="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                Els Meus Cursos
            </h1>
            <p class="text-gray-300 mt-2">Selecciona un curs per registrar l'assistència</p>
        </div>

        <!-- Llista de cursos -->
        <div v-if="courses.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="course in courses" :key="course.course_id"
                class="bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-slate-700 hover:border-blue-400/30">
                <div class="p-6">
                    <div class="flex items-start justify-between">
                        <div>
                            <h2 class="text-xl font-semibold text-white mb-2">{{ course.course_name }}</h2>
                            <p class="text-gray-300 line-clamp-3">{{ course.course_description }}</p>
                        </div>
                        <span
                            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/20 text-green-400 ml-2">
                            Actiu
                        </span>
                    </div>

                    <div class="mt-6 flex justify-end">
                        <button @click="goToAttendance(course.course_id)"
                            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200">
                            <svg class="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            Registrar Assistència
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

function goToAttendance(id) {
    console.log('Anant a assistència del curs:', id)
    router.push({ name: 'assistence-from-course-student', params: { id } })
}
</script>