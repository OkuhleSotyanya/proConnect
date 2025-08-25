<template>
  <div class="dashboard">
    <header class="dashboard-header">
      <div class="header-content">
        <!-- Logo -->
        <div class="logo-group">
          <div class="contractor-logo">
            <div class="logo-shine"></div>
            <span>PROCONNECT</span>
          </div>

          <div class="workflow-container">
            <div class="divider-line"></div>
            <p class="workflow-text">Manage your workflow</p>
            <div class="divider-line"></div>
          </div>
        </div>
      </div>
    </header>

    <div class="dashboard-grid">
      <!-- Jobs Card -->
      <div class="dashboard-card" @click="goTo('jobs')">
        <div class="card-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/><path d="M14 2v6h6"/></svg>
        </div>
        <h2>Jobs</h2>
        <p>Browse available projects</p>
        <div class="card-badge">1 New</div>
      </div>

      <!-- Payslip Card -->
      <div class="dashboard-card" @click="goTo('payslip')">
        <div class="card-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11V11.99z"/></svg>
        </div>
        <h2>Payslip</h2>
        <p>Track your income</p>
        <div class="card-highlight">ZAR</div>
      </div>

      <!-- Review Card -->
      <div class="dashboard-card" @click="goTo('ratings')">
        <div class="card-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
        </div>
        <h2>Review</h2>
        <p>Client feedback</p>
        <div class="rating-display">
          <div class="stars">★★★★★</div>
          <span>4.9/5.0</span>
        </div>
      </div>

      <!-- Profile Card -->
      <div class="dashboard-card" @click="goTo('profile')">
        <div class="card-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10z"/><path d="M22 20v-1a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v1"/></svg>
        </div>
        <h2>Profile</h2>
        <p>Manage your identity</p>
        <div class="verification-badge">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
          Verified Pro
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'home',
  data() {
    return { subActive: false }
  },
  methods: {
    goTo(page) {
      this.$router.push(`/${page}`);
    },
    async startSub() {
      const res = await fetch("/api/subscriptions/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contractorId: this.$store.state.user.id,
          contractorName: this.$store.state.user.name,
          contractorEmail: this.$store.state.user.email,
          planCode: "monthly-pro",
          amountCents: 19900
        })
      });
      const html = await res.text();
      document.write(html);
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@600&display=swap');

:root {
  --primary: #00c853;
  --primary-hover: #00e676;
  --primary-dark: #006432;
  --accent: #64dd17;
  --gold: #d4af37;
  --text-dark: #1a2e35;
  --text-light: #607d8b;
  --bg: linear-gradient(135deg, #f0fff4, #e6f7ff);
  --card-bg: rgba(255, 255, 255, 0.85);
  --shadow: 0 8px 30px rgba(0, 200, 83, 0.08);
  --glass-blur: blur(12px);
}

.dashboard {
  padding: 40px;
  background: var(--bg);
  min-height: 100vh;
  font-family: 'Inter', sans-serif;
  backdrop-filter: var(--glass-blur);
}

.dashboard-header {
  text-align: center;
  margin-bottom: 60px;
  animation: fadeDown 0.8s ease;
}

@keyframes fadeDown {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}

.header-content {
  max-width: 800px;
  margin: 0 auto;
}

.contractor-logo {
  position: relative;
  display: inline-block;
  font-family: 'Playfair Display', serif;
  font-size: 3rem;
  font-weight: 600;
  color: var(--text-dark);
  letter-spacing: 2px;
  margin-bottom: 10px;
  background: linear-gradient(90deg, #00c853, #64dd17, #00c853);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 3px 6px rgba(0,0,0,0.05);
}

.logo-shine {
  position: absolute;
  top: -15px;
  left: -20px;
  width: 140%;
  height: 160%;
  background: linear-gradient(45deg, rgba(255,255,255,0.2), transparent, rgba(255,255,255,0.2));
  border-radius: 50%;
  animation: shineMove 4s infinite linear;
}

@keyframes shineMove {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.workflow-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  margin-top: 10px;
}

.divider-line {
  width: 70px;
  height: 2px;
  background: linear-gradient(90deg, rgba(0,200,83,0), rgba(0,200,83,0.8), rgba(0,200,83,0));
}

.workflow-text {
  color: var(--text-light);
  font-size: 1.2rem;
  letter-spacing: 1px;
  margin: 0;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 35px;
  max-width: 1200px;
  margin: 0 auto;
  animation: fadeUp 0.9s ease;
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

.dashboard-card {
  background: var(--card-bg);
  backdrop-filter: var(--glass-blur);
  padding: 30px;
  border-radius: 20px;
  box-shadow: var(--shadow);
  transition: all 0.35s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(0, 200, 83, 0.15);
}

.dashboard-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 20px 45px rgba(0, 200, 83, 0.18);
}

.dashboard-card::after {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle at top left, rgba(0,200,83,0.08), transparent 70%);
  transform: rotate(25deg);
}

.card-icon {
  width: 65px;
  height: 65px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(0, 200, 83, 0.15), rgba(100, 221, 23, 0.1));
  border-radius: 16px;
  box-shadow: inset 0 3px 6px rgba(0,200,83,0.12);
}

.card-icon svg {
  width: 30px;
  height: 30px;
  fill: var(--primary);
}

.dashboard-card h2 {
  color: var(--text-dark);
  font-size: 1.5rem;
  font-weight: 600;
  margin: 22px 0 12px;
}

.dashboard-card p {
  color: var(--text-light);
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 20px;
}

.card-badge, .verification-badge, .card-highlight {
  display: inline-block;
  padding: 8px 16px;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 500;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%,100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.card-badge {
  background-color: rgba(0, 200, 83, 0.15);
  color: var(--primary-dark);
}

.card-highlight {
  background: linear-gradient(90deg, rgba(212,175,55,0.15), rgba(212,175,55,0.05));
  border: 1px solid rgba(212,175,55,0.3);
  color: var(--gold);
  font-weight: 600;
}

.verification-badge {
  background-color: rgba(0, 200, 83, 0.15);
  color: var(--primary-dark);
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.rating-display {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.stars {
  color: #ffc107;
  font-size: 1.2rem;
  letter-spacing: 2px;
}

@media (max-width: 768px) {
  .dashboard {
    padding: 25px 15px;
  }
  .contractor-logo {
    font-size: 2.2rem;
  }
  .workflow-text {
    font-size: 1rem;
  }
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
}
</style>
