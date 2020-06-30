<template>
  <v-btn icon class="hidden-xs-only" @click="followLink">
    <v-icon>arrow_back</v-icon>
  </v-btn>
</template>

<script lang="ts">
  import Vue from "vue";
  import {Prop} from "vue-property-decorator";
  import Component from "vue-class-component";

  @Component({})
  export default class BackButton extends Vue {
    @Prop() href!: string;

    followLink() {
      location.href = this.href;
    }
  }
</script>