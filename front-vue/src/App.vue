<template>
  <ParticlesBackground />
  <!-- Eliminamos la navegación global ya que cada vista tiene su propia navegación -->
  <router-view></router-view>
</template>

<style scoped></style>

<script setup>
import { onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import ParticlesBackground from "@/components/Desing/background.vue";
import { useAppStore } from "@/stores/index.js";
import { getUserByEmail } from "@/services/communicationsScripts/mainManager.js";

const router = useRouter();
const store = useAppStore();
const isAuthenticated = computed(() => !!store.getAccessToken());

const redirectUserBasedOnRole = (user) => {
  const currentRoute = router.currentRoute.value;

  if (currentRoute.path !== "/" && currentRoute.path !== "/login") {
    return;
  }

  let userRole = "";

  if (user?.typeusers?.name) {
    userRole = user.typeusers.name;
  } else if (user?.typeUsers_id) {
    switch (user.typeUsers_id) {
      case 1:
        userRole = "Estudiant";
        break;
      case 2:
        userRole = "Professor";
        break;
      case 3:
        userRole = "Administrador";
        break;
      case 4:
        userRole = "Tècnic";
        break;
      case 5:
        userRole = "Cantina";
        break;
    }
  }

  console.log("Redirigiendo usuario con rol:", userRole);

  console.log("Redirigiendo usuario con rol:", userRole);
  switch (userRole) {
    case "Administrador":
      router.push("/admin/panel");
      break;
    case "Professor":
      router.push("/teachers/panel");
      break;
    case "Estudiant":
      router.push("/students/panel");
      break;
    case "Tècnic":
      router.push("/technicians/panel");
      break;
    case "Cantina":
      router.push("/canteen/panel");
      break;
    default:
      console.error(
        "No se pudo determinar un rol válido para el usuario:",
        user
      );
      router.push("/");
      break;
  }
};

onMounted(async () => {
  // Recuperar datos de sesión si existen
  const userEmail = localStorage.getItem("user");
  const accessToken = localStorage.getItem("accessToken");

  if (userEmail && accessToken) {
    try {
      store.setAccessToken(accessToken);

      // Obtener datos del usuario con el email
      const userData = await getUserByEmail(JSON.parse(userEmail));

      // Comprobar si la respuesta contiene datos válidos (no error)
      if (userData && !userData.error) {
        // Guardar el usuario en el store
        store.setUser(userData);
        console.log("Usuario recuperado:", userData);

        // Redirigir al usuario según su rol
        redirectUserBasedOnRole(userData);
      } else {
        // Si hay un error en los datos de usuario, limpiar la sesión
        throw new Error(
          userData?.error || "Error al obtener los datos del usuario"
        );
      }
    } catch (error) {
      console.error("Error al recuperar la sesión:", error);
      // En caso de error, limpiar los datos de sesión
      store.setAccessToken("");
      store.setUser({});
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      router.push("/");
    }
  }
});
</script>