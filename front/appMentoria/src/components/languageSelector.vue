<template>
  <div class="selectorContainer">
    <button
      id="dropdownUsersButton"
      @click="toggleDropdown"
      data-dropdown-toggle="dropdownUsers"
      data-dropdown-placement="bottom"
      class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      type="button"
    >
      <span v-if="selectedLanguage" :class="`iconFlag fi fis fi-${selectedLanguage}`" />
      <svg
        class="w-2.5 h-2.5 ms-3"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 10 6"
      >
        <path
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="m1 1 4 4 4-4"
        />
      </svg>
    </button>
    <div
      id="dropdownUsers"
      :class="{ hidden: !isDropdownVisible, block: isDropdownVisible }"
      class="z-10 bg-white rounded-lg shadow-sm w-60 dark:bg-gray-700"
    >
      <ul
        class="h-48 py-2 overflow-y-auto text-gray-700 dark:text-gray-200"
        aria-labelledby="dropdownUsersButton"
      >
        <li>
          <a
            @click="changeLanguage('es')"
            href="#"
            class="flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
          >
            <span :class="`fi iconFlag fis fi-es`" />
            <span class="ml-2">{{ $t("languageSelector.spanish") }}</span>
          </a>
          <a
            href="#"
            class="flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
            @click="changeLanguage('gb')"
          >
            <span :class="`fi iconFlag fis fi-gb`" />
            <span class="ml-2">{{$t("languageSelector.english")}}</span>
          </a>
          <a
            href="#"
            class="flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
            @click="changeLanguage('es-ct')"
          >
            <span :class="`fi fis iconFlag fi-es-ct`" />
            <span class="ml-2">{{ $t("languageSelector.catalan") }}</span>
          </a>
        </li>
        <li>
          <a
            @click="changeLanguage('cn')"
            href="#"
            class="flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
          >
            <span :class="`fi iconFlag fis fi-cn`" />
            <span class="ml-2">{{ $t("languageSelector.chinese") }}</span>
          </a>
        </li>
        <li>
          <a
            @click="changeLanguage('es-pv')"
            href="#"
            class="flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
          >
            <span :class="`fi iconFlag fis fi-es-pv`" />
            <span class="ml-2">{{ $t("languageSelector.euskera") }}</span>
          </a>
        </li>
        <li>
          <a
            @click="changeLanguage('es-ga')"
            href="#"
            class="flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
          >
            <span :class="`fi iconFlag fis fi-es-ga`" />
            <span class="ml-2">{{ $t("languageSelector.gallego") }}</span>
          </a>
        </li>
        <li>
          <a
            @click="changeLanguage('jp')"
            href="#"
            class="flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
          >
            <span :class="`fi iconFlag fis fi-jp`" />
            <span class="ml-2">{{ $t("languageSelector.japanese") }}</span>
          </a>
        </li>
        <li>
          <a
            @click="changeLanguage('de')"
            href="#"
            class="flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
          >
            <span :class="`fi iconFlag fis fi-de`" />
            <span class="ml-2">{{ $t("languageSelector.german") }}</span>
          </a>
        </li>
        <li>
          <a
            @click="changeLanguage('pk')"
            href="#"
            class="flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
          >
            <span :class="`fi iconFlag fis fi-pk`" />
            <span class="ml-2">{{ $t("languageSelector.urdu") }}</span>
          </a>
        </li>
        <li>
          <a
            @click="changeLanguage('pt')"
            href="#"
            class="flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
          >
            <span :class="`fi iconFlag fis fi-pt`" />
            <span class="ml-2">{{ $t("languageSelector.portuguese") }}</span>
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useAppStore } from "../stores/index";
import { changeLocale } from "../main.js";

const selectedLanguage = ref("gb");
const isDropdownVisible = ref(false);

const toggleDropdown = () => {
  isDropdownVisible.value = !isDropdownVisible.value;
};

const changeLanguage=(language)=>{
  useAppStore().setLanguage(language);
  switch(language){
    case "es":
      language = "es";
      break;
    case "gb":
      language = "en";
      break;
    case "es-ct":
      language = "ca";
      break;
    case "cn":
      language = "zh";
      break;
    case "es-pv":
      language = "eu";
      break;
    case "es-ga":
      language = "gl";
      break;
    case "jp":
      language = "ja";
      break;
    case "de":
      language = "de";
      break;
    case "pk":
      language = "ur";
      break;
    case "pt":
      language = "pt";
      break;
  }
  selectedLanguage.value = useAppStore().getLanguage();
  changeLocale(language);
  toggleDropdown()

}

onMounted(() => {
  const locale = new Intl.Locale(navigator.language);
  let language = "";
  language = locale.language;
  switch(language){
    case "es":
      language = "es";
      break;
    case "en":
      language = "gb";
      break;
    case "ca":
      language = "es-ct";
      break;
    case "zh":
      language = "cn";
      break;
    case "eu":
      language = "es-pv";
      break;
    case "gl":
      language = "es-ga";
      break;
    case "ja":
      language = "jp";
      break;
    case "de":
      language = "de";
      break;
    case "ur":
      language = "pk";
      break;
    case "pt":
      language = "pt";
      break;
  }
  useAppStore().setLanguage(language);
  changeLanguage(language);
  selectedLanguage.value = useAppStore().getLanguage();
});
</script>

<style scoped>
.iconFlag {
  border-radius: 100%;
}
.selectorContainer {
  position: fixed;
  top: 1rem;
  left: 1rem;
  z-index: 1000;
}
</style>
