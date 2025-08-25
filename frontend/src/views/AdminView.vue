<template>
  <div>
    <Navbar :active-page="activePage" @set-active="setActive" />
    <div class="container mx-auto p-4">
      <!-- Dynamically display the active component -->
      <AdminDashboard v-if="activePage === 'overview'" />
      <AdminClients v-if="activePage === 'adminclients'" />
      <AdminContractors v-if="activePage === 'admincontractors'" />
      <JobManagement v-if="activePage === 'jobmanagement'" />
      <RecentTransactions v-if="activePage === 'recentransactions'" />
      <Refunds v-if="activePage === 'refunds'" />
      <AdminProfile v-if="activePage === 'adminprofile'" />
    </div>
  </div>
</template>

<script>
import Navbar from '@/components/AdminNav.vue';
import AdminDashboard from '@/components/AdminDashboard.vue';
import AdminClients from '@/components/AdminClients.vue';
import AdminContractors from '@/components/AdminContractors.vue';
import JobManagement from '@/components/JobManagement.vue';
import AdminPayments from '@/components/AdminPayments.vue';
import AdminRefunds from '@/components/AdminRefunds.vue';
import AdminProfile from '@/components/AdminProfile.vue';

export default {
  name: 'AdminView',
  components: {
    Navbar,
    AdminDashboard,
    AdminClients,
    AdminContractors,
    JobManagement,
    AdminPayments,
    AdminRefunds,
    AdminProfile
  },
  data() {
    return {
      activePage: 'overview' // Set initial page
    };
  },
  methods: {
    setActive(page) {
      this.activePage = page;
    }
  }
};
</script>

<style scoped>
/* You can add styles here if needed */
</style>
