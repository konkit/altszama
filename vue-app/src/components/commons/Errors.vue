<template>
  <div class="row" v-if="this.errorsArray.length > 0">
    <div class="col">

      <div class="errors">
        <div v-for="(errorMsg, i) in this.errorsArray" :key=i class="alert alert-danger alert-dismissable">
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
    data() {
      return {
        errorsArray: []
      }
    },
    methods: {
      addError: function (errors) {
        const errorsArray = this.errorsArray;

        if (Errors instanceof Array) {
          Errors.forEach(function (errorStr) {
            errorsArray.push(errorStr);
          });
        } else if (typeof Errors == 'object' && typeof Errors.exception !== "undefined") {
          errorsArray.push("Error: " + Errors.exception + " occured!");
        } else {
          errorsArray.push("Error: " + Errors);
        }
      },
      close: function (errorIndex) {
        this.errorsArray.splice(errorIndex, 1)
      }
    }
  }
</script>
