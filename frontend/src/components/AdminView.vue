<template>
    
    <div> 
        <Navbar />
        <div class="container mx-auto p-4">
            <AdminProfile />
            <AdminDashboard />
            <AdminClients />
            <JobManagement />
            <RecentTransactions />
            <AdminContractors />
        </div>
    </div>

</template>

<script>
import Navbar from '@/components/AdminNav.vue';
import AdminProfile from '@/components/AdminProfile.vue';
import AdminDashboard from '@/components/AdminDashboard.vue';
import AdminClients from '@/components/AdminClients.vue';
import JobManagement from '@/components/JobManagement.vue';
import RecentTransactions from '@/components/AdminPayments.vue';
import AdminContractors from '@/components/AdminContractors.vue';

//this should be showing the admin componnents information
export default {
  name: 'AdminView',
  components: {
    Navbar,
    AdminProfile,
    AdminDashboard,
    AdminClients,
    JobManagement,
    RecentTransactions,
    AdminContractors
  }
};


</script>