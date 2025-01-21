<template>
  <div class="bg-gray-100 dark:bg-gray-900 py-12 px-6">
    <div
      class="max-w-7xl mx-auto px-6 md:px-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg text-center"
    >
      <h2
        class="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center"
      >
        Formulari d'usuari
      </h2>

      <button
        @click="toggleForm"
        class="bg-indigo-600 text-white py-2 px-4 rounded-full mb-6 hover:bg-indigo-700"
      >
        Mostrar formulari
      </button>

      <!-- Formulario Desplegable -->
      <div v-show="formVisible">
        <form
          @submit.prevent="submitForm"
          class="w-full max-w-full lg:max-w-lg mx-auto"
        >
          <!-- Nom -->
          <div class="mb-4">
            <label for="name" class="block text-gray-700 dark:text-gray-300"
              >Nom</label
            >
            <input
              type="text"
              id="name"
              v-model="form.name"
              class="w-full p-3 mt-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
              required
            />
          </div>

          <!-- Perfil foto -->
          <div class="mb-4">
            <label
              for="profile_photo"
              class="block text-gray-700 dark:text-gray-300"
              >Foto de perfil</label
            >
            <input
              type="file"
              id="profile_photo"
              @change="onFileChange($event, 'profile_photo')"
              class="w-full p-3 mt-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <!-- Banner foto -->
          <div class="mb-4">
            <label
              for="banner_photo"
              class="block text-gray-700 dark:text-gray-300"
              >Foto de portada</label
            >
            <input
              type="file"
              id="banner_photo"
              @change="onFileChange($event, 'banner_photo')"
              class="w-full p-3 mt-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <!-- Ciutat -->
          <div class="mb-4">
            <label for="city" class="block text-gray-700 dark:text-gray-300"
              >Ciutat</label
            >
            <input
              type="text"
              id="city"
              v-model="form.city"
              class="w-full p-3 mt-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <!-- Enllaços (Discord i GitHub) -->
          <div class="mb-4">
            <label
              for="discord_link"
              class="block text-gray-700 dark:text-gray-300"
              >Enllaç Discord</label
            >
            <input
              id="discord_link"
              v-model="form.discord_link"
              class="w-full p-3 mt-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <div class="mb-4">
            <label
              for="github_link"
              class="block text-gray-700 dark:text-gray-300"
              >Enllaç GitHub</label
            >
            <input
              id="github_link"
              v-model="form.github_link"
              class="w-full p-3 mt-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <!-- Etiquetes -->
          <div class="mb-4">
            <label for="tags" class="block text-gray-700 dark:text-gray-300"
              >Etiquetes (JSON)</label
            >
            <textarea
              id="tags"
              v-model="form.tags"
              class="w-full p-3 mt-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
            ></textarea>
            <small class="text-gray-500 dark:text-gray-400"
              >Exemple de format: ["JavaScript", "Python", "React"]</small
            >
          </div>

          <!-- Disponibilitat -->
          <div class="mb-4">
            <label
              for="availibility"
              class="block text-gray-700 dark:text-gray-300"
              >Disponibilitat (JSON)</label
            >
            <textarea
              id="availibility"
              v-model="form.availibility"
              class="w-full p-3 mt-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
            ></textarea>
            <small class="text-gray-500 dark:text-gray-400"
              >Exemple de format: {"monday":"9:00-12:00",
              "friday":"9:00-12:00"}</small
            >
          </div>

          <!-- Botó de Submit -->
          <div class="flex justify-center mt-6">
            <button
              type="submit"
              class="bg-indigo-600 text-white py-3 px-6 rounded-full transition-all duration-500 hover:bg-indigo-700 focus:outline-none"
            >
              Desar Usuari
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { createNewDataUser } from "@/services/communicationManager";

// Estado para el formulario
const form = ref({
  name: "",
  profile_photo: null,
  banner_photo: null,
  city: "",
  discord_link: "",
  github_link: "",
  tags: "",
  availibility: "",
});

const formVisible = ref(false); // Para mostrar/ocultar el formulario

// Función para manejar archivos
const onFileChange = (event, fieldName) => {
  const file = event.target.files[0];
  if (file) {
    form.value[fieldName] = file;
  }
};

// Función para mostrar/ocultar el formulario
const toggleForm = () => {
  formVisible.value = !formVisible.value;
};

// Función para manejar el envío del formulario
const submitForm = async () => {
  try {
    const userData = { ...form.value };
    // Validar y convertir JSON
    if (userData.tags) userData.tags = JSON.parse(userData.tags);
    if (userData.availibility)
      userData.availibility = JSON.parse(userData.availibility);

    const response = await createNewDataUser(userData);

    if (response.error) {
      alert(`Error: ${response.error}`);
    } else {
      alert("Usuari creat correctament");
      form.value = {
        name: "",
        profile_photo: null,
        banner_photo: null,
        city: "",
        discord_link: "",
        github_link: "",
        tags: "",
        availibility: "",
      };
      formVisible.value = false;
    }
  } catch (error) {
    alert("Error en el format JSON.");
  }
};
</script>