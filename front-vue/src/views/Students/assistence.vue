<template>
    <div class="animate-fade-in max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <!-- Capçalera -->
        <div class="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
                <h1
                    class="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                    Assistència al Curs
                </h1>
                <p class="text-gray-300 mt-2">Control de les teves presències i absències</p>
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

        <!-- Taula d'assistència -->
        <div class="bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden border border-slate-700 mb-8">
            <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-slate-700">
                    <thead class="bg-slate-700/50">
                        <tr>
                            <th scope="col"
                                class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                Data
                            </th>
                            <th scope="col"
                                class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                Hora
                            </th>
                            <th scope="col"
                                class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                Estat
                            </th>
                        </tr>
                    </thead>
                    <tbody class="bg-slate-800/30 divide-y divide-slate-700">
                        <tr v-for="(hour, index) in assistance" :key="index"
                            class="hover:bg-slate-700/50 transition-colors">
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="text-sm font-medium text-white">
                                    {{ new Date(hour.day).toLocaleDateString('ca-ES', {
                                        day: '2-digit', month:
                                    '2-digit', year: 'numeric' }) }}
                                </div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="text-sm text-gray-300">{{ hour.hour }}</div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" :class="{
                                    'bg-green-500/20 text-green-400': hour.assisted === 'yes',
                                    'bg-red-500/20 text-red-400': hour.assisted === 'unjustified',
                                    'bg-yellow-500/20 text-yellow-400': hour.assisted === 'justified',
                                    'bg-orange-500/20 text-orange-400': hour.assisted === 'late'
                                }">
                                    {{
                                        hour.assisted === 'yes' ? 'Present' :
                                            hour.assisted === 'unjustified' ? 'Falta injustificada' :
                                                hour.assisted === 'justified' ? 'Falta justificada' :
                                    hour.assisted === 'late' ? 'Retard' : ''
                                    }}
                                </span>
                            </td>
                        </tr>
                        <tr v-if="assistance.length === 0">
                            <td colspan="3" class="px-6 py-4 text-center text-sm text-gray-400">
                                No hi ha registres d'assistència disponibles
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Estadístiques -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div class="bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-slate-700">
                <div class="flex items-center justify-between">
                    <div>
                        <h3 class="text-lg font-medium text-gray-300 mb-2">Percentatge assistit</h3>
                        <p class="text-2xl font-bold text-green-400">
                            {{ calculateHoursAssisted().toFixed(1) }}%
                        </p>
                    </div>
                    <div class="p-3 rounded-full bg-green-500/20">
                        <svg class="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                </div>
                <div class="mt-4 w-full bg-slate-700 rounded-full h-2">
                    <div class="bg-green-500 h-2 rounded-full" :style="`width: ${calculateHoursAssisted()}%`"></div>
                </div>
            </div>

            <div class="bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-slate-700">
                <div class="flex items-center justify-between">
                    <div>
                        <h3 class="text-lg font-medium text-gray-300 mb-2">Faltes injustificades</h3>
                        <p class="text-2xl font-bold text-red-400">
                            {{ calculateHoursNotJustified().toFixed(1) }}%
                        </p>
                    </div>
                    <div class="p-3 rounded-full bg-red-500/20">
                        <svg class="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                </div>
                <div class="mt-4 w-full bg-slate-700 rounded-full h-2">
                    <div class="bg-red-500 h-2 rounded-full" :style="`width: ${calculateHoursNotJustified()}%`"></div>
                </div>
            </div>

            <div class="bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-slate-700">
                <div class="flex items-center justify-between">
                    <div>
                        <h3 class="text-lg font-medium text-gray-300 mb-2">Total sessions</h3>
                        <p class="text-2xl font-bold text-blue-400">
                            {{ assistance.length }}
                        </p>
                    </div>
                    <div class="p-3 rounded-full bg-blue-500/20">
                        <svg class="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                    </div>
                </div>
                <div class="mt-4 text-sm text-gray-400">
                    {{ calculatePresentCount() }} presents, {{ calculateLateCount() }} retards
                </div>
            </div>
        </div>

        <!-- Gràfic d'evolució (opcional) -->
        <div class="bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-slate-700">
            <h3 class="text-lg font-medium text-gray-300 mb-4">Evolució de l'assistència</h3>
            <div class="h-64 flex items-center justify-center text-gray-400">
                <p>Gràfic d'evolució (implementació pendent)</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAppStore } from '@/stores/index.js';
import { getAttendanceFromUserAndCourse } from '@/services/communicationsScripts/attendanceComManager.js';

const router = useRouter();
const route = useRoute();
const appStore = useAppStore();
const assistance = ref([]);

// Càrrega inicial de dades
onMounted(async () => {
    try {
        const courseId = route.params.id;
        assistance.value = await getAttendanceFromUserAndCourse(appStore.user.id, courseId);
        console.log('Assistència carregada:', assistance.value);
    } catch (error) {
        console.error('Error carregant assistència:', error);
    }
});

// Funcions de càlcul
function calculateHoursAssisted() {
    if (assistance.value.length === 0) return 0;
    const assistedHours = assistance.value.filter(h => h.assisted === 'yes').length;
    return (assistedHours / assistance.value.length) * 100;
}

function calculateHoursNotJustified() {
    if (assistance.value.length === 0) return 0;

    let notJustifiedHours = assistance.value.filter(h => h.assisted === 'unjustified').length;
    let lateCount = 0;

    assistance.value.forEach(hour => {
        if (hour.assisted === 'late') {
            lateCount++;
            if (lateCount > 2) {
                notJustifiedHours++;
                lateCount = 0;
            }
        }
    });

    return (notJustifiedHours / assistance.value.length) * 100;
}

function calculatePresentCount() {
    return assistance.value.filter(h => h.assisted === 'yes').length;
}

function calculateLateCount() {
    return assistance.value.filter(h => h.assisted === 'late').length;
}

function goToHome() {
    router.push({ name: 'student-assistence' });
}
</script>