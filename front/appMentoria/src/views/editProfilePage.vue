<template>
  <div v-if="user.value" class="bg-bgTheme p-4 text-textThemeColor">
    <div class="space-y-8">
      <!-- Formulario 1: Información general -->
      <FormGeneralInfo v-if="editing.editing == 'banner'" />

      <!-- Formulario 2: Información Personal -->
      <FormPersonal v-if="editing.editing == 'profile'" />

      <!-- Formulario 3: Información de Disponibilidad -->
      <FormAvailability v-if="editing.editing == 'calendar'" />
    </div>
  </div>
  <div
    v-else
    class="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900"
  >
    <Loading />
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from "vue";
import { useAppStore } from "@/stores/index";
import Loading from "@/components/Loading.vue";
import Header from "@/components/Header.vue";
import BannerProfile from "@/components/profile/BannerProfile.vue";
import Calendar from "@/components/profile/Calendar.vue";
import PersonalInfo from "@/components/profile/PersonalInfo.vue";
import FormAvailability from "@/components/editProfile/formAvailability.vue";
import FormPersonal from "@/components/editProfile/formPersonal.vue";
import FormGeneralInfo from "@/components/editProfile/formGeneralInfo.vue";
const appStore = useAppStore();

var user = reactive({});
var profile = ref(null);
var banner = ref(null);
var editing = defineProps(["editing"]);
var personalInfo = reactive({});

onMounted(() => {
  user.value = appStore.getUser();
  profile.value = user.value.profile;
  banner.value = user.value.banner;
  if (typeof user.value.tags == "string") {
    try {
      user.value.tags = JSON.parse(user.value.tags);
    } catch (error) {
      console.error("Error al parsear tags:", error);
    }
  }

  if (typeof user.value.availibility == "string") {
    try {
      user.value.availibility = JSON.parse(user.value.availibility);
    } catch (error) {
      console.error("Error al parsear availibility:", error);
    }
  }
});
</script>