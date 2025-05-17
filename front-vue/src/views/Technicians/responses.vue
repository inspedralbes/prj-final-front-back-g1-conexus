<template>
    <div class="bg-slate-900/10 backdrop-blur-sm rounded-xl p-6 shadow-2xl animate-fade-in border border-slate-700/30">
        <!-- Capçalera -->
        <div class="flex items-center justify-between mb-8">
            <h2 class="text-2xl font-bold text-white">
                <span class="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                    Comentaris de l'objecte perdut
                </span>
            </h2>
            <button 
                @click="router.back()"
                class="p-2 text-gray-400 hover:text-white transition-colors duration-300 rounded-full hover:bg-slate-700/50"
            >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
            </button>
        </div>

        <!-- Loading state -->
        <div v-if="isLoading" class="text-center py-8">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p class="text-gray-500 mt-4">Carregant...</p>
        </div>

        <!-- Error state -->
        <div v-else-if="error" class="text-center py-8">
            <p class="text-red-400">{{ error }}</p>
            <button 
                @click="loadData"
                class="mt-4 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-300"
            >
                Tornar-ho a provar
            </button>
        </div>

        <!-- Content -->
        <template v-else>
            <!-- Detalls de l'objecte perdut -->
            <div v-if="lostObject" class="mb-8 p-4 bg-slate-800/50 rounded-lg border border-slate-700/30 hover:border-slate-600 transition-colors duration-300">
                <h2 class="text-xl font-semibold text-white mb-2">{{ lostObject.title }}</h2>
                <p class="text-gray-300 mb-3">{{ lostObject.description }}</p>
                <div class="flex flex-wrap gap-4 text-sm">
                    <div class="flex items-center text-gray-400">
                        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {{ formatDate(lostObject.created_at) }}
                    </div>
                    <div class="flex items-center text-gray-400">
                        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {{ lostObject.location || 'Ubicació desconeguda' }}
                    </div>
                </div>
            </div>

            <!-- Formulari per afegir comentari -->
            <div class="mb-8 bg-slate-800/50 rounded-xl p-6 border border-slate-700/30">
                <form @submit.prevent="submitResponse" class="space-y-4">
                    <div>
                        <label for="comment" class="block text-sm font-medium text-gray-300 mb-2">Afegir comentari</label>
                        <textarea 
                            id="comment"
                            v-model="newResponse.comment"
                            rows="3"
                            class="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
                            required
                            placeholder="Escriu el teu comentari..."
                        ></textarea>
                    </div>
                    <div class="flex justify-end">
                        <button 
                            type="submit"
                            class="px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg shadow-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 flex items-center"
                        >
                            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                            </svg>
                            Publicar comentari
                        </button>
                    </div>
                </form>
            </div>

            <!-- Llista de comentaris -->
            <div v-if="responses.length === 0" class="text-center py-8 text-gray-500">
                No hi ha comentaris encara
            </div>

            <div v-else class="space-y-4">
                <div v-for="response in responses" :key="response.id"
                    class="p-4 bg-slate-800/50 rounded-lg border border-slate-700/30 hover:border-slate-600 transition-colors duration-300">
                    <div class="flex justify-between items-start mb-3">
                        <p class="text-gray-300">{{ response.comment }}</p>
                        <button 
                            v-if="canDeleteResponse(response)"
                            @click="deleteResponseHandler(response.id)"
                            class="text-gray-400 hover:text-red-400 transition-colors duration-300 p-1"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                            </svg>
                        </button>
                    </div>
                    <div class="flex items-center text-gray-400 text-sm">
                        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {{ formatDate(response.created_at) }}
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAppStore } from '@/stores/index.js';
import { getLostObjectById, getLostObjectResponses, createResponse, deleteResponse } from '@/services/communicationsScripts/lostObjectManager.js';

const route = useRoute();
const router = useRouter();
const store = useAppStore();

const lostObject = ref(null);
const responses = ref([]);
const newResponse = ref({
    comment: ''
});
const isLoading = ref(true);
const error = ref(null);

const formatDate = (dateString) => {
    if (!dateString) return 'Data no disponible';
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('ca-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (error) {
        console.error('Error formatting date:', error);
        return 'Data no disponible';
    }
};

const loadData = async () => {
    isLoading.value = true;
    error.value = null;
    try {
        const objectId = route.params.id;
        lostObject.value = await getLostObjectById(objectId);
        responses.value = await getLostObjectResponses(objectId);
    } catch (error) {
        console.error('Error loading data:', error);
        error.value = 'No s\'han pogut carregar les dades. Si us plau, torna-ho a provar més tard.';
    } finally {
        isLoading.value = false;
    }
};

const submitResponse = async () => {
    try {
        const objectId = route.params.id;
        
        const currentUser = store.user;
        
        if (!currentUser || !currentUser.id) {
            console.error('No hi ha usuari actual o falta l\'ID');
            return;
        }
        
        await createResponse(objectId, {
            comment: newResponse.value.comment,
            user_id: currentUser.id
        });
        
        newResponse.value.comment = '';
        await loadData();
    } catch (error) {
        console.error('Error submitting response:', error);
    }
};

const canDeleteResponse = (response) => {
    const user = store.user;
    return user && (user.id === response.user_id || user.typeusers?.name === 'Administrador');
};

const deleteResponseHandler = async (responseId) => {
    try {
        const objectId = route.params.id;
        await deleteResponse(objectId, responseId);
        await loadData();
    } catch (error) {
        console.error('Error deleting response:', error);
    }
};

onMounted(loadData);
</script>

<style scoped>
.animate-fade-in {
    animation: fadeIn 0.5s ease-in-out;
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

textarea {
    resize: vertical;
    min-height: 100px;
    transition: all 0.3s ease;
}

textarea:focus {
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
}
</style>