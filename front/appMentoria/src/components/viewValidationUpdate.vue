<template>
  <div
    class="container mx-auto p-3 sm:p-4 bg-white bg-gray-100 dark:bg-gray-700 shadow-lg rounded-lg max-w-screen-xl"
  >
    <h1 class="text-2xl font-bold mb-5 text-gray-800 dark:text-gray-100">
      Validar Update Usuaris
    </h1>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div
        v-for="user in users"
        :key="user.id"
        :class="[
          'bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-300 rounded-lg p-5 mb-6 shadow-md',
          { 'dark:shadow-white': true },
        ]"
        :style="{
          boxShadow:
            '0 4px 6px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(255, 255, 255, 0.3)',
        }"
      >
        <div class="flex flex-wrap justify-between mb-4">
          <div class="w-full md:w-1/2 mb-4">
            <p class="text-lg font-semibold text-gray-800 dark:text-gray-300">
              User Nº: {{ user.id }}
            </p>
          </div>
          <div class="w-full md:w-1/2 mb-4 md:mb-0">
            <p class="text-base font-semibold text-gray-900 dark:text-gray-300">
              Tipus de usuari:
            </p>
            <select
              v-model="user.typesUsers_id"
              :class="[
                user.typesUsers_id === 1 ? 'class-for-type-1' : '',
                user.typesUsers_id === 2 ? 'class-for-type-2' : '',
                user.typesUsers_id === 3 ? 'class-for-type-3' : '',
                'appearance-none bg-gray-100 dark:bg-gray-600 dark:text-gray-800 border border-gray-300 dark:border-gray-600 dark:bg-white text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 p-2 w-full md:w-32 shadow-sm',
              ]"
            >
              <option value="1">Estudiant</option>
              <option value="2">Professor</option>
              <option value="3">Administrador</option>
            </select>
          </div>
        </div>
        <div class="mb-5">
          <p class="text-sm font-semibold text-gray-700 dark:text-gray-100">
            Clase:
          </p>
          <p class="text-base text-gray-800 dark:text-gray-200">
            {{ getClassById(user.class_id) }}
          </p>
        </div>

        <div class="mb-5">
          <p class="text-sm font-semibold text-gray-700 dark:text-gray-100">
            Usuari:
          </p>
          <p class="text-base text-gray-800 dark:text-gray-200">
            {{ user.name }}
          </p>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            {{ user.email }}
          </p>
        </div>

        <div class="mb-5">
          <div class="mb-5"></div>
          <p class="text-sm font-semibold text-gray-700 dark:text-gray-100">
            Banner:
          </p>
          <img
            :src="user.banner"
            alt="User Banner"
            class="w-full h-32 object-cover rounded-md"
          />
        </div>
        <div class="mb-5">
          <p class="text-sm font-semibold text-gray-700 dark:text-gray-100">
            Profile:
          </p>
          <img
            :src="user.profile"
            alt="User Profile"
            class="w-16 h-16 object-cover rounded-full"
          />
        </div>
        <div class="flex justify-end">
          <button
            @click="
              validateUser(
                user.user ? user.user_id : user.id,
                user.typesUsers_id
              )
            "
            class="bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600 mr-2"
          >
            Validar
          </button>
          <button
            @click="deleteUser(user.user ? user.user_id : user.id)"
            class="bg-red-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-red-600"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  fetchUserValidation,
  deleteUserValidation,
  fetchAllClasses,
} from "@/services/communicationManager";

export default {
  data() {
    return {
      users: [],
      classes: [],
      loading: true,
    };
  },
  async mounted() {
    try {
      const BACK_URL = import.meta.env.VITE_URL_BACK;

      const data = await fetchUserValidation();
      data.forEach((user) => {
        if (user.banner.startsWith("/")) {
          user.banner = BACK_URL + user.banner;
        }
      });
      if (data.error) {
        console.error(data.error);
      } else {
        this.users = data;
      }
      const data2 = await fetchAllClasses();
      if (data2.error) {
        console.error(data2.error);
      } else {
        this.classes = data2;
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      this.loading = false;
    }
  },
  methods: {
    async validateUser(id, typesUsers_id) {
      try {
        //const response = await this.validateUser(id, typesUsers_id);
        if (response.error) {
          console.error(response.error);
        } else {
        }
      } catch (error) {
        console.error("Error al actualitzar l'estat:", error);
      }
    },

    async deleteUser(id) {
      try {
        const response = await deleteUserValidation(id);
        if (response.error) {
          console.error(response.error);
        } else {
          this.users = this.users.filter((user) => user.id !== id);
        }
      } catch (error) {
        console.error("Error al eliminar el usuari:", error);
      }
    },
    getClassById(classId) {
      const userClass = this.classes.find((cls) => cls.id === classId);
      return userClass ? userClass.name : "Unknown";
    },
  },
};
</script>
