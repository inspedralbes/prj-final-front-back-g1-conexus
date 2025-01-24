<template>
  <Header class="fixed top-0 left-0 right-0"></Header>

  <div v-if="user.value" class="bg-gray-100 dark:bg-gray-900 min-h-screen">
    <section class="relative pt-40 pb-24 flex flex-col justify-between">
      <img :src="`${banner}`" alt="cover-image"
        class="w-full absolute top-0 left-0 h-60 object-cover shadow-lg shadow-black/30" />

      <div class="absolute right-4 md:right-5 top-60 transform -translate-y-8 md:-translate-y-8">
        <button @click="$router.push('/editProfile')"
          class="py-5 px-5 rounded-full bg-indigo-600 text-white font-semibold text-base leading-7 shadow-lg shadow-black/30 transition-all duration-500 hover:shadow-gray-100 hover:bg-indigo-700">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
            stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
          </svg>
        </button>
      </div>  

      <div class="w-full max-w-7xl mx-auto px-6 md:px-8 flex-grow relative">
        <!-- Profile image -->
        <div class="flex items-center justify-center sm:justify-start relative mb-5">
          <img :src="`${profile}`" alt="user-avatar-image"
            class="border-4 border-solid border-white rounded-full object-cover w-40 h-40 bg-white shadow-lg" />
        </div>

        <!-- User Info -->
        <div class="flex flex-col sm:flex-row items-center justify-between mb-5">
          <div class="block text-center sm:text-left">
            <h3 class="font-manrope font-bold text-2xl text-gray-900 mb-1 dark:text-white">
              {{ user.value.name }}
            </h3>
            <p class="font-normal text-base leading-7 text-gray-500 dark:text-gray-300">
              {{ user.value.city || `Lloc on vius...` }}
            </p>
          </div>
          <button
            class="rounded-full py-3.5 px-5 bg-gray-300 dark:bg-gray-800 flex items-center group transition-all duration-500 hover:bg-indigo-100 dark:hover:bg-indigo-700">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
              stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
            </svg>
            <span
              class="px-2 font-medium text-base leading-7 text-gray-700 transition-all duration-500 group-hover:text-indigo-600">
              {{ user.value.class_name || `Pendent d'asignar` }}
            </span>
          </button>
        </div>

        <!-- Tags -->
        <div class="flex flex-col lg:flex-row items-center justify-between py-0.5">
          <div class="flex flex-col md:flex-row items-center sm:justify-end gap-6">
            <ul class="flex items-center flex-wrap justify-center gap-2.5">
              <li v-for="tag in user.value.tags" :key="tag"
                class="py-3.5 px-7 rounded-full bg-orange-100 font-semibold text-base leading-7 text-gray-700 dark:bg-orange-900 dark:text-white">
                {{ tag }}
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Links (Discord and GitHub) -->
      <div class="mt-5 w-full max-w-7xl mx-auto px-6 md:px-8 flex justify-center sm:justify-end gap-4">
        <a v-if="user.value.discord_link" :href="`${user.value.discord_link}`" target="_blank" rel="noopener noreferrer"
          class="flex items-center py-3 px-6 bg-indigo-600 text-white rounded-full shadow-lg transition-all duration-500 hover:shadow-lg hover:bg-indigo-700">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 mr-2" viewBox="0 0 512 512">
            <path fill="currentColor"
              d="M464 66.52A50 50 0 0 0 414.12 17L97.64 16A49.65 49.65 0 0 0 48 65.52V392c0 27.3 22.28 48 49.64 48H368l-13-44l109 100ZM324.65 329.81s-8.72-10.39-16-19.32C340.39 301.55 352.5 282 352.5 282a139 139 0 0 1-27.85 14.25a173.3 173.3 0 0 1-35.11 10.39a170 170 0 0 1-62.72-.24a184.5 184.5 0 0 1-35.59-10.4a141.5 141.5 0 0 1-17.68-8.21c-.73-.48-1.45-.72-2.18-1.21c-.49-.24-.73-.48-1-.48c-4.36-2.42-6.78-4.11-6.78-4.11s11.62 19.09 42.38 28.26c-7.27 9.18-16.23 19.81-16.23 19.81c-53.51-1.69-73.85-36.47-73.85-36.47c0-77.06 34.87-139.62 34.87-139.62c34.87-25.85 67.8-25.12 67.8-25.12l2.42 2.9c-43.59 12.32-63.44 31.4-63.44 31.4s5.32-2.9 14.28-6.77c25.91-11.35 46.5-14.25 55-15.21a24 24 0 0 1 4.12-.49a205.6 205.6 0 0 1 48.91-.48a201.6 201.6 0 0 1 72.89 22.95s-19.13-18.15-60.3-30.45l3.39-3.86s33.17-.73 67.81 25.16c0 0 34.87 62.56 34.87 139.62c0-.28-20.35 34.5-73.86 36.19" />
          </svg>
          Discord
        </a>
        <a v-if="user.value.github_link" :href="`${user.value.github_link}`" target="_blank" rel="noopener noreferrer"
          class="flex items-center py-3 px-6 bg-gray-800 text-white rounded-full shadow-lg transition-all duration-500 hover:shadow-lg hover:bg-gray-900">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24"
            stroke="none">
            <path
              d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.089-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.304 3.495.997.108-.776.418-1.305.762-1.605-2.665-.305-5.467-1.332-5.467-5.93 0-1.31.47-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23a11.52 11.52 0 013.003-.404c1.02.005 2.045.138 3.003.404 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.62-5.475 5.92.43.372.81 1.102.81 2.222 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
          </svg>
          GitHub
        </a>
      </div>
    </section>

    <!-- Calendar (marginal adjustment) -->
    <div v-if="user.value.availibility" :class="{
      '-mt-24': !user.value.discord_link && !user.value.github_link,
      'pb-24': true,
    }">
      <Calendar :availibilityJson="JSON.stringify(user.value.availibility)" />
    </div>
  </div>

  <div v-else>
    <Loading />
  </div>

  <NavBar />
</template>

<script setup>
import { ref, onMounted, reactive } from "vue";
import { useAppStore } from "@/stores/index";
import NavBar from "@/components/NavBar.vue";
import Header from "@/components/Header.vue";
import Loading from "@/components/Loading.vue";
import Calendar from "@/components/Calendar.vue";

const appStore = useAppStore();

var user = reactive({});
var profile = ref(null);
var banner = ref(null);

onMounted(() => {
  user.value = appStore.getUser();
  profile.value = user.value.profile;
  banner.value = user.value.banner;

  if (typeof user.value.tags == "string") {
    try {
      user.value.tags = JSON.parse(user.value.tags);
    } catch (error) {
      console.error("Error al parsear tags:", error);
    }
  }

  if (typeof user.value.availibility == "string") {
    try {
      user.value.availibility = JSON.parse(user.value.availibility);
    } catch (error) {
      console.error("Error al parsear availibility:", error);
    }
  }
});
</script>