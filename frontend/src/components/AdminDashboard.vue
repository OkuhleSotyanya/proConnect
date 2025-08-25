<template>
  <div class="dashboard-page">
  

    <!-- Main Content Area -->
    <main class="dashboard-content">
      <div v-if="activePage === 'overview'" class="content-section">
        <h2 class="section-heading">Overview</h2>
        <div class="card-container">
          <div class="card">
            <h3>Total Clients</h3>
            <p>{{ totalClients }}</p>
          </div>
          <div class="card">
            <h3>Total Contractors</h3>
            <p>{{ totalContractors }}</p>
          </div>
          <div class="card">
            <h3>Active Jobs</h3>
            <p>{{ activeJobs }}</p>
          </div>
          <div class="card">
            <h3>Completed Jobs</h3>
            <p>{{ completedJobs }}</p>
          </div>
          <div class="card">
            <h3>Total Revenue</h3>
            <p>R{{ totalRevenue.toLocaleString() }}</p>
          </div>
        </div>
      </div>

      <!-- Conditional Content Rendering -->
      <div v-if="activePage === 'adminclients'" class="content-section">
        <h2 class="section-heading">Client Management</h2>
        <AdminClients />
      </div>
      <div v-if="activePage === 'admincontractors'" class="content-section">
        <h2 class="section-heading">Contractor Management</h2>
        <AdminContractors />
      </div>
      <div v-if="activePage === 'jobmanagement'" class="content-section">
        <h2 class="section-heading">Job Management</h2>
        <JobManagement />
      </div>
      <div v-if="activePage === 'recentransactions'" class="content-section">
        <h2 class="section-heading">Recent Payments</h2>
        <AdminPayments />
      </div>
      <div v-if="activePage === 'refunds'" class="content-section">
        <h2 class="section-heading">Refund Requests</h2>
        <Refunds /> 
      </div>
      <div v-if="activePage === 'adminprofile'" class="content-section">
        <h2 class="section-heading">Admin Profile</h2>
        <AdminProfile />
      </div>
    </main>
  </div>
</template>

<script>
import AdminNav from './AdminNav.vue';
import AdminClients from './AdminClients.vue';
import JobManagement from './JobManagement.vue';
import AdminProfile from './AdminProfile.vue';
import AdminContractors from './AdminContractors.vue';
import Refunds from './AdminRefunds.vue';
import AdminPayments from './AdminPayments.vue';

export default {
  name: 'AdminDashboard',
  components: {
    AdminNav,
    AdminClients,
    JobManagement,
    AdminProfile,
    AdminPayments,
    AdminContractors,
    Refunds
  },
  data() {
    return {
      activePage: 'overview',
      totalClients: 153,
      totalContractors: 85,
      activeJobs: 42,
      completedJobs: 215,
      totalRevenue: 850300
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
.dashboard-page {
  font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc, #eef2f7);
  padding: 20px;
  color: #2c3e50;
}

/* Content Layout */
.dashboard-content {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

/* Section Styling */
.content-section {
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);
  padding: 30px;
  animation: fadeIn 0.4s ease;
}

.section-heading {
  font-size: 1.8rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 25px;
  position: relative;
}

.section-heading::after {
  content: '';
  display: block;
  width: 70px;
  height: 4px;
  background: linear-gradient(90deg, #3498db, #2ecc71);
  border-radius: 2px;
  margin-top: 8px;
}

/* Card Container for Overview */
.card-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 25px;
}

.card {
  background: #fff;
  border-radius: 12px;
  padding: 25px;
  text-align: center;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.06);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
  cursor: pointer;
}

.card:hover {
  transform: translateY(-6px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.card h3 {
  margin: 0 0 12px;
  font-size: 1rem;
  font-weight: 600;
  color: #555;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.card p {
  font-size: 2rem;
  font-weight: 700;
  color: #2c3e50;
  margin: 0;
}

/* Give revenue card a highlight */
.card:nth-child(5) {
  background: linear-gradient(135deg, #2ecc71, #27ae60);
  color: #fff;
}

.card:nth-child(5) h3 {
  color: #eafaf1;
  opacity: 0.9;
}

.card:nth-child(5) p {
  color: #fff;
}

/* Fade In Animation */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .dashboard-page {
    padding: 15px;
  }

  .section-heading {
    font-size: 1.5rem;
    text-align: center;
  }

  .card-container {
    gap: 15px;
  }

  .card {
    padding: 20px;
  }

  .card p {
    font-size: 1.6rem;
  }
}

</style>
