<template>
  <div class="jobs-page">
    <h1>Pending Jobs</h1>

    <table v-if="jobPendingInfo.length > 0" class="table table-striped table-bordered">
      <thead>
        <tr>
          <th>Service</th>
          <th>Description</th>
          <th>Amount (R)</th>
          <th>Client</th>
          <th>Date</th>
          <th>Location</th>
          <th>Status</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="job in jobPendingInfo" :key="job.job_id">
          <td>{{ job.service_type }}</td>
          <td>{{ job.description }}</td>
          <td>{{ job.amount }}</td>
          <td>{{ job.client_name }} ({{ job.client_phone }})</td>
          <td>{{ job.job_date.split('T')[0] }}</td>
          <td>{{ job.location }}</td>
          <td>{{ job.status }}</td>
          <td>
            <button 
              class="btn btn-success btn-sm"
              @click="completeJob(job.job_id)"
              :disabled="job.status !== 'pending'"
            >
              Completed
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <p v-else>No pending jobs.</p>
  </div>
</template>

<script>
import { computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { io } from 'socket.io-client';

export default {
  setup() {
    const store = useStore();
    const jobPendingInfo = computed(() => store.state.jobPendingInfo);

    let contractorId = null;
    const socket = io('http://localhost:3000');

    const completeJob = async (jobId) => {
      try {
        await store.dispatch('markCompleted', { jobId });
        alert('Job marked as completed!');
      } catch (err) {
        alert(err.response?.data?.message || 'Error completing job');
      }
    };

    const fetchJobs = async () => {
      await store.dispatch('fetchJobPending', contractorId);
      await store.dispatch('fetchJobCompleted', contractorId);
    };

    onMounted(() => {
      const user = localStorage.getItem('user');
      if (user) {
        const parsedUser = JSON.parse(user);
        contractorId = parsedUser.user_id;
        fetchJobs();

        socket.on(`newJobForContractor_${contractorId}`, () => {
          fetchJobs();
        });
      }
    });

    return { jobPendingInfo, completeJob };
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
.h1 {
  font-size: 1.5em;
  margin-bottom: 20px;
  text-align: center;
}
</style>
