<template>
  <div class="p-6 rounded-lg bg-containersTheme text-textPrimary">
    <!-- Tamaño de la fuente -->
    <div>
      <label class="block text-lg font-semibold mb-2">{{
        $t("settings.fontSize")
      }}</label>
      <div class="flex items-center justify-between">
        <span class="text-sm mx-2">{{ $t("settings.Aa") }}</span>
        <input
          type="range"
          min="12"
          max="24"
          v-model="fontSize"
          @input="updateFontSize"
          :style="{
            background: `linear-gradient(to right, var(--bg-primary) 0%, var(--bg-primary) ${
              ((fontSize - 12) / (24 - 12)) * 100
            }%, #ccc ${((fontSize - 12) / (24 - 12)) * 100}%, #ccc 100%)`,
          }"
          class="w-full accent-bgPrimary border-2 rounded-lg appearance-none h-2 cursor-pointer"
        />
        <span class="text-lg mx-2">{{ $t("settings.Aa") }}</span>
      </div>
    </div>

    <!-- Selección de Color -->
    <div class="mt-4">
      <label class="block text-lg font-semibold mb-2">{{
        $t("settings.color")
      }}</label>
      <div class="flex gap-4">
        <div
          v-for="color in colors"
          :key="color"
          class="px-4 py-2 rounded border text-white"
          :class="[
            `w-8 h-8 rounded-full cursor-pointer bg-bgColorPrimary`,
            `color-${color}`,
            color === selectedColor ? 'selected-color' : '',
          ]"
          @click="setColor(color)"
        ></div>
      </div>
    </div>

    <!-- Selección de Imagen de Fondo -->
    <div class="mt-4">
      <label class="block text-lg font-semibold mb-2">{{
        $t("settings.backgroundImatge")
      }}</label>
      <div class="flex gap-2">
        <button
          v-for="theme in themes"
          :key="theme"
          class="px-4 py-2 rounded border text-textThemeColor"
          :class="[
            `bg-containersTheme`,
            `theme-${theme}`,
            ,
            theme === selectedTheme ? 'selected-color' : 'border-gray-400',
          ]"
          @click="setThemes(theme)"
        >
          {{ theme }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watchEffect } from "vue";
import { useAppStore } from "@/stores/index";

const colors = useAppStore().getColors();
const themes = useAppStore().getThemes();
const selectedColor = ref(localStorage.getItem("color"));
const fontSize = ref(localStorage.getItem("fontSize"));
const selectedTheme = ref(localStorage.getItem("theme"));

const setThemes = (newTheme) => {
  useAppStore().setSelectedTheme(newTheme);
};

// Actualizar tema y aplicarlo a <html>
const setColor = (newColor) => {
  useAppStore().setSelectedColor(newColor);
};

// Guardar cambios en localStorage
watchEffect(() => {
  localStorage.setItem("fontSize", fontSize.value);
});
</script>

<style scoped>
.selected-color {
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
  border: 2px solid white;
}
</style>