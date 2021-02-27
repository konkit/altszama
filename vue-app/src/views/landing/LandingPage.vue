<template>
<!--  <v-app>-->
<!--    <v-main >-->
<!--      <v-fade-transition mode="out-in">-->
        <section>
          <v-row no-gutters>
            <v-col cols="12">
              <SectionHero></SectionHero>
              <Description></Description>
            </v-col>
          </v-row>
        </section>
<!--      </v-fade-transition>-->
<!--    </v-main>-->

<!--    <home-footer/>-->
<!--  </v-app>-->
</template>

<script>
import HomeFooter from '@/views/landing/sections/Footer'
import Description from "@/views/landing/sections/Description";
import SectionHero from "@/views/landing/sections/Hero";

export default {
  name: 'HomeLayout',

  components: {
    // HomeFooter,
    Description,
    SectionHero
  }
}
</script>

<style lang="scss">


</style>
