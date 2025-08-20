<template>
  <div>
    <Navbar />
    <main>
      <h1>Welcome to the Home Page</h1>
      <p>This is the main content of your application.</p>
    </main>
  </div>
</template>

<script setup>
import Navbar from '@/components/ContractorNavbar.vue';
</script>

<style scoped>
main {
  padding: 20px;
  background-color: #f9f9f9;
  min-height: calc(100vh - 60px); 
}
</style>