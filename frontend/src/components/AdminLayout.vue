<template>
  <div id="admin-layout">
    <!-- Admin-specific Navigation -->
    <nav class="admin-nav">
      <div class="logo">ProConnect</div>
      <div class="nav-links">
        <!-- These router-links point to your nested admin routes -->
        <router-link to="/admin/dashboard">Dashboard</router-link>
        <router-link to="/admin/clients">Clients</router-link>
        <router-link to="/admin/contractors">Contractors</router-link>
        <router-link to="/admin/jobs">Jobs</router-link>
        <router-link to="/admin/payments">Payments</router-link>
        <router-link to="/admin/profile">Profile</router-link>
      </div>
    </nav>

    <main class="content">
      <router-view />
    </main>
    
    
  </div>
</template>

<script>
export default {
  name: 'AdminLayout',
};
</script>

<style scoped>
#admin-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.admin-nav {
  background-color: #2c3e50;
  padding: 10px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  color: white;
  font-size: 1.5em;
  font-weight: bold;
}

.nav-links {
  display: flex;
  gap: 15px;
}

.nav-links a {
  color: white;
  text-decoration: none;
  padding: 5px;
}

.nav-links a.router-link-exact-active {
  font-weight: bold;
  border-bottom: 2px solid #fff;
}

.content {
  flex: 1;
  padding: 20px;
}

.footer {
  background-color: #111;
  color: white;
  text-align: center;
  padding: 1.2rem;
}

.footer p {
  margin-bottom: 0.6rem;
}

.footer-icons {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}

.footer-icons a {
  color: white;
  margin: 0 10px;
  font-size: 1.2rem;
  transition: color 0.3s ease;
}

.footer-icons a:hover {
  color: #00a651;
}
</style>
