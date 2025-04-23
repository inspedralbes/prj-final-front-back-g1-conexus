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
import DefaultLayout from '@/layouts/default.vue';
import StudentsLayout from '@/layouts/students.vue';
import TechniciansLayout from '@/layouts/technicians.vue';
import { useRoute } from 'vue-router';
import { computed } from 'vue';

const route = useRoute();

const layout = computed(() => {
  const path = route.path;
  switch (true) {
    case path.startsWith('/admin'):
      return AdminLayout;
    case path.startsWith('/teachers'):
      return TeachersLayout;
    case path.startsWith('/students'):
      return StudentsLayout;
    case path.startsWith('/technicians'):
      return TechniciansLayout;
    default:
      return DefaultLayout;
  }
});
</script>