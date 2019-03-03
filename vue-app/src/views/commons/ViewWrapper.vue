<template>
  <div>
    <v-toolbar app>
      <v-toolbar-side-icon v-if="shouldDisplayHamburger()" @click.stop="toggleMasterNavDrawerOpened()"></v-toolbar-side-icon>

      <back-button v-if="shouldDisplayBackButton()" :href="backpath"></back-button>

      <v-toolbar-title>{{ title }}</v-toolbar-title>

      <v-spacer></v-spacer>

      <slot name="toolbar-buttons"></slot>
    </v-toolbar>

    <v-content>
      <slot></slot>
    </v-content>
  </div>
</template>

<script>
  import BackButton from "./BackButton2";

  export default {
    name: "ViewWrapper",
    components: {BackButton},
    props: ['title', 'backpath'],
    methods: {
      shouldDisplayHamburger() {
        return !this.backpath;
      },
      shouldDisplayBackButton() {
        return this.backpath;
      },
      toggleMasterNavDrawerOpened() {
        this.$store.commit("toggleMasterNavigationDrawerOpened");
      }
    }
  }
</script>

<style scoped>
</style>