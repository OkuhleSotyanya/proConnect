import { createRouter, createWebHistory } from 'vue-router';
import Login from '../components/LoginComp.vue';
import Signup from '../components/Signup.vue';
import AdminDashboard from '../components/AdminDashboard.vue';
import ClientHome from '../components/ClientHome.vue';
import ContractorHome from '../components/ContractorHome.vue';

const routes = [
  { path: '/', component: Login },
  { path: '/signup', component: Signup },
  { 
    path: '/admin/dashboard', 
    component: AdminDashboard, 
    meta: { requiresAuth: true, role: 'admin' }
  },
  { 
    path: '/client/home', 
    component: ClientHome, 
    meta: { requiresAuth: true, role: 'client' }
  },
  { 
    path: '/contractor/home', 
    component: ContractorHome, 
    meta: { requiresAuth: true, role: 'contractor' }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  if (to.meta.requiresAuth && !token) {
    return next('/');
  }

  if (to.meta.role && to.meta.role !== role) {
    return next('/');
  }

  next();
});

export default router;