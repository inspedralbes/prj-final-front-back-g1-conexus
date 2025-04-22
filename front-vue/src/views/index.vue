<template>
    <div class="min-h-screen flex items-center justify-center text-center md:pt-24 md:pb-12">
        <div class="animate-fade-in">
            <h1
                class="text-5xl sm:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                Welcome to Conexus
            </h1>
            <p class="text-lg sm:text-xl text-gray-300 mb-8">
                Get ready to play an amazing game!
            </p>
            <!-- @click="downloadGame" -->
            <a href="https://highlink.dam.inspedralbes.cat/back/game">
                <button
                    class="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105">
                    Download Now
                </button>
            </a>
        </div>
    </div>
</template>

<style scoped>
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
</style>