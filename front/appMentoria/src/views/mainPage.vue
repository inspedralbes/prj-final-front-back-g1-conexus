<template>
  <div class="flex flex-col min-h-screen">
    <main class="flex-grow"> 
      <ViewPostList></ViewPostList>
    </main>

    <div
      v-if="showModal"
      class="fixed inset-0 flex items-center justify-center bg-containersTheme bg-opacity-50"
    >
      <div class="bg-containersTheme p-6 rounded-lg shadow-lg max-w-md mx-auto">
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
            class="bg-buttonColorPrimary text-white px-4 py-2 rounded hover:bg-buttonColorHoverPrimary"
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
import ViewPostList from "@/components/ViewPostList.vue";
import { subscribeToPushNotifications } from "@/services/communicationsScripts/pushNotificationsManager";
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
});
</script>