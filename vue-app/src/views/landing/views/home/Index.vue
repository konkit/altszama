<template>
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
</template>

<script>

  import SectionBusinessInfo from "@/views/landing/views/sections/Info";
  import SectionFeatures from "@/views/landing/views/sections/Features";
  import SectionThemeFeatures from "@/views/landing/views/sections/ThemeFeatures";
  import SectionHero from "@/views/landing/views/sections/Hero";

  export default {
    name: 'Home',

    metaInfo: { title: 'Home' },

    components: {
      SectionBusinessInfo,
      SectionFeatures,
      SectionThemeFeatures,
      SectionHero
    }
  }
</script>
