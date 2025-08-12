<template>
  <div class="centered-wrapper">
    <div class="col-md-6 col-lg-4">
      <div class="card shadow-sm p-4">
        <h2 class="card-title text-center mb-4">Sign Up for ProConnect</h2>
        <form @submit.prevent="handleSignup">
          <!-- Email -->
          <div class="mb-3">
            <label for="email" class="form-label">Email</label>
            <input v-model="form.email" type="email" id="email" class="form-control" required />
          </div>

          <!-- Password -->
          <div class="mb-3">
            <label for="password" class="form-label">Password</label>
            <input v-model="form.password" type="password" id="password" class="form-control" required />
          </div>

          <!-- Role Selection -->
          <div class="mb-3">
            <label class="form-label">Select Role</label>
            <div class="d-flex gap-2">
              <button type="button" :class="['btn flex-fill', form.role === 'client' ? 'btn-primary' : 'btn-outline-secondary']" @click="form.role = 'client'">Client</button>
              <button type="button" :class="['btn flex-fill', form.role === 'contractor' ? 'btn-primary' : 'btn-outline-secondary']" @click="form.role = 'contractor'">Contractor</button>
            </div>
          </div>

          <!-- Full Name -->
          <div class="mb-3">
            <label for="fullname" class="form-label">Full Name</label>
            <input v-model="form.fullname" type="text" id="fullname" class="form-control" required />
          </div>

          <!-- Phone Number -->
          <div class="mb-3">
            <label for="phone_number" class="form-label">Phone Number</label>
            <input v-model="form.phone_number" type="text" id="phone_number" class="form-control" required />
          </div>

          <!-- Address (NEW) -->
          <div class="mb-3">
            <label for="address" class="form-label">Address</label>
            <input v-model="form.address" type="text" id="address" class="form-control" required />
          </div>

          <!-- Contractor-only Fields -->
          <div v-if="form.role === 'contractor'" class="mb-3">
            <label for="certification_pdf" class="form-label">Certification PDF (URL)</label>
            <input v-model="form.certification_pdf" type="text" id="certification_pdf" class="form-control" required />
          </div>
          <div v-if="form.role === 'contractor'" class="mb-3">
            <label for="card_photo" class="form-label">Card Photo (URL)</label>
            <input v-model="form.card_photo" type="text" id="card_photo" class="form-control" required />
          </div>
          <div v-if="form.role === 'contractor'" class="mb-3">
            <label for="hourly_rate" class="form-label">Hourly Rate</label>
            <input v-model="form.hourly_rate" type="number" id="hourly_rate" class="form-control" required />
          </div>
          <div v-if="form.role === 'contractor'" class="mb-3">
            <label for="job_experience" class="form-label">Job Experience</label>
            <textarea v-model="form.job_experience" id="job_experience" class="form-control" required></textarea>
          </div>
          <div v-if="form.role === 'contractor'" class="mb-3">
            <label for="description" class="form-label">Description</label>
            <textarea v-model="form.description" id="description" class="form-control" required></textarea>
          </div>

          <!-- Submit -->
          <button type="submit" class="btn btn-primary w-100" :disabled="!form.role">Sign Up</button>
          <p v-if="error" class="text-danger mt-3 text-center">{{ error }}</p>
        </form>
        <p class="mt-3 text-center">
          Already have an account? <router-link to="/" class="text-primary">Login</router-link>
        </p>
      </div>
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
        address: '', // NEW FIELD
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
          phone_number: this.form.phone_number,
          address: this.form.address // Include address in payload
        };

        if (this.form.role === 'contractor') {
          payload.certification_pdf = this.form.certification_pdf;
          payload.card_photo = this.form.card_photo;
          payload.hourly_rate = parseFloat(this.form.hourly_rate);
          payload.job_experience = this.form.job_experience;
          payload.description = this.form.description;
        }

        await axios.post('http://localhost:3000/api/auth/signup', payload);
        this.$router.push('/');
      } catch (error) {
        this.error = error.response?.data?.message || 'Signup failed. Please try again.';
      }
    }
  }
};
</script>
