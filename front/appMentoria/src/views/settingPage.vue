<template>
  <div class="flex flex-col min-h-screen bg-backgroundLight dark:bg-backgroundDark">
    <div class="flex flex-col lg:flex-row">
      <NavBarWeb class="hidden lg:fixed lg:top-0 lg:left-0 lg:h-screen lg:w-60 lg:block bg-white shadow-md"></NavBarWeb>
      <div class="flex-grow lg:ml-60 p-6">
        <h1 class="border-b pb-4 text-3xl font-semibold text-gray-400">Configuración</h1>
        <div class="flex flex-col sm:flex-row sm:space-x-4 mt-6">
          <button @click="section = 'idioma'" 
                  class="mt-2 sm:mt-0 cursor-pointer border-b-2 px-4 py-2 font-semibold w-full sm:w-auto text-left sm:text-center">
            <h3 :class="section === 'idioma' ? selectedTextColor : ''">Idioma</h3>
          </button>
          <button @click="section = 'notificaciones'" 
                  class="mt-2 sm:mt-0 cursor-pointer border-b-2 px-4 py-2 font-semibold w-full sm:w-auto text-left sm:text-center">
            <h3 :class="section === 'notificaciones' ? selectedTextColor : ''">Notificaciones</h3>
          </button>
          <button @click="section = 'estilos'" 
                  class="mt-2 sm:mt-0 cursor-pointer border-b-2 px-4 py-2 font-semibold w-full sm:w-auto text-left sm:text-center">
            <h3 :class="section === 'estilos' ? selectedTextColor : ''">Estilos</h3>
          </button>
        </div>
        <div class="mt-6 bg-containersLight dark:bg-containersDark rounded-lg p-6 shadow-custom">
          <div v-if="section === 'idioma'">
            <h2 class="py-4 text-2xl font-semibold text-gray-700 dark:text-gray-400">Idioma</h2>
            <LanguageSetting class="w-full"></LanguageSetting>
          </div>
          <div v-if="section === 'notificaciones'">
            <h2 class="py-4 text-2xl font-semibold text-gray-700">Notificaciones</h2>
            <label class="flex items-center space-x-3">
              <input v-model="notifications" type="checkbox" class="form-checkbox h-5 w-5 text-blue-600">
              <span class="text-gray-700">Habilitar notificaciones</span>
            </label>
          </div>
          <div v-if="section === 'estilos'">
            <h2 class="py-4 text-2xl font-semibold text-gray-700">Estilos</h2>
            <ThemeSetting 
              class="w-full"
              :fontSize="fontSize"
              :color="selectedColor"
              :background="background"
              @update:fontSize="updateFontSize"
              @update:color="updateColor"
              @update:background="updateBackground"
            ></ThemeSetting>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import NavBarWeb from '@/components/navBar/NavBarWeb.vue';
import LanguageSetting from '@/components/setting/languageSetting.vue';
import ThemeSetting from '@/components/setting/themeSetting.vue';

const section = ref('idioma');
const notifications = ref(false);

const fontSize = ref(localStorage.getItem("fontSize") || 16);
const selectedColor = ref(localStorage.getItem("selectedColor") || "text-purple-500");
const background = ref(localStorage.getItem("selectedBackground") || "Oscuro");

const selectedTextColor = computed(() => selectedColor.value);

const updateFontSize = (newFontSize) => {
  fontSize.value = newFontSize;
};

const updateColor = (newColor) => {
  selectedColor.value = newColor.replace("bg-", "text-");
  localStorage.setItem("selectedColor", selectedColor.value);
};

const updateBackground = (newBackground) => {
  background.value = newBackground;
  localStorage.setItem("selectedBackground", background.value);
};
</script>