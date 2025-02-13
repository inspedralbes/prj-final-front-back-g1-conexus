<template>
    <div class="dark:bg-containersDark bg-containersLight p-6 rounded-xl shadow-lg shadow-custom my-4">
        <img :src="banner" alt="banner-image" class="h-32 sm:h-48 w-full rounded-xl object-cover" />
        <div class="flex flex-col items-center sm:flex-row sm:justify-between -translate-y-10 sm:-translate-y-16">
            <div class="flex flex-col sm:flex-row items-center sm:items-end">
                <img :src="profile" alt="user-avatar-image"
                    class="rounded-xl object-cover w-20 h-20 sm:w-32 sm:h-32 bg-white sm:ml-4" />
                <div class="flex flex-col text-center sm:text-left mt-4 sm:mt-0 sm:ml-4">
                    <h3 class="font-semibold text-xl sm:text-2xl text-gray-900 mb-1 dark:text-white">
                        {{ user.name }}
                    </h3>
                    <p class="text-sm sm:text-base text-gray-500 dark:text-gray-300">
                        {{ user.city || $t("profilePage.placeWhereYouLive") }}
                    </p>
                </div>
            </div>
            <div class="mt-4 sm:mt-0 sm:mr-4">
                <button @click="$router.push('/editProfile/banner')"
                    class="py-3 px-3 sm:py-4 sm:px-4 rounded-full bg-buttomLight text-white shadow-lg shadow-custom hover:bg-orange-400 transition">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                        stroke="currentColor" class="w-5 h-5 sm:w-6 sm:h-6">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                    </svg>
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';

const props = defineProps({
    banner: String,
    profile: String,
    user: Object
});

const banner = computed(() => props.banner);
const profile = computed(() => props.profile);
const user = computed(() => props.user);

onMounted(() => {
    console.log('Banner:', banner);
    console.log('Profile:', profile.value);
    console.log('User:', user.value);
});
</script>