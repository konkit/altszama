<template>
  <div>
    <v-toolbar app>
      <v-toolbar-side-icon v-if="shouldDisplayHamburger()"
                           @click.stop="toggleMasterNavDrawerOpened()"></v-toolbar-side-icon>

      <back-button v-if="shouldDisplayBackButton()" :href="backpath"></back-button>

      <v-toolbar-title>{{ title }}</v-toolbar-title>

      <v-spacer></v-spacer>

      <slot name="toolbar-buttons"></slot>
    </v-toolbar>

    <v-content>
      <slot></slot>


      <v-footer height="auto">
        <div class="footer-info pa-4">
          Please direct all your wishes and complaints to&nbsp;<a href="mailto:lukasztenerowicz+altszama@gmail.com">Łukasz Tenerowicz</a>
        </div>
      </v-footer>

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
  footer {
    display: flex;
    flex-direction: row;
    justify-content: center;
  }

  .footer-info {
    justify-self: center;
  }
</style>