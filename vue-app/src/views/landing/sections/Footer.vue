<template>
  <v-footer
    id="home-footer"
    color="grey darken-4"
    dark
  >
    <v-container>
      <v-row>
        <v-col cols="12" md="6">
        </v-col>

        <v-col
          class="text-center text-md-right"
          cols="12"
          md="6"
        >
          Copyright &copy; 2020 Łukasz Tenerowicz
        </v-col>
      </v-row>
    </v-container>
  </v-footer>
</template>

<script>
  export default {
    name: 'HomeFooter',

    data: () => ({
    }),
  }
</script>

<style>
  @import "../variable.scss";

  #home-footer {
    min-height: max-content;
  }
</style>
