<template>
  <div class="flex flex-col p-6 bg-bgTheme">
    <!-- Header con Filtros -->
    <div
      class="p-4 bg-containersTheme border-b flex flex-col md:flex-row justify-between items-center border-buttonColorPrimary"
    >
      <h2 class="text-lg font-semibold text-textThemeColor">
        {{ $t("myPublications.title") }}
      </h2>
    </div>

    <!-- Lista de Publicaciones -->
    <ul v-if="publications.length > 0" class="mt-4">
      <viewMyPublicationItem
        v-for="publication in publications"
        :key="publication.id"
        :title="publication.title"
        :description="publication.description"
        :image="publication.image"
        :text_ia="publication.text_ia"
        :image_ia="publication.image_ia"
        :availability="publication.availability"
        :reports="publication.reports"
        :created_at="publication.created_at"
        @markAsRead="handleMarkAsRead(publication.id)"
        @remove="handleRemove(publication.id)"
      >
      </viewMyPublicationItem>
    </ul>

    <!-- Sin Publicaciones -->
    <p v-else class="text-center py-6 text-textThemeColor">
      {{ $t("myPublications.noPublications") }}
    </p>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getMyPublicationsInCommunity } from "@/services/communicationsScripts/communityManager";
import { useAppStore } from "@/stores/index";
import viewMyPublicationItem from "./viewMyPublicationItem.vue";

const publications = ref([]);
const loading = ref(true);

const appStore = useAppStore();
const user_id = appStore.getUser()?.id;

const fetchPublications = async () => {
  try {
    if (!user_id) {
      console.error("Error: user_id no está definido.");
      return;
    }

    const data = await getMyPublicationsInCommunity(user_id);
    if (!Array.isArray(data)) {
      console.error(
        "Error: La respuesta del servidor no es una lista válida.",
        data
      );
      return;
    }

    publications.value = data.map((n) => ({
      id: n.id,
      title: n.title,
      description: n.description,
      image: n.image,
      availability: n.availability,
      reports: n.reports,
      text_ia: n.text_ia,
      image_ia: n.image_ia,
      created_at: new Date(n.created_at).toLocaleDateString(),
    }));
  } catch (error) {
    console.error("Error fetching publications:", error);
  } finally {
    loading.value = false;
  }
};

const handleMarkAsRead = (id) => {
  console.log("Marking publication as read:", id);
};

const handleRemove = (id) => {
  publications.value = publications.value.filter((p) => p.id !== id);
};

onMounted(fetchPublications);
</script>

<style scoped>
.container {
  max-width: 1200px;
}
</style>
