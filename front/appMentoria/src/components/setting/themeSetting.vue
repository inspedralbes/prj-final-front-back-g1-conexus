<template>
  <div class="p-6 rounded-lg w-96 bg-backgroundLight dark:bg-backgroundDark text-textPrimary">
    <!-- Tamaño de la fuente -->
    <div>
      <label class="block text-lg font-semibold mb-2">Tamaño de la fuente</label>
      <div class="flex items-center justify-between">
        <span class="text-sm mx-2">Aa</span>
        <input 
          type="range" 
          min="12" 
          max="24"
          v-model="fontSize"
          @input="updateFontSize"
          :style="{ background: `linear-gradient(to right, var(--bg-primary) 0%, var(--bg-primary) ${(fontSize - 12) / (24 - 12) * 100}%, #ccc ${(fontSize - 12) / (24 - 12) * 100}%, #ccc 100%)` }"
          class="w-full accent-bgPrimary border-2 rounded-lg appearance-none h-2 cursor-pointer" />
        <span class="text-lg mx-2">Aa</span>
      </div>
    </div>

    <!-- Selección de Color -->
    <div class="mt-4">
      <label class="block text-lg font-semibold mb-2">Color</label>
      <div class="flex gap-4">
        <div 
          v-for="color in colors" 
          :key="color"
          :class="[`w-8 h-8 rounded-full cursor-pointer`, `color-${color}`, selectedColor === color ? 'ring-2 ring-white' : '']"
          @click="setColor(color)">
        </div>
      </div>
    </div>

    <!-- Selección de Imagen de Fondo -->
    <div class="mt-4">
      <label class="block text-lg font-semibold mb-2">Imagen de fondo</label>
      <div class="flex gap-2">
        <button 
          v-for="(bg, index) in backgrounds" 
          :key="index" 
          class="px-4 py-2 rounded border text-white"
          :class="selectedBackground === bg.name ? 'border-bgPrimary ring-2 ring-bgPrimary' : 'border-gray-400'"
          @click="updateBackground(bg.name)">
          {{ bg.label }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watchEffect } from 'vue';
import { useAppStore } from '@/stores/index';

const colors = useAppStore().getColors();
const color = ref(localStorage.getItem("color"));
const fontSize = ref(localStorage.getItem("fontSize"));
const selectedBackground = ref(localStorage.getItem("selectedBackground"));

const backgrounds = [
  { name: "Predeterminado", label: "Predet." },
  { name: "Noche clara", label: "Noche clara" },
  { name: "Oscuro", label: "Oscuro" }
];

// Actualizar tema y aplicarlo a <html>
const setColor = (newColor) => {
  color.value = newColor;
  document.documentElement.classList.remove(...colors.map(t => `color-${t}`));
  document.documentElement.classList.add(`color-${newColor}`);
  localStorage.setItem("color", newColor);
};

// Actualizar fondo y guardar en localStorage
const updateBackground = (background) => {
  selectedBackground.value = background;
  localStorage.setItem("selectedBackground", background);
};

// Guardar cambios en localStorage
watchEffect(() => {
  localStorage.setItem("fontSize", fontSize.value);
});
</script>
