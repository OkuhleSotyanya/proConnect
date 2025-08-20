<template>
  <div class="contractors-page">
    <h1>Contractors</h1>

    <div class="contractor-list">
      <div
        v-for="contractor in contractors"
        :key="contractor.id"
        class="contractor-card"
      >
        <img :src="contractor.image" alt="Contractor Image" class="contractor-image" />
        <h2>{{ contractor.name }}</h2>
        <p><strong>Rate:</strong> {{ contractor.hourlyrate }}</p>
        <p><strong>Profession:</strong> {{ contractor.profession }}</p>

        <div class="actions">
          <button class="btn primary" @click="viewProfile(contractor)">View Profile</button>
          <button class="btn secondary" @click="openBookingForm(contractor)">Book</button>
          <button class="btn download" @click="downloadCertificate(contractor)">Download Certificate</button>
        </div>
      </div>
    </div>

    <!-- Profile Modal -->
    <div v-if="selectedContractor && showProfileModal" class="modal-overlay" @click.self="closeProfile">
      <div class="modal-content profile-modal">
        <h2>{{ selectedContractor.name }}</h2>
        <img :src="selectedContractor.image" alt="Profile Image" class="profile-image" />
        <p><strong>Rate:</strong> {{ selectedContractor.hourlyrate }}</p>
        <p><strong>Profession:</strong> {{ selectedContractor.profession }}</p>
        <p>{{ selectedContractor.bio }}</p>
        <div class="modal-actions">
          <button class="btn close" @click="closeProfile">Close</button>
        </div>
      </div>
    </div>

    <!-- Booking Modal -->
    <div v-if="selectedContractor && showBookingForm" class="modal-overlay" @click.self="closeBookingForm">
      <div class="modal-content booking-modal">
        <h2>Book {{ selectedContractor.name }}</h2>
        <form @submit.prevent="submitBooking">
          <label>
            Service Type:
            <input v-model="form.service_type" required placeholder="e.g., Plumbing, Electrical" />
          </label>

          <label>
            Location:
            <input v-model="form.location" required placeholder="Enter job location" />
          </label>

          <label>
            Job Date:
            <input type="date" v-model="form.job_date" required />
          </label>

          <label>
            Amount (ZAR):
            <input type="number" v-model="form.amount" required min="0" step="0.01" placeholder="Enter total amount" />
          </label>

          <label>
            Hours to Work:
            <input type="number" v-model="form.hours_to_work" required min="0" step="0.1" placeholder="Enter hours" />
          </label>

          <label>
            Job Description:
            <textarea v-model="form.description" required placeholder="Describe the job"></textarea>
          </label>

          <div class="form-actions">
            <button type="submit" class="btn primary" :disabled="isSubmitting">Submit Request</button>
            <button type="button" class="btn close" @click="closeBookingForm">Cancel</button>
          </div>
          <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

const BASE_URL = 'http://localhost:3000';

function isAbsoluteUrl(url) {
  return /^https?:\/\//i.test(url);
}
function normalizeFileUrl(path) {
  if (!path) return '';
  // Trim whitespace and ensure absolute
  const trimmed = String(path).trim();
  if (!trimmed) return '';
  return isAbsoluteUrl(trimmed) ? trimmed : `${BASE_URL}${trimmed.startsWith('/') ? '' : '/'}${trimmed}`;
}

export default {
  name: "ClientsServices",
  data() {
    return {
      contractors: [],
      selectedContractor: null,
      showProfileModal: false,
      showBookingForm: false,
      form: {
        service_type: '',
        location: '',
        job_date: '',
        amount: '',
        hours_to_work: '',
        description: ''
      },
      isSubmitting: false,
      errorMessage: ''
    };
  },
  async created() {
    await this.fetchContractors();
  },
  methods: {
    async fetchContractors() {
      try {
        const response = await axios.get(`${BASE_URL}/api/contractors/list`, {
          params: {
            page: 1,
            limit: 10,
            sortBy: 'full_name',
            sortDir: 'asc'
          }
        });
        this.contractors = response.data.data.map(contractor => {
          const img = normalizeFileUrl(contractor.card_photo) || 'https://via.placeholder.com/400x250?text=No+Image';
          const cert = normalizeFileUrl(contractor.certification_pdf);
          return {
            id: contractor.user_id,
            name: contractor.full_name || contractor.email,
            hourlyrate: contractor.hourly_rate != null ? `R${contractor.hourly_rate}/hr` : 'Rate not set',
            profession: contractor.description || '—',
            bio: contractor.description || '',
            image: img,
            certification_pdf: cert
          };
        });
      } catch (error) {
        console.error('Error fetching contractors:', error);
        this.errorMessage = error?.response?.data?.message || 'Failed to load contractors. Please try again.';
      }
    },
    viewProfile(contractor) {
      this.selectedContractor = contractor;
      this.showProfileModal = true;
    },
    closeProfile() {
      this.showProfileModal = false;
      this.selectedContractor = null;
    },
    openBookingForm(contractor) {
      this.selectedContractor = contractor;
      this.showBookingForm = true;
    },
    closeBookingForm() {
      this.showBookingForm = false;
      this.selectedContractor = null;
      this.resetForm();
    },
    resetForm() {
      this.form = {
        service_type: '',
        location: '',
        job_date: '',
        amount: '',
        hours_to_work: '',
        description: ''
      };
      this.errorMessage = '';
    },
    async submitBooking() {
      this.isSubmitting = true;
      this.errorMessage = '';
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Please log in to book a contractor.');
        }
        // Basic front-end validation: ensure job_date is today or future
        if (!this.form.job_date) throw new Error('Please select a job date.');
        const today = new Date(); today.setHours(0,0,0,0);
        const chosen = new Date(this.form.job_date); chosen.setHours(0,0,0,0);
        if (chosen.getTime() < today.getTime()) {
          throw new Error('Job date cannot be in the past.');
        }

        const payload = {
          contractor_id: this.selectedContractor.id,
          service_type: this.form.service_type.trim(),
          description: this.form.description.trim(),
          location: this.form.location.trim(),
          amount: Number(this.form.amount),
          hours_to_work: Number(this.form.hours_to_work),
          job_date: this.form.job_date // YYYY-MM-DD
        };

        const response = await axios.post(
          `${BASE_URL}/api/jobs`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert(`Booking submitted for ${this.selectedContractor.name}.\nJob ID: ${response.data.job_id}`);
        this.closeBookingForm();
      } catch (error) {
        console.error('Error submitting booking:', error);
        this.errorMessage =
          error.response?.data?.error ||
          error.response?.data?.message ||
          error.message ||
          'Failed to submit booking. Please try again.';
      } finally {
        this.isSubmitting = false;
      }
    },
    downloadCertificate(contractor) {
      const href = normalizeFileUrl(contractor.certification_pdf);
      if (!href) {
        alert('Certificate not available for this contractor.');
        return;
      }
      // Create an anchor and click (works across most browsers)
      const link = document.createElement('a');
      link.href = href;
      link.download = `certificate_${(contractor.name || 'contractor')
        .replace(/\s+/g, '_')
        .replace(/[^a-zA-Z0-9_]/g, '')}.pdf`;
      link.target = '_blank';
      link.rel = 'noopener';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
};
</script>

<style scoped>
/* (unchanged styles) */
.contractors-page {
  padding: 20px;
}

.contractor-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.contractor-card {
  background: white;
  border-radius: 10px;
  padding: 15px;
  width: 250px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.contractor-image {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 8px;
}

.actions {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.btn {
  padding: 10px;
  border-radius: 6px;
  font-size: 0.9rem;
  border: none;
  cursor: pointer;
  transition: background 0.2s ease-in-out;
}

.btn.primary { background: #4caf50; color: white; }
.btn.primary:hover { background: #3d8b41; }
.btn.primary:disabled { background: #cccccc; cursor: not-allowed; }

.btn.secondary { background: #2196f3; color: white; }
.btn.secondary:hover { background: #1976d2; }

.btn.download { background: #ff9800; color: white; }
.btn.download:hover { background: #e68900; }

.btn.close { background: #f44336; color: white; }
.btn.close:hover { background: #d32f2f; }

.modal-overlay {
  position: fixed;
  top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex; justify-content: center; align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white; padding: 2rem; border-radius: 10px;
  width: 90%; max-width: 500px; max-height: 90vh; overflow-y: auto;
}

.profile-modal img { width: 100%; border-radius: 8px; margin-bottom: 1rem; }
.modal-actions { margin-top: 1rem; text-align: right; }

form { display: flex; flex-direction: column; gap: 1rem; }
label { display: flex; flex-direction: column; font-weight: 600; }

input, textarea {
  padding: 0.5rem; border: 1px solid #ccc; border-radius: 6px;
}

.error { color: #f44336; font-size: 0.9rem; margin-top: 0.5rem; }
</style>
