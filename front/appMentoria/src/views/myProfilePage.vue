<template>
  <div v-if="user.value" class="bg-bgTheme p-4 text-textThemeColor">
    <!-- User - Banner & Profile Image -->
    <BannerProfile :banner="banner" :profile="profile" :user="user" />

    <!-- User - Personal Info -->
    <PersonalInfo :user="user" />

    <!-- User - Availibility -->
    <div class="bg-containersTheme  text-textThemeColor p-6 rounded-xl shadow-lg shadow-black/30 my-4">
      <Calendar :availabilityJson="user.value.availability" :id="user.value.id" />
    </div>
  </div>

  <!-- If !users -->
  <div
    v-else
    class="flex items-center justify-center min-h-screen bg-textThemeColor"
  >
    <Loading />
  </div>
  

</template>

<script setup>
import { ref, onMounted, reactive } from "vue";
import { useAppStore } from "@/stores/index";
import Loading from "@/components/Loading.vue";
import Calendar from "@/components/profile/Calendar.vue";
import BannerProfile from "@/components/profile/BannerProfile.vue";
import PersonalInfo from "@/components/profile/PersonalInfo.vue";
import { useRoute } from "vue-router";
import { getProfile } from "@/services/communicationsScripts/mainManager";
import RecommendedProfiles from "@/components/recommendedProfiles.vue";

const user = reactive({});
const profile = ref(null);
const banner = ref(null);

const route = useRoute();
const userId = ref(route.params.id);

onMounted(async () => {
  user.value = useAppStore().getUser();
  profile.value = user.value.profile;
  banner.value = user.value.banner;
  if (typeof user.value.tags == "string") {
    try {
      user.value.tags = JSON.parse(user.value.tags);
    } catch (error) {
      console.error("Error al parsear tags:", error);
    }
  }

  if (typeof user.value.availability == "string") {
    try {
      user.value.availability = JSON.parse(user.value.availability);
    } catch (error) {
      console.error("Error al parsear availibility:", error);
    }
  }
  if(user.value.softwareSkills==null){
    user.value.softwareSkills = [];
  }
  if(user.value.softSkills==null){
    user.value.softSkills = [];
  }
});
</script>
