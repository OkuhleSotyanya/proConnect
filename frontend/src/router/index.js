import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '../views/LoginView.vue';
import SignupView from '../views/SignupView.vue';
import ClientLayout from '@/components/ClientLayout.vue';
import AdminLayout from '@/components/AdminLayout.vue';


const routes = [
  {
    path: '/',
    name: 'Login',
    component: LoginView
  },
  {
    path: '/signup',
    name: 'Signup',
    component: SignupView
  },

  // Admin routes
  {
    path: '/admin',
    component: AdminLayout,
    children: [
      { path: 'dashboard', name: 'AdminDashboard', component: () => import('@/components/AdminDashboard.vue') },
      { path: 'clients', name: 'AdminClients', component: () => import('@/components/AdminClients.vue') },
      { path: 'contractors', name: 'AdminContractors', component: () => import('@/components/AdminContractors.vue') },
      { path: 'profile', name: 'AdminProfile', component: () => import('@/components/AdminProfile.vue') },
      { path: 'payments', name: 'AdminPayments', component: () => import('@/components/AdminPayments.vue') },
      { path: 'jobs', name: 'JobManagement', component: () => import('@/components/JobManagement.vue') }
      
    ]
  },

    // Client routes
  {
    path: '/client',
    component: ClientLayout,
    children: [
      // This is the key change: use the new ClientHome.vue component
      { path: 'home', name: 'ClientHome', component: () => import('@/components/ClientHome.vue') },
      { path: 'services', name: 'ClientServices', component: () => import('@/components/ClientServices.vue') },
      { path: 'profile', name: 'ClientsProfile', component: () => import('@/components/ClientsProfile.vue') }
      
    ]
  },
 
  // Default redirect
  { path: '/', redirect: '/client/home' }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;