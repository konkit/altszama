<template>
  <v-app>
    <Navigation v-if="shouldDisplayNavigation"></Navigation>

    <router-view></router-view>
  </v-app>
</template>

<script>
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
      },
      shouldDisplayNavigation() {
        return this.$route.name !== "Login"
      },
    },
    methods: {
      // shouldDisplayNavigation() {
      //   return this.$route.name !== "Login"
      // },
      logout() {
        ApiConnector.logout();
      },
      setMasterNavDrawerOpened(newValue) {
        this.$store.commit("setMasterNavigationDrawerOpened", newValue);
      }
    },
    components: {
      Navigation,
    }
  }
</script>

<style scoped>

</style>
