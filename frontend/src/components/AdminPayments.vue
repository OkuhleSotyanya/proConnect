<template>
  <div class="payments-page">
    <h2>Payments</h2>
    
    <div v-if="loading" class="loading-message">Loading payments...</div>
    <div v-else-if="error" class="error-message">Error: {{ error }}</div>
    <div v-else-if="payments && payments.length === 0" class="no-payments-message">No payments found.</div>

    <div v-else class="table-wrapper">
      <table class="payments-table">
        <thead>
          <tr>
            <th>Job ID</th>
            <th>Client Name</th>
            <th>Contractor Name</th>
            <th>Description</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="payment in payments" :key="payment.id">
            <td>{{ payment.id }}</td>
            <td>{{ payment.clientName }}</td>
            <td>{{ payment.contractorName }}</td>
            <td>{{ payment.jobDescription }}</td>
            <td>R{{ payment.amount ? payment.amount.toFixed(2) : 'N/A' }}</td>
            <td :class="statusClass(payment.status)">{{ payment.status }}</td>
            <td>{{ formatDate(payment.date) }}</td>
            <td>
              <button class="download-btn" @click="generateReceipt(payment)">Download Receipt</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import jsPDF from 'jspdf';

export default {
  name: 'AdminPayments',
  data() {
    return {
      payments: [],
      loading: true,
      error: null
    };
  },
  mounted() {
    this.fetchPayments();
  },
  methods: {
    async fetchPayments() {
      const token = localStorage.getItem('token');
      
      if (!token) {
          this.loading = false;
          this.error = "Authentication token not found. Please log in again.";
          return;
      }
      
      try {
        this.loading = true;
        this.error = null;
        
        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        };

        const response = await axios.get('http://localhost:3000/api/admin/payments', config);
        this.payments = response.data;
      } catch (err) {
        // This is the key change to show a more detailed error
        console.error('Error fetching payments:', err.response ? err.response.data : err.message);
        const backendError = err.response && err.response.data && err.response.data.details;
        this.error = backendError || 'Failed to fetch payments. Please ensure you are logged in as an admin.';
      } finally {
        this.loading = false;
      }
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    },
    statusClass(status) {
      switch (status) {
        case 'completed':
          return 'status-completed';
        case 'accepted':
          return 'status-accepted';
        case 'pending':
          return 'status-pending';
        case 'in_progress':
          return 'status-in-progress';
        case 'rejected':
          return 'status-rejected';
        case 'cancelled':
          return 'status-cancelled';
        default:
          return '';
      }
    },
    generateReceipt(payment) {
      const doc = new jsPDF();
      doc.setFontSize(16);
      doc.text('Payment Receipt', 20, 20);
      doc.setFontSize(12);
      doc.text(`Job ID: ${payment.id}`, 20, 40);
      doc.text(`Client: ${payment.clientName}`, 20, 50);
      doc.text(`Contractor: ${payment.contractorName}`, 20, 60);
      doc.text(`Description: ${payment.jobDescription}`, 20, 70);
      doc.text(`Amount: R${payment.amount.toFixed(2)}`, 20, 80);
      doc.text(`Status: ${payment.status}`, 20, 90);
      doc.text(`Date: ${this.formatDate(payment.date)}`, 20, 100);
      
      doc.save(`receipt-job-${payment.id}.pdf`);
    }
  }
};
</script>

<style scoped>
.payments-page {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  padding: 20px;
  background-color: #f9f9f9;
}

.payments-page h2 {
  margin-bottom: 20px;
  color: #2c3e50;
  font-size: 1.8em;
}

.table-wrapper {
  overflow-x: auto;
}

.payments-table {
  width: 100%;
  border-collapse: collapse;
  background-color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  min-width: 800px;
}

.payments-table th,
.payments-table td {
  padding: 14px 18px;
  text-align: left;
  border-bottom: 1px solid #eee;
  vertical-align: top;
}

.payments-table th {
  background-color: #f0f0f0;
  font-weight: 600;
  color: #555;
  white-space: nowrap;
}

.payments-table td {
  color: #333;
  word-break: break-word;
}

.payments-table tr:hover {
  background-color: #f5f5f5;
}

.loading-message, .error-message, .no-payments-message {
  padding: 20px;
  text-align: center;
  font-size: 1.1em;
  color: #555;
}
.error-message {
  color: #e74c3c;
  font-weight: bold;
}

/* Status styling */
.status-completed {
  color: #27ae60;
  font-weight: bold;
}
.status-accepted {
  color: #3498db;
  font-weight: bold;
}
.status-pending {
  color: #f39c12;
  font-weight: bold;
}
.status-in-progress {
  color: #8e44ad;
  font-weight: bold;
}
.status-rejected {
  color: #c0392b;
  font-weight: bold;
}
.status-cancelled {
  color: #555;
  font-weight: bold;
}

.download-btn {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  font-size: 0.9em;
}
.download-btn:hover {
  background-color: #2980b9;
}

/* 📱 Responsive Styles */
@media (max-width: 1024px) {
  .payments-page h2 {
    font-size: 1.6em;
  }

  .payments-table th,
  .payments-table td {
    padding: 12px 14px;
    font-size: 0.95em;
  }
}

@media (max-width: 768px) {
  .payments-page h2 {
    font-size: 1.4em;
  }

  .payments-table th,
  .payments-table td {
    padding: 10px 12px;
    font-size: 0.9em;
  }
}

@media (max-width: 480px) {
  .payments-page {
    padding: 10px;
  }

  .payments-page h2 {
    font-size: 1.2em;
    text-align: center;
  }

  .payments-table {
    font-size: 0.85em;
    min-width: unset;
  }

  .payments-table th,
  .payments-table td {
    padding: 8px 10px;
  }
}
</style>
