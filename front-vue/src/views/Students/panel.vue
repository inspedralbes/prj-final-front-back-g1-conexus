<template>
    <div class="animate-fade-in mt-9 mb-9">
        <!-- Capçalera -->
        <div class="mb-8 text-center">
            <h1 class="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                Benvingut/uda, {{ store.user.name }}!
            </h1>
            <p class="text-gray-300 mt-2">Panell principal de l'estudiant</p>
        </div>

        <!-- Targetes d'Accés Ràpid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <!-- Notes -->
            <router-link to="/students/grades"
                class="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-slate-700/30">
                <div class="flex items-center justify-between">
                    <div>
                        <h3 class="text-lg font-semibold text-gray-300">Notes</h3>
                        <p class="text-sm text-gray-400 mt-1">Consulta les teves qualificacions</p>
                    </div>
                    <div class="p-3 rounded-full bg-blue-500/20">
                        <svg class="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                </div>
            </router-link>

            <!-- Assistència -->
            <router-link to="/students/assistence"
                class="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-slate-700/30">
                <div class="flex items-center justify-between">
                    <div>
                        <h3 class="text-lg font-semibold text-gray-300">Assistència</h3>
                        <p class="text-sm text-gray-400 mt-1">Control d'assistència a classe</p>
                    </div>
                    <div class="p-3 rounded-full bg-purple-500/20">
                        <svg class="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                    </div>
                </div>
            </router-link>

            <!-- Incidències -->
            <router-link to="/students/incidents"
                class="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-slate-700/30">
                <div class="flex items-center justify-between">
                    <div>
                        <h3 class="text-lg font-semibold text-gray-300">Incidències</h3>
                        <p class="text-sm text-gray-400 mt-1">Gestiona les teves incidències</p>
                    </div>
                    <div class="p-3 rounded-full bg-red-500/20">
                        <svg class="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                </div>
            </router-link>

            <!-- Inscripcions -->
            <router-link to="/students/inscriptions"
                class="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-slate-700/30">
                <div class="flex items-center justify-between">
                    <div>
                        <h3 class="text-lg font-semibold text-gray-300">Inscripcions</h3>
                        <p class="text-sm text-gray-400 mt-1">Matrícula i cursos</p>
                    </div>
                    <div class="p-3 rounded-full bg-green-500/20">
                        <svg class="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                </div>
            </router-link>
        </div>

        <!-- Horari -->
        <div class="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 shadow-lg mb-8">
            <div class="flex justify-between items-center mb-4">
                <h2 class="text-xl font-semibold text-gray-300">El teu horari</h2>
                <button class="text-sm text-blue-400 hover:text-blue-300 transition-colors">
                    Veure horari complet
                </button>
            </div>

            <div class="overflow-x-auto">
                <table class="w-full text-sm text-left text-gray-400">
                    <thead class="text-xs text-gray-300 border-b border-slate-700">
                        <tr>
                            <th class="px-4 py-3">Hora</th>
                            <th class="px-4 py-3">Dilluns</th>
                            <th class="px-4 py-3">Dimarts</th>
                            <th class="px-4 py-3">Dimecres</th>
                            <th class="px-4 py-3">Dijous</th>
                            <th class="px-4 py-3">Divendres</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(timeSlot, index) in schedule" :key="index"
                            class="border-b border-slate-700 hover:bg-slate-700/30">
                            <td class="px-4 py-3 font-medium">{{ timeSlot.time }}</td>
                            <td v-for="(day, dayIndex) in ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']"
                                :key="dayIndex" class="px-4 py-3">
                                <div v-if="timeSlot[day]" class="flex items-center">
                                    <span class="w-2 h-2 rounded-full mr-2"
                                        :class="{ 'bg-blue-400': timeSlot[day].type === 'class', 'bg-purple-400': timeSlot[day].type === 'lab' }"></span>
                                    {{ timeSlot[day].subject }}
                                    <span class="text-xs text-gray-500 ml-2">{{ timeSlot[day].room }}</span>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Tasques Pendents -->
        <div class="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 shadow-lg">
            <div class="flex justify-between items-center mb-4">
                <h2 class="text-xl font-semibold text-gray-300">Tasques pendents</h2>
                <button class="text-sm text-blue-400 hover:text-blue-300 transition-colors">
                    Veure totes
                </button>
            </div>

            <div class="space-y-3">
                <div v-for="(task, index) in pendingTasks" :key="index"
                    class="flex items-center p-3 hover:bg-slate-700/30 rounded-lg transition-colors">
                    <input type="checkbox"
                        class="w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 rounded focus:ring-blue-500">
                    <div class="ml-3 flex-1">
                        <p class="font-medium">{{ task.title }}</p>
                        <p class="text-sm text-gray-400">{{ task.subject }} · Lliurament: {{ task.dueDate }}</p>
                    </div>
                    <span class="text-xs px-2 py-1 rounded-full"
                        :class="{ 'bg-red-500/20 text-red-400': task.priority === 'high', 'bg-yellow-500/20 text-yellow-400': task.priority === 'medium', 'bg-blue-500/20 text-blue-400': task.priority === 'low' }">
                        {{ task.priority === 'high' ? 'Urgent' : task.priority === 'medium' ? 'Important' : 'Normal' }}
                    </span>
                </div>

                <div v-if="pendingTasks.length === 0" class="text-center py-4 text-gray-400">
                    No tens tasques pendents!
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAppStore } from '@/stores/index.js';

const store = useAppStore();

// Dades d'exemple per a l'horari
const schedule = ref([
    {
        time: '08:00 - 09:00',
        monday: { subject: 'Matemàtiques', room: 'A203', type: 'class' },
        tuesday: null,
        wednesday: { subject: 'Física', room: 'Lab1', type: 'lab' },
        thursday: { subject: 'Història', room: 'B107', type: 'class' },
        friday: { subject: 'Matemàtiques', room: 'A203', type: 'class' }
    },
    {
        time: '09:00 - 10:00',
        monday: { subject: 'Anglès', room: 'A101', type: 'class' },
        tuesday: { subject: 'Química', room: 'Lab2', type: 'lab' },
        wednesday: { subject: 'Educació Física', room: 'Gimnas', type: 'class' },
        thursday: { subject: 'Tecnologia', room: 'A205', type: 'class' },
        friday: { subject: 'Català', room: 'B102', type: 'class' }
    },
    {
        time: '10:00 - 11:00',
        monday: { subject: 'Recre', room: '', type: 'break' },
        tuesday: { subject: 'Recre', room: '', type: 'break' },
        wednesday: { subject: 'Recre', room: '', type: 'break' },
        thursday: { subject: 'Recre', room: '', type: 'break' },
        friday: { subject: 'Recre', room: '', type: 'break' }
    },
    {
        time: '11:00 - 12:00',
        monday: { subject: 'Filosofia', room: 'A104', type: 'class' },
        tuesday: { subject: 'Matemàtiques', room: 'A203', type: 'class' },
        wednesday: { subject: 'Anglès', room: 'A101', type: 'class' },
        thursday: { subject: 'Biologia', room: 'Lab3', type: 'lab' },
        friday: { subject: 'Tutoria', room: 'A100', type: 'class' }
    }
]);

// Dades d'exemple per a tasques pendents
const pendingTasks = ref([
    {
        title: 'Treball de recerca història',
        subject: 'Història',
        dueDate: '15/05/2023',
        priority: 'high'
    },
    {
        title: 'Problemes matemàtics pàg. 124',
        subject: 'Matemàtiques',
        dueDate: '12/05/2023',
        priority: 'medium'
    },
    {
        title: 'Llegir capítol 5 de literatura',
        subject: 'Català',
        dueDate: '10/05/2023',
        priority: 'low'
    }
]);
</script>