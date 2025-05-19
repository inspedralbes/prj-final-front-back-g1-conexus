<template>
    <div class="mt-9 mb-9 py-8 px-4 sm:px-6">
        <div class="max-w-4xl mx-auto bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-slate-700/50">
            <!-- Cabecera -->
            <div class="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
                <div class="flex items-center justify-between">
                    <h1 class="text-2xl font-bold flex items-center">
                        <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        Gestió de Departaments
                    </h1>
                    <button @click="showCreateModal = true"
                        class="flex items-center text-sm bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors">
                        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                        </svg>
                        Nou Departament
                    </button>
                </div>
            </div>

            <!-- Contenido -->
            <div class="p-6">
                <div v-if="departments.length === 0" class="text-center py-12">
                    <svg class="w-16 h-16 mx-auto text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1"
                            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p class="mt-4 text-slate-400">No hi ha departaments disponibles.</p>
                    <button @click="showCreateModal = true"
                        class="mt-4 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg shadow hover:from-blue-600 hover:to-indigo-700 transition-all duration-300">
                        Crear primer departament
                    </button>
                </div>
                <div v-else class="overflow-x-auto bg-slate-800/30 rounded-xl border border-slate-700/50">
                    <table class="min-w-full divide-y divide-slate-700/70">
                        <thead class="bg-slate-700/30">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">ID</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Nom</th>
                                <th class="px-6 py-3 text-right text-xs font-medium text-slate-300 uppercase tracking-wider">Accions</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-700/50">
                            <tr v-for="department in departments" :key="department.id"
                                class="hover:bg-slate-700/20 transition-colors cursor-pointer">
                                <td class="px-6 py-4 whitespace-nowrap text-white">{{ department.id }}</td>
                                <td class="px-6 py-4 whitespace-nowrap text-white">{{ department.name }}</td>
                                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                    <button @click.stop="openUpdateModal(department)"
                                        class="text-blue-400 hover:text-blue-300 transition-colors">
                                        <span class="px-3 py-1 bg-blue-500/10 rounded-md">Editar</span>
                                    </button>
                                    <button @click.stop="openDeleteModal(department)"
                                        class="text-red-400 hover:text-red-300 transition-colors">
                                        <span class="px-3 py-1 bg-red-500/10 rounded-md">Eliminar</span>
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- Modal Crear -->
        <transition name="fade">
            <div v-if="showCreateModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div class="fixed inset-0 bg-black/60 backdrop-blur-sm" @click="showCreateModal = false"></div>
                <transition name="pop">
                    <div class="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 w-full max-w-md border border-slate-700/50 shadow-2xl z-10">
                        <div class="flex justify-between items-center mb-4">
                            <h2 class="text-xl font-bold text-white">Crear Departament</h2>
                            <button @click="showCreateModal = false" class="text-gray-400 hover:text-white">
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <form @submit.prevent="handleCreateDepartment" class="space-y-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-300 mb-2">Nom del Departament</label>
                                <input v-model="newDepartmentName" type="text"
                                    class="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-3 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required placeholder="Ex: Matemàtiques" />
                            </div>
                            <div class="flex justify-end space-x-3 pt-4 border-t border-slate-700">
                                <button type="button" @click="showCreateModal = false"
                                    class="px-6 py-2 border border-slate-600 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors">
                                    Cancel·lar
                                </button>
                                <button type="submit"
                                    class="px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg shadow hover:from-green-600 hover:to-green-700 transition-all duration-300">
                                    Crear
                                </button>
                            </div>
                        </form>
                    </div>
                </transition>
            </div>
        </transition>

        <!-- Modal Editar -->
        <transition name="fade">
            <div v-if="showUpdateModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div class="fixed inset-0 bg-black/60 backdrop-blur-sm" @click="showUpdateModal = false"></div>
                <transition name="pop">
                    <div class="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 w-full max-w-md border border-slate-700/50 shadow-2xl z-10">
                        <div class="flex justify-between items-center mb-4">
                            <h2 class="text-xl font-bold text-white">Editar Departament</h2>
                            <button @click="showUpdateModal = false" class="text-gray-400 hover:text-white">
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <form @submit.prevent="handleUpdateDepartment(departmentId)" class="space-y-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-300 mb-2">Nom del Departament</label>
                                <input v-model="departmentName" type="text"
                                    class="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-3 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required />
                            </div>
                            <div class="flex justify-end space-x-3 pt-4 border-t border-slate-700">
                                <button type="button" @click="showUpdateModal = false"
                                    class="px-6 py-2 border border-slate-600 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors">
                                    Cancel·lar
                                </button>
                                <button type="submit"
                                    class="px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg shadow hover:from-green-600 hover:to-green-700 transition-all duration-300">
                                    Guardar
                                </button>
                            </div>
                        </form>
                    </div>
                </transition>
            </div>
        </transition>

        <!-- Modal Eliminar -->
        <transition name="fade">
            <div v-if="showDeleteModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div class="fixed inset-0 bg-black/60 backdrop-blur-sm" @click="showDeleteModal = false"></div>
                <div class="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 w-full max-w-md border border-slate-700/50 shadow-2xl z-10">
                    <div class="flex items-center mb-4 text-red-500">
                        <svg class="w-8 h-8 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <h2 class="text-xl font-bold text-white">Confirmar eliminació</h2>
                    </div>
                    <p class="mb-6 text-gray-300">Estàs segur que vols eliminar aquest departament?</p>
                    <div class="flex justify-end space-x-3">
                        <button @click="showDeleteModal = false"
                            class="px-4 py-2 border border-slate-600 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors">
                            Cancel·lar
                        </button>
                        <button @click="handleDeleteDepartment(departmentId)"
                            class="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors">
                            Eliminar
                        </button>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getAllDepartments, deleteDepartment as apiDeleteDepartment, updateDepartment, createDepartment } from '@/services/communicationsScripts/mainManager';

const departments = ref([]);
const showDeleteModal = ref(false);
const showUpdateModal = ref(false);
const showCreateModal = ref(false);
const departmentId = ref(null);
const departmentName = ref('');
const newDepartmentName = ref('');

const openDeleteModal = (department) => {
    departmentId.value = department.id;
    showDeleteModal.value = true;
};

const openUpdateModal = (department) => {
    departmentId.value = department.id;
    departmentName.value = department.name;
    showUpdateModal.value = true;
};

const handleDeleteDepartment = async (id) => {
    try {
        await apiDeleteDepartment(id);
        departments.value = departments.value.filter(department => department.id !== id);
        showDeleteModal.value = false;
    } catch (error) {
        console.error(error);
        alert("Error al eliminar el departament");
    }
};

const handleUpdateDepartment = async (id) => {
    try {
        await updateDepartment(id, departmentName.value);
        departments.value = departments.value.map(department => {
            if (department.id === id) {
                return { ...department, name: departmentName.value };
            }
            return department;
        });
        showUpdateModal.value = false;
    } catch (error) {
        console.error(error);
        alert("Error al actualitzar el departament");
    }
};

const handleCreateDepartment = async () => {
    try {
        const newDepartment = await createDepartment(newDepartmentName.value);
        departments.value.push(newDepartment);
        showCreateModal.value = false;
        newDepartmentName.value = '';
    } catch (error) {
        console.error(error);
        alert("Error al crear el departament");
    }
};

onMounted(async () => {
    departments.value = await getAllDepartments();
});
</script>

<style scoped>
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
::-webkit-scrollbar {
    width: 8px;
    height: 8px;
}
::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 4px;
}
::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.2);
}
</style>