<script setup>
import { RouterView, useRoute } from "vue-router";
import { ref, onMounted, reactive, watch } from "vue";
import { useAppStore } from "@/stores/index";
import router from "@/router";
import { getUserForRefreshLogin } from "./services/communicationsScripts/mainManager";
import Loading from "./components/Loading.vue";
import NavBarWeb from "./components/navBar/NavBarWeb.vue";
import NavBarApp from "./components/navBar/NavBarApp.vue";

const userAPP = reactive({}); // Objeto reactivo para el usuario
const isLoading = ref(true); // Bandera para controlar el estado de carga
const appStore = useAppStore();
const route = useRoute();

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

      appStore.setUser(user);
      appStore.setAccessToken(localStorage.getItem("accessToken"));
      appStore.setRefreshToken(localStorage.getItem("refreshToken"));

      return user;
    }
  } catch (error) {
    router.push({ name: "login" });
    return null; // Retorna null si ocurre un error inesperado
  }
}

onMounted(async () => {
  const colorPreference = localStorage.getItem("color");
  if (colorPreference != null) {
    const colors = appStore.getColors();
    const appElement = document.getElementById("app");
    appElement.classList.remove(...colors.map((t) => `color-${t}`));
    appElement.classList.add(`color-${colorPreference}`);
    console.log("Color preference:", colorPreference);
  } else {
    const color = 'yellow';
    const appElement = document.getElementById("app");
    appElement.classList.add(`color-${color}`);
  }

  const themePreference = localStorage.getItem("theme");
  if (themePreference != null) {
    const themes = appStore.getThemes();
    const appElement = document.getElementById("app");
    appElement.classList.remove(...themes.map((t) => `theme-${t}`));
    appElement.classList.add(`theme-${themePreference}`);
    console.log("Theme preference:", themePreference);
  } else {
    const theme = 'light';
    const appElement = document.getElementById("app");
    appElement.classList.add(`theme-${theme}`);
  }

  const user = await validateLogin();
  if (user) {
    Object.assign(userAPP, user); // Asigna las propiedades al objeto reactivo
  } else {
    router.push({ name: "login" });
  }

  isLoading.value = false;
});

// Watch for changes in selectedColor and selectedTheme
watch(() => appStore.selectedColor, (newColor) => {
  const colors = appStore.getColors();
  const appElement = document.getElementById("app");
  appElement.classList.remove(...colors.map((t) => `color-${t}`));
  appElement.classList.add(`color-${newColor}`);
});

watch(() => appStore.selectedTheme, (newTheme) => {
  const themes = appStore.getThemes();
  const appElement = document.getElementById("app");
  appElement.classList.remove(...themes.map((t) => `theme-${t}`));
  appElement.classList.add(`theme-${newTheme}`);
});
</script>

<template>
  <div id="app" class="bg-bgTheme text-textThemeColor">
    <div v-if="!isLoading" class="min-h-screen hidden md:flex">
      <NavBarWeb v-if="route.name !== 'login'" class="hidden md:flex md:flex-col md:h-screen md:w-60 fixed"></NavBarWeb>
      <div class="flex-1 overflow-auto ml-60">
        <RouterView v-if="userAPP.name"/> 
      </div>
    </div>
    <div v-if="!isLoading" class="flex flex-col fixed min-h-screen md:hidden items-center justify-center">
      <div class="flex-1 w-full overflow-auto flex items-center justify-center">
        <RouterView v-if="userAPP.name"/>
      </div>
      <NavBarApp v-if="route.name !== 'login' && !isLoading" class="fixed bottom-0 left-0 right-0 w-full md:hidden z-10"></NavBarApp>
    </div>
    <div v-else class="flex items-center justify-center min-h-screen bg-bgTheme text-textThemeColor">
      <Loading />
    </div>
  </div>
</template>

<style scoped>
@media (max-width: 1068px) {
  .md\:hidden {
    display: flex !important;
  }
  .md\:flex {
    display: none !important;
  }
}
</style>