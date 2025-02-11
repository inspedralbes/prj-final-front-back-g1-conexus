<template>
  <div class="container mx-auto px-4">
    <h2 class="text-xl font-bold text-center mb-6">
      Previsualización de la Tarjeta
    </h2>

    <div class="space-y-6">
      <!-- Diseño Frontal -->
      <div
        v-if="frontDesign"
        class="p-8 border rounded-lg shadow-lg h-[200px] flex items-center justify-center"
      >
        <div class="grid gap-2 w-full h-full" :class="frontDesign.classes">
          <div
            v-for="(element, index) in frontDesign.elements"
            :key="index"
            :class="[element.classes, 'shadow']"
            :style="{ backgroundColor: selectedColor?.hex }"
          ></div>
        </div>
      </div>

      <!-- Diseño Trasero -->
      <div
        v-if="backDesign"
        class="p-8 border rounded-lg shadow-lg h-[200px] flex items-center justify-center"
      >
        <div class="grid gap-2 w-full h-full" :class="backDesign.classes">
          <div
            v-for="(element, index) in backDesign.elements"
            :key="index"
            :class="[element.classes, 'shadow']"
            :style="{ backgroundColor: selectedColor?.hex }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>
  <script setup>
import { watch, computed } from "vue";

const props = defineProps({
  selectedDesignFront: Number,
  selectedDesignBack: Number,
  selectedColor: Object,
  designs: Array,
});

const frontDesign = computed(
  () =>
    props.designs.find((design) => design.id === props.selectedDesignFront)
      ?.front
);

const backDesign = computed(
  () =>
    props.designs.find((design) => design.id === props.selectedDesignBack)?.back
);

watch([frontDesign, backDesign], ([newFront, newBack]) => {
  console.log("Front Design:", newFront);
  console.log("Back Design:", newBack);
});

watch(
  [
    () => props.selectedDesignFront,
    () => props.selectedDesignBack,
    () => props.selectedColor,
    () => props.designs,
  ],
  ([newFront, newBack, newColor, newDesigns]) => {
    // Solo mostrar si todos los valores son válidos
    if (
      newFront !== null &&
      newFront !== undefined &&
      newBack !== null &&
      newBack !== undefined &&
      newColor !== null &&
      newColor !== undefined &&
      newDesigns !== null &&
      newDesigns !== undefined
    ) {
      console.log("Valores actualizados en previewCard.vue:", {
        selectedDesignFront: newFront,
        selectedDesignBack: newBack,
        selectedColor: newColor,
        designs: newDesigns,
      });
    }
  },
  { immediate: true } // Se ejecutará al inicio si hay valores asignados
);
</script>