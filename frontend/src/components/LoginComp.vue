<template>
  <div class="centered-wrapper">
    <div class="col-md-6 col-lg-4">
      <div class="card shadow-sm p-4">
        <h2 class="card-title text-center mb-4">Login to ProConnect</h2>
        <form @submit.prevent="handleLogin">
          <div class="mb-3">
            <label for="email" class="form-label">Email</label>
            <input v-model="email" type="email" id="email" class="form-control" required />
          </div>
          <div class="mb-3">
            <label for="password" class="form-label">Password</label>
            <input v-model="password" type="password" id="password" class="form-control" required />
          </div>
          <div class="mb-3">
            <label class="form-label">Select Role</label>
            <div class="d-flex gap-2">
              <button type="button" :class="['btn flex-fill', role === 'client' ? 'btn-primary' : 'btn-outline-secondary']" @click="role = 'client'">Client</button>
              <button type="button" :class="['btn flex-fill', role === 'contractor' ? 'btn-primary' : 'btn-outline-secondary']" @click="role = 'contractor'">Contractor</button>
              <button type="button" :class="['btn flex-fill', role === 'admin' ? 'btn-primary' : 'btn-outline-secondary']" @click="role = 'admin'">Admin</button>
            </div>
          </div>
          <button type="submit" class="btn btn-primary w-100" :disabled="!role">Login</button>
          <p v-if="error" class="text-danger mt-3 text-center">{{ error }}</p>
          <ul v-if="validationErrors.length" class="text-danger mt-3">
            <li v-for="(err, index) in validationErrors" :key="index">{{ err.msg }}</li>
          </ul>
        </form>
        <p class="mt-3 text-center">
          Don't have an account? <router-link to="/signup" class="text-primary">Sign Up</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'LoginForm',
  data() {
    return {
      email: '',
      password: '',
      role: '',
      error: '',
      validationErrors: []
    };
  },
  methods: {
    async handleLogin() {
      if (!this.role) {
        this.error = 'Please select a role';
        this.validationErrors = [];
        return;
      }
      try {
        const response = await axios.post('http://localhost:3000/api/auth/login', {
          email: this.email,
          password: this.password
        });

        const { token, user } = response.data;
        const roleMap = {
          1: 'admin',
          2: 'client',
          3: 'contractor'
        };
        const roleName = roleMap[user.role_id];

        if (!roleName) {
          this.error = 'Invalid role received from server';
          this.validationErrors = [];
          return;
        }

        if (roleName !== this.role.toLowerCase()) {
          this.error = `Selected role (${this.role}) does not match user role (${roleName}).`;
          this.validationErrors = [];
          return;
        }

        // Store token and user data
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

        // Route based on role
        switch (roleName) {
          case 'admin':
            this.$router.push('/admin/dashboard');
            break;
          case 'client':
            this.$router.push('/client/home');
            break;
          case 'contractor':
            this.$router.push('/contractor/home');
            break;
        }
      } catch (error) {
        this.validationErrors = error.response?.data?.errors || [];
        this.error = error.response?.data?.message || 'Login failed. Please try again.';
      }
    }
  }
};
</script>

<style scoped>
.centered-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
.card {
  border-radius: 10px;
}
.btn-primary {
  background-color: #007bff;
  border-color: #007bff;
}
.btn-primary:hover {
  background-color: #0056b3;
  border-color: #004085;
}
.form-control:focus {
  border-color: #007bff;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}
</style>