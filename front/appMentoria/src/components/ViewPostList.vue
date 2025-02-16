<template>
  <div>
    <div v-if="message" class="p-4 bg-blue-100 text-blue-800 rounded-lg mb-4">
      {{ message }}
    </div>
    <ViewPost :posts="posts" />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import ViewPost from "@/components/viewPost.vue";
import { getCommunityPublication } from "@/services/communicationsScripts/communityManager";

const posts = ref([]);
const route = useRoute();
const message = route.state?.message;

const fetchPosts = async () => {
  try {
    posts.value = await getCommunityPublication();
  } catch (err) {
    console.error("Error al obtener los posts");
  }
};

onMounted(() => {
  fetchPosts();
});
</script>