<template>
  <ParticlesBackground />
  <Navigation v-if="isAuthenticated" />
  <router-view></router-view>
</template>

<script setup>
import { onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import ParticlesBackground from '@/components/Desing/background.vue';
import Navigation from '@/components/Navigation.vue';
import { useAppStore } from '@/stores/index.js';
import { getUserByEmail } from '@/services/communicationsScripts/mainManager.js';

const router = useRouter();
const store = useAppStore();
const isAuthenticated = computed(() => !!store.getAccessToken());

// Función que redirige al usuario según su rol
const redirectUserBasedOnRole = (user) => {
  // Obtener la ruta actual
  const currentRoute = router.currentRoute.value;
  
  // Si el usuario ya está en una página específica (no en la página de login), no redirigir
  if (currentRoute.path !== '/' && currentRoute.path !== '/login') {
    return;
  }

  // Obtener el rol del usuario
  const userRole = user?.typeusers?.name || '';
  
  console.log('Redirigiendo usuario con rol:', userRole);

  // Redireccionar según el rol
  switch (userRole) {
    case 'Administrador':
      router.push('/admin');
      break;
    case 'Professor':
      router.push('/teachers');
      break;
    case 'Estudiant':
      router.push('/students');
      break;
    case 'Tècnic':
      router.push('/technicians');
      break;
    default:
      // Si no tiene un rol reconocido, dejarlo en la página actual o redirigirlo al dashboard
      router.push('/');
      break;
  }
};

onMounted(async () => {
  // Recuperar datos de sesión si existen
  const userEmail = localStorage.getItem('user');
  const accessToken = localStorage.getItem('accessToken');

  if (userEmail && accessToken) {
    try {
      store.setAccessToken(accessToken);

      // Obtener datos del usuario con el email
      const userData = await getUserByEmail(JSON.parse(userEmail));
      
      // Comprobar si la respuesta contiene datos válidos (no error)
      if (userData && !userData.error) {
        // Guardar el usuario en el store
        store.setUser(userData);
        console.log('Usuario recuperado:', userData);
        
        // Redirigir al usuario según su rol
        redirectUserBasedOnRole(userData);
      } else {
        // Si hay un error en los datos de usuario, limpiar la sesión
        throw new Error(userData?.error || 'Error al obtener los datos del usuario');
      }
    } catch (error) {
      console.error("Error al recuperar la sesión:", error);
      // En caso de error, limpiar los datos de sesión
      store.setAccessToken('');
      store.setUser({});
      localStorage.removeItem('user');
      localStorage.removeItem('accessToken');
      router.push('/');
    }
  }
});
</script>