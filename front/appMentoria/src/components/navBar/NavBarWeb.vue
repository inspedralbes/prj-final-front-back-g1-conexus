<template>
  <div class="h-full">
    <div class="flex flex-1 bg-gray-50 h-full">
      <div class="hidden md:flex md:w-64 md:flex-col lg:w-80 lg:flex lg:flex-col lg:h-full">
        <div class="flex flex-col flex-grow pt-5 overflow-y-auto bg-containersLight">
          <div class="px-4 mt-8 py-5">
            <label for="" class="sr-only"> Search </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg class="w-5 h-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z">
                  </path>
                </svg>
              </div>

              <input type="search" name="" id=""
                class="block w-full py-2 pl-10 border border-gray-300 rounded-lg focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm"
                placeholder="Search here" />
            </div>
          </div>
          <div class="px-4 mt-6">
            <hr class="border-gray-300" />
          </div>
          <div class="flex flex-col flex-1 px-3 mt-6">
            <div class="space-y-4">
              <nav class="flex-1 space-y-2">
                <a @click="selectItem('principal', $router.push('/'))"
                  :class="{ 'bg-buttomLight text-white': selectItem === 'principal', 'text-gray-900 hover:text-white hover:bg-buttomLight': selectItem !== 'principal' }"
                  title=""
                  class="flex items-center px-4 py-2.5 text-sm font-medium text-white transition-all duration-200 bg-buttomLight rounded-lg group">
                  <svg class="flex-shrink-0 w-5 h-5 mr-4 text-white dark:text-white group-hover:text-white"
                    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                    stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round"
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Principal
                </a>

                <a href="#" @click="selectItem('ofertas', $router.push('/requests'))"
                  :class="{ 'bg-buttomLight text-white': selectItem === 'ofertas', 'text-gray-900 hover:text-white hover:bg-buttomLight': selectItem !== 'ofertas' }"
                  class="flex items-center px-4 py-2.5 text-sm font-medium transition-all duration-200 text-gray-900 hover:text-white rounded-lg hover:bg-buttomLight group">
                  <svg class="w-5 h-5 mr-4 text-gray-800 dark:text-white group-hover:text-white" aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M8 7H5a2 2 0 0 0-2 2v4m5-6h8M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m0 0h3a2 2 0 0 1 2 2v4m0 0v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-6m18 0s-4 2-9 2-9-2-9-2m9-2h.01" />
                  </svg>
                  Ofertas
                </a>

                <a href="#" @click="selectItem('perfiles', $router.push('/profiles'))"
                  :class="{ 'bg-buttomLight text-white': selectItem === 'perfiles', 'text-gray-900 hover:text-white hover:bg-buttomLight': selectItem !== 'perfiles' }"
                  class="flex items-center px-4 py-2.5 text-sm font-medium transition-all duration-200 text-gray-900 hover:text-white rounded-lg hover:bg-buttomLight group">
                  <svg class="flex-shrink-0 w-5 h-5 mr-4 dark:text-white group-hover:text-white" aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                    stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round"
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  Perfiles
                </a>

                <a href="#" @click="selectItem('notificacines', $router.push('/notifications'))"
                  :class="{ 'bg-buttomLight text-white': selectItem === 'notificaciones', 'text-gray-900 hover:text-white hover:bg-buttomLight': selectItem !== 'notificaciones' }"
                  class="flex items-center px-4 py-2.5 text-sm font-medium transition-all duration-200 text-gray-900 hover:text-white rounded-lg hover:bg-buttomLight group">
                  <svg class="w-5 h-5 mr-4 text-gray-800 dark:text-white group-hover:text-white" aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                    stroke-width="2">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M12 5.365V3m0 2.365a5.338 5.338 0 0 1 5.133 5.368v1.8c0 2.386 1.867 2.982 1.867 4.175 0 .593 0 1.292-.538 1.292H5.538C5 18 5 17.301 5 16.708c0-1.193 1.867-1.789 1.867-4.175v-1.8A5.338 5.338 0 0 1 12 5.365ZM8.733 18c.094.852.306 1.54.944 2.112a3.48 3.48 0 0 0 4.646 0c.638-.572 1.236-1.26 1.33-2.112h-6.92Z" />
                  </svg>

                  Notificaciones
                  <svg class="w-4 h-6 ml-auto text-gray-400 dark:text-white group-hover:text-white"
                    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                    stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </a>
              </nav>

              <hr class="border-gray-300" />

              <nav class="flex-1 space-y-2">
                <a href="#" @click="selectItem('chat', router.push('/chatList'))"
                  :class="{ 'bg-buttomLight text-white': selectItem === 'chat', 'text-gray-900 hover:text-white hover:bg-buttomLight': selectItem !== 'chat' }"
                  class="flex items-center px-4 py-2.5 text-sm font-medium transition-all duration-200 text-gray-900 hover:text-white rounded-lg hover:bg-buttomLight group">
                  <svg class="w-5 h-5  mr-4 text-gray-800 dark:text-white group-hover:text-white" aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M9 17h6l3 3v-3h2V9h-2M4 4h11v8H9l-3 3v-3H4V4Z" />
                  </svg>

                  Chat
                </a>

                <a href="#" @click="selectItem('gacha')"
                  :class="{ 'bg-buttomLight text-white': selectItem === 'gacha', 'text-gray-900 hover:text-white hover:bg-buttomLight': selectItem !== 'gacha' }"
                  class="flex items-center px-4 py-2.5 text-sm font-medium transition-all duration-200 text-gray-900 hover:text-white rounded-lg hover:bg-buttomLight group">
                  <svg class="w-5 h-5 mr-4 text-gray-800 dark:text-white group-hover:text-white" aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M18.5 12A2.5 2.5 0 0 1 21 9.5V7a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v2.5a2.5 2.5 0 0 1 0 5V17a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1v-2.5a2.5 2.5 0 0 1-2.5-2.5Z" />
                  </svg>
                  Gacha
                </a>

                <a href="#" @click="selectItem('Game')"
                  :class="{ 'bg-buttomLight text-white': selectItem === 'game', 'text-gray-900 hover:text-white hover:bg-buttomLight': selectItem !== 'game' }"
                  class="flex items-center px-4 py-2.5 text-sm font-medium transition-all duration-200 text-gray-900 hover:text-white rounded-lg hover:bg-buttomLight group">
                  <svg class="w-5 h-5 mr-6 text-gray-800 dark:text-white group-hover:text-white" aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="m10.051 8.102-3.778.322-1.994 1.994a.94.94 0 0 0 .533 1.6l2.698.316m8.39 1.617-.322 3.78-1.994 1.994a.94.94 0 0 1-1.595-.533l-.4-2.652m8.166-11.174a1.366 1.366 0 0 0-1.12-1.12c-1.616-.279-4.906-.623-6.38.853-1.671 1.672-5.211 8.015-6.31 10.023a.932.932 0 0 0 .162 1.111l.828.835.833.832a.932.932 0 0 0 1.111.163c2.008-1.102 8.35-4.642 10.021-6.312 1.475-1.478 1.133-4.77.855-6.385Zm-2.961 3.722a1.88 1.88 0 1 1-3.76 0 1.88 1.88 0 0 1 3.76 0Z" />
                  </svg>

                  Game
                  <svg class="w-4 h-6 ml-auto text-gray-400 dark:text-white group-hover:text-white"
                    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                    stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </a>
              </nav>

              <hr class="border-gray-300" />
              <div class="absolute bottom-0 left-0 w-full pb-4">
                <div>
                  <button @click="handleClick"
                    class="flex items-center px-4 text-sm font-medium transition-all duration-200 text-gray-900 hover:text-white rounded-lg group">
                    <svg class="w-5 h-5 mr-6 text-gray-800 dark:text-white" aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" stroke-width="2">
                      <path fill-rule="evenodd"
                        d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4.243a1 1 0 1 0-2 0V11H7.757a1 1 0 1 0 0 2H11v3.243a1 1 0 1 0 2 0V13h3.243a1 1 0 1 0 0-2H13V7.757Z"
                        clip-rule="evenodd" />
                    </svg>
                  </button>
                </div>
                <div class="pb-4 mt-20">
                  <button type="button"
                    class="flex items-center justify-between w-full px-4 py-3 text-sm font-medium text-gray-900 transition-all duration-200 rounded-lg hover:bg-gray-100">
                    <img class="flex-shrink-0 object-cover w-9 h-9 mr-3 rounded-full" :src="`${profile}`"
                      alt="User Photo" />
                    {{ name }}
                    <svg class="w-5 h-5 ml-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                      stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';
import SubMenu from '../SubMenu.vue';
import { useAppStore } from '@/stores/index';
import { useRouter } from 'vue-router';

const appStore = useAppStore();
const router = useRouter();

var user = reactive({});
var profile = ref(null);
var name = ref(null);
var selectedItem = ref(null);

onMounted(() => {
  user.value = appStore.getUser();
  profile.value = user.value.profile;
  name.value = user.value.name;
});

const selectItem = (item) => {
  selectedItem.value = item;
}

const handleClick = () => {
  if (router.currentRoute.value.path === '/') {
    router.push('/addComunityPost');
  } else if (router.currentRoute.value.path === '/requests') {
    router.push('/addRequestPost');
  }
}
</script>

<style></style>