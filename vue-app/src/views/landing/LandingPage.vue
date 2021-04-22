<template>
  <section>
    <v-row no-gutters>
      <v-col cols="12">
        <SectionHero></SectionHero>
        <Description></Description>
      </v-col>
    </v-row>
  </section>
</template>

<script>
import Description from "@/views/landing/sections/Description";
import SectionHero from "@/views/landing/sections/Hero";

export default {
  name: 'HomeLayout',

  components: {
    Description,
    SectionHero
  }
}
</script>

<style lang="scss">
</style>
