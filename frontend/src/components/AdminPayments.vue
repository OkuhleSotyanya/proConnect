<template>
  <div class="payment-container">
    <section class="section">
      <h2>Client Payments</h2>
      <ul class="payment-list">
        <li v-for="(payment, index) in clientPayments" :key="index" class="payment-item">
          <span><strong>Client:</strong> {{ payment.client }}</span>
          <span><strong>Amount:</strong> R{{ payment.amount.toFixed(2) }}</span>
          <span><strong>Reason:</strong> {{ payment.reason }}</span>
        </li>
      </ul>

      <div class="summary">
        <p><strong>Total Received:</strong> R{{ totalClientRevenue.toFixed(2) }}</p>
        <p><strong>Deducted (10% Fee):</strong> R{{ totalDeducted.toFixed(2) }}</p>
        <p><strong>Sent to Contractors:</strong> R{{ totalContractorPayout.toFixed(2) }}</p>
      </div>

      <button @click="processPayments" class="btn process-btn">Process Payments</button>
    </section>

    <section class="section">
      <h2>Contractor Payments</h2>
      <ul class="payment-list">
        <li v-for="(payment, index) in contractorPayments" :key="index" class="payment-item">
          <span><strong>Contractor:</strong> {{ payment.contractor }}</span>
          <span><strong>Amount:</strong> R{{ payment.amount.toFixed(2) }}</span>
          <span><strong>Reason:</strong> {{ payment.reason }}</span>
          <a :href="payment.proof" target="_blank" download="payment_receipt.pdf">Download PDF</a>
        </li>
      </ul>
    </section>
  </div>
</template>

<script>
import jsPDF from 'jspdf';

export default {
  name: 'PaymentProcessor',
  data() {
    return {
      clientPayments: [
        { client: 'Client A', amount: 1000, reason: 'Website Design' },
        { client: 'Client B', amount: 2000, reason: 'Mobile App Development' }
      ],
      contractorPayments: [
        { contractor: 'Contractor X', amount: 0, reason: '', proof: '' },
        { contractor: 'Contractor Y', amount: 0, reason: '', proof: '' }
      ]
    };
  },
  computed: {
    totalClientRevenue() {
      return this.clientPayments.reduce((sum, payment) => sum + payment.amount, 0);
    },
    totalDeducted() {
      return this.totalClientRevenue * 0.1;
    },
    totalContractorPayout() {
      return this.totalClientRevenue * 0.9;
    }
  },
  methods: {
    processPayments() {
      this.contractorPayments = this.clientPayments.map((payment, index) => {
        const contractor = this.contractorPayments[index]?.contractor || `Contractor ${index + 1}`;
        const netAmount = payment.amount * 0.9;
        const reason = `Net payment after 10% fee for ${payment.reason}`;

        const doc = new jsPDF();
        doc.setFontSize(16);
        doc.text('Payment Receipt', 20, 20);
        doc.setFontSize(12);
        doc.text(`Contractor: ${contractor}`, 20, 40);
        doc.text(`Amount: R${netAmount.toFixed(2)}`, 20, 50);
        doc.text(`Reason: ${reason}`, 20, 60);
        doc.text(`Client: ${payment.client}`, 20, 70);

        const pdfBlob = doc.output('blob');
        const pdfUrl = URL.createObjectURL(pdfBlob);

        return {
          id: index + 1,
          contractor,
          amount: netAmount,
          reason,
          proof: pdfUrl
        };
      });
    }
  }
};
</script>

<style scoped>
.payment-container {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  padding: 30px;
  max-width: 800px;
  margin: auto;
  background-color: #f9f9f9;
  border-radius: 8px;
}

.section {
  margin-bottom: 40px;
}

h2 {
  color: #2c3e50;
  margin-bottom: 20px;
  border-bottom: 2px solid #ddd;
  padding-bottom: 5px;
}

.payment-list {
  list-style: none;
  padding: 0;
}

.payment-item {
  background-color: #fff;
  border: 1px solid #ddd;
  padding: 12px 16px;
  margin-bottom: 10px;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.summary {
  margin-top: 20px;
  font-size: 16px;
  color: #34495e;
}

a {
  color: #2980b9;
  text-decoration: none;
  font-weight: 500;
}

a:hover {
  text-decoration: underline;
}

.btn {
  display: inline-block;
  margin-top: 20px;
  padding: 10px 20px;
  font-size: 16px;
  border: none;
  border-radius: 6px;
}

.process-btn {
  background-color: #3498db;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.process-btn:hover {
  background-color: #2980b9;
}
</style>