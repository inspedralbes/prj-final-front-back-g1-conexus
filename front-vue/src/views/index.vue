<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-900 p-4">
        <div class="w-full max-w-md bg-gray-800 rounded-xl shadow-xl overflow-hidden animate-fade-in">
            <!-- Header -->
            <div class="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-center">
                <!-- <img src="/logo-institucion-blanco.png" alt="Logo Institucional" class="h-16 mx-auto mb-4"> -->
                <h1 class="text-2xl font-bold text-white">Acceso Administrativo</h1>
                <p class="text-blue-100 mt-2">Sistema de gestión educativa</p>
            </div>

            <!-- Formulario -->
            <div class="p-8">
                <!-- Inputs -->
                <div class="space-y-5">
                    <div>
                        <label for="email" class="block text-sm font-medium text-gray-300 mb-1">Correo
                            Institucional</label>
                        <input type="email" id="email" v-model="email" placeholder="usuario@institucion.edu"
                            class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required>
                    </div>

                    <div>
                        <label for="password" class="block text-sm font-medium text-gray-300 mb-1">Contraseña</label>
                        <input type="password" id="password" v-model="password" placeholder="••••••••"
                            class="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required>
                    </div>

                    <div class="flex items-center justify-between">
                        <div class="flex items-center">
                            <input id="remember-me" type="checkbox"
                                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 rounded bg-gray-700">
                            <label for="remember-me" class="ml-2 block text-sm text-gray-300">Recordar sesión</label>
                        </div>
                        <a href="#" class="text-sm text-blue-400 hover:text-blue-300">¿Olvidó su contraseña?</a>
                    </div>
                </div>

                <!-- Botón de Login -->
                <button @click="handleLogin"
                    class="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200">
                    Iniciar Sesión
                </button>

                <!-- Separador -->
                <div class="relative my-6">
                    <div class="absolute inset-0 flex items-center">
                        <div class="w-full border-t border-gray-600"></div>
                    </div>
                    <div class="relative flex justify-center text-sm">
                        <span class="px-2 bg-gray-800 text-gray-400">O continuar con</span>
                    </div>
                </div>

                <!-- Botón Google -->
                <button @click="signInWithGoogle"
                    class="w-full flex items-center justify-center gap-3 bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 px-4 rounded-lg border border-gray-600 transition duration-200">
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
                    <span>Continuar con Google</span>
                </button>

                <!-- Footer -->
                <div class="mt-6 text-center text-sm text-gray-400">
                    ¿No tiene una cuenta? <a href="#" class="text-blue-400 hover:text-blue-300 font-medium">Solicitar
                        acceso</a>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

function handleLogin() {
    // Tu lógica de login normal
    console.log('Login con:', this.email, this.password);
}

function signInWithGoogle() {
    // Tu implementación de Google Auth
    console.log('Iniciando con Google');
}
</script>

<style scoped>
.animate-fade-in {
    animation: fadeIn 0.8s ease-out;
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

/* Efecto hover para inputs */
input:focus {
    transition: all 0.3s ease;
}

/* Transición para botones */
button {
    transition: all 0.2s ease;
}
</style>