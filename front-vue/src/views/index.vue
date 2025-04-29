<template>
    <div class="min-h-screen flex items-center justify-center bg-slate-900/10">
        <!-- Diálogo de error mejorado -->
        <transition name="fade">
            <div v-if="message" class="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div class="fixed inset-0 bg-black/60 backdrop-blur-sm" @click="message = ''"></div>
                <transition name="pop">
                    <div
                        class="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 max-w-md w-full border border-slate-700/50 shadow-2xl">
                        <div class="absolute top-4 right-4">
                            <button @click="message = ''"
                                class="text-slate-400 hover:text-white transition-transform hover:scale-110">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                                    stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div class="flex items-center gap-3 mb-4">
                            <div class="p-2 rounded-full"
                                :class="messageType === 'error' ? 'bg-red-500/20' : 'bg-blue-500/20'">
                                <svg v-if="messageType === 'error'" xmlns="http://www.w3.org/2000/svg"
                                    class="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-400" fill="none"
                                    viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 class="text-xl font-bold text-white">
                                <span v-if="messageType === 'error'">Error</span>
                                <span v-else>Avis</span>
                            </h3>
                        </div>

                        <p class="ml-11 text-slate-300">{{ message }}</p>

                        <div class="mt-6 flex justify-end gap-3">
                            <button @click="message = ''"
                                class="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white transition-all hover:scale-[1.02] active:scale-95">
                                Tancar
                            </button>
                            <button v-if="messageType === 'error'" @click="retryAction"
                                class="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-white transition-all hover:scale-[1.02] active:scale-95">
                                Reintentar
                            </button>
                        </div>
                    </div>
                </transition>
            </div>
        </transition>

        <!-- Formulario de login -->
        <div
            class="w-full max-w-lg bg-slate-800/70 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden animate-fade-in border border-slate-700/50">
            <!-- Capçalera -->
            <div class="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-center">
                <h1 class="text-2xl font-bold text-white">Accés al Sistema</h1>
                <p class="text-blue-100/90 mt-2">Gestió educativa Conexus</p>
            </div>

            <!-- Contingut del formulari -->
            <div class="p-6 sm:p-8 space-y-6">
                <!-- Accés amb Google -->
                <div>
                    <h2 class="text-white text-center mb-4 font-medium">Accedeix amb el teu compte</h2>
                    <button @click="signInWithGoogle"
                        class="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-100 text-gray-800 font-medium py-3 px-4 rounded-lg transition-all duration-200 shadow hover:shadow-md active:scale-[0.98]">
                        <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M23.7663 12.2764C23.7663 11.4607 23.7001 10.6406 23.559 9.83807H12.2402V14.4591H18.722C18.453 15.9494 17.5888 17.2678 16.3233 18.1056V21.1039H20.1903C22.4611 19.0139 23.7663 15.9274 23.7663 12.2764Z"
                                fill="#4285F4" />
                            <path
                                d="M12.2401 24.0008C15.4766 24.0008 18.2059 22.9382 20.1945 21.1039L16.3276 18.1055C15.2517 18.8375 13.8627 19.252 12.2445 19.252C9.11388 19.252 6.45946 17.1399 5.50705 14.3003H1.5166V17.3912C3.55371 21.4434 7.7029 24.0008 12.2401 24.0008Z"
                                fill="#34A853" />
                            <path
                                d="M5.50277 14.3003C5.00011 12.8099 5.00011 11.1961 5.50277 9.70575V6.61481H1.51674C-0.185266 10.0056 -0.185266 14.0004 1.51674 17.3912L5.50277 14.3003Z"
                                fill="#FBBC04" />
                            <path
                                d="M12.2401 4.74966C13.9509 4.7232 15.6044 5.36697 16.8434 6.54867L20.2695 3.12262C18.1001 1.0855 15.2208 -0.034466 12.2401 0.000808666C7.7029 0.000808666 3.55371 2.55822 1.5166 6.61481L5.50264 9.70575C6.45064 6.86173 9.10947 4.74966 12.2401 4.74966Z"
                                fill="#EA4335" />
                        </svg>
                        <span>Continua amb Google</span>
                    </button>
                </div>

                <!-- Separador -->
                <div class="flex items-center">
                    <div class="flex-1 border-t border-slate-700"></div>
                    <span class="px-4 text-slate-500 text-sm">O</span>
                    <div class="flex-1 border-t border-slate-700"></div>
                </div>

                <!-- Accés amb correu i contrasenya -->
                <div class="space-y-4">
                    <div>
                        <label for="email" class="block text-sm font-medium text-slate-300 mb-1">Correu
                            electrònic</label>
                        <input type="email" id="email" v-model="userLogin.email" placeholder="el-teu@correu.cat"
                            required
                            class="w-full px-4 py-2.5 bg-slate-800/60 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/70 focus:border-transparent transition placeholder-slate-500">
                    </div>

                    <div>
                        <label for="password" class="block text-sm font-medium text-slate-300 mb-1">Contrasenya</label>
                        <input type="password" id="password" v-model="userLogin.password"
                            placeholder="La teva contrasenya" required
                            class="w-full px-4 py-2.5 bg-slate-800/60 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/70 focus:border-transparent transition placeholder-slate-500">
                    </div>

                    <div class="flex items-center">
                        <input id="remember-me" type="checkbox"
                            class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-700 rounded bg-slate-800/60">
                        <label for="remember-me" class="ml-2 block text-sm text-slate-300">
                            Recorda'm
                        </label>
                    </div>

                    <button @click="signInWithApp"
                        class="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 px-4 rounded-lg shadow transition-all hover:shadow-md hover:scale-[1.01] active:scale-[0.98]">
                        Inicia sessió
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { initializeApp } from "firebase/app";
import { useAppStore } from '@/stores/index.js';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { loginAPI, loginDB } from '@/services/communicationsScripts/mainManager.js';

const apikey = import.meta.env.VITE_FIREBASE_API_KEY;

// Firebase configuration
const firebaseConfig = {
    apiKey: apikey,
    authDomain: "tr2-dam-mentories.firebaseapp.com",
    projectId: "tr2-dam-mentories",
    storageBucket: "tr2-dam-mentories.firebaseapp.com",
    messagingSenderId: "338164475859",
    appId: "1:338164475859:web:e69d1ef2426b26d9e0f126",
    measurementId: "G-KTW22GCCFB",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// State and methods
const message = ref("");
const messageType = ref("");
const lastAction = ref(null);

const userLogin = reactive({
    email: "",
    password: "",
});

const userAPIs = reactive({
    email: "",
    name: "",
    password: "",
    profile: "",
});

const retryAction = () => {
    message.value = "";
    if (lastAction.value === 'google') {
        signInWithGoogle();
    } else if (lastAction.value === 'app') {
        signInWithApp();
    }
};

const signInWithGoogle = async () => {
    lastAction.value = 'google';
    const provider = new GoogleAuthProvider();
    try {
        const result = await signInWithPopup(auth, provider);

        userAPIs.password = result.user.uid;
        userAPIs.email = result.user.email;
        userAPIs.name = result.user.displayName;
        userAPIs.profile = result.user.photoURL;

        // validateAndLogin(userAPIs);
    } catch (error) {
        message.value = "Error en l'inici de sessió amb Google. Si us plau, torna a intentar-ho.";
        messageType.value = "error";
    }
};

const signInWithApp = async () => {
    lastAction.value = 'app';
    let profileURL = ref("");

    if (!userLogin.email || !userLogin.password) {
        message.value = "Si us plau, introdueix tant el correu electrònic com la contrasenya.";
        messageType.value = "error";
        return;
    }

    try {
        const response = await loginDB(userLogin);

        if (response.error) {
            console.log(response.error);
            message.value = response.error;
            messageType.value = "error";
            return;
        }

        console.log(response);
        let user = response.userLogin;
        let profile = user.profile;

        console.log('hola')
        if (profile.includes("/upload/", 0)) {
            profileURL.value = `${import.meta.env.VITE_BACKEND_URL}${user.profile}`;
        } else {
            profileURL.value = user.profile;
        }

        user.profile = profileURL.value;

        useAppStore().setAccessToken(response.accessToken);
        useAppStore().setUser(user);

        localStorage.setItem("user", JSON.stringify(user.email));
        localStorage.setItem("accessToken", response.accessToken);
    } catch (error) {
        message.value = "S'ha produït un error en connectar amb el servidor. Torna a intentar-ho més tard.";
        messageType.value = "error";
    }
};

const checkEmailType = (email) => {
    // Regular expression to check if email starts with 'a' followed by exactly two numbers
    const regex = /^a\d{2}/;

    if (regex.test(email)) {
        return 1;
    }
    return 0;
};
</script>

<style scoped>
.animate-fade-in {
    animation: fadeIn 0.6s ease-out forwards;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(12px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Animaciones para el diálogo */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.pop-enter-active,
.pop-leave-active {
    transition: all 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28);
}

.pop-enter-from,
.pop-leave-to {
    opacity: 0;
    transform: scale(0.9) translateY(10px);
}

/* Transicions suaus */
button,
input,
a {
    transition: all 0.2s ease;
}

/* Efecte hover per als botons */
button:hover {
    transform: translateY(-1px);
}

/* Estilo para el checkbox personalizado */
input[type="checkbox"] {
    appearance: none;
    -webkit-appearance: none;
    @apply border border-slate-700 rounded bg-slate-800/60 w-4 h-4 cursor-pointer;
}

input[type="checkbox"]:checked {
    background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M5.707 7.293a1 1 0 0 0-1.414 1.414l2 2a1 1 0 0 0 1.414 0l4-4a1 1 0 0 0-1.414-1.414L7 8.586 5.707 7.293z'/%3e%3c/svg%3e");
    @apply bg-blue-600 border-blue-600 bg-center bg-no-repeat bg-[length:80%];
}
</style>