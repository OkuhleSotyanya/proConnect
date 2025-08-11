<template>
  
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const isDropdownOpen = ref(false);
const router = useRouter();

function toggleDropdown() {
  isDropdownOpen.value = !isDropdownOpen.value;
}

function signOut() {
  // Implement your sign-out logic here
  // For example, clearing local storage, a state management store, etc.
  console.log('User signed out');
  router.push('/login'); // Redirect to login page
}
</script>

<style scoped>

</style>