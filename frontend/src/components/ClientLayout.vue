<template>
  <div id="client-layout">
    <!-- Client-specific Navigation -->
    <nav class="client-nav">
      <div class="logo">ProConnect</div>
      <div class="nav-links">
        <router-link to="/client/home">Home</router-link>
        <router-link to="/client/services">Services</router-link>
        <router-link to="/client/profile">Profile</router-link>
      </div>
    </nav>

    <!-- Main Content Area with the nested router view -->
    <main class="content">
      <router-view />
    </main>
    
    
  </div>
</template>

<script>
export default {
  name: 'ClientLayout',
};
</script>

<style scoped>
#client-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.client-nav {
  background-color: #3498db; /* A different color for the client view */
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
  background-color: #2980b9;
  color: white;
  text-align: center;
  padding: 1rem;
  margin-top: auto;
}
</style>
