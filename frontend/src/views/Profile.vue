<template>
  <div class="profile-page">
    <h1>Your Profile</h1>

    <div class="profile-section">
      <label for="profile-pic" class="upload-label">
        <div class="profile-pic" v-if="profilePicUrl" :style="{ backgroundImage: 'url(' + profilePicUrl + ')' }"></div>
        <div v-else class="profile-pic placeholder">Upload Photo</div>
      </label>
      <input type="file" id="profile-pic" @change="onFileChange" accept="image/*" hidden />
    </div>

    <div class="profile-section">
      <label for="description">Description / Bio</label>
      <textarea id="description" v-model="description" rows="4" placeholder="Write something about yourself..."></textarea>
    </div>

    <div class="profile-section">
      <label for="certificate">Upload Certificate</label>
      <input type="file" id="certificate" @change="onCertificateChange" accept=".pdf,image/*" />
      <div v-if="certificateName" class="certificate-info">
        Uploaded: {{ certificateName }}
        <button @click="removeCertificate">Remove</button>
      </div>
    </div>

    <button @click="saveProfile">Save Profile</button>
  </div>
</template>

<script>
export default {
  name: 'Profile',
  data() {
    return {
      profilePicUrl: null,
      description: '',
      certificateFile: null,
      certificateName: '',
    };
  },
  methods: {
    onFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        this.profilePicUrl = URL.createObjectURL(file);
      }
    },
    onCertificateChange(event) {
      const file = event.target.files[0];
      if (file) {
        this.certificateFile = file;
        this.certificateName = file.name;
      }
    },
    removeCertificate() {
      this.certificateFile = null;
      this.certificateName = '';
      this.$refs.certificateInput.value = '';
    },
    saveProfile() {
      alert('Profile saved! (This is just a placeholder)');
    
    },
  },
};
</script>

<style scoped>
.profile-page {
  max-width: 600px;
  margin: 40px auto;
  font-family: Arial, sans-serif;
  padding: 0 20px;
}

.profile-page h1 {
  text-align: center;
  margin-bottom: 30px;
  color: #3d5a3a;
}

.profile-section {
  margin-bottom: 25px;
}

.upload-label {
  cursor: pointer;
  display: inline-block;
}

.profile-pic {
  width: 140px;
  height: 140px;
  border-radius: 70px;
  background-size: cover;
  background-position: center;
  border: 2px solid #6ba46f;
  margin-bottom: 10px;
}

.profile-pic.placeholder {
  display: flex;
  justify-content: center;
  align-items: center;
  color: #8ebf88;
  font-weight: 600;
  background: #e6f1df;
}

textarea {
  width: 100%;
  padding: 10px;
  font-size: 1rem;
  border-radius: 8px;
  border: 1px solid #ccc;
  resize: vertical;
}

input[type="file"] {
  display: block;
}

.certificate-info {
  margin-top: 8px;
  font-size: 0.9rem;
  color: #4c7043;
  display: flex;
  align-items: center;
  gap: 10px;
}

.certificate-info button {
  padding: 4px 8px;
  background-color: #c94f4f;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

button {
  display: block;
  background-color: #6ba46f;
  color: white;
  padding: 12px 25px;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  cursor: pointer;
  margin: 0 auto;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #56895a;
}
</style>
