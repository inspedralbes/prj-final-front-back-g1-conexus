<template>
  <div class="relative">

    <!-- Main Content -->
    <main
      class="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen flex flex-col pt-20 pb-20"
    >
      <div class="container mx-auto px-4">
        <h1 class="text-2xl font-bold mb-6">{{ $t("serviceListPage.title") }}</h1>
        <ul class="space-y-6">
          <li
            v-for="service in services"
            :key="service.id"
            class="p-4 bg-white dark:bg-gray-800 rounded shadow-md flex flex-col relative"
          >
            <div class="flex items-center justify-between">
              <div>
                <p class="text-lg font-semibold">{{ service.name }}</p>
                <p
                  class="text-sm text-gray-500 dark:text-gray-400"
                  v-if="service.id"
                >
                  {{ service.id }}
                </p>
              </div>
              <div class="flex items-center mr-4">
                <label class="flex items-center space-x-2">
                  <span @click="toggleService(service)" class="cursor-pointer">
                    <i
                      :class="
                        service.enabled === 'enabled'
                          ? 'fas fa-eye text-green-500'
                          : 'fas fa-eye-slash text-red-500'
                      "
                    ></i>
                  </span>
                </label>
              </div>
            </div>
            <span
              class="absolute bottom-2 right-2 text-sm text-gray-500 dark:text-gray-400"
            >
              {{ service.status }}
            </span>
          </li>
        </ul>
      </div>
    </main>

    <!-- Navigation Bar -->
    <NavBar
      class="fixed bottom-0 left-0 right-0 z-20 shadow-md bg-white dark:bg-gray-800"
    />
  </div>
</template>
    
  <script setup>
import NavBar from "@/components/navBar/NavBarApp.vue";
import { ref, onMounted } from "vue";
import {
  getServices,
  changeServiceViewUsers,
} from "@/services/communicationManager";

const services = ref([]);

const fetchServices = async () => {
  try {
    const response = await getServices();
    services.value = response.map((service) => ({
      ...service,
      description: service.description || $t("serviceListPage.noDescription"),
    }));
  } catch (error) {
    console.error("Error fetching services", error);
  }
};

const toggleService = async (service) => {
  try {
    const newStatus = service.enabled === "enabled" ? "disabled" : "enabled";
    await changeServiceViewUsers(service.id, newStatus);
    service.enabled = newStatus;
  } catch (error) {
    console.error("Error updating service status", error);
  }
};

onMounted(() => {
  fetchServices();
});
</script>
    
  <style scoped>
/* Estilos específicos con Tailwind ya incluidos */
</style>