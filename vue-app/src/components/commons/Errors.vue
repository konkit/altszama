<template>
  <div class="row" v-if="errors.length > 0">
    <div class="col">

      <div class="errors">
        <div v-for="(errorMsg, i) in errors" :key=i class="alert alert-danger alert-dismissable">
          <a href="#" class="close" data-dismiss="alert" aria-label="close" @click="close(i)">&times;</a>
          {{errorMsg}}
        </div>
      </div>

    </div>
  </div>
</template>

<script>
  export default {
    name: 'errors-component',
    methods: {
      close: function (errorIndex) {
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
