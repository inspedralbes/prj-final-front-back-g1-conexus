<template>
  <div class="animate-fade-in mt-9 mb-9">
    <!-- Capçalera -->
    <div class="mb-8 text-center">
      <h1 class="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
        Gestió d'Usuaris
      </h1>
      <p class="text-gray-300 mt-2">Administra els usuaris de la plataforma</p>
    </div>

    <div v-if="loading" class="text-center py-4 text-gray-400">
      <p>Carregant usuaris...</p>
    </div>

    <div v-else-if="error" class="bg-red-500/10 border border-red-400/50 text-red-400 px-4 py-3 rounded-lg mb-4">
      <strong class="font-bold">Error:</strong>
      <span class="block sm:inline">{{ error }}</span>
    </div>

    <div v-else>
      <div class="mb-6 flex justify-between items-center">
        <button @click="handleCreateUser"
          class="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-green-700 transition-all shadow-lg">
          Crear nou usuari
        </button>
        <p class="text-gray-400 text-sm">{{ users.length }} usuaris trobats</p>
      </div>
    </div>

    <!-- Llista d'usuaris -->
    <div v-if="users.length === 0 && !loading" class="text-center py-4 text-gray-400">
      <p>No hi ha usuaris per mostrar</p>
    </div>

    <div v-else class="bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden">
      <!-- Capçalera de la taula -->
      <div
        class="grid grid-cols-12 gap-2 p-4 border-b border-slate-700/50 bg-slate-700/30 text-sm font-medium text-gray-400">
        <div class="col-span-1 text-center">Imatge</div>
        <div class="col-span-3">Nom d'usuari</div>
        <div class="col-span-3">Email</div>
        <div class="col-span-2">Rol</div>
        <div class="col-span-2">Data registre</div>
        <div class="col-span-1 text-center">Accions</div>
      </div>

      <!-- Files d'usuaris -->
      <div class="divide-y divide-slate-700/30">
        <div v-for="user in paginatedUsers" :key="user.id"
          class="grid grid-cols-12 gap-2 p-4 items-center hover:bg-slate-700/20 transition-colors animate-fade-in">
          <div class="col-span-1 flex justify-center">
            <img :src="`${baseURL}${user.profile}`" alt="Imatge de perfil"
              class="w-10 h-10 rounded-full object-cover border border-slate-600">
          </div>
          <div class="col-span-3 font-medium text-gray-300">{{ user.name }}</div>
          <div class="col-span-3 text-sm text-gray-400 truncate">{{ user.email }}</div>
          <div class="col-span-2">
            <span class="px-2 py-1 text-xs rounded-full" :class="getRoleClass(user.typeUsers_id)">
              {{ getRoleName(user.typeUsers_id) }}
            </span>
          </div>
          <div class="col-span-2 text-sm text-gray-400">{{ getUserCreationDate(user) }}</div>
          <div class="col-span-1 flex justify-center space-x-1">
            <button @click="handleUpdateUser(user.id)"
              class="p-1.5 rounded-md text-blue-400 hover:bg-blue-500/20 transition-colors" title="Modificar">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button @click="confirmDelete(user)"
              class="p-1.5 rounded-md text-red-400 hover:bg-red-500/20 transition-colors" title="Eliminar">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      <!-- Paginació -->
      <div v-if="totalPages > 1" class="px-4 py-5 flex justify-center items-center gap-2">
        <button @click="goToPage(currentPage - 1)" 
          :disabled="currentPage === 1"
          class="p-2 rounded-lg bg-slate-700/50 text-gray-300 hover:bg-blue-600/30 disabled:opacity-50 disabled:hover:bg-slate-700/50"
          title="Pàgina anterior">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <div class="flex gap-1">
          <button v-for="page in displayedPageNumbers" :key="page" 
            @click="goToPage(page)"
            :class="[
              'px-3 py-1 rounded-md transition-colors',
              currentPage === page 
                ? 'bg-blue-600 text-white font-medium' 
                : 'bg-slate-700/50 text-gray-300 hover:bg-blue-600/30'
            ]">
            {{ page }}
          </button>
        </div>
        
        <button @click="goToPage(currentPage + 1)"
          :disabled="currentPage === totalPages"
          class="p-2 rounded-lg bg-slate-700/50 text-gray-300 hover:bg-blue-600/30 disabled:opacity-50 disabled:hover:bg-slate-700/50"
          title="Pàgina següent">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>


  </div>
  <!-- Modal per crear usuari -->
  <div v-if="showCreateModal" class="fixed inset-0 flex items-center justify-center z-50 p-4">
    <div class="fixed inset-0 bg-black/60 backdrop-blur-sm" @click="closeCreateModal"></div>
    <div
      class="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 max-w-md w-full border border-slate-700/50 shadow-2xl z-10">
      <h2 class="text-xl font-bold text-white mb-4">Crear nou usuari</h2>

      <div v-if="createModalError"
        class="bg-red-500/10 border border-red-400/50 text-red-400 px-4 py-3 rounded-lg mb-4">
        {{ createModalError }}
      </div>
      <div v-if="createModalSuccess"
        class="bg-green-500/10 border border-green-400/50 text-green-400 px-4 py-3 rounded-lg mb-4">
        {{ createModalSuccess }}
      </div>

      <form @submit.prevent="saveNewUser" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-1">Nom:</label>
          <input v-model="newUser.name" type="text"
            class="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-300 mb-1">Email:</label>
          <input v-model="newUser.email" type="email"
            class="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-300 mb-1">Contrasenya:</label>
          <input v-model="newUser.password" type="password"
            class="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-300 mb-1">Rol:</label>
          <select v-model="newUser.typeUsers_id"
            class="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required>
            <option v-for="type in typeUsers" :key="type.id" :value="type.id">
              {{ type.name }}
            </option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-300 mb-1">Imatge de perfil:</label>
          <div class="flex flex-col space-y-3">
            <!-- Vista previa de la imagen -->
            <div v-if="imagePreview" class="mx-auto">
              <img :src="imagePreview" alt="Vista previa"
                class="w-24 h-24 rounded-full object-cover border-2 border-slate-600">
            </div>

            <div class="flex items-center space-x-2">
              <label
                class="flex-1 cursor-pointer bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-2 text-gray-400 hover:bg-slate-700 transition-colors">
                <span v-if="!selectedFileName">Seleccionar arxiu (màx 2MB, JPG/PNG)...</span>
                <span v-else class="truncate">{{ selectedFileName }}</span>
                <input type="file" @change="handleFileUpload" accept="image/jpeg,image/png,image/jpg" class="hidden">
              </label>
            </div>

            <!-- Mensaje de error para la imagen -->
            <div v-if="imageError" class="text-xs text-red-400">
              {{ imageError }}
            </div>
          </div>
        </div>

        <div class="flex justify-end space-x-2 pt-4">
          <button @click="closeCreateModal" type="button"
            class="px-4 py-2 border border-slate-600 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors">
            Cancel·lar
          </button>
          <button type="submit" :disabled="creating"
            class="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow hover:from-blue-600 hover:to-blue-700 transition-all duration-300 disabled:opacity-50">
            {{ creating ? 'Creant...' : 'Crear usuari' }}
          </button>
        </div>
      </form>
    </div>
  </div>

  <!-- Modal per editar rol -->
  <div v-if="showModal" class="fixed inset-0 flex items-center justify-center z-50 p-4">
    <div class="fixed inset-0 bg-black/60 backdrop-blur-sm" @click="closeModal"></div>
    <div
      class="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 max-w-md w-full border border-slate-700/50 shadow-2xl z-10">
      <h2 class="text-xl font-bold text-white mb-4">Canviar rol d'usuari</h2>

      <div v-if="modalError" class="bg-red-500/10 border border-red-400/50 text-red-400 px-4 py-3 rounded-lg mb-4">
        {{ modalError }}
      </div>

      <div v-if="modalSuccess"
        class="bg-green-500/10 border border-green-400/50 text-green-400 px-4 py-3 rounded-lg mb-4">
        {{ modalSuccess }}
      </div>

      <div class="mb-4">
        <p class="mb-2 text-gray-300"><strong>Usuari:</strong> {{ selectedUser?.name }}</p>
        <p class="mb-4 text-gray-300"><strong>Rol actual:</strong> {{ selectedUser ?
          getRoleName(selectedUser.typeUsers_id) : '' }}</p>

        <div>
          <label class="block text-sm font-medium text-gray-300 mb-1">Nou rol:</label>
          <select v-model="newRoleId"
            class="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option v-for="type in typeUsers" :key="type.id" :value="type.id">
              {{ type.name }}
            </option>
          </select>
        </div>
      </div>

      <div class="flex justify-end space-x-2">
        <button @click="closeModal"
          class="px-4 py-2 border border-slate-600 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors">
          Cancel·lar
        </button>
        <button @click="saveRoleChange"
          class="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow hover:from-blue-600 hover:to-blue-700 transition-all duration-300 disabled:opacity-50"
          :disabled="updating">
          {{ updating ? 'Guardant...' : 'Guardar canvis' }}
        </button>
      </div>
    </div>
  </div>

  <!-- Modal de confirmació per eliminar usuari -->
  <transition name="fade">
    <div v-if="showDeleteModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="fixed inset-0 bg-black/60 backdrop-blur-sm" @click="showDeleteModal = false"></div>
      <transition name="pop">
        <div
          class="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 max-w-md w-full border border-slate-700/50 shadow-2xl">
          <h2 class="text-xl font-bold text-white mb-4">Confirmar eliminació</h2>

          <p class="text-slate-300 mb-6">
            Esteu segur que voleu eliminar l'usuari "{{ userToDelete?.name }}"?
            <br>
            <span class="text-red-400">Aquesta acció no es pot desfer.</span>
          </p>

          <div class="flex justify-end space-x-3">
            <button @click="showDeleteModal = false"
              class="px-4 py-2 border border-slate-600 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors">
              Cancel·lar
            </button>
            <button @click="handleDeleteUser"
              class="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg shadow hover:from-red-600 hover:to-red-700 transition-all duration-300">
              Eliminar
            </button>
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import { useRoute } from 'vue-router';
import { getAllUsers, deleteUser as deleteUserAPI, updateUserRole, getAllTypeUsers, createUser } from '@/services/communicationsScripts/mainManager.js';

// Afegir el route per detectar paràmetres d'URL
const route = useRoute();

// Variables generals
const users = ref([]);
const typeUsers = ref([]);
const loading = ref(true);
const error = ref(null);
const baseURL = import.meta.env.VITE_BACKEND_URL;

// Variables per al modal d'edició
const showModal = ref(false);
const selectedUser = ref(null);
const newRoleId = ref(null);
const modalError = ref(null);
const modalSuccess = ref(null);
const updating = ref(false);
const selectedFileName = ref('');
const selectedFile = ref(null);

// Variables per al modal de confirmació d'eliminació
const showDeleteModal = ref(false);
const userToDelete = ref(null);

// Variables per al modal de creació
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
const imagePreview = ref(null);
const imageError = ref(null);
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB en bytes

// Paginació
const itemsPerPage = 15;
const currentPage = ref(1);

// Calcular usuaris paginats
const paginatedUsers = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return users.value.slice(startIndex, endIndex);
});

// Calcular nombre total de pàgines
const totalPages = computed(() => {
  return Math.ceil(users.value.length / itemsPerPage);
});

// Mostrar només una selecció de números de pàgina per a una millor UX
const displayedPageNumbers = computed(() => {
  const maxPageButtons = 5;
  const pages = [];
  
  if (totalPages.value <= maxPageButtons) {
    // Si hi ha menys pàgines que el màxim, mostrar totes
    for (let i = 1; i <= totalPages.value; i++) {
      pages.push(i);
    }
  } else {
    // Si l'usuari és a les primeres pàgines
    if (currentPage.value <= 3) {
      for (let i = 1; i <= 4; i++) {
        pages.push(i);
      }
      pages.push(totalPages.value);
    }
    // Si l'usuari és a les últimes pàgines
    else if (currentPage.value >= totalPages.value - 2) {
      pages.push(1);
      for (let i = totalPages.value - 3; i <= totalPages.value; i++) {
        pages.push(i);
      }
    }
    // Si l'usuari és a les pàgines del mig
    else {
      pages.push(1);
      for (let i = currentPage.value - 1; i <= currentPage.value + 1; i++) {
        pages.push(i);
      }
      pages.push(totalPages.value);
    }
  }
  
  return pages;
});

// Navegar a una pàgina específica
const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    // Desplaçar-se cap amunt per mostrar l'inici de la taula
    window.scrollTo({
      top: document.querySelector('.bg-slate-800\\/50').offsetTop - 20,
      behavior: 'smooth'
    });
  }
};

// Actualitzar la informació mostrada a l'encapçalament
const userCountInfo = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage + 1;
  const end = Math.min(currentPage.value * itemsPerPage, users.value.length);
  return `Mostrant ${start}-${end} de ${users.value.length} usuaris trobats`;
});

// Funció per obtenir el nom del rol
const getRoleName = (roleId) => {
  const typeUser = typeUsers.value.find(type => type.id === roleId);

  if (typeUser) {
    return typeUser.name;
  }

  const roleNames = {
    1: 'Estudiant',
    2: 'Professor',
    3: 'Cap de Departament',
    4: 'Direcció',
    5: 'Administrador'
  };

  return roleNames[roleId] || `Rol ${roleId}`;
};

// Funció per obtenir classes CSS per rol
const getRoleClass = (roleId) => {
  const roleClasses = {
    1: 'bg-blue-500/20 text-blue-400',
    2: 'bg-purple-500/20 text-purple-400',
    3: 'bg-yellow-500/20 text-yellow-400',
    4: 'bg-red-500/20 text-red-400',
    5: 'bg-green-500/20 text-green-400'
  };

  return roleClasses[roleId] || 'bg-gray-500/20 text-gray-400';
};

// Funció per crear nou usuari
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
  imagePreview.value = null;
  imageError.value = null;
  showCreateModal.value = true;
};

// Funció per tancar modal de creació
const closeCreateModal = () => {
  showCreateModal.value = false;
  createModalError.value = null;
  createModalSuccess.value = null;
  imagePreview.value = null;
  imageError.value = null;
};

// Funció per guardar un nou usuari
const saveNewUser = async () => {
  if (!newUser.value.name || !newUser.value.email || !newUser.value.password || !newUser.value.typeUsers_id) {
    createModalError.value = "Si us plau, omple tots els camps obligatoris";
    return;
  }

  creating.value = true;
  createModalError.value = null;
  createModalSuccess.value = null;

  try {
    // Crear y configurar FormData correctamente
    const formData = new FormData();
    formData.append('name', newUser.value.name);
    formData.append('email', newUser.value.email);
    formData.append('password', newUser.value.password);
    formData.append('typeUsers_id', newUser.value.typeUsers_id);

    // Añadir imagen solo si se ha seleccionado
    if (selectedFile.value) {
      formData.append('profile', selectedFile.value);
    }

    // Verificar que formData contiene lo esperado
    console.log("FormData entries:");
    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value instanceof File ? `File: ${value.name}` : value}`);
    }

    const response = await createUser(formData);

    if (response.error) {
      createModalError.value = `Error: ${response.error}`;
      console.error('Error al crear l\'usuari:', response.error);
    } else {
      // Añadir el usuario a la lista i tancar modal
      users.value.push(response);
      createModalSuccess.value = "Usuari creat correctament!";

      // Recargar usuarios para asegurar que todo se actualiza correctamente
      setTimeout(() => {
        fetchUsers();
        closeCreateModal();
      }, 2000);
    }
  } catch (err) {
    createModalError.value = `Error: ${err.message}`;
    console.error('Error guardant nou usuari:', err);
  } finally {
    creating.value = false;
  }
};

// Funció per obtenir la data de creació de l'usuari (maneja diferents formats)
const getUserCreationDate = (user) => {
  // Intenta diferents camps de data possibles
  const dateField = user.created_at || user.createdAt || user.created || user.date_created;
  return dateField ? formatDate(dateField) : 'No disponible';
};

// Funció per formatar dates
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';

  try {
    const date = new Date(dateString);

    // Verificar si la data és vàlida
    if (isNaN(date.getTime())) {
      console.warn('Data invàlida rebuda:', dateString);
      return 'Data no vàlida';
    }

    return date.toLocaleDateString('ca-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch (err) {
    console.error('Error al formatar data:', err, dateString);
    return 'Error en format';
  }
};

// Funció per obtenir tipus d'usuaris
const fetchTypeUsers = async () => {
  try {
    const response = await getAllTypeUsers();

    if (response.error) {
      console.error('Error al obtenir tipus d\'usuaris:', response.error);
      return false;
    }

    typeUsers.value = response;
    return true;
  } catch (err) {
    console.error('Error obtenint tipus d\'usuaris:', err);
    return false;
  }
};

// Funció per obtenir tots els usuaris
const fetchUsers = async () => {
  loading.value = true;
  error.value = null;

  try {
    await fetchTypeUsers();

    const response = await getAllUsers();

    if (response.error) {
      error.value = response.error;
      console.error('Error en la resposta:', response.error);
    } else {
      users.value = response;
      // Resetear a la primera página quan es carreguen nous usuaris
      currentPage.value = 1;
    }
  } catch (err) {
    error.value = 'Error al carregar els usuaris: ' + err.message;
    console.error('Error obtenint usuaris:', err);
  } finally {
    loading.value = false;
  }
};

// Funció per confirmar l'eliminació
const confirmDelete = (user) => {
  userToDelete.value = user;
  showDeleteModal.value = true;
};

// Funció per eliminar l'usuari
const handleDeleteUser = async () => {
  try {
    if (userToDelete.value && userToDelete.value.id) {
      const response = await deleteUserAPI(userToDelete.value.id);

      if (response.error) {
        error.value = response.error;
        console.error('Error al eliminar l\'usuari:', response.error);
      } else {
        users.value = users.value.filter(user => user.id !== userToDelete.value.id);
        showDeleteModal.value = false;
        userToDelete.value = null;
      }
    }
  } catch (err) {
    error.value = 'Error al eliminar l\'usuari: ' + err.message;
    console.error('Error eliminant usuari:', err);
  }
};

// Funció per actualitzar usuari
const handleUpdateUser = (userId) => {
  selectedUser.value = users.value.find(user => user.id === userId);
  if (selectedUser.value) {
    newRoleId.value = selectedUser.value.typeUsers_id;
    modalError.value = null;
    modalSuccess.value = null;
    showModal.value = true;
  }
};

// Funció per tancar modal d'edició
const closeModal = () => {
  showModal.value = false;
  selectedUser.value = null;
  newRoleId.value = null;
  modalError.value = null;
  modalSuccess.value = null;
  selectedFile.value = null;
  selectedFileName.value = '';
};

// Funció per guardar canvi de rol
const saveRoleChange = async () => {
  if (!selectedUser.value || !newRoleId.value) {
    modalError.value = "Si us plau, selecciona un rol vàlid";
    return;
  }

  if (newRoleId.value === selectedUser.value.typeUsers_id) {
    modalError.value = "El rol seleccionat és el mateix que l'actual";
    return;
  }

  updating.value = true;
  modalError.value = null;
  modalSuccess.value = null;

  try {
    const response = await updateUserRole(selectedUser.value.id, newRoleId.value);

    if (response.error) {
      modalError.value = `Error: ${response.error}`;
      console.error('Error al actualitzar el rol:', response.error);
    } else {
      // Actualitzar el rol a la llista d'usuaris
      const userIndex = users.value.findIndex(user => user.id === selectedUser.value.id);
      if (userIndex !== -1) {
        users.value[userIndex].typeUsers_id = newRoleId.value;
      }

      modalSuccess.value = "Rol actualitzat correctament!";

      // Tancar el modal després de 2 segons
      setTimeout(() => {
        closeModal();
      }, 2000);
    }
  } catch (err) {
    modalError.value = `Error: ${err.message}`;
    console.error('Error guardant canvi de rol:', err);
  } finally {
    updating.value = false;
  }
};

// Funció per verificar si hem de mostrar el modal de creació automàticament
const checkUrlParams = () => {
  if (route.query.action === 'new') {
    handleCreateUser();
  }
};

// Observador per canvis en els paràmetres de la URL
watch(() => route.query, checkUrlParams, { immediate: true });

// Carregar usuaris al muntar el component
onMounted(() => {
  fetchUsers();
  checkUrlParams();
});

// Funció per gestionar la pujada d'imatges
const handleFileUpload = (event) => {
  imageError.value = null;
  const file = event.target.files[0];

  if (!file) {
    selectedFile.value = null;
    selectedFileName.value = '';
    imagePreview.value = null;
    return;
  }

  // Verificar tipo de archivo
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  if (!allowedTypes.includes(file.type)) {
    imageError.value = "Només s'accepten arxius JPG o PNG";
    selectedFile.value = null;
    selectedFileName.value = '';
    imagePreview.value = null;
    return;
  }

  // Verificar tamaño del archivo
  if (file.size > MAX_FILE_SIZE) {
    imageError.value = "L'arxiu és massa gran. Mida màxima: 2MB";
    selectedFile.value = null;
    selectedFileName.value = '';
    imagePreview.value = null;
    return;
  }

  // Guardar archivo y mostrar vista previa
  selectedFile.value = file;
  selectedFileName.value = file.name;

  // Crear vista previa
  const reader = new FileReader();
  reader.onload = (e) => {
    imagePreview.value = e.target.result;
  };
  reader.readAsDataURL(file);
};
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.5s ease forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Transicions pels diàlegs */
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

/* Transicions suaus */
button {
  transition: all 0.2s ease;
}

/* Efectes hover */
button:hover {
  transform: translateY(-1px);
}

/* Asegura que los modales estén centrados y por encima de todo el contenido */
.fixed.inset-0.flex {
  position: fixed !important;
  z-index: 9999 !important;
}

/* Mejora el backdrop para que cubra toda la pantalla */
.fixed.inset-0.bg-black\/60 {
  position: fixed !important;
  z-index: 9998 !important;
}

/* Contenido del modal */
.relative.bg-gradient-to-br {
  max-height: 90vh;
  overflow-y: auto;
  z-index: 10000 !important;
}

/* Desplazamiento suave para modales con contenido extenso */
.relative.bg-gradient-to-br::-webkit-scrollbar {
  width: 6px;
}

.relative.bg-gradient-to-br::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 3px;
}

.relative.bg-gradient-to-br::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}

/* Previene el desplazamiento del cuerpo cuando el modal está abierto */
body:has(.fixed.inset-0.flex) {
  overflow: hidden;
}
</style>