<template>
  <div id="app">
    <header>
      <navigation></navigation>
    </header>
    
    <main>
      <router-view></router-view>
    </main>

    <footer>
    </footer>
  </div>
</template>

<script>

import ApiConnector from './ApiConnector.js'
import Navigation from './components/Navigation.vue'

export default {
  name: 'app',
  methods: {
    
  },
  components: {
    Navigation
  }
}
</script>

<style scoped>
  #app {
    min-height: 100%;
  }

  main {
    min-height: 100%
  }

  footer {
    min-height: 40px;
  }
</style>
