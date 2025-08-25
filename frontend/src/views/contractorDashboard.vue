<template>
  <div class="dashboard">
    <header class="dashboard-header">
      <div class="header-content">
        <!-- this is for the Logo  -->
        <div class="logo-group">
          <div class="contractor-logo">
            <div class="logo-shine"></div>
            <span>  PROCONNECT</span>
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
      <!--  this is for the Job Board Card -->
      <div class="dashboard-card" @click="goTo('jobs')">
        <div class="card-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/><path d="M14 2v6h6"/></svg>
        </div>
        <h2>Jobs</h2>
        <p>Browse available projects</p>
        <div class="card-badge">1 New</div>
      </div>

      <!-- this is for the payslip Card (ZAR) -->
      <div class="dashboard-card" @click="goTo('payslip')">
        <div class="card-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11V11.99z"/></svg>
        </div>
        <h2>Payslip</h2>
        <p>Track your income</p>
        <div class="card-highlight">ZAR</div>
      </div>


      <!--  this is for the Profile Card -->
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
  methods: {
    goTo(page) {
     this.$router.push(`/${page}`);
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
  --bg: #f5fbf8;
  --card-bg: #ffffff;
  --shadow: 0 8px 30px rgba(0, 200, 83, 0.08);
}

.dashboard {
  padding: 40px;
  background-color: var(--bg);
  min-height: 100vh;
  font-family: 'Inter', sans-serif;
}

.dashboard-header {
  text-align: center;
  margin-bottom: 50px;
}

.header-content {
  max-width: 800px;
  margin: 0 auto;
}


.logo-group {
  margin-bottom: 30px;
}

.contractor-logo {
  position: relative;
  display: inline-block;
  font-family: 'Playfair Display', serif;
  font-size: 2.8rem;
  font-weight: 600;
  color: var(--text-dark);
  letter-spacing: 1.5px;
  margin-bottom: 5px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.logo-shine {
  position: absolute;
  top: -15px;
  left: -20px;
  width: 140%;
  height: 160%;
  background: linear-gradient(
    45deg,
    rgba(212, 175, 55, 0.25) 0%,
    rgba(255, 255, 255, 0) 50%,
    rgba(212, 175, 55, 0.25) 100%
  );
  z-index: 0;
  border-radius: 50%;
  pointer-events: none;
}

.workflow-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  margin-top: 10px;
}

.divider-line {
  width: 60px;
  height: 1px;
  background: linear-gradient(
    90deg,
    rgba(0, 200, 83, 0),
    rgba(0, 200, 83, 0.6),
    rgba(0, 200, 83, 0)
  );
}

.workflow-text {
  color: var(--text-light);
  font-size: 1.1rem;
  font-weight: 400;
  margin: 0;
  white-space: nowrap;
}


.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  max-width: 1200px;
  margin: 0 auto;
}

.dashboard-card {
  background: var(--card-bg);
  padding: 30px;
  border-radius: 16px;
  box-shadow: var(--shadow);
  transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1);
  cursor: pointer;
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(0, 200, 83, 0.1);
}

.dashboard-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 40px rgba(0, 200, 83, 0.15);
}

.dashboard-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(0, 200, 83, 0.03) 0%, rgba(0, 200, 83, 0) 100%);
  z-index: -1;
}


.card-icon {
  width: 60px;
  height: 60px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(0, 200, 83, 0.1) 0%, rgba(100, 221, 23, 0.1) 100%);
  border-radius: 12px;
}

.card-icon svg {
  width: 28px;
  height: 28px;
  fill: var(--primary);
}

.dashboard-card h2 {
  color: var(--text-dark);
  font-size: 1.4rem;
  font-weight: 600;
  margin: 20px 0 10px;
}

.dashboard-card p {
  color: var(--text-light);
  font-size: 0.95rem;
  line-height: 1.5;
  margin-bottom: 20px;
}


.card-badge, .verification-badge, .card-highlight {
  display: inline-block;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
}

.card-badge {
  background-color: rgba(0, 200, 83, 0.1);
  color: var(--primary-dark);
}

.card-highlight {
  background: linear-gradient(90deg, rgba(212, 175, 55, 0.1), rgba(212, 175, 55, 0.05));
  border: 1px solid rgba(212, 175, 55, 0.2);
  color: var(--gold);
  font-weight: 600;
}

.verification-badge {
  background-color: rgba(0, 200, 83, 0.1);
  color: var(--primary-dark);
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.verification-badge svg {
  fill: var(--primary);
}

.rating-display {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.stars {
  color: #ffc107;
  letter-spacing: 2px;
}


@media (max-width: 768px) {
  .dashboard {
    padding: 30px 20px;
  }
  
  .contractor-logo {
    font-size: 2.2rem;
  }
  
  .workflow-text {
    font-size: 1rem;
  }
  
  .divider-line {
    width: 30px;
  }
  
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
}
</style>