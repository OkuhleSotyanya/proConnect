
<!-- <template>
  <div v-if="jobInvoice" class="invoice-download">
    <h2>Contractor Invoice</h2>
    <table>
     
      <tr><th>Invoice Date</th><td>{{ jobInvoice.invoice_date.split('T')[0]}}</td></tr>
      <tr><th>Status</th><td>{{ jobInvoice.status }}</td></tr>
      <tr><th>Contractor Name</th><td>{{ jobInvoice.con_name }}</td></tr>
       <tr><th>Contractor Contact</th><td>{{ jobInvoice.con_phone }}</td></tr>
      <tr><th>Service Type</th><td>{{ jobInvoice.service_type }}</td></tr>
      <tr><th>Description</th><td>{{ jobInvoice.description }}</td></tr>
      <tr><th>Job Date</th><td>{{ jobInvoice.job_date.split('T')[0] }}</td></tr>
      <tr><th>ProConnect Address</th><td>{{ jobInvoice.admin_address }}</td></tr>
      <tr><th>Hourly Rate</th><td>R {{ jobInvoice.con_hourly_rate }}</td></tr>
      <tr><th>Hours</th><td>{{ jobInvoice.hours_to_work }}</td></tr>
      <tr><th><strong>Total Amount (-10%)</strong></th><td><strong>R {{ jobInvoice.amount }}</strong></td></tr>

        
    </table>

        <button @click="downloadInvoicePDF">Download PDF</button>


  </div>

  <div v-else>
    <p>No invoice found for this job.</p>
  </div>
</template>





<script>
import { mapState } from 'vuex'
import jsPDF from 'jspdf';
import autoTable from "jspdf-autotable";

export default {
  props: {
    jobId: {
      type: Number,
      required: true
    }
  },
  computed: {
    ...mapState(['jobInvoicesInfo']),

    jobInvoice() {
      return this.jobInvoicesInfo.find(inv =>  inv.job_id === this.jobId)
    }
  },



  methods: {
  downloadInvoicePDF() {
    if (!this.jobInvoice) return;

    const doc = new jsPDF();

    // ---------- HEADER ----------
    doc.setFontSize(16);
    doc.text("Contractor Invoice", 105, 15, { align: "center" });

    doc.setFontSize(12);
    doc.text(`Invoice Date: ${this.jobInvoice.invoice_date.split('T')[0]}`, 150, 25);

    // Sender info (work address)
    doc.text("Sender:", 10, 30);
    doc.text("ProConnect Services", 10, 35);
    doc.text(this.jobInvoice.admin_address || '', 10, 40);

    // Recipient info (no address)
    doc.text("Recipient:", 120, 30);
    doc.text(this.jobInvoice.con_name, 120, 35);

    // ---------- BODY TABLE ----------
    const tableColumn = ["Field", "Details"];
    const tableRows = [
      ["Status", this.jobInvoice.status],
      ["Service Type", this.jobInvoice.service_type],
      ["Description", this.jobInvoice.description],
      ["Job Date", this.jobInvoice.job_date.split('T')[0]],
      ["Hourly Rate", `R ${this.jobInvoice.con_hourly_rate}`],
      ["Hours", this.jobInvoice.hours_to_work],
      ["Total Amount (-10%)", `R ${this.jobInvoice.amount}`]
    ];

    autoTable(doc, {
      startY: 50, // moved table slightly higher since recipient has no address
      head: [tableColumn],
      body: tableRows,
      theme: 'grid',
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
      styles: { fontSize: 12 }
    });

    doc.save(`Invoice_${this.jobInvoice.job_id}.pdf`);
  }
}


}

</script>





<style scoped>
.invoice-download {
  max-width: 700px;
  margin: 40px auto;
  padding: 30px;
  background: #fafafa;
  border: 1px solid #ddd;
  border-radius: 10px;
  font-family: Arial, sans-serif;
}

h2 {
  text-align: center;
  font-size: 1.6rem;
  margin-bottom: 25px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

th, td {
  border: 1px solid #ccc;
  padding: 12px 15px;
  font-size: 1rem;
  text-align: left;
}

th {
  background-color: #f0f0f0;
  font-weight: bold;
  width: 35%;
}

button {
  display: block;
  width: 100%;
  padding: 12px;
  background: #2c7a2c;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s ease;
}

button:hover {
  background: #256325;
}
</style>  -->



<template>
  <div v-if="isLoading" class="invoice-download">
    <p>Loading invoice data...</p>
  </div>

  <div v-else-if="!jobInvoice">
    <p>No invoice found for this job.</p>
  </div>

  <div v-else class="invoice-download">
    <h2>Contractor Invoice</h2>
    <table>
      <tr><th>Invoice Date</th><td>{{ jobInvoice.invoice_date.split('T')[0] }}</td></tr>
      <tr><th>Status</th><td>{{ jobInvoice.status }}</td></tr>
      <tr><th>Contractor Name</th><td>{{ jobInvoice.con_name }}</td></tr>
      <tr><th>Contractor Contact</th><td>{{ jobInvoice.con_phone }}</td></tr>
      <tr><th>Service Type</th><td>{{ jobInvoice.service_type }}</td></tr>
      <tr><th>Description</th><td>{{ jobInvoice.description }}</td></tr>
      <tr><th>Job Date</th><td>{{ jobInvoice.job_date.split('T')[0] }}</td></tr>
      <tr><th>ProConnect Address</th><td>{{ jobInvoice.admin_address }}</td></tr>
      <tr><th>Hourly Rate</th><td>R {{ jobInvoice.con_hourly_rate }}</td></tr>
      <tr><th>Hours</th><td>{{ jobInvoice.hours_to_work }}</td></tr>
      <tr><th><strong>Total Amount (-10%)</strong></th><td><strong>R {{ jobInvoice.amount }}</strong></td></tr>
    </table>

    <button @click="downloadInvoicePDF">Download PDF</button>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export default {
  props: {
    jobId: {
      type: Number,
      required: true
    }
  },
  computed: {
    ...mapState(['jobCompletedInfo']),
    jobInvoice() {
      return this.jobCompletedInfo.find(inv => inv.job_id === this.jobId)
    },
    isLoading() {
      return this.jobCompletedInfo.length === 0
    }
  },
  methods: {
    downloadInvoicePDF() {
      if (!this.jobInvoice) return

      const doc = new jsPDF()
      doc.setFontSize(16)
      doc.text('Contractor Invoice', 105, 15, { align: 'center' })

      doc.setFontSize(12)
      doc.text(`Invoice Date: ${this.jobInvoice.invoice_date.split('T')[0]}`, 150, 25)

      doc.text('Sender:', 10, 30)
      doc.text('ProConnect Services', 10, 35)
      doc.text(this.jobInvoice.admin_address || '', 10, 40)

      doc.text('Recipient:', 120, 30)
      doc.text(this.jobInvoice.con_name, 120, 35)

      const tableColumn = ['Field', 'Details']
      const tableRows = [
        ['Status', this.jobInvoice.status],
        ['Service Type', this.jobInvoice.service_type],
        ['Description', this.jobInvoice.description],
        ['Job Date', this.jobInvoice.job_date.split('T')[0]],
        ['Hourly Rate', `R ${this.jobInvoice.con_hourly_rate}`],
        ['Hours', this.jobInvoice.hours_to_work],
        ['Total Amount (-10%)', `R ${this.jobInvoice.amount}`]
      ]

      autoTable(doc, {
        startY: 50,
        head: [tableColumn],
        body: tableRows,
        theme: 'grid',
        headStyles: { fillColor: [41, 128, 185], textColor: 255 },
        styles: { fontSize: 12 }
      })

      doc.save(`Invoice_${this.jobInvoice.job_id}.pdf`)
    }
  },

  mounted() {
    // Dispatch action when the component is mounted
    const contractorId = 2 // replace with the logged-in contractor's ID dynamically
    this.$store.dispatch('fetchJobCompleted', contractorId)
  }
}

</script>


<style scoped>
.invoice-download {
  max-width: 700px;
  margin: 40px auto;
  padding: 30px;
  background: #fafafa;
  border: 1px solid #ddd;
  border-radius: 10px;
  font-family: Arial, sans-serif;
}

h2 {
  text-align: center;
  font-size: 1.6rem;
  margin-bottom: 25px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

th, td {
  border: 1px solid #ccc;
  padding: 12px 15px;
  font-size: 1rem;
  text-align: left;
}

th {
  background-color: #f0f0f0;
  font-weight: bold;
  width: 35%;
}

button {
  display: block;
  width: 100%;
  padding: 12px;
  background: #2c7a2c;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s ease;
}

button:hover {
  background: #256325;
}
</style>  