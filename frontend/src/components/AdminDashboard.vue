<template>
  <div class="dashboard">
    

    <!-- Content -->
    <section class="dashboard-content">
      <!-- Overview Cards -->
      <div v-if="activePage === 'overview'">
        <h2>Overview</h2>
        <div class="card-container">
          <div class="card">
            <h3>Total Clients</h3>
            <p>{{ clients.length }}</p>
          </div>
          <div class="card">
            <h3>Total Contractors</h3>
            <p>{{ contractors.length }}</p>
          </div>
          <div class="card">
            <h3>Active Jobs</h3>
            <p>{{ jobs.filter(job => job.status === 'active').length }}</p>
          </div>
          <div class="card">
            <h3>Completed Jobs</h3>
            <p>{{ jobs.filter(job => job.status === 'completed').length }}</p>
          </div>
          <div class="card">
            <h3>Total Revenue</h3>
            <p>R{{ totalRevenue }}</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import AdminNav from './AdminNav.vue';
import AdminClients from './AdminClients.vue';
import JobManagement from './JobManagement.vue';
import AdminProfile from './AdminProfile.vue';
import RecentTransactions from './AdminPayments.vue';
import AdminContractors from './AdminContractors.vue';

export default {
  name: 'AdminDashboard',
  components: {
    AdminNav,
    AdminClients,
    JobManagement,
    AdminProfile,
    RecentTransactions,
    AdminContractors
  },
  data() {
    return {
      activePage: 'overview',
      clients: [],
      contractors: [],
      jobs: [],
      totalRevenue: 0
    };
  },
  methods: {
    setActive(page) {
      this.activePage = page;
    }
  },
  mounted() {
    // Mock data
    this.clients = [
      { id: 1, name: "John Doe", email: "john@example.com" },
      { id: 2, name: "Jane Smith", email: "jane@example.com" }
    ];

    this.contractors = [
      { id: 1, name: "Mike Johnson", specialty: "Plumbing" },
      { id: 2, name: "Sara Lee", specialty: "Electrical" }
    ];

    this.jobs = [
      { id: 1, title: "Fix sink", status: "active", price: 500 },
      { id: 2, title: "Install lights", status: "completed", price: 800 },
      { id: 3, title: "Repair AC", status: "active", price: 650 }
    ];

    this.totalRevenue = this.jobs.reduce((sum, job) => sum + job.price, 0);
  }
};
</script>

<style scoped>
.dashboard {
  font-family: Arial, sans-serif;
  padding: 20px;
}

.dashboard-header {
  background: #222;
  color: white;
  padding: 10px;
  border-radius: 5px;
}

.dashboard-nav {
  margin: 15px 0;
}

.dashboard-nav button {
  background: #444;
  color: white;
  padding: 8px 12px;
  margin-right: 5px;
  border: none;
  cursor: pointer;
  border-radius: 4px;
}

.dashboard-nav button:hover {
  background: #666;
}

.dashboard-content {
  background: #f4f4f4;
  padding: 15px;
  border-radius: 5px;
}

/* Cards for overview */
.card-container {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.card {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
  flex: 1 1 calc(25% - 15px);
  text-align: center;
  min-width: 150px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.2);
}

.card h3 {
  margin-bottom: 8px;
  font-size: 1.1em;
}

.card p {
  font-size: 1.4em;
  font-weight: bold;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

th, td {
  padding: 8px;
  border: 1px solid #ccc;
}

th {
  background: #ddd;
}

.payment-tables {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.payment-tables table {
  background: white;
}

.signout-btn {
  background: crimson;
  color: white;
  padding: 8px 14px;
  border: none;
  cursor: pointer;
  border-radius: 4px;
}

.signout-btn:hover {
  background: darkred;
}
</style>