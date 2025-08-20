<template>
  <div v-if="activePage === 'jobs'" class="jobs-section">
    <h2 class="heading">Jobs</h2>
    <div class="table-wrapper">
      <table class="jobs-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Status</th>
            <th>Client</th>
            <th>Contractor</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="job in jobs"
            :key="job.id"
            class="table-row"
          >
            <td>{{ job.title }}</td>
            <td>{{ job.status }}</td>
            <td>{{ job.client }}</td>
            <td>{{ job.contractor }}</td>
            <td>{{ job.description }}</td>
            <td class="actions-cell">
              <button
                @click="removeJob(job.id)"
                class="btn delete-btn"
              >
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
export default {
  name: 'JobsTable',
  data() {
    return {
      activePage: 'jobs',
      jobs: [
        {
          id: 1,
          title: 'Fix leaky faucet',
          status: 'Open',
          client: 'John Doe',
          contractor: 'Mike Contractor',
          description: 'Kitchen faucet leaking under the sink.'
        },
        {
          id: 2,
          title: 'Install new light fixture',
          status: 'In Progress',
          client: 'Jane Smith',
          contractor: 'Sara Builder',
          description: 'Replace old ceiling light with modern LED fixture.'
        }
      ]
    };
  },
  methods: {
    removeJob(id) {
      this.jobs = this.jobs.filter(job => job.id !== id);
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

/* Responsive tweaks */
@media (max-width: 768px) {
  .jobs-table th,
  .jobs-table td {
    padding: 10px 12px;
    font-size: 0.85em;
  }

  .btn {
    padding: 5px 10px;
    font-size: 0.8em;
  }
}

@media (max-width: 480px) {
  .heading {
    font-size: 1.4em;
    text-align: center;
  }

  .jobs-table {
    font-size: 0.8em;
    min-width: unset;
  }

  .btn {
    padding: 4px 8px;
  }
}
</style>