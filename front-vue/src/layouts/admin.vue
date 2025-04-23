<template>
    <div id="admin-app" class="flex min-h-screen text-white bg-gradient-to-br from-slate-800 to-slate-900">
        <!-- Show login form if not logged in -->
        <div v-if="!isLoggedIn" class="flex items-center justify-center w-full p-4">
            <div class="bg-white/10 backdrop-blur-sm rounded-lg shadow-lg p-6 sm:p-8 max-w-md w-full animate-fade-in">
                <h2
                    class="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                    Admin Login
                </h2>
                <form @submit.prevent="login">
                    <!-- Email Field -->
                    <div class="mb-6">
                        <label for="email" class="block text-sm font-medium text-gray-300 mb-2">Email</label>
                        <input type="email" id="email" v-model="loginForm.email" placeholder="Enter your email"
                            class="w-full px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg border border-gray-300/20 text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required />
                    </div>

                    <!-- Password Field -->
                    <div class="mb-6">
                        <label for="password" class="block text-sm font-medium text-gray-300 mb-2">Password</label>
                        <input type="password" id="password" v-model="loginForm.password"
                            placeholder="Enter your password"
                            class="w-full px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg border border-gray-300/20 text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required />
                    </div>

                    <!-- Submit Button -->
                    <div class="text-center">
                        <button type="submit"
                            class="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-2 px-6 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105">
                            Login
                        </button>
                    </div>
                </form>
                <!-- Registration Link -->
                <div class="text-center mt-4">
                    <router-link to="/register" class="text-blue-400 hover:text-blue-300 text-sm">
                        Don't have an account? Register here.
                    </router-link>
                </div>
            </div>
        </div>

        <!-- Show admin content if logged in -->
        <div v-else class="flex w-full">
            <!-- Hamburger Menu for Mobile -->
            <button @click="toggleSidebar"
                class="lg:hidden fixed top-4 left-4 z-50 p-2 bg-slate-900/80 rounded-lg shadow-lg">
                <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
            </button>

            <!-- Sidebar -->
            <aside
                :class="['w-64 bg-slate-900/80 backdrop-blur-sm fixed h-screen p-4 shadow-lg transform transition-transform duration-300 z-40', isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0']">
                <div class="text-center mb-8">
                    <router-link to="/admin">
                        <h2
                            class="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                            Admin Panel
                        </h2>
                    </router-link>
                </div>
                <nav class="space-y-2">
                    <router-link to="/admin/config-game"
                        class="flex items-center p-2 text-gray-300 hover:bg-slate-800/50 rounded-lg transition-colors duration-300">
                        <span>Config Game</span>
                    </router-link>
                    <router-link to="/admin/config-users"
                        class="flex items-center p-2 text-gray-300 hover:bg-slate-800/50 rounded-lg transition-colors duration-300">
                        <span>Config Users</span>
                    </router-link>
                    <router-link to="/admin/feedback"
                        class="flex items-center p-2 text-gray-300 hover:bg-slate-800/50 rounded-lg transition-colors duration-300">
                        <span>Comments</span>
                    </router-link>
                </nav>
                <div class="flex flex-inline">
                    <div @click="logout"
                        class="text-gray-200 hover:text-red-400 font-bold p-2 transition-colors duration-300 flex flex-inline">
                        <span class="mr-2">Logout</span>
                        <svg class="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24"
                            height="24" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M18 18V6h-5v12h5Zm0 0h2M4 18h2.5m3.5-5.5V12M6 6l7-2v16l-7-2V6Z" />
                        </svg>
                    </div>
                </div>
            </aside>

            <!-- Main Content -->
            <div class="flex-1 lg:ml-64">
                <!-- Navbar -->
                <nav class="bg-slate-900/80 backdrop-blur-sm py-4 fixed w-full z-30 shadow-lg">
                    <div class="container mx-auto flex justify-between items-center px-4">
                        <!-- Hamburger Menu and Title -->
                        <div class="flex items-center">
                            <h1 class="ml-12 lg:ml-0 text-xl font-bold text-gray-300">
                                {{ currentPageTitle }}
                            </h1>
                        </div>
                    </div>
                </nav>

                <!-- Page Content -->
                <main class="pt-20 pb-16 px-4 sm:px-6">
                    <router-view></router-view>
                </main>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAppStore } from '@/stores/index.js';
import { loginAPI } from '@/services/communicationsScripts/mainManager.js';

const router = useRouter();
const route = useRoute();
const appStore = useAppStore();

// Reactive state for login status
const isLoggedIn = computed(() => !!appStore.getToken());

console.log('Logged in:', isLoggedIn.value);

// Reactive state for sidebar visibility on mobile
const isSidebarOpen = ref(false);

// Login form data
const loginForm = ref({
    email: '',
    password: '',
});

// Simulate login function
const login = async () => {
    try {
        const response = await loginAPI({
            email: loginForm.value.email,
            password: loginForm.value.password
        });

        if (response.error) {
            alert(response.error);
            return;
        }

        const { user, token } = response;

        // Check if the user is an admin
        if (!user.admin) {
            alert('You do not have permission to access the admin panel.');
            return;
        }

        // Save user and token to the store and localStorage
        appStore.setUser(user);
        appStore.setToken(token);
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

        console.log('Logged in successfully');
    } catch (error) {
        alert('Invalid email or password');
    }
};

// Logout function
const logout = () => {
    if (appStore.logout()) {
        console.log('Logged out');
        router.push('/'); // Redirect to the home page
    }
};

// Toggle sidebar on mobile
const toggleSidebar = () => {
    isSidebarOpen.value = !isSidebarOpen.value;
};

// Get current page title based on the route
const currentPageTitle = computed(() => {
    switch (route.path) {
        case '/admin/feedback':
            return 'Comments';
        case '/admin/config-game':
            return 'Game Configuration';
        case '/admin/config-users':
            return 'User Configuration';
        default:
            return 'Admin Panel';
    }
});

onMounted(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    if (token && user) {
        appStore.setToken(token);
        appStore.setUser(user);
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

/* Highlight active route in the sidebar */
.router-link-active {
    background-color: rgba(59, 130, 246, 0.5);
    /* Blue background for active link */
    color: white;
}
</style>