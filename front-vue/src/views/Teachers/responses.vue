<template>
    <div class="p-6 bg-slate-900/50 backdrop-blur-sm rounded-xl shadow-lg border border-slate-700/50">
        <div class="flex items-center justify-between mb-6">
            <h1 class="text-2xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                Comentaris de l'objecte perdut
            </h1>
            <button 
                @click="router.back()"
                class="px-4 py-2 text-slate-300 hover:text-white transition-colors"
            >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
            </button>
        </div>

        <!-- Loading state -->
        <div v-if="isLoading" class="text-center py-8">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p class="text-slate-400 mt-4">Carregant...</p>
        </div>

        <!-- Error state -->
        <div v-else-if="error" class="text-center py-8">
            <p class="text-red-400">{{ error }}</p>
            <button 
                @click="loadData"
                class="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
                Tornar-ho a provar
            </button>
        </div>

        <!-- Content -->
        <template v-else>
            <!-- Detalls de l'objecte perdut -->
            <div v-if="lostObject" class="mb-8 p-4 bg-slate-800/50 rounded-lg border border-slate-700/30">
                <h2 class="text-xl font-semibold text-white mb-2">{{ lostObject.title }}</h2>
                <p class="text-slate-300 mb-2">{{ lostObject.description }}</p>
                <p class="text-slate-400 text-sm">
                    Data de trobada: {{ formatDate(lostObject.created_at) }}
                </p>
                <p class="text-slate-400 text-sm">
                    Ubicació: {{ lostObject.location }}
                </p>
            </div>

            <!-- Formulari per afegir comentari -->
            <div class="mb-8">
                <form @submit.prevent="submitResponse" class="space-y-4">
                    <div>
                        <label for="comment" class="block text-sm font-medium text-slate-300 mb-1">Afegir comentari</label>
                        <textarea 
                            id="comment"
                            v-model="newResponse.comment"
                            rows="3"
                            class="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        ></textarea>
                    </div>
                    <div class="flex justify-end">
                        <button 
                            type="submit"
                            class="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg shadow hover:from-blue-600 hover:to-indigo-700 transition-all duration-300"
                        >
                            Publicar comentari
                        </button>
                    </div>
                </form>
            </div>

            <!-- Llista de comentaris -->
            <div v-if="responses.length === 0" class="text-center py-8">
                <p class="text-slate-400">No hi ha comentaris encara</p>
            </div>

            <div v-else class="space-y-4">
                <div v-for="response in responses" :key="response.id"
                    class="p-4 bg-slate-800/50 rounded-lg border border-slate-700/30">
                    <div class="flex justify-between items-start mb-2">
                        <p class="text-slate-300">{{ response.comment }}</p>
                        <button 
                            v-if="canDeleteResponse(response)"
                            @click="deleteResponse(response.id)"
                            class="text-slate-400 hover:text-red-400 transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                            </svg>
                        </button>
                    </div>
                    <p class="text-slate-400 text-sm">
                        {{ formatDate(response.created_at) }}
                    </p>
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
        await createResponse(objectId, {
            comment: newResponse.value.comment,
            user_id: store.getUser().id
        });
        
        newResponse.value.comment = '';
        await loadData();
    } catch (error) {
        console.error('Error submitting response:', error);
    }
};

const canDeleteResponse = (response) => {
    const user = store.getUser();
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
textarea {
    resize: vertical;
    min-height: 100px;
}
</style>
