<template>
  <div v-if="loading" class="text-center py-4">
      <p>Cargando usuarios...</p>
  </div>
  
  <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
      <strong class="font-bold">Error:</strong>
      <span class="block sm:inline">{{ error }}</span>
  </div>

  <div v-else>
    <div class="mb-4">
        <button @click="handleCreateUser" class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
            Crear nuevo usuario
        </button>
    </div>
  </div>
  
  <div v-if="showCreateModal" class="fixed inset-0 flex items-center justify-center z-50">
      <div class="fixed inset-0 bg-black opacity-50" @click="closeCreateModal"></div>
      <div class="bg-white p-6 rounded-lg shadow-lg z-10 w-full max-w-md">
          <h2>
              Crear nuevo usuario
          </h2>
          <div v-if="createModalError" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
              {{ createModalError }}
          </div>
          <div v-if="createModalSuccess" class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
              {{ createModalSuccess }}
          </div>

          <form @submit.prevent="saveNewUser">
              <div class="mb-4">
                  <label class="block text-gray-700 mb-2">Nombre:</label>
                  <input 
                      v-model="newUser.name" 
                      type="text" 
                      class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-gray-900"
                      required
                  >
              </div>
              <div class="mb-4">
                  <label class="block text-gray-700 mb-2">Email:</label>
                  <input 
                      v-model="newUser.email" 
                      type="email" 
                      class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-gray-900"
                      required
                  >
              </div>
              <div class="mb-4">
                  <label class="block text-gray-700 mb-2">Contraseña:</label>
                  <input 
                      v-model="newUser.password" 
                      type="password" 
                      class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-gray-900"
                      required
                  >
              </div>
              <div class="mb-4">
                  <label class="block text-gray-700 mb-2">Rol:</label>
                  <select 
                      v-model="newUser.typeUsers_id" 
                      class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-gray-900"
                      required
                  >
                      <option v-for="type in typeUsers" :key="type.id" :value="type.id">
                          {{ type.name }}
                      </option>
                  </select>
              </div>
              <div class="mb-4">
                <label class="block text-gray-700 mb-2">Imagen de perfil:</label>
                <input 
                    type="file" 
                    @change="handleFileUpload" 
                    accept="image/*"
                    class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-gray-900"
                >
                <p v-if="selectedFileName" class="mt-1 text-sm text-gray-500">
                    Archivo seleccionado: {{ selectedFileName }}
                </p>
            </div>
              <button type="submit" :disabled="creating" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                  {{ creating ? 'Creando...' : 'Crear usuario' }}
              </button>
              <button @click="closeCreateModal" class="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 ml-2">
                  Cancelar
              </button>

          </form>
      </div>
  </div>

  <div v-if="users.length === 0" class="text-center py-4">
      <p>No hay usuarios para mostrar</p>
  </div>

  <div v-else>
      <div v-for="user in users" :key="user.id" class="bg-white shadow-md rounded-lg p-4 mb-4 animate-fade-in">
          <!-- <img :src="user.profile" alt="Imatge de l'usuari" class="w-30 h-30 rounded-full mb-4 mx-auto"> -->
          <img :src="`${baseURL}${user.profile}`" alt="">
          <h2 class="text-xl font-bold mb-2">{{ user.name }}</h2>
          <p class="text-gray-700 mb-2">Email: {{ user.email }}</p>
          <p class="text-gray-700 mb-2">Rol: {{ getRoleName(user.typeUsers_id) }}</p>
          <p class="text-gray-700 mb-2">Fecha de creación: {{ getUserCreationDate(user) }}</p>
          <button @click="confirmDelete(user)" class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Eliminar</button>
          <button @click="handleUpdateUser(user.id)" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Modificar rol</button>
      </div>
  </div>

  <!-- Modal para editar rol -->
  <div v-if="showModal" class="fixed inset-0 flex items-center justify-center z-50">
      <div class="fixed inset-0 bg-black opacity-50" @click="closeModal"></div>
      <div class="bg-white p-6 rounded-lg shadow-lg z-10 w-full max-w-md">
          <h2 class="text-xl font-bold mb-4 text-gray-700">Cambiar rol de usuario</h2>
          
          <div v-if="modalError" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
              {{ modalError }}
          </div>
          
          <div v-if="modalSuccess" class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
              {{ modalSuccess }}
          </div>
          
          <div class="mb-4">
              <p class="mb-2 text-gray-700"><strong>Usuario:</strong> {{ selectedUser?.name }}</p>
              <p class="mb-2 text-gray-700"><strong>Rol actual:</strong> {{ selectedUser ? getRoleName(selectedUser.typeUsers_id) : '' }}</p>
              
              <div class="mt-4">
                  <label class="block text-gray-700 mb-2">Nuevo rol:</label>
                  <select 
                      v-model="newRoleId" 
                      class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-gray-700"
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
  
  <!-- Modal de confirmación para eliminar usuario -->
  <transition name="fade">
    <div v-if="showDeleteModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="fixed inset-0 bg-black/60 backdrop-blur-sm" @click="showDeleteModal = false"></div>
        <transition name="pop">
            <div class="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 max-w-md w-full border border-slate-700/50 shadow-2xl">
                <h2 class="text-xl font-bold text-white mb-4">Confirmar eliminación</h2>
                
                <p class="text-slate-300 mb-6">
                    ¿Estás seguro que quieres eliminar al usuario "{{ userToDelete?.name }}"? 
                    <br>
                    <span class="text-red-400">Esta acción no se puede deshacer.</span>
                </p>
                
                <div class="flex justify-end space-x-3">
                    <button 
                        @click="showDeleteModal = false"
                        class="px-4 py-2 border border-slate-600 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button 
                        @click="handleDeleteUser"
                        class="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg shadow hover:from-red-600 hover:to-red-700 transition-all duration-300"
                    >
                        Eliminar
                    </button>
                </div>
            </div>
        </transition>
    </div>
  </transition>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { getAllUsers, deleteUser as deleteUserAPI, updateUserRole, getAllTypeUsers, createUser } from '@/services/communicationsScripts/mainManager.js';

// Añadir el route para detectar parámetros de URL
const route = useRoute();

// Variables generales
const users = ref([]);
const typeUsers = ref([]);
const loading = ref(true);
const error = ref(null);
const baseURL = import.meta.env.VITE_BACKEND_URL;

// Variables para el modal de edición
const showModal = ref(false);
const selectedUser = ref(null);
const newRoleId = ref(null);
const modalError = ref(null);
const modalSuccess = ref(null);
const updating = ref(false);
const selectedFileName = ref('');
const selectedFile = ref(null);

// Variables para el modal de confirmación de eliminación
const showDeleteModal = ref(false);
const userToDelete = ref(null);

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    selectedFile.value = file;
    selectedFileName.value = file.name;
  } else {
    selectedFile.value = null;
    selectedFileName.value = '';
  }
};

// Variables para el modal de creación
const showCreateModal = ref(false);
const newUser = ref({
  name: '',
  email: '',
  password: '',
  typeUsers_id: null,
  profile: ''
});
const createModalError = ref(null);
const createModalSuccess = ref(null);
const creating = ref(false);

// Función para obtener el nombre del rol
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

// Función para crear nuevo usuario
const handleCreateUser = () => {
  newUser.value = {
    name: '',
    email: '',
    password: '',
    typeUsers_id: null,
    profile: ''
  };
  createModalError.value = null;
  createModalSuccess.value = null;
  showCreateModal.value = true;
};

// Función para cerrar modal de creación
const closeCreateModal = () => {
  showCreateModal.value = false;
  createModalError.value = null;
  createModalSuccess.value = null;
};

// Función para guardar un nuevo usuario
const saveNewUser = async () => {
  if (!newUser.value.name || !newUser.value.email || !newUser.value.password || !newUser.value.typeUsers_id) {
    createModalError.value = "Por favor, completa todos los campos obligatorios";
    return;
  }

  creating.value = true;
  createModalError.value = null;
  createModalSuccess.value = null;

  try {
    const formData = new FormData();
    formData.append('name', newUser.value.name);
    formData.append('email', newUser.value.email);
    formData.append('password', newUser.value.password);
    formData.append('typeUsers_id', newUser.value.typeUsers_id);
    if (selectedFile.value) {
      formData.append('profile', selectedFile.value);
    }

    const response = await createUser(formData);
    
    if (response.error) {
      createModalError.value = `Error: ${response.error}`;
      console.error('Error al crear el usuario:', response.error);
    } else {
      users.value.push(response);
      createModalSuccess.value = "¡Usuario creado correctamente!";
      
      // Cerrar el modal después de 2 segundos
      setTimeout(() => {
        closeCreateModal();
      }, 2000);
    }
  } catch (err) {
    createModalError.value = `Error: ${err.message}`;
    console.error('Error saving new user:', err);
  } finally {
    creating.value = false;
  }
};

// Función para obtener la fecha de creación del usuario (maneja diferentes formatos)
const getUserCreationDate = (user) => {
  // Intenta diferentes campos de fecha posibles
  const dateField = user.created_at || user.createdAt || user.created || user.date_created;
  return dateField ? formatDate(dateField) : 'No disponible';
};

// Función para formatear fechas
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  
  try {
    const date = new Date(dateString);
    
    // Verificar si la fecha es válida
    if (isNaN(date.getTime())) {
      console.warn('Fecha inválida recibida:', dateString);
      return 'Fecha no válida';
    }
    
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch (err) {
    console.error('Error al formatear fecha:', err, dateString);
    return 'Error en formato';
  }
};

// Función para obtener tipos de usuarios
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

// Función para obtener todos los usuarios
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

// Función para confirmar la eliminación
const confirmDelete = (user) => {
  userToDelete.value = user;
  showDeleteModal.value = true;
};

// Función para eliminar el usuario
const handleDeleteUser = async () => {
  try {
    if (userToDelete.value && userToDelete.value.id) {
      const response = await deleteUserAPI(userToDelete.value.id);
      
      if (response.error) {
        error.value = response.error;
        console.error('Error al eliminar el usuario:', response.error);
      } else {
        users.value = users.value.filter(user => user.id !== userToDelete.value.id);
        showDeleteModal.value = false;
        userToDelete.value = null;
      }
    }
  } catch (err) {
    error.value = 'Error al eliminar el usuario: ' + err.message;
    console.error('Error deleting user:', err);
  }
};

// Función para actualizar usuario
const handleUpdateUser = (userId) => {
  selectedUser.value = users.value.find(user => user.id === userId);
  if (selectedUser.value) {
    newRoleId.value = selectedUser.value.typeUsers_id;
    modalError.value = null;
    modalSuccess.value = null;
    showModal.value = true;
  }
};

// Función para cerrar modal de edición
const closeModal = () => {
  showModal.value = false;
  selectedUser.value = null;
  newRoleId.value = null;
  modalError.value = null;
  modalSuccess.value = null;
  selectedFile.value = null;
  selectedFileName.value = '';
};

// Función para guardar cambio de rol
const saveRoleChange = async () => {
  if (!selectedUser.value || !newRoleId.value) {
    modalError.value = "Por favor, selecciona un rol válido";
    return;
  }

  if (newRoleId.value === selectedUser.value.typeUsers_id) {
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
        users.value[userIndex].typeUsers_id = newRoleId.value;
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

// Función para verificar si debemos mostrar el modal de creación automáticamente
const checkUrlParams = () => {
  if (route.query.action === 'new') {
    handleCreateUser();
  }
};

// Observador para cambios en los parámetros de la URL
watch(() => route.query, checkUrlParams, { immediate: true });

// Cargar usuarios al montar el componente
onMounted(() => {
  fetchUsers();
  checkUrlParams();
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

/* Transiciones para los diálogos */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.pop-enter-active,
.pop-leave-active {
  transition: all 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28);
}

.pop-enter-from,
.pop-leave-to {
  opacity: 0;
  transform: scale(0.9) translateY(10px);
}

/* Transiciones suaves */
button {
  transition: all 0.2s ease;
}

/* Efectos hover */
button:hover {
  transform: translateY(-1px);
}
</style>