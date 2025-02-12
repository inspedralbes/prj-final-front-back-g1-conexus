<template>
  <div class="p-6 bg-backgroundLight dark:bg-backgroundDark text-white rounded-lg w-96">
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
        :style="{ background: `linear-gradient(to right, ${selectedColorClass} 0%, ${selectedColorClass} ${(fontSize - 12) / (24 - 12) * 100}%, #ccc ${(fontSize - 12) / (24 - 12) * 100}%, #ccc 100%)`, color: selectedColorClass }"
        class="w-full accent-purpleCustom border-2 rounded-lg ring-2 appearance-none h-2 cursor-pointer" />
        <span class="text-lg mx-2">Aa</span>
      </div>
    </div>

    <div class="mt-4">
    <label class="block text-lg font-semibold mb-2">Color</label>
    <div class="flex gap-4">
      <div 
        v-for="color in themes" 
        :key="color" 
        :class="['w-8 h-8 rounded-full cursor-pointer', color.bg, selectedColor === color.bg ? 'ring-2 ring-white' : '']"
        @click="updateColor(color.bg)">
      </div>
    </div>
  </div>

    <div class="mt-4">
      <label class="block text-lg font-semibold mb-2">Imagen de fondo</label>
      <div class="flex gap-2">
        <button 
          v-for="(bg, index) in backgrounds" 
          :key="index" 
          class="px-4 py-2 rounded border text-white" 
          :class="selectedBackground === bg.name ? 'border-purpleCustom ring-2 ring-purpleCustom' : 'border-gray-400'"
          :style="{ borderColor: selectedBackground === bg.name ? selectedColorClass : 'border-purple-400' }"
          @click="updateBackground(bg.name)">
          {{ bg.label }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAppStore } from '@/stores';
import { ref, watch, defineEmits, computed } from 'vue';
const appStore = useAppStore();

const emit = defineEmits(['update:fontSize', 'update:color', 'update:background']);

const fontSize = ref(localStorage.getItem("fontSize") || 16);
const selectedColor = ref(appStore.getSelectedColor()|| "bg-purple-500");
const selectedBackground = ref(localStorage.getItem("selectedBackground") || "Oscuro");

const colors = ['purple', 'pink', 'yellow', 'green', 'blue'];
const themes = ref(colors.map(color => ({ bg: `bg-${color}-500` })));

const backgrounds = [
  { name: "Predeterminado", label: "Predet." },
  { name: "Noche clara", label: "Noche clara" },
  { name: "Oscuro", label: "Oscuro" }
];

const updateFontSize = () => {
  emit('update:fontSize', fontSize.value);
};

const updateColor = (color) => {
  selectedColor.value = color;
  appStore.setSelectedColor(color);
  emit('update:color', color);
};

const updateBackground = (background) => {
  selectedBackground.value = background;
  emit('update:background', background);
};

const selectedColorClass = computed(() => {
return selectedColor.value.replace('bg-', 'text-');
});

watch([fontSize, selectedColor, selectedBackground], ([newFontSize, newColor, newBackground]) => {
  localStorage.setItem("fontSize", newFontSize);
  localStorage.setItem("selectedColor", newColor);
  localStorage.setItem("selectedBackground", newBackground);
});
</script>

<style scoped>
</style>