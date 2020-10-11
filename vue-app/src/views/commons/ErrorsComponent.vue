<template>
  <v-container v-if="errors.length > 0" class="errors-container">
    <v-row>
      <v-col>
        <v-alert
          v-for="(errorMsg, i) in errors"
          :key="i"
          :value="true"
          color="warning"
          icon="new_releases"
          outlined
          dismissible
        >
          {{ errorMsg }}
        </v-alert>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";

@Component({})
export default class ErrorsComponent extends Vue {
  get errors() {
    return this.$store.state.errors;
  }
}
</script>
