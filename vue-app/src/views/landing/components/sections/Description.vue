<template>
  <base-section id="theme-features">
    <base-section-heading title="ALT SZAMA">
      <p>Ordering food is easy - you just figure out where to order from and who wants what.</p>

      <p>The things get complicated when you order not for 3 collegaues but 13, some people ordered the same dish
        and you want to keep track of the payments.</p>

      <p>With Alt Szama, the flow looks like this:</p>
    </base-section-heading>

    <v-container>
      <v-row>
        <v-col
          v-for="(feature, i) in features"
          :key="i"
          cols="12"
          md="6"
        >
          <base-avatar-card
            v-bind="feature"
            align="left"
            horizontal
          >
            {{feature.description}}
          </base-avatar-card>
        </v-col>
      </v-row>
    </v-container>
  </base-section>
</template>

<script>
  export default {
    name: 'Description',

    data: () => ({
      features: [
        {
          title: '1. Create and share a new order sheet',
          icon: 'mdi-fountain-pen-tip',
          description: "Decide where are we ordering from and create a new order. Share it with your collegaues just like you would share a Google Sheet, where everybody write their choice."
        },
        {
          title: '2. Write your choice, wait for others',
          icon: 'mdi-cellphone',
          description: "Everybody write their choice."
        },
        {
          title: '3. Call the restaurant and make an order',
          icon: 'mdi-pencil-box-outline',
          description: "A special view simplifies the order, the same dishes are grouped, so the order making is as fast and easy",
        },
        {
          title: '4. Notify others when the order arrives',
          icon: 'mdi-image-size-select-actual',
          description: "Web push notifications are used to let your colleagues know, that the food has arrived.",
        },
        {
          title: '5. Payments',
          icon: 'mdi-ice-pop',
          description: "People make their payments. They don't ask you for your bank account etc., because it's all visible at the order page",
        },
        {
          title: '6. Repeat',
          icon: 'mdi-help-circle-outline',
          description: "Another day, different restaurant?",
        },
      ],
    }),
  }
</script>
