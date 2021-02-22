<template>
  <v-app>
    <Navigation></Navigation>

    <router-view></router-view>
  </v-app>
</template>

<script>
  import Navigation from './views/commons/Navigation.vue'
  import ApiConnector from "./lib/ApiConnector";

  export default {
    name: 'app',
    data: () => ({
    }),
    methods: {},
    components: {
      Navigation,
    }
  }
</script>

<style scoped>

</style>
