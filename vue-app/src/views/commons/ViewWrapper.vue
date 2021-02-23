<template>
  <div class="view-wrapper">
    <v-app-bar app>
      <v-app-bar-nav-icon
        v-if="shouldDisplayHamburger()"
        @click.stop="toggleMasterNavDrawerOpened()"
      ></v-app-bar-nav-icon>

      <v-btn v-if="shouldDisplayBackButton()" icon class="back-button hidden-xs-only" @click="goBack()">
        <v-icon>arrow_back</v-icon>
      </v-btn>

      <v-toolbar-title>{{ title }}</v-toolbar-title>

      <v-spacer></v-spacer>

      <template v-if="!loading">
        <slot name="toolbar-buttons"></slot>
      </template>
    </v-app-bar>

    <v-main class="view-content">
      <div class="content-class">
        <slot></slot>
      </div>

      <v-footer height="auto">
        <div class="footer-info pa-4">
          Please direct all your wishes and complaints to&nbsp;
          <a href="mailto:lukasztenerowicz+altszama@gmail.com">Łukasz Tenerowicz</a>
        </div>
      </v-footer>
    </v-main>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";

@Component({
  name: "ViewWrapper",
})
export default class ViewWrapper extends Vue {
  displayBackButton = false

  mounted() {
    this.$route.matched.forEach(r => {
      this.displayBackButton = r.meta.backButton
    })
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
