<script setup>
import { RouterView } from "vue-router";
import { ref, onMounted, reactive, watch, computed } from "vue";
import { useAppStore } from "@/stores/index";
import router from "@/router";
import {
  getUserForRefreshLogin,
  subscribeToPushNotifications,
} from "./services/communicationManager";
import Loading from "./components/Loading.vue";
import LanguageSelector from "./components/languageSelector.vue";


const userAPP = reactive({}); // Objeto reactivo para el usuario
const isDarkMode = ref(false);
const isLoading = ref(true); // Bandera para controlar el estado de carga
const fontSizes = ref(localStorage.getItem("fontSize") || 16);
const selectedColor = ref(localStorage.getItem("selectedColor") || "bg-buttomLight");
const selectedBackground = ref(localStorage.getItem("selectedBackground") || "Predeterminado");


async function validateLogin() {
  const profileURL = ref("");
  const bannerURL = ref("");

  if (
    !localStorage.getItem("accessToken") ||
    !localStorage.getItem("user") ||
    !localStorage.getItem("refreshToken")
  ) {
    router.push({ name: "login" });
    return null; // Retorna null si faltan datos
  }

  try {
    const user = JSON.parse(localStorage.getItem("user"));
    const response = await getUserForRefreshLogin({ email: user });

    if (response.error) {
      router.push({ name: "login" });
      return null; // Retorna null si hay error
    } else {
      const user = response;
      const profile = user.profile;

      bannerURL.value = `${import.meta.env.VITE_URL_BACK}${user.banner}`;
      if (profile.includes("/upload/", 0)) {
        profileURL.value = `${import.meta.env.VITE_URL_BACK}${user.profile}`;
      } else {
        profileURL.value = user.profile;
      }

      user.profile = profileURL.value;
      user.banner = bannerURL.value;

      useAppStore().setUser(user);
      useAppStore().setAccessToken(localStorage.getItem("accessToken"));
      useAppStore().setRefreshToken(localStorage.getItem("refreshToken"));

      return user;
    }
  } catch (error) {
    router.push({ name: "login" });
    return null; // Retorna null si ocurre un error inesperado
  }
}
onMounted(async () => {
  
  const darkModePreference = localStorage.getItem("darkMode");
  if (darkModePreference == "enabled") {
    isDarkMode.value = true;
    document.documentElement.classList.add("dark");
  } else {
    isDarkMode.value = false;
    document.documentElement.classList.remove("dark");
  }

  const user = await validateLogin();
  if (user) {
    Object.assign(userAPP, user); // Asigna las propiedades al objeto reactivo
    // await subscribeToPushNotifications(user);
  } else {
    router.push({ name: "login" });
  }

  isLoading.value = false; 
});

watch([fontSizes, selectedColor, selectedBackground], () => {
  localStorage.setItem("fontSize", fontSizes.value);
  localStorage.setItem("selectedColor", selectedColor.value);
  localStorage.setItem("selectedBackground", selectedBackground.value);
});

const buttomColor = computed(() => {
  switch (selectedColor.value) {
    case 'bg-yellow-400':
      return '#f59e0b';
    case 'bg-pink-500':
      return '#ec4899';
    case 'bg-purple-500':
      return '#a855f7';
    case 'bg-orange-500':
      return '#f97316';
    case 'bg-green-500':
      return '#10b981';
    default:
      return '#ffffff';
  }
});
</script>

<template>

<div id="app" :class="[isDarkMode ? 'dark' : '', selectedColor]">

    <NavBarWeb />
  <LanguageSelector />
    <RouterView
      v-if="!isLoading || userAPP.name"
      class="bg-backgroundLight text-gray-900 dark:bg-backgroundDark dark:text-gray-100"
    />
    <div
      v-else
      class="flex items-center justify-center min-h-screen bg-backgroundLight dark:bg-backgroundDark"
    >
      <Loading />
    </div>
  </div>
</template>

<style scoped></style>