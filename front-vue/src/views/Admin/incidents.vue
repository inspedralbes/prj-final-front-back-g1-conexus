<template>
    <div class="p-6 bg-slate-900/50 backdrop-blur-sm rounded-xl shadow-lg border border-slate-700/50 mt-9 mb-9">
        <div class="flex flex-wrap justify-between items-center mb-6">
            <h1
                class="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 mb-3 md:mb-0">
                Gestió d'Incidències
            </h1>

            <div class="flex flex-wrap gap-3">
                <!-- Filtros -->
                <div class="flex border border-slate-700 rounded-lg overflow-hidden">
                    <button @click="activeFilter = 'all'"
                        :class="{ 'bg-blue-600/30 text-blue-300': activeFilter === 'all', 'text-slate-400 hover:bg-slate-700/50': activeFilter !== 'all' }"
                        class="px-4 py-2 text-sm font-medium transition-colors">
                        Totes
                    </button>
                    <button @click="activeFilter = 'pending'"
                        :class="{ 'bg-yellow-600/30 text-yellow-300': activeFilter === 'pending', 'text-slate-400 hover:bg-slate-700/50': activeFilter !== 'pending' }"
                        class="px-4 py-2 text-sm font-medium transition-colors">
                        Pendents
                    </button>
                    <button @click="activeFilter = 'revising'"
                        :class="{ 'bg-blue-600/30 text-blue-300': activeFilter === 'revising', 'text-slate-400 hover:bg-slate-700/50': activeFilter !== 'revising' }"
                        class="px-4 py-2 text-sm font-medium transition-colors">
                        En revisió
                    </button>
                    <button @click="activeFilter = 'revised'"
                        :class="{ 'bg-green-600/30 text-green-300': activeFilter === 'revised', 'text-slate-400 hover:bg-slate-700/50': activeFilter !== 'revised' }"
                        class="px-4 py-2 text-sm font-medium transition-colors">
                        Resoltes
                    </button>
                </div>

                <!-- Campo de búsqueda -->
                <div class="relative">
                    <input type="text" v-model="searchQuery" placeholder="Cercar incidències..."
                        class="bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2 pl-10 w-full md:w-64 text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <svg class="w-5 h-5 text-slate-500 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none"
                        stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                </div>
            </div>
        </div>

        <!-- Estadísticas -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div class="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
                <div class="flex items-center">
                    <div class="p-3 bg-blue-500/20 rounded-lg mr-4">
                        <svg class="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2">
                            </path>
                        </svg>
                    </div>
                    <div>
                        <p class="text-slate-400 text-sm">Total d'incidències</p>
                        <p class="text-xl font-bold text-white">{{ stats.total }}</p>
                    </div>
                </div>
            </div>
            <div class="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
                <div class="flex items-center">
                    <div class="p-3 bg-yellow-500/20 rounded-lg mr-4">
                        <svg class="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                    </div>
                    <div>
                        <p class="text-slate-400 text-sm">Pendents/En revisió</p>
                        <p class="text-xl font-bold text-white">{{ stats.pending }}</p>
                    </div>
                </div>
            </div>
            <div class="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
                <div class="flex items-center">
                    <div class="p-3 bg-green-500/20 rounded-lg mr-4">
                        <svg class="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7">
                            </path>
                        </svg>
                    </div>
                    <div>
                        <p class="text-slate-400 text-sm">Resoltes</p>
                        <p class="text-xl font-bold text-white">{{ stats.resolved }}</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Estado de carga -->
        <div v-if="loading" class="text-center py-8 animate-pulse">
            <svg class="w-10 h-10 mx-auto text-blue-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15">
                </path>
            </svg>
            <p class="text-slate-400">Carregant incidències...</p>
        </div>

        <!-- Sin resultados -->
        <div v-else-if="filteredReports.length === 0" class="text-center py-8">
            <svg class="w-12 h-12 mx-auto text-slate-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <p class="text-slate-400">No s'han trobat incidències amb els filtres actuals</p>
        </div>

        <!-- Lista de incidencias -->
        <div v-else class="space-y-4">
            <div v-for="report in filteredReports" :key="report.id"
                class="p-4 bg-slate-800/50 rounded-lg border border-slate-700/30 hover:border-slate-600 transition-colors relative animate-fade-in">

                <!-- Estado de la incidencia (badge) -->
                <div class="absolute top-4 right-4 flex space-x-2">
                    <span v-if="report.status === 'pending'"
                        class="bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded text-xs font-medium">
                        Pendent
                    </span>
                    <span v-else-if="report.status === 'revising'"
                        class="bg-blue-500/20 text-blue-300 px-2 py-1 rounded text-xs font-medium">
                        En revisió
                    </span>
                    <span v-else-if="report.status === 'revised'"
                        class="bg-green-500/20 text-green-300 px-2 py-1 rounded text-xs font-medium">
                        Resolt
                    </span>
                </div>

                <!-- Cabecera -->
                <div class="flex justify-between items-start mb-4">
                    <div>
                        <h2 class="text-lg font-semibold text-white">Informe #{{ report.id }}</h2>
                        <div class="flex flex-wrap gap-x-4 mt-1 text-sm">
                            <p class="text-slate-300">
                                <span class="text-slate-400">Reportat per:</span> {{ report.User?.name || 'Desconegut'
                                }}
                            </p>
                            <p class="text-slate-300">
                                <span class="text-slate-400">Data:</span> {{ formatDate(report.created_at) }}
                            </p>
                            <p v-if="report.user_assigned" class="text-slate-300">
                                <span class="text-slate-400">Assignat a:</span> {{ report.AssignedUser?.name || 'Tècnic no especificat' }}
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Contenido -->
                <div class="space-y-2 mb-4">
                    <p class="text-slate-300">
                        <span class="text-slate-400 font-medium">Descripció:</span> {{ report.report }}
                    </p>
                    <p class="text-slate-300">
                        <span class="text-slate-400 font-medium">Aula:</span> {{ report.Room?.room_name || 'Desconeguda'
                        }}
                    </p>
                    <p v-if="report.note" class="text-slate-300">
                        <span class="text-slate-400 font-medium">Nota tècnica:</span> {{ report.note }}
                    </p>
                </div>

                <!-- Imagen de incidencia -->
                <div v-if="report.image" class="mb-4">
                    <img :src="`${baseURL}${report.image}`" alt="Imatge de l'incident"
                        class="max-w-full h-auto rounded-lg border border-slate-700/50 max-h-60 object-contain"
                        @click="openImageModal(report.image)">
                </div>

                <!-- Acciones -->
                <div class="flex flex-wrap gap-2 mt-4 pt-3 border-t border-slate-700/30">
                    <!-- Asignar técnico -->
                    <button v-if="report.status !== 'revised'" @click="openAssignModal(report)"
                        class="px-3 py-1.5 bg-blue-500/20 text-blue-300 rounded flex items-center text-sm hover:bg-blue-500/30 transition-colors">
                        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z">
                            </path>
                        </svg>
                        {{ report.user_assigned ? 'Reassignar' : 'Assignar tècnic' }}
                    </button>

                    <!-- Cambiar estado -->
                    <button v-if="report.status !== 'revised'" @click="openStatusModal(report)"
                        class="px-3 py-1.5 bg-purple-500/20 text-purple-300 rounded flex items-center text-sm hover:bg-purple-500/30 transition-colors">
                        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15">
                            </path>
                        </svg>
                        Canviar estat
                    </button>

                    <!-- Añadir nota -->
                    <button @click="openNoteModal(report)"
                        class="px-3 py-1.5 bg-green-500/20 text-green-300 rounded flex items-center text-sm hover:bg-green-500/30 transition-colors">
                        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z">
                            </path>
                        </svg>
                        {{ report.note ? 'Editar nota' : 'Afegir nota' }}
                    </button>

                    <!-- Eliminar -->
                    <button @click="openDeleteModal(report)"
                        class="px-3 py-1.5 bg-red-500/20 text-red-300 rounded flex items-center text-sm hover:bg-red-500/30 transition-colors">
                        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16">
                            </path>
                        </svg>
                        Eliminar
                    </button>
                </div>
            </div>
        </div>

        <!-- Modal para ver imagen ampliada -->
        <div v-if="showImageModal"
            class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 animate-fade-in"
            @click="showImageModal = false">
            <div class="relative max-w-4xl w-full max-h-[90vh] overflow-auto">
                <img :src="`${baseURL}${selectedImage}`" alt="Imatge ampliada"
                    class="max-w-full h-auto mx-auto rounded-lg">
                <button
                    class="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12">
                        </path>
                    </svg>
                </button>
            </div>
        </div>

        <!-- Modal para asignación de técnico - Corregido -->
        <div v-if="showAssignModal"
            class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div
                class="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 max-w-md w-full border border-slate-700/50 shadow-2xl relative">
                <button @click="showAssignModal = false" class="absolute top-4 right-4 text-slate-400 hover:text-white">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12">
                        </path>
                    </svg>
                </button>

                <h3 class="text-xl font-bold text-white mb-4">Assignar tècnic</h3>
                <p class="text-slate-300 mb-4">Selecciona un tècnic per assignar a la incidència #{{ activeReport?.id }}
                </p>

                <div v-if="loadingTechs" class="text-center py-4">
                    <p class="text-slate-400">Carregant tècnics...</p>
                </div>
                <div v-else class="mb-4">
                    <label class="block text-sm font-medium text-gray-300 mb-2">Tècnic</label>
                    <select v-model="selectedTechId"
                        class="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option :value="null" disabled>Selecciona un tècnic</option>
                        <option v-for="tech in technicians" :key="tech.id" :value="tech.id">{{ tech.name }}</option>
                    </select>
                </div>

                <div class="flex justify-end space-x-3 mt-6">
                    <button @click="showAssignModal = false"
                        class="px-4 py-2 border border-slate-600 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors">
                        Cancel·lar
                    </button>
                    <button @click="assignTechnician" :disabled="!selectedTechId"
                        :class="{ 'opacity-50 cursor-not-allowed': !selectedTechId }"
                        class="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow hover:from-blue-600 hover:to-blue-700 transition-all duration-300">
                        Assignar
                    </button>
                </div>
            </div>
        </div>

        <!-- Modal para cambiar estado -->
        <div v-if="showStatusModal"
            class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div
                class="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 max-w-md w-full border border-slate-700/50 shadow-2xl relative">
                <button @click="showStatusModal = false" class="absolute top-4 right-4 text-slate-400 hover:text-white">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12">
                        </path>
                    </svg>
                </button>

                <h3 class="text-xl font-bold text-white mb-4">Canviar estat</h3>
                <p class="text-slate-300 mb-4">Selecciona el nou estat per a la incidència #{{ activeReport?.id }}</p>

                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-300 mb-2">Estat</label>
                    <div class="space-y-2">
                        <label
                            class="flex items-center p-3 border border-slate-700 rounded-lg cursor-pointer hover:bg-slate-700/30">
                            <input type="radio" v-model="selectedStatus" value="pending" class="mr-3">
                            <div>
                                <span class="font-medium text-white">Pendent</span>
                                <p class="text-sm text-slate-400">La incidència encara no ha estat revisada</p>
                            </div>
                        </label>
                        <label
                            class="flex items-center p-3 border border-slate-700 rounded-lg cursor-pointer hover:bg-slate-700/30">
                            <input type="radio" v-model="selectedStatus" value="revising" class="mr-3">
                            <div>
                                <span class="font-medium text-white">En revisió</span>
                                <p class="text-sm text-slate-400">S'està treballant en la incidència</p>
                            </div>
                        </label>
                        <label
                            class="flex items-center p-3 border border-slate-700 rounded-lg cursor-pointer hover:bg-slate-700/30">
                            <input type="radio" v-model="selectedStatus" value="revised" class="mr-3">
                            <div>
                                <span class="font-medium text-white">Resolta</span>
                                <p class="text-sm text-slate-400">La incidència ha estat solucionada</p>
                            </div>
                        </label>
                    </div>
                </div>

                <div class="flex justify-end space-x-3 mt-6">
                    <button @click="showStatusModal = false"
                        class="px-4 py-2 border border-slate-600 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors">
                        Cancel·lar
                    </button>
                    <button @click="changeStatus"
                        class="px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg shadow hover:from-purple-600 hover:to-purple-700 transition-all duration-300">
                        Guardar canvis
                    </button>
                </div>
            </div>
        </div>

        <!-- Modal para añadir/editar nota -->
        <div v-if="showNoteModal"
            class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div
                class="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 max-w-md w-full border border-slate-700/50 shadow-2xl relative">
                <button @click="showNoteModal = false" class="absolute top-4 right-4 text-slate-400 hover:text-white">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12">
                        </path>
                    </svg>
                </button>

                <h3 class="text-xl font-bold text-white mb-4">{{ noteModalTitle }}</h3>
                <p class="text-slate-300 mb-4">Incidència #{{ activeReport?.id }}</p>

                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-300 mb-2">Nota tècnica</label>
                    <textarea v-model="reportNote" rows="5"
                        class="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Escriu aquí la nota tècnica..."></textarea>
                </div>

                <div class="flex justify-end space-x-3 mt-6">
                    <button @click="showNoteModal = false"
                        class="px-4 py-2 border border-slate-600 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors">
                        Cancel·lar
                    </button>
                    <button @click="saveNote"
                        class="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg shadow hover:from-green-600 hover:to-green-700 transition-all duration-300">
                        Guardar nota
                    </button>
                </div>
            </div>
        </div>

        <!-- Modal de confirmación para eliminar -->
        <div v-if="showDeleteModal"
            class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div
                class="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 max-w-md w-full border border-slate-700/50 shadow-2xl relative">
                <h3 class="text-xl font-bold text-white mb-3">Confirmar eliminació</h3>
                <p class="text-slate-300 mb-6">Estàs segur que vols eliminar la incidència #{{ activeReport?.id }}?
                    Aquesta acció no es pot desfer.</p>

                <div class="flex justify-end space-x-3">
                    <button @click="showDeleteModal = false"
                        class="px-4 py-2 border border-slate-600 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors">
                        Cancel·lar
                    </button>
                    <button @click="confirmDelete"
                        class="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg shadow hover:from-red-600 hover:to-red-700 transition-all duration-300">
                        Eliminar
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import {
    getAllReports,
    getReportStats,
    updateReport,
    deleteReport as deleteReportAPI,
    assignReport
} from '@/services/communicationsScripts/incidentsManager';
import { getAllUsers, getTypeUsers } from '@/services/communicationsScripts/mainManager';

// Estado general
const allReports = ref([]);
const loading = ref(true);
const baseURL = import.meta.env.VITE_INCIDENT_URL;
const activeFilter = ref('all');
const searchQuery = ref('');
const stats = ref({ total: 0, pending: 0, resolved: 0 });

// Estados para modales
const showImageModal = ref(false);
const selectedImage = ref(null);

const showAssignModal = ref(false);
const selectedTechId = ref(null);
const technicians = ref([]);
const loadingTechs = ref(false);

const showStatusModal = ref(false);
const selectedStatus = ref('');

const showNoteModal = ref(false);
const reportNote = ref('');

const showDeleteModal = ref(false);
const activeReport = ref(null);

// Computed properties
const filteredReports = computed(() => {
    let result = allReports.value;

    // Filtrar per estado
    if (activeFilter.value !== 'all') {
        if (activeFilter.value === 'pending') {
            result = result.filter(report => report.status === 'pending');
        } else if (activeFilter.value === 'revising') {
            result = result.filter(report => report.status === 'revising');
        } else if (activeFilter.value === 'revised') {
            result = result.filter(report => report.status === 'revised');
        }
    }

    // Filtrar per búsqueda
    if (searchQuery.value.trim()) {
        const query = searchQuery.value.toLowerCase();
        result = result.filter(report =>
            (report.report && report.report.toLowerCase().includes(query)) ||
            (report.User?.name && report.User.name.toLowerCase().includes(query)) ||
            (report.Room?.room_name && report.Room.room_name.toLowerCase().includes(query)) ||
            (report.note && report.note.toLowerCase().includes(query)) ||
            report.id.toString().includes(query)
        );
    }

    // Ordenar per fecha (més recents primer)
    return result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
});

const noteModalTitle = computed(() => {
    return activeReport.value?.note ? 'Editar nota tècnica' : 'Afegir nota tècnica';
});

// Cargar datos
onMounted(async () => {
    await loadReports();
    await loadStats();
});

// Watch per actualitzar estadístiques quan canviin els reportes
watch(allReports, async () => {
    await loadStats();
});

async function loadReports() {
    try {
        loading.value = true;
        const reports = await getAllReports();
        allReports.value = reports;
        console.log("Incidències carregades:", reports);
    } catch (error) {
        console.error("Error obtenint informes:", error);
    } finally {
        loading.value = false;
    }
}

async function loadStats() {
    try {
        const reportStats = await getReportStats();
        stats.value = {
            total: reportStats.total || 0,
            pending: (reportStats.pending || 0) + (reportStats.revising || 0),
            resolved: reportStats.resolved || 0
        };
    } catch (error) {
        console.error("Error obtenint estadístiques:", error);
    }
}

// Funció per carregar tècnics dinàmicament segons el seu tipus
async function loadTechnicians() {
    try {
        loadingTechs.value = true;
        
        // Obtenir tots els usuaris
        const users = await getAllUsers();
        
        // Comprovar si la resposta és un array
        if (!Array.isArray(users)) {
            console.error("La resposta no és un array d'usuaris:", users);
            technicians.value = [];
            loadingTechs.value = false;
            return;
        }
        
        // Filtrar només els usuaris que siguin tècnics (typeUsers_id = 4)
        technicians.value = users.filter(user => user.typeUsers_id === 4);
        console.log(`Tècnics trobats:`, technicians.value);
        
        if (technicians.value.length === 0) {
            console.warn(`No s'han trobat tècnics (usuaris amb typeUsers_id = 4)`);
        }
    } catch (error) {
        console.error("Error obtenint tècnics:", error);
        technicians.value = [];
    } finally {
        loadingTechs.value = false;
    }
}

// Funció per assignar tècnic
async function assignTechnician() {
    if (!activeReport.value || !selectedTechId.value) return;

    try {
        console.log(`Assignant tècnic ${selectedTechId.value} a incidència ${activeReport.value.id}`);
        
        const result = await assignReport(activeReport.value.id, selectedTechId.value);
        console.log("Resposta d'assignació:", result);

        // Actualitzar l'informe a la llista local
        const index = allReports.value.findIndex(r => r.id === activeReport.value.id);
        if (index !== -1) {
            // Actualitzar tots els camps rellevants
            allReports.value[index].user_assigned = selectedTechId.value;
            
            // Actualitzar informació del tècnic assignat
            const assignedTech = technicians.value.find(t => t.id === selectedTechId.value);
            if (assignedTech) {
                allReports.value[index].AssignedUser = assignedTech;
            }
            
            // Si estava pendent, canviar-lo a "en revisió"
            if (allReports.value[index].status === 'pending') {
                allReports.value[index].status = 'revising';
            }
        }

        showAssignModal.value = false;
        
        // Recarregar tots els informes per assegurar sincronització
        await loadReports();
    } catch (error) {
        console.error("Error assignant tècnic:", error);
        showAssignModal.value = false;
        loadReports();
    }
}

// Funció per canviar estat
async function changeStatus() {
    if (!activeReport.value || !selectedStatus.value) return;

    try {
        console.log(`Canviant estat d'incidència ${activeReport.value.id} a ${selectedStatus.value}`);
        
        // Executar l'actualització sense mostrar alertes
        await updateReport(activeReport.value.id, { status: selectedStatus.value });
        
        // Actualitzar l'informe a la llista local sense esperar resposta addicional
        const index = allReports.value.findIndex(r => r.id === activeReport.value.id);
        if (index !== -1) {
            allReports.value[index].status = selectedStatus.value;
        }

        // Tancar modal
        showStatusModal.value = false;
        
        // Recarregar tots els informes en segon pla
        loadReports();
    } catch (error) {
        console.error("Error canviant estat:", error);
        showStatusModal.value = false;
        loadReports();
    }
}

// Funció per desar nota
async function saveNote() {
    if (!activeReport.value) return;

    try {
        console.log(`Desant nota per a incidència ${activeReport.value.id}:`, reportNote.value);
        
        await updateReport(activeReport.value.id, { note: reportNote.value });
        
        // Actualitzar l'informe a la llista local
        const index = allReports.value.findIndex(r => r.id === activeReport.value.id);
        if (index !== -1) {
            allReports.value[index].note = reportNote.value;
        }

        showNoteModal.value = false;
        
        // Recarregar tots els informes per assegurar sincronització
        loadReports();
    } catch (error) {
        console.error("Error desant nota:", error);
        showNoteModal.value = false;
        loadReports();
    }
}

// Funció per eliminar informe
async function confirmDelete() {
    if (!activeReport.value) return;

    try {
        console.log(`Eliminant incidència ${activeReport.value.id}`);
        
        await deleteReportAPI(activeReport.value.id);

        // Eliminar l'informe de la llista local
        allReports.value = allReports.value.filter(report => report.id !== activeReport.value.id);

        showDeleteModal.value = false;
        
        // Actualitzar estadístiques
        await loadStats();
    } catch (error) {
        console.error("Error eliminant informe:", error);
        showDeleteModal.value = false;
        loadReports();
    }
}

// Funcions per obrir modals
function openImageModal(imagePath) {
    selectedImage.value = imagePath;
    showImageModal.value = true;
}

function openAssignModal(report) {
    activeReport.value = { ...report }; // Clonar per evitar canvis reactius inesperats
    selectedTechId.value = report.user_assigned || null;
    showAssignModal.value = true;
    loadTechnicians();
}

function openStatusModal(report) {
    activeReport.value = { ...report };
    selectedStatus.value = report.status;
    showStatusModal.value = true;
}

function openNoteModal(report) {
    activeReport.value = { ...report };
    reportNote.value = report.note || '';
    showNoteModal.value = true;
}

function openDeleteModal(report) {
    activeReport.value = { ...report };
    showDeleteModal.value = true;
}

// Utilidades
function formatDate(dateString) {
    if (!dateString) return 'Data desconeguda';

    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ca-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(date);
}
</script>

<style scoped>
.animate-fade-in {
    animation: fadeIn 0.4s ease-out forwards;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Animación de pulso para el estado de carga */
.animate-pulse {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {

    0%,
    100% {
        opacity: 1;
    }

    50% {
        opacity: 0.5;
    }
}

/* Estilos para los estados */
.bg-yellow-500\/20 {
    background-color: rgba(234, 179, 8, 0.2);
}

.bg-blue-500\/20 {
    background-color: rgba(59, 130, 246, 0.2);
}

.bg-green-500\/20 {
    background-color: rgba(34, 197, 94, 0.2);
}

.bg-red-500\/20 {
    background-color: rgba(239, 68, 68, 0.2);
}

.bg-purple-500\/20 {
    background-color: rgba(168, 85, 247, 0.2);
}
</style>