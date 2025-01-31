<template>
    <Header class="shadow-lg shadow-black/30"></Header>
    <div v-if="user.value" class="dark:bg-gray-900 p-4 text-gray-900 dark:text-gray-100">
        <div class="space-y-8">
            <!-- Formulario 1: Información general -->
            <BannerProfile v-if="editing.editing=='banner'"/>
            
            <!-- Formulario 2: Información Personal -->
            <PersonalInfo v-if="editing.editing=='profile'"/>
            
            <!-- Formulario 3: Información de Disponibilidad -->
            <Calendar v-if="editing.editing=='calendar'"/>
          
        </div>
    </div>
    <div v-else class="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <Loading />
    </div>
</template>

<script setup>
import { ref, onMounted, reactive } from "vue";
import { useAppStore } from "@/stores/index";
import Loading from "@/components/Loading.vue";
import Header from "@/components/Header.vue";
import BannerProfile from "@/components/profile/BannerProfile.vue";
import Calendar from "@/components/profile/Calendar.vue"
import PersonalInfo from "@/components/profile/PersonalInfo.vue";
const appStore = useAppStore();

var user = reactive({});
var profile = ref(null);
var banner = ref(null);
var editing=defineProps(['editing']);
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