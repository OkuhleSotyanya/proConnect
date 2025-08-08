<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
      <h2 class="text-2xl font-bold mb-6 text-center">Sign Up for ProConnect</h2>
      <form @submit.prevent="handleSignup">
        <div class="mb-4">
          <label class="block text-gray-700 mb-2" for="email">Email</label>
          <input
            v-model="form.email"
            type="email"
            id="email"
            class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 mb-2" for="password">Password</label>
          <input
            v-model="form.password"
            type="password"
            id="password"
            class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 mb-2">Select Role</label>
          <div class="flex space-x-4">
            <button
              type="button"
              :class="[
                'flex-1 p-3 rounded-lg',
                form.role === 'client' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
              ]"
              @click="form.role = 'client'"
            >
              Client
            </button>
            <button
              type="button"
              :class="[
                'flex-1 p-3 rounded-lg',
                form.role === 'contractor' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
              ]"
              @click="form.role = 'contractor'"
            >
              Contractor
            </button>
          </div>
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 mb-2" for="fullname">Full Name</label>
          <input
            v-model="form.fullname"
            type="text"
            id="fullname"
            class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 mb-2" for="phone_number">Phone Number</label>
          <input
            v-model="form.phone_number"
            type="text"
            id="phone_number"
            class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div v-if="form.role === 'contractor'" class="mb-4">
          <label class="block text-gray-700 mb-2" for="certification_pdf">Certification PDF (URL)</label>
          <input
            v-model="form.certification_pdf"
            type="text"
            id="certification_pdf"
            class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div v-if="form.role === 'contractor'" class="mb-4">
          <label class="block text-gray-700 mb-2" for="card_photo">Card Photo (URL)</label>
          <input
            v-model="form.card_photo"
            type="text"
            id="card_photo"
            class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div vאי v-if="form.role === 'contractor'" class="mb-4">
          <label class="block text-gray-700 mb-2" for="hourly_rate">Hourly Rate</label>
          <input
            v-model="form.hourly_rate"
            type="number"
            id="hourly_rate"
            class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div v-if="form.role === 'contractor'" class="mb-4">
          <label class="block text-gray-700 mb-2" for="job_experience">Job Experience</label>
          <textarea
            v-model="form.job_experience"
            id="job_experience"
            class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          ></textarea>
        </div>
        <div v-if="form.role === 'contractor'" class="mb-6">
          <label class="block text-gray-700 mb-2" for="description">Description</label>
          <textarea
            v-model="form.description"
            id="description"
            class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          ></textarea>
        </div>
        <button
          type="submit"
          class="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600"
          :disabled="!form.role"
        >
          Sign Up
        </button>
        <p v-if="error" class="text-red-500 mt-4 text-center">{{ error }}</p>
      </form>
      <p class="mt-4 text-center">
        Already have an account? <router-link to="/" class="text-blue-500 hover:underline">Login</router-link>
      </p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      form: {
        email: '',
        password: '',
        role: '',
        fullname: '',
        phone_number: '',
        certification_pdf: '',
        card_photo: '',
        hourly_rate: '',
        job_experience: '',
        description: ''
      },
      error: ''
    };
  },
  methods: {
    async handleSignup() {
      if (!this.form.role) {
        this.error = 'Please select a role';
        return;
      }
      try {
        const payload = {
          email: this.form.email,
          password: this.form.password,
          role: this.form.role,
          fullname: this.form.fullname,
          phone_number: this.form.phone_number
        };

        if (this.form.role === 'contractor') {
          payload.certification_pdf = this.form.certification_pdf;
          payload.card_photo = this.form.card_photo;
          payload.hourly_rate = this.form.hourly_rate;
          payload.job_experience = this.form.job_experience;
          payload.description = this.form.description;
        }

        await axios.post('http://localhost:3000/api/auth/signup', payload);
        this.$router.push('/');
      } catch (err) {
        this.error = err.response?.data?.message || 'Signup failed';
      }
    }
  }
};
</script>