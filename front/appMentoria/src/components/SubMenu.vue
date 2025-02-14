<template>
  <div>
    <div class="flex items-center justify-center px-0">
      <div class="relative inline-block text-left dropdown">
        <span class="rounded-md shadow-sm">
          <button
            class="flex items-center justify-between w-full px-4 py-3 text-sm font-medium text-textThemeColor transition-all duration-200 rounded-lg hover:bg-buttonColorPrimary shadow-custom dark:shadow-customDark">
            <img class="flex-shrink-0 object-cover w-9 h-9 mr-3 rounded-full" :src="`${profile}`" alt="User Photo" />
            {{ name }}
            <svg class="w-5 h-5 ml-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
              stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
            </svg>
          </button>
        </span>
        <div
          class="opacity-0 invisible dropdown-menu transition-all duration-300 transform origin-bottom-right translate-y-2 scale-95">
          <div
            class="absolute -right-90 bottom-full mb-12 w-56 origin-bottom-right bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg outline-none"
            aria-labelledby="headlessui-menu-button-1" id="headlessui-menu-items-117" role="menu">
            <div class="px-4 py-3">
              <p class="text-sm leading-5">{{ $t("subMenu.hi") }}</p>
              <p class="text-sm font-medium leading-5 text-gray-900 truncate">
                {{ name }}
              </p>
            </div>
            <div class="py-1">
              <button @click="$router.push('/myprofile')" tabindex="0"
                class="text-gray-700 flex justify-between w-full px-4 py-2 text-sm leading-5 text-left" role="menuitem">
                {{ $t("subMenu.profile") }}
              </button>
              <button @click="$router.push('/mypublications')" tabindex="1"
                class="text-gray-700 flex justify-between w-full px-4 py-2 text-sm leading-5 text-left" role="menuitem">
                {{ $t("subMenu.publications") }}
              </button>
              <button @click="$router.push('/myrequests')" tabindex="2"
                class="text-gray-700 flex justify-between w-full px-4 py-2 text-sm leading-5 text-left" role="menuitem">
                {{ $t("subMenu.request") }}
              </button>
              <button @click="$router.push('/settingPage')" tabindex="1"
                class="text-gray-700 flex justify-between w-full px-4 py-2 text-sm leading-5 text-left" role="menuitem">
                {{ $t("subMenu.setting") }}
              </button>
              <div v-if="userTypes == 2" class="py-1">
                <button @click="$router.push('/report')" tabindex="3"
                  class="text-gray-700 flex justify-between w-full px-4 py-2 text-sm leading-5 text-left"
                  role="menuitem">
                  {{ $t("subMenu.admin") }}
                </button>
              </div>
              <div v-if="userTypes == 3" class="py-1">
                <button @click="$router.push('/report')" tabindex="3"
                  class="text-gray-700 flex justify-between w-full px-4 py-2 text-sm leading-5 text-left"
                  role="menuitem">
                  {{ $t("subMenu.admin") }}
                </button>
                <button @click="$router.push('/stadistics')" tabindex="3"
                  class="text-gray-700 flex justify-between w-full px-4 py-2 text-sm leading-5 text-left"
                  role="menuitem">
                  {{ $t("subMenu.statistics") }}
                </button>
              </div>
            </div>
            <div class="py-1">
              <div class="flex justify-between px-4 py-2">
                <span>
                  <ToggleDarkMode />
                </span>
                <span>
                  <svg @click="handleLogout" width="40" height="40" fill="#000000" viewBox="-9 0 32 32" version="1.1"
                    xmlns="http://www.w3.org/2000/svg">
                    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                    <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                    <g id="SVGRepo_iconCarrier">
                      <title>Door</title>
                      <path
                        d="M13.28 5.88c-0.12-0.080-0.28-0.12-0.44-0.12 0 0 0 0-0.040 0h-12c-0.44 0-0.84 0.36-0.84 0.84v15.080c0 0.44 0.36 0.84 0.84 0.84h2.4v2.92c0 0.28 0.12 0.52 0.36 0.68 0.12 0.080 0.28 0.12 0.44 0.12 0.12 0 0.24-0.040 0.32-0.080l8.84-3.76c0.32-0.12 0.52-0.44 0.52-0.76v-15.040c-0.040-0.28-0.16-0.56-0.4-0.72zM1.64 20.8v-13.4h7.16l-5.080 2.2c-0.32 0.12-0.52 0.44-0.52 0.76v10.44h-1.56zM12 21.12l-7.12 3.040v-13.28l7.12-3.040v13.28zM7.64 16.84c0 0.464-0.376 0.84-0.84 0.84s-0.84-0.376-0.84-0.84c0-0.464 0.376-0.84 0.84-0.84s0.84 0.376 0.84 0.84z">
                      </path>
                    </g>
                  </svg>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from "vue";
import ToggleDarkMode from "./ToggleDarkMode.vue";
import { useAppStore } from "@/stores/index";
import { logout } from "@/services/communicationManager";
import { useRouter } from "vue-router";

const appStore = useAppStore();
var userTypes = ref("");
const router = useRouter();

var user = reactive({});
var profile = ref(null);
var name = ref(null);
var userTypes = ref("");

onMounted(() => {
  user.value = appStore.getUser();
  profile.value = user.value.profile;
  name.value = user.value.name;
  userTypes.value = appStore.getTypeUser();
});

const handleLogout = async () => {
  await logout();
  router.push("/login");
};
</script>

<style scoped>
.dropdown:focus-within .dropdown-menu {
  opacity: 1;
  transform: translate(0) scale(1);
  visibility: visible;
}
</style>