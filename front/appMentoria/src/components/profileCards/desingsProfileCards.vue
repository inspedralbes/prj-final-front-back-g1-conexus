<template>
  <div class="flex flex-col space-y-2 p-2 min-h-screen">
    <div class="self-end text-right"></div>
    <div class="grid grid-cols-1 gap-4">
      <div v-for="design in designs" :key="design.id" class="space-y-6">
        <h2 class="text-xl font-semibold text-center">
          Diseño {{ design.id }}
        </h2>

        <!-- Contenedor de las tarjetas -->
        <div
          class="flex flex-col md:flex-row justify-center md:justify-evenly gap-2"
        >
          <!-- Frontal -->
          <div
            class="border-4 rounded-lg p-4 w-full md:w-72 h-40 grid shadow-lg bg-white cursor-pointer"
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
  user: Object,
});

const emit = defineEmits(["selectDesign", "updateDesigns"]);

const selectedFront = ref(props.selectedDesignFront);
const selectedBack = ref(props.selectedDesignBack);

watch(
  () => [props.selectedDesignFront, props.selectedDesignBack],
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
        {
          dataField: props.user.profile,
          classes: "row-span-2 col-start-1 col-end-3 w-16 h-16 rounded-full",
          fixed: true, //imagen fija
        },
        {
          dataField: [
            props.user.name,
            props.user.city,
            props.user.email,
            props.user.phone,
            props.user.availibility,
          ],
          classes: "col-span-4 w-full h-5 rounded",
          fixed: false, //editable
        },
        {
          dataField: [
            props.user.name,
            props.user.city,
            props.user.email,
            props.user.phone,
            props.user.availibility,
          ],
          classes: "col-start-4 col-span-3 w-full h-5 rounded",
          fixed: false, //editable
        },
        {
          dataField: [
            props.user.linkedin_link,
            props.user.github_link,
            props.user.discord_link,
          ],
          classes: "col-start-4 col-end-5 w-full h-6 rounded",
          fixed: false, //editable
        },
        {
          dataField: [
            props.user.linkedin_link,
            props.user.github_link,
            props.user.discord_link,
          ],
          classes: "col-start-5 col-end-6 w-full h-6 rounded",
          fixed: false, //editable
        },
        {
          dataField: [
            props.user.linkedin_link,
            props.user.github_link,
            props.user.discord_link,
          ],
          classes: "w-full h-6 rounded",
          fixed: false, //editable
        },
      ],
    },
    back: {
      classes: "grid-cols-6 grid-rows-6 gap-4",
      elements: [
        {
          dataField: props.user.qrCode,
          classes:
            "row-start-2 row-span-4 col-start-1 col-end-3 w-full h-16 rounded",
          fixed: true, //qr fija
        },
        {
          dataField: [
            props.user.name,
            props.user.city,
            props.user.email,
            props.user.phone,
            props.user.availibility,
          ],
          classes: "row-start-2 col-start-3 col-span-4 w-full h-5 rounded",
          fixed: false, //editable
        },
        {
          dataField: [
            props.user.name,
            props.user.city,
            props.user.email,
            props.user.phone,
            props.user.availibility,
          ],
          classes: "row-start-4 col-start-4 col-span-3 w-full h-5 rounded",
          fixed: false, //editable
        },
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
          dataField: props.user.profile,
          classes:
            "col-start-3 justify-center w-16 h-16 col-span-3 rounded-full",
          fixed: true,
        },
        {
          dataField: [
            props.user.name,
            props.user.city,
            props.user.email,
            props.user.phone,
            props.user.availibility,
          ],
          classes: "col-start-2 col-span-4 w-full h-5 rounded",
          fixed: false,
        },
      ],
    },
    back: {
      classes: "grid-cols-6 grid-rows-6 gap-4",
      elements: [
        {
          dataField: [
            props.user.name,
            props.user.city,
            props.user.email,
            props.user.phone,
            props.user.availibility,
          ],
          classes: "row-start-1 col-span-3 row-span-2 w-full h-5 rounded",
          fixed: false,
        },
        {
          dataField: [
            props.user.name,
            props.user.city,
            props.user.email,
            props.user.phone,
            props.user.availibility,
          ],
          classes: "row-start-3 col-span-3 row-span-2 w-full h-5 rounded",
          fixed: false,
        },
        {
          dataField: [
            props.user.linkedin_link,
            props.user.github_link,
            props.user.discord_link,
          ],
          classes:
            "row-start-5 col-start-1 row-end-5 col-span-1 w-full h-6 rounded",
          fixed: false,
        },
        {
          dataField: [
            props.user.linkedin_link,
            props.user.github_link,
            props.user.discord_link,
          ],
          classes:
            "row-start-5 col-start-2 row-end-5 col-span-1 w-full h-6 rounded",
          fixed: false,
        },
        {
          dataField: [
            props.user.linkedin_link,
            props.user.github_link,
            props.user.discord_link,
          ],
          classes:
            "row-start-5 col-start-3 row-end-5 col-span-1 w-full h-6 rounded",
          fixed: false,
        },
        {
          dataField: props.user.qrCode,
          classes: "row-start-2 col-start-5 w-16 h-16 rounded",
          fixed: true,
        },
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
          dataField: props.user.qrCode,
          classes:
            "row-start-2 row-span-4 col-start-1 col-end-3 w-full h-16 rounded",
          fixed: true,
        },
        {
          dataField: [
            props.user.name,
            props.user.city,
            props.user.email,
            props.user.phone,
            props.user.availibility,
          ],
          classes: "row-start-1 col-start-4 col-span-3 w-full h-5 rounded",
          fixed: false,
        },
        {
          dataField: [
            props.user.name,
            props.user.city,
            props.user.email,
            props.user.phone,
            props.user.availibility,
          ],
          classes: "row-start-3 col-start-4 col-span-3 w-full h-5 rounded",
          fixed: false,
        },
        {
          dataField: [
            props.user.linkedin_link,
            props.user.github_link,
            props.user.discord_link,
          ],
          classes: "row-start-5 col-start-4 col-span-1 w-full h-6 rounded",
          fixed: false,
        },
        {
          dataField: [
            props.user.linkedin_link,
            props.user.github_link,
            props.user.discord_link,
          ],
          classes: "row-start-5 col-start-5 col-span-1 w-full h-6 rounded",
          fixed: false,
        },
        {
          dataField: [
            props.user.linkedin_link,
            props.user.github_link,
            props.user.discord_link,
          ],
          classes: "row-start-5 col-start-6 col-span-1 w-full h-6 rounded",
          fixed: false,
        },
      ],
    },
    back: {
      classes: "grid-cols-6 grid-rows-6 gap-4",
      elements: [
        {
          dataField: [
            props.user.name,
            props.user.city,
            props.user.email,
            props.user.phone,
            props.user.availibility,
          ],
          classes: "row-start-2 col-span-3 w-full h-5 rounded",
          fixed: false,
        },
        {
          dataField: [
            props.user.name,
            props.user.city,
            props.user.email,
            props.user.phone,
            props.user.availibility,
          ],
          classes: "row-start-4 col-span-3 w-full h-5 rounded",
          fixed: false,
        },
        {
          dataField: props.user.profile,
          classes: "row-start-2 col-start-5 w-16 h-16 rounded-full",
          fixed: true,
        },
      ],
    },
    color: props.selectedColor,
  },
  {
    id: 4,
    front: {
      classes: "grid-cols-6 grid-rows-6 gap-4",
      elements: [
        {
          dataField: [
            props.user.name,
            props.user.city,
            props.user.email,
            props.user.phone,
            props.user.availibility,
          ],
          classes: "row-start-1 col-span-4 w-full h-5 rounded",
          fixed: false,
        },
        {
          dataField: [
            props.user.name,
            props.user.city,
            props.user.email,
            props.user.phone,
            props.user.availibility,
          ],
          classes: "row-start-3 col-span-3 w-full h-5 rounded",
          fixed: false,
        },
        {
          dataField: props.user.phone,
          classes: "row-start-3 col-start-5 col-span-2 w-full h-5 rounded",
          fixed: true,
        },
        {
          dataField: [
            props.user.linkedin_link,
            props.user.github_link,
            props.user.discord_link,
          ],
          classes: "row-start-5 col-start-4 col-span-1 w-full h-6 rounded",
          fixed: false,
        },
        {
          dataField: [
            props.user.linkedin_link,
            props.user.github_link,
            props.user.discord_link,
          ],
          classes: "row-start-5 col-start-5 col-span-1 w-full h-6 rounded",
          fixed: false,
        },
        {
          dataField: [
            props.user.linkedin_link,
            props.user.github_link,
            props.user.discord_link,
          ],
          classes: "row-start-5 col-start-6 col-span-1 w-full h-6 rounded",
          fixed: false,
        },
      ],
    },
    back: {
      classes: "grid-cols-6 grid-rows-6 gap-4",
      elements: [
        {
          dataField: props.user.qrCode,
          classes:
            "row-start-2 row-span-4 col-start-1 col-end-3 w-full h-16 rounded",
          fixed: true,
        },
        {
          dataField: [
            props.user.name,
            props.user.city,
            props.user.email,
            props.user.phone,
            props.user.availibility,
          ],
          classes: "row-start-2 col-start-4 col-span-3 w-full h-5 rounded",
          fixed: false,
        },
        {
          dataField: [
            props.user.name,
            props.user.city,
            props.user.email,
            props.user.phone,
            props.user.availibility,
          ],
          classes: "row-start-4 col-span-4 w-full h-5 rounded",
          fixed: false,
        },
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
          dataField: props.user.qrCode,
          classes:
            "row-start-1 row-span-4 col-start-1 col-end-3 w-full h-16 rounded",
          fixed: true,
        },
        {
          dataField: [
            props.user.linkedin_link,
            props.user.github_link,
            props.user.discord_link,
          ],
          classes: "row-start-5 col-span-1 w-full h-6 rounded",
          fixed: false,
        },
        {
          dataField: [
            props.user.linkedin_link,
            props.user.github_link,
            props.user.discord_link,
          ],
          classes: "row-start-5 col-span-1 w-full h-6 rounded",
          fixed: false,
        },
        {
          dataField: [
            props.user.linkedin_link,
            props.user.github_link,
            props.user.discord_link,
          ],
          classes: "row-start-5 col-span-1 w-full h-6 rounded",
          fixed: false,
        },
        {
          dataField: [
            props.user.name,
            props.user.city,
            props.user.email,
            props.user.phone,
            props.user.availibility,
          ],
          classes: "row-start-1 col-start-3 col-span-4 w-full h-5 rounded",
          fixed: false,
        },
        {
          dataField: [
            props.user.name,
            props.user.city,
            props.user.email,
            props.user.phone,
            props.user.availibility,
          ],
          classes: "row-start-3 col-start-4 col-span-3 w-full h-5 rounded",
          fixed: false,
        },
      ],
    },
    back: {
      classes: "grid-cols-6 grid-rows-6 gap-4",
      elements: [
        {
          dataField: props.user.profile,
          classes:
            "row-start-2 row-span-2 col-start-1 col-end-3 w-16 h-16 rounded-full",
          fixed: true,
        },
        {
          dataField: [
            props.user.name,
            props.user.city,
            props.user.email,
            props.user.phone,
            props.user.availibility,
          ],
          classes: "row-start-2 col-start-4 col-span-3 w-full h-5 rounded",
          fixed: false,
        },
        {
          dataField: [
            props.user.name,
            props.user.city,
            props.user.email,
            props.user.phone,
            props.user.availibility,
          ],
          classes: "row-start-4 col-start-3 col-span-4 w-full h-5 rounded",
          fixed: false,
        },
      ],
    },
    color: props.selectedColor,
  },
  {
    id: 6,
    front: {
      classes: "grid-cols-6 grid-rows-6 gap-4",
      elements: [
        {
          dataField: [
            props.user.linkedin_link,
            props.user.github_link,
            props.user.discord_link,
          ],
          classes: "row-start-1 col-span-1 w-full h-6 rounded",
          fixed: false,
        },
        {
          dataField: [
            props.user.linkedin_link,
            props.user.github_link,
            props.user.discord_link,
          ],
          classes: "row-start-3 row-span-1 w-full h-6 rounded",
          fixed: false,
        },
        {
          dataField: [
            props.user.linkedin_link,
            props.user.github_link,
            props.user.discord_link,
          ],
          classes: "row-start-5 row-span-1 w-full h-6 rounded",
          fixed: false,
        },
        {
          dataField: props.user.profile,
          classes: "row-start-1 row-span-2 col-start-5 w-16 h-16 rounded-full",
          fixed: true,
        },
        {
          dataField: [
            props.user.name,
            props.user.city,
            props.user.email,
            props.user.phone,
            props.user.availibility,
          ],
          classes: "row-start-5 col-start-4 col-span-3 w-full h-5 rounded",
          fixed: false,
        },
      ],
    },
    back: {
      classes: "grid-cols-6 grid-rows-6 gap-4",
      elements: [
        {
          dataField: [
            props.user.name,
            props.user.city,
            props.user.email,
            props.user.phone,
            props.user.availibility,
          ],
          classes: "row-start-1 col-span-3 row-span-2 w-full h-5 rounded",
          fixed: false,
        },
        {
          dataField: [
            props.user.name,
            props.user.city,
            props.user.email,
            props.user.phone,
            props.user.availibility,
          ],
          classes: "col-span-2 col-start-5 row-span-2 w-full h-5 rounded",
          fixed: false,
        },
        {
          dataField: [
            props.user.name,
            props.user.city,
            props.user.email,
            props.user.phone,
            props.user.availibility,
          ],
          classes: "row-start-3 col-span-4 row-span-2 w-full h-5 rounded",
          fixed: false,
        },
        {
          dataField: [props.user.city, props.user.phone],
          classes:
            "row-start-5 row-span-4 col-span-3 row-span-2 w-full h-12 rounded",
          fixed: false,
        },
        {
          dataField: props.user.qrCode,
          classes: "col-start-5 row-start-4 w-full col-span-2 h-16 rounded",
          fixed: true,
        },
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