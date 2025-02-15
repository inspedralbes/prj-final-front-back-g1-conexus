<script setup>
import { RouterView, useRoute } from "vue-router";
import { ref, onMounted, reactive, watch } from "vue";
import { useAppStore } from "@/stores/index";
import router from "@/router";
import { getUserForRefreshLogin } from "./services/communicationManager";
import Loading from "./components/Loading.vue";
import NavBarWeb from "./components/navBar/NavBarWeb.vue";
import NavBarApp from "./components/navBar/NavBarApp.vue";

const userAPP = reactive({}); // Objeto reactivo para el usuario
const isDarkMode = ref(false);
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
  }

  const themePreference = localStorage.getItem("theme");
  if (themePreference != null) {
    const themes = appStore.getThemes();
    const appElement = document.getElementById("app");
    appElement.classList.remove(...themes.map((t) => `theme-${t}`));
    appElement.classList.add(`theme-${themePreference}`);
    console.log("Theme preference:", themePreference);
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
    <NavBarWeb v-if="route.name !== 'login'" class="hidden lg:fixed lg:top-0 lg:left-0 lg:h-screen lg:w-60 lg:block z-10"></NavBarWeb>
    <NavBarApp v-if="route.name !== 'login'" class="fixed bottom-0 left-0 right-0 w-full lg:hidden z-10"></NavBarApp>
    <RouterView v-if="!isLoading || userAPP.name" />
    <div v-else class="flex items-center justify-center min-h-screen bg-bgTheme text-textThemeColor">
      <Loading />
    </div>
  </div>
</template>

<style scoped></style>