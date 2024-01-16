import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '../stores/user'

import LoginView from '../views/LoginView.vue'
import PageView from '../views/PageView.vue'
import ModulesView from '../views/ModulesView.vue'
import TipsView from '../views/TipsView.vue'
import AccountsView from '../views/AccountsView.vue'
import ModuleView from '../views/ModuleView.vue'
import ModulePartView from '../views/ModulePartView.vue'
import ModulePartElementView from '../views/ModulePartElementView.vue'

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
          component: ModulesView,
        },
        {
          path: '/tips',
          name: 'Tips',
          component: TipsView
        },
        {
          path: '/accounts',
          name: 'Accounts',
          component: AccountsView
        },
        {
          path: '/module/:id',
          name: 'Module',
          component: ModuleView
        },
        {
          path: '/module/:id/:part',
          name: 'ModulePart',
          component: ModulePartView
        },
        {
          path: '/module/:id/:part/:elt',
          name: 'ModulePartElement',
          component: ModulePartElementView
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

  if (to.name === 'Accounts' && !userStore.isAdmin) {
    return { name: 'Modules' }
  }

})

export default router
