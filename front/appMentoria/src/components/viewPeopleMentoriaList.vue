<template>
  <div class="px-4 lg:px-40 py-8 bg-backgroundLight dark:bg-backgroundDark">
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-10 ">
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
    if (!response.ok) {
      throw new Error('Error al obtener los usuarios');
    }
    const data = await response.json();
    users.value = data;
    console.log('Usuarios cargados:', users.value);
  } catch (err) {
    console.error('Error al obtener los usuarios', err);
  }
};

onMounted(fetchUsers);
</script>