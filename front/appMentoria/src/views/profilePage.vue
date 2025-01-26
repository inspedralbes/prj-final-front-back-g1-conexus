<template>
  <!-- <Header></Header> -->

  <div v-if="user.value" class="dark:bg-gray-900">
    <!-- Banner and Profile Image -->
    <div>
      <img :src="`${banner}`" alt="banner-image" class="h-32 sm:h-48 w-full shadow-lg shadow-black/30" />

      <!-- Banner, profile and edit button -->
      <div class="flex justify-between">
        <div class="-translate-y-14 sm:-translate-y-20 ml-4">
          <img :src="`${profile}`" alt="user-avatar-image"
            class="border-4 border-solid border-white rounded-full object-cover w-28 h-28 sm:w-40 sm:h-40 bg-white shadow-lg shadow-black/30" />
        </div>

        <div class="-translate-y-4 sm:-translate-y-8 mr-4">
          <button @click="$router.push('/editProfile')"
            class="py-3 px-3 sm:py-4 sm:px-4 rounded-full bg-indigo-600 text-white shadow-lg shadow-black/30 hover:bg-indigo-700">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
              stroke="currentColor" class="size-6 sm:size-8">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- User - Personal Info -->
    <div class="dark:bg-gray-800 text-gray-100 p-6 rounded-xl shadow-lg shadow-black/30 mx-4 mb-4">
      <h2 class="text-xl font-semibold border-b border-gray-600 pb-2 mb-4">Informació Personal</h2>
      <div class="space-y-4">
        <!-- Full Name -->
        <div>
          <h3 class="font-semibold font-medium">Nom i cognoms</h3>
          <p class="text-gray-400">{{ user.value.name }}</p>
        </div>

        <!-- Biography -->
        <div>
          <h3 class="font-semibold font-medium">Descripció</h3>
          <p class="text-gray-400">
            {{ user.value.description || "Aquest usuari no ha afegit cap descripció." }}
          </p>
        </div>

        <!-- Social Links -->
        <div>
          <h3 class="text-sm font-semibold text-gray-400">Social</h3>
          <div class="flex space-x-4">
            <a href="#" class="text-gray-400 hover:text-white">Facebook</a>
            <a href="#" class="text-gray-400 hover:text-white">Instagram</a>
            <a href="#" class="text-gray-400 hover:text-white">GitHub</a>
            <a href="#" class="text-gray-400 hover:text-white">Dribbble</a>
          </div>
        </div>

        <!-- Location -->
        <div>
          <h3 class="text-sm font-semibold text-gray-400">Location</h3>
          <p class="text-base"><span class="mr-2">📍</span>California, United States of America</p>
        </div>

        <!-- Job Title -->
        <div>
          <h3 class="text-sm font-semibold text-gray-400">Job Title</h3>
          <p class="text-base"><span class="mr-2">💼</span>Frontend Developer</p>
        </div>

        <!-- Contact Info -->
        <div>
          <h3 class="text-sm font-semibold text-gray-400">Contact</h3>
          <p class="text-base">Email: helene@company.com</p>
          <p class="text-base">Phone: +1234 567 890 / +12 345 678</p>
        </div>

        <!-- Software Skills -->
        <div>
          <h3 class="text-sm font-semibold text-gray-400">Software Skills</h3>
          <div class="flex space-x-4">
            <span class="bg-gray-700 p-2 rounded">InVision</span>
            <span class="bg-gray-700 p-2 rounded">Sketch</span>
            <span class="bg-gray-700 p-2 rounded">Figma</span>
            <span class="bg-gray-700 p-2 rounded">Adobe XD</span>
          </div>
        </div>

        <!-- Languages -->
        <div>
          <h3 class="text-sm font-semibold text-gray-400">Languages</h3>
          <p class="text-base">English, French, Spanish</p>
        </div>
      </div>
      <button class="mt-6 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg shadow">
        Edit
      </button>
    </div>
  </div>

  <!-- If !users -->
  <div v-else>
    <Loading />
  </div>
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