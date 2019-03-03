<template>
  <div v-if="shouldDisplayNavigation()">
    <v-navigation-drawer app :value="masterNavDrawerOpened" @input="setMasterNavDrawerOpened($event)">

      <v-toolbar flat class="transparent">
        <v-list class="pa-0">
          <v-list-tile avatar>
            <v-list-tile-avatar>
              <i class="fa fa-cutlery" aria-hidden="true"></i>
            </v-list-tile-avatar>

            <v-list-tile-content>
              Alt Szama
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-toolbar>

      <v-divider></v-divider>

      <v-list>
        <v-list-tile @click="goToPath('/orders')">
          <v-list-tile-content>
            <v-list-tile-title>Today's orders</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-list-tile @click="goToPath('/all_orders')">
          <v-list-tile-content>
            <v-list-tile-title>All orders</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-list-tile @click="goToPath('/restaurants')">
          <v-list-tile-content>
            <v-list-tile-title>Restaurants and dishes</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>

      <v-divider></v-divider>

      <div>
        <div>
          <v-list>
            <v-list-tile avatar>
              <v-list-tile-content>
                <v-list-tile-title><b>Hi {{this.username}}!</b></v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>

            <v-list-tile @click="logout">
              <v-list-tile-title>Logout</v-list-tile-title>
            </v-list-tile>
          </v-list>
        </div>
      </div>

    </v-navigation-drawer>
  </div>
</template>

<script>
  import ApiConnector from '../../lib/ApiConnector'

  export default {
    name: 'navigation',
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
  }
</script>

<style scoped>
</style>

