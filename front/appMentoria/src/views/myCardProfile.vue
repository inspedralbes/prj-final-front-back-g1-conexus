<template>
  <Header class="shadow-lg shadow-black/30"></Header>
  <div class="p-4">
    <div class="flex flex-col lg:flex-row lg:space-x-6">
      <div class="flex-1 mb-4 lg:mb-0">
        <!-- Contenedor de dropdowns para evitar solapamiento -->
        <div class="relative space-y-4">
          <!-- Dropdown de Diseño -->
          <div>
            <button
              @click="toggleDropdown('designs')"
              class="w-full bg-gray-800 text-white py-2 px-4 rounded flex justify-between items-center"
            >
              Seleccionar Diseño
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M5.23 7.21a.75.75 0 011.06 0L10 10.94l3.71-3.73a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.23 8.27a.75.75 0 010-1.06z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
            <div
              v-if="openDropdown === 'designs'"
              class="w-full mt-2 bg-white border rounded shadow-lg p-4"
            >
              <DesignsCards
                :selectedDesignFront="selectedDesignFront"
                :selectedDesignBack="selectedDesignBack"
                :user="user"
                @selectDesign="selectDesign"
                @updateDesigns="updateDesigns"
              />
            </div>
          </div>

          <!-- Dropdown de Colores -->
          <div>
            <button
              @click="toggleDropdown('colors')"
              class="w-full bg-gray-800 text-white py-2 px-4 rounded flex justify-between items-center"
            >
              Seleccionar Color
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M5.23 7.21a.75.75 0 011.06 0L10 10.94l3.71-3.73a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.23 8.27a.75.75 0 010-1.06z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
            <div
              v-if="openDropdown === 'colors'"
              class="w-full mt-2 bg-white border rounded shadow-lg p-4"
            >
              <ColorsProfileCards
                :selectedColor="selectedColor"
                @selectColor="selectColor"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="flex-2 mb-4 lg:mb-0">
        <PreviewCard
          :selectedDesignFront="selectedDesignFront"
          :selectedDesignBack="selectedDesignBack"
          :selectedColor="selectedColor"
          :designs="designs"
          :user="user"
        ></PreviewCard>
      </div>
      <div class="flex-1">
        <SelectDataToShowUserCard
          :selectedDesignFront="selectedDesignFront"
          :selectedDesignBack="selectedDesignBack"
          :selectedColor="selectedColor"
          :user="user"
          :designs="designs"
          @updateUserFields="updateUserFields"
        ></SelectDataToShowUserCard>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
import Header from "@/components/Header.vue";
import DesignsCards from "@/components/profileCards/desingsProfileCards.vue";
import QRCode from "qrcode";
import { useAppStore } from "@/stores/index";
import { uploadCards } from "@/services/communicationManager";
import ColorsProfileCards from "@/components/profileCards/colorsProfileCards.vue";
import PreviewCard from "@/components/profileCards/previewCard.vue";
import SelectDataToShowUserCard from "@/components/profileCards/selectDataToShowUserCard.vue";

const appStore = useAppStore();
const user = reactive({});
const visibleFields = reactive({
  name: true,
  title: true,
  email: true,
  titol: true,
  location: true,
  phone: false,
  skills: true,
  qrCode: true,
});
const qrCodeUrl = ref("");
const cardFront = ref(null);
const cardBack = ref(null);

const openDropdown = ref(null);

const toggleDropdown = (dropdown) => {
  openDropdown.value = openDropdown.value === dropdown ? null : dropdown;
};

const selectedColor = ref(null);

const selectColor = (color) => {
  selectedColor.value = color;
  // openDropdown.value = null;
};

const selectedDesignFront = ref(null);
const selectedDesignBack = ref(null);

const selectDesign = ({ type, id }) => {
  if (type === "front") {
    selectedDesignFront.value = id;
  } else if (type === "back") {
    selectedDesignBack.value = id;
  }
};

const designs = ref([]);

const updateDesigns = (newDesigns) => {
  designs.value = newDesigns;
};

const updateUserFields = (newFields) => {
  // Actualiza los campos de usuario seleccionados
  console.log("Campos de usuario actualizados:", newFields);
};

const generateQRCode = () => {
  const url = `https://www.ejemplo.com/perfil/${user.name}`;
  QRCode.toDataURL(url)
    .then((url) => {
      qrCodeUrl.value = url;
    })
    .catch((err) => console.error(err));
};

onMounted(() => {
  Object.assign(user, appStore.getUser());
  console.log("user info", user);
  generateQRCode();
});

async function svgToBase64(svgElement) {
  const svgString = new XMLSerializer().serializeToString(svgElement);
  const blob = new Blob([svgString], { type: "image/svg+xml" });
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result.split(",")[1]);
    reader.readAsDataURL(blob);
  });
}

async function saveChanges() {
  try {
    if (!cardFront.value || !cardBack.value) {
      console.error("No se encontraron los elementos SVG de las tarjetas");
      return;
    }

    const cardFrontBase64 = await svgToBase64(cardFront.value);
    console.log("Front SVG base64:", cardFrontBase64);
    const cardBackBase64 = await svgToBase64(cardBack.value);

    console.log("Back SVG base64:", cardBackBase64);

    console.log("user id", user.id);

    await uploadCards(user.id, cardFrontBase64, cardBackBase64);
    console.log("targeta guardada correctamente");
    router.push("/myprofile");
    // appStore.setCardImages(frontImageUrl, backImageUrl);
    // console.log(
    //   "targeta guardad en pinia",
    //   appStore.getUser().cardFrontImage,
    //   appStore.getUser().cardBackImage
    // );
  } catch (error) {
    console.error("Error al guardar los cambios:", error);
  }
}
</script>

<style scoped>
/* .business-card-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
} */
</style>s