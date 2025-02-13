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
        @dragover.prevent
      >
        <div class="grid gap-2 w-full h-full" :class="frontDesign.classes">
          <div
            v-for="(element, index) in frontDesign.elements"
            :key="index"
            :class="[element.classes, 'shadow cursor-pointer']"
            :style="{ backgroundColor: selectedColor?.hex }"
            @drop="onDropElement('front', index, $event)"
            @dragover.prevent
            @dragstart="onDragStart('front', index, $event)"
            draggable="true"
          >
            {{ getElementContent("front", index, element.content) }}
          </div>
        </div>
      </div>

      <!-- Diseño Trasero -->
      <div
        v-if="backDesign"
        class="p-8 border rounded-lg shadow-lg h-[200px] flex items-center justify-center"
        @dragover.prevent
      >
        <div class="grid gap-2 w-full h-full" :class="backDesign.classes">
          <div
            v-for="(element, index) in backDesign.elements"
            :key="index"
            :class="[element.classes, 'shadow cursor-pointer']"
            :style="{ backgroundColor: selectedColor?.hex }"
            @drop="onDropElement('back', index, $event)"
            @dragover.prevent
            @dragstart="onDragStart('back', index, $event)"
            draggable="true"
          >
            {{ getElementContent("back", index, element.content) }}
          </div>
        </div>
      </div>
      <div
        class="mt-4 p-4 border border-red-500 rounded-lg shadow-lg bg-red-100 text-center text-red-700"
        @dragover.prevent
        @drop="onDropToDelete"
      >
        🚮 Arrastra aquí para eliminar un elemento
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { useAppStore } from "@/stores/index";
import { storeToRefs } from "pinia";

const store = useAppStore();
const { availableElementsCard } = storeToRefs(store);
const draggedElement = ref(null);

const props = defineProps({
  selectedDesignFront: Number,
  selectedDesignBack: Number,
  selectedColor: Object,
  designs: Array,
  user: Object,
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

const getElementContent = (side, index, defaultContent) => {
  const storedElement = availableElementsCard.value.find(
    (item) => item.side === side && item.index === index
  );
  return storedElement ? storedElement.content : defaultContent;
};

const onDragStart = (side, index, event) => {
  const element = availableElementsCard.value.find(
    (item) => item.side === side && item.index === index
  );
  if (element) {
    draggedElement.value = element;
    event.dataTransfer.setData("field", JSON.stringify(element));
  }
};

const onDropElement = (side, index, event) => {
  event.preventDefault();
  const field = JSON.parse(event.dataTransfer.getData("field"));

  if (draggedElement.value) {
    const targetElement = availableElementsCard.value.find(
      (item) => item.side === side && item.index === index
    );

    if (targetElement) {
      // Si ya hay un elemento en la posición, intercambiamos usando IDs
      store.swapElements(draggedElement.value.id, targetElement.id);
    } else {
      // Si la posición está vacía, cambiamos de `side` y actualizamos
      draggedElement.value.side = side;
      draggedElement.value.index = index;
      store.addOrUpdateElement(draggedElement.value);
    }
  } else {
    // Si es un nuevo elemento desde la lista de disponibles
    const newElement = {
      id: `${side}-${index}`,
      side,
      index,
      content: field.label,
    };
    store.addOrUpdateElement(newElement);
  }

  draggedElement.value = null;
};

const onDropToDelete = (event) => {
  event.preventDefault();
  if (draggedElement.value) {
    store.removeElement(draggedElement.value.id);
    draggedElement.value = null;
  }
};
</script>
