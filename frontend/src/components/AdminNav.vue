<template>
  <nav class="admin-nav">
    <button @click="setActive('overview')">Overview</button>
    <button @click="setActive('adminclients')">Clients</button>
    <button @click="setActive('admincontractors')">Contractors</button>
    <button @click="setActive('jobmanagement')">Jobs</button>
    <button @click="setActive('recentransactions')">Payments</button>
    <button @click="setActive('adminprofile')">Profile</button>
  </nav>
</template>

<script>
export default {
  name: 'AdminNav',
  methods: {
    setActive(page) {
      this.$emit('set-active', page);
    }
  }
};
</script>

<style scoped>
.admin-nav {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
}

.admin-nav button {
  background-color: #444;
  color: white;
  padding: 8px 14px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s ease;
}

.admin-nav button:hover {
  background-color: #666;
}
</style> 