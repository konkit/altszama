<template>
  <div v-if="shouldDisplayNavigation()">
    <b-navbar toggleable="md" type="light" variant="light">

    <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
      <b-navbar-brand href="#"><i class="fa fa-cutlery" aria-hidden="true"></i> Alt Szama</b-navbar-brand>

      <b-collapse is-nav id="nav_collapse">

        <b-navbar-nav>
          <b-nav-item href="#/orders">Today's orders</b-nav-item>
          <b-nav-item href="#/all_orders">All orders</b-nav-item>
          <b-nav-item href="#/restaurants">Restaurants and dishes</b-nav-item>
        </b-navbar-nav>

        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">

          <b-nav-item-dropdown right>
            <!-- Using button-content slot -->
            <template slot="button-content">
              <em>Hi {{this.username}}!</em>
            </template>
            <b-dropdown-item @click="logout">Logout</b-dropdown-item>
          </b-nav-item-dropdown>

        </b-navbar-nav>

      </b-collapse>
    </b-navbar>
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
      }
    }
  }
</script>

<style scoped>
</style>

