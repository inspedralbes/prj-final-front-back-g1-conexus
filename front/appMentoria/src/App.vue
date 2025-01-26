<script setup>
import { RouterView } from "vue-router";
import { ref, onMounted, reactive } from "vue";
import { useAppStore } from "@/stores/index";
import router from "@/router";
import { getUserForRefreshLogin } from "./services/communicationManager";
import Loading from "./components/Loading.vue";

const userAPP = reactive({}); // Objeto reactivo para el usuario
const isDarkMode = ref(false);
const isLoading = ref(true); // Bandera para controlar el estado de carga

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
  } else {
    router.push({ name: "login" });
  }

  isLoading.value = false; // Desactiva el estado de carga
});
</script>

<template>
  <div id="app" :class="isDarkMode ? 'dark' : ''">
    <RouterView
      v-if="!isLoading || userAPP.name"
      class="bg-slate-200 dark:bg-gray-900 dark:text-gray-400 text-gray-500"
    />
    <div
      v-else
      class="flex items-center justify-center min-h-screen bg-white dark:bg-neutral-800"
    >
      <Loading />
    </div>
  </div>
</template>

<style scoped></style>