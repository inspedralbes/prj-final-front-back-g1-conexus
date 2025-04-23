<template>
  <ParticlesBackground />
  <component :is="layout" class="font-mono" />
</template>

<style scoped>
</style>

<script setup>
import ParticlesBackground from '@/components/Desing/background.vue'
import AdminLayout from '@/layouts/admin.vue';
import TeachersLayout from '@/layouts/teachers.vue';
import { useRoute } from 'vue-router';
import { computed } from 'vue';

const route = useRoute();

const layout = computed(() => {
  return route.path.startsWith('/admin') ? AdminLayout : TeachersLayout;
});
</script>