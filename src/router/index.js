import { createRouter, createWebHistory } from 'vue-router'
import DocsPage from '@/components/DocsPage'
import NotFound from '@/components/NotFound'
import CSVKanban from '@/components/CSVKanban'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'CSVKanban',
      component: CSVKanban
    },
    {
      path: '/docs/:filename',
      name: 'Documentation',
      component: DocsPage
    },
    {
      path: '/:pathMatch(.*)*',
      name: '404',
      component: NotFound
    }
  ]
})
export default router
