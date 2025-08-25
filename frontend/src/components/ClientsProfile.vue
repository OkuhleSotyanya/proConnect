<template>
  <div class="profile-wrapper">
    <div class="container">
      <div class="card shadow-sm border-0">
        <div class="card-body p-4">
          <h2 class="card-title text-center mb-4">User Profile</h2>

          <div v-if="loading" class="d-flex justify-content-center align-items-center" style="min-height:200px;">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>

          <div v-else>
            <!-- Error Message -->
            <div v-if="error" class="alert alert-danger alert-dismissible fade show" role="alert">
              {{ error }}
              <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>

            <form @submit.prevent="updateProfile" class="needs-validation" novalidate>
              <!-- Email -->
              <div class="mb-4">
                <label for="email" class="form-label fw-medium">Email Address</label>
                <input
                  v-model="form.email"
                  type="email"
                  class="form-control form-control-lg"
                  :class="{ 'is-invalid': formErrors.email }"
                  id="email"
                  required
                />
                <div v-if="formErrors.email" class="invalid-feedback">
                  {{ formErrors.email }}
                </div>
              </div>

              <!-- Password -->
              <div class="mb-4">
                <label for="password" class="form-label fw-medium">Password (leave blank to keep current)</label>
                <input
                  v-model="form.password"
                  type="password"
                  class="form-control form-control-lg"
                  :class="{ 'is-invalid': formErrors.password }"
                  id="password"
                  placeholder="Enter new password"
                />
                <div v-if="formErrors.password" class="invalid-feedback">
                  {{ formErrors.password }}
                </div>
              </div>

              <!-- Admin Fields -->
              <div v-if="user && user.role_id === 1">
                <div class="mb-4">
                  <label for="address" class="form-label fw-medium">Address</label>
                  <input
                    v-model="form.address"
                    type="text"
                    class="form-control form-control-lg"
                    :class="{ 'is-invalid': formErrors.address }"
                    id="address"
                    placeholder="Enter your address"
                  />
                  <div v-if="formErrors.address" class="invalid-feedback">
                    {{ formErrors.address }}
                  </div>
                </div>
              </div>

              <!-- Client Fields -->
              <div v-if="user && user.role_id === 2">
                <div class="mb-4">
                  <label for="fullname" class="form-label fw-medium">Full Name</label>
                  <input
                    v-model="form.fullname"
                    type="text"
                    class="form-control form-control-lg"
                    :class="{ 'is-invalid': formErrors.fullname }"
                    id="fullname"
                    placeholder="Enter your full name"
                  />
                  <div v-if="formErrors.fullname" class="invalid-feedback">
                    {{ formErrors.fullname }}
                  </div>
                </div>
                <div class="mb-4">
                  <label for="phone_number" class="form-label fw-medium">Phone Number</label>
                  <input
                    v-model="form.phone_number"
                    type="text"
                    class="form-control form-control-lg"
                    :class="{ 'is-invalid': formErrors.phone_number }"
                    id="phone_number"
                    placeholder="e.g., 0823456789"
                  />
                  <div v-if="formErrors.phone_number" class="invalid-feedback">
                    {{ formErrors.phone_number }}
                  </div>
                </div>
                <div class="mb-4">
                  <label for="address" class="form-label fw-medium">Address</label>
                  <input
                    v-model="form.address"
                    type="text"
                    class="form-control form-control-lg"
                    :class="{ 'is-invalid': formErrors.address }"
                    id="address"
                    placeholder="Enter your address"
                  />
                  <div v-if="formErrors.address" class="invalid-feedback">
                    {{ formErrors.address }}
                  </div>
                </div>
              </div>

              <!-- Contractor Fields -->
              <div v-if="user && user.role_id === 3">
                <div class="mb-4">
                  <label for="full_name" class="form-label fw-medium">Full Name</label>
                  <input
                    v-model="form.full_name"
                    type="text"
                    class="form-control form-control-lg"
                    :class="{ 'is-invalid': formErrors.full_name }"
                    id="full_name"
                    placeholder="Enter your full name"
                  />
                  <div v-if="formErrors.full_name" class="invalid-feedback">
                    {{ formErrors.full_name }}
                  </div>
                </div>
                <div class="mb-4">
                  <label for="phone_number" class="form-label fw-medium">Phone Number</label>
                  <input
                    v-model="form.phone_number"
                    type="text"
                    class="form-control form-control-lg"
                    :class="{ 'is-invalid': formErrors.phone_number }"
                    id="phone_number"
                    placeholder="e.g., 0823456789"
                  />
                  <div v-if="formErrors.phone_number" class="invalid-feedback">
                    {{ formErrors.phone_number }}
                  </div>
                </div>
                <div class="mb-4">
                  <label for="address" class="form-label fw-medium">Address</label>
                  <input
                    v-model="form.address"
                    type="text"
                    class="form-control form-control-lg"
                    :class="{ 'is-invalid': formErrors.address }"
                    id="address"
                    placeholder="Enter your address"
                  />
                  <div v-if="formErrors.address" class="invalid-feedback">
                    {{ formErrors.address }}
                  </div>
                </div>
                <div class="mb-4">
                  <label for="certification_pdf" class="form-label fw-medium">Certification PDF URL</label>
                  <input
                    v-model="form.certification_pdf"
                    type="text"
                    class="form-control form-control-lg"
                    :class="{ 'is-invalid': formErrors.certification_pdf }"
                    id="certification_pdf"
                    placeholder="Enter certification URL"
                  />
                  <div v-if="formErrors.certification_pdf" class="invalid-feedback">
                    {{ formErrors.certification_pdf }}
                  </div>
                </div>
                <div class="mb-4">
                  <label for="card_photo" class="form-label fw-medium">Card Photo URL</label>
                  <input
                    v-model="form.card_photo"
                    type="text"
                    class="form-control form-control-lg"
                    :class="{ 'is-invalid': formErrors.card_photo }"
                    id="card_photo"
                    placeholder="Enter card photo URL"
                  />
                  <div v-if="formErrors.card_photo" class="invalid-feedback">
                    {{ formErrors.card_photo }}
                  </div>
                </div>
                <div class="mb-4">
                  <label for="hourly_rate" class="form-label fw-medium">Hourly Rate</label>
                  <input
                    v-model="form.hourly_rate"
                    type="number"
                    step="0.01"
                    class="form-control form-control-lg"
                    :class="{ 'is-invalid': formErrors.hourly_rate }"
                    id="hourly_rate"
                    placeholder="Enter hourly rate"
                  />
                  <div v-if="formErrors.hourly_rate" class="invalid-feedback">
                    {{ formErrors.hourly_rate }}
                  </div>
                </div>
                <div class="mb-4">
                  <label for="job_experience" class="form-label fw-medium">Job Experience</label>
                  <input
                    v-model="form.job_experience"
                    type="text"
                    class="form-control form-control-lg"
                    :class="{ 'is-invalid': formErrors.job_experience }"
                    id="job_experience"
                    placeholder="Enter job experience"
                  />
                  <div v-if="formErrors.job_experience" class="invalid-feedback">
                    {{ formErrors.job_experience }}
                  </div>
                </div>
                <div class="mb-4">
                  <label for="description" class="form-label fw-medium">Description</label>
                  <textarea
                    v-model="form.description"
                    class="form-control form-control-lg"
                    :class="{ 'is-invalid': formErrors.description }"
                    id="description"
                    rows="4"
                    placeholder="Enter a brief description"
                  ></textarea>
                  <div v-if="formErrors.description" class="invalid-feedback">
                    {{ formErrors.description }}
                  </div>
                </div>
              </div>

              <!-- Submit & Delete Buttons -->
              <div class="d-flex justify-content-between mt-4">
                <button
                  type="submit"
                  class="btn btn-primary btn-lg px-4"
                  :disabled="isSubmitting"
                >
                  {{ isSubmitting ? 'Updating...' : 'Update Profile' }}
                </button>
                <button
                  type="button"
                  class="btn btn-outline-danger btn-lg px-4"
                  :disabled="isSubmitting || (user && user.role_id === 1 && !allowAdminDelete)"
                  @click="deleteProfile"
                >
                  Delete Profile
                </button>
              </div>

              <!-- Admin Delete Option -->
              <div v-if="user && user.role_id === 1" class="form-check mt-4">
                <input
                  v-model="allowAdminDelete"
                  type="checkbox"
                  class="form-check-input"
                  id="allowAdminDelete"
                />
                <label for="allowAdminDelete" class="form-check-label">
                  Allow admin account deletion
                </label>
              </div>

              <!-- Success Message -->
              <div v-if="successMessage" class="alert alert-success alert-dismissible fade show mt-4" role="alert">
                {{ successMessage }}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'ClientProfile',
  data() {
    return {
      user: null,
      form: {
        email: '',
        password: '',
        fullname: '',
        phone_number: '',
        address: '',
        full_name: '',
        certification_pdf: '',
        card_photo: '',
        hourly_rate: '',
        job_experience: '',
        description: '',
      },
      formErrors: {},
      allowAdminDelete: false,
      loading: true,
      error: null,
      successMessage: null,
      isSubmitting: false,
    };
  },
  created() {
    this.fetchProfile();
  },
  methods: {
    getAuthHeader() {
      const token = localStorage.getItem('token');
      return token ? { Authorization: `Bearer ${token}` } : {};
    },
    async fetchProfile() {
      try {
        const response = await axios.get('http://localhost:3000/api/auth/profile', {
          headers: this.getAuthHeader(),
        });
        this.user = response.data.user;

        this.form = {
          email: this.user.email || '',
          password: '',
          ...(this.user.role_id === 1
            ? { address: response.data.details?.address || '' }
            : this.user.role_id === 2
            ? {
                fullname: response.data.details?.fullname || '',
                phone_number: response.data.details?.phone_number || '',
                address: response.data.details?.address || '',
              }
            : {
                full_name: response.data.details?.full_name || '',
                phone_number: response.data.details?.phone_number || '',
                address: response.data.details?.address || '',
                certification_pdf: response.data.details?.certification_pdf || '',
                card_photo: response.data.details?.card_photo || '',
                hourly_rate: response.data.details?.hourly_rate?.toString() || '',
                job_experience: response.data.details?.job_experience || '',
                description: response.data.details?.description || '',
              }),
        };

        this.loading = false;
      } catch (err) {
        if ([401, 403].includes(err.response?.status)) {
          localStorage.removeItem('token');
          this.$router.push('/login');
        }
        this.error = err.response?.data?.message || 'Failed to fetch profile';
        this.loading = false;
      }
    },
    validateForm() {
      this.formErrors = {};
      let isValid = true;

      if (!this.form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.form.email)) {
        this.formErrors.email = 'Please enter a valid email address';
        isValid = false;
      }

      if (this.form.password && this.form.password.length < 6) {
        this.formErrors.password = 'Password must be at least 6 characters';
        isValid = false;
      }

      return isValid;
    },
    async updateProfile() {
      if (!this.validateForm()) return;
      this.error = null;
      this.successMessage = null;
      this.isSubmitting = true;

      try {
        const payload = {
          email: this.form.email,
          ...(this.form.password && { password: this.form.password }),
          ...(this.user.role_id === 1 && { address: this.form.address }),
          ...(this.user.role_id === 2 && {
            fullname: this.form.fullname,
            phone_number: this.form.phone_number,
            address: this.form.address,
          }),
          ...(this.user.role_id === 3 && {
            full_name: this.form.full_name,
            phone_number: this.form.phone_number,
            address: this.form.address,
            certification_pdf: this.form.certification_pdf,
            card_photo: this.form.card_photo,
            hourly_rate: parseFloat(this.form.hourly_rate) || undefined,
            job_experience: this.form.job_experience,
            description: this.form.description,
          }),
        };

        await axios.put('http://localhost:3000/api/auth/profile/update', payload, {
          headers: this.getAuthHeader(),
        });

        this.successMessage = 'Profile updated successfully!';
        await this.fetchProfile();
      } catch (err) {
        if ([401, 403].includes(err.response?.status)) {
          localStorage.removeItem('token');
          this.$router.push('/login');
        }
        this.error =
          err.response?.data?.errors?.map((e) => e.msg).join(', ') ||
          err.response?.data?.message ||
          'Failed to update profile';
      } finally {
        this.isSubmitting = false;
      }
    },
    async deleteProfile() {
      if (!confirm('Are you sure you want to delete your profile?')) return;
      this.error = null;
      this.successMessage = null;
      this.isSubmitting = true;

      try {
        await axios.delete('http://localhost:3000/api/auth/profile/delete', {
          headers: this.getAuthHeader(),
          data: { allowAdminDelete: this.allowAdminDelete },
        });
        localStorage.removeItem('token');
        alert('Profile deleted successfully!');
        this.$router.push('/login');
      } catch (err) {
        if ([401, 403].includes(err.response?.status)) {
          localStorage.removeItem('token');
          this.$router.push('/login');
        }
        this.error = err.response?.data?.message || 'Failed to delete profile';
      } finally {
        this.isSubmitting = false;
      }
    },
  },
};
</script>

<style scoped>
/* ===== Wrapper to center the card ===== */
.profile-wrapper {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f3f4f6;
  padding: 1rem;
}

/* ===== Container & Card ===== */
.container {
  max-width: 780px;
  margin: 0 auto;
}

.card {
  border-radius: 1rem;
  background: #ffffff;
  border: none;
  box-shadow: 0 6px 20px rgba(0,0,0,0.06);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.card:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 28px rgba(0,0,0,0.1);
}

.card-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: #1f2937;
  letter-spacing: -0.5px;
}

/* ===== Form Labels & Inputs ===== */
.form-label {
  font-size: 0.95rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 6px;
}

.form-control-lg {
  border-radius: 0.5rem;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  background: #f9fafb;
  border: 1px solid #d1d5db;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
}

.form-control-lg:focus {
  background: #fff;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37,99,235,0.15);
  outline: none;
}

textarea.form-control-lg {
  min-height: 120px;
  resize: vertical;
}

.is-invalid {
  border-color: #dc3545 !important;
}
.invalid-feedback {
  font-size: 0.85rem;
  margin-top: 4px;
}

/* ===== Buttons ===== */
.btn-lg {
  padding: 0.65rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  transition: all 0.25s ease;
}

.btn-primary {
  background: linear-gradient(135deg, #2563eb, #3b82f6);
  border: none;
  box-shadow: 0 4px 10px rgba(37,99,235,0.25);
}
.btn-primary:hover {
  background: linear-gradient(135deg, #1d4ed8, #2563eb);
  transform: translateY(-2px);
  box-shadow: 0 6px 14px rgba(37,99,235,0.35);
}

.btn-outline-danger {
  border: 2px solid #ef4444;
  color: #ef4444;
  font-weight: 600;
}
.btn-outline-danger:hover {
  background: #ef4444;
  color: white;
}
</style>