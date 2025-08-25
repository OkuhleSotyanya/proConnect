// main.js
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import { setAuthHeader } from './utils/authMiddleware'; // Import the function
import '../assets/main.css';

// Call the function to set the default header
setAuthHeader();

const app = createApp(App);
app.use(store);
app.use(router);
app.mount('#app');