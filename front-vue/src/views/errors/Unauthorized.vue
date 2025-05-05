<template>
    <div class="min-h-screen flex flex-col items-center justify-center bg-slate-900/10">
        <div
            class="w-full max-w-lg p-8 bg-slate-800/70 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-700/50">
            <div class="text-center mb-6">
                <div class="flex justify-center mb-4">
                    <div class="p-3 rounded-full bg-red-500/20">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-red-400" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                </div>

                <h1 class="text-2xl font-bold text-white mb-2">Accés no autoritzat</h1>
                <p class="text-slate-300 mb-6">No tens permisos per accedir a aquesta pàgina.</p>

                <button @click="goBack"
                    class="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition-all hover:scale-[1.02] active:scale-95">
                    Tornar
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const goBack = () => {
    router.go(-1); // Volver a la página anterior
};
</script>