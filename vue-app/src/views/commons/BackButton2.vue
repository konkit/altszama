<template>
  <v-btn icon class="hidden-xs-only" @click="followLink">
    <v-icon>arrow_back</v-icon>
  </v-btn>
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