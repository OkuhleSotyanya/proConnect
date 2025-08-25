<template>
  <div class="jobs-page">
    <h1>Completed Jobs</h1>

    <table v-if="jobCompletedInfo.length > 0" class="table table-striped table-bordered">
      <thead>
        <tr>
          <th>Service</th>
          <th>Description</th>
          <th>Amount (R)</th>
          <th>Client</th>
          <th>Date</th>
          <th>Location</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="job in jobCompletedInfo" :key="job.job_id">
          <td>{{ job.service_type }}</td>
          <td>{{ job.description }}</td>
          <td>{{ job.amount }}</td>
          <td>{{ job.client_name }} ({{ job.client_phone }})</td>
          <td>{{ job.job_date.split('T')[0] }}</td>
          <td>{{ job.location }}</td>
          <td>{{ job.status }}</td>
        </tr>
      </tbody>
    </table>

    <p v-else>No completed jobs yet.</p>
  </div>
</template>

<script>
import { computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { io } from 'socket.io-client';

export default {
  setup() {
    const store = useStore();
    const jobCompletedInfo = computed(() => store.state.jobCompletedInfo);

    let contractorId = null;
    const socket = io('http://localhost:3000');

    const fetchJobs = async () => {
      await store.dispatch('fetchJobCompleted', contractorId);
    };

    onMounted(() => {
      const user = localStorage.getItem('user');
      if (user) {
        const parsedUser = JSON.parse(user);
        contractorId = parsedUser.user_id;
        fetchJobs();

        // Real-time updates if jobs are completed elsewhere
        socket.on(`jobCompletedForContractor_${contractorId}`, () => {
          fetchJobs();
        });
      }
    });

    return { jobCompletedInfo };
  }
};
</script>

<style scoped>
.jobs-page {
  padding: 20px;
}
.table th, .table td {
  vertical-align: middle;
}
</style>
