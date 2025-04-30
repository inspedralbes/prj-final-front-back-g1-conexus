<template>
    <div class="min-h-screen flex items-center justify-center ">
        <div
            class="w-full max-w-lg bg-slate-700/50 backdrop-blur-sm rounded-xl shadow-xl overflow-hidden animate-fade-in border border-slate-600/30">
            <!-- Capçalera -->
            <div class="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-center">
                <h1 class="text-2xl font-bold text-white">Accés al Sistema</h1>
                <p class="text-blue-100 mt-2">Gestió educativa Conexus</p>
            </div>

            <!-- Contingut del formulari -->
            <div class="p-6 sm:p-8 space-y-6">
                <!-- Accés amb Google -->
                <div>
                    <h2 class="text-white text-center mb-4 font-medium">Accedeix amb el teu compte</h2>
                    <button @click="signInWithGoogle"
                        class="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-100 text-gray-800 font-medium py-3 px-4 rounded-lg transition duration-200 shadow">
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
                    <div class="flex-1 border-t border-slate-600"></div>
                    <span class="px-4 text-slate-400 text-sm">O</span>
                    <div class="flex-1 border-t border-slate-600"></div>
                </div>

                <!-- Accés amb correu i contrasenya -->
                <div class="space-y-4">
                    <div>
                        <label for="email" class="block text-sm font-medium text-slate-300 mb-1">Correu
                            electrònic</label>
                        <input type="email" id="email" v-model="userLogin.email" placeholder="el-teu@correu.cat"
                            required
                            class="w-full px-4 py-2 bg-slate-800/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition">
                    </div>

                    <div>
                        <label for="password" class="block text-sm font-medium text-slate-300 mb-1">Contrasenya</label>
                        <input type="password" id="password" v-model="userLogin.password"
                            placeholder="La teva contrasenya" required
                            class="w-full px-4 py-2 bg-slate-800/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition">
                    </div>

                    <div class="flex items-center">
                        <input id="remember-me" type="checkbox"
                            class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-600 rounded bg-slate-800/50">
                        <label for="remember-me" class="ml-2 block text-sm text-slate-300">
                            Recorda'm
                        </label>
                    </div>

                    <button @click="signInWithApp"
                        class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg shadow transition duration-200">
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

const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
        const result = await signInWithPopup(auth, provider);

        userAPIs.password = result.user.uid;
        userAPIs.email = result.user.email;
        userAPIs.name = result.user.displayName;
        userAPIs.profile = result.user.photoURL;

        // validateAndLogin(userAPIs);
    } catch (error) {
        message.value = $t("LoginRegisterPage.error");
        messageType.value = "error";
    }
    console.log('Iniciant amb Google');
};

const signInWithApp = async () => {
    let succes = false;
    let profileURL = ref("");

    console.log('Iniciant amb App', userLogin.email, userLogin.password);

    try {
        const response = await loginDB(userLogin);

        if (response.error) {
            return;
        } else {
            succes = true;
        }

        let user = response.userLogin;
        let profile = user.profile;

        if (profile.includes("/upload/", 0)) {
            profileURL.value = `${import.meta.env.VITE_URL_BACK}${user.profile}`;
        } else {
            profileURL.value = user.profile;
        }

        user.profile = profileURL.value;

        useAppStore().setAccessToken(response.accessToken);
        useAppStore().setUser(user);

        localStorage.setItem("user", JSON.stringify(user.email));
        localStorage.setItem("accessToken", response.accessToken);
    } catch (error) {
        message.value = $t("LoginRegisterPage.errorFields");
        messageType.value = "error";
    } finally {
        if (succes) {
            router.push({ name: "main" });
        }
    }
    console.log('Login amb:', email.value, password.value);
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
</style>