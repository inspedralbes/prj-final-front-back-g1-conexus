<template>
  <div class="flex flex-col space-y-8 p-2 min-h-screen">
    <div class="self-end text-right"></div>
    <div class="grid grid-cols-1 gap-8">
      <div v-for="design in designs" :key="design.id" class="space-y-6">
        <h2 class="text-xl font-semibold text-center">
          Diseño {{ design.id }}
        </h2>

        <!-- Contenedor de las tarjetas -->
        <div
          class="flex flex-col md:flex-row justify-center md:justify-evenly gap-4"
        >
          <!-- Frontal -->
          <div
            class="border-4 rounded-lg p-6 w-full md:w-72 h-40 grid shadow-lg bg-white cursor-pointer"
            :class="[
              design.front.classes,
              selectedFront === design.id
                ? 'border-blue-500'
                : 'border-gray-300',
            ]"
            @click="selectFront(design.id)"
          >
            <template
              v-for="(element, index) in design.front.elements"
              :key="index"
            >
              <div :class="['bg-gray-300', element.classes]"></div>
            </template>
          </div>

          <!-- Trasera -->
          <div
            class="border-4 rounded-lg p-6 w-full md:w-72 h-40 grid shadow-lg bg-white cursor-pointer"
            :class="[
              design.back.classes,
              selectedBack === design.id ? 'border-red-500' : 'border-gray-300',
            ]"
            @click="selectBack(design.id)"
          >
            <template
              v-for="(element, index) in design.back.elements"
              :key="index"
            >
              <div :class="['bg-gray-300', element.classes]"></div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  selectedDesignFront: Number,
  selectedDesignBack: Number,
  selectedColor: Object,
});

const emit = defineEmits(["selectDesign", "updateDesigns"]);

const selectedFront = ref(props.selectedDesignFront);
const selectedBack = ref(props.selectedDesignBack);

watch(
  () => props.selectedDesignBack,
  props.selectedDesignFront,
  ([newFront, newBack]) => {
    selectedFront.value = newFront;
    selectedBack.value = newBack;
  }
);

const selectFront = (id) => {
  selectedFront.value = id;
  console.log("selected front", selectedFront.value);
  emit("selectDesign", { type: "front", id });
};

const selectBack = (id) => {
  selectedBack.value = id;
  console.log("selected back", selectedBack.value);
  emit("selectDesign", { type: "back", id });
};

const designs = ref([
  {
    id: 1,
    front: {
      classes: "grid-cols-6 gap-4",
      elements: [
        { classes: "row-span-2 col-start-1 col-end-3 w-16 h-16 rounded-full" },
        { classes: "col-span-4 w-full h-5 rounded" },
        { classes: "col-start-4 col-span-3 w-full h-5 rounded" },
        { classes: "col-start-4 col-end-5 w-full h-6 rounded" },
        { classes: "col-start-5 col-end-6 w-full h-6 rounded" },
        { classes: "w-full h-6 rounded" },
      ],
    },
    back: {
      classes: "grid-cols-6 grid-rows-6 gap-4",
      elements: [
        {
          classes:
            "row-start-2 row-span-4 col-start-1 col-end-3 w-full h-16 rounded",
        },
        { classes: "row-start-2 col-start-3 col-span-4 w-full h-5 rounded" },
        { classes: "row-start-4 col-start-4 col-span-3 w-full h-5 rounded" },
      ],
    },
    color: props.selectedColor,
  },
  {
    id: 2,
    front: {
      classes: "grid-cols-6 gap-4",
      elements: [
        {
          classes:
            "col-start-3 justify-center w-16 h-16 col-span-3 rounded-full",
        },
        { classes: "col-start-2 col-span-4 w-full h-5 rounded" },
      ],
    },
    back: {
      classes: "grid-cols-6 grid-rows-6 gap-4",
      elements: [
        { classes: "row-start-1 col-span-3 row-span-2 w-full h-5 rounded" },
        { classes: "row-start-3 col-span-3 row-span-2 w-full h-5 rounded" },
        {
          classes:
            "row-start-5 col-start-1 row-end-5 col-span-1 w-full h-6 rounded",
        },
        {
          classes:
            "row-start-5 col-start-2 row-end-5 col-span-1 w-full h-6 rounded",
        },
        {
          classes:
            "row-start-5 col-start-3 row-end-5 col-span-1 w-full h-6 rounded",
        },
        { classes: "row-start-2 col-start-5 w-16 h-16 rounded" },
      ],
    },
    color: props.selectedColor,
  },
  {
    id: 3,
    front: {
      classes: "grid-cols-6 grid-rows-6 gap-4",
      elements: [
        {
          classes:
            "row-start-2 row-span-4 col-start-1 col-end-3 w-full h-16 rounded",
        },
        { classes: "row-start-1 col-start-4 col-span-3 w-full h-5 rounded" },
        { classes: "row-start-3 col-start-4 col-span-3 w-full h-5 rounded" },
        { classes: "row-start-5 col-start-4 col-span-1 w-full h-6 rounded" },
        { classes: "row-start-5 col-start-5 col-span-1 w-full h-6 rounded" },
        { classes: "row-start-5 col-start-6 col-span-1 w-full h-6 rounded" },
      ],
    },
    back: {
      classes: "grid-cols-6 grid-rows-6 gap-4",
      elements: [
        { classes: "row-start-2 col-span-3 w-full h-5 rounded" },
        { classes: "row-start-4 col-span-3 w-full h-5 rounded" },
        { classes: "row-start-2 col-start-5 w-16 h-16 rounded-full" },
      ],
    },
    color: props.selectedColor,
  },
  {
    id: 4,
    front: {
      classes: "grid-cols-6 grid-rows-6 gap-4",
      elements: [
        { classes: "row-start-1 col-span-4 w-full h-5 rounded" },
        { classes: "row-start-3 col-span-3 w-full h-5 rounded" },
        { classes: "row-start-3 col-start-5 col-span-2 w-full h-5 rounded" },
        { classes: "row-start-5 col-start-4 col-span-1 w-full h-6 rounded" },
        { classes: "row-start-5 col-start-5 col-span-1 w-full h-6 rounded" },
        { classes: "row-start-5 col-start-6 col-span-1 w-full h-6 rounded" },
      ],
    },
    back: {
      classes: "grid-cols-6 grid-rows-6 gap-4",
      elements: [
        {
          classes:
            "row-start-2 row-span-4 col-start-1 col-end-3 w-full h-16 rounded",
        },
        { classes: "row-start-2 col-start-4 col-span-3 w-full h-5 rounded" },
        { classes: "row-start-4 col-span-4 w-full h-5 rounded" },
      ],
    },
    color: props.selectedColor,
  },
  {
    id: 5,
    front: {
      classes: "grid-cols-6 grid-rows-6 gap-4",
      elements: [
        {
          classes:
            "row-start-1 row-span-4 col-start-1 col-end-3 w-full h-16 rounded",
        },
        { classes: "row-start-5 col-span-1 w-full h-6 rounded" },
        { classes: "row-start-5 col-span-1 w-full h-6 rounded" },
        { classes: "row-start-5 col-span-1 w-full h-6 rounded" },
        { classes: "row-start-1 col-start-3 col-span-4 w-full h-5 rounded" },
        { classes: "row-start-3 col-start-4 col-span-3 w-full h-5 rounded" },
      ],
    },
    back: {
      classes: "grid-cols-6 grid-rows-6 gap-4",
      elements: [
        {
          classes:
            "row-start-2 row-span-2 col-start-1 col-end-3 w-16 h-16 rounded-full",
        },
        { classes: "row-start-2 col-start-4 col-span-3 w-full h-5 rounded" },
        { classes: "row-start-4 col-start-3 col-span-4 w-full h-5 rounded" },
      ],
    },
    color: props.selectedColor,
  },
  {
    id: 6,
    front: {
      classes: "grid-cols-6 grid-rows-6 gap-4",
      elements: [
        { classes: "row-start-1 col-span-1 w-full h-6 rounded" },
        { classes: "row-start-3 row-span-1 w-full h-6 rounded" },
        { classes: "row-start-5 row-span-1 w-full h-6 rounded" },
        {
          classes: "row-start-1 row-span-2 col-start-5 w-16 h-16 rounded-full",
        },
        { classes: "row-start-5 col-start-4 col-span-3 w-full h-5 rounded" },
      ],
    },
    back: {
      classes: "grid-cols-6 grid-rows-6 gap-4",
      elements: [
        { classes: "row-start-1 col-span-3 row-span-2 w-full h-5 rounded" },
        { classes: "col-span-2 col-start-5 row-span-2 w-full h-5 rounded" },
        { classes: "row-start-3 col-span-4 row-span-2 w-full h-5 rounded" },
        {
          classes:
            "row-start-5 row-span-4 col-span-3 row-span-2 w-full h-12 rounded",
        },
        { classes: "col-start-5 row-start-4 w-full col-span-2 h-16 rounded" },
      ],
    },
    color: props.selectedColor,
  },
]);

// watch(
//   () => props.selectedColor,
//   (newColor) => {
//     if (!designs.value || designs.value.length === 0) return; // Evitar errores si está vacío
//     console.log("desings", designs.value);
//     const selectedDesign = designs.value.find(
//       (design) => design.id === selectedFront.value
//     );

//     if (selectedDesign) {
//       selectedDesign.color = newColor;
//     }
//   }
// );
emit("updateDesigns", designs.value);
</script>

<style scoped>
.shadow-lg {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
</style>