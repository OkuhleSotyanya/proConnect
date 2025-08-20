<template>
  <div class="modal-overlay">
    <div class="modal-content">
      <h2>Book {{ contractor.name }}</h2>

      <form @submit.prevent="submitForm">
        <label>
          Name:
          <input v-model="form.name" required />
        </label>

        <label>
          Email:
          <input type="email" v-model="form.email" required />
        </label>

        <label>
          Cell Number:
          <input type="tel" v-model="form.cell" required />
        </label>

        <label>
          Location:
          <input v-model="form.location" required />
        </label>

        <label>
          Job Description:
          <textarea v-model="form.description" required></textarea>
        </label>

        <div class="form-actions">
          <button type="submit">Submit Request</button>
          <button type="button" @click="$emit('close')">Cancel</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BookingForm',
  props: ['contractor'],
  data() {
    return {
      form: {
        name: '',
        email: '',
        cell: '',
        location: '',
        description: ''
      }
    };
  },
  methods: {
    submitForm() {
      alert(`Booking submitted for ${this.contractor.name}.\nDetails:\n${JSON.stringify(this.form, null, 2)}`);
      this.$emit('close');
    }
  }
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: #fff;
  padding: 2rem;
  border-radius: 12px;
  width: 90%;
  max-width: 480px;
  box-shadow: 0 8px 20px rgba(0,0,0,0.15);
}

h2 {
  margin-bottom: 1.5rem;
  color: #4B6043;
  font-size: 1.5rem;
  font-weight: 700;
  text-align: center;
}

form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

label {
  font-weight: 600;
  font-size: 0.95rem;
  color: #333;
}

input, textarea {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #dcdcdc;
  border-radius: 8px;
  font-size: 1rem;
  line-height: 1.4;
  background-color: #fafafa;
  transition: border-color 0.3s ease, background-color 0.3s ease;
}

input:focus, textarea:focus {
  border-color: #A8C686;
  background-color: white;
  outline: none;
}

textarea {
  resize: vertical;
  min-height: 90px;
}

.form-actions {
  display: flex;
  justify-content: space-between;
  gap: 0.8rem;
  margin-top: 1rem;
}

button {
  flex: 1;
  padding: 0.7rem 1rem;
  border: none;
  border-radius: 6px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

button[type="submit"] {
  background-color: #A8C686;
  color: white;
}

button[type="submit"]:hover {
  background-color: #94B36F;
  transform: scale(1.03);
}

button[type="button"] {
  background-color: #e0e0e0;
  color: #333;
}

button[type="button"]:hover {
  background-color: #c7c7c7;
}
</style>
