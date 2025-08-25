<template>
  <div id="contractor-layout">
    <!-- Client Navigation Bar -->
    <nav class="contractor-nav">
      <div class="logo">ProConnect</div>
      <div class="nav-links">
        <router-link to="/contractor/home">Dashboard</router-link>
        <router-link to="/contractor/jobs">Available Jobs</router-link>
        <router-link to="/contractor/pending">Pending Jobs</router-link>
        <router-link to="/contractor/completed">Completed Jobs</router-link>
        <router-link to="/contractor/profile">Profile</router-link>
        <button v-if="isAuthenticated" @click="logout" class="logout-btn">
          Logout
        </button>
        <router-link v-else to="/login" class="login-btn">
          Login
        </router-link>
      </div>
    </nav>

    <!-- Main Content Area -->
    <main class="content">
      <router-view />
    </main>

    
  </div>
</template>

<script>
export default {
  name: 'ContractorLayout',
  data() {
    return {
      isAuthenticated: false,
    };
  },
 methods: {
  logout() {
    this.$store.dispatch('logout');
    this.isAuthenticated = false;
    this.$router.push('/login');
  },
},
created() {
  this.isAuthenticated = !!localStorage.getItem('token');
  if (this.isAuthenticated) this.$store.dispatch('restoreSession');
},

};
</script>

<style scoped>
#contractor-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.contractor-nav {
  background-color: #3498db;
  padding: 10px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
}

.logo {
  color: white;
  font-size: 1.5em;
  font-weight: bold;
}

.nav-links {
  display: flex;
  gap: 15px;
  align-items: center;
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

.logout-btn {
  background-color: #e74c3c;
  color: white;
  padding: 5px 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.logout-btn:hover {
  background-color: #c0392b;
}

.login-btn {
  background-color: #2ecc71;
  color: white;
  padding: 5px 10px;
  border-radius: 4px;
  text-decoration: none;
}

.login-btn:hover {
  background-color: #27ae60;
}

.content {
  flex: 1;
  padding: 20px;
}

.footer {
  background-color: #2980b9;
  color: white;
  text-align: center;
  padding: 1rem;
  margin-top: auto;
}
</style>
