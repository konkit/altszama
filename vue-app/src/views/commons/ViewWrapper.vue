<template>
  <div class="view-wrapper">
    <v-app-bar app>
      <v-app-bar-nav-icon
        v-if="shouldDisplayHamburger()"
        @click.stop="toggleMasterNavDrawerOpened()"
      ></v-app-bar-nav-icon>

      <back-button
        v-if="shouldDisplayBackButton()"
        :href="backpath"
      ></back-button>

      <v-toolbar-title>{{ titleText() }}</v-toolbar-title>

      <v-spacer></v-spacer>

      <template v-if="!loading">
        <slot name="toolbar-buttons"></slot>
      </template>
    </v-app-bar>

    <Navigation></Navigation>

    <v-main class="view-content">
      <div class="content-class">
        <slot></slot>
      </div>

      <v-footer height="auto">
        <div class="footer-info pa-4">
          Please direct all your wishes and complaints to&nbsp;<a
            href="mailto:lukasztenerowicz+altszama@gmail.com"
            >Łukasz Tenerowicz</a
          >
        </div>
      </v-footer>
    </v-main>
  </div>
</template>

<script lang="ts">
import BackButton from "./BackButton2.vue";
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import Navigation from "@/views/commons/Navigation.vue";

@Component({
  components: { BackButton, Navigation }
})
export default class ViewWrapper extends Vue {
  @Prop() title!: string;
  @Prop() backpath!: string;

  titleText() {
    if (this.loading) {
      return "Loading ...";
    } else {
      return this.title;
    }
  }

  shouldDisplayHamburger() {
    return !this.backpath;
  }

  shouldDisplayBackButton() {
    return this.backpath;
  }

  toggleMasterNavDrawerOpened() {
    this.$store.commit("toggleMasterNavigationDrawerOpened");
  }

  get loading() {
    return this.$store.state.loading;
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
