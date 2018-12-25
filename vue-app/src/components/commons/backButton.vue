<template>
  <button class="btn btn-light" v-on:click="followLink">
    <i class="fa fa-arrow-left" aria-hidden="true"></i>&nbsp;Back
  </button>
</template>

<script>
  export default {
    name: 'back-button',
    props: ['href'],
    methods: {
      followLink: function () {
        location = this.href
      }
    }
  }
</script>