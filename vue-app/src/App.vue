<template>
  <v-app>
    <Navigation></Navigation>

    <v-app-bar app color="white" v-if="shouldDisplayLoginToolbar">
      <v-toolbar-title class="cursor-pointer" @click="$router.push({name: 'LandingPage'})">
        <i class="fa fa-cutlery" aria-hidden="true"></i> Alt Szama
      </v-toolbar-title>
    </v-app-bar>

    <v-app-bar app v-if="shouldDisplayToolbar">
      <v-app-bar-nav-icon v-if="shouldDisplayHamburger()" @click.stop="toggleMasterNavDrawerOpened()">
      </v-app-bar-nav-icon>

      <v-btn v-if="shouldDisplayBackButton()" icon class="back-button hidden-xs-only" @click="goBack()">
        <v-icon>arrow_back</v-icon>
      </v-btn>

      <v-toolbar-title>{{ title }}</v-toolbar-title>
    </v-app-bar>

    <v-main>
      <router-view></router-view>
    </v-main>

    <v-footer height="auto">
      <div class="footer-info pa-4">
        Please direct all your wishes and complaints to&nbsp;
        <a href="mailto:lukasztenerowicz+altszama@gmail.com">Łukasz Tenerowicz</a>
      </div>
    </v-footer>
  </v-app>
</template>

<script lang="ts">
import Navigation from './views/commons/Navigation.vue'
import Vue from "vue";
import {Component} from "vue-property-decorator";

@Component({
  name: 'app',
  components: {
    Navigation,
  }
})
export default class App extends Vue {

  mounted() {
    const initialMasterDrawerOpened = !["xs", "sm", "md"].includes(this.$vuetify.breakpoint.name)
    this.$store.commit("setMasterNavigationDrawerOpened", initialMasterDrawerOpened)
  }

  shouldDisplayHamburger() {
    return !this.displayBackButton;
  }

  shouldDisplayBackButton() {
    return this.displayBackButton;
  }

  toggleMasterNavDrawerOpened() {
    this.$store.commit("toggleMasterNavigationDrawerOpened");
  }

  goBack() {
    this.$router.back();
  }

  get loading() {
    return this.$store.state.loading;
  }

  get title() {
    return this.$store.getters.titleText;
  }

  get displayBackButton() {
    return this.$store.state.displayBackButton;
  }

  get shouldDisplayToolbar() {
    return this.$store.getters.shouldDisplayToolbar
  }

  get shouldDisplayLoginToolbar() {
    return this.$store.getters.shouldDisplayLoginToolbar
  }
}
</script>

<style scoped>
footer {
  display: flex;
  flex-direction: row;
  justify-content: center;
}

.footer-info {
  justify-self: center;
}

.cursor-pointer {
  cursor: pointer;
}
</style>
