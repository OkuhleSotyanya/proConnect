<template>
    <div>
        <nav class="navbar">
          <router-link to="/" class="brand-logo">ProConnect</router-link>
          <ul class="client_nav-links">
             <li><router-link to="/"><i class="fas fa-home nav-icon"></i> Home</router-link></li>
             <li><router-link to="/services"><i class="fas fa-concierge-bell nav-icon"></i> Services</router-link></li>
             <li><router-link to="/clientsprofile"><i class="fas fa-user nav-icon"></i> Profile</router-link></li>
          </ul>
    </nav>
    </div>
</template>

<script>
    export default {
  name: 'ClientNavbar'
};
</script>

<style>
    /* Navbar */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #389967ac;
  padding: 0.8rem 2rem;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
}

.brand-logo {
  font-size: 1.8rem;
  font-weight: 700;
  color: white;
  text-decoration: none;
  letter-spacing: 1px;
}

.nav-links {
  list-style: none;
  display: flex;
  gap: 1.5rem;
}

.nav-links a {
  color: white;
  font-weight: 500;
  text-decoration: none;
  transition: color 0.3s ease;
}

.nav-links a:hover {
  color: #d1f0e2;
}

.nav-icon {
  margin-right: 6px;
}

/* Carousel */
.slideshow-container {
  position: relative;
  max-width: 100%;
  margin: auto;
  overflow: hidden;
}

.card-3d {
  height: 450px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.card-3d img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.nav-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(0, 0, 0, 0.45);
  color: white;
  border: none;
  padding: 14px;
  cursor: pointer;
  border-radius: 50%;
  transition: background 0.3s ease;
}

.nav-button:hover {
  background-color: rgba(0, 0, 0, 0.65);
}

.nav-button.prev {
  left: 15px;
}

.nav-button.next {
  right: 15px;
}

.dots {
  text-align: center;
  margin-top: 12px;
}

.dots span {
  height: 12px;
  width: 12px;
  margin: 0 5px;
  background-color: #c5c5c5;
  border-radius: 50%;
  display: inline-block;
  transition: background-color 0.3s ease;
  cursor: pointer;
}

.dots span.active {
  background-color: #00a651;
}

</style>