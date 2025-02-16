<template>
  <div class="bg-bgTheme p-6 rounded-xl shadow-lg shadow-black/30 my-4">
    <h2
      class="text-2xl font-semibold border-b border-bgColorPrimary pb-4 mb-4 text-textThemeColor"
    >
      {{ $t("editProfile.title") }}
    </h2>
    <form
      enctype="multipart/form-data"
      class="border-b border-bgColorPrimary pb-4 mb-4"
    >
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            for="profileName"
            class="block font-medium text-textThemeColor"
            >{{ $t("editProfile.fullName") }}</label
          >
          <input
            v-model="user.name"
            type="text"
            id="profileName"
            required
            class="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-buttonColorPrimary border-buttonColorPrimary bg-containersTheme text-textThemeColor"
          />
        </div>
        <div>
          <label
            for="profileCity"
            class="block font-medium text-textThemeColor"
            >{{ $t("editProfile.city") }}</label
          >
          <input
            v-model="user.city"
            type="text"
            id="profileCity"
            required
            class="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-buttonColorPrimary border-buttonColorPrimary bg-containersTheme text-textThemeColor"
          />
        </div>
        <!-- Banner Section -->
        <div class="col-span-1 md:col-span-2">
          <label class="block font-medium text-textThemeColor">{{
            $t("editProfile.bannerimg")
          }}</label>
          <div class="flex items-center space-x-4 mt-2">
            <!-- Current Banner Preview -->
            <div
              class="w-32 h-20 bg-textThemeColor rounded-lg overflow-hidden border"
            >
              <img
                :src="banner"
                alt="Banner Actual"
                class="w-full h-full object-cover"
              />
            </div>
            <!-- New Banner Input -->
            <div>
              <input
                type="file"
                @change="previewNewBanner"
                accept="image/*"
                id="bannerImage"
                class="block w-full text-sm text-textThemeColor file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-buttonColorPrimary file:text-textThemeColor hover:file:bg-containersTheme"
              />
            </div>
          </div>
          <!-- Preview for the New Banner -->
          <div
            v-if="newBanner"
            class="mt-2 w-32 h-20 bg-bgColorPrimary dark:bg-gray-700 rounded-lg overflow-hidden border dark:border-gray-600"
          >
            <img
              :src="newBanner"
              alt="Nova Imatge de Banner"
              class="w-full h-full object-cover"
            />
          </div>
        </div>
        <!-- Profile Image Section -->
        <div class="col-span-1 md:col-span-2">
          <label class="block font-medium">{{
            $t("editProfile.profileimg")
          }}</label>
          <div class="flex items-center space-x-4 mt-2">
            <!-- Current Profile Image Preview -->
            <div
              class="w-20 h-20 rounded-full overflow-hidden border bg-gray-100 dark:bg-gray-700 dark:border-gray-600"
            >
              <img
                :src="profile"
                alt="Imatge de Perfil Actual"
                class="w-full h-full object-cover"
              />
            </div>
            <!-- New Profile Image Input -->
            <div>
              <input
                type="file"
                @change="previewNewProfile"
                accept="image/*"
                id="profileImage"
                class="block w-full text-sm text-textThemeColor file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-buttonColorPrimary file:text-textThemeColor hover:file:bg-containersTheme"
              />
            </div>
          </div>
          <!-- Preview for the New Profile Image -->
          <div
            v-if="newProfile"
            class="w-20 h-20 rounded-full overflow-hidden border-bgColorPrimary bg-bgColorPrimary"
          >
            <img
              :src="newProfile"
              alt="Imatge de Perfil nova"
              class="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </form>
    <button
      class="bg-buttonColorPrimary text-textThemeColor py-2 px-4 rounded-lg hover:bg-blue-600"
      @click="saveProfile()"
    >
      {{ $t("editProfile.save") }}
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useAppStore } from "@/stores/index";
import { editGeneralInfo } from "@/services/communicationsScripts/mainManager.js";
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

  const profileImageInput = document.querySelector("#profileImage");
  const bannerImageInput = document.querySelector("#bannerImage");
  if (profileImageInput.files[0]) {
    formData.append("profileImage", profileImageInput.files[0]);
  }
  if (bannerImageInput.files[0]) {
    formData.append("bannerImage", bannerImageInput.files[0]);
  }
  let res = await editGeneralInfo(
    formData,
    bannerImageInput.files[0],
    profileImageInput.files[0]
  );
  console.log(res);
  if (res.id != undefined && res.id == user.value.id) {
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