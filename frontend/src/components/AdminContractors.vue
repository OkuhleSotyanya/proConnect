<template>
  <div v-if="activePage === 'contractors'" class="contractors-section">
    <h2 class="heading">Contractors</h2>
    <div class="table-wrapper">
      <table class="contractors-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Cell Number</th>
            <th>Address</th>
            <th>Certificate</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="contractor in contractors"
            :key="contractor.id"
            class="table-row"
          >
            <td>{{ contractor.name }}</td>
            <td>{{ contractor.email }}</td>
            <td>{{ contractor.cellnumber }}</td>
            <td>{{ contractor.adress }}</td>
            <td>{{ contractor.certificate }}</td>
            <td class="actions-cell">
              <p><button @click="deleteContractor(contractor.id)" class="btn delete-btn">
                Delete
              </button></p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ContractorsTable',
  emits: ['edit-contractor'],
  data() {
    return {
      activePage: 'contractors',
      contractors: [
        {
          id: 1,
          name: 'Mike Contractor',
          email: 'mike@example.com',
          cellnumber: '123-456-7890',
          adress: '123 Main St, City',
          certificate: 'Certified'
        },
        {
          id: 2,
          name: 'Sara Builder',
          email: 'sara@example.com',
          cellnumber: '987-654-3210',
          adress: '456 Elm St, City',
          certificate: 'Certified'
        },
        {
          id: 3,
          name: 'John Smith',
          email: 'john@example.com',
          cellnumber: '555-123-4567',
          adress: '789 Oak St, City',
          certificate: 'Certified'
        }
      ]
    };
  },
  methods: {
    editContractor(contractor) {
      this.$emit('edit-contractor', contractor);
    },
    deleteContractor(id) {
      this.contractors = this.contractors.filter(c => c.id !== id);
    }
  }
};
</script>

<style scoped>
.contractors-section {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  padding: 20px;
  background-color: #f9f9f9;
}

.heading {
  font-size: 1.8em;
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 20px;
}

.table-wrapper {
  overflow-x: auto;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.contractors-table {
  width: 100%;
  border-collapse: collapse;
  background-color: white;
  min-width: 700px;
}

.contractors-table th,
.contractors-table td {
  padding: 14px 18px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.contractors-table th {
  background-color: #f3f4f6;
  font-weight: 600;
  color: #555;
  text-transform: uppercase;
  font-size: 0.9em;
}

.contractors-table td {
  color: #333;
  font-size: 0.95em;
}

.table-row:hover {
  background-color: #f5f5f5;
  transition: background-color 0.2s ease;
}

.actions-cell {
  text-align: center;
}

.btn {
  padding: 6px 12px;
  font-size: 0.85em;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  margin-right: 6px;
}

.edit-btn {
  background-color: #3498db;
  color: white;
}

.edit-btn:hover {
  background-color: #2980b9;
}

.delete-btn {
  background-color: #e74c3c;
  color: white;
}

.delete-btn:hover {
  background-color: #c0392b;
}

/* Responsive tweaks */
@media (max-width: 768px) {
  .contractors-table th,
  .contractors-table td {
    padding: 10px 12px;
    font-size: 0.85em;
  }

  .btn {
    padding: 5px 10px;
    font-size: 0.8em;
  }
}

@media (max-width: 480px) {
  .heading {
    font-size: 1.4em;
    text-align: center;
  }

  .contractors-table {
    font-size: 0.8em;
    min-width: unset;
  }

  .btn {
    padding: 4px 8px;
  }
}
</style>