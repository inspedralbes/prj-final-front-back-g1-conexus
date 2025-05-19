<template>
    <div class="mt-9 mb-9 py-8 px-4 sm:px-6">
        <div class="max-w-2xl mx-auto bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-slate-700/50">
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
                </div>
            </div>
            <!-- Contenido -->
            <div class="p-6">
                <div v-if="userDepartment" class="mb-8">
                    <h2 class="text-lg font-semibold text-white mb-2">El teu departament actual:</h2>
                    <div class="flex items-center justify-between bg-slate-700/50 rounded-lg px-4 py-3 mb-2">
                        <span class="text-white font-medium">
                            {{ departments.find(dept => dept.id === userDepartment)?.name }}
                        </span>
                        <button
                            @click="leaveDepartment(userDepartment)"
                            class="ml-4 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg shadow hover:from-red-600 hover:to-red-700 transition-all duration-300"
                        >
                            Deixar
                        </button>
                    </div>
                </div>
                <h2 class="text-lg font-semibold text-white mb-4">Tots els departaments</h2>
                <ul class="space-y-3">
                    <li
                        v-for="dept in departments"
                        :key="dept.id"
                        class="flex items-center justify-between bg-slate-700/40 rounded-lg px-4 py-3"
                    >
                        <span class="text-white font-medium">{{ dept.name }}</span>
                        <div>
                            <button
                                v-if="userDepartment && dept.id === userDepartment"
                                @click="leaveDepartment(dept.id)"
                                class="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg shadow hover:from-red-600 hover:to-red-700 transition-all duration-300"
                            >
                                Deixar
                            </button>
                            <button
                                v-else
                                @click="joinDepartment(dept.id)"
                                class="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg shadow hover:from-blue-600 hover:to-indigo-700 transition-all duration-300"
                            >
                                Unir-se
                            </button>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAppStore } from '@/stores/index.js'
import { getAllDepartments, updateUserDepartment } from '@/services/communicationsScripts/mainManager.js'

const store = useAppStore()
const departments = ref([])
const userDepartment = ref(null)
const userId = store.getUserId()
onMounted(async () => {
    departments.value = await getAllDepartments()
    const user = await store.getUser(userId)
    console.log(user)
    userDepartment.value = user.department_id
})

function leaveDepartment(departmentId) {
    updateUserDepartment(userId, null)
        .then(() => {
            userDepartment.value = null
            store.setUserDepartment(null)
        
        })
        .catch((error) => {
            console.error(error)

        })
}
function joinDepartment(departmentId) {
    updateUserDepartment(userId,    departmentId )
        .then(() => {
            userDepartment.value = departmentId
            store.setUserDepartment(userDepartment.value)

        })
        .catch((error) => {
            console.error(error)

        })
}
</script>