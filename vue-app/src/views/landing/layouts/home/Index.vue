<template>
  <v-app>
    <v-toolbar>
      <v-toolbar-title>
        <i class="fa fa-cutlery" aria-hidden="true"></i> Alt Szama
      </v-toolbar-title>
    </v-toolbar>

    <v-content>
      <v-fade-transition mode="out-in">
        <LoginIndexView></LoginIndexView>
      </v-fade-transition>
    </v-content>

    <home-footer />
  </v-app>
</template>

<script>
    import HomeFooter from '@/views/landing/layouts/home/Footer'
    import LoginIndexView from '@/views/landing/views/home/Index.vue';

  export default {
    name: 'HomeLayout',

    components: {
      HomeFooter: HomeFooter,
      LoginIndexView: LoginIndexView
    },
  }
</script>
