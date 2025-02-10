<template>
  <div>
    <h2 class="text-xl font-bold">Previsualización de la Tarjeta</h2>

    <div class="space-y-6">
      <!-- Diseño Frontal -->
      <div
        v-if="frontDesign"
        class="p-4 border rounded-lg shadow-lg"
        :class="selectedColor?.bg"
      >
        <div class="grid" :class="frontDesign.classes">
          <div
            v-for="(element, index) in frontDesign.elements"
            :key="index"
            :class="[element.classes, selectedColor?.text]"
          ></div>
        </div>
      </div>

      <!-- Diseño Trasero -->
      <div
        v-if="backDesign"
        class="p-4 border rounded-lg shadow-lg"
        :class="selectedColor?.bg"
      >
        <div class="grid" :class="backDesign.classes">
          <div
            v-for="(element, index) in backDesign.elements"
            :key="index"
            :class="[element.classes, selectedColor?.text]"
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

const frontDesign = computed(() =>
  props.designs.find((design) => design.id === props.selectedDesignFront)
);

const backDesign = computed(() =>
  props.designs.find((design) => design.id === props.selectedDesignBack)
);

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