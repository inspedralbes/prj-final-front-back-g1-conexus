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
      path: '/canteen',
      name: 'canteen', 
      component: () => import('@/views/Canteen/index.vue')
    },
    {
      path: '/chat',
      name: 'chat',
      component: () => import('@/views/Chats/index.vue')
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('@/views/Profiles/index.vue')
    },
    {
      path: '/students',
      name: 'student',
      component: () => import('@/views/Students/index.vue')
    },
    {
      path: '/teachers',
      name: 'teacher',
      component: () => import('@/views/Teachers/index.vue'),
      children: [
        { 
          path: 'assistence',
          name: 'assistence',
          component: () => import('@/views/Teachers/assistence.vue')
        },
        {
          path: 'grades',
          name: 'grades',
          component: () => import('@/views/Teachers/grades.vue')
        },
        {
          path: 'roomReservation',
          name: 'roomReservation',
          component: () => import('@/views/Teachers/roomReservation.vue')
        }
      ]
    },
    {
      path: '/technicians',
      name: 'technicians',
      component: () => import('@/views/Technicians/index.vue')
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
