<template>
  <div class="container">
    <div
      class="fixed bottom-0 left-1/2 transform -translate-x-1/2 inline-flex left-0 mx-auto justify-between bg-containersTheme w-full shadow-custom"
    >
      <button
        aria-current="page"
        @click="selectItem('home', () => $router.push('/'))"
        :class="{'text-white': selectedItem === 'home', 'text-textColorPrimary': selectedItem !== 'home'}"
        class="inline-flex flex-col items-center text-xs font-medium py-3 px-4 flex-grow group"
      >
        <svg
          class="w-7 h-7 group-hover:text-white"
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
        @click="selectItem('search')"
        :class="{'text-white': selectedItem === 'search', 'text-textColorPrimary': selectedItem !== 'search'}"
        class="inline-flex flex-col items-center text-xs font-medium py-3 px-4 flex-grow group"
        href="#"
      >
        <svg
          class="w-7 h-7 group-hover:text-white"
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
        class="relative inline-flex flex-col items-center text-xs font-medium text-textColorPrimary py-3 px-6 flex-grow"
      >
        <div
          class="absolute bottom-5 p-3 rounded-full border-4 border-textColorPrimary  bg-containersTheme"
        >
          <svg
            class="w-7 h-7 b"
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
        @click="selectItem('notifications', () => $router.push('/notifications'))"
        :class="{'text-white': selectedItem === 'notifications', 'text-textColorPrimary': selectedItem !== 'notifications'}"
        class="inline-flex flex-col items-center text-xs font-medium py-3 px-4 flex-grow group"
      >
        <svg
          class="w-7 h-7 group-hover:text-white"
          viewBox="0 0 24 24"
          aria-hidden="true"
          fill="currentColor"
        >
          <path
            d="M19.993 9.042C19.48 5.017 16.054 2 11.996 2s-7.49 3.021-7.999 7.051L2.866 18H7.1c.463 2.282 2.481 4 4.9 4s4.437-1.718 4.9-4h4.236l-1.143-8.958zM12 20c-1.306 0-2.417-.835-2.829-2h5.658c-.412 1.165-1.523 2-2.829 2zm-6.866-4l.847-6.698C6.364 6.272 8.941 4 11.996 4s5.627 2.268 6.013 5.295L18.864 16H5.134z"
          ></path>
        </svg>
      </button>
      <button @click="selectItem('chatList', () => $router.push('/chatList'))"
        :class="{'text-white': selectedItem === 'chatList', 'text-textColorPrimary': selectedItem !== 'chatList'}"
        class="inline-flex flex-col items-center text-xs font-medium py-3 px-4 flex-grow group"
      >
        <svg
          class="w-8 h-8 group-hover:text-white"
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
import { ref, watch } from "vue";
import { useRoute } from "vue-router";
import ButtonAddPost from "../buttonAddPost.vue";

const showButtonAddPost = ref(false);
var selectedItem = ref(null);
const route = useRoute();

function toggleButtonAddPost() {
  showButtonAddPost.value = !showButtonAddPost.value;
}

const selectItem = (item, action) => {
  selectedItem.value = item;
  if (action) action();
}

watch(route, (newRoute) => {
  switch (newRoute.path) {
    case '/':
      selectedItem.value = 'home';
      break;
    case '/search':
      selectedItem.value = 'search';
      break;
    case '/notifications':
      selectedItem.value = 'notifications';
      break;
    case '/chatList':
      selectedItem.value = 'chatList';
      break;
    default:
      selectedItem.value = null;
  }
}, { immediate: true });
</script>

<style scoped>
.container {
  z-index: 1000;
}
</style>