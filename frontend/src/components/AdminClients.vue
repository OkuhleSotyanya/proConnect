<template>
  <div class="clients-page">
    <h2>Clients</h2>
    
    <div v-if="loading" class="loading-message">Loading clients...</div>
    <div v-else-if="error" class="error-message">Error: {{ error }}</div>
    <div v-else-if="clients && clients.length === 0" class="no-clients-message">No clients found.</div>

    <div v-else class="table-wrapper">
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
            <td>{{ client.fullname }}</td>
            <td>{{ client.email }}</td>
            <td>{{ client.phone_number }}</td>
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
import axios from 'axios';

export default {
  name: 'AdminClients',
  data() {
    return {
      clients: [],
      loading: true,
      error: null
    };
  },
  mounted() {
    this.fetchClients();
  },
  methods: {
    async fetchClients() {
      const token = localStorage.getItem('token');
      
      if (!token) {
          this.loading = false;
          this.error = "Authentication token not found. Please log in again.";
          return;
      }
      
      try {
        this.loading = true;
        this.error = null;
        
        // Explicitly pass the Authorization header with the request
        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        };

        const response = await axios.get('http://localhost:3000/api/admin/clients', config);
        console.log(response);
        
        this.clients = response.data;
      } catch (error) {
        console.error('Error fetching clients:', error);
        this.error = 'Failed to fetch clients. Please ensure you are logged in as an admin.';
      } finally {
        this.loading = false;
      }
    },
    async removeClient(clientId) {
      const token = localStorage.getItem('token');
      
      if (!token) {
          this.error = "Authentication token not found. Please log in again.";
          return;
      }
      
      try {
        if (confirm('Are you sure you want to delete this client?')) {
          const config = {
            headers: {
              Authorization: `Bearer ${token}`
            }
          };
          
          await axios.delete(`http://localhost:3000/api/admin/users/${clientId}`, config);
          this.clients = this.clients.filter(client => client.id !== clientId);
        }
      } catch (error) {
        console.error('Error deleting client:', error);
        this.error = 'Failed to delete client.';
      }
    }
  }
};
</script>

<style scoped>
/* All your existing styles continue below */
.clients-page {
  font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  padding: 30px;
  background: linear-gradient(135deg, #f4f7fa, #eef1f5);
  min-height: 100vh;
  color: #2c3e50;
}

.clients-page h2 {
  font-size: 2rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 25px;
  position: relative;
}

.clients-page h2::after {
  content: '';
  display: block;
  width: 60px;
  height: 4px;
  background: #3498db;
  border-radius: 2px;
  margin-top: 8px;
}

/* Table wrapper with card effect */
.table-wrapper {
  overflow-x: auto;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.06);
  padding: 15px;
  animation: fadeIn 0.5s ease;
}

.clients-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 700px;
}

.clients-table th,
.clients-table td {
  padding: 16px 20px;
  text-align: left;
  border-bottom: 1px solid #f0f0f0;
}

.clients-table th {
  background: #f8fafc;
  font-weight: 600;
  color: #555;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-size: 0.9rem;
}

.clients-table td {
  color: #333;
  font-size: 0.95rem;
}

.clients-table tr:hover td {
  background: #f9fbfd;
  transition: background 0.3s ease;
}

/* Delete button styling */
.delete-btn {
  background: linear-gradient(135deg, #e74c3c, #c0392b);
  color: #fff;
  border: none;
  padding: 8px 14px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 6px rgba(231, 76, 60, 0.3);
  transition: all 0.25s ease;
}

.delete-btn:hover {
  background: linear-gradient(135deg, #c0392b, #962d22);
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(231, 76, 60, 0.4);
}

/* Messages */
.loading-message, .error-message, .no-clients-message {
  padding: 20px;
  margin: 20px auto;
  max-width: 600px;
  border-radius: 8px;
  font-size: 1.05rem;
  font-weight: 500;
  text-align: center;
}

.loading-message {
  background: #eaf4ff;
  color: #1e88e5;
}

.error-message {
  background: #fdecea;
  color: #e53935;
}

.no-clients-message {
  background: #f5f7fa;
  color: #555;
}

/* Responsive tweaks */
@media (max-width: 768px) {
  .clients-page h2 {
    font-size: 1.6rem;
    text-align: center;
  }

  .clients-table th,
  .clients-table td {
    padding: 12px;
    font-size: 0.9rem;
  }

  .delete-btn {
    padding: 6px 10px;
    font-size: 0.8rem;
  }
}

@media (max-width: 480px) {
  .clients-page {
    padding: 15px;
  }

  .clients-table {
    font-size: 0.8rem;
    min-width: unset;
  }

  .clients-table th,
  .clients-table td {
    padding: 8px;
  }

  .delete-btn {
    padding: 5px 8px;
  }
}

/* Animation */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

</style>
