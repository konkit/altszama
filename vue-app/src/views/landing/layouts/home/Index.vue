<template>
  <v-app>
    <home-system-bar />

    <home-app-bar />

    <home-view />

    <home-footer />

    <home-settings />
  </v-app>
</template>

<script>
  export default {
    name: 'HomeLayout',

    components: {
      HomeAppBar: () => import('@/views/landing/layouts/home/AppBar'),
      HomeFooter: () => import('@/views/landing/layouts/home/Footer'),
      HomeSettings: () => import('@/views/landing/layouts/home/Settings'),
      HomeSystemBar: () => import('@/views/landing/layouts/home/SystemBar'),
      HomeView: () => import('@/views/landing/layouts/home/View'),
    },
  }
</script>
