<template>
  <div class="max-w-xs sm:max-w-sm rounded overflow-hidden shadow-custom mx-auto my-4 bg-containersTheme">
    <div class="relative">
      <img class="w-[400px] h-[220px] object-cover clippy" :src="`${imageBanner}${user.banner}`" alt="User Image">
      <div
        class="clippy absolute bottom-0 left-0 top-0 right-0 bg-blue-700 bg-opacity-50 p-2 sm:p-4 text-textThemeColor flex flex-col justify-end items-center">
      </div>
      <div
        class="absolute bottom-0 right-0 mb-4 sm:mb-6 mr-4 sm:mr-6 rounded-full h-10 sm:h-16 lg:h-20 w-10 sm:w-16 lg:w-20 flex items-center bg-buttonColorPrimary justify-center text-xl sm:text-4xl font-thin text-textThemeColor shadow-2xl md:translate-y-3">
        <img :src="profileSrc" alt="User Avatar" class="rounded-full h-full w-full object-cover"
          @click="toProfile(user.id)">
      </div>
    </div>
    <div class="pt-2 sm:pt-3 pb-8 sm:pb-5 px-4 sm:px-5 flex flex-col items-center space-y-2 sm:space-y-0">
      <p class="font-bold text-lg sm:text-3xl tracking-wide sm:mb-6">{{ user.name }}</p>
      <p class="text-gray-500 mb-1 sm:mb-6 tracking-wide text-sm sm:text-base">{{ user.qualification }}</p>
      <div class="pt-2 gap-4 sm:gap-8 flex flex-row align-center justify-center">
        <!-- <a class="[&>svg]:h-8 sm:[&>svg]:h-10 [&>svg]:w-8 sm:[&>svg]:w-10 [&>svg]:fill-[#7289da]" :href="`${user.discord_link}`" target="_blank">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
        <path
          d="M524.5 69.8a1.5 1.5 0 0 0 -.8-.7A485.1 485.1 0 0 0 404.1 32a1.8 1.8 0 0 0 -1.9 .9 337.5 337.5 0 0 0 -14.9 30.6 447.8 447.8 0 0 0 -134.4 0 309.5 309.5 0 0 0 -15.1-30.6 1.9 1.9 0 0 0 -1.9-.9A483.7 483.7 0 0 0 116.1 69.1a1.7 1.7 0 0 0 -.8 .7C39.1 183.7 18.2 294.7 28.4 404.4a2 2 0 0 0 .8 1.4A487.7 487.7 0 0 0 176 479.9a1.9 1.9 0 0 0 2.1-.7A348.2 348.2 0 0 0 208.1 430.4a1.9 1.9 0 0 0 -1-2.6 321.2 321.2 0 0 1 -45.9-21.9 1.9 1.9 0 0 1 -.2-3.1c3.1-2.3 6.2-4.7 9.1-7.1a1.8 1.8 0 0 1 1.9-.3c96.2 43.9 200.4 43.9 295.5 0a1.8 1.8 0 0 1 1.9 .2c2.9 2.4 6 4.9 9.1 7.2a1.9 1.9 0 0 1 -.2 3.1 301.4 301.4 0 0 1 -45.9 21.8 1.9 1.9 0 0 0 -1 2.6 391.1 391.1 0 0 0 30 48.8 1.9 1.9 0 0 0 2.1 .7A486 486 0 0 0 610.7 405.7a1.9 1.9 0 0 0 .8-1.4C623.7 277.6 590.9 167.5 524.5 69.8zM222.5 337.6c-29 0-52.8-26.6-52.8-59.2S193.1 219.1 222.5 219.1c29.7 0 53.3 26.8 52.8 59.2C275.3 311 251.9 337.6 222.5 337.6zm195.4 0c-29 0-52.8-26.6-52.8-59.2S388.4 219.1 417.9 219.1c29.7 0 53.3 26.8 52.8 59.2C470.7 311 447.5 337.6 417.9 337.6z" />
        </svg>
      </a> -->
        <span class="h-8 sm:h-9 w-8 sm:w-9 text-textThemeColor">
          <svg
              xmlns="http://www.w3.org/2000/svg" class="text-textThemeColor"
              fill="currentColor"
              viewBox="0 0 496 512">
              <path
              d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3 .3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5 .3-6.2 2.3zm44.2-1.7c-2.9 .7-4.9 2.6-4.6 4.9 .3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3 .7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3 .3 2.9 2.3 3.9 1.6 1 3.6 .7 4.3-.7 .7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3 .7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3 .7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z" />
        </svg>
        </span>
        <a @click="chatButton(chatName, [user.id], router)" href="#" rel="noopener noreferrer"
          class="flex items-center py-1 px-3 border-2 border-buttonColorPrimary text-textThemeColor rounded-full hover:bg-buttonColorSecondary">
          <svg class="w-6 h-6 text-textThemeColor" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24"
            height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9 17h6l3 3v-3h2V9h-2M4 4h11v8H9l-3 3v-3H4V4Z" />
          </svg>
          {{ $t('viewPeopleMentoria.chat') }}
        </a>
      </div>

      <div class="lg:py-4">
        <!-- <a @click="chatButton(chatName, [user.id], router)" href="#" rel="noopener noreferrer"
          class="flex items-center py-3 px-6 bg-buttonColorPrimary text-textThemeColor rounded-full shadow-lg shadow-black/30 transition-all duration-500 hover:shadow-gray-100 hover:bg-buttonColorPrimary">
          {{ $t('viewPeopleMentoria.chat') }}
        </a> -->
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { defineProps } from 'vue';
import { chatButton } from '@/services/communicationsScripts/chatManager';

const props = defineProps({
  user: {
    type: Object,
    required: true
  }
});

const router = useRouter();
const imageBanner = ref('');
const chatName = ref('');

onMounted(() => {
  imageBanner.value = import.meta.env.VITE_URL_BACK.replace(/\/$/, '');
});

const profileSrc = computed(() => {
  if (props.user.profile && props.user.profile.startsWith('http')) {
    return props.user.profile;
  } else if (props.user.profile) {
    return `${imageBanner.value}${props.user.profile}`;
  }
});

const toProfile = (id) => {
  router.push(`/profile/${id}`);
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap");
@tailwind base;
@tailwind components;
@tailwind utilities;

.clippy {
  clip-path: polygon(0 0, 100% 0, 100% 70%, 0% 100%);
}
</style>