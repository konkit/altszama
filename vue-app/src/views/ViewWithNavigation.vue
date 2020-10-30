<template>
  <div class="view-with-navigation">
    <Navigation></Navigation>

    <router-view></router-view>
  </div>
</template>

<script>
import Navigation from "@/views/commons/Navigation";
import ApiConnector from "@/lib/ApiConnector";

export default {
  name: "ViewWithNavigation",
  components: {
    Navigation
  },
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
    goToPath(path) {
      this.$router.push(path)
    },
    setMasterNavDrawerOpened(newValue) {
      this.$store.commit("setMasterNavigationDrawerOpened", newValue);
    }
  },
}
</script>

<style scoped>
.view-with-navigation {
  width: 100%;
  height: 100%;
}
</style>