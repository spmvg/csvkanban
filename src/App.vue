<template>
  <div id="app">
    <NavBar />
    <div class="container-fluid">
      <router-view/>
    </div>
  </div>
</template>

<script>
  import NavBar from './components/NavBar.vue';

  export default {
    name: 'App',
    components: {
      NavBar,
    },
  }
</script>

<style>
  @import 'https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,700;1,400&display=swap';
  @import 'https://fonts.googleapis.com/css2?family=Open+Sans:wght@700&display=swap';

  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #ddd;
    background-color: rgb(60, 63, 65);
  }

  html, body {
    background-color: rgb(60, 63, 65);
  }

  .left-aligned-col {
    text-align: left;
  }

  .centered-col {
    text-align: center;
  }

  .centered-span {
    font-size: 20pt;
    vertical-align: middle;
  }

  .settings-box {
    background-color:rgb(43, 43, 43);
    align-items: center;
    display: flex;
    justify-content: center;
  }

  .dark-mode-input {
    border-color: #222 !important;
    color: #ddd !important;
    background-color: rgb(25, 25, 25) !important;
  }

  .dark-mode-input:focus {
    box-shadow: 0 0 8px rgb(0, 0, 0) !important;
  }

  .dark-mode-button {
    background-color: rgb(25, 25, 25) !important;
    border-color: #222 !important;
  }

  .dark-mode-button:hover {
    box-shadow: 0 0 8px rgb(0, 0, 0) !important;
  }

  .dark-mode-button:focus {
    box-shadow: 0 0 8px rgb(0, 0, 0) !important;
  }

  .dark-mode-list {
    color: #ddd !important;
    background-color: rgb(25, 25, 25) !important;
    border-color: #222 !important;
  }

  .dark-mode-list:hover {
    background-color: rgb(50, 50, 50) !important;
  }
  </style>
