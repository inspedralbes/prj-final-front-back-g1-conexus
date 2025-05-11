<template>
    <div class="animate-fade-in">
        <!-- Capçalera -->
        <div class="mb-8 flex justify-between items-center">
            <div>
                <h1
                    class="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                    Gestió de Serveis
                </h1>
                <p class="text-gray-300 mt-1">Gestiona tots els serveis de la plataforma</p>
            </div>
            <button class="flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                Afegir Servei
            </button>
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

            <!-- Llista de Serveis -->
            <div class="divide-y divide-slate-700">
                <!-- Servei 1 -->
                <div class="grid grid-cols-12 gap-4 p-4 hover:bg-slate-700/30 transition-colors">
                    <div class="col-span-5 flex items-center">
                        <div class="p-2 bg-blue-500/10 rounded-lg mr-3">
                            <svg class="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                            </svg>
                        </div>
                        <div>
                            <h3 class="font-medium">Base de Dades</h3>
                            <p class="text-sm text-gray-400">MySQL 8.0</p>
                        </div>
                    </div>
                    <div class="col-span-3 flex items-center">
                        <span class="relative inline-flex items-center">
                            <button type="button" class="inline-flex items-center rounded-full p-1 bg-green-500/20">
                                <span
                                    class="h-4 w-8 rounded-full bg-green-500 transition-colors duration-200 ease-in-out"></span>
                            </button>
                            <span class="ml-2 text-sm font-medium text-green-400">Actiu</span>
                        </span>
                    </div>
                    <div class="col-span-2 flex items-center">
                        <div class="w-full bg-slate-700 rounded-full h-2">
                            <div class="bg-blue-400 h-2 rounded-full" style="width: 45%"></div>
                        </div>
                        <span class="ml-2 text-sm text-gray-400">45%</span>
                    </div>
                    <div class="col-span-2 flex justify-end space-x-2">
                        <button class="p-2 text-gray-400 hover:text-blue-400 transition-colors">
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

                <!-- Servei 2 -->
                <div class="grid grid-cols-12 gap-4 p-4 hover:bg-slate-700/30 transition-colors">
                    <div class="col-span-5 flex items-center">
                        <div class="p-2 bg-purple-500/10 rounded-lg mr-3">
                            <svg class="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                            </svg>
                        </div>
                        <div>
                            <h3 class="font-medium">Servidor d'API</h3>
                            <p class="text-sm text-gray-400">Node.js 18.x</p>
                        </div>
                    </div>
                    <div class="col-span-3 flex items-center">
                        <span class="relative inline-flex items-center">
                            <button type="button" class="inline-flex items-center rounded-full p-1 bg-green-500/20">
                                <span
                                    class="h-4 w-8 rounded-full bg-green-500 transition-colors duration-200 ease-in-out"></span>
                            </button>
                            <span class="ml-2 text-sm font-medium text-green-400">Actiu</span>
                        </span>
                    </div>
                    <div class="col-span-2 flex items-center">
                        <div class="w-full bg-slate-700 rounded-full h-2">
                            <div class="bg-purple-400 h-2 rounded-full" style="width: 68%"></div>
                        </div>
                        <span class="ml-2 text-sm text-gray-400">68%</span>
                    </div>
                    <div class="col-span-2 flex justify-end space-x-2">
                        <button class="p-2 text-gray-400 hover:text-blue-400 transition-colors">
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

                <!-- Servei 3 -->
                <div class="grid grid-cols-12 gap-4 p-4 hover:bg-slate-700/30 transition-colors">
                    <div class="col-span-5 flex items-center">
                        <div class="p-2 bg-red-500/10 rounded-lg mr-3">
                            <svg class="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                        </div>
                        <div>
                            <h3 class="font-medium">Servidor de Correu</h3>
                            <p class="text-sm text-gray-400">Postfix/Dovecot</p>
                        </div>
                    </div>
                    <div class="col-span-3 flex items-center">
                        <span class="relative inline-flex items-center">
                            <button type="button" class="inline-flex items-center rounded-full p-1 bg-red-500/20">
                                <span
                                    class="h-4 w-8 rounded-full bg-red-500 transition-colors duration-200 ease-in-out"></span>
                            </button>
                            <span class="ml-2 text-sm font-medium text-red-400">Inactiu</span>
                        </span>
                    </div>
                    <div class="col-span-2 flex items-center">
                        <div class="w-full bg-slate-700 rounded-full h-2">
                            <div class="bg-red-400 h-2 rounded-full" style="width: 0%"></div>
                        </div>
                        <span class="ml-2 text-sm text-gray-400">0%</span>
                    </div>
                    <div class="col-span-2 flex justify-end space-x-2">
                        <button class="p-2 text-gray-400 hover:text-blue-400 transition-colors">
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

                <!-- Servei 4 -->
                <div class="grid grid-cols-12 gap-4 p-4 hover:bg-slate-700/30 transition-colors">
                    <div class="col-span-5 flex items-center">
                        <div class="p-2 bg-green-500/10 rounded-lg mr-3">
                            <svg class="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                            </svg>
                        </div>
                        <div>
                            <h3 class="font-medium">Frontend Web</h3>
                            <p class="text-sm text-gray-400">Vue.js 3</p>
                        </div>
                    </div>
                    <div class="col-span-3 flex items-center">
                        <span class="relative inline-flex items-center">
                            <button type="button" class="inline-flex items-center rounded-full p-1 bg-green-500/20">
                                <span
                                    class="h-4 w-8 rounded-full bg-green-500 transition-colors duration-200 ease-in-out"></span>
                            </button>
                            <span class="ml-2 text-sm font-medium text-green-400">Actiu</span>
                        </span>
                    </div>
                    <div class="col-span-2 flex items-center">
                        <div class="w-full bg-slate-700 rounded-full h-2">
                            <div class="bg-green-400 h-2 rounded-full" style="width: 32%"></div>
                        </div>
                        <span class="ml-2 text-sm text-gray-400">32%</span>
                    </div>
                    <div class="col-span-2 flex justify-end space-x-2">
                        <button class="p-2 text-gray-400 hover:text-blue-400 transition-colors">
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

            <!-- Peu de la Taula -->
            <div class="p-4 border-t border-slate-700 flex justify-between items-center">
                <div class="text-sm text-gray-400">
                    Mostrant 4 de 12 serveis
                </div>
                <div class="flex space-x-2">
                    <button
                        class="px-3 py-1 rounded-md bg-slate-700 text-gray-300 hover:bg-slate-600 transition-colors">
                        Anterior
                    </button>
                    <button class="px-3 py-1 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors">
                        1
                    </button>
                    <button
                        class="px-3 py-1 rounded-md bg-slate-700 text-gray-300 hover:bg-slate-600 transition-colors">
                        2
                    </button>
                    <button
                        class="px-3 py-1 rounded-md bg-slate-700 text-gray-300 hover:bg-slate-600 transition-colors">
                        Següent
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
                <form class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-300 mb-1">Nom del Servei</label>
                        <input type="text"
                            class="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-300 mb-1">Tipus de Servei</label>
                        <select
                            class="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option>Base de Dades</option>
                            <option>Servidor Web</option>
                            <option>Servidor d'API</option>
                            <option>Servidor de Correu</option>
                            <option>Altres</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-300 mb-1">URL del Servei</label>
                        <input type="text"
                            class="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="http://">
                    </div>
                    <div class="flex items-center">
                        <input id="auto-start" type="checkbox"
                            class="w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 rounded focus:ring-blue-500">
                        <label for="auto-start" class="ml-2 text-sm text-gray-300">Iniciar servei automàticament</label>
                    </div>
                    <div class="flex justify-end space-x-3 pt-4">
                        <button type="button" @click="showAddModal = false"
                            class="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors">
                            Cancel·lar
                        </button>
                        <button type="submit"
                            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
                            Afegir Servei
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const showAddModal = ref(false);

// Funció per canviar l'estat del servei
const toggleServiceStatus = (serviceId) => {
    console.log(`Canviant estat del servei ${serviceId}`);
    // Aquí aniria la lògica per canviar l'estat del servei a la teva API
};
</script>