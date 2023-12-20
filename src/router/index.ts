import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '../stores/user'

import LoginView from '../views/LoginView.vue'
import PageView from '../views/PageView.vue'

// Init router
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Page',
      component: PageView,
      children: [
        {
          path: '/modules',
          name: 'Modules',
          component: PageView
        },
        {
          path: '/tips',
          name: 'Astuces',
          component: PageView
        },
        {
          path: '/accounts',
          name: 'Comptes',
          component: PageView
        }
      ]
    },
    {
      path: '/login',
      name: 'Login',
      component: LoginView
    }
  ]
})

// Check if the user is authenticated
router.beforeEach(async (to, from) => {

  // Get the stores
  const userStore = useUserStore()

  // Redirect the user if is not authenticated
  if (!userStore.isLoggedIn && to.name !== 'Login') {
    return { name: 'Login' }
  }

  if (to.name === 'Comptes' && !userStore.isAdmin) {
    return { name: 'Modules' }
  }

})

export default router
