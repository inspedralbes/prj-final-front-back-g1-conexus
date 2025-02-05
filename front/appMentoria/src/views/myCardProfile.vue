<template>
  <Header class="shadow-lg shadow-black/30"></Header>
  <div>
    <h3>AAAAAAAAAAAAAAAAAAAAAA</h3>
    <h2>BBBBBBBBBBBBBBBBBBBBBB</h2>
  </div>
  <!-- <div class="p-4">
    <h2 class="text-xl font-bold mb-4">Editar Tarjeta de Visita</h2>
    <input
      v-model="user.name"
      placeholder="Nombre"
      class="border p-2 mb-2 w-full rounded"
    />
    <input
      v-model="user.email"
      placeholder="Email"
      class="border p-2 mb-2 w-full rounded"
    />
    <input
      type="file"
      @change="handleProfilePicture"
      class="border p-2 mb-2 w-full rounded"
    />
    <input
      type="file"
      @change="handleBannerImage"
      class="border p-2 mb-4 w-full rounded"
    /> -->
  <!-- <DesignsProfileCards @select-design="setDesign" /> -->

  <!-- <h3 class="text-lg font-semibold mt-6">Previsualización</h3>
    <div class="flex justify-center items-center mt-4">

      <svg width="300" height="180" class="shadow-lg rounded-lg">

        <rect width="100%" height="100%" :fill="selectedDesign.color" />
        <image
          :x="10"
          :y="10"
          :width="50"
          :height="50"
          :href="profilePicture"
          class="rounded-full"
        />
        <image
          :x="70"
          :y="10"
          :width="220"
          :height="50"
          :href="bannerImage"
          class="rounded-lg"
        />
        <text x="20" y="80" font-size="20" class="font-semibold text-white">
          {{ user.name }}
        </text>
        <text x="20" y="110" font-size="14" class="text-white">
          {{ user.email }}
        </text>

        <g v-if="showBack">
          <rect width="100%" height="100%" :fill="selectedDesign.color" />
          <text x="20" y="50" font-size="14" class="font-semibold text-white">
            Código QR
          </text>
          <image
            x="70"
            y="50"
            width="100"
            height="100"
            :href="qrCodeUrl"
            class="rounded-md"
          />
        </g>
      </svg>
    </div> -->
</template>
  <script setup>
import { ref, watch } from "vue";
import Header from "@/components/Header.vue";
import QRCode from "qrcode";
import { useUserStore } from "@/stores/user";

// const user = useUserStore();
// const selectedDesign = ref({ color: "#e0e0e0" });
// const showBack = ref(false);
// const qrCodeUrl = ref("");

// // Generar el QR dinámicamente cuando cambian los datos
// const generateQRCode = () => {
//   const url = `https://www.ejemplo.com/perfil/${user.name}`;
//   QRCode.toDataURL(url)
//     .then((url) => {
//       qrCodeUrl.value = url;
//     })
//     .catch((err) => console.error(err));
// };

// // Verificar cambios en los datos del usuario
// watch([user.name, user.email], () => {
//   generateQRCode();
// });

// // Manejar cambios de imagen
// const handleProfilePicture = (event) => {
//   const file = event.target.files[0];
//   user.setProfilePicture(URL.createObjectURL(file));
// };

// const handleBannerImage = (event) => {
//   const file = event.target.files[0];
//   user.setBannerImage(URL.createObjectURL(file));
// };

// // Cambiar el diseño de la tarjeta
// const setDesign = (design) => {
//   selectedDesign.value = design;
// };
</script>
  <style scoped>
/* .business-card-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
} */
</style>