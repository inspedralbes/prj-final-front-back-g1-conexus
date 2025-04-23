<template>
    <div class="min-h-screen flex items-center justify-center ">
        <div class="w-full max-w-4xl p-8 bg-white rounded-xl shadow-lg animate-fade-in">
            <div class="text-center mb-8">
                <!-- <img src="/logo-institucion.png" alt="Logo Institucional" class="h-20 mx-auto mb-6"> -->
                <h1 class="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                    Panel de Administración Educativa
                </h1>
                <p class="text-lg text-gray-600">
                    Sistema de gestión académica y administrativa
                </p>
            </div>  

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <!-- Módulo Académico -->
                <div class="bg-blue-50 p-6 rounded-lg border border-blue-100 hover:shadow-md transition-all">
                    <div class="text-blue-600 mb-4">
                        <svg class="w-10 h-10 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253">
                            </path>
                        </svg>
                    </div>
                    <h3 class="text-xl font-semibold text-gray-800 mb-2">Gestión Académica</h3>
                    <p class="text-gray-600 mb-4 text-sm">Administración de cursos, horarios y calificaciones</p>
                    <router-link to="/academico" class="text-blue-600 hover:text-blue-800 text-sm font-medium">
                        Acceder <span aria-hidden="true">→</span>
                    </router-link>
                </div>

                <!-- Módulo Estudiantes -->
                <div class="bg-green-50 p-6 rounded-lg border border-green-100 hover:shadow-md transition-all">
                    <div class="text-green-600 mb-4">
                        <svg class="w-10 h-10 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z">
                            </path>
                        </svg>
                    </div>
                    <h3 class="text-xl font-semibold text-gray-800 mb-2">Gestión de Estudiantes</h3>
                    <p class="text-gray-600 mb-4 text-sm">Registro y seguimiento de alumnos</p>
                    <router-link to="/estudiantes" class="text-green-600 hover:text-green-800 text-sm font-medium">
                        Acceder <span aria-hidden="true">→</span>
                    </router-link>
                </div>

                <!-- Módulo Administrativo -->
                <div class="bg-purple-50 p-6 rounded-lg border border-purple-100 hover:shadow-md transition-all">
                    <div class="text-purple-600 mb-4">
                        <svg class="w-10 h-10 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4">
                            </path>
                        </svg>
                    </div>
                    <h3 class="text-xl font-semibold text-gray-800 mb-2">Administración</h3>
                    <p class="text-gray-600 mb-4 text-sm">Gestión financiera y recursos institucionales</p>
                    <router-link to="/administracion" class="text-purple-600 hover:text-purple-800 text-sm font-medium">
                        Acceder <span aria-hidden="true">→</span>
                    </router-link>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.animate-fade-in {
    animation: fadeIn 1s ease-in-out;
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
</style>