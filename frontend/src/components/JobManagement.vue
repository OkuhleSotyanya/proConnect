<template>
  <div v-if="activePage === 'jobs'" class="jobs-section">
    <h2 class="heading">Jobs</h2>
    
    <div v-if="loading" class="loading-message">Loading jobs...</div>
    <div v-else-if="error" class="error-message">Error: {{ error }}</div>
    <div v-else-if="jobs && jobs.length === 0" class="no-jobs-message">No jobs found.</div>

    <div v-else class="table-wrapper">
      <table class="jobs-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Description</th>
            <th>Status</th>
            <th>Client</th>
            <th>Contractor</th>
            <th>Amount</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="job in jobs" :key="job.job_id" class="table-row">
            <td>{{ job.job_id }}</td>
            <td>{{ job.description || 'N/A' }}</td>
            <td :class="statusClass(job.status)">{{ job.status }}</td>
            <td>{{ job.clientName || 'N/A' }}</td>
            <td>{{ job.contractorName || 'N/A' }}</td>
            <td>R{{ job.amount ? job.amount.toFixed(2) : 'N/A' }}</td>
            <td class="actions-cell">
              <button @click="removeJob(job.job_id, job.client_id)" class="btn delete-btn">
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'JobManagement',
  data() {
    return {
      activePage: 'jobs',
      jobs: [],
      loading: true,
      error: null
    };
  },
  mounted() {
    this.fetchJobs();
  },
  methods: {
    async fetchJobs() {
      const token = localStorage.getItem('token');
      if (!token) {
        this.loading = false;
        this.error = "Authentication token not found. Please log in as an admin.";
        return;
      }

      try {
        this.loading = true;
        this.error = null;

        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.get('http://localhost:3000/api/jobs/all', config);
        console.log('Fetched jobs:', response.data); // Debug log
        this.jobs = response.data;
      } catch (err) {
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          this.error = 'You are not authorized to view this page. Please log in as an admin.';
        } else {
          console.error('Error fetching jobs:', err.response ? err.response.data : err.message);
          this.error = 'Failed to fetch jobs. Please try again later.';
        }
      } finally {
        this.loading = false;
      }
    },
    async removeJob(jobId, clientId) {
      const token = localStorage.getItem('token');
      if (!token) {
        this.error = "Authentication token missing. Please log in.";
        return;
      }

      if (!confirm("Are you sure you want to delete this job?")) return;

      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        await axios.delete(`http://localhost:3000/api/jobRequests/${jobId}`, {
          ...config,
          data: { client_id: clientId } // Include client_id in request body
        });

        this.jobs = this.jobs.filter(job => job.job_id !== jobId);
        console.log(`Job with ID ${jobId} deleted successfully.`);
      } catch (err) {
        console.error('Error deleting job:', err.response ? err.response.data : err.message);
        this.error = 'Failed to delete job. Please try again.';
      }
    },
    statusClass(status) {
      switch ((status || '').toLowerCase()) {
        case 'completed': return 'status-completed';
        case 'pending': return 'status-pending';
        case 'request': return 'status-request';
        case 'denied': return 'status-denied';
        default: return '';
      }
    }
  }
};
</script>

<style scoped>
.jobs-section {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: #f4f4f4;
  padding: 20px;
  border-radius: 8px;
}

.heading {
  font-size: 1.8em;
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 20px;
}

.table-wrapper {
  overflow-x: auto;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.jobs-table {
  width: 100%;
  border-collapse: collapse;
  background-color: white;
  min-width: 800px;
}

.jobs-table th,
.jobs-table td {
  padding: 14px 18px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.jobs-table th {
  background-color: #f3f4f6;
  font-weight: 600;
  color: #555;
  text-transform: uppercase;
  font-size: 0.9em;
}

.jobs-table td {
  color: #333;
  font-size: 0.95em;
  vertical-align: top;
}

.table-row:hover {
  background-color: #f5f5f5;
  transition: background-color 0.2s ease;
}

.actions-cell {
  text-align: center;
}

.btn {
  padding: 6px 12px;
  font-size: 0.85em;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.delete-btn {
  background-color: #e74c3c;
  color: white;
  border: none;
}

.delete-btn:hover {
  background-color: #c0392b;
}

/* Status styling */
.status-completed { color: #27ae60; font-weight: bold; }
.status-pending { color: #f39c12; font-weight: bold; }
.status-request { color: #3498db; font-weight: bold; }
.status-denied { color: #c0392b; font-weight: bold; }

/* Responsive tweaks */
@media (max-width: 768px) {
  .jobs-table th, .jobs-table td { padding: 10px 12px; font-size: 0.85em; }
  .btn { padding: 5px 10px; font-size: 0.8em; }
}

@media (max-width: 480px) {
  .heading { font-size: 1.4em; text-align: center; }
  .jobs-table { font-size: 0.8em; min-width: unset; }
  .btn { padding: 4px 8px; }
}
</style>