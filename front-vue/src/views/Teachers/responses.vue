<template>
    <div class="bg-slate-900/10 backdrop-blur-sm rounded-xl p-6 shadow-2xl animate-fade-in border border-slate-700/30">
        <!-- Capçalera -->
        <div class="flex items-center justify-between mb-8">
            <div>
                <h2 class="text-2xl font-bold text-white mb-2">
                    <span class="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                        Comentaris de l'objecte perdut
                    </span>
                </h2>
                <p class="text-gray-400 text-sm">Gestiona els comentaris d'aquest objecte perdut</p>
            </div>
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
        <div v-if="isLoading" class="text-center py-12">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
            <p class="text-gray-400 mt-4">Carregant...</p>
        </div>

        <!-- Error state -->
        <div v-else-if="error" class="text-center py-12">
            <div class="bg-red-500/10 p-8 rounded-xl border border-red-500/20 max-w-md mx-auto">
                <svg class="w-16 h-16 mx-auto text-red-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p class="text-red-400 mb-4">{{ error }}</p>
                <button 
                    @click="loadData"
                    class="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg shadow hover:from-red-600 hover:to-red-700 transition-all duration-300"
                >
                    Tornar-ho a provar
                </button>
            </div>
        </div>

        <!-- Content -->
        <template v-else>
            <!-- Detalls de l'objecte perdut -->
            <div v-if="lostObject" class="mb-8 p-6 bg-slate-800/50 rounded-xl border border-slate-700/30 hover:border-slate-600 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/5">
                <div class="flex items-start justify-between">
                    <div class="flex-1">
                        <h2 class="text-xl font-semibold text-white mb-2">{{ lostObject.title }}</h2>
                        <p class="text-gray-300 mb-4">{{ lostObject.description }}</p>
                        <div class="flex flex-wrap gap-4 text-sm">
                            <div class="flex items-center text-gray-400">
                                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                {{ formatDate(lostObject.created_at) }}
                            </div>
                            <div class="flex items-center text-gray-400">
                                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                {{ lostObject.location || 'Ubicació desconeguda' }}
                            </div>
                        </div>
                    </div>
                    <div class="bg-purple-500/10 p-3 rounded-lg border border-purple-500/20">
                        <svg class="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                        </svg>
                    </div>
                </div>

                <!-- Imatge de l'objecte perdut -->
                <div v-if="lostObject.image" class="mt-6">
                    <img 
                        :src="baseUrl + lostObject.image" 
                        :alt="lostObject.title"
                        class="max-w-full h-auto rounded-lg border border-slate-700/50 max-h-60 object-contain mx-auto hover:shadow-lg transition-all duration-300"
                    />
                </div>
            </div>

            <!-- Formulari per afegir comentari -->
            <div class="mb-8 p-6 bg-slate-800/50 rounded-xl border border-slate-700/30">
                <form @submit.prevent="submitResponse" class="space-y-4">
                    <div>
                        <label for="comment" class="block text-sm font-medium text-gray-300 mb-2">Afegir comentari</label>
                        <textarea 
                            id="comment"
                            v-model="newResponse.comment"
                            rows="3"
                            class="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                            placeholder="Escriu el teu comentari aquí..."
                            required
                        ></textarea>
                    </div>
                    <div class="flex justify-end">
                        <button 
                            type="submit"
                            class="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg shadow hover:from-purple-600 hover:to-blue-600 transition-all duration-300 font-medium"
                        >
                            Publicar comentari
                        </button>
                    </div>
                </form>
            </div>

            <!-- Llista de comentaris -->
            <div v-if="responses.length === 0" class="text-center py-12">
                <div class="bg-slate-800/50 p-8 rounded-xl border border-slate-700/30 max-w-md mx-auto">
                    <svg class="w-16 h-16 mx-auto text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <p class="text-lg text-gray-400 mb-2">No hi ha comentaris encara</p>
                    <p class="text-sm text-gray-500">Sigues el primer a comentar!</p>
                </div>
            </div>

            <div v-else class="space-y-4">
                <div v-for="response in responses" :key="response.id"
                    class="p-6 bg-slate-800/50 rounded-xl border border-slate-700/30 hover:border-slate-600 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/5">
                    <div class="flex justify-between items-start">
                        <div class="flex-1">
                            <p class="text-gray-300 mb-3">{{ response.comment }}</p>
                            <div class="flex items-center text-gray-400 text-sm">
                                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {{ formatDate(response.created_at) }}
                            </div>
                        </div>
                        <button 
                            v-if="canDeleteResponse(response)"
                            @click="deleteResponseHandler(response.id)"
                            class="ml-4 p-2 text-gray-400 hover:text-red-400 transition-colors rounded-full hover:bg-red-500/10"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAppStore } from '@/stores/index.js';
import { getLostObjectById, getLostObjectResponses, createResponse, deleteResponse, deleteLostObject as deleteLostObjectService } from '@/services/communicationsScripts/lostObjectManager.js';

const route = useRoute();
const router = useRouter();
const store = useAppStore();
const baseUrl = import.meta.env.VITE_LOST_OBJECT_URL;

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
        
        // El currentUser debe obtenerse directamente del store
        const currentUser = store.user;
        
        if (!currentUser || !currentUser.id) {
            console.error('No hi ha usuari actual o falta l\'ID');
            return;
        }
        
        await createResponse(objectId, {
            comment: newResponse.value.comment,
            user_id: currentUser.id // Usar el ID directamente, no desde getUser()
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

const canDeleteLostObject = computed(() => {
    const user = store.user;
    return user && (user.id === lostObject.value?.user_id || user.typeusers?.name === 'Administrador');
});

const deleteLostObject = async () => {
    try {
        const objectId = route.params.id;
        await deleteLostObjectService(objectId);
        router.push('/teachers/lost-objects');
    } catch (error) {
        console.error('Error deleting lost object:', error);
    }
};

onMounted(loadData);
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

/* Line clamp per descripcions llargues */
.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>
