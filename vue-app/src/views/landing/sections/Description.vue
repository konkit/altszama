<template>
  <section id="theme-features" :style="sectionStyles">
    <div class="base-section-heading text-center mb-12">

      <h5 class="text-h5 font-weight-bold mb-2 text-center">ALT SZAMA</h5>

      <div class="mx-auto base-body text-body-1 mb-10">
        <p>Ordering food is easy - you just figure out where to order from and who wants what.</p>

        <p>The things get complicated when you order not for 3 collegaues but 13, some people ordered the same dish
          and you want to keep track of the payments.</p>

        <p>With Alt Szama, the flow looks like this:</p>
      </div>
    </div>

    <v-container>
      <v-row>
        <v-col
            v-for="(feature, i) in features"
            :key="i"
            cols="12"
            md="6"
        >
          <AvatarCard :icon="feature.icon" :title="feature.title" :description="feature.description"></AvatarCard>
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>

<script>
import AvatarCard from "@/views/landing/components/AvatarCard";

export default {
  name: 'Description',
  components: {AvatarCard},
  data: () => ({
    features: [
      {
        title: '1. Create and share a new order sheet',
        icon: 'mdi-folder-plus',
        description: "Decide where are we ordering from and create a new order. Share it with your collegaues just like you would share a Google Sheet, where everybody write their choice."
      },
      {
        title: '2. Select your food, wait for others',
        icon: 'mdi-silverware',
        description: "Everybody write their choice."
      },
      {
        title: '3. Call the restaurant and make an order',
        icon: 'mdi-phone',
        description: "A special view simplifies the order, the same dishes are grouped, so the order making is as fast and easy.",
      },
      {
        title: '4. Notify others when the order arrives',
        icon: 'mdi-bell',
        description: "Web push notifications are used to let your colleagues know, that the food has arrived.",
      },
      {
        title: '5. Payments',
        icon: 'mdi-cash',
        description: "Your colleagues don't ask you multiple times for your bank account because all payment details are there.",
      },
      {
        title: '6. Repeat',
        icon: 'mdi-history',
        description: "Another day, different restaurant?",
      },
    ],
  }),

  computed: {
    sectionStyles() {
      const space = this.$vuetify.breakpoint.mdAndUp
          ? 96
          : 96 / 2

      return {
        padding: `${space}px 0`,
      }
    },
  },
}
</script>

<style lang="scss">
//@import "./variable.scss";

.base-body {
  max-width: 700px;
}

#theme-features {
  padding: 96px 0;
}

</style>