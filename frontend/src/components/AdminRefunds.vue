<template>
  <div class="refunds-wrapper">
    <h2 class="page-title">Refund Requests Management</h2>

    <!-- Form to add refund -->
    <div class="card shadow-md">
      <div class="card-header">
        <h5 class="header-title">Add New Refund Request</h5>
      </div>
      <div class="card-body">
        <form @submit.prevent="addRefund" class="form-grid">
          <div class="form-group">
            <label class="form-label">Job ID</label>
            <input v-model="newRefund.job_id" type="number" class="form-input" placeholder="Enter Job ID" required />
          </div>
          <div class="form-group">
            <label class="form-label">Amount</label>
            <input v-model="newRefund.amount" type="number" step="0.01" class="form-input" placeholder="Enter Amount" required />
          </div>
          <div class="form-group">
            <label class="form-label">Reason</label>
            <input v-model="newRefund.reason" type="text" class="form-input" placeholder="Reason for refund" required />
          </div>
          <div class="form-actions">
            <button type="submit" class="btn btn-primary">Submit Refund</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Refunds Table -->
    <div class="card shadow-md">
      <div class="card-header">
        <h5 class="header-title">All Refund Requests</h5>
      </div>
      <div class="card-body table-responsive-wrapper">
        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Job ID</th>
              <th>Amount</th>
              <th>Reason</th>
              <th>Status</th>
              <th>Requested At</th>
              <th class="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="refund in refunds" :key="refund.id">
              <td>{{ refund.id }}</td>
              <td>{{ refund.job_id }}</td>
              <td>R {{ refund.amount.toFixed(2) }}</td>
              <td>{{ refund.reason }}</td>
              <td>
                <span
                  class="status-badge"
                  :class="refund.status"
                >
                  {{ refund.status }}
                </span>
              </td>
              <td>{{ formatDate(refund.created_at) }}</td>
              <td class="text-center">
                <button
                  class="btn btn-approve"
                  @click="updateStatus(refund.id, 'approved')"
                  :disabled="refund.status !== 'pending'"
                >
                  Approve
                </button>
                <button
                  class="btn btn-reject"
                  @click="updateStatus(refund.id, 'rejected')"
                  :disabled="refund.status !== 'pending'"
                >
                  Reject
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <p v-if="refunds.length === 0" class="empty-state">No refund requests found.</p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
// import { setAuthHeader } from "../utils/authMiddleware";

export default {
  name: "RefundsPage",
  data() {
    return {
      refunds: [],
      newRefund: {
        job_id: "",
        amount: "",
        reason: ""
      },
      // Simulating a dummy set of refunds for demonstration
      dummyRefunds: [
        { id: 'REF001', job_id: 101, amount: 250.00, reason: 'Unsatisfactory work', status: 'pending', created_at: '2025-08-21T10:00:00Z' },
        { id: 'REF002', job_id: 102, amount: 1200.00, reason: 'Job not completed', status: 'approved', created_at: '2025-08-20T12:30:00Z' },
        { id: 'REF003', job_id: 103, amount: 500.00, reason: 'Materials mismatch', status: 'pending', created_at: '2025-08-19T14:45:00Z' },
        { id: 'REF004', job_id: 104, amount: 750.00, reason: 'Incorrect service', status: 'rejected', created_at: '2025-08-18T09:15:00Z' },
      ]
    };
  },
  methods: {
    async fetchRefunds() {
      try {
        // Since you are using a localhost backend, this will work only when running locally.
        // I am using a dummy data set here to ensure the preview works.
        // Please replace with your actual API call.
        // await setAuthHeader();
        // const res = await axios.get("http://localhost:3000/api/refunds");
        // this.refunds = res.data;

        // Using dummy data for a working preview
        this.refunds = this.dummyRefunds;
      } catch (err) {
        console.error("Error fetching refunds:", err);
      }
    },
    async addRefund() {
      // In a real app, this would be an API call
      // await axios.post("http://localhost:3000/api/refunds/request", this.newRefund);
      
      const newId = `REF00${this.refunds.length + 1}`;
      const newEntry = {
        ...this.newRefund,
        id: newId,
        status: 'pending',
        created_at: new Date().toISOString()
      };
      this.refunds.unshift(newEntry); // Add to the beginning of the list

      this.newRefund = { job_id: "", amount: "", reason: "" };
    },
    async updateStatus(id, status) {
      // In a real app, this would be an API call
      // await axios.put(`http://localhost:3000/api/refunds/${id}/status`, { status });
      
      const refund = this.refunds.find(r => r.id === id);
      if (refund) {
        refund.status = status;
      }
    },
    formatDate(date) {
      if (!date) return '';
      return new Date(date).toLocaleString();
    }
  },
  mounted() {
    this.fetchRefunds();
  }
};
</script>

<style scoped>
/* GENERAL STYLES */
.refunds-wrapper {
  padding: 40px 20px;
  background-color: #f0f4f8;
  min-height: 100vh;
  font-family: 'Inter', sans-serif;
}

.page-title {
  font-size: 2.2rem;
  font-weight: 700;
  color: #2c3e50;
  text-align: center;
  margin-bottom: 40px;
  letter-spacing: -0.5px;
}

/* CARD STYLING */
.card {
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  margin-bottom: 30px;
  border: none;
}

.card-header {
  background: linear-gradient(135deg, #4a90e2, #50c4e7);
  padding: 16px 24px;
  color: #fff;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px 12px 0 0;
}

.header-title {
  margin: 0;
  font-size: 1.4rem;
  font-weight: 600;
}

.card-body {
  padding: 24px;
}

/* FORM STYLING */
.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  align-items: end;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-label {
  font-weight: 600;
  color: #4a5568;
  margin-bottom: 8px;
}

.form-input {
  width: 100%;
  padding: 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s, box-shadow 0.3s;
}

.form-input:focus {
  outline: none;
  border-color: #4a90e2;
  box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.2);
}

.form-actions {
  grid-column: 1 / -1;
  text-align: right;
  margin-top: 10px;
}

/* BUTTONS */
.btn {
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  border: none;
  transition: all 0.3s ease;
}

.btn-primary {
  background: linear-gradient(90deg, #4a90e2, #50c4e7);
  color: #fff;
}
.btn-primary:hover {
  opacity: 0.9;
  transform: translateY(-2px);
}

.btn-approve {
  background-color: #2ecc71;
  color: #fff;
}
.btn-approve:hover:not(:disabled) {
  background-color: #27ae60;
  transform: translateY(-2px);
}
.btn-approve:disabled {
  background-color: #d1d5db;
  cursor: not-allowed;
}

.btn-reject {
  background-color: #e74c3c;
  color: #fff;
  margin-left: 8px;
}
.btn-reject:hover:not(:disabled) {
  background-color: #c0392b;
  transform: translateY(-2px);
}
.btn-reject:disabled {
  background-color: #d1d5db;
  cursor: not-allowed;
}

/* TABLE STYLING */
.table-responsive-wrapper {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
}

.data-table th, .data-table td {
  padding: 16px 20px;
  text-align: left;
  border-bottom: 1px solid #f2f4f6;
}

.data-table th {
  background-color: #f8f9fa;
  color: #4a5568;
  font-weight: 700;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.data-table tbody tr {
  transition: background-color 0.3s ease;
}
.data-table tbody tr:hover {
  background-color: #f6faff;
}

.data-table tbody tr:last-child td {
  border-bottom: none;
}

.empty-state {
  text-align: center;
  color: #718096;
  padding: 20px;
  font-style: italic;
}

/* STATUS BADGES */
.status-badge {
  display: inline-block;
  padding: 6px 14px;
  border-radius: 50px;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: capitalize;
}

.status-badge.pending {
  background-color: #f1c40f;
  color: #2c3e50;
}

.status-badge.approved {
  background-color: #2ecc71;
  color: #fff;
}

.status-badge.rejected {
  background-color: #e74c3c;
  color: #fff;
}

.text-center {
  text-align: center;
}
</style>
