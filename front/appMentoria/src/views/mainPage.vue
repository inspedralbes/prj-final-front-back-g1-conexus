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
      <div class="bg-white p-6 rounded-lg shadow-lg">
        <h2 class="text-xl font-bold mb-4">Permitir Notificaciones</h2>
        <p class="mb-4">
          ¿Deseas permitir notificaciones para recibir actualizaciones
          importantes?
        </p>
        <div class="flex justify-end">
          <button
            @click="requestPermission"
            class="bg-blue-500 text-white px-4 py-2 rounded mr-2"
          >
            Permitir
          </button>
          <button
            @click="closeModal"
            class="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Cancelar
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
</script>