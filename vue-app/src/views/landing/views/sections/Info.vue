<template>
  <v-theme-provider dark>
    <base-section
      id="info-alt"
      class="grey darken-4"
    >
      <v-responsive
        class="mx-auto"
        max-width="1400"
      >
        <v-container fluid>
          <v-row>
            <v-col
              cols="12"
              md="4"
            >
              <base-info />
            </v-col>

            <v-col
              cols="12"
              md="4"
            >
              <base-info-card title="Contact" />

              <base-business-contact dense />
            </v-col>

            <v-col
              cols="12"
              md="4"
            >
              <info-features />
            </v-col>

<!--            <v-col-->
<!--              cols="12"-->
<!--              md="3"-->
<!--            >-->
<!--&lt;!&ndash;              <instagram />&ndash;&gt;-->
<!--            </v-col>-->
          </v-row>
        </v-container>
      </v-responsive>
    </base-section>
  </v-theme-provider>
</template>

<script>
  export default {
    name: 'SectionBusinessInfo',

    components: {
      InfoFeatures: () => import('@/views/landing/components/InfoFeatures'),
      // Instagram: () => import('@/views/landing/components/Instagram'),
    },
  }
</script>

<style lang="sass">
  #info-alt a
    text-decoration: none
</style>
