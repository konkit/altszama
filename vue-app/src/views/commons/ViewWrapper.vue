<template>
  <div class="view-wrapper">
    <v-app-bar app>
      <v-app-bar-nav-icon v-if="shouldDisplayHamburger()"
                           @click.stop="toggleMasterNavDrawerOpened()"></v-app-bar-nav-icon>

      <back-button v-if="shouldDisplayBackButton()" :href="backpath"></back-button>

      <v-toolbar-title>{{ titleText() }}</v-toolbar-title>

      <v-spacer></v-spacer>

      <template v-if="!loading">
        <slot name="toolbar-buttons"></slot>
      </template>
    </v-app-bar>

    <v-content class="view-content">
      <div class="content-class">
        <slot></slot>
      </div>


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
      titleText() {
        if (this.loading) {
          return "Loading ..."
        } else {
          return this.title;
        }
      },
      shouldDisplayHamburger() {
        return !this.backpath;
      },
      shouldDisplayBackButton() {
        return this.backpath;
      },
      toggleMasterNavDrawerOpened() {
        this.$store.commit("toggleMasterNavigationDrawerOpened");
      }
    },
    computed: {
      loading() {
        return this.$store.state.loading;
      }
    },
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

  .view-wrapper {
    height: 100%;
  }

  .view-content {
    height: 100%;
  }

  .content-class {
    min-height: 100%;
  }
</style>