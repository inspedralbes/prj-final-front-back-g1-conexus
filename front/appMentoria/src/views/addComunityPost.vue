<template>
  <div class="flex flex-col min-h-screen bg-bgTheme text-textThemeColor">
    <!-- Botón de retroceso -->
    <button
      @click="goBack"
      class="py-2 px-4 fixed top-0 left-0 mt-3 ml-4 z-20 text-textThemeColor"
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M5 1H4L0 5L4 9H5V6H11C12.6569 6 14 7.34315 14 9C14 10.6569 12.6569 12 11 12H4V14H11C13.7614 14 16 11.7614 16 9C16 6.23858 13.7614 4 11 4H5V1Z"
          fill="currentColor"
        ></path>
      </svg>
    </button>
    <!-- Contenido principal -->
    <main
      class="flex-grow flex items-center justify-center pt-20 pb-20 mx-4 overflow-auto bg-bgTheme"
    >
      <div class="max-w-xl w-full bg-containersTheme p-6 rounded-lg shadow-md">
        <h1 class="text-2xl font-bold mb-4 text-center">
          {{ $t("AddComunityPost.create") }}
        </h1>

        <!-- Campo del título -->
        <div class="mb-4 bg-containersTheme text-textThemeColor">
          <label
            for="title"
            class="block text-sm font-medium text-textThemeColor"
          >
            {{ $t("AddComunityPost.title") }}:
          </label>
          <input
            id="title"
            v-model="title"
            type="text"
            :placeholder="$t('AddComunityPost.titlePlaceholder')"
            class="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-buttonColorPrimary border-buttonColorPrimary bg-containersTheme text-textThemeColor"
          />
        </div>

        <!-- Campo de descripción -->
        <div class="mb-4 bg-containersTheme text-textThemeColor">
          <label
            for="description"
            class="block text-sm font-medium text-textThemeColor mb-2"
          >
            {{ $t("AddComunityPost.description") }}
          </label>
          <textarea
            id="description"
            v-model="description"
            :placeholder="$t('AddComunityPost.descriptionPlaceholder')"
            class="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-buttonColorPrimary border-buttonColorPrimary bg-containersTheme text-textThemeColor"
            rows="4"
          ></textarea>
        </div>

        <!-- Subida de imagen -->
        <div class="mb-4">
          <label
            for="image-upload"
            class="block text-sm font-medium text-textThemeColor mb-2"
          >
            {{ $t("AddComunityPost.postImage") }}
          </label>
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            @change="handleImageUpload"
            class="block w-full text-sm text-textThemeColor file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-buttonColorPrimary file:text-textThemeColor hover:file:bg-containersTheme"
          />
        </div>

        <!-- Vista previa de la imagen -->
        <div v-if="imagePreview" class="mb-4">
          <p class="text-sm font-medium text-textThemeColor mb-2">
            {{ $t("AddComunityPost.imagePreview") }}
          </p>
          <img
            :src="imagePreview"
            alt="Vista prèvia de la imatge"
            class="w-full h-auto rounded-lg shadow-md text-textThemeColor"
          />
        </div>

        <!-- Botón de publicación -->
        <button
          type="button"
          @click="submitPost"
          class="w-full py-2 px-4 bg-bgColorPrimary text-textThemeColor font-semibold rounded-lg hover:bg-buttonColorHoverPrimary focus:outline-none focus:ring-2 focus:ring-buttonColorPrimary flex justify-center items-center"
          :disabled="isLoading"
        >
          <span v-if="!isLoading">{{ $t("AddComunityPost.publish") }}</span>
          <span v-else class="flex items-center gap-2 text-textThemeColor">
            <svg
              class="animate-spin h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              ></path>
            </svg>
            {{ $t("AddComunityPost.publishing") }}
          </span>
        </button>
      </div>
    </main>
  </div>
</template>



<script setup>
import Header from "@/components/Header.vue";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { postCommunityPublication } from "@/services/communicationsScripts/communityManager";
import { useAppStore } from "@/stores/index";

const router = useRouter();
const title = ref("");
const description = ref("");
const imageFile = ref(null);
const imagePreview = ref(null);
const user_id = useAppStore().getUser()?.id;
const isLoading = ref(false);

function goBack() {
  router.back();
}

function handleImageUpload(event) {
  const file = event.target.files[0];
  if (file) {
    imageFile.value = file;
    imagePreview.value = URL.createObjectURL(file);
  }
}

async function submitPost() {
  if (!title.value || !description.value || !imageFile.value) {
    alert($t("AddComunityPost.notAllFields"));
    return;
  }

  isLoading.value = true;
  const formData = new FormData();
  formData.append("typesPublications_id", 1);
  formData.append("title", title.value);
  formData.append("description", description.value);
  formData.append("user_id", user_id);
  formData.append("image", imageFile.value);

  try {
    const response = await postCommunityPublication(formData);
    if (!response.ok) {
      const errorData = await response.json();
      alert($t("AddComunityPost.error") + errorData.message);
      return;
    }

    const responseData = await response.json();
    console.log("resposta publicació:", responseData);
    console.log("response data message", responseData.message);
    router.push({
      path: "/",
      state: { message: responseData.message },
    });
  } catch (error) {
    console.error("Error al enviar la publicación:", error);
  } finally {
    isLoading.value = false;
  }
}
</script>

<style scoped>
</style>