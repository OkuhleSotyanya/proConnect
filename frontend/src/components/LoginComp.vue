<template>
  <div class="login-page">
    <div class="login-container">
      <h2 class="form-title">Login to ProConnect</h2>
      <form @submit.prevent="handleLogin">
        <!-- Role Selection -->
        <section class="form-section">
          <label>Select Role</label>
          <div class="role-buttons">
            <button type="button" :class="{ selected: role==='client' }" @click="role='client'">Client</button>
            <button type="button" :class="{ selected: role==='contractor' }" @click="role='contractor'">Contractor</button>
            <button type="button" :class="{ selected: role==='admin' }" @click="role='admin'">Admin</button>
          </div>
        </section>
        <!-- Credentials -->
        <section class="form-section">
          <div class="mb-3">
            <label for="email">Email</label>
            <input v-model="email" type="email" id="email" placeholder="Enter your email" required />
          </div>
          <div class="mb-3">
            <label for="password">Password</label>
            <input v-model="password" type="password" id="password" placeholder="Enter your password" required />
          </div>
        </section>
        <button type="submit" :disabled="!role">Login</button>
        <p v-if="error" class="error-msg">{{ error }}</p>
        <p class="switch-link">Don't have an account? <router-link to="/signup">Sign Up</router-link></p>
      </form>
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
      error: ''
    };
  },
  methods: {
    async handleLogin() {
      if(!this.role){ 
        this.error='Please select a role'; 
        return; 
      }
      try {
        const response = await axios.post('http://localhost:3000/api/auth/login', {
          email: this.email,
          password: this.password
        });

        const { token, user } = response.data;
        const roleMap = { 1:'admin', 2:'client', 3:'contractor' };
        const roleName = roleMap[user.role_id];

        if(!roleName){
          this.error = 'Invalid role received from server';
          return;
        }

        if(roleName !== this.role.toLowerCase()){
          this.error = `Selected role (${this.role}) does not match user role (${roleName}).`;
          return;
        }

        // Store token & user info
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

        // Route based on role
        switch(roleName){
          case 'admin': this.$router.push('/admin/dashboard'); break;
          case 'client': this.$router.push('/client/home'); break;
          case 'contractor': this.$router.push('/contractor/home'); break;
        }
      } catch(err) {
        this.error = err.response?.data?.message || 'Login failed. Please try again.';
      }
    }
  }
}
</script>

<style scoped>
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #A8E6CF, #56AB7B);
  font-family: 'Poppins', sans-serif;
  padding: 20px;
  position: relative;
}
.login-page::before {
  content:'';
  position:absolute;
  inset:0;
  background: rgba(255,255,255,0.1);
  pointer-events:none;
}
.login-container {
  background: white;
  padding: 30px 40px;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0,0,0,0.1);
  width: 100%;
  max-width: 480px;
}
.form-title {
  text-align: center;
  margin-bottom: 25px;
  color: #2E7D32;
}
.form-section { margin-bottom: 20px; }
.mb-3 { margin-bottom: 15px; }
input {
  width: 100%;
  padding: 12px;
  border: 1px solid #CCE5CC;
  border-radius: 8px;
  font-size: 14px;
  transition: border 0.3s, box-shadow 0.3s;
}
input:focus {
  border-color: #2E7D32;
  box-shadow: 0 0 6px rgba(46,125,50,0.2);
  outline: none;
}
button {
  width: 100%;
  padding: 12px;
  background: #2E7D32;
  color: #fff;
  font-weight: 500;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s;
}
button:disabled { background: #A5D6A7; cursor: not-allowed; }
button:hover:not(:disabled) { background: #1B5E20; }
.role-buttons { display:flex; gap:10px; margin-top:5px; }
.role-buttons button {
  flex:1;
  padding: 10px 0;
  border-radius: 8px;
  border: 1px solid #CCE5CC;
  background: green;
  cursor:pointer;
  transition: all 0.3s;
}
.role-buttons button.selected {
  background: #2E7D32;
  color:white;
  border-color:#2e7d32;
}
.error-msg { color:#d32f2f; margin-top:10px; text-align:center; }
.switch-link { text-align:center; margin-top:15px; color:#2e7d32; }
.switch-link a { color:#2e7d32; font-weight:500; text-decoration:none; }
.switch-link a:hover { text-decoration:underline; }
</style>
