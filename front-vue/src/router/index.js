import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/index.vue')
    },
    {
      path: '/students',
      name: 'student',
      component: () => import('@/views/Students/index.vue'),
      children: [
        {
          path: 'incidents',
          name: 'student-incidents',
          component: () => import('@/views/Incidents/index.vue')
        },
        { 
          path: 'assistence',
          name: 'student-assistence',
          component: () => import('@/views/Students/assistence.vue')
        },
        {
          path: 'grades',
          name: 'student-grades',
          component: () => import('@/views/Students/grades.vue')
        }
      ]
    },
    {
      path: '/teachers',
      name: 'teacher',
      component: () => import('@/views/Teachers/index.vue'),
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
          path: 'assistence',
          name: 'teacher-assistence',
          component: () => import('@/views/Teachers/assistence.vue')
        },
        {
          path: 'grades',
          name: 'teacher-grades',
          component: () => import('@/views/Teachers/grades.vue')
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
          component: () => import('@/views/Incidents/index.vue')
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
      // children: [
      //   {
      //     // path: 'feedback',
      //     // name: 'adminFeedback',
      //     // component: () => import('@/views/admin/FeedbackView.vue')
      //   }
      // ]
    }
  ],
})

export default router
