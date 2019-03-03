<template>
  <div id="app">
    <v-app>
      <Navigation></Navigation>

      <router-view></router-view>

      <v-footer app>
        <div class="footer-info">
          Please direct all your wishes and complaints to&nbsp;<a href="mailto:lukasztenerowicz+altszama@gmail.com">Łukasz Tenerowicz</a>
        </div>
      </v-footer>
    </v-app>
  </div>
</template>

<script>
  import Router from 'vue-router'
  import Navigation from './views/commons/Navigation.vue'
  import ApiConnector from "./lib/ApiConnector";

  export default {
    name: 'app',
    data: () => ({
      drawer: null
    }),
    computed: {
      username() {
        return this.$store.state.username;
      },
      masterNavDrawerOpened() {
        return this.$store.state.masterNavDrawerOpened
      }
    },
    methods: {
      shouldDisplayNavigation() {
        return this.$route.name !== "Login"
      },
      logout() {
        ApiConnector.logout();
      },
      goToPath(path) {
        this.$router.push(path)
      },
      setMasterNavDrawerOpened(newValue) {
        this.$store.commit("setMasterNavigationDrawerOpened", newValue);
      }
    },
    components: {
      Navigation,
      Router
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
    display: flex;
    flex-direction: row;
    justify-content: center;
  }

  .footer-info {
    justify-self: center;
  }

</style>
