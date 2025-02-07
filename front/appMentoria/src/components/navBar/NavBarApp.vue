<template>
  <div>
    <div
      class="fixed bottom-0 left-1/2 transform -translate-x-1/2 inline-flex left-0 mx-auto justify-between bg-containersLight dark:bg-containersDark w-full shadow-custom"
    >
      <button
        aria-current="page"
        @click="selectItem('home', $router.push('/'))"
        :class="{'dark:text-white text-white': selectedItem === 'home', 'dark:text-orange-300 text-orange-300': selectedItem !== 'home'}"
        class="inline-flex flex-col items-center text-xs font-medium py-3 px-4 flex-grow group dark:text-orange-300  text-orange-300"     
      >
        <svg
          class="w-7 h-7 text-white dark:text-white group-hover:text-white dark:group-hover:text-white"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"
          ></path>
        </svg>
        <span class="sr-only">{{ $t("navBar.home") }}</span>
      </button>
      <a
        :class="{'dark:text-white text-white': selectItem === 'search', 'dark:text-orange-300 text-orange-300': selectItem !== 'search'}"
        class="inline-flex flex-col items-center text-xs font-medium text-orange-300 dark:text-white py-3 px-4 flex-grow"
        href="#"
      >
        <svg
          class="w-7 h-7"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
            clip-rule="evenodd"
          ></path>
        </svg>
        <span class="sr-only">{{$t("navBar.search")}}</span>
      </a>

      <button
        @click="toggleButtonAddPost"
        class="relative inline-flex flex-col items-center text-xs font-medium text-white py-3 px-6 flex-grow"
      >
        <div
          class="absolute bottom-5 p-3 rounded-full border-4 border-white bg-containersLight dark:bg-containersDark"
        >
          <svg
            class="w-7 h-7"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
              clip-rule="evenodd"
            ></path>
          </svg>
        </div>
        <span class="sr-only">{{$t("navBar.upload")}}</span>
        <button-add-post v-if="showButtonAddPost"></button-add-post>
      </button>
      <button
        :class="{'dark:text-white text-white': selectItem === 'notifications', 'dark:text-orange-300 text-orange-300': selectItem !== 'notifications'}"
        class="inline-flex flex-col items-center text-xs font-medium py-3 px-4 flex-grow group-hover:text-white dark:group-hover:text-white"
        @click="$router.push('/notifications')"
      >
        <svg
          class="w-7 h-7"
          viewBox="0 0 24 24"
          aria-hidden="true"
          fill="currentColor"
        >
          <path
            d="M19.993 9.042C19.48 5.017 16.054 2 11.996 2s-7.49 3.021-7.999 7.051L2.866 18H7.1c.463 2.282 2.481 4 4.9 4s4.437-1.718 4.9-4h4.236l-1.143-8.958zM12 20c-1.306 0-2.417-.835-2.829-2h5.658c-.412 1.165-1.523 2-2.829 2zm-6.866-4l.847-6.698C6.364 6.272 8.941 4 11.996 4s5.627 2.268 6.013 5.295L18.864 16H5.134z"
          ></path>
        </svg>
      </button>
      <button @click="$router.push('/chatList')"
        :class="{'dark:text-white text-white': selectItem === 'chatList', 'dark:text-orange-300 text-orange-300': selectItem !== 'chatList'}"
        class="inline-flex flex-col items-center text-xs font-medium py-3 px-4 flex-grow group-hover:text-white dark:group-hover:text-white"
      >
        <svg
          class="w-8 h-8"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
            clip-rule="evenodd"
          ></path>
        </svg>
        <span class="sr-only">{{$t("navBar.chat")}}</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import ButtonAddPost from "../buttonAddPost.vue";

const showButtonAddPost = ref(false);
var selectedItem = ref(null);

function toggleButtonAddPost() {
  showButtonAddPost.value = !showButtonAddPost.value;
}


const selectItem = (item) => {
  selectedItem.value = item;
}
</script>