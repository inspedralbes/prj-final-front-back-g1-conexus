<template>
    <div class="dark:bg-gray-800 bg-white p-6 rounded-xl shadow-lg shadow-black/30 my-4">
                <h2 class="text-2xl font-semibold border-b border-gray-600 pb-4 mb-4">{{ $t("formAvailability.title") }}</h2>
                <form class="border-b border-gray-600 pb-4 mb-4">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label for="contactEmail" class="block font-medium">{{ $t("formAvailability.email") }}</label>
                            <input v-model="personalInfo.contactEmail" type="email" id="contactEmail"
                                class="w-full border border-gray-300 rounded-lg p-2 mt-1 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                        </div>
                    </div>
                </form>
                <button class="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600">
                    {{ $t("formAvailability.save") }}
                </button>
            </div>
</template>
<script setup>
import { ref, onMounted, reactive } from "vue";
import { useAppStore } from "@/stores/index";


const appStore = useAppStore();

var user = ref({});
var profile = ref(null);
var banner = ref(null);


onMounted(() => {
    user.value = appStore.getUser();
    profile.value = user.value.profile;
    banner.value = user.value.banner;
    console.log("pepepeppee"+user.value)
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