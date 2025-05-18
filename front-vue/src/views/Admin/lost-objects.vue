<template>
    <div class="py-8 px-4 sm:px-6 mt-9 mb-9">
        <div
            class="max-w-6xl mx-auto bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-slate-700/50">
            <!-- Capçalera -->
            <div class="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
                <div class="flex items-center justify-between">
                    <h1 class="text-2xl font-bold flex items-center">
                        <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                        </svg>
                        Gestió d'Objectes Perduts
                    </h1>
                    <button @click="showForm = true"
                        class="flex items-center text-sm bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors">
                        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                        </svg>
                        Nou Objecte
                    </button>
                </div>
            </div>

            <!-- Contingut -->
            <div class="p-6">
                <!-- Filtres i cerca -->
                <div class="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div class="relative w-full sm:w-64">
                        <input type="text" v-model="searchQuery" placeholder="Cercar objectes..."
                            class="w-full pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        <svg class="w-5 h-5 text-slate-400 absolute left-3 top-2.5" fill="none" stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <div class="flex items-center space-x-2">
                        <label class="text-sm text-slate-300">Filtrar per:</label>
                        <select v-model="filterBy"
                            class="bg-slate-700/50 border border-slate-600 rounded-lg text-white px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500">
                            <option value="all">Tots</option>
                            <option value="lastWeek">Última setmana</option>
                            <option value="lastMonth">Últim mes</option>
                        </select>
                    </div>
                </div>

                <!-- Llistat d'objectes -->
                <div v-if="filteredObjects.length === 0" class="text-center py-12">
                    <svg class="w-16 h-16 mx-auto text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1"
                            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p class="mt-4 text-slate-400">No s'han trobat objectes perduts</p>
                    <button @click="showForm = true"
                        class="mt-4 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg shadow hover:from-blue-600 hover:to-indigo-700 transition-all duration-300">
                        Afegir primer objecte
                    </button>
                </div>

                <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div v-for="item in filteredObjects" :key="item.id"
                        class="bg-slate-800/30 rounded-xl border border-slate-700/50 hover:border-slate-600 transition-colors overflow-hidden animate-fade-in">
                        <!-- Capçalera de l'objecte -->
                        <div class="p-4 border-b border-slate-700/50">
                            <div class="flex justify-between items-start">
                                <h3 class="text-lg font-medium text-white truncate">{{ item.title }}</h3>
                                <div class="flex space-x-2">
                                    <button @click="editObject(item)"
                                        class="p-1.5 text-blue-400 hover:text-blue-300 transition-colors"
                                        title="Editar">
                                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                    </button>
                                    <button @click="confirmDelete(item)"
                                        class="p-1.5 text-red-400 hover:text-red-300 transition-colors"
                                        title="Eliminar">
                                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            <p class="text-sm text-slate-400 mt-1">{{ formatDate(item.created_at || item.createdAt ||
                                item.foundDate) }}</p>
                        </div>

                        <!-- Contingut de l'objecte -->
                        <div class="p-4">
                            <p class="text-slate-300 mb-4">{{ item.description }}</p>

                            <div class="space-y-2 text-sm text-slate-400">
                                <div class="flex items-center">
                                    <svg class="w-4 h-4 mr-2 text-purple-400" fill="none" stroke="currentColor"
                                        viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <span>{{ item.location }}</span>
                                </div>
                                <div class="flex items-center">
                                    <svg class="w-4 h-4 mr-2 text-blue-400" fill="none" stroke="currentColor"
                                        viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                    </svg>
                                    <span>{{ item.responses_count || item.responses?.length || 0 }} comentaris</span>
                                </div>
                            </div>

                            <!-- Imatge de l'objecte -->
                            <div v-if="item.image" class="mt-4">
                                <img :src="baseUrl + item.image" alt="Imatge de l'objecte perdut"
                                    class="w-full h-40 object-cover rounded-lg border border-slate-700/50">
                            </div>
                        </div>

                        <!-- Peu de l'objecte -->
                        <div class="px-4 py-3 bg-slate-800/50 border-t border-slate-700/50 flex justify-end">
                            <button @click="goToResponses(item.id)"
                                class="text-sm text-blue-400 hover:text-blue-300 transition-colors flex items-center">
                                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                </svg>
                                Gestionar comentaris
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal per crear/editar objecte -->
        <transition name="fade">
            <div v-if="showForm" class="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div class="fixed inset-0 bg-black/60 backdrop-blur-sm" @click="showForm = false"></div>
                <transition name="pop">
                    <div
                        class="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 w-full max-w-2xl border border-slate-700/50 shadow-2xl z-10">
                        <div class="flex justify-between items-center mb-4">
                            <h2 class="text-xl font-bold text-white">
                                {{ isEditing ? 'Editar Objecte' : 'Registrar Nou Objecte' }}
                            </h2>
                            <button @click="showForm = false" class="text-gray-400 hover:text-white">
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <form @submit.prevent="submitLostObject" class="space-y-4">
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-300 mb-2">Nom de l'objecte</label>
                                    <input type="text" v-model="lostObject.objectName"
                                        class="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-3 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required placeholder="Ex: Telèfon mòbil" />
                                </div>

                                <div>
                                    <label class="block text-sm font-medium text-gray-300 mb-2">Lloc on es va
                                        trobar</label>
                                    <input type="text" v-model="lostObject.location"
                                        class="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-3 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required placeholder="Ex: Aula 101" />
                                </div>
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-gray-300 mb-2">Descripció</label>
                                <textarea v-model="lostObject.description"
                                    class="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-3 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[100px]"
                                    required placeholder="Descriu l'objecte amb detall..."></textarea>
                            </div>

                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-300 mb-2">Data de trobada</label>
                                    <input type="date" v-model="lostObject.foundDate"
                                        class="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-3 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required />
                                </div>

                                <div>
                                    <label class="block text-sm font-medium text-gray-300 mb-2">Imatge
                                        (opcional)</label>
                                    <div class="flex items-center space-x-4">
                                        <label
                                            class="cursor-pointer bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-2 hover:bg-slate-700 transition-colors">
                                            <span v-if="!lostObject.image">Seleccionar imatge</span>
                                            <span v-else class="text-green-400">Imatge seleccionada</span>
                                            <input type="file" @change="handleImageUpload" accept="image/*"
                                                class="hidden" />
                                        </label>
                                        <button v-if="lostObject.image && isEditing" @click="lostObject.image = null"
                                            type="button" class="text-red-400 hover:text-red-300 text-sm">
                                            Eliminar imatge
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div v-if="lostObject.image && typeof lostObject.image === 'string'" class="mt-2">
                                <img :src="baseUrl + lostObject.image" alt="Imatge actual"
                                    class="h-32 object-contain rounded-lg border border-slate-700/50">
                            </div>

                            <div class="flex justify-end space-x-3 pt-4 border-t border-slate-700">
                                <button type="button" @click="showForm = false"
                                    class="px-6 py-2 border border-slate-600 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors">
                                    Cancel·lar
                                </button>
                                <button type="submit"
                                    class="px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg shadow hover:from-blue-600 hover:to-indigo-700 transition-all duration-300"
                                    :disabled="submitting">
                                    <span v-if="submitting">Guardant...</span>
                                    <span v-else>{{ isEditing ? 'Guardar canvis' : 'Registrar objecte' }}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </transition>
            </div>
        </transition>

        <!-- Modal de confirmació per eliminar objecte -->
        <transition name="fade">
            <div v-if="showDeleteModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div class="fixed inset-0 bg-black/60 backdrop-blur-sm" @click="showDeleteModal = false"></div>
                <transition name="pop">
                    <div
                        class="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 max-w-md w-full border border-slate-700/50 shadow-2xl z-10">
                        <h2 class="text-xl font-bold text-white mb-4">Confirmar eliminació</h2>

                        <p class="text-slate-300 mb-6">
                            Esteu segur que voleu eliminar l'objecte "{{ objectToDelete?.title }}"?
                            <br>
                            <span class="text-red-400">Aquesta acció no es pot desfer.</span>
                        </p>

                        <div class="flex justify-end space-x-3">
                            <button @click="showDeleteModal = false"
                                class="px-4 py-2 border border-slate-600 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors">
                                Cancel·lar
                            </button>
                            <button @click="handleDeleteObject"
                                class="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg shadow hover:from-red-600 hover:to-red-700 transition-all duration-300"
                                :disabled="deleting">
                                <span v-if="deleting">Eliminant...</span>
                                <span v-else>Eliminar</span>
                            </button>
                        </div>
                    </div>
                </transition>
            </div>
        </transition>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { getAllLostObjects, createLostObject, updateLostObject, deleteLostObject } from '@/services/communicationsScripts/lostObjectManager.js';
import { useRouter } from 'vue-router';

const router = useRouter();
const lostObjects = ref([]);
const showForm = ref(false);
const showDeleteModal = ref(false);
const objectToDelete = ref(null);
const deleting = ref(false);
const submitting = ref(false);
const isEditing = ref(false);
const searchQuery = ref('');
const filterBy = ref('all');
const baseUrl = import.meta.env.VITE_LOST_OBJECT_URL;

const lostObject = ref({
    id: null,
    objectName: '',
    description: '',
    location: '',
    foundDate: new Date().toISOString().split('T')[0],
    image: null
});

// Filtrem els objectes segons la cerca i filtres
const filteredObjects = computed(() => {
    let result = lostObjects.value;

    // Filtrar per text de cerca
    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        result = result.filter(obj =>
            obj.title.toLowerCase().includes(query) ||
            obj.description.toLowerCase().includes(query) ||
            obj.location.toLowerCase().includes(query)
        );
    }

    // Filtrar per data
    if (filterBy.value !== 'all') {
        const now = new Date();
        result = result.filter(obj => {
            const objDate = new Date(obj.created_at || obj.createdAt || obj.foundDate);
            const diffTime = now - objDate;
            const diffDays = diffTime / (1000 * 60 * 60 * 24);

            if (filterBy.value === 'lastWeek') return diffDays <= 7;
            if (filterBy.value === 'lastMonth') return diffDays <= 30;
            return true;
        });
    }

    return result;
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

const editObject = (object) => {
    isEditing.value = true;
    lostObject.value = {
        id: object.id,
        objectName: object.title,
        description: object.description,
        location: object.location,
        foundDate: object.foundDate || object.created_at.split('T')[0],
        image: object.image
    };
    showForm.value = true;
};

const resetForm = () => {
    lostObject.value = {
        id: null,
        objectName: '',
        description: '',
        location: '',
        foundDate: new Date().toISOString().split('T')[0],
        image: null
    };
    isEditing.value = false;
};

const submitLostObject = async () => {
    try {
        submitting.value = true;

        const objectData = {
            title: lostObject.value.objectName,
            description: lostObject.value.description,
            location: lostObject.value.location,
            foundDate: lostObject.value.foundDate,
            user_id: localStorage.getItem('userId') || '1', // Afegim l'ID de l'usuari
            image: lostObject.value.image
        };

        console.log("Dades que s'enviaran:", objectData);

        if (isEditing.value) {
            await updateLostObject(lostObject.value.id, objectData);
        } else {
            await createLostObject(objectData);
        }

        // Actualitzem la llista
        lostObjects.value = await getAllLostObjects();

        // Tanquem el formulari i resetegem
        showForm.value = false;
        resetForm();
    } catch (error) {
        console.error('Error al guardar objecte:', error);
    } finally {
        submitting.value = false;
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

        // Actualitzem la llista
        lostObjects.value = lostObjects.value.filter(obj => obj.id !== objectToDelete.value.id);

        // Tanquem el modal
        showDeleteModal.value = false;
        objectToDelete.value = null;
    } catch (error) {
        console.error('Error al eliminar objecte:', error);
    } finally {
        deleting.value = false;
    }
};

onMounted(async () => {
    try {
        lostObjects.value = await getAllLostObjects();
    } catch (error) {
        console.error('Error carregant objectes perduts:', error);
    }
});
</script>

<style scoped>
.animate-fade-in {
    animation: fadeIn 0.3s ease forwards;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(5px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

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

/* Barra de desplaçament */
::-webkit-scrollbar {
    width: 8px;
    height: 8px;
}

::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 4px;
}

::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.2);
}

/* Estil per a inputs de tipus date */
input[type="date"] {
    color-scheme: dark;
}
</style>