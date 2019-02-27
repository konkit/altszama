<template>
  <v-container v-if="errors.length > 0" class="errors-container">
    <v-layout row>
      <v-flex>
        <v-alert v-for="(errorMsg, i) in errors" :value="true" color="warning" icon="new_releases" outline dismissible>
          {{errorMsg}}
        </v-alert>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  export default {
    name: 'errors-component',
    methods: {
      close (errorIndex) {
        this.$store.commit("clearErrorAtIndex", errorIndex)
      }
    },
    computed: {
      errors() {
        return this.$store.state.errors;
      }
    }
  }
</script>
