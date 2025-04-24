import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/Teachers/myCourses.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      // component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/Attendance/:courseId',
      name: 'attendance',
      component: () => import('../views/Teachers/Attendance/AttendanceView.vue'),
    },
    {
      path: '/Grades/:courseId',
      name: 'grades',
      component: () => import('../views/Teachers/Grades/GradesView.vue'),
    }
  ],
})

export default router
