<template>
  <div class="bg-containersTheme p-6 rounded-xl shadow-lg shadow-black/30 my-4">
    <img
      :src="banner"
      alt="banner-image"
      class="h-32 sm:h-48 w-full rounded-xl object-cover image"
    />
    <div
      class="flex flex-col items-center sm:flex-row sm:justify-between -translate-y-10 sm:-translate-y-16"
    >
      <div class="flex flex-col sm:flex-row items-center sm:items-end">
        <img
          :src="profile"
          alt="user-avatar-image"
          class="rounded-xl object-cover w-20 h-20 sm:w-32 sm:h-32 bg-buttonColorPrimary sm:ml-4"
        />
        <div class="flex flex-col text-center sm:text-left mt-4 sm:mt-0 sm:ml-4">
          <h3
            class="font-semibold text-xl sm:text-2xl text-textThemeColor mb-1"
          >
            {{ user.value.name }}
          </h3>
          <p class="text-sm sm:text-base text-textThemeColor">
            {{ user.value.city || $t("profilePage.placeWhereYouLive") }}
          </p>
        </div>
      </div>
      <div class="mt-4 sm:mt-0 sm:mr-4" v-if="user.value.id === userId">
        <button
          @click="$router.push('/editProfile/banner')"
          class="py-3 px-3 sm:py-4 sm:px-4 rounded-full bg-buttonColorPrimary text-textThemeColor shadow-lg shadow-black/30 hover:bg-buttonColorSecondary transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-5 h-5 sm:w-6 sm:h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
            />
          </svg>
        </button>
      </div>

      <div class="mt-4 sm:mt-0 sm:mr-2 mr-auto" v-if="user.value.id !== userId">
        <button
          @click="chatButton(user.value.id, router)"
          class="mr-2 py-3 px-3 sm:py-4 sm:px-4 rounded-full bg-buttonColorPrimary text-textThemeColor shadow-lg shadow-black/30 hover:bg-buttonColorSecondary transition"
        >
          {{ $t("profilePage.chat") }}
        </button>
        <button
          v-if="following"
          @click="follow(user.value.id)"
          class="py-3 px-3 sm:py-4 sm:px-4 rounded-full bg-buttonColorPrimary text-textThemeColor shadow-lg shadow-black/30 hover:bg-buttonColorSecondary transition"
        >
          {{ $t("profilePage.unfollow") }}
        </button>
        <button
          v-if="!following"
          @click="follow(user.value.id)"
          class="py-3 px-3 sm:py-4 sm:px-4 rounded-full bg-buttonColorPrimary text-textThemeColor shadow-lg shadow-black/30 hover:bg-buttonColorSecondary transition"
        >
          {{ $t("profilePage.follow") }}
        </button>
      </div>
    </div>
  </div>
  <!-- <div class="bg-containersTheme p-6 rounded-xl shadow-lg shadow-custom my-4">
        <img :src="banner" alt="banner-image" class="h-32 sm:h-48 w-full rounded-xl object-cover" />
        <div class="flex flex-col items-center sm:flex-row sm:justify-between -translate-y-10 sm:-translate-y-16">
            <div class="flex flex-col sm:flex-row items-center sm:items-end">
                <img :src="profile" alt="user-avatar-image"
                    class="rounded-xl object-cover w-20 h-20 sm:w-32 sm:h-32 bg-containersTheme sm:ml-4" />
                <div class="flex flex-col text-center sm:text-left mt-4 sm:mt-0 sm:ml-4">
                    <h3 class="font-semibold text-xl sm:text-2xl text-gray-900 mb-1 text-textThemeColor">
                        {{ user.value.name }}
                    </h3>
                    <p class="text-sm sm:text-base text-textThemeColor">
                        {{ user.value.city || $t("profilePage.placeWhereYouLive") }}
                    </p>
                </div>
            </div>
            <div class="mt-4 sm:mt-0 sm:mr-4">
                <button @click="$router.push('/editProfile/banner')"
                    class="py-3 px-3 sm:py-4 sm:px-4 rounded-full bg-buttonColorPrimary text-textThemeColor shadow-lg shadow-custom hover:bg-buttonColorHoverPrimary transition">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                        stroke="currentColor" class="w-5 h-5 sm:w-6 sm:h-6">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                    </svg>
                </button>
            </div>
        </div>
  </div> -->
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useAppStore } from "@/stores/index";
import { followUser, checkIfFollows} from "@/services/communicationsScripts/mainManager";
import {chatButton} from "@/services/communicationsScripts/chatManager";
import { useRouter } from "vue-router";

const following = ref(false);
const appStore = useAppStore();
const userId = ref(null);
const props = defineProps({
  banner: String,
  profile: String,
  user: Object,
});

const banner = computed(() => props.banner);
const profile = computed(() => props.profile);
const user = computed(() => props.user);
const router = useRouter();

async function checkFollowing(id) {
  console.log("id", id);
  let following = await checkIfFollows(id, userId.value);
  console.log("following", following.following);
  return following.following;
}
async function follow(id) {
  let result = await followUser(id, userId.value);
  console.log("result", result);
  following.value = result.following;
}
onMounted(async () => {
  userId.value = appStore.getUser();
  console.log("userId", userId.value);
  userId.value = userId.value.id;
  console.log("userId", userId.value);
  console.log("jkdfjjkmdfkok", user.value.value.id);
  following.value = await checkFollowing(user.value.value.id);
});
</script>
<style scoped>
.image{
  z-index: 5;
}
</style>