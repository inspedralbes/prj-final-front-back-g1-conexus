<template>
    <div class="flex flex-col min-h-screen">
      <div class="grid grid-cols-8 pt-3 pb-10 sm:grid-cols-10">
        <div class="col-span-2 hidden sm:block">
            <NavBarWeb class="hidden lg:fixed lg:top-0 lg:left-0 lg:h-screen lg:w-60 lg:block"></NavBarWeb>
          <div class="flex-grow mt-16 mb-60">
            <h1 class="border-b py-6 text-4xl font-semibold">Configuración</h1>
            <button @click="section = 'idioma'" class="mt-5 cursor-pointer border-l-2 px-2 py-2 font-semibold w-full text-left"
                    :class="section === 'idioma' ? 'border-l-blue-700 text-blue-700' : 'border-transparent'">
              Idioma
            </button>
            <button @click="section = 'notificaciones'" class="mt-5 cursor-pointer border-l-2 px-2 py-2 font-semibold w-full text-left"
                    :class="section === 'notificaciones' ? 'border-l-blue-700 text-blue-700' : 'border-transparent'">
              Notificaciones
            </button>
            <button @click="section = 'estilos'" class="mt-5 cursor-pointer border-l-2 px-2 py-2 font-semibold w-full text-left"
                    :class="section === 'estilos' ? 'border-l-blue-700 text-blue-700' : 'border-transparent'">
              Estilos
            </button>
          </div>
        </div>
        <div class="col-span-8 overflow-hidden rounded-xl sm:bg-gray-50 sm:px-8 sm:shadow">
          <div v-if="section === 'idioma'">
            <h2 class="py-4 text-2xl font-semibold">Idioma</h2>
            <!-- <select v-model="language" class="w-full rounded-md border py-2 px-2 bg-gray-50 outline-none">
              <option value="es">Español</option>
              <option value="en">Inglés</option>
            </select> -->
          </div>
          <div v-if="section === 'notificaciones'">
            <h2 class="py-4 text-2xl font-semibold">Notificaciones</h2>
            <label class="flex items-center space-x-3">
              <input v-model="notifications" type="checkbox" class="form-checkbox h-5 w-5 text-blue-600">
              <span>Habilitar notificaciones</span>
            </label>
          </div>
          <div v-if="section === 'estilos'">
            <h2 class="py-4 text-2xl font-semibold">Estilos</h2>
            <label class="flex items-center space-x-3">
              <input v-model="darkMode" type="checkbox" class="form-checkbox h-5 w-5 text-blue-600">
              <span>Modo oscuro</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
import NavBarWeb from '@/components/navBar/NavBarWeb.vue';


  </script>
  
  <style>
  * {
    font-family: 'Source Sans Pro', sans-serif;
  }
  </style>