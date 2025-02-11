<template>
  <div class="flex flex-col min-h-screen bg-backgroundLight dark:bg-backgroundDark">
    <div class="flex flex-col lg:flex-row">
      <NavBarWeb class="hidden lg:fixed lg:top-0 lg:left-0 lg:h-screen lg:w-60 lg:block bg-white shadow-md"></NavBarWeb>
      <div class="flex-grow lg:ml-60 p-6">
        <h1 class="border-b pb-4 text-3xl font-semibold text-gray-400">Configuración</h1>
        <div class="flex flex-col sm:flex-row sm:space-x-4 mt-6">
          <button @click="section = 'idioma'" 
                  class="mt-2 sm:mt-0 cursor-pointer border-b-2 px-4 py-2 font-semibold w-full sm:w-auto text-left sm:text-center"
                  :class="section === 'idioma' ? 'border-blue-600 text-blue-600' : 'border-transparent'">
            Idioma
          </button>
          <button @click="section = 'notificaciones'" 
                  class="mt-2 sm:mt-0 cursor-pointer border-b-2 px-4 py-2 font-semibold w-full sm:w-auto text-left sm:text-center"
                  :class="section === 'notificaciones' ? 'border-blue-600 text-blue-600' : 'border-transparent'">
            Notificaciones
          </button>
          <button @click="section = 'estilos'" 
                  class="mt-2 sm:mt-0 cursor-pointer border-b-2 px-4 py-2 font-semibold w-full sm:w-auto text-left sm:text-center"
                  :class="section === 'estilos' ? 'border-blue-600 text-blue-600' : 'border-transparent'">
            Estilos
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
            <label class="flex items-center space-x-3">
              <input v-model="darkMode" type="checkbox" class="form-checkbox h-5 w-5 text-blue-600">
              <span class="text-gray-700">Modo oscuro</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import NavBarWeb from '@/components/navBar/NavBarWeb.vue';
import LanguageSetting from '@/components/setting/languageSetting.vue';

const section = ref('idioma');
const notifications = ref(false);
const darkMode = ref(false);
</script>

<style>
* {
  font-family: 'Source Sans Pro', sans-serif;
}
</style>