<template>
    <div class="toggle-container" @click="toggleDarkMode">
        <div class="toggle-thumb" :class="{ 'dark-mode': isDarkMode }">
            <svg v-if="!isDarkMode" class="icon sun-icon" xmlns="http://www.w3.org/2000/svg" fill="none"
                viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 3v2m0 14v2m8.66-8.66h-2M5.34 12H3m15.66-6.34l-1.41-1.41M7.75 16.25l-1.41 1.41M16.25 7.75l1.41-1.41M7.75 7.75L6.34 6.34m12.02 12.02l-1.41-1.41" />
                <circle cx="12" cy="12" r="4" />
            </svg>
            <svg v-else class="icon moon-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z" />
            </svg>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

// Recupera la referencia global de isDarkMode
const isDarkMode = ref(document.documentElement.classList.contains('dark'));

// Función para alternar el modo oscuro y guardar la preferencia
const toggleDarkMode = () => {
    isDarkMode.value = !isDarkMode.value;
    document.documentElement.classList.toggle('dark', isDarkMode.value);
    localStorage.setItem('darkMode', isDarkMode.value ? 'enabled' : 'disabled');
}
</script>

<style scoped>
.toggle-container {
    width: 50px;
    height: 25px;
    background-color: #ddd;
    border-radius: 15px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    cursor: pointer;
    transition: background-color 0.3s;
    padding: 3px;
}

.toggle-thumb {
    width: 20px;
    height: 20px;
    background-color: #fff;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.3s, background-color 0.3s;
}

.toggle-container:hover {
    background-color: #ccc;
}

.dark-mode {
    transform: translateX(25px);
    background-color: #333;
    color: #fff;
}

.icon {
    width: 16px;
    height: 16px;
}

.sun-icon {
    color: #f39c12;
}

.moon-icon {
    color: #fff;
}
</style>