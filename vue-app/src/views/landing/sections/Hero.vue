<template>
  <section id="hero">
    <v-img
        :height="height"
        :src="require('@/assets/lunch2.png')"
        class="black--text"
    >

      <v-container class="fill-height px-4 py-12">
        <v-responsive
            class="d-flex align-center"
            height="100%"
            max-width="700"
            width="100%"
        >
          <h1 class="display-2 font-weight-black mb-4 text-left">ORDERING FOOD AT THE OFFICE?</h1>

          <h5 class="base-body text-h5 mb-4">Hard to keep track the orders and the payments?</h5>
          <h5 class="base-body text-h5 mb-4">The search is over!</h5>

          <div
              :class="$vuetify.breakpoint.smAndDown ? 'flex-column align-start' : 'align-center'"
              class="d-flex flex-wrap"
          >
            <GoogleLoginButton></GoogleLoginButton>
          </div>
        </v-responsive>
      </v-container>
    </v-img>
  </section>
</template>

<script>


import GoogleLoginButton from "@/views/landing/components/GoogleLoginButton";

export default {
  name: 'SectionHero',
  components: {GoogleLoginButton},
  provide: {
    theme: {isDark: false},
  },

  computed: {
    height() {
      // const height = this.$vuetify.breakpoint.mdAndUp ? '100vh' : '50vh'
      // return `calc(${height} - 64px)`

      return "calc(100vh - 64px)"
    },
  },
}
</script>

<style>
/*@import "../variable.scss";*/
</style>
