<template>
  <v-navigation-drawer v-if="shouldDisplayNavigation" app :value="masterNavDrawerOpened"
                       @input="setMasterNavDrawerOpened($event)">
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

    <v-list>
      <v-list-item @click="goToPath({name: 'TodayOrders'})">
        <v-list-item-content>
          <v-list-item-title>Today's orders</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item @click="goToPath({name: 'AllOrders'})">
        <v-list-item-content>
          <v-list-item-title>All orders</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item @click="goToPath({name: 'RestaurantIndex'})">
        <v-list-item-content>
          <v-list-item-title>Restaurants and dishes</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <v-divider></v-divider>

    <v-list>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title
          ><b>Hi {{ this.username }}!</b></v-list-item-title
          >
        </v-list-item-content>
      </v-list-item>

      <v-list-item @click="goToPath({name: 'Balance'})">
        <v-list-item-content>
          <v-list-item-title>Balance and order history</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item @click="logout">
        <v-list-item-title>Logout</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { RawLocation } from 'vue-router';
import store from '@/store';
import router from '@/router';
import GoogleLogin from '@/lib/GoogleLogin';

@Component({ name: 'Navigation' })
export default class Navigation extends Vue {
  get username() {
    return this.$store.state.username;
  }

  get masterNavDrawerOpened() {
    return this.$store.state.masterNavDrawerOpened;
  }

  get shouldDisplayNavigation() {
    return this.$store.getters.shouldDisplayToolbar;
  }

  logout(): void {
    store.commit('logoutUser');

    store.commit('setPushNotificationEnabled', false);

    const signOutCallback = () => router.push({ name: 'Login' });
    GoogleLogin.signOut(signOutCallback, signOutCallback);
  }

  goToPath(path: RawLocation) {
    this.$router.push(path).catch((err) => {
      /* NOP */
    });
  }

  setMasterNavDrawerOpened(newValue: boolean) {
    this.$store.commit('setMasterNavigationDrawerOpened', newValue);
  }

  get shouldDisplayToolbar() {
    return this.$store.getters.shouldDisplayToolbar;
  }
}
</script>

<style scoped></style>
