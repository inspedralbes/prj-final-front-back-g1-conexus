<template>
    <div class="min-h-screen flex flex-col items-center justify-center bg-slate-900/10">
        <div
            class="w-full max-w-lg p-8 bg-slate-800/70 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-700/50">
            <div class="text-center mb-6">
                <div class="flex justify-center mb-4">
                    <div class="p-3 rounded-full bg-blue-500/20">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-blue-400" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                </div>

                <h1 class="text-2xl font-bold text-white mb-2">Pàgina no trobada</h1>
                <p class="text-slate-300 mb-6">La pàgina a la que intentes accedir no existeix.</p>

                <router-link to="/"
                    class="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition-all hover:scale-[1.02] active:scale-95">
                    Tornar a l'inici
                </router-link>
            </div>
        </div>
    </div>
</template>