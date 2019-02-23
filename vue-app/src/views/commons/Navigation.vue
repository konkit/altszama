<template>
  <div v-if="shouldDisplayNavigation()">
    <v-toolbar extended flat>
      <v-toolbar-title>
        <i class="fa fa-cutlery" aria-hidden="true"></i> Alt Szama
      </v-toolbar-title>

      <v-toolbar-items class="hidden-sm-and-down">
        <v-btn flat @click="goToPath('/orders')">Today's orders</v-btn>
        <v-btn flat @click="goToPath('/all_orders')">All orders</v-btn>
        <v-btn flat @click="goToPath('/restaurants')">Restaurants and dishes</v-btn>
      </v-toolbar-items>


      <v-spacer></v-spacer>


      <v-menu :nudge-width="100">
        <v-toolbar-title slot="activator">
          <span>Hi {{this.username}}!</span>
          <v-icon>arrow_drop_down</v-icon>
        </v-toolbar-title>

        <v-list>
          <v-list-tile @click="logout">
            <v-list-tile-title>Logout</v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>
    </v-toolbar>
  </div>
</template>

<script>
  import ApiConnector from '../../lib/ApiConnector'

  export default {
    name: 'navigation',
    computed: {
      username () {
        return this.$store.state.username;
      }
    },
    methods: {
      shouldDisplayNavigation () {
        return this.$route.name !== "Login"
      },
      logout () {
        ApiConnector.logout();
      },
      goToPath(path) {
        this.$router.push(path)
      }
    }
  }
</script>

<style scoped>
</style>

