<template>
  <vue-numeric currency="zł" separator="." currency-symbol-position="suffix" :value="this.dataPrice / 100"
               :read-only="true" :precision="2"></vue-numeric>
</template>

<script>
  export default {
    name: 'price',
    props: ['dataPrice'],
    data: () => ({})
  }
</script>