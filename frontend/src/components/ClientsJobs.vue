<template>
  <div class="client-jobs-page">
    <div class="header">
      <h2>My Jobs</h2>
      <button class="primary" @click="openCreateModal">Create Job</button>
    </div>

    <div v-if="loading" class="info">Loading your jobs...</div>
    <div v-else-if="error" class="error">{{ error }}</div>

    <div v-else>
      <table class="jobs-table" v-if="jobs.length">
        <thead>
          <tr>
            <th>#</th>
            <th>Service</th>
            <th>Description</th>
            <th>Contractor</th>
            <th>Job Date</th>
            <th>Hours</th>
            <th>Amount (R)</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(job, idx) in jobs" :key="job.job_id">
            <td>{{ idx + 1 }}</td>
            <td>{{ job.service_type }}</td>
            <td class="desc">{{ job.description }}</td>
            <td>{{ job.contractor_name || '—' }}</td>
            <td>{{ formatDate(job.job_date) }}</td>
            <td>{{ job.hours_to_work }}</td>
            <td>{{ job.amount }}</td>
            <td>
              <span :class="['badge', statusClass(job.status)]">{{ job.status }}</span>
            </td>
            <td>
              <button 
                v-if="job.status === 'request'" 
                class="action-btn edit" 
                @click="openEditModal(job)"
              >
                Edit
              </button>
              <button 
                v-if="job.status === 'request'" 
                class="action-btn delete" 
                @click="deleteJob(job.job_id)"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-else class="empty">
        <em>You haven’t created any jobs yet.</em>
      </div>
    </div>

    <!-- Create Job Modal -->
    <div v-if="showCreate" class="modal-overlay">
      <div class="modal-content">
        <h3>Create a Job</h3>
        <form @submit.prevent="submitCreate">
          <label>
            Contractor:
            <select v-model.number="createForm.contractor_id" required @change="recomputeAmount('create')">
              <option disabled value="">Select contractor</option>
              <option v-for="c in contractors" :key="c.user_id" :value="c.user_id">
                {{ c.full_name }} — R{{ c.hourly_rate }}/hr
              </option>
            </select>
          </label>

          <label>
            Service Type:
            <input v-model="createForm.service_type" type="text" required />
          </label>

          <label>
            Description:
            <textarea v-model="createForm.description" required></textarea>
          </label>

          <label>
            Location:
            <input v-model="createForm.location" type="text" required />
          </label>

          <label>
            Job Date:
            <input v-model="createForm.job_date" type="date" required />
          </label>

          <label>
            Hours to Work:
            <input v-model.number="createForm.hours_to_work" type="number" min="1" required @input="recomputeAmount('create')" />
          </label>

          <label>
            Amount (after 10% service fee):
            <input :value="createForm.amount" type="text" readonly />
          </label>

          <div class="actions">
            <button class="primary" type="submit">Create</button>
            <button type="button" @click="closeCreateModal">Cancel</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Edit Job Modal -->
    <div v-if="showEdit" class="modal-overlay">
      <div class="modal-content">
        <h3>Edit Job</h3>
        <form @submit.prevent="submitEdit">
          <label>
            Contractor:
            <select v-model.number="editForm.contractor_id" required @change="recomputeAmount('edit')">
              <option disabled value="">Select contractor</option>
              <option v-for="c in contractors" :key="c.user_id" :value="c.user_id">
                {{ c.full_name }} — R{{ c.hourly_rate }}/hr
              </option>
            </select>
          </label>

          <label>
            Service Type:
            <input v-model="editForm.service_type" type="text" required />
          </label>

          <label>
            Description:
            <textarea v-model="editForm.description" required></textarea>
          </label>

          <label>
            Location:
            <input v-model="editForm.location" type="text" required />
          </label>

          <label>
            Job Date:
            <input v-model="editForm.job_date" type="date" required />
          </label>

          <label>
            Hours to Work:
            <input v-model.number="editForm.hours_to_work" type="number" min="1" required @input="recomputeAmount('edit')" />
          </label>

          <label>
            Amount (after 10% service fee):
            <input :value="editForm.amount" type="text" readonly />
          </label>

          <div class="actions">
            <button class="primary" type="submit">Update</button>
            <button type="button" @click="closeEditModal">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter();
const clientId = ref(null);
const token = ref(null);

const jobs = ref([]);
const loading = ref(true);
const error = ref(null);

// Contractors for modal selector
const contractors = ref([]);
const showCreate = ref(false);
const showEdit = ref(false);

const createForm = ref({
  contractor_id: '',
  service_type: '',
  description: '',
  location: '',
  job_date: '',
  hours_to_work: 0,
  amount: 0
});

const editForm = ref({
  job_id: null,
  contractor_id: '',
  service_type: '',
  description: '',
  location: '',
  job_date: '',
  hours_to_work: 0,
  amount: 0
});

// Load initial
onMounted(async () => {
  const userStr = localStorage.getItem('user');
  token.value = localStorage.getItem('token');

  if (!userStr || !token.value) {
    alert('Please log in to access this page');
    router.push('/login');
    return;
  }

  const user = JSON.parse(userStr);
  if (user.role_id !== 2) {
    alert('Access restricted to clients only');
    router.push('/');
    return;
  }

  clientId.value = user.user_id;

  await Promise.all([fetchMyJobs(), fetchContractors()]);
});

const authHeader = computed(() => ({
  Authorization: `Bearer ${token.value}`
}));

const fetchMyJobs = async () => {
  loading.value = true;
  error.value = null;
  try {
    const res = await axios.get(`http://localhost:3000/api/jobRequests/client/${clientId.value}`, {
      headers: authHeader.value
    });
    jobs.value = res.data?.data || [];
  } catch (e) {
    console.error('Fetch jobs error:', e.response?.data || e.message);
    error.value = e.response?.data?.message || 'Failed to fetch your jobs';
  } finally {
    loading.value = false;
  }
};

const fetchContractors = async () => {
  try {
    const res = await axios.get('http://localhost:3000/contractors', {
      headers: authHeader.value
    });
    contractors.value = res.data?.data || [];
  } catch (e) {
    console.error(e);
  }
};

const openCreateModal = () => {
  showCreate.value = true;
  // reset form
  createForm.value = {
    contractor_id: '',
    service_type: '',
    description: '',
    location: '',
    job_date: '',
    hours_to_work: 0,
    amount: 0
  };
};

const closeCreateModal = () => {
  showCreate.value = false;
};

const openEditModal = (job) => {
  showEdit.value = true;
  editForm.value = {
    job_id: job.job_id,
    contractor_id: job.contractor_id,
    service_type: job.service_type,
    description: job.description || '',
    location: job.location || '',
    job_date: job.job_date.split('T')[0], // Format for date input
    hours_to_work: job.hours_to_work,
    amount: job.amount
  };
};

const closeEditModal = () => {
  showEdit.value = false;
};

// Compute amount after 10% service fee
const recomputeAmount = (formType) => {
  const form = formType === 'create' ? createForm.value : editForm.value;
  const selected = contractors.value.find(c => c.user_id === form.contractor_id);
  if (selected && form.hours_to_work > 0) {
    const total = Number(selected.hourly_rate) * Number(form.hours_to_work || 0);
    const serviceFee = total * 0.10;
    form.amount = Math.round(total - serviceFee);
  } else {
    form.amount = 0;
  }
};

const submitCreate = async () => {
  if (!clientId.value) {
    alert('Missing client id');
    return;
  }
  if (!token.value) {
    alert('Authentication token missing');
    return;
  }
  if (!createForm.value.contractor_id) {
    alert('Please select a contractor');
    return;
  }

  const payload = {
    client_id: Number(clientId.value),
    contractor_id: Number(createForm.value.contractor_id),
    service_type: createForm.value.service_type,
    description: createForm.value.description,
    location: createForm.value.location,
    job_date: createForm.value.job_date,
    hours_to_work: Number(createForm.value.hours_to_work),
    amount: Number(createForm.value.amount),
    status: 'request'
  };

  try {
    await axios.post('http://localhost:3000/api/jobRequests', payload, {
      headers: authHeader.value
    });
    closeCreateModal();
    await fetchMyJobs();
    alert('Job created successfully');
  } catch (e) {
    console.error('Create job error:', e.response?.data || e.message);
    alert('Failed to create job: ' + (e.response?.data?.message || 'Server error'));
  }
};

const submitEdit = async () => {
  if (!clientId.value) {
    alert('Missing client id');
    return;
  }
  if (!token.value) {
    alert('Authentication token missing');
    return;
  }
  if (!editForm.value.contractor_id) {
    alert('Please select a contractor');
    return;
  }

  const payload = {
    client_id: Number(clientId.value), // Added client_id
    contractor_id: Number(editForm.value.contractor_id),
    service_type: editForm.value.service_type,
    description: editForm.value.description,
    location: editForm.value.location,
    job_date: editForm.value.job_date,
    hours_to_work: Number(editForm.value.hours_to_work),
    amount: Number(editForm.value.amount)
  };

  try {
    await axios.patch(`http://localhost:3000/api/jobRequests/${editForm.value.job_id}`, payload, {
      headers: authHeader.value
    });
    closeEditModal();
    await fetchMyJobs();
    alert('Job updated successfully');
  } catch (e) {
    console.error('Update job error:', e.response?.data || e.message);
    alert('Failed to update job: ' + (e.response?.data?.message || 'Server error'));
  }
};

const deleteJob = async (jobId) => {
  if (!confirm('Are you sure you want to delete this job?')) return;

  try {
    await axios.delete(`http://localhost:3000/api/jobRequests/${jobId}`, {
      headers: authHeader.value,
      data: { client_id: Number(clientId.value) } // Added client_id in request body
    });
    await fetchMyJobs();
    alert('Job deleted successfully');
  } catch (e) {
    console.error('Delete job error:', e.response?.data || e.message);
    alert('Failed to delete job: ' + (e.response?.data?.message || 'Server error'));
  }
};

// Helpers
const formatDate = (d) => {
  if (!d) return '—';
  try {
    return new Date(d).toLocaleDateString();
  } catch {
    return d;
  }
};

const statusClass = (status) => {
  switch (String(status).toLowerCase()) {
    case 'request': return 'badge-gray';
    case 'pending': return 'badge-warning';
    case 'completed': return 'badge-success';
    case 'denied': return 'badge-danger';
    default: return 'badge-secondary';
  }
};
</script>

<style scoped>
.client-jobs-page {
  padding: 40px 20px;
  max-width: 1200px;
  margin: 0 auto;
  font-family: 'Inter', sans-serif;
  color: #1f2937;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.header h2 {
  font-size: 1.8rem;
  font-weight: 700;
  color: #111827;
}

.primary {
  background: linear-gradient(135deg, #2563eb, #3b82f6);
  color: #fff;
  border: none;
  padding: 10px 18px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;
  box-shadow: 0 4px 10px rgba(37, 99, 235, 0.25);
}
.primary:hover {
  background: linear-gradient(135deg, #1d4ed8, #2563eb);
  box-shadow: 0 6px 14px rgba(37, 99, 235, 0.35);
}

.info, .error {
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 20px;
  font-size: 0.95rem;
}
.info {
  background: #eef6ff;
  color: #1e3a8a;
}
.error {
  background: #ffeaea;
  color: #b91c1c;
}

/* ===== Table Styling ===== */
.jobs-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 6px 16px rgba(0,0,0,0.06);
}

.jobs-table thead th {
  background: #f9fafb;
  padding: 14px;
  text-align: left;
  font-weight: 600;
  font-size: 0.95rem;
  color: #374151;
  border-bottom: 1px solid #e5e7eb;
}

.jobs-table tbody td {
  padding: 14px;
  font-size: 0.95rem;
  color: #4b5563;
  border-top: 1px solid #f3f4f6;
}

.jobs-table tbody tr:hover {
  background: #f9fafc;
}

.jobs-table .desc {
  max-width: 300px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.empty {
  text-align: center;
  padding: 32px;
  background: #fafafa;
  border-radius: 12px;
  color: #6b7280;
}

/* ===== Status Badges ===== */
.badge {
  padding: 5px 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  display: inline-block;
  text-transform: capitalize;
}
.badge-gray { background: #e5e7eb; color: #111827; }
.badge-warning { background: #fef3c7; color: #92400e; }
.badge-success { background: #d1fae5; color: #065f46; }
.badge-danger { background: #fee2e2; color: #7f1d1d; }
.badge-secondary { background: #e0e7ff; color: #3730a3; }

/* ===== Modal Styling ===== */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.modal-content {
  background: white;
  width: 100%;
  max-width: 520px;
  padding: 28px 32px;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  animation: fadeIn 0.25s ease;
}

@keyframes fadeIn {
  from { transform: scale(0.95); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

.modal-content h3 {
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 1.4rem;
  font-weight: 700;
  text-align: center;
  color: #1f2937;
}

/* ===== Form Styling ===== */
.modal-content form label {
  display: block;
  margin-bottom: 16px;
  font-size: 0.9rem;
  font-weight: 600;
  color: #374151;
}

.modal-content input,
.modal-content textarea,
.modal-content select {
  width: 100%;
  padding: 12px 14px;
  margin-top: 6px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.95rem;
  color: #374151;
  background: #f9fafb;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
}
.modal-content input:focus,
.modal-content textarea:focus,
.modal-content select:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
  background: #fff;
}

.modal-content textarea {
  min-height: 100px;
  resize: vertical;
}

.actions {
  display: flex;
  gap: 12px;
  margin-top: 20px;
  justify-content: flex-end;
}

.actions button {
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.actions .primary {
  background: linear-gradient(135deg, #16a34a, #22c55e);
  color: white;
  box-shadow: 0 4px 10px rgba(34,197,94,0.25);
}
.actions .primary:hover {
  background: linear-gradient(135deg, #15803d, #16a34a);
  box-shadow: 0 6px 14px rgba(34,197,94,0.35);
}

.actions button[type="button"] {
  background: #f3f4f6;
  color: #374151;
}
.actions button[type="button"]:hover {
  background: #e5e7eb;
}

/* ===== Action buttons in table ===== */
.action-btn {
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 600;
  transition: all 0.2s ease;
  margin-right: 6px;
}

.action-btn.edit {
  background: #10b981;
  color: #fff;
  box-shadow: 0 3px 8px rgba(16,185,129,0.25);
}
.action-btn.edit:hover {
  background: #059669;
}

.action-btn.delete {
  background: #ef4444;
  color: #fff;
  box-shadow: 0 3px 8px rgba(239,68,68,0.25);
}
.action-btn.delete:hover {
  background: #dc2626;
}

</style>