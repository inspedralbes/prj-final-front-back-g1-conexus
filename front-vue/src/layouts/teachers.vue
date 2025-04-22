<template>
    <div id="app" class="flex flex-col min-h-screen text-white">
        <!-- Hamburger Menu for Mobile -->
        <button @click="toggleSidebar"
            class="lg:hidden fixed top-4 left-4 z-50 p-2 bg-slate-900/80 rounded-lg shadow-lg">
            <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
        </button>

        <!-- Sidebar (Visible only on mobile) -->
        <aside
            :class="['w-64 bg-slate-900/80 backdrop-blur-sm fixed h-screen p-4 shadow-lg transform transition-transform duration-300 z-40 lg:hidden', isSidebarOpen ? 'translate-x-0' : '-translate-x-full']">
            <div class="text-center mb-8">
                <h2
                    class="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                    High Link
                </h2>
            </div>
            <nav class="space-y-2">
                <router-link to="/"
                    class="flex items-center p-2 text-gray-300 hover:bg-slate-800/50 rounded-lg transition-colors duration-300">
                    <span>Home</span>
                </router-link>
                <router-link to="/howToPlay"
                    class="flex items-center p-2 text-gray-300 hover:bg-slate-800/50 rounded-lg transition-colors duration-300">
                    <span>How To Play</span>
                </router-link>
                <router-link to="/aboutUs"
                    class="flex items-center p-2 text-gray-300 hover:bg-slate-800/50 rounded-lg transition-colors duration-300">
                    <span>About Us</span>
                </router-link>
                <router-link to="/contact"
                    class="flex items-center p-2 text-gray-300 hover:bg-slate-800/50 rounded-lg transition-colors duration-300">
                    <span>Contact</span>
                </router-link>
                <router-link to="/gallery"
                    class="flex items-center p-2 text-gray-300 hover:bg-slate-800/50 rounded-lg transition-colors duration-300">
                    <span>Gallery</span>
                </router-link>
                <router-link to="/stats"
                    class="flex items-center p-2 text-gray-300 hover:bg-slate-800/50 rounded-lg transition-colors duration-300">
                    <span>Stats</span>
                </router-link>
            </nav>
        </aside>

        <!-- Navbar (Visible only on desktop) -->
        <nav class="lg:block hidden bg-slate-800/80 backdrop-blur-sm py-4 fixed w-full z-30 shadow-lg">
            <div class="container mx-auto flex justify-between items-center px-4">
                <!-- Brand Name -->
                <router-link to="/"
                    class="text-white text-2xl font-bold hover:text-gray-300 transition-colors duration-300">
                    High Link
                </router-link>

                <!-- Navigation Links -->
                <div class="flex space-x-6">
                    <router-link to="/howToPlay" class="text-white hover:text-gray-300 transition-colors duration-300">
                        How To Play
                    </router-link>
                    <router-link to="/aboutUs" class="text-white hover:text-gray-300 transition-colors duration-300">
                        About Us
                    </router-link>
                    <router-link to="/contact" class="text-white hover:text-gray-300 transition-colors duration-300">
                        Contact
                    </router-link>
                    <router-link to="/gallery" class="text-white hover:text-gray-300 transition-colors duration-300">
                        Gallery
                    </router-link>
                    <router-link to="/stats" class="text-white hover:text-gray-300 transition-colors duration-300">
                        Stats
                    </router-link>
                </div>
            </div>
        </nav>

        <!-- Navbar (Visible only on mobile) -->
        <nav class="lg:hidden bg-slate-800/80 backdrop-blur-sm py-4 fixed w-full z-30 shadow-lg">
            <div class="container mx-auto flex justify-between items-center px-4">
                <!-- Hamburger Menu and Title -->
                <div class="flex items-center ml-12 p-2">
                    <h1 class="text-xl font-bold text-gray-300">
                        {{ currentPageTitle }}
                    </h1>
                </div>
            </div>
        </nav>

        <!-- Main Content -->
        <main class="flex-1 w-full flex items-center justify-center pt-16">
            <div class="container mx-auto max-w-4xl">
                <router-view></router-view>
            </div>
        </main>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const isSidebarOpen = ref(false);

const toggleSidebar = () => {
    isSidebarOpen.value = !isSidebarOpen.value;
};

// Get current page title based on the route
const currentPageTitle = computed(() => {
    switch (route.path) {
        case '/canteen':
            return 'Canteen';
        case '/chat':
            return 'Chat';
        case '/assistence':
            return 'Assistence';
        case '/grades':
            return 'Grades';
        case '/rooms':
            return 'Reservetion Rooms';
        default:
            return 'Conexus';
    }
});
</script>

<style scoped>
/* Fade-in animation */
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

/* Smooth transitions for sidebar links */
aside a {
    transition: background-color 0.3s ease, color 0.3s ease;
}
</style>