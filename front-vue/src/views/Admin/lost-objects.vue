<template>
    <div class="p-6 bg-slate-900/50 backdrop-blur-sm rounded-xl shadow-lg border border-slate-700/50">
        <h1 class="text-2xl font-bold text-white mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
            Objectes Perduts
        </h1>

        <!-- Formulari d'objectes perduts -->
        <transition name="fade">
            <div v-if="showForm" class="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div class="fixed inset-0 bg-black/60 backdrop-blur-sm" @click="showForm = false"></div>
                <transition name="pop">
                    <div class="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 max-w-md w-full border border-slate-700/50 shadow-2xl">
                        <h2 class="text-xl font-bold text-white mb-4">Registrar Objecte Perdut</h2>
                        
                        <form @submit.prevent="submitLostObject" class="space-y-4">
                            <div>
                                <label for="objectName" class="block text-sm font-medium text-slate-300 mb-1">Nom de l'objecte</label>
                                <input 
                                    type="text" 
                                    id="objectName" 
                                    v-model="lostObject.objectName" 
                                    class="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            
                            <div>
                                <label for="description" class="block text-sm font-medium text-slate-300 mb-1">Descripció</label>
                                <textarea 
                                    id="description" 
                                    v-model="lostObject.description" 
                                    class="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    rows="3"
                                    required
                                ></textarea>
                            </div>
                            
                            <div>
                                <label for="location" class="block text-sm font-medium text-slate-300 mb-1">Lloc on es va trobar</label>
                                <input 
                                    type="text" 
                                    id="location" 
                                    v-model="lostObject.location" 
                                    class="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            
                            <div>
                                <label for="foundDate" class="block text-sm font-medium text-slate-300 mb-1">Data de trobada</label>
                                <input 
                                    type="date" 
                                    id="foundDate" 
                                    v-model="lostObject.foundDate" 
                                    class="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            
                            <div>
                                <label for="image" class="block text-sm font-medium text-slate-300 mb-1">Imatge (opcional)</label>
                                <input 
                                    type="file" 
                                    id="image" 
                                    @change="handleImageUpload"
                                    accept="image/*"
                                    class="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            
                            <div class="flex justify-end space-x-3 pt-4">
                                <button 
                                    type="button" 
                                    @click="showForm = false"
                                    class="px-4 py-2 border border-slate-600 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors"
                                >
                                    Cancel·lar
                                </button>
                                <button 
                                    type="submit"
                                    class="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg shadow hover:from-blue-600 hover:to-indigo-700 transition-all duration-300"
                                >
                                    Registrar
                                </button>
                            </div>
                        </form>
                    </div>
                </transition>
            </div>
        </transition>

        <div v-if="lostObjects.length === 0" class="text-center py-8">
            <p class="text-slate-400">No hi ha objectes perduts registrats</p>
        </div>

        <div v-else class="space-y-4">
            <div v-for="item in lostObjects" :key="item.id"
                class="p-4 bg-slate-800/50 rounded-lg border border-slate-700/30 hover:border-slate-600 transition-colors">
                <div class="flex justify-between items-start">
                    <div class="mt-3 space-y-2 flex-grow">
                        <h1 class="text-slate-300">
                            <span class="text-slate-400 font-medium">Titol:</span> {{ item.title }}
                        </h1>
                        <p class="text-slate-300">
                            <span class="text-slate-400 font-medium">Descripció:</span> {{ item.description }}
                        </p>
                        <p class="text-slate-300">
                            <span class="text-slate-400 font-medium">Data de trobada:</span> {{ formatDate(item.created_at || item.createdAt || item.foundDate) }}
                        </p>
                    </div>
                    
                    <button 
                        @click="confirmDelete(item)"
                        class="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-full transition-all"
                        title="Eliminar objecte"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                        </svg>
                    </button>
                </div>

                <div v-if="item.image" class="mt-4">
                    <img :src="baseUrl + item.image" alt="Imatge de l'objecte perdut"
                        class="max-w-full h-auto rounded-lg border border-slate-700/50 max-h-60 object-contain">
                </div>
            </div>
        </div>
        
        <!-- Modal de confirmación para eliminar -->
        <transition name="fade">
            <div v-if="showDeleteModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div class="fixed inset-0 bg-black/60 backdrop-blur-sm" @click="showDeleteModal = false"></div>
                <transition name="pop">
                    <div class="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 max-w-md w-full border border-slate-700/50 shadow-2xl">
                        <h2 class="text-xl font-bold text-white mb-4">Confirmar eliminació</h2>
                        <p class="text-slate-300 mb-6">Estàs segur que vols eliminar l'objecte "{{ objectToDelete?.title }}"?</p>
                        
                        <div class="flex justify-end space-x-3">
                            <button 
                                @click="showDeleteModal = false"
                                class="px-4 py-2 border border-slate-600 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors"
                            >
                                Cancel·lar
                            </button>
                            <button 
                                @click="deleteObject"
                                class="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg shadow hover:from-red-600 hover:to-red-700 transition-all duration-300"
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>
                </transition>
            </div>
        </transition>
    </div>

    <!-- Botón con tooltip -->
    <div class="fixed bottom-8 right-10 z-40 tooltip">
        <button
            @click="showForm = true" 
            class="px-4 py-3 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-full shadow-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
            </svg>
        </button>
        <span class="tooltiptext">Postegar objecte perdut</span>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getAllLostObjects, createLostObject, deleteLostObject } from '@/services/communicationsScripts/lostObjectManager.js';

const lostObjects = ref([]);
const showForm = ref(false);
const showDeleteModal = ref(false);
const objectToDelete = ref(null);
const baseUrl = import.meta.env.VITE_LOST_OBJECT_URL;

const lostObject = ref({
    objectName: '',
    description: '',
    location: '',
    foundDate: new Date().toISOString().split('T')[0],
    image: null
});

const formatDate = (dateString) => {
    if (!dateString) return 'Data no disponible';
    
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'Data no disponible';
        
        return date.toLocaleDateString('ca-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    } catch (error) {
        console.error('Error formatting date:', error);
        return 'Data no disponible';
    }
};

const handleImageUpload = (event) => {
    lostObject.value.image = event.target.files[0];
};

const submitLostObject = async () => {
    try {
        await createLostObject(lostObject.value);
        
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

onMounted(async () => {
    try {
        lostObjects.value = await getAllLostObjects();
    } catch (error) {
        console.error('Error fetching lost objects:', error);
    }
});

// Función para confirmar la eliminación
const confirmDelete = (item) => {
    objectToDelete.value = item;
    showDeleteModal.value = true;
};

// Función para eliminar el objeto
const deleteObject = async () => {
    try {
        if (objectToDelete.value && objectToDelete.value.id) {
            await deleteLostObject(objectToDelete.value.id);
            lostObjects.value = lostObjects.value.filter(obj => obj.id !== objectToDelete.value.id);
            showDeleteModal.value = false;
            objectToDelete.value = null;
        }
    } catch (error) {
        console.error('Error al eliminar objeto perdido:', error);
    }
};
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

.tooltip .tooltiptext {
    visibility: hidden;
    width: max-content;
    background-color: #1e293b;
    color: #e2e8f0;
    text-align: center;
    border-radius: 8px;
    padding: 6px 6px;
    position: absolute;
    z-index: 1;
    bottom: 125%;
    left: 50%;
    transform: translateX(-50%) translateY(5px);
    opacity: 0;
    transition: all 0.2s cubic-bezier(0.18, 0.89, 0.32, 1.28);
    font-size: 0.75rem;
    border: 1px solid #334155;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.tooltip:hover .tooltiptext {
    visibility: visible;
    opacity: 1;
    transform: translateX(-50%) translateY(0);
}

.tooltip .tooltiptext::after {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: #1e293b transparent transparent transparent;
}
</style>