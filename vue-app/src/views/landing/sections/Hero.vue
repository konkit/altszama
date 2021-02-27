<template>
  <section id="hero">
    <v-img :src="require('@/assets/lunch2.png')" class="black--text cover-image">

      <v-container class="fill-height px-4 py-12">
        <v-responsive
            class="d-flex align-center"
            height="100%"
            max-width="700"
            width="100%"
        >
          <h1 class="display-2 font-weight-black mb-4 text-left">ORDER FOOD WITH YOUR COLLEAGUES</h1>

          <h5 class="base-body text-h5 mb-4">and keep track of orders and payments easily!</h5>

          <div :class="$vuetify.breakpoint.smAndDown ? 'flex-column align-start' : 'align-center'" class="d-flex flex-wrap">
            <router-link :to="{name: 'Login'}"><v-btn x-large color="success">Let's start!</v-btn></router-link>
          </div>
        </v-responsive>
      </v-container>
    </v-img>
  </section>
</template>

<script>
export default {
  name: 'SectionHero',
  provide: {
    theme: {isDark: false},
  },

  computed: {
    height() {
      return "calc(100vh - 128px)"
    },
  },
}
</script>

<style>
/*@import "../variable.scss";*/

.cover-image {
  height: calc(100vh - 128px)
}
</style>
