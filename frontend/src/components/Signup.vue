<template>
  <div class="login-page">
    <div class="signup-container">
      <h2 class="form-title">Sign Up for ProConnect</h2>
      <form @submit.prevent="handleSignup">
        <!-- Role Selection -->
        <section class="form-section">
          <label>Select Role</label>
          <div class="role-buttons">
            <button type="button" :class="{ selected: form.role === 'client' }" @click="form.role = 'client'">Client</button>
            <button type="button" :class="{ selected: form.role === 'contractor' }" @click="form.role = 'contractor'">Contractor</button>
          </div>
        </section>

        <!-- Full Name -->
        <section class="form-section">
          <div class="mb-3">
            <label for="fullname">Full Name</label>
            <input v-model="form.fullname" type="text" id="fullname" placeholder="John Doe" required />
          </div>
        </section>

        <!-- Email -->
        <section class="form-section">
          <div class="mb-3">
            <label for="email">Email</label>
            <input v-model="form.email" type="email" id="email" placeholder="example@mail.com" required />
          </div>
        </section>

        <!-- Password -->
        <section class="form-section">
          <div class="mb-3">
            <label for="password">Password</label>
            <input v-model="form.password" type="password" id="password" placeholder="Enter password" required />
            <small v-if="form.password && form.password.length < 6" class="warning-text">
              Password must be at least 6 characters
            </small>
          </div>
        </section>

        <!-- Phone Number -->
        <section class="form-section">
          <div class="mb-3">
            <label for="phone_number">Phone Number</label>
            <input v-model="form.phone_number" type="text" id="phone_number" placeholder="0123456789" required />
            <small v-if="form.phone_number && !/^\d{10}$/.test(form.phone_number)" class="warning-text">
              Phone number must be 10 digits
            </small>
          </div>
        </section>

        <!-- Address -->
        <section class="form-section">
          <div class="mb-3">
            <label for="address">Address</label>
            <input v-model="form.address" type="text" id="address" placeholder="123 Main St, City" required />
          </div>
        </section>

        <!-- Contractor-only Fields -->
        <div v-if="form.role === 'contractor'">
          <section class="form-section">
            <div class="mb-3">
              <label for="certification_pdf">Certification PDF (URL)</label>
              <input v-model="form.certification_pdf" type="text" id="certification_pdf" placeholder="https://example.com/cert.pdf" required />
            </div>
          </section>
          <section class="form-section">
            <div class="mb-3">
              <label for="card_photo">Card Photo (URL)</label>
              <input v-model="form.card_photo" type="text" id="card_photo" placeholder="https://example.com/photo.jpg" required />
            </div>
          </section>
          <section class="form-section">
            <div class="mb-3">
              <label for="hourly_rate">Hourly Rate (ZAR)</label>
              <input v-model="form.hourly_rate" type="number" id="hourly_rate" placeholder="50" required />
            </div>
          </section>
          <section class="form-section">
            <div class="mb-3">
              <label for="job_experience">Job Experience</label>
              <textarea v-model="form.job_experience" id="job_experience" rows="2" placeholder="Describe your experience" required></textarea>
            </div>
          </section>
          <section class="form-section">
            <div class="mb-3">
              <label for="description">Description</label>
              <textarea v-model="form.description" id="description" rows="2" placeholder="Tell clients about your services" required></textarea>
            </div>
          </section>
        </div>

        <!-- Submit -->
        <button type="submit" :disabled="!form.role || form.password.length < 6 || (form.phone_number && !/^\d{10}$/.test(form.phone_number))">
          Sign Up
        </button>

        <p v-if="error" class="error-msg">{{ error }}</p>
        <ul v-if="validationErrors.length" class="error-msg">
          <li v-for="(err, index) in validationErrors" :key="index">{{ err.msg }}</li>
        </ul>

        <p class="switch-link">Already have an account? <router-link to="/login">Login</router-link></p>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  name: 'SignupForm',
  data() {
    return {
      form: {
        email: '',
        password: '',
        role: '',
        fullname: '',
        phone_number: '',
        address: '',
        certification_pdf: '',
        card_photo: '',
        hourly_rate: '',
        job_experience: '',
        description: ''
      },
      error: '',
      validationErrors: []
    };
  },
  methods: {
    async handleSignup() {
      if (!this.form.role) { this.error = 'Please select a role'; return; }
      if (this.form.password.length < 6) { this.error = 'Password must be at least 6 characters'; return; }
      if (!/^\d{10}$/.test(this.form.phone_number)) { this.error = 'Phone number must be 10 digits'; return; }

      try {
        const payload = { email: this.form.email, password: this.form.password, phone_number: this.form.phone_number, address: this.form.address };
        let endpoint = '';
        if (this.form.role === 'client') {
          endpoint = 'http://localhost:3000/api/auth/register/client';
          payload.fullname = this.form.fullname;
        } else if (this.form.role === 'contractor') {
          endpoint = 'http://localhost:3000/api/auth/register/contractor';
          payload.full_name = this.form.fullname;
          payload.certification_pdf = this.form.certification_pdf;
          payload.card_photo = this.form.card_photo;
          payload.hourly_rate = parseFloat(this.form.hourly_rate);
          payload.job_experience = this.form.job_experience;
          payload.description = this.form.description;
        } else {
          this.error = 'Invalid role selected';
          return;
        }

        const response = await axios.post(endpoint, payload);
        const { token, user } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        const roleMap = { 2: 'client', 3: 'contractor' };
        const roleName = roleMap[user.role_id];
        if (roleName === 'client') this.$router.push('/client/home');
        else if (roleName === 'contractor') this.$router.push('/contractor/home');
      } catch (err) {
        this.validationErrors = err.response?.data?.errors || [];
        this.error = err.response?.data?.message || 'Signup failed. Please try again.';
      }
    }
  }
}
</script>

<style scoped>
.login-page {
  margin: 0;
  padding: 20px;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #A8E6CF, #56AB7B);
  font-family: 'Poppins', sans-serif;
  position: relative;
  box-sizing: border-box;
  overflow-y: auto;
}
.login-page::before {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.1);
  pointer-events: none;
}
.signup-container {
  background: white;
  padding: 30px 40px;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 480px;
  max-height: 80vh;
  overflow-y: auto;
  box-sizing: border-box;
}
.form-title {
  text-align: center;
  margin-bottom: 25px;
  color: #2E7D32;
}
.form-section {
  margin-bottom: 20px;
}
.mb-3 {
  margin-bottom: 15px;
}
input, textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #CCE5CC;
  border-radius: 8px;
  font-size: 14px;
  transition: border 0.3s, box-shadow 0.3s;
}
input:focus, textarea:focus {
  border-color: #2E7D32;
  box-shadow: 0 0 6px rgba(46, 125, 50, 0.2);
  outline: none;
}
textarea {
  resize: vertical;
  min-height: 60px;
  max-height: 120px;
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
button:disabled {
  background: #A5D6A7;
  cursor: not-allowed;
}
button:hover:not(:disabled) {
  background: #1B5E20;
}
.role-buttons {
  display: flex;
  gap: 10px;
  margin-top: 5px;
}
.role-buttons button {
  flex: 1;
  padding: 10px 0;
  border-radius: 8px;
  border: 1px solid #CCE5CC;
  background: green;
  cursor: pointer;
  transition: all 0.3s;
}
.role-buttons button.selected {
  background: #2E7D32;
  color: white;
  border-color: #2E7D32;
}
.error-msg {
  color: #d32f2f;
  margin-top: 10px;
  text-align: center;
}
.warning-text {
  color: #d32f2f;
  font-size: 12px;
}
.switch-link {
  text-align: center;
  margin-top: 15px;
  color: #2E7D32;
}
.switch-link a {
  color: #2E7D32;
  font-weight: 500;
  text-decoration: none;
}
.switch-link a:hover {
  text-decoration: underline;
}
</style>