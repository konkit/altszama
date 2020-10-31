<template>
  <v-app>
    <v-toolbar>
      <v-toolbar-title>
        <i class="fa fa-cutlery" aria-hidden="true"></i> Alt Szama
      </v-toolbar-title>
    </v-toolbar>

    <v-content>
      <v-fade-transition mode="out-in">
        <section>
          <v-row no-gutters>
            <v-col cols="12">
              <SectionHero></SectionHero>
              <SectionThemeFeatures></SectionThemeFeatures>
              <SectionFeatures></SectionFeatures>
              <SectionBusinessInfo></SectionBusinessInfo>
            </v-col>
          </v-row>
        </section>
      </v-fade-transition>
    </v-content>

    <home-footer />
  </v-app>
</template>

<script>
    import HomeFooter from '@/views/landing/components/sections/Footer'
    import SectionBusinessInfo from "@/views/landing/components/sections/Info";
    import SectionFeatures from "@/views/landing/components/sections/Features";
    import SectionThemeFeatures from "@/views/landing/components/sections/ThemeFeatures";
    import SectionHero from "@/views/landing/components/sections/Hero";

  export default {
    name: 'HomeLayout',

    components: {
      HomeFooter: HomeFooter,
      SectionBusinessInfo,
      SectionFeatures,
      SectionThemeFeatures,
      SectionHero
    }
  }
</script>
