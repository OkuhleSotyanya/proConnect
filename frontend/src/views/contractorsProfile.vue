<template>
  <div class="contractor-profile">
    <h1>Contractor Profile</h1>

    <div v-if="loading">Loading profile...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    
    <div v-else class="profile-container">
      <div class="profile-info">
        <img
          v-if="profile.card_photo"
          :src="getFileUrl(profile.card_photo)"
          alt="Profile Photo"
          class="profile-photo"
        />
        <div class="profile-details" v-if="!isEditing">
          <p><strong>Full Name:</strong> {{ profile.full_name || 'Not provided' }}</p>
          <p><strong>Email:</strong> {{ profile.email }}</p>
          <p><strong>Phone Number:</strong> {{ profile.phone_number || 'Not provided' }}</p>
          <p><strong>Address:</strong> {{ profile.address || 'Not provided' }}</p>
          <p><strong>Hourly Rate:</strong> {{ formatCurrency(profile.hourly_rate) }}</p>
          <p><strong>Job Experience:</strong> {{ profile.job_experience || 'Not provided' }} years</p>
          <p><strong>Description:</strong> {{ profile.description || 'No description available' }}</p>
        </div>

        <!-- Edit Form -->
        <form v-if="isEditing" @submit.prevent="saveProfile" class="edit-form">
          <label>
            Full Name:
            <input v-model="editForm.full_name" type="text" required />
          </label>
          <label>
            Email:
            <input v-model="editForm.email" type="email" required />
          </label>
          <label>
            Phone Number:
            <input v-model="editForm.phone_number" type="text" pattern="\d{10}" />
          </label>
          <label>
            Address:
            <input v-model="editForm.address" type="text" />
          </label>
          <label>
            Hourly Rate (ZAR):
            <input v-model="editForm.hourly_rate" type="number" step="0.01" />
          </label>
          <label>
            Job Experience (years):
            <input v-model="editForm.job_experience" type="number" />
          </label>
          <label>
            Description:
            <textarea v-model="editForm.description"></textarea>
          </label>
          <label>
            Profile Photo:
            <input type="file" @change="handleFileChange('card_photo', $event)" />
          </label>
          <label>
            Certification PDF:
            <input type="file" @change="handleFileChange('certification_pdf', $event)" />
          </label>

          <div class="form-buttons">
            <button type="submit" :disabled="isSaving">Save</button>
            <button type="button" @click="cancelEdit">Cancel</button>
          </div>
        </form>
      </div>

      <button v-if="!isEditing" @click="editProfile">Edit Profile</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'ContractorProfile',
  data() {
    return {
      profile: {},
      loading: true,
      error: null,
      isEditing: false,
      isSaving: false,
      editForm: {
        full_name: '',
        email: '',
        phone_number: '',
        address: '',
        hourly_rate: '',
        job_experience: '',
        description: '',
      },
      files: {
        card_photo: null,
        certification_pdf: null,
      },
    };
  },
  async mounted() {
    await this.fetchProfile();
  },
  methods: {
    async fetchProfile() {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          this.error = 'Please log in to view your profile.';
          this.loading = false;
          this.$router.push('/login');
          return;
        }

        const response = await axios.get('http://localhost:3000/api/auth/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Ensure details is a single object
        const details = Array.isArray(response.data.details)
          ? response.data.details[0] || {}
          : response.data.details || {};
        this.profile = { email: response.data.user.email, ...details };
        this.loading = false;
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to load profile.';
        this.loading = false;
      }
    },
    getFileUrl(path) {
      return path ? `http://localhost:3000/Uploads/${path}` : '';
    },
    editProfile() {
      this.isEditing = true;
      this.editForm = { ...this.profile }; // prefill form
    },
    cancelEdit() {
      this.isEditing = false;
      this.files = { card_photo: null, certification_pdf: null };
    },
    handleFileChange(field, event) {
      this.files[field] = event.target.files[0];
    },
    formatCurrency(value) {
      if (!value && value !== 0) return 'Not set';
      return new Intl.NumberFormat('en-ZA', {
        style: 'currency',
        currency: 'ZAR',
      }).format(value);
    },
    async saveProfile() {
      try {
        this.isSaving = true;
        const token = localStorage.getItem('token');
        const formData = new FormData();
        Object.keys(this.editForm).forEach(key => {
          if (this.editForm[key] !== null && this.editForm[key] !== undefined)
            formData.append(key, this.editForm[key]);
        });

        if (this.files.card_photo) formData.append('card_photo', this.files.card_photo);
        if (this.files.certification_pdf) formData.append('certification_pdf', this.files.certification_pdf);

        const response = await axios.put('http://localhost:3000/api/auth/profile/update', formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });

        this.isEditing = false;
        this.isSaving = false;
        await this.fetchProfile(); // Refresh profile
        alert(response.data.message || 'Profile updated successfully!');
      } catch (err) {
        this.isSaving = false;
        alert(err.response?.data?.message || 'Failed to update profile.');
      }
    },
  },
};
</script>

<style scoped>
.contractor-profile {
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
  background: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.profile-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.profile-info {
  display: flex;
  width: 100%;
  margin-bottom: 2rem;
}

.profile-photo {
  width: 150px;
  height: 150px;
  object-fit: cover;
  border-radius: 8px;
  margin-right: 2rem;
  border: 1px solid #ddd;
}

.profile-details {
  flex: 1;
}

.profile-details p {
  margin: 0.5rem 0;
  font-size: 1.1rem;
}

.profile-details strong {
  color: #333;
}

.edit-form label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

.edit-form input,
.edit-form textarea {
  width: 100%;
  margin-bottom: 1rem;
  padding: 0.5rem;
  font-size: 1rem;
  border-radius: 4px;
  border: 1px solid #ccc;
}

.form-buttons {
  display: flex;
  gap: 1rem;
}

button {
  padding: 0.75rem 1.5rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.2s;
}

button:hover {
  background-color: #0056b3;
}

button:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}

.error {
  color: #dc3545;
  text-align: center;
}
</style>