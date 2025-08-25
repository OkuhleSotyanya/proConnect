<template>
  <nav class="admin-nav">
    <router-link to="/admin/dashboard" active-class="active">Dashboard</router-link>
    <router-link to="/admin/clients" active-class="active">Clients</router-link>
    <router-link to="/admin/contractors" active-class="active">Contractors</router-link>
    <router-link to="/admin/jobs" active-class="active">Jobs</router-link>
    <router-link to="/admin/payments" active-class="active">Payments</router-link>
    <router-link to="/admin/refunds" active-class="active">Refunds</router-link>
    <router-link to="/admin/profile" active-class="active">Profile</router-link>
  </nav>
</template>

<script>
export default {
  name: 'AdminNav'
};
</script>

<style scoped>
.admin-nav {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
}

.admin-nav a {
  background-color: #444;
  color: white;
  padding: 8px 14px;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s ease;
  text-decoration: none;
}

.admin-nav a:hover,
.admin-nav a.active {
  background-color: #666;
}
</style>
