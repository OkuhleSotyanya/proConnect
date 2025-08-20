<template>
  <div class="clients-page">
    <h2>Clients</h2>
    <div class="table-wrapper">
      <table class="clients-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Cell Number</th>
            <th>Location</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="client in clients" :key="client.id">
            <td>{{ client.name }}</td>
            <td>{{ client.email }}</td>
            <td>{{ client.cellnumber }}</td>
            <td>{{ client.location }}</td>
            <td>
              <button class="delete-btn" @click="removeClient(client.id)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: "AdminClients",
  data() {
    return {
      clients: [
        { id: 1, name: "John Doe", email: "john@example.com", cellnumber: "123-456-7890", location: "50 Lake Side Street, Claremont, Capetown" },
        { id: 2, name: "Jane Smith", email: "jane@example.com", cellnumber: "987-654-3210", location: "123 Main St, Claremont, Capetown" },
        { id: 3, name: "Alice Johnson", email: "alice@example.com", cellnumber: "555-123-4567", location: "456 Elm St, Claremont, Capetown" },
        { id: 4, name: "Bob Brown", email: "bob@example.com", cellnumber: "444-987-6543", location: "789 Oak St, Claremont, Capetown" },
        { id: 5, name: "Charlie White", email: "charlie@example.com", cellnumber: "333-555-1234", location: "321 Pine St, Claremont, Capetown" },
        { id: 6, name: "Diana Green", email: "diana@example.com", cellnumber: "222-444-9876", location: "654 Maple St, Claremont, Capetown" }
      ]
    };
  },
  methods: {
    removeClient(id) {
      this.clients = this.clients.filter(client => client.id !== id);
    }
  }
};
</script>

<style scoped>
.clients-page {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  padding: 20px;
  background-color: #f9f9f9;
}

.clients-page h2 {
  margin-bottom: 20px;
  color: #2c3e50;
  font-size: 1.8em;
}

.table-wrapper {
  overflow-x: auto;
}

.clients-table {
  width: 100%;
  border-collapse: collapse;
  background-color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  min-width: 600px;
}

.clients-table th,
.clients-table td {
  padding: 14px 18px;
  text-align: left;
  border-bottom: 1px solid #eee;
  vertical-align: top;
}

.clients-table th {
  background-color: #f0f0f0;
  font-weight: 600;
  color: #555;
  white-space: nowrap;
}

.clients-table td {
  color: #333;
  word-break: break-word;
}

.clients-table tr:hover {
  background-color: #f5f5f5;
}

.delete-btn {
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  font-size: 0.9em;
}

.delete-btn:hover {
  background-color: #c0392b;
}

/* 📱 Responsive Styles */
@media (max-width: 1024px) {
  .clients-page h2 {
    font-size: 1.6em;
  }

  .clients-table th,
  .clients-table td {
    padding: 12px 14px;
    font-size: 0.95em;
  }
}

@media (max-width: 768px) {
  .clients-page h2 {
    font-size: 1.4em;
  }

  .clients-table th,
  .clients-table td {
    padding: 10px 12px;
    font-size: 0.9em;
  }

  .delete-btn {
    padding: 5px 10px;
    font-size: 0.85em;
  }
}

@media (max-width: 480px) {
  .clients-page {
    padding: 10px;
  }

  .clients-page h2 {
    font-size: 1.2em;
    text-align: center;
  }

  .clients-table {
    font-size: 0.85em;
    min-width: unset;
  }

  .clients-table th,
  .clients-table td {
    padding: 8px 10px;
  }

  .delete-btn {
    padding: 4px 8px;
    font-size: 0.8em;
  }
}
</style>