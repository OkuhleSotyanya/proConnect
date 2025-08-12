
<template>
  <div id="login-view">
    <h1>Login to ProConnect</h1>
    <form @submit.prevent="handleLogin">
      <label for="username">Username:</label>
      <input type="text" id="username" v-model="username" required>

      <label for="password">Password:</label>
      <input type="password" id="password" v-model="password" required>

      <button type="submit">Login</button>
    </form> 
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  </div>
</template>   