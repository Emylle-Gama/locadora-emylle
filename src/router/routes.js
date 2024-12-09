const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/LoginPage.vue')
      },
      {
        path: '/dashboard',
        component: () => import('pages/DashboardPage.vue')
      },
      {
        path: '/livros',
        component: () => import('src/pages/LivrosList.vue')
      },
      {
        path: '/user',
        component: () => import('src/pages/CadUser.vue')
      },
      {
        path: '/locatarios',
        component: () => import('pages/CadLocatarios.vue')
      },
      {
        name: 'cadlivros',
        path: '/cadlivros',
        component: () => import('pages/CadLivros.vue')
      },
      {
        path: '/locadoras',
        component: () => import('pages/CadLocadoras.vue')
      },
      {
        path: '/aluguel',
        component: () => import('pages/RegAluguel.vue')
      },
      {
        path: '/locadoraslist',
        component: () => import('pages/LocadorasList.vue')
      },
      {
        path: '/usuarioslist',
        component: () => import('pages/UsuariosList.vue')
      },
      {
        path: '/locatarioslist',
        component: () => import('pages/LocatariosList.vue')
      },
      {
        path: '/aluguellist',
        component: () => import('pages/AluguelList.vue')
      },
      {
        path: '/reset-password',
        component: () => import('pages/ResetPassword.vue')
      }
    ]
  },

  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
