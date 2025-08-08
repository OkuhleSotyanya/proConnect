<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
      <h2 class="text-2xl font-bold mb-6 text-center">Login to ProConnect</h2>
      <form @submit.prevent="handleLogin">
        <div class="mb-4">
          <label class="block text-gray-700 mb-2" for="email">Email</label>
          <input
            v-model="email"
            type="email"
            id="email"
            class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 mb-2" for="password">Password</label>
          <input
            v-model="password"
            type="password"
            id="password"
            class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div class="mb-6">
          <label class="block text-gray-700 mb-2">Select Role</label>
          <div class="flex space-x-4">
            <button
              type="button"
              :class="[
                'flex-1 p-3 rounded-lg',
                role === 'client' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
              ]"
              @click="role = 'client'"
            >
              Client
            </button>
            <button
              type="button"
              :class="[
                'flex-1 p-3 rounded-lg',
                role === 'contractor' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
              ]"
              @click="role = 'contractor'"
            >
              Contractor
            </button>
          </div>
        </div>
        <button
          type="submit"
          class="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600"
          :disabled="!role"
        >
          Login
        </button>
        <p v-if="error" class="text-red-500 mt-4 text-center">{{ error }}</p>
      </form>
      <p class="mt-4 text-center">
        Don't have an account? <router-link to="/signup" class="text-blue-500 hover:underline">Sign Up</router-link>
      </p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      email: '',
      password: '',
      role: '',
      error: ''
    };
  },
  methods: {
    async handleLogin() {
      if (!this.role) {
        this.error = 'Please select a role';
        return;
      }
      try {
        const response = await axios.post('http://localhost:3000/api/auth/login', {
          email: this.email,
          password: this.password,
          role: this.role
        });

        localStorage.setItem('token', response.data.token);
        localStorage.setItem('role', response.data.role);

        // Redirect based on role
        switch (response.data.role) {
          case 'admin':
            this.$router.push('/admin/dashboard');
            break;
          case 'client':
            this.$router.push('/client/home');
            break;
          case 'contractor':
            this.$router.push('/contractor/home');
            break;
          default:
            this.error = 'Invalid role';
        }
      } catch (err) {
        this.error = err.response?.data?.message || 'Login failed';
      }
    }
  }
};
</script>