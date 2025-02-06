<template>
  <Header class="shadow-lg shadow-black/30"></Header>
  <div class="p-4">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <h2 class="text-2xl font-bold mb-6 text-center">Tarjeta de Visita</h2>
        <div class="border p-6 rounded shadow-md bg-white max-w-lg mx-auto">
          <!-- Formulario de opciones -->
          <div class="mb-4 flex items-center justify-between">
            <span class="text-lg">{{ user.name }}</span>
            <input
              type="checkbox"
              v-model="visibleFields.name"
              class="w-6 h-6"
            />
          </div>
          <div class="mb-4 flex items-center justify-between">
            <span class="text-lg">{{ user.email }}</span>
            <input
              type="checkbox"
              v-model="visibleFields.email"
              class="w-6 h-6"
            />
          </div>
          <div class="mb-4 flex items-center justify-between">
            Titol
            <input
              type="checkbox"
              v-model="visibleFields.titol"
              class="w-6 h-6"
            />
          </div>
          <div class="mb-4 flex items-center justify-between">
            QRcode
            <input
              type="checkbox"
              v-model="visibleFields.qrCode"
              class="w-6 h-6"
            />
          </div>
        </div>
      </div>
      <div>
        <h2 class="text-2xl font-bold mb-6 text-center">Dissenys</h2>
        <DesignsCards></DesignsCards>
      </div>
    </div>
  </div>

  <h3 class="text-xl font-semibold mt-8 text-center">Previsualització</h3>
  <div class="flex justify-center items-center mt-6 relative p-4">
    <!-- Tarjetas de visita (frontal y trasera al lado) -->
    <div class="flex">
      <!-- Tarjeta frontal -->
      <svg
        width="500"
        height="280"
        class="shadow-lg rounded-lg bg-black"
        ref="cardFront"
      >
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <rect width="100%" height="100%" fill="black" />
        <text
          v-if="visibleFields.name"
          x="50"
          y="120"
          font-size="32"
          font-weight="bold"
          fill="gold"
          filter="url(#glow)"
          class="font-serif italic"
        >
          {{ user.name }}
        </text>
        <text
          v-if="visibleFields.titol"
          x="180"
          y="160"
          font-size="16"
          font-weight="bold"
          fill="gold"
          filter="url(#glow)"
          class="font-serif italic"
        >
          Web developer
        </text>
        <image
          v-if="visibleFields.icon_favicon"
          x="450"
          y="230"
          width="50"
          height="50"
          href="/favicon.ico"
          class="rounded-md"
        />
      </svg>

      <!-- Tarjeta posterior -->
      <svg
        width="500"
        height="280"
        class="shadow-lg rounded-lg bg-black"
        ref="cardBack"
      >
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <rect width="100%" height="100%" fill="black" />
        <text
          v-if="visibleFields.email"
          x="50"
          y="120"
          font-size="16"
          font-weight="bold"
          fill="gold"
          filter="url(#glow)"
          class="font-serif italic"
        >
          {{ user.email }}
        </text>
        <image
          v-if="visibleFields.qrCode"
          x="400"
          y="180"
          width="80"
          height="80"
          :href="qrCodeUrl"
          class="rounded-md"
        />
      </svg>
    </div>

    <!-- Botón para guardar los cambios -->
    <button
      class="absolute bottom-4 right-4 bg-gray-700 text-white p-2 rounded-full"
      @click="saveChanges"
    >
      Save Changes
    </button>
  </div>
</template>
  <script setup>
import { onMounted, reactive, ref } from "vue";
import Header from "@/components/Header.vue";
import DesignsCards from "@/components/profileCards/desingsProfileCards.vue";
import QRCode from "qrcode";
import { useAppStore } from "@/stores/index";
import { uploadCards } from "@/services/communicationManager";

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
</style>