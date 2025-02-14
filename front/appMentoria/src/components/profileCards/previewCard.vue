<template>
  <div class="container mx-auto px-4">
    <h2 class="text-xl font-bold text-center mb-6">
      Previsualización de la Tarjeta
    </h2>

    <div class="space-y-6">
      <!-- Diseño Frontal -->
      <div
        v-if="frontDesign"
        ref="frontCardRef"
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
            @touchstart="onTouchStart('front', index, $event)"
            @touchmove="onTouchMove"
            @touchend="onTouchEnd('front', index)"
            draggable="true"
          >
            {{ getElementContent("front", index, element.content) }}
          </div>
        </div>
      </div>

      <!-- Diseño Trasero -->
      <div
        v-if="backDesign"
        ref="backCardRef"
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
            @touchstart="onTouchStart('back', index, $event)"
            @touchmove="onTouchMove"
            @touchend="onTouchEnd('back', index)"
            draggable="true"
          >
            {{ getElementContent("back", index, element.content) }}
          </div>
        </div>
      </div>
      <div
        v-if="isDragging"
        class="mt-4 p-4 border border-red-500 rounded-lg shadow-lg bg-red-100 text-center text-red-700"
        @dragover.prevent
        @drop="onDropToDelete"
        @touchstart="onTouchDelete"
      >
        🚮 Arrossega aquí per eliminar un element
      </div>
      <div class="flex justify-center mt-4 space-x-4">
        <button
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          @click="generateImages"
        >
          Generar Imágenes
        </button>
      </div>
      <div class="mt-6 text-center">
        <h3 class="text-lg font-semibold">Imágenes Generadas</h3>
        <div class="flex justify-center space-x-4 mt-4">
          <img
            v-if="svgFront"
            :src="svgFront"
            alt="Frontal Tarjeta"
            class="border rounded-lg w-48 h-auto"
          />
          <img
            v-if="svgBack"
            :src="svgBack"
            alt="Trasero Tarjeta"
            class="border rounded-lg w-48 h-auto"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import html2canvas from "html2canvas";
import { useAppStore } from "@/stores/index";
import { storeToRefs } from "pinia";

const store = useAppStore();
const { availableElementsCard, svgFront, svgBack, svgBase64 } =
  storeToRefs(store);
const draggedElement = ref(null);
const touchPosition = ref({ x: 0, y: 0 });
const isDragging = ref(false);

const frontCardRef = ref(null);
const backCardRef = ref(null);

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

const generateImages = async () => {
  console.log("a");
  try {
    if (frontCardRef.value) {
      console.log("ey");
      const canvasFront = await html2canvas(frontCardRef.value, {
        backgroundColor: null, // Transparente si es necesario
      });
      svgFront.value = canvasFront.toDataURL("image/png");
    }

    if (backCardRef.value) {
      const canvasBack = await html2canvas(backCardRef.value, {
        backgroundColor: null,
      });
      svgBack.value = canvasBack.toDataURL("image/png");
    }
  } catch (error) {
    console.error("Error al generar imágenes:", error);
  }
};

const onDragStart = (side, index, event) => {
  isDragging.value = true;
  const element = availableElementsCard.value.find(
    (item) => item.side === side && item.index === index
  );
  if (element) {
    draggedElement.value = element;
    event.dataTransfer.setData("field", JSON.stringify(element));
  }
};

const onTouchStart = (side, index, event) => {
  isDragging.value = true;
  const element = availableElementsCard.value.find(
    (item) => item.side === side && item.index === index
  );
  if (element) {
    draggedElement.value = element;
    touchPosition.value = {
      x: event.touches[0].clientX,
      y: event.touches[0].clientY,
    };
  }
};

const onTouchMove = (event) => {
  touchPosition.value = {
    x: event.touches[0].clientX,
    y: event.touches[0].clientY,
  };
};

const onTouchEnd = (event) => {
  isDragging.value = false;
  const dropTarget = document.elementFromPoint(
    touchPosition.value.x,
    touchPosition.value.y
  );

  if (dropTarget && dropTarget.dataset.dropTarget) {
    const { side, index } = dropTarget.dataset;
    onDropElement(side, index, event);
  } else if (dropTarget && dropTarget.dataset.deleteTarget) {
    onDropToDelete(event);
  }

  draggedElement.value = null;
};

const onDropElement = (side, index, event) => {
  event.preventDefault();
  isDragging.value = false;
  const field = JSON.parse(event.dataTransfer.getData("field"));
  console.log("field", field);
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

const onTouchDelete = () => {
  isDragging.value = false;
  if (draggedElement.value) {
    store.removeElement(draggedElement.value.id);
    draggedElement.value = null;
  }
};

const onDropToDelete = (event) => {
  event.preventDefault();
  isDragging.value = false;
  if (draggedElement.value) {
    store.removeElement(draggedElement.value.id);
    draggedElement.value = null;
  }
};

async function generateCard() {
  try {
  } catch (error) {
    console.error(error);
  }
}
</script>
