<template>
  <div>{{ user.name }}</div>
  <div>{{ user.email }}</div>
  <div>{{ user.city }}</div>
  <div>{{ user.github_link }}</div>
  <div>{{ user.name }}</div>
  <div>{{ user.name }}</div>
  <div>{{ user.name }}</div>
</template>
<script setup>
import { watch } from "vue";

const props = defineProps({
  selectedDesignFront: Number,
  selectedDesignBack: Number,
  selectedColor: Object,
  user: Object,
  designs: Array,
});

watch(
  [
    () => props.selectedDesignFront,
    () => props.selectedDesignBack,
    () => props.selectedColor,
    () => props.designs,
    () => props.user,
  ],
  ([newFront, newBack, newColor, newDesigns, newUser]) => {
    // Solo mostrar si todos los valores son válidos
    if (
      newFront !== null &&
      newFront !== undefined &&
      newBack !== null &&
      newBack !== undefined &&
      newColor !== null &&
      newColor !== undefined &&
      newDesigns !== null &&
      newDesigns !== undefined &&
      newUser !== null &&
      newUser !== undefined
    ) {
      console.log("Valores actualizados select data to show", {
        selectedDesignFront: newFront,
        selectedDesignBack: newBack,
        selectedColor: newColor,
        designs: newDesigns,
        user: newUser,
      });
    }
  },
  { immediate: true } // Se ejecutará al inicio si hay valores asignados
);
</script>