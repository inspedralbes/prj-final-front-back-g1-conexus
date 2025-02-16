<template>
  <div class="px-4 sm:px-2 md:px-4 lg:px-30 py-8 bg-bgTheme ">
    <div class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2  lg:grid-cols-3 gap-4 lg:gap-10">
      <view-people-mentoria v-for="user in users" :key="user.id" :user="user" />
    </div>
  </div>
</template>



<script setup>
import { ref, onMounted } from 'vue';
import ViewPeopleMentoria from '@/components/viewPeopleMentoria.vue';
import { getUsersForOther } from '../services/communicationsScripts/mainManager';

const users = ref([]);

const fetchUsers = async () => {
  try {
    const response = await getUsersForOther();
    if (response.error) {
      throw new Error(response.error);
    }
    users.value = response;
    console.log('Usuarios cargados:', users.value);
  } catch (err) {
    console.error('Error al obtener los usuarios', err);
  }
};

onMounted(fetchUsers);
</script>

<style scoped>
@media (max-width: 1335px) and (min-width: 1024px) {
  .md\:grid-cols-2 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

</style>