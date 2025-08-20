<template>
  <div class="bg-white shadow-md rounded-lg p-6">
    <h2 class="text-2xl font-bold mb-6">Client Profile</h2>
    
    <!-- Profile Section -->
    <div class="mb-8">
      <h3 class="text-xl font-semibold mb-4">Your Information</h3>
      <div v-if="profile" class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-gray-700">Email</label>
          <input v-model="profile.email" class="w-full p-2 border rounded" :disabled="!isEditing">
        </div>
        <div>
          <label class="block text-gray-700">Full Name</label>
          <input v-model="profile.fullname" class="w-full p-2 border rounded" :disabled="!isEditing">
        </div>
        <div>
          <label class="block text-gray-700">Phone Number</label>
          <input v-model="profile.phone_number" class="w-full p-2 border rounded" :disabled="!isEditing">
        </div>
        <div>
          <label class="block text-gray-700">Address</label>
          <input v-model="profile.address" class="w-full p-2 border rounded" :disabled="!isEditing">
        </div>
      </div>
      <div class="mt-4">
        <button v-if="!isEditing" @click="isEditing = true" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Edit Profile</button>
        <button v-else @click="updateProfile" class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Save Changes</button>
        <button v-if="isEditing" @click="isEditing = false" class="ml-2 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">Cancel</button>
      </div>
    </div>

    <!-- Jobs Section -->
    <div>
      <h3 class="text-xl font-semibold mb-4">Your Jobs</h3>
      <div class="mb-6">
        <h4 class="text-lg font-medium mb-2">Job Requests</h4>
        <div v-if="jobs.jobRequests && jobs.jobRequests.length" class="space-y-4">
          <div v-for="job in jobs.jobRequests" :key="job.job_id" class="border p-4 rounded">
            <p><strong>Service:</strong> {{ job.service_type }}</p>
            <p><strong>Description:</strong> {{ job.description }}</p>
            <p><strong>Location:</strong> {{ job.location }}</p>
            <p><strong>Date:</strong> {{ job.job_date }}</p>
            <p><strong>Status:</strong> {{ job.status }}</p>
            <p><strong>Amount:</strong> R{{ job.amount }}</p>
            <p><strong>Hours:</strong> {{ job.hours_to_work }}</p>
            <p><strong>Contractor:</strong> {{ job.contractor_email }}</p>
          </div>
        </div>
        <p v-else class="text-gray-600">No job requests found.</p>
      </div>
      <div>
        <h4 class="text-lg font-medium mb-2">Completed Jobs</h4>
        <div v-if="jobs.completedJobs && jobs.completedJobs.length" class="space-y-4">
          <div v-for="job in jobs.completedJobs" :key="job.completed_id" class="border p-4 rounded">
            <p><strong>Service:</strong> {{ job.service_type }}</p>
            <p><strong>Description:</strong> {{ job.description }}</p>
            <p><strong>Location:</strong> {{ job.location }}</p>
            <p><strong>Date:</strong> {{ job.job_date }}</p>
            <p><strong>Rating:</strong> {{ job.rating || 'Not rated' }}</p>
            <p><strong>Review:</strong> {{ job.review || 'No review' }}</p>
            <p><strong>Contractor:</strong> {{ job.contractor_email }}</p>
            <button @click="requestRefund(job.completed_id)" class="mt-2 bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">Request Refund</button>
          </div>
        </div>
        <p v-else class="text-gray-600">No completed jobs found.</p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'ClientsProfile',
  data() {
    return {
      profile: null,
      jobs: { jobRequests: [], completedJobs: [] },
      isEditing: false
    };
  },
  mounted() {
    this.fetchProfile();
    this.fetchJobs();
  },
  methods: {
    async fetchProfile() {
      try {
        const response = await axios.get('/api/profile', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        this.profile = response.data;
      } catch (error) {
        console.error(error);
        alert('Failed to load profile');
      }
    },
    async updateProfile() {
      try {
        const response = await axios.put('/api/profile/update', this.profile, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        this.profile = response.data.user;
        this.isEditing = false;
        alert('Profile updated successfully');
      } catch (error) {
        console.error(error);
        alert('Failed to update profile');
      }
    },
    async fetchJobs() {
      try {
        const response = await axios.get('/api/profile/jobs', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        this.jobs = response.data;
      } catch (error) {
        console.error(error);
        alert('Failed to load jobs');
      }
    },
    async requestRefund(completedId) {
      if (confirm('Are you sure you want to request a refund for this job?')) {
        try {
          await axios.post('/api/profile/refund', { completed_id: completedId }, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          });
          alert('Refund request submitted successfully');
        } catch (error) {
          console.error(error);
          alert('Failed to submit refund request');
        }
      }
    }
  }
}
</script>