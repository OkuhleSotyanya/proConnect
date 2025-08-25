<template>
  <div id="app">
    <div class="main-content">
      <router-view></router-view>
    </div>

    <!-- Footer only shows if not login/signup -->
    <footer v-if="showFooter" class="footer">
      <p>&copy; 2025 ProConnect. All rights reserved.</p>
      <div class="footer-icons">
        <a href="#"><i class="fab fa-facebook-f"></i></a>
        <a href="#"><i class="fab fa-twitter"></i></a>
        <a href="#"><i class="fab fa-linkedin-in"></i></a>
      </div>
      <div class="footer-links flex justify-center flex-wrap gap-4 text-yellow-400">
        <router-link to="/terms" class="hover:underline">Terms & Conditions</router-link>
        <router-link to="/privacy" class="hover:underline">Privacy Policy</router-link>
        <router-link to="/returns" class="hover:underline">Return Policy</router-link>
      </div>
    </footer>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

export default {
  name: 'App',
  setup() {
    const route = useRoute();

    const showFooter = computed(() => {
      // Hide footer on login and signup pages
      return !['/login', '/signup'].includes(route.path);
    });

    return { showFooter };
  }
};
</script>
<style>
@import "https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css";

/* Base layout */
html,
body {
  height: 100%;
  margin: 0;
  font-family: Arial, sans-serif;
}
#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* Footer */
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
.footer-links a {
  font-size: 0.875rem;
  color: #ffcc00;
  text-decoration: none;
}
.footer-links a:hover {
  text-decoration: underline;
}
</style>
