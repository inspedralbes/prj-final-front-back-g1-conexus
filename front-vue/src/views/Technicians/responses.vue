<template>
    <div class="p-6 bg-slate-900/50 backdrop-blur-sm rounded-xl shadow-lg border border-slate-700/50">
        <div class="flex items-center justify-between mb-6">
            <h1 class="text-2xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                Comentaris
            </h1>
            <button
                @click="goBack"
                class="px-4 py-2 border border-slate-600 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors"
            >
                Tornar
            </button>
        </div>

        <!-- Lost Object Details -->
        <div v-if="lostObject" class="mb-6 p-4 bg-slate-800/50 rounded-lg border border-slate-700/30">
            <h2 class="text-xl font-medium text-slate-300 mb-2">{{ lostObject.title }}</h2>
            <p class="text-slate-300">{{ lostObject.description }}</p>
            <p class="text-slate-400 text-sm mt-2">
                Data de trobada: {{ formatDate(lostObject.created_at || lostObject.createdAt || lostObject.foundDate) }}
            </p>
        </div>

        <!-- Comment Form -->
        <form @submit.prevent="submitComment" class="mb-6">
            <div class="flex gap-2">
                <textarea
                    v-model="newComment"
                    placeholder="Escriu un comentari..."
                    class="flex-grow px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="3"
                    required
                ></textarea>
                <button
                    type="submit"
                    class="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg shadow hover:from-blue-600 hover:to-indigo-700 transition-all duration-300"
                >
                    Enviar
                </button>
            </div>
        </form>

        <!-- Comments List -->
        <div v-if="comments.length > 0" class="space-y-4">
            <div v-for="comment in comments" :key="comment.id" class="bg-slate-800/30 rounded-lg p-4">
                <div class="flex justify-between items-start">
                    <p class="text-slate-300">{{ comment.comment }}</p>
                    <button
                        v-if="comment.user_id === currentUserId"
                        @click="deleteComment(comment.id)"
                        class="text-red-400 hover:text-red-300"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                        </svg>
                    </button>
                </div>
                <p class="text-xs text-slate-400 mt-2">{{ formatDate(comment.created_at) }}</p>
            </div>
        </div>
        <p v-else class="text-slate-400 text-center py-4">No hi ha comentaris encara</p>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getLostObjectById, getResponsesByLostObjectId, createResponse, deleteResponse } from '@/services/communicationsScripts/lostObjectManager.js';

const route = useRoute();
const router = useRouter();
const lostObject = ref(null);
const comments = ref([]);
const newComment = ref('');
const currentUserId = ref(1); // This should be replaced with the actual logged-in user's ID

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

const goBack = () => {
    router.back();
};

const submitComment = async () => {
    try {
        const commentData = {
            user_id: currentUserId.value,
            lostAndFound_id: route.params.id,
            comment: newComment.value
        };

        await createResponse(commentData);
        newComment.value = ''; // Clear the comment input
        await fetchComments(); // Refresh comments
    } catch (error) {
        console.error('Error submitting comment:', error);
    }
};

const deleteComment = async (commentId) => {
    try {
        await deleteResponse(commentId);
        await fetchComments(); // Refresh comments
    } catch (error) {
        console.error('Error deleting comment:', error);
    }
};

const fetchLostObject = async () => {
    try {
        lostObject.value = await getLostObjectById(route.params.id);
    } catch (error) {
        console.error('Error fetching lost object:', error);
    }
};

const fetchComments = async () => {
    try {
        comments.value = await getResponsesByLostObjectId(route.params.id);
    } catch (error) {
        console.error('Error fetching comments:', error);
    }
};

onMounted(async () => {
    await Promise.all([
        fetchLostObject(),
        fetchComments()
    ]);
});
</script>

<style scoped>
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
</style>
