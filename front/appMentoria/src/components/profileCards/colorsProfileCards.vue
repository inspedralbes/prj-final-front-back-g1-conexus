<template>
  <div>
    <div
      v-for="color in colors"
      :key="color.name"
      class="flex items-center gap-3 p-2 hover:bg-gray-100 cursor-pointer"
      @click="selectColor(color)"
    >
      <div
        class="w-6 h-6 rounded-full border border-gray-300"
        :style="{ backgroundColor: color.hex }"
      ></div>
      <span>{{ color.name }}</span>
      <svg
        v-if="selectedColor && selectedColor.name === color.name"
        xmlns="http://www.w3.org/2000/svg"
        class="h-5 w-5 text-green-500"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fill-rule="evenodd"
          d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z"
          clip-rule="evenodd"
        />
      </svg>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, ref } from "vue";

const props = defineProps({
  selectedColor: Object,
});

const emit = defineEmits(["selectColor"]);

const colors = ref([
  { name: "Negro", hex: "#808080" }, // Gris claro
  { name: "Dorado", hex: "#FFECB3" }, // Dorado claro
  { name: "Plateado", hex: "#E0E0E0" }, // Plateado claro
  { name: "Azul", hex: "#ADD8E6" }, // Azul claro
  { name: "Rojo", hex: "#FFB6C1" }, // Rojo claro
  { name: "Verde", hex: "#90EE90" }, // Verde claro
  { name: "Naranja", hex: "#FFDAB9" }, // Naranja claro
  { name: "Púrpura", hex: "#D8BFD8" }, // Púrpura claro
  { name: "Rosa", hex: "#FFCCE5" }, // Rosa claro
  { name: "Celeste", hex: "#B0E0E6" }, // Celeste claro
]);

const selectColor = (color) => {
  emit("selectColor", color);
};
</script>