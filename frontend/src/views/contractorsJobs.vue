<template>
  <div class="jobs-page">
    <h1>Available Jobs</h1>
    <div v-for="job in jobRequests" :key="job.job_id" class="job-card">
      <h2>{{ job.service_type }}</h2>
      <p>{{ job.description }}</p>
      <p>R{{ job.amount }}</p>
      <p><strong>Client:</strong> {{ job.client_name }} ({{ job.client_phone }})</p>
      <p><strong>Date:</strong> {{ job.job_date.split('T')[0] }}</p>
      <p><strong>Location:</strong> {{ job.location }}</p>
      <p><strong>Client is awaiting</strong></p>
      <button @click="acceptJob(job.job_id)">Accept</button>
      <button class="deny" @click="denyJob(job.job_id)">Deny</button>
    </div>
    <p v-if="jobRequests.length === 0">No available jobs.</p>
  </div>
</template>

<script>
import { computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { io } from 'socket.io-client';

export default {
  setup() {
    const store = useStore();
    const router = useRouter();
    const jobRequests = computed(() => store.state.jobRequestInfo);

    let contractorId = null;
    const socket = io('http://localhost:3000');

    const fetchJobs = async () => {
      await store.dispatch('fetchJobRequest', contractorId);
      await store.dispatch('fetchJobPending', contractorId);
    };

    const acceptJob = async (job_id) => {
      await store.dispatch('acceptJob', { job_id, contractorId });
      fetchJobs();
    };

    const denyJob = async (job_id) => {
      await store.dispatch('denyJob', { job_id, contractorId });
      fetchJobs();
    };

    onMounted(() => {
      const user = localStorage.getItem('user');
      if (user) {
        const parsedUser = JSON.parse(user);
        contractorId = parsedUser.user_id;
        fetchJobs();

        // Real-time updates for new bookings
        socket.on(`newJobForContractor_${contractorId}`, () => {
          fetchJobs();
        });
      }
    });

    return { jobRequests, acceptJob, denyJob };
  }
};
</script>
<style>
.jobs-page {
  padding: 50px 20px;
  max-width: 1000px;
  margin: auto;
  font-family: 'Inter', sans-serif;
  background: linear-gradient(135deg, #f5f7fa, #e9eff5);
  min-height: 100vh;
}

h1 {
  text-align: center;
  margin-bottom: 40px;
  font-size: 2.5rem;
  font-weight: 700;
  color: #222;
  letter-spacing: -0.5px;
}

.job-card {
  background: #fff;
  border-radius: 16px;
  padding: 25px 30px;
  margin-bottom: 25px;
  box-shadow: 0 8px 20px rgba(0,0,0,0.08);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  
}

.job-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 28px rgba(0,0,0,0.12);
}

.job-card h2 {
  margin: 0 0 10px;
  font-size: 1.5rem;
  color: #2c3e50;
}

.job-card p {
  margin: 6px 0;
  font-size: 1rem;
  color: #555;
}

.job-card p strong {
  color: #222;
}

button {
  padding: 10px 18px;
  cursor: pointer;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  margin-right: 10px;
  margin-top: 15px;
  transition: all 0.2s ease;
}

button:first-of-type {
  background: linear-gradient(135deg, #28a745, #3edc81);
  color: white;
  box-shadow: 0 4px 10px rgba(40, 167, 69, 0.3);
}

button:first-of-type:hover {
  background: linear-gradient(135deg, #218838, #2ecc71);
  box-shadow: 0 6px 14px rgba(40, 167, 69, 0.4);
}

button.deny {
  background: linear-gradient(135deg, #ff4d4d, #ff7676);
  color: white;
  box-shadow: 0 4px 10px rgba(255, 77, 77, 0.3);
}

button.deny:hover {
  background: linear-gradient(135deg, #e63946, #ff5252);
  box-shadow: 0 6px 14px rgba(230, 57, 70, 0.4);
}

button.completed {
  background: linear-gradient(135deg, #1e90ff, #4aa3ff);
  color: white;
  box-shadow: 0 4px 10px rgba(30, 144, 255, 0.3);
}

button.completed:hover {
  background: linear-gradient(135deg, #187bcd, #339af0);
  box-shadow: 0 6px 14px rgba(30, 144, 255, 0.4);
}

p[v-if] {
  text-align: center;
  font-size: 1.2rem;
  margin-top: 30px;
  color: #666;
}

</style>