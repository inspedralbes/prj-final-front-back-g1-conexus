<template>
  <div class="flex flex-col min-h-screen">
    <Header class="fixed top-0 left-0 right-0 z-10"></Header>
    <main class="flex-grow mt-16 mb-60">
      <ViewPostList></ViewPostList>
    </main>
    <NavBar></NavBar>
    <div
      v-if="showModal"
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
    >
      <div class="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
        <h2 class="text-xl font-bold mb-4">{{ $t("mainPage.allow") }}</h2>
        <p class="mb-4">
          {{ $t("mainPage.questionPermission") }}
        </p>
        <p class="mb-4">
          {{ $t("mainPage.instruction") }}
        </p>
        <div class="flex justify-end">
          <button
            @click="closeModal"
            class="bg-blue-500 text-white px-4 py-2 rounded"
          >
            {{ $t("mainPage.ok") }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import NavBar from "@/components/NavBar.vue";
import Header from "@/components/Header.vue";
import ViewPostList from "@/components/ViewPostList.vue";
import { subscribeToPushNotifications } from "@/services/communicationManager";
import { useAppStore } from "@/stores/index";

const showModal = ref(false);

const requestPermission = async () => {
  const user = useAppStore().user;
  if (user) {
    await subscribeToPushNotifications(user);
  }
  closeModal();
};

const closeModal = () => {
  showModal.value = false;
};

onMounted(() => {
  requestPermission();
  // Verificar el estado del permiso de notificaciones
});
</script>