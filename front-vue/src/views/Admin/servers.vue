<template>
    <div class="animate-fade-in mt-9 mb-9">
        <!-- Capçalera -->
        <div class="mb-8 flex justify-between items-center">
            <div>
                <h1
                    class="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                    Gestió de Serveis
                </h1>
                <p class="text-gray-300 mt-1">Gestiona tots els serveis de la plataforma</p>
            </div>
            <div class="flex space-x-2">
                <button @click="refreshServices"
                    class="flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Actualitzar
                </button>
                <button @click="showAddModal = true"
                    class="flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Afegir Servei
                </button>
            </div>
        </div>

        <!-- Taula de Serveis -->
        <div class="bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden">
            <!-- Capçalera de la Taula -->
            <div class="grid grid-cols-12 gap-4 p-4 border-b border-slate-700 font-semibold text-gray-300">
                <div class="col-span-5">Nom del Servei</div>
                <div class="col-span-3">Estat</div>
                <div class="col-span-2">Ús de Recursos</div>
                <div class="col-span-2 text-right">Accions</div>
            </div>

            <!-- Loading indicator -->
            <div v-if="loading" class="p-8 text-center">
                <div class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                <p class="mt-2 text-gray-400">Carregant serveis...</p>
            </div>

            <!-- Error message -->
            <div v-else-if="error" class="p-8 text-center text-red-400">
                <svg class="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p>{{ error }}</p>
                <button @click="refreshServices"
                    class="mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
                    Reintentar
                </button>
            </div>

            <!-- Llista de Serveis -->
            <div v-else-if="Object.keys(services).length > 0" class="divide-y divide-slate-700">
                <div v-for="(service, name) in services" :key="name"
                    class="grid grid-cols-12 gap-4 p-4 hover:bg-slate-700/30 transition-colors">
                    <div class="col-span-5 flex items-center">
                        <div class="p-2 bg-blue-500/10 rounded-lg mr-3">
                            <svg class="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                            </svg>
                        </div>
                        <div>
                            <h3 class="font-medium">{{ service.displayName }}</h3>
                            <p class="text-sm text-gray-400">{{ service.tech }}</p>
                        </div>
                    </div>
                    <div class="col-span-3 flex items-center">
                        <span class="relative inline-flex items-center">
                            <button type="button" @click="toggleServiceStatus(name)"
                                class="inline-flex items-center rounded-full p-1"
                                :class="service.state === 'running' ? 'bg-green-500/20' : 'bg-red-500/20'">
                                <span class="h-4 w-8 rounded-full transition-colors duration-200 ease-in-out"
                                    :class="service.state === 'running' ? 'bg-green-500' : 'bg-red-500'"></span>
                            </button>
                            <span class="ml-2 text-sm font-medium"
                                :class="service.state === 'running' ? 'text-green-400' : 'text-red-400'">
                                {{ service.state === 'running' ? 'Actiu' : 'Inactiu' }}
                            </span>
                        </span>
                    </div>
                    <div class="col-span-2 flex items-center">
                        <div class="w-full bg-slate-700 rounded-full h-2">
                            <div class="h-2 rounded-full" :class="getUsageColorClass(service.usage)"
                                :style="{ width: `${service.usage}%` }"></div>
                        </div>
                        <span class="ml-2 text-sm text-gray-400">{{ service.usage }}%</span>
                    </div>
                    <div class="col-span-2 flex justify-end space-x-2">
                        <button @click="viewServiceDetails(name)" class="p-2 text-gray-400 hover:text-blue-400 transition-colors">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                        </button>
                        <button class="p-2 text-gray-400 hover:text-yellow-400 transition-colors">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            <div v-else class="p-8 text-center text-gray-400">
                <svg class="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                <p>No s'ha trobat cap servei</p>
            </div>

            <!-- Peu de la Taula -->
            <div v-if="Object.keys(services).length > 0"
                class="p-4 border-t border-slate-700 flex justify-between items-center">
                <div class="text-sm text-gray-400">
                    Mostrant {{ Object.keys(services).length }} serveis
                </div>
                <div class="flex space-x-2">
                    <button @click="startAllServices"
                        class="px-3 py-1 rounded-md bg-green-600 text-white hover:bg-green-700 transition-colors">
                        Iniciar tots
                    </button>
                    <button @click="stopAllServices"
                        class="px-3 py-1 rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors">
                        Aturar tots
                    </button>
                </div>
            </div>
        </div>

        <!-- Modal d'Afegir Servei (ocult per defecte) -->
        <div v-if="showAddModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div class="bg-slate-800 rounded-xl p-6 w-full max-w-md">
                <div class="flex justify-between items-center mb-4">
                    <h2 class="text-xl font-semibold">Afegir Nou Servei</h2>
                    <button @click="showAddModal = false" class="text-gray-400 hover:text-white">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <form class="space-y-4" @submit.prevent="addService">
                    <div>
                        <label class="block text-sm font-medium text-gray-300 mb-1">Nom del Servei</label>
                        <input type="text" v-model="newService.name" required
                            class="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-300 mb-1">Tipus de Servei</label>
                        <select v-model="newService.type"
                            class="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option>Base de Dades</option>
                            <option>Servidor Web</option>
                            <option>Servidor d'API</option>
                            <option>Servidor de Correu</option>
                            <option>Altres</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-300 mb-1">Script del Servei</label>
                        <input type="text" v-model="newService.script" required
                            class="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="exemple.js">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-300 mb-1">Puerto del Servei</label>
                        <input type="number" v-model="newService.port" min="1024" max="65535"
                            class="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="3100">
                        <p class="text-xs text-gray-400 mt-1">Opcional. Si no s'especifica, s'assignarà un port automàticament.</p>
                    </div>
                    <div class="flex items-center">
                        <input id="auto-start" type="checkbox" v-model="newService.autoStart"
                            class="w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 rounded focus:ring-blue-500">
                        <label for="auto-start" class="ml-2 text-sm text-gray-300">Iniciar servei automàticament</label>
                    </div>
                    <div class="flex justify-end space-x-3 pt-4">
                        <button type="button" @click="showAddModal = false"
                            class="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors">
                            Cancel·lar
                        </button>
                        <button type="submit" :disabled="addingService"
                            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
                            {{ addingService ? 'Afegint...' : 'Afegir Servei' }}
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <!-- Modal de Detalls del Servei (ocult per defecte) -->
        <div v-if="showDetailsModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div class="bg-slate-800 rounded-xl p-6 w-full max-w-lg">
                <div class="flex justify-between items-center mb-4">
                    <h2 class="text-xl font-semibold">Detalls del Servei</h2>
                    <button @click="showDetailsModal = false" class="text-gray-400 hover:text-white">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                
                <div v-if="selectedService" class="space-y-4">
                    <div class="flex items-center space-x-3">
                        <div class="p-3 bg-blue-500/10 rounded-lg">
                            <svg class="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                            </svg>
                        </div>
                        <div>
                            <h3 class="text-lg font-medium">{{ selectedService.displayName }}</h3>
                            <p class="text-sm text-gray-400">{{ selectedService.tech }}</p>
                        </div>
                    </div>
                    
                    <div class="grid grid-cols-2 gap-4">
                        <div class="bg-slate-700/50 p-4 rounded-lg">
                            <h4 class="text-sm font-medium text-gray-300 mb-2">Estat</h4>
                            <div class="flex items-center">
                                <span class="w-3 h-3 rounded-full mr-2"
                                    :class="selectedService.state === 'running' ? 'bg-green-500' : 'bg-red-500'"></span>
                                <span>{{ selectedService.state === 'running' ? 'Actiu' : 'Inactiu' }}</span>
                            </div>
                        </div>
                        
                        <div class="bg-slate-700/50 p-4 rounded-lg">
                            <h4 class="text-sm font-medium text-gray-300 mb-2">Port</h4>
                            <div class="text-xl font-semibold">
                                {{ selectedService.port || 'No especificat' }}
                            </div>
                        </div>
                        
                        <div class="bg-slate-700/50 p-4 rounded-lg">
                            <h4 class="text-sm font-medium text-gray-300 mb-2">Ús de CPU</h4>
                            <div class="flex items-center">
                                <div class="w-full bg-slate-600 rounded-full h-2 mr-2">
                                    <div class="h-2 rounded-full" :class="getUsageColorClass(selectedService.usage)"
                                        :style="{ width: `${selectedService.usage}%` }"></div>
                                </div>
                                <span>{{ selectedService.usage }}%</span>
                            </div>
                        </div>
                        
                        <div v-if="selectedService.stats" class="bg-slate-700/50 p-4 rounded-lg">
                            <h4 class="text-sm font-medium text-gray-300 mb-2">Memòria</h4>
                            <div class="text-xl font-semibold">{{ selectedService.stats.memory }} MB</div>
                        </div>
                        
                        <div v-if="selectedService.stats" class="bg-slate-700/50 p-4 rounded-lg col-span-2">
                            <h4 class="text-sm font-medium text-gray-300 mb-2">Temps d'execució</h4>
                            <div class="text-xl font-semibold">{{ formatTime(selectedService.stats.elapsed) }}</div>
                        </div>
                    </div>
                    
                    <div class="mt-6 flex justify-end">
                        <button @click="showDetailsModal = false"
                            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
                            Tancar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import {
    getAllServices,
    getServiceStatus,
    startService,
    stopService,
    startAllServices as startAll,
    stopAllServices as stopAll,
    createService // Importar la nueva función
} from '@/services/communicationsScripts/servicesManager';

const showAddModal = ref(false);
const showDetailsModal = ref(false);
const selectedService = ref(null);
const services = ref({});
const loading = ref(true);
const error = ref(null);
const addingService = ref(false);
const refreshInterval = ref(null);

const newService = ref({
    name: '',
    type: 'Servidor d\'API',
    script: '',
    port: null,
    autoStart: true
});

// Formatear tiempo para mostrar en una forma legible
const formatTime = (ms) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) {
        return `${days}d ${hours % 24}h`;
    }
    if (hours > 0) {
        return `${hours}h ${minutes % 60}m`;
    }
    if (minutes > 0) {
        return `${minutes}m ${seconds % 60}s`;
    }
    return `${seconds}s`;
};

// Función para obtener el color según el porcentaje de uso
const getUsageColorClass = (usage) => {
    if (usage === 0) return 'bg-red-400';
    if (usage < 30) return 'bg-green-400';
    if (usage < 70) return 'bg-blue-400';
    return 'bg-yellow-400';
};

// Función para cargar los servicios
const refreshServices = async () => {
    loading.value = true;
    error.value = null;

    try {
        const data = await getAllServices();
        services.value = data;
    } catch (err) {
        console.error('Error al cargar los servicios:', err);
        error.value = 'Error al cargar los servicios. Por favor, inténtalo de nuevo.';
    } finally {
        loading.value = false;
    }
};

// Función para cambiar el estado del servicio
const toggleServiceStatus = async (serviceName) => {
    const service = services.value[serviceName];
    if (!service) return;

    try {
        if (service.state === 'running') {
            await stopService(serviceName);
        } else {
            await startService(serviceName);
        }
        // Refrescar los servicios después de cambiar el estado
        await refreshServices();
    } catch (err) {
        console.error(`Error al cambiar el estado del servicio ${serviceName}:`, err);
        // Puedes mostrar un mensaje de error aquí si lo deseas
    }
};

// Iniciar todos los servicios
const startAllServices = async () => {
    try {
        await startAll();
        await refreshServices();
    } catch (err) {
        console.error('Error al iniciar todos los servicios:', err);
    }
};

// Detener todos los servicios
const stopAllServices = async () => {
    try {
        await stopAll();
        await refreshServices();
    } catch (err) {
        console.error('Error al detener todos los servicios:', err);
    }
};

// Añadir un nuevo servicio
const addService = async () => {
    addingService.value = true;
    error.value = null;
    
    try {
        // Preparar datos del servicio
        const serviceData = {
            name: newService.value.name.toLowerCase().replace(/\s+/g, '-'),
            script: newService.value.script.endsWith('.js') 
                ? newService.value.script 
                : `${newService.value.script}.js`,
            description: newService.value.name,
            tech: `${newService.value.type} (Node.js)`,
            port: newService.value.port ? parseInt(newService.value.port) : null,
            autoStart: newService.value.autoStart
        };
        
        // Crear el servicio
        const result = await createService(serviceData);
        
        if (result.success) {
            showAddModal.value = false;
            // Mostrar mensaje de éxito
            alert(`Servei ${newService.value.name} creat correctament`);
        } else {
            error.value = result.message;
        }
        
        // Refrescar la lista de servicios
        await refreshServices();
    } catch (err) {
        console.error('Error al añadir servicio:', err);
        error.value = `Error al añadir servicio: ${err.message || err}`;
    } finally {
        addingService.value = false;
        // Resetear el formulario
        newService.value = {
            name: '',
            type: 'Servidor d\'API',
            script: '',
            port: null,
            autoStart: true
        };
    }
};

// Modificar la función para ver detalles del servicio
const viewServiceDetails = async (serviceName) => {
    try {
        // Obtener datos actualizados del servicio específico
        const serviceData = await getServiceStatus(serviceName);
        selectedService.value = serviceData;
        showDetailsModal.value = true;
    } catch (err) {
        console.error(`Error al obtener detalles del servicio ${serviceName}:`, err);
    }
};

// Cargar los servicios al montar el componente
onMounted(() => {
    refreshServices();
    // Actualizar cada 5 segundos
    // refreshInterval.value = setInterval(refreshServices, 5000);
});

onUnmounted(() => {
    if (refreshInterval.value) {
        clearInterval(refreshInterval.value);
    }
});
</script>