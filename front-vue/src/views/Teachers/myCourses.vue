<template>
    <div class="mt-9 mb-9 py-8 px-4 sm:px-6">
        <div class="max-w-6xl mx-auto bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-slate-700/50">
            <!-- Cabecera -->
            <div class="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
                <div class="flex items-center justify-between">
                    <h1 class="text-2xl font-bold flex items-center">
                        <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        Gestió de Cursos
                    </h1>
                </div>
            </div>
            <!-- Contenido -->
            <div class="p-6">
                <div v-if="courses.length === 0" class="text-center py-12">
                    <svg class="w-16 h-16 mx-auto text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1"
                            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p class="mt-4 text-slate-400">No s'han trobat cursos</p>
                </div>
                <div v-else>
                    <div class="overflow-x-auto bg-slate-800/30 rounded-xl border border-slate-700/50">
                        <table class="min-w-full divide-y divide-slate-700/70">
                            <thead class="bg-slate-700/30">
                                <tr>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                                        Curs
                                    </th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                                        Descripció
                                    </th>
                                    <th class="px-6 py-3 text-right text-xs font-medium text-slate-300 uppercase tracking-wider">
                                        Accions
                                    </th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-700/50">
                                <tr v-for="course in courses" :key="course.id" class="hover:bg-slate-700/20 transition-colors">
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="text-sm font-medium text-white">
                                            {{ course.course_name }}
                                        </div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="text-sm text-slate-300">
                                            {{ course.course_description }}
                                        </div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                        <button @click="goToAssistance(course.id)" v-if="actualRoute === 'teacher-assistence'"
                                            class="px-3 py-1 bg-blue-500/10 text-blue-400 hover:text-blue-300 rounded-md transition-colors">
                                            Asistencia
                                        </button>
                                        <button @click="goToGrades(course.id)" v-if="actualRoute === 'teacher-grades'"
                                            class="px-3 py-1 bg-purple-500/10 text-purple-400 hover:text-purple-300 rounded-md transition-colors">
                                            Avaluació
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useAppStore } from '@/stores/index.js'
import { onMounted, ref } from 'vue'
import { getCoursesFromUser } from '@/services/communicationsScripts/mainManager.js'
import { useRouter } from 'vue-router'

const store = useAppStore()
const courses = ref([])
const route = useRouter()
import { computed } from 'vue'

const actualRoute = computed(() => route.currentRoute.value.name)
onMounted(async () => {
    courses.value = await getCoursesFromUser(store.getUserId())
})

function goToGrades(courseId) {
    route.push({ name: 'grades', params: { courseId } })
}

function goToAssistance(courseId) {
    route.push({ name: 'attendance', params: { courseId } })
}
</script>
