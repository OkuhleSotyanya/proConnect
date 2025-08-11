<template>
  <div id="home-view">
    <h1>Welcome to ProConnect</h1>
    <p>This is the home view of the application.</p>
    <nav>
      <ul>
        <li><router-link to="/login">Login</router-link></li>
        <li><router-link to="/about">About</router-link></li>
      </ul> 
      //there should be a profile icon at the top right corner
      <li><router-link to="/profile"><i class="fa fa-user"></i> Profile</router-link></li>
    </nav>

  </div>
</template>