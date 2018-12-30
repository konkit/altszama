<template>
  <button class="btn btn-light" @click="followLink">
    <i class="fa fa-arrow-left" aria-hidden="true"></i>&nbsp;Back
  </button>
</template>

<script>
  export default {
    name: 'back-button',
    props: ['href'],
    methods: {
      followLink  () {
        location = this.href
      }
    }
  }
</script>