import { createRouter, createWebHistory } from 'vue-router'

import LoginView from '../views/LoginView.vue'
import PageView from '../views/PageView.vue'
import ModulesView from '../views/ModulesView.vue'
import TipsView from '../views/TipsView.vue'

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
          component: ModulesView
        },
        {
          path: '/tips',
          name: 'Astuces',
          component: TipsView
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

router.beforeEach(async (to, from) => {
  let isAuthenticated = true
  if (
    // make sure the user is authenticated
    !isAuthenticated && to.name !== 'Login'
  ) {
    // redirect the user to the login page
    return { name: 'Login' }
  }
})

export default router
