<template>
  <div class="contractors-page">
    <h2>Contractors</h2>
    
    <div v-if="loading" class="loading-message">Loading contractors...</div>
    <div v-else-if="error" class="error-message">Error: {{ error }}</div>
    <div v-else-if="contractors && contractors.length === 0" class="no-contractors-message">No contractors found.</div>

    <div v-else class="table-wrapper">
      <table class="contractors-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Cell Number</th>
            <th>Experience</th>
            <th>Hourly Rate</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="contractor in contractors" :key="contractor.id">
            <td>{{ contractor.full_name }}</td>
            <td>{{ contractor.email }}</td>
            <td>{{ contractor.cellnumber }}</td>
            <td>{{ contractor.job_experience }}</td>
            <td>R{{ contractor.rate }}</td>
            <td>
              <button class="delete-btn" @click="removeContractor(contractor.id)">Delete</button>
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
  name: 'AdminContractors',
  data() {
    return {
      contractors: [],
      loading: true,
      error: null
    };
  },
  mounted() {
    this.fetchContractors();
  },
  methods: {
    async fetchContractors() {
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

        const response = await axios.get('http://localhost:3000/api/admin/contractors', config);
        this.contractors = response.data;
      } catch (error) {
        console.error('Error fetching contractors:', error);
        this.error = 'Failed to fetch contractors. Please ensure you are logged in as an admin.';
      } finally {
        this.loading = false;
      }
    },
    async removeContractor(contractorId) {
      const token = localStorage.getItem('token');
      
      if (!token) {
          this.error = "Authentication token not found. Please log in again.";
          return;
      }
      
      try {
        if (confirm('Are you sure you want to delete this contractor?')) {
          const config = {
            headers: {
              Authorization: `Bearer ${token}`
            }
          };
          
          await axios.delete(`http://localhost:3000/api/admin/users/${contractorId}`, config);
          this.contractors = this.contractors.filter(contractor => contractor.id !== contractorId);
        }
      } catch (error) {
        console.error('Error deleting contractor:', error);
        this.error = 'Failed to delete contractor.';
      }
    }
  }
};
</script>

<style scoped>
.contractors-page {
  font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  padding: 30px;
  background: linear-gradient(135deg, #f4f7fa, #eef1f5);
  min-height: 100vh;
  color: #2c3e50;
}

.contractors-page h2 {
  font-size: 2rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 25px;
  position: relative;
}

.contractors-page h2::after {
  content: '';
  display: block;
  width: 70px;
  height: 4px;
  background: #27ae60;
  border-radius: 2px;
  margin-top: 8px;
}

/* Table wrapper as a card */
.table-wrapper {
  overflow-x: auto;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 8px 22px rgba(0, 0, 0, 0.07);
  padding: 18px;
  animation: fadeIn 0.5s ease;
}

.contractors-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 750px;
}

.contractors-table th,
.contractors-table td {
  padding: 16px 20px;
  text-align: left;
  border-bottom: 1px solid #f0f0f0;
}

.contractors-table th {
  background: #f9fafb;
  font-weight: 700;
  color: #444;
  text-transform: uppercase;
  font-size: 0.85rem;
  letter-spacing: 0.5px;
}

.contractors-table td {
  color: #2f3542;
  font-size: 0.95rem;
}

.contractors-table tr:hover td {
  background: #f4f9f7;
  transition: background 0.3s ease;
}

/* Delete button */
.delete-btn {
  background: linear-gradient(135deg, #e74c3c, #c0392b);
  color: #fff;
  border: none;
  padding: 8px 14px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.4px;
  box-shadow: 0 3px 8px rgba(231, 76, 60, 0.25);
  transition: all 0.25s ease;
}

.delete-btn:hover {
  background: linear-gradient(135deg, #c0392b, #962d22);
  transform: translateY(-2px);
  box-shadow: 0 5px 12px rgba(231, 76, 60, 0.4);
}

/* Status messages */
.loading-message, .error-message, .no-contractors-message {
  padding: 18px;
  margin: 20px auto;
  max-width: 600px;
  border-radius: 10px;
  font-size: 1.05rem;
  font-weight: 500;
  text-align: center;
}

.loading-message {
  background: #eafaf1;
  color: #27ae60;
}

.error-message {
  background: #fdecea;
  color: #e74c3c;
  font-weight: bold;
}

.no-contractors-message {
  background: #f5f7fa;
  color: #555;
}

/* Responsive tweaks */
@media (max-width: 768px) {
  .contractors-page h2 {
    font-size: 1.6rem;
    text-align: center;
  }

  .contractors-table th,
  .contractors-table td {
    padding: 12px;
    font-size: 0.9rem;
  }

  .delete-btn {
    padding: 6px 10px;
    font-size: 0.8rem;
  }
}

@media (max-width: 480px) {
  .contractors-page {
    padding: 15px;
  }

  .contractors-table {
    font-size: 0.8rem;
    min-width: unset;
  }

  .contractors-table th,
  .contractors-table td {
    padding: 8px;
  }

  .delete-btn {
    padding: 5px 8px;
  }
}

/* Subtle fade-in animation */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}

</style>
