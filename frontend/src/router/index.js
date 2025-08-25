import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '../views/LoginView.vue';
import SignupView from '../views/SignupView.vue';
import ClientLayout from '@/components/ClientLayout.vue';
import AdminLayout from '@/components/AdminLayout.vue';
import TermsView from '../views/terms.vue';
import PrivacyView from '../views/privacy.vue';
import ReturnsView from '../views/return.vue';
import ContractorLayout from '@/components/ContractorLayout.vue';



const routes = [
  {
    path: '/login',
    name: 'Login',
    component: LoginView
  },
  {
    path: '/signup',
    name: 'Signup',
    component: SignupView
  },

   // Public pages
  { path: '/terms', name: 'Terms', component: TermsView },
  { path: '/privacy', name: 'Privacy', component: PrivacyView },
  { path: '/returns', name: 'Returns', component: ReturnsView },

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
      { path: 'jobs', name: 'JobManagement', component: () => import('@/components/JobManagement.vue') },
      {path: 'refunds', name: 'AdminRefunds', component: () => import('@/components/AdminRefunds.vue') }
    ]
  },

  // Client routes
  {
    path: '/client',
    component: ClientLayout,
    children: [
      { path: 'home', name: 'ClientHome', component: () => import('@/components/ClientHome.vue') },
      { path: 'services', name: 'ClientServices', component: () => import('@/components/ClientServices.vue') },
      { path: 'profile', name: 'ClientProfile', component: () => import('@/components/ClientsProfile.vue') },
      { path: 'MyJobs', name: 'ClientJobs', component: () => import('@/components/ClientsJobs.vue') }
    ]
  },

  {
    path: '/contractor',
    component: ContractorLayout,
    children: [
      {path: 'home', name: 'dashboard', component: () => import('@/views/contractorsDashboard.vue') },
      {path: 'jobs', name: 'jobs',component: () => import('@/views/contractorsJobs.vue')  },
      {path: 'profile', name: 'profile',component: () => import('@/views/contractorsProfile.vue')  },
      {path: 'pending', name: 'pending',component: () => import('@/views/contractorsPending.vue')  },
      {path: 'completed', name: 'completed',component: () => import('@/views/contractorsCompleted.vue')  }
    ]
  },

  
  // Redirect root to login
  { path: '/', redirect: '/login' },

  // Catch-all
  { path: '/:catchAll(.*)', redirect: '/login' }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
