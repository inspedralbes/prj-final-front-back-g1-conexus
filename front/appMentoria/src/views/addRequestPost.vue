<template>
  <div class="flex flex-col min-h-screen">
    <button @click="goBack" class="py-2 px-4 fixed top-0 left-0 mt-3 ml-4 z-20">
      <svg
        width="20"
        height="20"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
        <g
          id="SVGRepo_tracerCarrier"
          stroke-linecap="round"
          stroke-linejoin="round"
        ></g>
        <g id="SVGRepo_iconCarrier">
          <path
            d="M5 1H4L0 5L4 9H5V6H11C12.6569 6 14 7.34315 14 9C14 10.6569 12.6569 12 11 12H4V14H11C13.7614 14 16 11.7614 16 9C16 6.23858 13.7614 4 11 4H5V1Z"
            fill="#ffffff"
          ></path>
        </g>
      </svg>
    </button>
    <Header class="fixed top-0 left-0 right-0 z-10"></Header>
    <main class="flex-grow min-h-screen">
      <RequestPost></RequestPost>
    </main>
    <NavBar></NavBar>
  </div>
</template>

  <script setup>
import RequestPost from "@/components/RequestPost.vue";
import Header from "@/components/Header.vue";
import NavBar from "@/components/NavBar.vue";
import { useRouter } from "vue-router";

const router = useRouter();

function goBack() {
  router.back();
}
</script>