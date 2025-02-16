<template>
  <div class="container">
  <Carousel v-bind="carouselConfig">
    <Slide v-for="user in users" :key="slide" class="custom-carousel bg-bgTheme mb-3">
    <div class="data bg-containersTheme"><ComponentProfile :key="user.id" :user="user" /></div>
    </Slide>

    <template #addons>
      <Navigation />
      <Pagination />
    </template>
  </Carousel>
</div>
</template>
<script setup>
import 'vue3-carousel/carousel.css'
import { Carousel, Slide, Pagination, Navigation } from 'vue3-carousel'
import { onMounted, ref } from 'vue';
import { getRecommendedUsers } from '../services/communicationsScripts/mainManager';
import ViewPeopleMentoria from '@/components/viewPeopleMentoria.vue';
import { useAppStore } from '@/stores';
import ComponentProfile from './componentProfile.vue';


let user=useAppStore().getUser();



const carouselConfig = {
  itemsToShow: window.innerWidth <= 768 ? 1 : 2.5,
  width: window.innerWidth <= 768 ? 'auto' : 1,
  wrapAround: true,
  gap: 20,
};



const users=ref([])
onMounted(async () => {
  try {
    console.log('user:', user.id);
    const response = await getRecommendedUsers(user.id);
    console.log('response:', response);
    users.value = response;
    console.log('Usuarios cargados:', users.value);
  } catch (err) {
    console.log(err);
    console.error('Error al obtener los usuarios', err);
  }
});

</script>

<style>
.container{
  z-index: 0;
  
}
.custom-carousel {
  display: block;
}

</style>
