import { createRouter, createWebHistory } from 'vue-router'
import { useAppStore } from '@/stores/index';
import mainPage from '../views/mainPage.vue'
import profilePage from '@/views/myProfilePage.vue'
import profilesPage from '@/views/profilesPage.vue'
import reportPage from '../views/reportPage.vue'
import validationPage from '../views/validationPage.vue'
import validationUpdatePage from '../views/validationUpdatePage.vue'
import chatListPage from '../views/chatListPage.vue'
import loginPage from '../views/loginRegisterPage.vue'
import addComunityPost from '../views/addComunityPost.vue'
import addRequestPost from '../views/addRequestPost.vue'
import reportUserPage from '@/views/reportUserPage.vue'
import reportPublicacioPage from '@/views/reportPublicacioPage.vue'
import reportCommentsPage from '@/views/reportCommentsPage.vue'
import notificationPage from '../views/notifiationPage.vue'
import myPublications from '../views/myPublications.vue'
import myRequests from '../views/myRequests.vue'
import servicePage from '../views/servicesListPage.vue'
import stadisticsPage from '@/views/stadisticsPage.vue';
import requestsPage from '../views/mainRequests.vue'
import editProfilePage from '@/views/editProfilePage.vue';
import settingPage from '@/views/settingPage.vue';

const routes = [
  {
    path: '/login',
    name: 'login',
    component: loginPage,
  },
  {
    path: '/',
    name: 'main',
    component: mainPage,
  },
  {
    path: '/requests',
    name: 'requests',
    component: requestsPage,
  },
  {
    path: '/myprofile',
    name: 'myprofile',
    component: profilePage,
  },
  {
    path: '/addComunityPost',
    name: 'addComunityPost',
    component: addComunityPost,
  },
  {
    path: '/addRequestPost',
    name: 'addRequestPost',
    component: addRequestPost,
  },
  {
    path: '/profiles',
    name: 'profiles',
    component: profilesPage,
  },
  {
    path: '/report',
    name: 'reportPage',
    component: reportPage,
  },
  {
    path: '/mypublications',
    name: 'mypublications',
    component: myPublications,
  },
  {
    path: "/notifications",
    name: "notifications",
    component: notificationPage,
  },
  {
    path: '/myrequests',
    name: 'myrequests',
    component: myRequests,
  },
  {
    path: '/reportUserPage',
    name: 'reportUserPage',
    component: reportUserPage,
  },
  {
    path: '/reportPublicacioPage',
    name: 'reportPublicacioPage',
    component: reportPublicacioPage,
  },
  {
    path: '/reportCommentsPage',
    name: 'reportCommentsPage',
    component: reportCommentsPage,
  },
  {
    path: '/validation',
    name: 'validationPage',
    component: validationPage,
  },
  {
    path: '/validationInfo',
    name: 'validationUpdatePage',
    component: validationUpdatePage,
  },
  {
    path: '/chatList',
    name: 'chatListPage',
    component: chatListPage,
  },
  {
    path: '/services',
    name: 'servicePage',
    component: servicePage,
  },
  {
    path: '/stadistics',
    name: 'stadisticsPage',
    component: stadisticsPage
  }, 
  {
    path: '/editProfile/:editing',
    name: 'editProfilePage',
    component: editProfilePage,
    props: true
  },
  {
    path: '/settingPage',
    name: 'settingPage',
    component: settingPage,
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// Guardia de navegación para verificar si el usuario está verificado
router.beforeEach((to, from, next) => {
  const store = useAppStore();
  const user = store.user;

  // Si el usuario no está verificado y está intentando acceder a una ruta que no es permitida
  if (user && !user.verified) {
    // Si no está verificado, solo permite acceso a 'myprofile', 'main' y 'login'
    const allowedRoutes = ['login', 'main', 'myprofile', 'editProfilePage'];

    if (allowedRoutes.includes(to.name)) {
      next(); // Permitimos el acceso a las rutas permitidas
    } else {
      next({ name: 'myprofile' }); // Redirigimos al perfil si el usuario no está verificado
    }
  } else {
    next(); // Si está verificado o no hay usuario, permite el acceso
  }
});

export default router;