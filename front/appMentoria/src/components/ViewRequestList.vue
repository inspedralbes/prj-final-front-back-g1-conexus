<template>
  <ViewRequest :requests="requests" />
</template>

<script setup>
import { ref, onMounted } from "vue";
import ViewRequest from "@/components/viewRequest.vue";
import { getEmploymentExchangePublication } from "../services/communicationsScripts/communicationManager";

const requests = ref([]);

const fetchPosts = async () => {
  try {
    requests.value = await getEmploymentExchangePublication();
    console.log("post", requests.value);
  } catch (err) {
    console.error("Error al obtener los requests");
  }
};

onMounted(() => {
  fetchPosts();
});
</script>