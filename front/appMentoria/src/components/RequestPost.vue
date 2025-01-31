<template>
  <div
    class="bg-gray-100 min-h-screen flex items-center justify-center p-6 sm:p-8 dark:bg-neutral-900 dark:text-white"
  >
    <div
      class="max-w-md w-full bg-white dark:bg-neutral-800 p-6 sm:p-8 rounded-lg shadow-md my-20 mb-20"
    >
      <form>
        <!-- Título y descripción -->
        <div class="mb-6">
          <label
            class="block text-gray-700 text-sm font-bold mb-2 dark:text-gray-300"
            for="title"
          >
           {{ $t("requestPost.title") }}
          </label>
          <textarea
            id="title"
            name="postContent"
            rows="1"
            v-model="title"
            class="w-full border rounded-md leading-5 transition duration-150 ease-in-out sm:text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-300 dark:border-gray-700 dark:bg-neutral-900 dark:text-white"
            :placeholder="$t('requestPost.titlePlaceholder')"
          ></textarea>
          <textarea
            id="des"
            name="postContent"
            rows="4"
            v-model="description"
            class="w-full mt-4 border rounded-md leading-5 transition duration-150 ease-in-out sm:text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-300 dark:border-gray-700 dark:bg-neutral-900 dark:text-white"
            :placeholder="$t('requestPost.DescriptionPlaceholder')"
          ></textarea>
        </div>

        <!-- Subida de imagen -->
        <div class="mb-6">
          <label
            for="image-upload"
            class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            {{ $t("requestPost.uploadImage") }}
          </label>
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            @change="handleImageUpload"
            class="block w-full text-sm text-gray-500 dark:text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-neutral-700 dark:file:text-blue-300 dark:hover:file:bg-neutral-600"
          />
        </div>

        <!-- Disponibilidad -->
        <div class="mb-6">
          <label
            for="availability"
            class="block text-gray-700 text-sm font-bold mb-2 dark:text-gray-300"
          >
          {{ $t("requestPost.availability") }}
      
          </label>
          <button
            class="p-2 bg-blue-100 rounded-md mb-4 w-full sm:w-auto dark:bg-blue-700 dark:text-white dark:hover:bg-blue-800"
            type="button"
            @click="addAvailability"
          >
          {{ $t("requestPost.addAvailability") }}
          </button>
          <div
            v-for="(availability, index) in availabilities"
            :key="index"
            class="availability-group flex flex-wrap items-center gap-2 mb-4"
          >
            <select
              v-model="availability.day"
              class="border rounded-md p-2 text-sm w-full sm:w-auto dark:border-gray-700 dark:bg-neutral-900 dark:text-white"
            >
              <option disabled value="">
              {{ $t("requestPost.selectDay") }}</option>
              <option v-for="day in week" :key="day" :value="day">
                {{ day }}
              </option>
            </select>
            <select
              v-model="availability.startTime"
              @change="validateTimes(index)"
              class="border rounded-md p-2 text-sm w-full sm:w-auto dark:border-gray-700 dark:bg-neutral-900 dark:text-white"
            >
              <option disabled value="">
              {{ $t("requestPost.startTime") }}</option>
              <option
                v-for="hour in filteredHours(index, 'start')"
                :key="hour"
                :value="hour"
              >
                {{ hour }}
              </option>
            </select>
            <select
              v-model="availability.endTime"
              @change="validateTimes(index)"
              class="border rounded-md p-2 text-sm w-full sm:w-auto dark:border-gray-700 dark:bg-neutral-900 dark:text-white justify-between"
            >
              <option disabled value="">{{$t("requestPost.endTime")}}</option>
              <option
                v-for="hour in filteredHours(index, 'end')"
                :key="hour"
                :value="hour"
              >
                {{ hour }}
              </option>
            </select>
            <button
              type="button"
              @click="removeAvailability(index)"
              class="bg-red-500 hover:bg-red-600 text-white p-2 rounded-md dark:bg-red-700 dark:hover:bg-red-800 mb-4 sm:w-auto w-full flex justify-center items-center"
            >
              <svg
                width="19"
                height="19"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9.1709 4C9.58273 2.83481 10.694 2 12.0002 2C13.3064 2 14.4177 2.83481 14.8295 4"
                  stroke="#ffffff"
                  stroke-width="1.5"
                  stroke-linecap="round"
                />
                <path
                  d="M20.5001 6H3.5"
                  stroke="#ffffff"
                  stroke-width="1.5"
                  stroke-linecap="round"
                />
                <path
                  d="M18.8332 8.5L18.3732 15.3991C18.1962 18.054 18.1077 19.3815 17.2427 20.1907C16.3777 21 15.0473 21 12.3865 21H11.6132C8.95235 21 7.62195 21 6.75694 20.1907C5.89194 19.3815 5.80344 18.054 5.62644 15.3991L5.1665 8.5"
                  stroke="#ffffff"
                  stroke-width="1.5"
                  stroke-linecap="round"
                />
                <path
                  d="M9.5 11L10 16"
                  stroke="#ffffff"
                  stroke-width="1.5"
                  stroke-linecap="round"
                />
                <path
                  d="M14.5 11L14 16"
                  stroke="#ffffff"
                  stroke-width="1.5"
                  stroke-linecap="round"
                />
              </svg>
            </button>
          </div>
        </div>

        <!-- Botón de envío -->
        <div class="flex items-center justify-between">
          <button
            type="button"
            @click="submitPostPeticio"
            class="w-full py-2 px-4 bg-blue-500 dark:bg-blue-700 text-white font-semibold rounded-lg hover:bg-blue-600 dark:hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-300 flex justify-center items-center"
            :disabled="isLoading"
          >
            <span v-if="!isLoading">Publicar</span>
            <span v-else class="flex items-center gap-2">
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
              {{ $t("requestPost.publishing") }}
          
            </span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>



<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { postEmploymentExchangePublication } from "@/services/communicationManager";
import { useAppStore } from "@/stores/index";
import NavBar from "./NavBar.vue";
const router = useRouter();
const title = ref("");
const description = ref("");
const imageFile = ref(null);
const availabilities = ref([]);
const isLoading = ref(false);
const user_id = useAppStore().getUser()?.id;

const hours = ref([
  "00:00",
  "01:00",
  "02:00",
  "03:00",
  "04:00",
  "05:00",
  "06:00",
  "07:00",
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
  "21:00",
  "22:00",
  "23:00",
]);
const week = ref([
  "Dilluns",
  "Dimarts",
  "Dimecres",
  "Dijous",
  "Divendres",
  "Dissabte",
  "Diumenge",
]);

const addAvailability = () => {
  availabilities.value.push({ day: "", startTime: "", endTime: "" });
};

const removeAvailability = (index) => {
  availabilities.value.splice(index, 1);
};

function handleImageUpload(event) {
  const file = event.target.files[0];
  if (file) {
    imageFile.value = file;
  }
}

const validateTimes = (index) => {
  const availability = availabilities.value[index];
  if (
    availability.startTime &&
    availability.endTime &&
    availability.startTime >= availability.endTime
  ) {
    alert("La hora de finalización debe ser posterior a la hora de inicio.");
    availability.endTime = "";
  }
};

const filteredHours = (index, type) => {
  const availability = availabilities.value[index];
  const selectedHours = availabilities.value
    .flatMap((a) => [a.startTime, a.endTime])
    .filter(Boolean);
  if (type === "start") {
    return hours.value.filter(
      (hour) => !selectedHours.includes(hour) || hour === availability.startTime
    );
  } else {
    return hours.value.filter(
      (hour) =>
        hour > availability.startTime &&
        (!selectedHours.includes(hour) || hour === availability.endTime)
    );
  }
};

async function submitPostPeticio() {
  if (!user_id || !title.value || !description.value) {
    alert("Por favor, completa todos los campos");
    return;
  }
  isLoading.value = true; // Activar indicador de carga

  const formData = new FormData();
  formData.append("typesPublications_id", 2);
  formData.append("title", title.value);
  formData.append("description", description.value);
  formData.append("availability", JSON.stringify(availabilities.value));
  formData.append("user_id", user_id);
  formData.append("image", imageFile.value);

  try {
    const response = await postEmploymentExchangePublication(formData);

    if (!response.ok) {
      const errorData = await response.json(); // Manejo del error del servidor
      alert(
        "Error al crear la publicación: " + (errorData.message || "Desconocido")
      );
      return;
    }

    const responseData = await response.json();
    router.push("/requests"); // Redirigir después de completar
  } catch (error) {
    alert("Error al enviar la publicación: " + error.message);
  } finally {
    isLoading.value = false; // Asegurarse de desactivar el indicador de carga
  }
}

function goBack() {
  router.back();
}

// const submitForm = async () => {
//   const formData = {
//     typesPublications_id: 2,
//     title: document.getElementById("title").value,
//     description: document.getElementById("des").value,
//     availabilities: availabilities.value,
//     user_id: "",
//   };
// };
</script>

<style scoped>
.create-post {
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 10px;
  background-color: #fff;
}

.form-group {
  margin-bottom: 15px;
}

textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #737272;
  border-radius: 5px;
  resize: none;
}
</style>