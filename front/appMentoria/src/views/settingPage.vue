<template>
  <div class="min-h-screen">
    <div class="bg-bgTheme p-6">
      <h1
        class="border-b border-textColorPrimary pb-4 text-3xl font-semibold text-textThemeColor"
      >
        {{ $t("titlesSettings.configuration") }}
      </h1>
      <div class="flex flex-wrap md:flex-nowrap md:space-x-4 mt-6">
        <button
          @click="section = 'idioma'"
          :class="
            section === 'idioma'
              ? 'border-b-2 border-textColorPrimary'
              : 'border-b-2 border-textThemeColor'
          "
          class="mt-2 md:mt-0 cursor-pointer px-4 py-2 font-semibold w-full md:w-auto text-left md:text-center"
        >
          <h3
            :class="
              section === 'idioma'
                ? 'text-textColorPrimary'
                : 'text-textThemeColor'
            "
          >
            {{ $t("titlesSettings.language") }}
          </h3>
        </button>
        <button
          @click="section = 'notificaciones'"
          :class="
            section === 'notificaciones'
              ? 'border-b-2 border-textColorPrimary'
              : 'border-b-2 border-textThemeColor'
          "
          class="mt-2 md:mt-0 cursor-pointer px-4 py-2 font-semibold w-full md:w-auto text-left md:text-center"
        >
          <h3
            :class="
              section === 'notificaciones'
                ? 'text-textColorPrimary'
                : 'text-textThemeColor'
            "
          >
            {{ $t("titlesSettings.notifications") }}
          </h3>
        </button>
        <button
          @click="section = 'estilos'"
          :class="
            section === 'estilos'
              ? 'border-b-2 border-textColorPrimary'
              : 'border-b-2 border-textThemeColor'
          "
          class="mt-2 md:mt-0 cursor-pointer px-4 py-2 font-semibold w-full md:w-auto text-left md:text-center"
        >
          <h3
            :class="
              section === 'estilos'
                ? 'text-textColorPrimary'
                : 'text-textThemeColor'
            "
          >
            {{ $t("titlesSettings.styles") }}
          </h3>
        </button>
      </div>
      <div>
        <div v-if="section === 'idioma'">
          <h2 class="py-4 text-2xl font-semibold text-textThemeColor">
            {{ $t("titlesSettings.language") }}
          </h2>
          <LanguageSetting class="w-full"></LanguageSetting>
        </div>
        <div v-if="section === 'notificaciones'">
          <h2 class="py-4 text-2xl font-semibold text-textThemeColor">
            {{ $t("titlesSettings.notifications") }}
          </h2>
          <label class="flex items-center space-x-3">
            <input
              v-model="notifications"
              type="checkbox"
              class="form-checkbox h-5 w-5 text-blue-600"
            />
            <span class="text-textThemeColor">{{
              $t("titlesSettings.enableNotifications")
            }}</span>
          </label>
        </div>
        <div v-if="section === 'estilos'">
          <h2 class="py-4 text-2xl font-semibold text-textThemeColor">
            {{ $t("titlesSettings.styles") }}
          </h2>
          <ThemeSetting
            class="w-full"
            :fontSize="fontSize"
            :color="selectedColor"
            :background="background"
            @update:fontSize="updateFontSize"
            @update:color="updateColor"
            @update:background="updateBackground"
          ></ThemeSetting>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import LanguageSetting from "@/components/setting/languageSetting.vue";
import ThemeSetting from "@/components/setting/themeSetting.vue";

const section = ref("idioma");
const notifications = ref(false);
const fontSize = ref(localStorage.getItem("fontSize") || 16);
</script>