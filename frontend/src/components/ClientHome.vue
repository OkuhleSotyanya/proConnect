<template>
  <div id="app">
    <main>
      <!-- Carousel -->
      <div class="slideshow-container">
        <div class="card-3d">
          <img :src="slides[currentIndex]" alt="Product Image" class="carousel-img" />
        </div>

        <!-- Nav buttons -->
        <button class="nav-button prev" @click="prevSlide">❮</button>
        <button class="nav-button next" @click="nextSlide">❯</button>

        <!-- Dots -->
        <div class="dots">
          <span
            v-for="(slide, index) in slides"
            :key="index"
            :class="{ active: index === currentIndex }"
            @click="goToSlide(index)"
          ></span>
        </div>
      </div>

      <!-- About Section -->
      <section id="about">
        <div class="about-container">
          <h2>About Us</h2>
          <p>
            We connect skilled contractors with clients who need reliable and professional services.
            Our mission is to create opportunities for talented individuals while giving clients
            access to trusted and verified professionals.
          </p>
          <p class="about-highlight">
            "Your success is our mission — one project at a time."
          </p>
        </div>
      </section>
    </main>
  </div>
</template>

<script>
import "@fortawesome/fontawesome-free/css/all.css";
import "@fortawesome/fontawesome-free/js/all.js";

export default {
  name: "ClientHome",
  data() {
    return {
      currentIndex: 0,
      slides: [
        require("@/assets/img1.jpg"),
        require("@/assets/img 2.jpg"),
        require("@/assets/img 3.jpg"),
        require("@/assets/img 4.jpg"),
        require("@/assets/img 5.jpg"),
        require("@/assets/img 6.jpg"),
        require("@/assets/img 7.jpg"),
        require("@/assets/img 8.jpg"),
        require("@/assets/img 9.jpg"),
        require("@/assets/img 10.jpg")
      ],
      timer: null
    };
  },
  mounted() {
    this.startAutoSlide();
  },
  beforeUnmount() {
    clearInterval(this.timer);
  },
  methods: {
    startAutoSlide() {
      this.timer = setInterval(() => {
        this.nextSlide();
      }, 4000);
    },
    nextSlide() {
      this.currentIndex = (this.currentIndex + 1) % this.slides.length;
    },
    prevSlide() {
      this.currentIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
    },
    goToSlide(index) {
      this.currentIndex = index;
    }
  }
};
</script>

<style scoped>
/* General Layout */
#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f9fafb;
  color: #333;
}

main {
  flex: 1;
}

/* Carousel */
.slideshow-container {
  width: 100%;
  max-width: 1200px;
  margin: auto;
  position: relative;
  padding: 0 10px;
}

.card-3d {
  width: 100%;
  padding-top: 56.25%; /* 16:9 aspect ratio */
  border-radius: 12px;
  overflow: hidden;
  position: relative;
  background-color: #eee;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
}

.carousel-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
}

.nav-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  padding: 12px;
  font-size: 1.5rem;
  background: rgba(0, 0, 0, 0.45);
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 50%;
  transition: background 0.3s ease;
  z-index: 5;
}

.nav-button:hover {
  background: rgba(0, 0, 0, 0.7);
}

.prev {
  left: 15px;
}

.next {
  right: 15px;
}

.dots {
  text-align: center;
  margin-top: 12px;
}

.dots span {
  cursor: pointer;
  height: 10px;
  width: 10px;
  margin: 0 3px;
  background-color: #bbb;
  border-radius: 50%;
  display: inline-block;
  transition: background-color 0.3s ease;
}

.dots .active {
  background-color: #00a651;
}

/* About Section */
#about {
  padding: 60px 20px;
  background: white;
  text-align: center;
}

.about-container {
  max-width: 900px;
  margin: auto;
}

#about h2 {
  font-size: 2.2rem;
  font-weight: 700;
  color: #00a651;
  margin-bottom: 20px;
}

#about p {
  font-size: 1.05rem;
  line-height: 1.6;
  color: #555;
  margin-bottom: 20px;
}

.about-highlight {
  background: #e7f8f0;
  padding: 12px;
  border-left: 4px solid #00a651;
  border-radius: 6px;
  font-style: italic;
  font-weight: 500;
}

/* Responsive */
@media (max-width: 768px) {
  .nav-button {
    font-size: 1.2rem;
    padding: 8px;
  }
  #about h2 {
    font-size: 1.8rem;
  }
  #about p {
    text-align: left;
  }
}
</style>
