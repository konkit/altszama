<template>
  <v-container v-if="errors.length > 0" class="errors-container">
    <v-row>
      <v-col>
        <v-alert v-for="(errorMsg, i) in errors" :value="true" color="warning" icon="new_releases" outlined dismissible>
          {{errorMsg}}
        </v-alert>
      </v-col>
    </v-row>
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
