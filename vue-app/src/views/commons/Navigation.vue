<template>
  <div v-if="shouldDisplayNavigation()">
    <v-navigation-drawer app :value="masterNavDrawerOpened" @input="setMasterNavDrawerOpened($event)">

      <v-list>
        <v-list-item link>
          <v-list-item-icon>
            <v-icon>fa fa-cutlery</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>Alt Szama</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <!--<v-divider></v-divider>-->

      <v-list>
        <v-list-item @click="goToPath('/orders')">
          <v-list-item-content>
            <v-list-item-title>Today's orders</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item @click="goToPath('/all_orders')">
          <v-list-item-content>
            <v-list-item-title>All orders</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item @click="goToPath('/restaurants')">
          <v-list-item-content>
            <v-list-item-title>Restaurants and dishes</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item @click="goToPath('/teams')">
          <v-list-item-content>
            <v-list-item-title>Teams</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <v-divider></v-divider>

      <v-list>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title><b>Hi {{this.username}}!</b></v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item @click="logout">
          <v-list-item-title>Logout</v-list-item-title>
        </v-list-item>
      </v-list>

    </v-navigation-drawer>
  </div>
</template>

<script lang="ts">
  import ApiConnector from '../../lib/ApiConnector'
  import Vue from "vue";
  import Component from "vue-class-component";

  @Component({})
  export default class Navigation extends Vue {
    get username() {
      return this.$store.state.username;
    }

    get masterNavDrawerOpened() {
      return this.$store.state.masterNavDrawerOpened
    }

    shouldDisplayNavigation() {
      return this.$route.name !== "Login"
    }

    logout(): void {
      ApiConnector.logout();
    }

    goToPath(path: string) {
      this.$router.push(path)
    }

    setMasterNavDrawerOpened(newValue: boolean) {
      this.$store.commit("setMasterNavigationDrawerOpened", newValue);
    }
  }
</script>

<style scoped>
</style>

