<template>
  <vue-numeric currency="zł" separator="." currency-symbol-position="suffix" :value="this.dataPrice / 100"
               :read-only="true" :precision="2"></vue-numeric>
</template>

<script lang="ts">
  import Vue from "vue";
  import {Prop} from "vue-property-decorator";
  import Component from "vue-class-component";

  @Component({})
  export default class Price extends Vue {
    @Prop() dataPrice;
  }
</script>