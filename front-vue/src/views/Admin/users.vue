<template>
  <div v-if="loading" class="text-center py-4">
      <p>Cargando usuarios...</p>
  </div>
  
  <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
      <strong class="font-bold">Error:</strong>
      <span class="block sm:inline">{{ error }}</span>
  </div>

  <div v-else-if="users.length === 0" class="text-center py-4">
      <p>No hay usuarios para mostrar</p>
  </div>

  <div v-else>
      <div v-for="user in users" :key="user.id" class="bg-white shadow-md rounded-lg p-4 mb-4 animate-fade-in">
          <img :src="user.profile" alt="Imatge de l'usuari" class="w-30 h-30 rounded-full mb-4 mx-auto">
          <h2 class="text-xl font-bold mb-2">{{ user.name }}</h2>
          <p class="text-gray-700 mb-2">Email: {{ user.email }}</p>
          <p class="text-gray-700 mb-2">Rol: {{ getRoleName(user.typesUsers_id) }}</p>
          <p class="text-gray-700 mb-2">Fecha de creación: {{ formatDate(user.created_at) }}</p>
          <button @click="handleDeleteUser(user.id)" class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Eliminar</button>
          <button @click="handleUpdateUser(user.id)" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Modificar rol</button>
      </div>
  </div>

  <!-- Modal para editar rol -->
  <div v-if="showModal" class="fixed inset-0 flex items-center justify-center z-50">
      <div class="fixed inset-0 bg-black opacity-50" @click="closeModal"></div>
      <div class="bg-white p-6 rounded-lg shadow-lg z-10 w-full max-w-md">
          <h2 class="text-xl font-bold mb-4">Cambiar rol de usuario</h2>
          
          <div v-if="modalError" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
              {{ modalError }}
          </div>
          
          <div v-if="modalSuccess" class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
              {{ modalSuccess }}
          </div>
          
          <div class="mb-4">
              <p class="mb-2"><strong>Usuario:</strong> {{ selectedUser?.name }}</p>
              <p class="mb-2"><strong>Rol actual:</strong> {{ selectedUser ? getRoleName(selectedUser.typesUsers_id) : '' }}</p>
              
              <div class="mt-4">
                  <label class="block text-gray-700 mb-2">Nuevo rol:</label>
                  <select 
                      v-model="newRoleId" 
                      class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  >
                      <option v-for="type in typeUsers" :key="type.id" :value="type.id">
                          {{ type.name }}
                      </option>
                  </select>
              </div>
          </div>
          
          <div class="flex justify-end space-x-2">
              <button 
                  @click="closeModal" 
                  class="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
              >
                  Cancelar
              </button>
              <button 
                  @click="saveRoleChange" 
                  class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  :disabled="updating"
              >
                  {{ updating ? 'Guardando...' : 'Guardar cambios' }}
              </button>
          </div>
      </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getAllUsers, deleteUser, updateUserRole, getAllTypeUsers } from '@/services/communicationsScripts/mainManager.js';

const users = ref([]);
const typeUsers = ref([]);
const loading = ref(true);
const error = ref(null);
const baseURL = import.meta.env.VITE_BACKEND_URL;

// Variables para el modal
const showModal = ref(false);
const selectedUser = ref(null);
const newRoleId = ref(null);
const modalError = ref(null);
const modalSuccess = ref(null);
const updating = ref(false);

const getRoleName = (roleId) => {
const typeUser = typeUsers.value.find(type => type.id === roleId);

if (typeUser) {
  return typeUser.name;
}

const roleNames = {
  1: 'Estudiante',
  2: 'Profesor',
  3: 'Jefe de Departamento',
  4: 'Dirección',
  5: 'Administrador'
};

return roleNames[roleId] || `Rol ${roleId}`;
};

// Función para formatear fechas
const formatDate = (dateString) => {
if (!dateString) return 'N/A';
const date = new Date(dateString);
return date.toLocaleDateString('es-ES', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric'
});
};

const fetchTypeUsers = async () => {
try {
  const response = await getAllTypeUsers();
  
  if (response.error) {
    console.error('Error al obtener tipos de usuarios:', response.error);
    return false;
  }
  
  typeUsers.value = response;
  return true;
} catch (err) {
  console.error('Error fetching type users:', err);
  return false;
}
};

const fetchUsers = async () => {
loading.value = true;
error.value = null;

try {
  await fetchTypeUsers();
  
  const response = await getAllUsers();
  
  if (response.error) {
    error.value = response.error;
    console.error('Error en la respuesta:', response.error);
  } else {
    users.value = response;
  }
} catch (err) {
  error.value = 'Error al cargar los usuarios: ' + err.message;
  console.error('Error fetching users:', err);
} finally {
  loading.value = false;
}
};

const handleDeleteUser = async (userId) => {
if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
  try {
    const response = await deleteUser(userId);
    
    if (response.error) {
      error.value = response.error;
      console.error('Error al eliminar el usuario:', response.error);
    } else {
      // Filtrar el usuario eliminado de la lista
      users.value = users.value.filter(user => user.id !== userId);
    }
  } catch (err) {
    error.value = 'Error al eliminar el usuario: ' + err.message;
    console.error('Error deleting user:', err);
  }
}
};

const handleUpdateUser = (userId) => {
selectedUser.value = users.value.find(user => user.id === userId);
if (selectedUser.value) {
  newRoleId.value = selectedUser.value.typesUsers_id;
  modalError.value = null;
  modalSuccess.value = null;
  showModal.value = true;
}
};

const closeModal = () => {
showModal.value = false;
selectedUser.value = null;
newRoleId.value = null;
modalError.value = null;
modalSuccess.value = null;
};

const saveRoleChange = async () => {
if (!selectedUser.value || !newRoleId.value) {
  modalError.value = "Por favor, selecciona un rol válido";
  return;
}

if (newRoleId.value === selectedUser.value.typesUsers_id) {
  modalError.value = "El rol seleccionado es el mismo que el actual";
  return;
}

updating.value = true;
modalError.value = null;
modalSuccess.value = null;

try {
  const response = await updateUserRole(selectedUser.value.id, newRoleId.value);
  
  if (response.error) {
    modalError.value = `Error: ${response.error}`;
    console.error('Error al actualizar el rol:', response.error);
  } else {
    // Actualizar el rol en la lista de usuarios
    const userIndex = users.value.findIndex(user => user.id === selectedUser.value.id);
    if (userIndex !== -1) {
      users.value[userIndex].typesUsers_id = newRoleId.value;
    }
    
    modalSuccess.value = "¡Rol actualizado correctamente!";
    
    // Cerrar el modal después de 2 segundos
    setTimeout(() => {
      closeModal();
    }, 2000);
  }
} catch (err) {
  modalError.value = `Error: ${err.message}`;
  console.error('Error saving role change:', err);
} finally {
  updating.value = false;
}
};

onMounted(() => {
fetchUsers();
});
</script>

<style scoped>
.animate-fade-in {
animation: fadeIn 0.5s ease forwards;
}

@keyframes fadeIn {
from { opacity: 0; transform: translateY(10px); }
to { opacity: 1; transform: translateY(0); }
}
</style>