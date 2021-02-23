<template>
  <v-container>
    <slot></slot>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";

@Component({
  name: "ViewWrapper",
})
export default class ViewWrapper extends Vue {

}
</script>

<style scoped>
</style>
