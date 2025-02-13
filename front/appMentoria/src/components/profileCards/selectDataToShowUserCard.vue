<template>
  <div v-if="selectedDesignFront && selectedDesignBack && selectedColor">
    <h2 class="text-xl font-bold mb-4">Seleccionar Datos para Mostrar</h2>

    <ul class="bg-white shadow-md rounded-lg p-4 space-y-2">
      <li
        v-for="(field, index) in availableFields"
        :key="index"
        @click="selectField(field)"
        draggable="true"
        @dragstart="dragStart($event, field)"
        :class="[
          isSelected(field.key)
            ? 'bg-blue-500 text-white'
            : 'bg-gray-100 hover:bg-gray-200',
        ]"
        class="p-3 rounded-lg cursor-pointer"
      >
        <template v-if="field.key === 'profile'">
          <img
            :src="field.label"
            alt="Profile Image"
            class="w-10 h-10 rounded-full"
          />
        </template>
        <template v-else>
          {{ field.label }}
        </template>
      </li>
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
  { key: "phone", label: user.value.phone },
  { key: "city", label: user.value.city },
]);

const availableFields = ref([...userFields.value]);
const droppedFields = ref([]);

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

const isSelected = (key) => {
  return droppedFields.value.some((f) => f.key === key);
};
</script>