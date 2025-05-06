import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../views/Teachers/myCourses.vue'


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
          component: () => import('@/views/Teachers/assistence.vue')
        },
        {
          path: 'attendance/:courseId',
          name: 'attendance',
          component: () => import('../views/Teachers/Attendance/AttendanceView.vue'),
        },
        {
          path: 'grades',
          name: 'teacher-grades',
          component: () => import('@/views/Teachers/grades.vue')
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
      ]

    }
  ],
})

export default router
