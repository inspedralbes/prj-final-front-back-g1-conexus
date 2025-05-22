<template>
    <div class="animate-fade-in max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <!-- Capçalera -->
        <div class="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
                <h1
                    class="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                    Notes del Curs
                </h1>
                <p class="text-gray-300 mt-2">Aquí pots veure totes les teves qualificacions</p>
            </div>
            <button @click="goToHome"
                class="flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-slate-700 hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200">
                <svg class="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Tornar
            </button>
        </div>

        <!-- Taula de notes -->
        <div class="bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden border border-slate-700">
            <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-slate-700">
                    <thead class="bg-slate-700/50">
                        <tr>
                            <th scope="col"
                                class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                Tasca
                            </th>
                            <th scope="col"
                                class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                Nota
                            </th>
                            <th scope="col"
                                class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                Estat
                            </th>
                        </tr>
                    </thead>
                    <tbody class="bg-slate-800/30 divide-y divide-slate-700">
                        <tr v-for="grade in grades" :key="grade.id" class="hover:bg-slate-700/50 transition-colors">
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="text-sm font-medium text-white">{{ grade.task_name }}</div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="text-sm text-gray-300">{{ grade.grade }}</div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" :class="{
                                    'bg-green-500/20 text-green-400': grade.grade >= 5,
                                    'bg-yellow-500/20 text-yellow-400': grade.grade < 5 && grade.grade >= 3,
                                    'bg-red-500/20 text-red-400': grade.grade < 3
                                }">
                                    {{ grade.grade >= 5 ? 'Aprovat' : grade.grade >= 3 ? 'Suspès' : 'Deficient' }}
                                </span>
                            </td>
                        </tr>
                        <tr v-if="grades.length === 0">
                            <td colspan="3" class="px-6 py-4 text-center text-sm text-gray-400">
                                No hi ha notes disponibles per aquest curs
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Resum de notes -->
        <div v-if="grades.length > 0" class="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-slate-700">
                <h3 class="text-lg font-medium text-gray-300 mb-2">Nota Mitjana</h3>
                <p class="text-2xl font-bold text-white">
                    {{ averageGrade.toFixed(2) }}
                </p>
            </div>
            <div class="bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-slate-700">
                <h3 class="text-lg font-medium text-gray-300 mb-2">Tasques Aprovades</h3>
                <p class="text-2xl font-bold text-green-400">
                    {{ approvedCount }} <span class="text-sm font-normal text-gray-400">de {{ grades.length }}</span>
                </p>
            </div>
            <div class="bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-slate-700">
                <h3 class="text-lg font-medium text-gray-300 mb-2">Percentatge</h3>
                <p class="text-2xl font-bold text-blue-400">
                    {{ ((approvedCount / grades.length) * 100).toFixed(0) }}%
                </p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAppStore } from '@/stores/index.js';
import { getGradesFromUserAndCourse } from '@/services/communicationsScripts/gradesComManager.js';

const router = useRouter();
const route = useRoute();
const appStore = useAppStore();
const courseId = ref(null);
const grades = ref([]);

// Computed properties
const averageGrade = computed(() => {
    if (grades.value.length === 0) return 0;
    const sum = grades.value.reduce((acc, grade) => acc + parseFloat(grade.grade), 0);
    return sum / grades.value.length;
});

const approvedCount = computed(() => {
    return grades.value.filter(grade => grade.grade >= 5).length;
});

onMounted(async () => {
    try {
        courseId.value = route.params.id;
        grades.value = await getGradesFromUserAndCourse(appStore.user.id, courseId.value);
    } catch (error) {
        console.error('Error carregant notes:', error);
    }
});

function goToHome() {
    router.push({ name: 'student-grades' });
}
</script>