<template>
    <v-app>
      <Navigation></Navigation>

      <router-view></router-view>
    </v-app>
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
</style>
