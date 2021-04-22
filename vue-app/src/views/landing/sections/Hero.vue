<template>
  <section>
    <v-img :src="require('@/assets/lunch2.png')" class="cover-image">
      <v-container class="fill-height">
        <div class="d-flex flex-column align-center py-16 align-center full-width height-fit-content  align-self-center">

          <h1 class="text-h4 text-sm-h3 text-md-h2 text-center font-weight-bold">Order food with your colleagues</h1>

          <h2 class="text-h5 text-sm-h4 text-md-h3 mt-md-3  text-center">keep track of orders and payments</h2>

          <div :class="$vuetify.breakpoint.smAndDown ? 'flex-column align-start' : 'align-center'"
               class="d-flex flex-wrap mt-10">
            <router-link :to="{name: 'Login'}">
              <v-btn x-large color="success">Let's start!</v-btn>
            </router-link>
          </div>
        </div>
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

.full-width {
  width: 100%;
}

.full-height {
  height: 100%;
}

.height-fit-content {
  height: fit-content;
}

.cover-image {
  height: calc(100vh - 64px);
  /*width: 100%;*/
  /*background-image: url('~@/assets/lunch2.png');*/
}
</style>
