<template>
  <div id="home-view">
    <h1>Welcome to ProConnect</h1>
    <p>This is the home view of the application.</p>

    <div class="card-3d">
      <div><img src="../assets/img1.jpg" alt="image 1" /></div>
      <div><img src="../assets/img 2.jpg" alt="image 2" /></div>
      <div><img src="../assets/img 3.jpg" alt="image 3" /></div>
      <div><img src="../assets/img 4.jpg" alt="image 4" /></div>
      <div><img src="../assets/img 5.jpg" alt="image 5" /></div>
      <div><img src="../assets/img 6.jpg" alt="image 6" /></div>
      <div><img src="../assets/img 7.jpg" alt="image 7" /></div>
      <div><img src="../assets/img 8.jpg" alt="image 8" /></div>
      <div><img src="../assets/img 9.jpg" alt="image 9" /></div>
      <div><img src="../assets/img 10.jpg" alt="image 10" /></div>
    </div>
  </div>

 <h1>About us</h1>
  <p>At ProConnect, we believe shopping should be more than just a transaction — it should be a connection. Our platform brings together a diverse range of quality products, trusted sellers, and an easy-to-use online shopping experience, all in one place.

    Founded with the mission to make online shopping simple, secure, and satisfying, we are dedicated to offering products that meet the needs of our customers without compromising on value or service. From the moment you browse to the moment your order arrives, we focus on delivering excellence at every step.
    Our team is passionate about innovation, customer satisfaction, and building lasting relationships. We partner only with reliable suppliers and constantly update our collections to ensure you always have access to the latest and best in the market.</p>

  <h2>Our Mission</h2>
  <p>To connect people with quality products and exceptional service, making online shopping a delightful experience.</p>

  <h2>Our Vision</h2>
    <p>To be the leading online marketplace that empowers consumers through choice, convenience, and trust.</p>

  <h2>Our Values</h2>
  <p>Integrity, Innovation, Customer Focus, and Community Engagement.</p>

  <h2>Why Choose Us?</h2>
  <p>We are committed to providing a seamless shopping experience with a wide range of products at competitive prices. Our user-friendly interface, secure payment options, and dedicated customer support ensure that your shopping journey is smooth and enjoyable.</p>

 
  <h2>Contact Us</h2>
  <p>If you have any questions or need assistance, feel free to reach out to our support team. We're here to help!</p>
  
<footer class="site-footer">
    <div class="footer-content">
      <p>&copy; 2025 ProConnect. All rights reserved.</p>

      <div class="footer-links">
        <!-- Phone -->
        <a href="tel:+27123456789">📞 +27 12 345 6789</a>

        <!-- Email -->
        <a href="mailto:info@proconnect.com">✉️ info@proconnect.com</a>

        <!-- Social Media -->
        <a href="https://www.facebook.com/ProConnect" target="_blank">🌐 Facebook</a>
        <a href="https://www.instagram.com/ProConnect" target="_blank">📷 Instagram</a>
      </div>
    </div>
  </footer>
  
</template>

<script>
export default {
  name: "HomeView"
}
</script>

<style scoped>
#home-view {
  padding: 20px;
  background-color: #f9f9f9;
  min-height: calc(100vh - 60px);
  text-align: center;
}

.card-3d {
  position: relative;
  width: 100vw; /* full viewport width */
  height: 100vh; /* full viewport height */
  transform-style: preserve-3d;
  transform: perspective(2000px);
  animation: autoRun3d 20s linear infinite;
  will-change: transform;
  margin: 0;
}

.card-3d div {
  position: absolute;
  width: 200px; /* bigger cards for full-screen view */
  height: 280px;
  background-color: rgb(199, 199, 199);
  border: solid 2px lightgray;
  border-radius: 0.5rem;
  top: 50%;
  left: 50%;
  transform-origin: center center;
  animation: animateBrightness 20s linear infinite;
  transition-duration: 200ms;
  will-change: transform, filter;
  overflow: hidden;
}

.card-3d div img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 0.5rem;
}

.card-3d div:hover {
  filter: brightness(1.2);
  transform: scale(1.1);
}

.card-3d:hover,
.card-3d:hover div {
  animation-play-state: paused !important;
}

/* 3D positioning */
.card-3d div:nth-child(1) { transform: translate(-50%, -50%) rotateY(0deg) translateZ(400px); animation-delay: -0s; }
.card-3d div:nth-child(2) { transform: translate(-50%, -50%) rotateY(36deg) translateZ(400px); animation-delay: -2s; }
.card-3d div:nth-child(3) { transform: translate(-50%, -50%) rotateY(72deg) translateZ(400px); animation-delay: -4s; }
.card-3d div:nth-child(4) { transform: translate(-50%, -50%) rotateY(108deg) translateZ(400px); animation-delay: -6s; }
.card-3d div:nth-child(5) { transform: translate(-50%, -50%) rotateY(144deg) translateZ(400px); animation-delay: -8s; }
.card-3d div:nth-child(6) { transform: translate(-50%, -50%) rotateY(180deg) translateZ(400px); animation-delay: -10s; }
.card-3d div:nth-child(7) { transform: translate(-50%, -50%) rotateY(216deg) translateZ(400px); animation-delay: -12s; }
.card-3d div:nth-child(8) { transform: translate(-50%, -50%) rotateY(252deg) translateZ(400px); animation-delay: -14s; }
.card-3d div:nth-child(9) { transform: translate(-50%, -50%) rotateY(288deg) translateZ(400px); animation-delay: -16s; }
.card-3d div:nth-child(10) { transform: translate(-50%, -50%) rotateY(324deg) translateZ(400px); animation-delay: -18s; }

@keyframes autoRun3d {
  from { transform: perspective(800px) rotateY(-360deg); }
  to { transform: perspective(800px) rotateY(0deg); }
}

@keyframes animateBrightness {
  0%, 100% { filter: brightness(1); }
  50% { filter: brightness(0.6); }
}
.site-footer {
  background-color: #222;
  color: white;
  padding: 20px 10px;
  text-align: center;
  position: relative;
  bottom: 0;
  width: 100%;
}

.footer-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.footer-links {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-top: 10px;
}

.footer-links a {
  color: #ffcc00;
  text-decoration: none;
  font-size: 14px;
}

.footer-links a:hover {
  text-decoration: underline;
}
.footer-links a:visited {
  color: #ffcc00;
}
</style> 