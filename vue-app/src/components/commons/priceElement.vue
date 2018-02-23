<template>
  <vue-numeric currency="zł" separator="." currency-symbol-position="suffix" v-bind:value="this.dataPrice / 100" v-bind:read-only="true" v-bind:precision="2"></vue-numeric>
</template>

<script>
  export default {
    name: 'price',
    props: ['dataPrice'],
    data: () => ({  })
  }
</script>