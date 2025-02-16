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
        <div
          class="flex flex-col text-center sm:text-left mt-4 sm:mt-0 sm:ml-4"
        >
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

      <div
        class="flex space-x-4 mt-4 sm:mt-0 sm:mr-2"
        v-if="user.value.id !== userId"
      >
        <button
          @click="chatButton(chatName, [user.value.id], router)"
          href="#"
          rel="noopener noreferrer"
          class="flex items-center py-1 px-3 border-2 bg-bgTheme border-buttonColorPrimary text-textThemeColor rounded-full hover:bg-buttonColorSecondary"
        >
          <svg
            class="w-6 h-6 text-textThemeColor"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 17h6l3 3v-3h2V9h-2M4 4h11v8H9l-3 3v-3H4V4Z"
            />
          </svg>
          {{ $t("viewPeopleMentoria.chat") }}
        </button>
        <button
          v-if="following"
          @click="follow(user.value.id)"
          href="#"
          rel="noopener noreferrer"
          class="flex items-center py-1 px-3 border-2 bg-bgTheme border-buttonColorPrimary text-textThemeColor rounded-full hover:bg-buttonColorSecondary"
        >
          <svg
            class="w-6 h-6 text-textThemeColor"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            fill="none"
            viewBox="0 5 45 24"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M29.323,28.000 L31.610,30.293 C31.999,30.684 31.999,31.316 31.610,31.707 C31.415,31.902 31.160,32.000 30.905,32.000 C30.649,32.000 30.394,31.902 30.200,31.707 L27.913,29.414 L25.627,31.707 C25.432,31.902 25.177,32.000 24.922,32.000 C24.667,32.000 24.412,31.902 24.217,31.707 C23.827,31.316 23.827,30.684 24.217,30.293 L26.503,28.000 L24.217,25.707 C23.827,25.316 23.827,24.684 24.217,24.293 C24.606,23.902 25.237,23.902 25.627,24.293 L27.913,26.586 L30.200,24.293 C30.589,23.902 31.220,23.902 31.610,24.293 C31.999,24.684 31.999,25.316 31.610,25.707 L29.323,28.000 ZM21.638,22.294 C22.028,22.684 22.028,23.317 21.638,23.707 C21.249,24.097 20.618,24.098 20.228,23.706 L19.231,22.706 C19.031,22.505 18.925,22.229 18.940,21.947 C18.956,21.664 19.089,21.400 19.308,21.222 C22.876,18.321 23.000,13.053 23.000,13.000 L23.000,7.000 C22.444,4.024 18.877,2.035 16.019,2.001 L15.948,2.003 C13.076,2.003 9.529,4.087 8.968,7.087 L8.964,12.994 C8.964,13.045 9.019,18.324 12.587,21.225 C12.845,21.435 12.982,21.761 12.952,22.093 C12.922,22.425 12.728,22.720 12.436,22.880 L1.988,28.594 L1.988,30.000 L20.933,30.000 C21.484,30.000 21.930,30.448 21.930,31.000 C21.930,31.552 21.484,32.000 20.933,32.000 L1.988,32.000 C0.888,32.000 -0.007,31.103 -0.007,30.000 L-0.007,28.000 C-0.007,27.634 0.193,27.297 0.513,27.122 L10.274,21.785 C7.005,18.239 7.000,13.232 7.000,13.000 L7.000,7.000 L6.987,6.832 C7.672,2.777 12.112,0.043 15.865,0.003 L15.948,-0.000 C19.718,-0.000 24.219,2.744 24.908,6.829 L24.922,6.996 L24.926,12.990 C24.926,13.227 24.888,18.479 21.380,22.034 L21.638,22.294 Z"
            />
          </svg>

          {{ $t("profilePage.unfollow") }}
        </button>
        <button
          v-if="!following"
          @click="follow(user.value.id)"
          href="#"
          rel="noopener noreferrer"
          class="flex items-center py-1 px-3 border-2 bg-bgTheme border-buttonColorPrimary text-textThemeColor rounded-full hover:bg-buttonColorSecondary"
        >
          <svg
            class="w-6 h-6 text-textThemeColor"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            fill="none"
            viewBox="0 5 45 24"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M2.002 27.959c0-0.795 0.597-1.044 0.835-1.154l8.783-4.145c0.63-0.289 1.064-0.885 1.149-1.573s-0.193-1.37-0.733-1.803c-2.078-1.668-3.046-5.334-3.046-7.287v-4.997c0-2.090 3.638-4.995 7.004-4.995 3.396 0 6.997 2.861 6.997 4.995v4.998c0 1.924-0.8 5.604-2.945 7.292-0.547 0.43-0.831 1.115-0.749 1.807 0.082 0.692 0.518 1.291 1.151 1.582l2.997 1.422 0.494-1.996-2.657-1.243c2.771-2.18 3.708-6.463 3.708-8.864v-4.997c0-3.31-4.582-6.995-8.998-6.995s-9.004 3.686-9.004 6.995v4.997c0 2.184 0.997 6.602 3.793 8.846l-8.783 4.145s-1.998 0.89-1.998 1.999v3.001c0 1.105 0.895 1.999 1.998 1.999h21.997v-2l-21.996 0.001v-2.029zM30.998 25.996h-3v-3c0-0.552-0.448-1-1-1s-1 0.448-1 1v3h-3c-0.552 0-1 0.448-1 1s0.448 1 1 1h3v3c0 0.552 0.448 1 1 1s1-0.448 1-1v-3h3c0.552 0 1-0.448 1-1s-0.448-1-1-1z"
            />
          </svg>
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
import {
  followUser,
  checkIfFollows,
} from "@/services/communicationsScripts/mainManager";
import { chatButton } from "@/services/communicationsScripts/chatManager";
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

const chatName = "";

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
.image {
  z-index: 5;
}
</style>