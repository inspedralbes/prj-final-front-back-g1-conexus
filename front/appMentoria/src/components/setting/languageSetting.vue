<template>
    <div class="flex flex-col items-center min-h-screen p-4">
      <div class="bg-backgroundLight dark:bg-backgroundDark shadow-custom rounded-lg p-6 w-full text-center">
        <h1 class="text-2xl font-bold mb-4">{{ getLanguageName(selectedLanguage) }}</h1>
        <div class="relative">
          <button class="w-full flex items-center justify-between bg-buttomLight dark:bg-buttomDark p-2 rounded-lg" @click="toggleDropdown">
            <span v-if="selectedLanguage" :class="`iconFlag fi fis fi-${selectedLanguage}`"></span>
            <span class="ml-2 font-semibold">{{ getLanguageName(selectedLanguage) }}</span>
            <svg class="w-4 h-4 ml-auto" aria-hidden="true" viewBox="0 0 10 6">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4" />
            </svg>
          </button>
          
          <div v-if="isDropdownVisible" class="absolute mt-2 w-full bg-backgroundLight dark:bg-backgroundDark shadow-custom rounded-lg py-2 z-10">
            <ul class="max-h-48 overflow-y-auto custom-scrollbar">
              <li class="px-4 py-2 flex items-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600" @click="changeLanguage('es')">
                <span class="iconFlag fi fis fi-es"></span>
                <span class="ml-2">Español</span>
              </li>
              <li class="px-4 py-2 flex items-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600" @click="changeLanguage('gb')">
                <span class="iconFlag fi fis fi-gb"></span>
                <span class="ml-2">English</span>
              </li>
              <li class="px-4 py-2 flex items-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600" @click="changeLanguage('es-ct')">
                <span class="iconFlag fi fis fi-es-ct"></span>
                <span class="ml-2">Català</span>
              </li>
              <li class="px-4 py-2 flex items-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600" @click="changeLanguage('cn')">
                <span class="iconFlag fi fis fi-cn"></span>
                <span class="ml-2">中文</span>
              </li>
              <li class="px-4 py-2 flex items-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600" @click="changeLanguage('es-pv')">
                <span class="iconFlag fi fis fi-es-pv"></span>
                <span class="ml-2">Euskera</span>
              </li>
              <li class="px-4 py-2 flex items-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600" @click="changeLanguage('es-ga')">
                <span class="iconFlag fi fis fi-es-ga"></span>
                <span class="ml-2">Galego</span>
              </li>
              <li class="px-4 py-2 flex items-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600" @click="changeLanguage('jp')">
                <span class="iconFlag fi fis fi-jp"></span>
                <span class="ml-2">日本語</span>
              </li>
              <li class="px-4 py-2 flex items-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600" @click="changeLanguage('de')">
                <span class="iconFlag fi fis fi-de"></span>
                <span class="ml-2">Deutsch</span>
              </li>
              <li class="px-4 py-2 flex items-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600" @click="changeLanguage('pk')">
                <span class="iconFlag fi fis fi-pk"></span>
                <span class="ml-2">اردو</span>
              </li>
              <li class="px-4 py-2 flex items-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600" @click="changeLanguage('pt')">
                <span class="iconFlag fi fis fi-pt"></span>
                <span class="ml-2">Português</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from "vue";
  import { useAppStore } from "@/stores/index";
  import { changeLocale } from "@/main.js";
  
  const selectedLanguage = ref("gb");
  const isDropdownVisible = ref(false);
  
  const toggleDropdown = () => {
    isDropdownVisible.value = !isDropdownVisible.value;
  };
  
  const changeLanguage = (language) => {
    const appStore = useAppStore();
    appStore.setLanguage(language);
    const localeMap = {
      es: "es",
      gb: "en",
      "es-ct": "ca",
      cn: "zh",
      "es-pv": "eu",
      "es-ga": "gl",
      jp: "ja",
      de: "de",
      pk: "ur",
      pt: "pt",
    };
    changeLocale(localeMap[language] || "en");
    selectedLanguage.value = language;
    isDropdownVisible.value = false;
  };
  
  const getLanguageName = (code) => {
    const languages = {
      es: "Español",
      gb: "English",
      "es-ct": "Català",
      cn: "中文",
      "es-pv": "Euskera",
      "es-ga": "Galego",
      jp: "日本語",
      de: "Deutsch",
      pk: "اردو",
      pt: "Português",
    };
    return languages[code] || "Unknown";
  };
  
  onMounted(() => {
    const locale = new Intl.Locale(navigator.language);
    const languageMap = {
      es: "es",
      en: "gb",
      ca: "es-ct",
      zh: "cn",
      eu: "es-pv",
      gl: "es-ga",
      ja: "jp",
      de: "de",
      ur: "pk",
      pt: "pt",
    };
    const detectedLanguage = languageMap[locale.language] || "gb";
    const appStore = useAppStore();
    appStore.setLanguage(detectedLanguage);
    selectedLanguage.value = detectedLanguage;
  });
  </script>
  
  <style scoped>
  .iconFlag {
    border-radius: 50%;
    width: 24px;
    height: 24px;
  }
  
  .custom-scrollbar::-webkit-scrollbar {
    width: 8px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-track {
    background: var(--background-light);
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background-color: var(--buttom-dark);
    border-radius: 10px;
    border: 2px solid var(--background-light);
  }
  
  .custom-scrollbar {
    scrollbar-color: var(--buttom-dark) var(--background-light);
    scrollbar-width: thin;
  }
  </style>