<template>
  <div v-if="selectedDesignFront && selectedDesignBack && selectedColor">
    <h2 class="text-xl font-bold mb-4">Seleccionar Datos para Mostrar</h2>

    <ul class="bg-white shadow-md rounded-lg p-4 space-y-2">
      <li
        v-for="(field, index) in availableFields.filter((f) => f && f.key)"
        :key="index"
        @click="selectField(field)"
        draggable="true"
        @dragstart="dragStart($event, field)"
        @touchstart="touchStart($event, field)"
        class="flex p-3 rounded-lg cursor-pointer bg-slate-300 hover:bg-gray-400 justify-end items-end"
      >
        <template v-if="field.key === 'name'">
          <div class="flex flex-row items-end gap-2">
            <span>{{ field.label }}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="size-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
              />
            </svg>
          </div>
        </template>

        <template v-else-if="field.key === 'email'">
          <div class="flex flex-row items-end gap-2">
            <span>{{ field.label }}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="size-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
              />
            </svg>
          </div>
        </template>
        <template v-else-if="field.key === 'profile'">
          <div class="flex flex-row items-end gap-2">
            <h3>Foto perfil</h3>
            <img
              :src="field.label"
              alt="Profile Image"
              class="w-10 h-10 rounded-full"
            />
          </div>
        </template>
        <template v-else-if="field.key === 'city'">
          <div class="flex flex-row items-end gap-2">
            <span>{{ field.label }}</span>
            <svg
              class="w-6 h-6 text-gray-800 dark:text-white"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
              />
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17.8 13.938h-.011a7 7 0 1 0-11.464.144h-.016l.14.171c.1.127.2.251.3.371L12 21l5.13-6.248c.194-.209.374-.429.54-.659l.13-.155Z"
              />
            </svg>
          </div>
        </template>

        <template
          v-else-if="
            field.key === 'github' ||
            field.key === 'linkedin' ||
            field.key === 'instagram'
          "
        >
          <div v-if="field.key === 'github' && field.label">
            <div class="flex flex-row items-end gap-2">
              <h3>github</h3>
              <a :href="field.label" target="_blank" rel="noopener noreferrer">
                <svg
                  class="w-6 h-6 text-gray-800 dark:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill-rule="evenodd"
                    d="M12.006 2a9.847 9.847 0 0 0-6.484 2.44 10.32 10.32 0 0 0-3.393 6.17 10.48 10.48 0 0 0 1.317 6.955 10.045 10.045 0 0 0 5.4 4.418c.504.095.683-.223.683-.494 0-.245-.01-1.052-.014-1.908-2.78.62-3.366-1.21-3.366-1.21a2.711 2.711 0 0 0-1.11-1.5c-.907-.637.07-.621.07-.621.317.044.62.163.885.346.266.183.487.426.647.71.135.253.318.476.538.655a2.079 2.079 0 0 0 2.37.196c.045-.52.27-1.006.635-1.37-2.219-.259-4.554-1.138-4.554-5.07a4.022 4.022 0 0 1 1.031-2.75 3.77 3.77 0 0 1 .096-2.713s.839-.275 2.749 1.05a9.26 9.26 0 0 1 5.004 0c1.906-1.325 2.74-1.05 2.74-1.05.37.858.406 1.828.101 2.713a4.017 4.017 0 0 1 1.029 2.75c0 3.939-2.339 4.805-4.564 5.058a2.471 2.471 0 0 1 .679 1.897c0 1.372-.012 2.477-.012 2.814 0 .272.18.592.687.492a10.05 10.05 0 0 0 5.388-4.421 10.473 10.473 0 0 0 1.313-6.948 10.32 10.32 0 0 0-3.39-6.165A9.847 9.847 0 0 0 12.007 2Z"
                    clip-rule="evenodd"
                  />
                </svg>
              </a>
            </div>
          </div>
          <div v-if="field.key === 'linkedin' && field.label">
            <div class="flex flex-row items-end gap-2">
              <h3>linkedin</h3>
              <a :href="field.label" target="_blank" rel="noopener noreferrer">
                <svg
                  class="w-6 h-6 text-gray-800 dark:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill-rule="evenodd"
                    d="M12.51 8.796v1.697a3.738 3.738 0 0 1 3.288-1.684c3.455 0 4.202 2.16 4.202 4.97V19.5h-3.2v-5.072c0-1.21-.244-2.766-2.128-2.766-1.827 0-2.139 1.317-2.139 2.676V19.5h-3.19V8.796h3.168ZM7.2 6.106a1.61 1.61 0 0 1-.988 1.483 1.595 1.595 0 0 1-1.743-.348A1.607 1.607 0 0 1 5.6 4.5a1.601 1.601 0 0 1 1.6 1.606Z"
                    clip-rule="evenodd"
                  />
                  <path d="M7.2 8.809H4V19.5h3.2V8.809Z" />
                </svg>
              </a>
            </div>
          </div>
          <div v-if="field.key === 'instagram' && field.label">
            <div class="flex flex-row items-end gap-2">
              <h3>Instagram</h3>
              <a :href="field.label" target="_blank" rel="noopener noreferrer">
                <svg
                  class="w-6 h-6 text-gray-800 dark:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    fill-rule="evenodd"
                    d="M3 8a5 5 0 0 1 5-5h8a5 5 0 0 1 5 5v8a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V8Zm5-3a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3H8Zm7.597 2.214a1 1 0 0 1 1-1h.01a1 1 0 1 1 0 2h-.01a1 1 0 0 1-1-1ZM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm-5 3a5 5 0 1 1 10 0 5 5 0 0 1-10 0Z"
                    clip-rule="evenodd"
                  />
                </svg>
              </a>
            </div>
          </div>
        </template>

        <template v-else>
          {{ field.label }}
        </template>
      </li>

      <!-- Contenedor de tags -->
      <div class="flex flex-col items-end bg-gray-50 p-4 rounded-lg gap-4">
        <div class="flex flex-inline gap-2">
          <h3 class="font-semibold mb-2">Software Skills</h3>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="size-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5"
            />
          </svg>
        </div>
        <ul class="flex flex-row items-end gap-2">
          <li
            v-for="(skill, index) in user.softwareSkills"
            :key="index"
            @click="selectField({ key: `skill-${index}`, label: skill })"
            draggable="true"
            @dragstart="
              dragStart($event, { key: `skill-${index}`, label: skill })
            "
            :class="[
              isSelected(`skill-${index}`)
                ? 'bg-blue-500 text-white'
                : 'bg-slate-300 hover:bg-gray-400',
            ]"
            class="p-2 rounded-lg cursor-pointer"
          >
            {{ skill }}
          </li>
        </ul>
      </div>
    </ul>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useAppStore } from "@/stores/index";

const appStore = useAppStore();
const user = computed(() => appStore.user);

const props = defineProps({
  selectedDesignFront: Number,
  selectedDesignBack: Number,
  selectedColor: Object,
});

const emit = defineEmits(["updateUserFields"]);

const userFields = ref([
  { key: "name", label: user.value.name },
  { key: "email", label: user.value.email },
  { key: "profile", label: user.value.profile },
  // { key: "phone", label: user.value.phone },
  { key: "github", label: user.value.Github },
  { key: "linkedin", label: user.value.Linkedin },
  { key: "instagram", label: user.value.Instagram },
  { key: "city", label: user.value.city },
]);

const availableFields = ref([...userFields.value]);
const droppedFields = ref([]);

console.log("availableFields", availableFields);

// Marcar elemento como seleccionado
const selectField = (field) => {
  if (!droppedFields.value.find((f) => f.key === field.key)) {
    droppedFields.value.push(field);
    emit("updateUserFields", droppedFields.value);
  }
};

// Iniciar el arrastre
const dragStart = (event, field) => {
  event.dataTransfer.setData("field", JSON.stringify(field));
};

//iniciar arrastre en mvl

const touchStart = (event, field) => {
  const touch = event.touches[0];
  if (touch) {
    event.target.dataset.dragData = JSON.stringify(field);
  }
};

const isSelected = (key) => {
  return droppedFields.value.some((f) => f.key === key);
};
</script>

