<template>
    <div id="teacher-app" class="flex flex-col min-h-screen text-white">
        <!-- Botó Hamburguesa per a Mòbil -->
        <button @click="toggleSidebar"
            class="lg:hidden fixed top-4 left-4 z-50 p-2 bg-slate-900/80 rounded-lg shadow-lg">
            <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
        </button>

        <!-- Barra Lateral (Visible només a mòbil) -->
        <aside
            :class="['w-64 bg-slate-900/80 backdrop-blur-sm fixed h-screen p-4 shadow-lg transform transition-transform duration-300 z-40 lg:hidden', isSidebarOpen ? 'translate-x-0' : '-translate-x-full']">
            <div class="text-center mb-8">
                <h2
                    class="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                    Conexus
                </h2>
            </div>
            <nav class="space-y-2">
                <router-link to="/teachers/canteen"
                    class="flex items-center p-2 text-gray-300 hover:bg-slate-800/50 rounded-lg transition-colors duration-300">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Cantina</span>
                </router-link>
                <router-link to="/teachers/chats"
                    class="flex items-center p-2 text-gray-300 hover:bg-slate-800/50 rounded-lg transition-colors duration-300">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <span>Xats</span>
                </router-link>
                <router-link to="/teachers/incidents"
                    class="flex items-center p-2 text-gray-300 hover:bg-slate-800/50 rounded-lg transition-colors duration-300">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span>Incidències</span>
                </router-link>
                <router-link to="/teachers/assistence"
                    class="flex items-center p-2 text-gray-300 hover:bg-slate-800/50 rounded-lg transition-colors duration-300">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <span>Assistència</span>
                </router-link>
                <router-link to="/teachers/lost-objects"
                    class="flex items-center p-2 text-gray-300 hover:bg-slate-800/50 rounded-lg transition-colors duration-300">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                    </svg>
                    <span>Objectes Perduts</span>
                </router-link>
                <router-link to="/teachers/grades"
                    class="flex items-center p-2 text-gray-300 hover:bg-slate-800/50 rounded-lg transition-colors duration-300">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>Notes</span>
                </router-link>
                <router-link to="/teachers/roomReservation"
                    class="flex items-center p-2 text-gray-300 hover:bg-slate-800/50 rounded-lg transition-colors duration-300">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <span>Reserva d'Aules</span>
                </router-link>
                <router-link to="/teachers/departments"
                    class="flex items-center p-2 text-gray-300 hover:bg-slate-800/50 rounded-lg transition-colors duration-300">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v4a1 1 0 001 1h3v2a1 1 0 001 1h4a1 1 0 001-1v-2h3a1 1 0 001-1V7a1 1 0 00-1-1H4a1 1 0 00-1 1zm0 10a1 1 0 001 1h16a1 1 0 001-1v-2a1 1 0 00-1-1H4a1 1 0 00-1 1v2z" />
                    </svg>
                    <span>Departaments</span>
                </router-link>
                <router-link to="/teachers/inscription" class="flex items-center p-2 text-gray-300 hover:bg-slate-800/50 rounded-lg transition-colors duration-300">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Inscripció
                </router-link>
            </nav>
            <!-- Botó de Tancar Sessió -->
            <div class="mt-4 pt-4 border-t border-gray-700">
                <button @click="logout"
                    class="w-full flex items-center justify-center p-2 text-gray-300 hover:text-red-400 rounded-lg transition-colors duration-300">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Tancar Sessió
                </button>
            </div>
        </aside>

        <!-- Barra de Navegació (Visible només a escriptori) -->
        <nav class="lg:block hidden bg-slate-800/80 backdrop-blur-sm py-4 fixed w-full z-30 shadow-lg">
            <div class="container mx-auto flex justify-between items-center px-4">
                <!-- Nom de la Marca -->
                <router-link to="/teachers"
                    class="text-white text-2xl font-bold hover:text-gray-300 transition-colors duration-300">
                    Conexus
                </router-link>

                <!-- Enllaços de Navegació -->
                <div class="flex space-x-6 items-center">
                    <router-link to="/teachers/canteen" class="flex items-center text-white hover:text-gray-300 transition-colors duration-300">
                        <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Cantina
                    </router-link>
                    <router-link to="/teachers/chats" class="flex items-center text-white hover:text-gray-300 transition-colors duration-300">
                        <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        Xats
                    </router-link>
                    <router-link to="/teachers/incidents" class="flex items-center text-white hover:text-gray-300 transition-colors duration-300">
                        <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        Incidències
                    </router-link>
                    <router-link to="/teachers/lost-objects" class="flex items-center text-white hover:text-gray-300 transition-colors duration-300">
                        <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                        </svg>
                        Objectes Perduts
                    </router-link>
                    <router-link to="/teachers/assistence" class="flex items-center text-white hover:text-gray-300 transition-colors duration-300">
                        <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        Assistència
                    </router-link>
                    <router-link to="/teachers/grades" class="flex items-center text-white hover:text-gray-300 transition-colors duration-300">
                        <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Notes
                    </router-link>
                    <router-link to="/teachers/roomReservation" class="flex items-center text-white hover:text-gray-300 transition-colors duration-300">
                        <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        Reserva d'Aules
                    </router-link>
                    <router-link to="/teachers/departments" class="flex items-center text-white hover:text-gray-300 transition-colors duration-300">
                        <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v4a1 1 0 001 1h3v2a1 1 0 001 1h4a1 1 0 001-1v-2h3a1 1 0 001-1V7a1 1 0 00-1-1H4a1 1 0 00-1 1zm0 10a1 1 0 001 1h16a1 1 0 001-1v-2a1 1 0 00-1-1H4a1 1 0 00-1 1v2z" />
                        </svg>
                        Departaments
                    </router-link>
                    <router-link to="/teachers/inscription" class="flex items-center text-white hover:text-gray-300 transition-colors duration-300">
                        <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Inscripció
                    </router-link>
                    <button @click="logout"
                        class="flex items-center text-white hover:text-red-300 transition-colors duration-300">
                        <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Tancar Sessió
                    </button>
                </div>
            </div>
        </nav>

        <!-- Barra de Navegació (Visible només a mòbil) -->
        <nav class="lg:hidden bg-slate-800/80 backdrop-blur-sm py-4 fixed w-full z-30 shadow-lg">
            <div class="container mx-auto flex justify-between items-center px-4">
                <!-- Menú Hamburguesa i Títol -->
                <div class="flex items-center ml-12 p-2">
                    <h1 class="text-xl font-bold text-gray-300">
                        {{ currentPageTitle }}
                    </h1>
                </div>
            </div>
        </nav>

        <!-- Contingut Principal -->
        <main class="flex-1 w-full flex items-center justify-center pt-16">
            <div class="container mx-auto max-w-4xl">
                <router-view></router-view>
            </div>
        </main>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAppStore } from '@/stores/index.js';

const store = useAppStore();
const router = useRouter();
const route = useRoute();
const isSidebarOpen = ref(false);

const toggleSidebar = () => {
    isSidebarOpen.value = !isSidebarOpen.value;
};

const logout = () => {
    store.setAccessToken('');
    store.setUser({});
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    router.push('/');
};

// Obtenir el títol de la pàgina actual basat en la ruta
const currentPageTitle = computed(() => {
    switch (route.path) {
        case '/teachers/canteen':
            return 'Cantina';
        case '/teachers/chats':
            return 'Xats';
        case '/teachers/incidents':
            return 'Incidències';
        case '/teachers/lost-objects':
            return 'Objectes Perduts';
        case '/teachers/assistence':
            return 'Assistència';
        case '/teachers/grades':
            return 'Notes';
        case '/teachers/roomReservation':
            return 'Reserva d\'Aules';
        default:
            return 'Conexus';
    }
});
</script>

<style scoped>
/* Animació d'aparició */
.animate-fade-in {
    animation: fadeIn 1.5s ease-in-out;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Transicions suaus per als enllaços de la barra lateral */
aside a {
    transition: background-color 0.3s ease, color 0.3s ease;
}
</style>