import { createRouter, createWebHistory } from 'vue-router'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import DashboardView from '@/views/DashboardView.vue'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import GroceryTrackerView from '@/views/GroceryTrackerView.vue'
import ComingSoonView from '@/views/ComingSoonView.vue'
import { authService } from '@/services/api'

const routes = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterView,
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '/',
    component: DashboardLayout,
    meta: {
      requiresAuth: true
    },
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: DashboardView
      },
      {
        path: 'grocery',
        name: 'Grocery Tracker',
        component: GroceryTrackerView
      },
      {
        path: 'profile',
        name: 'Profile',
        component: () => import('@/views/ProfileView.vue')
      },
      {
        path: 'settings',
        name: 'Settings',
        component: () => import('@/views/SettingsView.vue')
      },
      {
        path: 'medication',
        name: 'Medication Tracker',
        component: ComingSoonView,
        props: { module: 'Medication Tracker' }
      },
      {
        path: 'expenses',
        name: 'Expense Tracker',
        component: ComingSoonView,
        props: { module: 'Expense Tracker' }
      },
      {
        path: 'fitness',
        name: 'Fitness Tracker',
        component: ComingSoonView,
        props: { module: 'Fitness Tracker' }
      },
      {
        path: 'tasks',
        name: 'Task Tracker',
        component: ComingSoonView,
        props: { module: 'Task Tracker' }
      },
      {
        path: 'subscriptions',
        name: 'Subscription Tracker',
        component: ComingSoonView,
        props: { module: 'Subscription Tracker' }
      },
      {
        path: 'documents',
        name: 'Document Tracker',
        component: ComingSoonView,
        props: { module: 'Document Tracker' }
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/dashboard'
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = authService.isAuthenticated();
  
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
  } else if (!to.meta.requiresAuth && isAuthenticated) {
    next('/dashboard')
  } else {
    next()
  }
})

export default router 