<template>
    <div class="dark:bg-gray-800 bg-white p-6 rounded-xl shadow-lg shadow-black/30 my-4">
        <h2 class="text-2xl font-semibold border-b border-gray-600 pb-4 mb-4">{{ $t("editProfile.title") }}</h2>
        <form enctype="multipart/form-data" class="border-b border-gray-600 pb-4 mb-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label for="profileName" class="block font-medium">{{ $t("editProfile.fullName") }}</label>
                    <input v-model="user.name" type="text" id="profileName" required
                        class="w-full border border-gray-300 rounded-lg p-2 mt-1 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div>
                    <label for="profileCity" class="block font-medium">{{ $t("editProfile.city") }}</label>
                    <input v-model="user.city" type="text" id="profileCity" required
                        class="w-full border border-gray-300 rounded-lg p-2 mt-1 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <!-- Banner Section -->
                <div class="col-span-1 md:col-span-2">
                    <label class="block font-medium">{{ $t("editProfile.bannerimg") }}</label>
                    <div class="flex items-center space-x-4 mt-2">
                        <!-- Current Banner Preview -->
                        <div
                            class="w-32 h-20 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden border dark:border-gray-600">
                            <img :src="banner" alt="Banner Actual" class="w-full h-full object-cover" />
                        </div>
                        <!-- New Banner Input -->
                        <div>
                            <input type="file" @change="previewNewBanner" accept="image/*" id="bannerImage"
                                class="block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-gray-700 dark:file:text-gray-300 dark:hover:file:bg-gray-600" />
                        </div>
                    </div>
                    <!-- Preview for the New Banner -->
                    <div v-if="newBanner"
                        class="mt-2 w-32 h-20 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden border dark:border-gray-600">
                        <img :src="newBanner" alt="Nova Imatge de Banner" class="w-full h-full object-cover" />
                    </div>
                </div>
                <!-- Profile Image Section -->
                <div class="col-span-1 md:col-span-2">
                    <label class="block font-medium">{{ $t("editProfile.profileimg") }}</label>
                    <div class="flex items-center space-x-4 mt-2">
                        <!-- Current Profile Image Preview -->
                        <div
                            class="w-20 h-20 rounded-full overflow-hidden border bg-gray-100 dark:bg-gray-700 dark:border-gray-600">
                            <img :src="profile" alt="Imatge de Perfil Actual"
                                class="w-full h-full object-cover" />
                        </div>
                        <!-- New Profile Image Input -->
                        <div>
                            <input type="file" @change="previewNewProfile" accept="image/*" id="profileImage"
                                class="block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-gray-700 dark:file:text-gray-300 dark:hover:file:bg-gray-600" />
                        </div>
                    </div>
                    <!-- Preview for the New Profile Image -->
                    <div v-if="newProfile"
                            class="w-20 h-20 rounded-full overflow-hidden border bg-gray-100 dark:bg-gray-700 dark:border-gray-600">
                            <img :src="newProfile" alt="Imatge de Perfil nova"
                                class="w-full h-full object-cover" />
                        </div>
                </div>
            </div>
        </form>
        <button class="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600" @click="saveProfile()">
            {{ $t("editProfile.save") }}
        </button>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useAppStore } from "@/stores/index";
import { editGeneralInfo } from "@/services/communicationManager";
import router from "@/router";


const appStore = useAppStore();

var user = ref({});
var profile = ref(null);
var banner = ref(null);
var newProfile = ref(null);
var newBanner = ref(null);

function previewNewBanner(event) {
    const file = event.target.files[0];
    if (file) {
        newBanner.value = URL.createObjectURL(file);
    }
}

function previewNewProfile(event) {
    const file = event.target.files[0];
    if (file) {
        newProfile.value = URL.createObjectURL(file);
    }
}

async function saveProfile() {
    console.log("saveProfile");
    let formData = new FormData();
    formData.append("id", user.value.id);
    formData.append("name", user.value.name);
    formData.append("city", user.value.city);

    const profileImageInput = document.querySelector('#profileImage');
    const bannerImageInput = document.querySelector('#bannerImage');
    if (profileImageInput.files[0]) {
        formData.append("profileImage", profileImageInput.files[0]);
    }
    if (bannerImageInput.files[0]) {
        formData.append("bannerImage", bannerImageInput.files[0]);
    }
    let res=await editGeneralInfo(formData, bannerImageInput.files[0], profileImageInput.files[0]);
    console.log(res);
    if(res.id!=undefined&&res.id==user.value.id){
        console.log("User updated");
        console.log(res);
        appStore.setUser(res);
        router.push({ name: "myprofile" });
    }
}

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