import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { left: 0, top: 0 }
  },
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: () => import('../views/Auth/LoginView.vue'),
      meta: {
        title: 'Login',
        requiresAuth: false
      },
    },
    {
      path: '/register',
      name: 'Register',
      component: () => import('../views/Auth/RegisterView.vue'),
      meta: {
        title: 'Register',
        requiresAuth: false
      },
    },
    {
      path: '/forgot-password',
      name: 'Forgot Password',
      component: () => import('../views/Auth/ForgotPasswordView.vue'),
      meta: {
        title: 'Forgot Password',
        requiresAuth: false
      }
    },
    {
      path: '/reset-password',
      name: 'Reset Password',
      component: () => import('../views/Auth/ResetPasswordView.vue'),
      meta: {
        title: 'Reset Password',
        requiresAuth: false
      },
      beforeEnter: (to, from, next) => {
        const token = to.query.token
        const email = to.query.email

        if (!token || !email) {
          next('/login')
        } else {
          next()
        }
      }
    },
    {
      path: '/verify-email',
      name: 'Verify Email',
      component: () => import('../views/Auth/VerifyEmailView.vue'),
      meta: {
        title: 'Verify Email',
        requiresAuth: false
      },
      beforeEnter: (to, from, next) => {
        const email = to.query.email
        const hash = to.query.hash

        if (!email || !hash) {
          next('/login')
        } else {
          next()
        }
      }
    },
    {
      path: '/',
      name: 'Dashboard',
      component: () => import('../views/Dashboard/DashboardView.vue'),
      meta: {
        title: 'Dashboard',
        requiresAuth: true,
      },
    },
    {
      path: '/reports',
      name: 'Report',
      component: () => import('../views/Report/ReportView.vue'),
      meta: {
        title: 'Report',
        requiresAuth: true,
      },
    },
    {
      path: '/user-management',
      name: 'User Management',
      component: () => import('../views/UserManagement/UserManagementView.vue'),
      meta: {
        title: 'User Management',
        requiresAuth: true,
      },
    },
    {
      path: '/role-management',
      name: 'Role Management',
      component: () => import('../views/RoleManagement/RoleManagementView.vue'),
      meta: {
        title: 'Role Management',
        requiresAuth: true,
      },
    },
    {
      path: '/profile',
      name: 'Profile',
      component: () => import('../views/Others/UserProfile.vue'),
      meta: {
        title: 'Profile',
        requiresAuth: true,
      },
    },

    {
      path: '/:pathMatch(.*)*',
      name: '404 Error',
      component: () => import('../views/Errors/FourZeroFour.vue'),
      meta: {
        title: '404 Error',
      },
    },
  ],
})

export default router

router.beforeEach(async (to, from, next) => {
  document.title = `${to.meta.title} | Safety & Incident Report Systems`

  const auth = useAuthStore()
  if (!auth.user?.name && auth.isAuthenticated) {
    const res = await auth.profile()
    if (res.status === 'failed') {
      auth.clearAuth()
    }
  }

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    next('/login')
  } else if (!to.meta.requiresAuth && auth.isAuthenticated) {
    next('/')
  } else {
    next()
  }
})
