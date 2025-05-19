<template>
    <div class="animate-fade-in max-w-2xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <!-- Capçalera -->
        <div class="mb-8 text-center">
            <h1 class="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                Nova Incidència
            </h1>
            <p class="text-gray-300 mt-2">Informa sobre problemes o incidències</p>
        </div>

        <!-- Formulari -->
        <form @submit.prevent="submitReport"
            class="bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-slate-700">
            <!-- Descripció -->
            <div class="mb-6">
                <label for="report" class="block text-sm font-medium text-gray-300 mb-2">Descripció de la
                    incidència</label>
                <textarea id="report" v-model="reportData.report" required
                    placeholder="Descriu el problema amb detall..."
                    class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[150px]"></textarea>
            </div>

            <!-- Selecció d'aula -->
            <div class="mb-6">
                <label for="room_id" class="block text-sm font-medium text-gray-300 mb-2">Selecciona l'aula</label>
                <div class="relative">
                    <select id="room_id" v-model="reportData.room_id" required
                        class="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option value="" disabled>Selecciona una aula</option>
                        <option v-for="room in rooms" :key="room.id" :value="room.id">
                            {{ room.room_name }}
                        </option>
                    </select>
                    <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                        <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd"
                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                clip-rule="evenodd" />
                        </svg>
                    </div>
                </div>
                <p v-if="isLoading" class="mt-2 text-sm text-blue-400">Carregant aules...</p>
                <p v-else-if="loadError" class="mt-2 text-sm text-red-400">{{ loadError }}</p>
            </div>

            <!-- Pujar imatge -->
            <div class="mb-8">
                <label class="block text-sm font-medium text-gray-300 mb-2">Afegir imatge (opcional)</label>
                
                <!-- Preview de la imagen seleccionada -->
                <div v-if="imagePreview" class="mb-4 relative">
                    <img :src="imagePreview" alt="Preview" class="w-full h-48 object-cover rounded-lg border border-slate-600" />
                    <button type="button" @click="removeImage" 
                        class="absolute top-2 right-2 bg-red-600 p-1 rounded-full hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                        <svg class="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                
                <!-- Selector de archivo (se muestra solo si no hay imagen seleccionada) -->
                <div v-if="!imagePreview" class="flex items-center justify-center w-full">
                    <label for="upload-image"
                        class="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-600 rounded-lg cursor-pointer bg-slate-700/50 hover:bg-slate-700/70 transition-colors">
                        <div class="flex flex-col items-center justify-center pt-5 pb-6">
                            <svg class="w-8 h-8 mb-4 text-gray-400" fill="none" stroke="currentColor"
                                viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            <p class="mb-2 text-sm text-gray-400">
                                <span class="font-semibold">Fes clic per pujar</span> o arrossega una imatge
                            </p>
                            <p class="text-xs text-gray-400">PNG, JPG, JPEG, GIF o WEBP (màx 5MB)</p>
                            <p v-if="fileError" class="text-xs mt-2 text-red-400">{{ fileError }}</p>
                        </div>
                        <input id="upload-image" type="file" @change="handleFileUpload" class="hidden"
                            accept="image/png, image/jpeg, image/jpg, image/gif, image/webp" />
                    </label>
                </div>
            </div>

            <!-- Botó d'enviar -->
            <button type="submit" :disabled="isSubmitting || isLoading"
                class="w-full flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors duration-200">
                <svg v-if="isSubmitting" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                    </path>
                </svg>
                {{ isSubmitting ? 'Enviant...' : 'Enviar Incidència' }}
            </button>

            <!-- Missatges d'estat -->
            <div v-if="message" class="mt-6 p-4 rounded-lg" :class="{
                'bg-green-900/30 border border-green-800 text-green-400': message.type === 'success',
                'bg-red-900/30 border border-red-800 text-red-400': message.type === 'error'
            }">
                <div class="flex items-center">
                    <svg v-if="message.type === 'success'" class="h-5 w-5 mr-2" fill="none" stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <svg v-else class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {{ message.text }}
                </div>
            </div>
        </form>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { createReport } from '@/services/communicationsScripts/incidentsManager';
import { useAppStore } from '@/stores/index.js';
import { getAllRooms } from '@/services/communicationsScripts/roomsManager';

const store = useAppStore();
const rooms = ref([]);
const isLoading = ref(true);
const loadError = ref('');

const reportData = ref({
    report: '',
    room_id: '',
    image: '',
});

const imageFile = ref(null);
const imagePreview = ref(null);
const isSubmitting = ref(false);
const message = ref(null);
const fileError = ref('');
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB en bytes

// Carregar les aules disponibles
onMounted(async () => {
    try {
        isLoading.value = true;
        const roomsData = await getAllRooms();
        rooms.value = roomsData;
        console.log('Aules carregades:', rooms.value);
    } catch (error) {
        console.error('Error carregant aules:', error);
        loadError.value = 'No s\'han pogut carregar les aules. Si us plau, torna-ho a provar més tard.';
    } finally {
        isLoading.value = false;
    }
});

const handleFileUpload = (event) => {
    const file = event.target.files[0];
    fileError.value = '';
    
    if (!file) {
        imageFile.value = null;
        imagePreview.value = null; // Limpiar preview
        return;
    }
    
    // Validar tipo de archivo
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
        fileError.value = 'Format d\'arxiu no vàlid. Només s\'accepten imatges (PNG, JPG, JPEG, GIF, WEBP).';
        event.target.value = null;
        imageFile.value = null;
        imagePreview.value = null; // Limpiar preview
        return;
    }
    
    // Validar tamaño
    if (file.size > MAX_FILE_SIZE) {
        fileError.value = 'La mida de l\'arxiu no pot superar els 5MB.';
        event.target.value = null;
        imageFile.value = null;
        imagePreview.value = null; // Limpiar preview
        return;
    }
    
    // Archivo válido
    imageFile.value = file;
    const reader = new FileReader();
    reader.onload = (e) => {
        imagePreview.value = e.target.result; // Mostrar preview
    };
    reader.readAsDataURL(file);
};

const removeImage = () => {
    imageFile.value = null;
    imagePreview.value = null;
    // Reset también el input file si necesario
    const fileInput = document.getElementById('upload-image');
    if (fileInput) fileInput.value = "";
};

const submitReport = async () => {
    isSubmitting.value = true;
    message.value = null;

    try {
        const formData = new FormData();
        const reportPayload = {
            user_id: store.user?.id || 1, // Utilitza l'ID d'usuari de l'store
            report: reportData.value.report,
            room_id: reportData.value.room_id
        };

        formData.append('data', JSON.stringify(reportPayload));

        if (imageFile.value) {
            formData.append('image', imageFile.value);
        }

        const response = await createReport(formData);
        console.log('Resposta del servidor:', response);

        message.value = {
            type: 'success',
            text: 'Incidència enviada correctament!'
        };

        // Reset form
        reportData.value = {
            report: '',
            room_id: '',
            image: '',
        };
        imageFile.value = null;
        imagePreview.value = null; // Limpiar preview
    } catch (error) {
        console.error('Error en enviar la incidència:', error);
        message.value = {
            type: 'error',
            text: `Error en enviar la incidència: ${error.message || 'Error desconegut'}`
        };
    } finally {
        isSubmitting.value = false;
    }
};
</script>