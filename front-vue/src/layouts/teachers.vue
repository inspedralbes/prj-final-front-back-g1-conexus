<template>
    <div id="app" class="flex flex-col min-h-screen text-white">
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
                <router-link to="/canteen"
                    class="flex items-center p-2 text-gray-300 hover:bg-slate-800/50 rounded-lg transition-colors duration-300">
                    <span>Cantina</span>
                </router-link>
                <router-link to="/chats"
                    class="flex items-center p-2 text-gray-300 hover:bg-slate-800/50 rounded-lg transition-colors duration-300">
                    <span>Xats</span>
                </router-link>
                <router-link to="/incidents"
                    class="flex items-center p-2 text-gray-300 hover:bg-slate-800/50 rounded-lg transition-colors duration-300">
                    <span>Incidències</span>
                </router-link>
                <router-link to="/teacher/assistence"
                    class="flex items-center p-2 text-gray-300 hover:bg-slate-800/50 rounded-lg transition-colors duration-300">
                    <span>Assistència</span>
                </router-link>
                <router-link to="/teacher/grades"
                    class="flex items-center p-2 text-gray-300 hover:bg-slate-800/50 rounded-lg transition-colors duration-300">
                    <span>Notes</span>
                </router-link>
                <router-link to="/teacher/roomReservation"
                    class="flex items-center p-2 text-gray-300 hover:bg-slate-800/50 rounded-lg transition-colors duration-300">
                    <span>Reserva d'Aules</span>
                </router-link>
            </nav>
            <!-- Botó de Tancar Sessió -->
            <div v-if="isLoggedIn" class="mt-4 pt-4 border-t border-gray-700">
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
                <router-link to="/"
                    class="text-white text-2xl font-bold hover:text-gray-300 transition-colors duration-300">
                    Conexus
                </router-link>

                <!-- Enllaços de Navegació -->
                <div class="flex space-x-6 items-center">
                    <router-link to="/canteen" class="text-white hover:text-gray-300 transition-colors duration-300">
                        Cantina
                    </router-link>
                    <router-link to="/chats" class="text-white hover:text-gray-300 transition-colors duration-300">
                        Xats
                    </router-link>
                    <router-link to="/incidents" class="text-white hover:text-gray-300 transition-colors duration-300">
                        Incidències
                    </router-link>
                    <router-link to="/teacher/assistence"
                        class="text-white hover:text-gray-300 transition-colors duration-300">
                        Assistència
                    </router-link>
                    <router-link to="/teacher/grades"
                        class="text-white hover:text-gray-300 transition-colors duration-300">
                        Notes
                    </router-link>
                    <router-link to="/teacher/roomReservation"
                        class="text-white hover:text-gray-300 transition-colors duration-300">
                        Reserva d'Aules
                    </router-link>
                    <!-- Botó de Login/Logout a l'escriptori -->
                    <button v-if="isLoggedIn" @click="logout"
                        class="text-white hover:text-red-300 transition-colors duration-300">
                        Tancar Sessió
                    </button>
                    <router-link v-else to="/login"
                        class="text-white hover:text-blue-300 transition-colors duration-300">
                        Iniciar Sessió
                    </router-link>
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
                <!-- Botó de Login/Logout a mòbil -->
                <div>
                    <router-link v-if="!isLoggedIn" to="/login" class="text-blue-400 hover:text-blue-300 text-sm">
                        Iniciar Sessió
                    </router-link>
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
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
const route = useRoute();
const isSidebarOpen = ref(false);
const isLoggedIn = ref(false); // Canvia aquest valor segons l'estat d'autenticació

// Verifica l'estat de login al carregar el component
onMounted(() => {
    checkAuthStatus();
});

const checkAuthStatus = () => {
    // Aquí hauries de verificar si l'usuari està autenticat
    // Per exemple, mirant un token al localStorage
    const token = localStorage.getItem('token');
    isLoggedIn.value = !!token;

    // Si no està autenticat i no està a la pàgina d'inici, redirigeix
    if (!isLoggedIn.value && route.path !== '/') {
        // router.push('/');
    }
};

const toggleSidebar = () => {
    isSidebarOpen.value = !isSidebarOpen.value;
};

const logout = () => {
    // Aquí hauries de fer la lògica per tancar sessió
    localStorage.removeItem('token');
    isLoggedIn.value = false;
    //router.push('/');
};

// Obtenir el títol de la pàgina actual basat en la ruta
const currentPageTitle = computed(() => {
    switch (route.path) {
        case '/canteen':
            return 'Cantina';
        case '/chats':
            return 'Xats';
        case '/incidents':
            return 'Incidències';
        case '/teacher/assistence':
            return 'Assistència';
        case '/teacher/grades':
            return 'Notes';
        case '/teacher/roomReservation':
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

/* Estil per a la ruta activa */
.router-link-active {
    background-color: rgba(59, 130, 246, 0.3);
}
</style>