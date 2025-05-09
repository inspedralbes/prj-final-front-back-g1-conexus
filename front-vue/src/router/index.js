import { createRouter, createWebHistory } from 'vue-router'
import { useAppStore } from '@/stores/index.js'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/index.vue'),
      meta: {
        requiresAuth: false,
      },
    },
    {
      path: '/students',
      name: 'student',
      component: () => import('@/views/Students/index.vue'),
      meta: {
        requiresAuth: true,
        allowedRoles: ['Estudiant'],
      },
      children: [
        {
          path: 'incidents',
          name: 'student-incidents',
          component: () => import('@/views/Incidents/index.vue')
        },
        { 
          path: 'assistence',
          name: 'student-assistence',
          component: () => import('@/views/Students/courseSelectorAttendance.vue')
        },
        {
          path: 'grades',
          name: 'student-grades',
          component: () => import('@/views/Students/courseSelectorGrades.vue')
        },
        {
          path: ':id/grades',
          name: 'grades-from-course-student',
          component: () => import('@/views/Students/grades.vue'),
        },
        {
          path: ':id/assistence',
          name: 'assistence-from-course-student',
          component: () => import('@/views/Students/assistence.vue'),
        },
      ]
    },
    
    {
      path: '/teachers',
      name: 'teacher',
      component: () => import('@/views/Teachers/index.vue'),
      meta: {
        requiresAuth: true,
        allowedRoles: ['Professor'],
      },
      children: [
        {
          path: 'canteen',
          name: 'teacher-canteen',
          component: () => import('@/views/Canteen/index.vue')
        },
        {
          path: 'chats',
          name: 'teacher-chats',
          component: () => import('@/views/Chats/index.vue')
        },
        {
          path: 'incidents',
          name: 'teacher-incidents',
          component: () => import('@/views/Incidents/index.vue')
        },
        {
          path: 'lost-objects',
          name: 'teacher-lost-objects',
          component: () => import('@/views/Teachers/lost-objects.vue')
        },
        { 
          path: 'assistence',
          name: 'teacher-assistence',
          component: () => import('@/views/Teachers/myCourses.vue')
        },
        {
          path: 'attendance/:courseId',
          name: 'attendance',
          component: () => import('../views/Teachers/Attendance/AttendanceView.vue'),
        },
        {
          path: 'grades',
          name: 'teacher-grades',
          component: () => import('@/views/Teachers/myCourses.vue')
        },
        {
          path: 'grades/:courseId',
          name: 'grades',
          component: () => import('../views/Teachers/Grades/GradesView.vue'),
        },
        {
          path: "grades/:courseId/CreateTask",
          name: "createTask",
          component: () => import('../views/Teachers/Grades/NewTask.vue'),
        },
        {
          path: "grades/:courseId/Task/:taskId",
          name: "evaluate",
          component: () => import('../views/Teachers/Grades/EvaluateTask.vue'),
        },
        {
          path: 'roomReservation',
          name: 'teacher-roomReservation',
          component: () => import('@/views/Teachers/roomReservation.vue')
        }
      ]
    },
    {
      path: '/technicians',
      name: 'technicians',
      component: () => import('@/views/Technicians/index.vue'),
      meta: {
        requiresAuth: true,
        allowedRoles: ['Tècnic'],
      },
      children: [
        {
          path: 'canteen',
          name: 'technician-canteen',
          component: () => import('@/views/Canteen/index.vue')
        },
        {
          path: 'chats',
          name: 'technician-chats',
          component: () => import('@/views/Chats/index.vue')
        },
        {
          path: 'incidents',
          name: 'technician-incidents',
          component: () => import('@/views/Technicians/incidents.vue')
        },
        {
          path: 'lost-objects',
          name: 'technician-lost-objects',
          component: () => import('@/views/Technicians/lost-objects.vue')
        },
        {
          path: 'assignations',
          name: 'technician-assignations',
          component: () => import('@/views/Incidents/assignations.vue')
        },
        {
          path: 'solutions',
          name: 'technician-solutions',
          component: () => import('@/views/Incidents/solutions.vue')
        },
      ]
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('@/views/Admin/index.vue'),
      meta: {
        requiresAuth: true,
        allowedRoles: ['Administrador'],
      },
      children: [
        {
          path: 'config-users',
          name: 'admin-config-users',
          component: () => import('@/views/Admin/users.vue')
        },
        {
          path: 'config-rooms',
          name: 'admin-config-rooms',
          component: () => import('@/views/Admin/rooms.vue')
        },
        {
          path: 'config-servers',
          name: 'admin-config-servers',
          // component: () => import('@/views/Admin/servers.vue')
        },
        {
          path: 'config-lost-objects',
          name: 'admin-config-lost-objects',
          component: () => import('@/views/Admin/lost-objects.vue')
        },
        {
          path: 'config-incidents',
          name: 'admin-config-incidents',
          component: () => import('@/views/Admin/incidents.vue')
        },
        {
          name:"new-room",
          path: 'new-room',
          component: () => import('@/views/Admin/newRoom.vue')
        },
        {
          name:"config-courses",
          path:"config-courses",
          component:()=>import('@/views/Admin/courses.vue')
        }
      ]
    },
    {
      path: '/unauthorized',
      name: 'Unauthorized',
      component: () => import('@/views/errors/Unauthorized.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('@/views/errors/NotFound.vue'),
      meta: { requiresAuth: false }
    }
  ],
})

router.beforeEach((to, from, next) => {
  const store = useAppStore();
  const isAuthenticated = !!store.getAccessToken();
  
  console.log('Navegando a:', to.path);
  console.log('¿Usuario autenticado?:', isAuthenticated);
  
  // Si la ruta requiere autenticación y el usuario no está autenticado
  if (to.meta.requiresAuth && !isAuthenticated) {
    console.log('Usuario no autenticado, redirigiendo a login');
    next({ name: 'home' });
    return;
  }
  
  // Si el usuario está autenticado y la ruta tiene restricción de roles
  if (isAuthenticated && to.meta.allowedRoles && to.meta.allowedRoles.length > 0) {
    const user = store.getUser();
    console.log('Datos de usuario:', user);
    
    let userRole = '';
    
    // Intentar obtener el rol del usuario
    if (user?.typeusers?.name) {
      userRole = user.typeusers.name;
    } else if (user?.typeUsers_id) {
      // Mapear ID a nombre de rol
      switch (Number(user.typeUsers_id)) {  // Asegurarnos que sea un número
        case 1: userRole = 'Estudiant'; break;
        case 2: userRole = 'Professor'; break;
        case 3: userRole = 'Administrador'; break;
        case 4: userRole = 'Tècnic'; break;
      }
    }
    
    console.log('Rol del usuario:', userRole);
    console.log('Roles permitidos para esta ruta:', to.meta.allowedRoles);
    
    // Verificar si tiene permiso para acceder a esta ruta
    const hasPermission = to.meta.allowedRoles.includes(userRole);
    console.log('¿Tiene permiso?:', hasPermission);
    
    if (!hasPermission) {
      console.log('Usuario no autorizado, redirigiendo a página de unauthorized');
      next({ name: 'Unauthorized' });
      return;
    }
  }
  
  // Si todo está bien, permitir la navegación
  next();
});

export default router
