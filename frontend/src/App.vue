<template>
  <nav class="navbar">
    <router-link to="/" class="brand-logo">ProConnect</router-link>
    <ul class="nav-links">
      <li><router-link to="/">Home</router-link></li>
      <li><router-link to="/services">Services</router-link></li>
    </ul>

    <div class="profile-dropdown-container">
      <button @click="toggleDropdown" class="profile-icon">
        <img src="https://via.placeholder.com/40" alt="Profile" />
      </button>
      <div v-if="isDropdownOpen" class="dropdown-menu">
        <router-link to="/profile">Profile</router-link>
        <button @click="signOut">Sign Out</button>
      </div>
    </div>
    <div>
    <i class="fas fa-home"></i> Home
    <i class="fas fa-user"></i> Profile
  </div>
  </nav>
  <router-view/>
</template>

<script>

  import '@fortawesome/fontawesome-free/css/all.css';
  import '@fortawesome/fontawesome-free/js/all.js';

  //function for the dropdown menu and sign out functionality
import { ref } from 'vue';  
import { useRouter } from 'vue-router';
const isDropdownOpen = ref(false);
const router = useRouter();
function toggleDropdown() {
  isDropdownOpen.value = !isDropdownOpen.value;
}
function signOut() {
  // Implement your sign-out logic here
  // For example, clearing local storage, a state management store, etc.
  console.log('User signed out');
  router.push('/login'); // Redirect to login page
}
export default {
  setup() {
    return {
      isDropdownOpen,
      toggleDropdown,
      signOut
    };
  }
};


</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #13b43bdb;
  color: white;
}

.brand-logo {
  color: rgba(79, 19, 208, 0.815);
  text-decoration: none;
  font-weight: bold;
  font-size: 1.5rem;
}

.nav-links {
  list-style: none;
  display: flex;
  gap: 1.5rem;
  padding: 0;
  margin: 0;
}

.nav-links a {
  color:rgba(79, 19, 208, 0.815);
  text-decoration: none;
}

.profile-dropdown-container {
  position: relative;
}

.profile-icon {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
}

.profile-icon img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background-color: #444;
  min-width: 150px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  z-index: 1;
  border-radius: 5px;
  overflow: hidden;
  margin-top: 5px; /* Add a small gap */
}

.dropdown-menu a, .dropdown-menu button {
  display: block;
  width: 100%;
  text-align: left;
  padding: 12px 16px;
  text-decoration: none;
  color: white;
  background: none;
  border: none;
  cursor: pointer;
}

.dropdown-menu a:hover, .dropdown-menu button:hover {
  background-color: #555;
}

/* For responsiveness */
@media (max-width: 768px) {
  .nav-links {
    display: none;
  }
}
</style>
