<template>
  <div>
    <p>Diseño Frontal: {{ selectedDesignFront }}</p>
    <p>Diseño Trasero: {{ selectedDesignBack }}</p>
    <p>Color Seleccionado: {{ selectedColor }}</p>
  </div>
</template>
  
  <script setup>
defineProps({
  selectedDesignFront: Number,
  selectedDesignBack: Number,
  selectedColor: Object,
});
</script>
