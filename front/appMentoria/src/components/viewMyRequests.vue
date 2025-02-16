<template>
  <div class="flex flex-col p-6 bg-bgTheme">
    <!-- Header con Filtros -->
    <div
      class="p-4 bg-containersTheme border-b flex flex-col md:flex-row justify-between items-center border-buttonColorPrimary"
    >
      <h2 class="text-lg font-semibold text-textThemeColor">
        {{ $t("myRequests.title") }}
      </h2>
    </div>

    <!-- Lista de Publicaciones -->
    <ul v-if="peticions.length > 0" class="mt-4">
      <viewMyRequestItem
        v-for="peticio in peticions"
        :key="peticio.id"
        :title="peticio.title"
        :description="peticio.description"
        :image="peticio.image"
        :text_ia="peticio.text_ia"
        :image_ia="peticio.image_ia"
        :availability="peticio.availability"
        :reports="peticio.reports"
        :created_at="peticio.created_at"
        @markAsRead="handleMarkAsRead(peticio.id)"
        @remove="handleRemove(peticio.id)"
      >
      </viewMyRequestItem>
    </ul>

    <!-- Sin Publicaciones -->
    <p v-else class="text-center py-6 text-textThemeColor">
      {{ $t("myRequests.noRequests") }}
    </p>
  </div>
</template>
  
<script setup>
import { ref, onMounted } from "vue";
import { getMyPeticions } from "@/services/communicationsScripts/employmentexchangeManager";
import { useAppStore } from "@/stores/index";
import viewMyRequestItem from "./viewMyRequestItem.vue";

const peticions = ref([]);
const loading = ref(true);

const appStore = useAppStore();
const user_id = appStore.getUser()?.id;

const fetchpeticions = async () => {
  try {
    if (!user_id) {
      console.error("Error: user_id no está definido.");
      return;
    }

    const data = await getMyPeticions(user_id);
    if (!Array.isArray(data)) {
      console.error(
        "Error: La respuesta del servidor no es una lista válida.",
        data
      );
      return;
    }

    peticions.value = data.map((n) => ({
      id: n.id,
      title: n.title,
      description: n.description,
      image: n.image,
      availability: JSON.parse(n.availability), // Parsear la disponibilidad
      reports: n.reports,
      text_ia: n.text_ia,
      image_ia: n.image_ia,
      created_at: new Date(n.created_at).toLocaleDateString(),
    }));
  } catch (error) {
    console.error("Error fetching peticions:", error);
  } finally {
    loading.value = false;
  }
};

onMounted(fetchpeticions);
</script>
  
<style scoped>
.container {
  max-width: 1200px;
}
</style>