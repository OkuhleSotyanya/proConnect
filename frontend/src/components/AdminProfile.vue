<template>
  <div v-if="activePage === 'profile'" class="profile-section">
    <h2 class="profile-title">Admin Profile</h2>

    <div class="profile-info">
      <img :src="profileImage" alt="Profile Picture" class="profile-picture" />
      <div>
        <p><strong>Email:</strong> admin@example.co.za</p>
        <p><strong>Role:</strong> Administrator</p>
        <p><strong>Name:</strong> Admin User</p>
      </div>
    </div>

    <div class="button-group">
      
      <button @click="signOut" class="signout-btn">🚪 Sign Out</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "AdminProfile",
  data() {
    return {
      activePage: "profile",
      profileImage: require("@/assets/clients/client4.jpg"),
    };
  },
  methods: {
    editProfile() {
      console.log("Edit profile clicked");
    },
    signOut() {
      // If you are storing authentication tokens, clear them here
      localStorage.removeItem("authToken"); // Optional if you store token

      // Redirect to login page
      this.$router.push("/login");
    },
  },
};
</script>

<style scoped>
.profile-section {
  background: #ffffff;
  padding: 25px;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  max-width: 500px;
  margin: auto;
}

.profile-title {
  font-size: 1.8rem;
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 20px;
  border-bottom: 2px solid #eee;
  padding-bottom: 10px;
}

.profile-info {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
}

.profile-picture {
  width: 90px;
  height: 90px;
  object-fit: cover;
  border-radius: 50%;
  border: 2px solid #ccc;
}

.button-group {
  display: flex;
  gap: 10px;
}

.edit-btn {
  background: #3498db;
  color: white;
  padding: 8px 14px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.edit-btn:hover {
  background: #2980b9;
}

.signout-btn {
  background: crimson;
  color: white;
  padding: 8px 14px;
  border: none;
  cursor: pointer;
  border-radius: 4px;
}

.signout-btn:hover {
  background: darkred;
}
</style>
