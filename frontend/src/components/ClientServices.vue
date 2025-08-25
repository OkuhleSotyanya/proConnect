<template>
  <div class="client-services">
    <h1>Available Contractors</h1>
    <div v-if="loading">Loading contractors...</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else class="contractors-list">
      <div v-for="contractor in contractors" :key="contractor.user_id" class="contractor-card">
        <img :src="contractor.card_photo" alt="Contractor Photo" class="contractor-photo" />
        <h2>{{ contractor.full_name }}</h2>
        <p><strong>Phone:</strong> {{ contractor.phone_number }}</p>
        <p><strong>Address:</strong> {{ contractor.address || 'N/A' }}</p>
        <p><strong>Hourly Rate:</strong> R{{ contractor.hourly_rate }}</p>
        <p><strong>Experience:</strong> {{ contractor.job_experience }}</p>
        <p><strong>Description:</strong> {{ contractor.description }}</p>
        <button @click="openBookingModal(contractor)">Book Contractor</button>
      </div>
    </div>

    <!-- Booking Modal -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal-content">
        <h2>Book {{ selectedContractor.full_name }}</h2>
        <form @submit.prevent="submitBooking">
          <label>
            Service Type:
            <input v-model="form.service_type" type="text" required />
          </label>
          <label>
            Description:
            <textarea v-model="form.description" required></textarea>
          </label>
          <label>
            Location:
            <input v-model="form.location" type="text" required />
          </label>
          <label>
            Job Date:
            <input v-model="form.job_date" type="date" required />
          </label>
          <label>
            Hours to Work:
            <input v-model.number="form.hours_to_work" type="number" min="1" required @input="calculateAmount" />
          </label>
          <label>
            Amount (after 10% service fee):
            <input :value="form.amount" type="text" readonly />
          </label>
          <button type="submit">Submit Booking</button>
          <button type="button" @click="closeModal">Cancel</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { io } from 'socket.io-client';
import { useRouter } from 'vue-router';

const contractors = ref([]);
const loading = ref(true);
const error = ref(null);
const showModal = ref(false);
const selectedContractor = ref(null);
const router = useRouter();
const clientId = ref(null);
const socket = io('http://localhost:3000');

const form = ref({
  service_type: '',
  description: '',
  location: '',
  job_date: '',
  hours_to_work: 0,
  amount: 0
});

onMounted(() => {
  const user = localStorage.getItem('user');
  if (user) {
    const parsedUser = JSON.parse(user);
    clientId.value = parsedUser.user_id;
    if (parsedUser.role_id !== 2) { // Assuming 1 = client
      alert('Access restricted to clients only');
      router.push('/');
      return;
    }
  } else {
    alert('Please log in to access this page');
    router.push('/login');
    return;
  }

  fetchContractors();

  // Listen to job updates (optional if client wants confirmation)
  socket.on(`jobBookedForClient_${clientId.value}`, (job) => {
    alert(`Your job request for ${job.service_type} has been submitted!`);
  });
});

const fetchContractors = async () => {
  try {
    const response = await axios.get('http://localhost:3000/contractors');
    contractors.value = response.data.data;
  } catch (err) {
    error.value = 'Failed to load contractors';
  } finally {
    loading.value = false;
  }
};

const openBookingModal = (contractor) => {
  selectedContractor.value = contractor;
  form.value.amount = 0;
  form.value.hours_to_work = 0;
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  selectedContractor.value = null;
  form.value = {
    service_type: '',
    description: '',
    location: '',
    job_date: '',
    hours_to_work: 0,
    amount: 0
  };
};

const calculateAmount = () => {
  if (selectedContractor.value && form.value.hours_to_work > 0) {
    const total = selectedContractor.value.hourly_rate * form.value.hours_to_work;
    const serviceFee = total * 0.10;
    form.value.amount = Math.round(total - serviceFee);
  }
};

const submitBooking = async () => {
  if (!clientId.value) return alert('You must be logged in to book');

  const jobData = {
    client_id: parseInt(clientId.value),
    contractor_id: selectedContractor.value.user_id,
    service_type: form.value.service_type,
    description: form.value.description,
    location: form.value.location,
    job_date: form.value.job_date,
    status: 'request',
    amount: form.value.amount,
    hours_to_work: form.value.hours_to_work
  };

  try {
    await axios.post('http://localhost:3000/api/jobRequests', jobData);
    socket.emit('jobBooked', jobData); // Emit to backend
    alert('Booking submitted successfully');
    closeModal();
  } catch (err) {
    console.error('Booking error:', err.response?.data || err.message);
    alert('Failed to submit booking: ' + (err.response?.data?.message || 'Server error'));
  }
};
</script>

<style scoped>
.client-services {
  padding: 50px 20px;
  max-width: 1200px;
  margin: auto;
  font-family: 'Inter', sans-serif;
  background: linear-gradient(135deg, #f9fafc, #eef2f7);
  min-height: 100vh;
}

.client-services h1 {
  text-align: center;
  font-size: 2.4rem;
  font-weight: 700;
  color: #222;
  margin-bottom: 40px;
  letter-spacing: -0.5px;
}

.contractors-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 25px;
}

.contractor-card {
  background: #fff;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 8px 18px rgba(0,0,0,0.08);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  text-align: center;
}

.contractor-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 28px rgba(0,0,0,0.12);
}

.contractor-photo {
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-radius: 12px;
  margin-bottom: 15px;
}

.contractor-card h2 {
  font-size: 1.4rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 10px;
}

.contractor-card p {
  margin: 5px 0;
  font-size: 0.95rem;
  color: #555;
  text-align: left;
}

.contractor-card p strong {
  color: #222;
}

.contractor-card button {
  margin-top: 15px;
  padding: 10px 18px;
  border: none;
  border-radius: 8px;
  background: linear-gradient(135deg, #1e90ff, #4aa3ff);
  color: #fff;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 10px rgba(30, 144, 255, 0.3);
}

.contractor-card button:hover {
  background: linear-gradient(135deg, #187bcd, #339af0);
  box-shadow: 0 6px 14px rgba(30, 144, 255, 0.4);
}

/* ===== Modal Styling ===== */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.55);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

.modal-content {
  background: #fff;
  padding: 30px 35px;
  border-radius: 16px;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.15);
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from { transform: translateY(-20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.modal-content h2 {
  margin-bottom: 20px;
  font-size: 1.6rem;
  font-weight: 700;
  text-align: center;
  color: #2c3e50;
}

/* ===== Form Styling ===== */
.modal-content form label {
  display: block;
  margin-bottom: 15px;
  font-weight: 600;
  color: #333;
  font-size: 0.95rem;
}

.modal-content input,
.modal-content textarea {
  width: 100%;
  padding: 12px 14px;
  border: 1px solid #dcdcdc;
  border-radius: 8px;
  font-size: 0.95rem;
  color: #444;
  margin-top: 6px;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  background: #fafafa;
}

.modal-content input:focus,
.modal-content textarea:focus {
  outline: none;
  border-color: #1e90ff;
  box-shadow: 0 0 0 3px rgba(30, 144, 255, 0.15);
  background: #fff;
}

.modal-content textarea {
  min-height: 100px;
  resize: vertical;
}

/* Buttons in form */
.modal-content form button {
  padding: 10px 18px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-right: 10px;
  margin-top: 15px;
}

.modal-content form button[type="submit"] {
  background: linear-gradient(135deg, #28a745, #3edc81);
  color: white;
  box-shadow: 0 4px 10px rgba(40, 167, 69, 0.25);
}

.modal-content form button[type="submit"]:hover {
  background: linear-gradient(135deg, #218838, #2ecc71);
  box-shadow: 0 6px 14px rgba(40, 167, 69, 0.35);
}

.modal-content form button[type="button"] {
  background: #f1f1f1;
  color: #444;
}

.modal-content form button[type="button"]:hover {
  background: #e2e2e2;
}

</style>
