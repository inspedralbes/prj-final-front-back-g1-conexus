<template>
    <div class="backdrop-blur-sm rounded-xl p-6 shadow-2xl animate-fade-in border border-slate-700/30 mt-9 mb-9">
        <!-- Capçalera -->
        <div class="flex justify-between items-center mb-8">
            <div>
                <h2 class="text-2xl font-bold text-white mb-2">
                    <span class="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                        Objectes Perduts
                    </span>
                </h2>
                <p class="text-gray-400 text-sm">Gestiona els objectes perduts del sistema</p>
            </div>
            <div class="flex items-center gap-4">
                <div class="bg-purple-500/10 p-3 rounded-lg border border-purple-500/20">
                    <svg class="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                    </svg>
                </div>
                <div class="bg-blue-500/10 p-3 rounded-lg border border-blue-500/20">
                    <svg class="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                </div>
            </div>
        </div>

        <!-- Filtres -->
        <div class="mb-6 space-y-4">
            <!-- Filtre de cerca -->
            <div class="relative group">
                <input 
                    type="text" 
                    v-model="searchQuery" 
                    placeholder="Cerca per títol o descripció..." 
                    class="w-full px-4 py-3 pl-12 bg-slate-800/50 border border-slate-700/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all group-hover:border-purple-500/50"
                />
                <svg class="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2 group-hover:text-purple-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </div>

            <!-- Filtre temporal -->
            <div class="flex items-center gap-4">
                <div class="flex-1">
                    <div class="relative">
                        <select 
                            v-model="timeFilter" 
                            class="w-full px-4 py-3 pl-12 bg-slate-800/50 border border-slate-700/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all appearance-none cursor-pointer hover:border-purple-500/50"
                        >
                            <option value="all">Tots els temps</option>
                            <option value="day">Avui</option>
                            <option value="week">Aquesta setmana</option>
                            <option value="month">Aquest mes</option>
                        </select>
                        <svg class="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <svg class="w-5 h-5 text-gray-400 absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>
                <button 
                    @click="clearFilters"
                    class="px-4 py-3 bg-slate-700/50 text-gray-300 rounded-xl hover:bg-slate-600/50 transition-all duration-300 flex items-center gap-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                    </svg>
                    Netejar filtres
                </button>
            </div>
        </div>

        <!-- Empty State -->
        <div v-if="lostObjects.length === 0" class="text-center py-12 text-gray-400">
            <div class="bg-slate-800/50 p-8 rounded-xl border border-slate-700/30 max-w-md mx-auto transform hover:scale-105 transition-all duration-300">
                <div class="relative">
                    <svg class="w-16 h-16 mx-auto text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                    <div class="absolute -top-2 -right-2 w-8 h-8 bg-purple-500/20 rounded-full animate-pulse"></div>
                </div>
                <p class="text-lg mb-2 font-medium">No hi ha objectes perduts registrats</p>
                <p class="text-sm text-gray-500">Els nous objectes perduts apareixeran aquí</p>
            </div>
        </div>

        <!-- Lost Objects List -->
        <div v-else class="space-y-6">
            <div v-for="item in filteredLostObjects" :key="item.id"
                class="p-6 bg-slate-800/50 rounded-xl border border-slate-700/30 hover:border-slate-600 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/5 group">
                <div class="flex justify-between items-start">
                    <div>
                        <div class="flex items-center gap-3 mb-2">
                            <h2 class="text-xl font-semibold text-white group-hover:text-purple-400 transition-colors">{{ item.title }}</h2>
                            <span class="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-xs font-medium">
                                Objecte Perdut
                            </span>
                        </div>
                        <p class="text-gray-300 mt-1 group-hover:text-gray-200 transition-colors">{{ item.description }}</p>
                        
                        <div class="flex items-center text-gray-400 mt-3 group-hover:text-gray-300 transition-colors">
                            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {{ formatDate(item.created_at || item.createdAt || item.foundDate) }}
                        </div>
                    </div>
                </div>

                <div v-if="item.image" class="mt-4 relative group">
                    <img :src="baseUrl + item.image" alt="Imatge de l'objecte perdut"
                        class="max-w-full h-auto rounded-lg border border-slate-700/50 max-h-60 object-contain mx-auto hover:shadow-lg transition-all duration-300 group-hover:border-purple-500/50">
                    <div class="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"></div>
                </div>

                <div class="flex items-center justify-between mt-4">
                    <div class="flex items-center space-x-2 text-gray-400 group-hover:text-gray-300 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clip-rule="evenodd" />
                        </svg>
                        <span class="text-sm">{{ item.responses_count || item.responses?.length || 0 }} comentaris</span>
                    </div>
                    <div class="flex space-x-2">
                        <button 
                            @click="goToResponses(item.id)"
                            class="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg shadow hover:from-purple-600 hover:to-blue-600 transition-all duration-300 flex items-center text-sm font-medium transform hover:scale-105"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clip-rule="evenodd" />
                            </svg>
                            Comentar
                        </button>
                        <button 
                            @click="confirmDelete(item)"
                            class="px-4 py-2 bg-gradient-to-r from-red-500/90 to-red-600/90 text-white rounded-lg shadow-lg hover:shadow-red-500/20 hover:from-red-500 hover:to-red-600 transition-all duration-300 flex items-center text-sm font-medium transform hover:scale-105 hover:-translate-y-0.5 group"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5 group-hover:rotate-12 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                            </svg>
                            Eliminar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Formulari d'objectes perduts - Moved outside main container -->
    <transition name="fade">
        <div v-if="showForm" class="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <div class="fixed inset-0 bg-black/60 backdrop-blur-sm" @click="showForm = false"></div>
            <transition name="pop">
                <div class="relative bg-slate-800/90 rounded-2xl p-6 max-w-2xl w-full border border-slate-700/50 shadow-2xl">
                    <div class="flex justify-between items-center mb-6">
                        <h2 class="text-xl font-bold text-white">Registrar Objecte Perdut</h2>
                        <button @click="showForm = false" class="text-gray-400 hover:text-white transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    
                    <form @submit.prevent="submitLostObject" class="space-y-6">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label for="objectName" class="block text-sm font-medium text-gray-300 mb-2">Nom de l'objecte</label>
                                <input 
                                    type="text" 
                                    id="objectName" 
                                    v-model="lostObject.objectName" 
                                    class="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                                    required
                                />
                            </div>
                            
                            <div>
                                <label for="location" class="block text-sm font-medium text-gray-300 mb-2">Lloc on es va trobar</label>
                                <input 
                                    type="text" 
                                    id="location" 
                                    v-model="lostObject.location" 
                                    class="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                                    required
                                />
                            </div>
                        </div>
                        
                        <div>
                            <label for="description" class="block text-sm font-medium text-gray-300 mb-2">Descripció</label>
                            <textarea 
                                id="description" 
                                v-model="lostObject.description" 
                                class="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                                rows="4"
                                required
                            ></textarea>
                        </div>
                        
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label for="foundDate" class="block text-sm font-medium text-gray-300 mb-2">Data de trobada</label>
                                <input 
                                    type="date" 
                                    id="foundDate" 
                                    v-model="lostObject.foundDate" 
                                    class="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                                    required
                                />
                            </div>
                            
                            <div>
                                <label for="image" class="block text-sm font-medium text-gray-300 mb-2">Imatge (opcional)</label>
                                <input 
                                    type="file" 
                                    id="image" 
                                    @change="handleImageUpload"
                                    accept="image/*"
                                    class="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-500/20 file:text-purple-400 hover:file:bg-purple-500/30"
                                />
                            </div>
                        </div>
                        
                        <div class="flex justify-end space-x-4 pt-6">
                            <button 
                                type="button" 
                                @click="showForm = false"
                                class="px-6 py-3 border border-slate-600 text-slate-300 rounded-lg hover:bg-slate-700 transition-all duration-300"
                            >
                                Cancel·lar
                            </button>
                            <button 
                                type="submit"
                                class="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg shadow hover:from-purple-600 hover:to-blue-600 transition-all duration-300 font-medium"
                            >
                                Registrar
                            </button>
                        </div>
                    </form>
                </div>
            </transition>
        </div>
    </transition>

    <!-- Floating Action Button -->
    <button
        @click="showForm = true" 
        class="fixed bottom-8 right-8 z-50 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-105"
    >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
        </svg>
    </button>

    <!-- Modal de confirmació per eliminar -->
    <transition name="fade">
        <div v-if="showDeleteModal" class="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <div class="fixed inset-0 bg-black/60 backdrop-blur-sm" @click="showDeleteModal = false"></div>
            <transition name="pop">
                <div class="relative bg-slate-800/90 rounded-2xl p-6 max-w-md w-full border border-slate-700/50 shadow-2xl">
                    <div class="flex justify-between items-center mb-6">
                        <h2 class="text-xl font-bold text-white">Confirmar eliminació</h2>
                        <button @click="showDeleteModal = false" class="text-gray-400 hover:text-white transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    
                    <div class="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6">
                        <div class="flex items-center gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                            </svg>
                            <p class="text-gray-300">
                                Estàs segur que vols eliminar l'objecte "{{ objectToDelete?.title }}"?
                                <br>
                                <span class="text-red-400 font-medium">Aquesta acció no es pot desfer.</span>
                            </p>
                        </div>
                    </div>
                    
                    <div class="flex justify-end space-x-4">
                        <button 
                            @click="showDeleteModal = false"
                            class="px-6 py-3 border border-slate-600 text-slate-300 rounded-lg hover:bg-slate-700 transition-all duration-300 transform hover:scale-105 hover:-translate-y-0.5"
                        >
                            Cancel·lar
                        </button>
                        <button 
                            @click="handleDeleteObject"
                            :disabled="deleting"
                            class="px-6 py-3 bg-gradient-to-r from-red-500/90 to-red-600/90 text-white rounded-lg shadow-lg hover:shadow-red-500/20 hover:from-red-500 hover:to-red-600 transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 hover:-translate-y-0.5 flex items-center gap-2"
                        >
                            <svg v-if="deleting" class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span v-if="deleting">Eliminant...</span>
                            <span v-else>Eliminar</span>
                        </button>
                    </div>
                </div>
            </transition>
        </div>
    </transition>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { getAllLostObjects, createLostObject, deleteLostObject } from '@/services/communicationsScripts/lostObjectManager.js';
import { useAppStore } from '@/stores/index.js';
import { useRouter } from 'vue-router';

const router = useRouter();
const store = useAppStore();
const lostObjects = ref([]);
const showForm = ref(false);
const showDeleteModal = ref(false);
const objectToDelete = ref(null);
const deleting = ref(false);
const baseUrl = import.meta.env.VITE_BACKEND_URL;
const searchQuery = ref('');
const timeFilter = ref('all');

const lostObject = ref({
    objectName: '',
    description: '',
    location: '',
    foundDate: new Date().toISOString().split('T')[0],
    image: null
});

const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ca-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

const handleImageUpload = (event) => {
    lostObject.value.image = event.target.files[0];
};

const submitLostObject = async () => {
    try {
        const currentUser = store.user;

        if (!currentUser || !currentUser.id) {
            console.error('No hi ha usuari actual o falta l\'ID');
            return;
        }

        await createLostObject(lostObject.value, currentUser.id);
        
        lostObjects.value = await getAllLostObjects();
        
        lostObject.value = {
            objectName: '',
            description: '',
            location: '',
            foundDate: new Date().toISOString().split('T')[0],
            image: null
        };
        showForm.value = false;
    } catch (error) {
        console.error('Error al registrar objeto perdido:', error);
    }
};

const goToResponses = (objectId) => {
    router.push(`/admin/config-lost-objects/${objectId}/responses`);
};

const confirmDelete = (object) => {
  objectToDelete.value = object;
  showDeleteModal.value = true;
};

const handleDeleteObject = async () => {
  if (!objectToDelete.value) return;
  
  try {
    deleting.value = true;
    await deleteLostObject(objectToDelete.value.id);
    
    // Actualizar la lista de objetos perdidos
    lostObjects.value = lostObjects.value.filter(obj => obj.id !== objectToDelete.value.id);
    
    // Cerrar el modal
    showDeleteModal.value = false;
    objectToDelete.value = null;
  } catch (error) {
    console.error('Error al eliminar objeto perdido:', error);
  } finally {
    deleting.value = false;
  }
};

// Funció per netejar els filtres
const clearFilters = () => {
    searchQuery.value = '';
    timeFilter.value = 'all';
};

// Funció per comprovar si una data està dins del rang seleccionat
const isWithinTimeRange = (date) => {
    const itemDate = new Date(date);
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    switch (timeFilter.value) {
        case 'day':
            return itemDate >= startOfDay;
        case 'week':
            return itemDate >= startOfWeek;
        case 'month':
            return itemDate >= startOfMonth;
        default:
            return true;
    }
};

// Computed property per filtrar els objectes
const filteredLostObjects = computed(() => {
    let filtered = lostObjects.value;

    // Aplicar filtre de text
    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        filtered = filtered.filter(item => 
            item.title.toLowerCase().includes(query) || 
            item.description.toLowerCase().includes(query)
        );
    }

    // Aplicar filtre temporal
    if (timeFilter.value !== 'all') {
        filtered = filtered.filter(item => 
            isWithinTimeRange(item.created_at || item.createdAt || item.foundDate)
        );
    }

    return filtered;
});

onMounted(async () => {
    try {
        lostObjects.value = await getAllLostObjects();
    } catch (error) {
        console.error('Error fetching lost objects:', error);
    }
});
</script>

<style scoped>
/* Animació d'aparició */
.animate-fade-in {
    animation: fadeIn 0.6s ease-out forwards;
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

/* Transicions pels diàlegs */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.pop-enter-active,
.pop-leave-active {
    transition: all 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28);
}

.pop-enter-from,
.pop-leave-to {
    opacity: 0;
    transform: scale(0.9) translateY(10px);
}

/* Transicions suaus */
input,
textarea,
select,
button {
    transition: all 0.2s ease;
}

/* Efectes hover */
button:hover {
    transform: translateY(-1px);
}

/* Estils per inputs de tipus date */
input[type="date"] {
    color-scheme: dark;
}

/* Line clamp per descripcions llargues */
.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

/* Animació de pulse */
@keyframes pulse {
    0%, 100% {
        opacity: 1;
    }
    50% {
        opacity: 0.5;
    }
}

.animate-pulse {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>