<template>
  <div>
    <h4>Dishes</h4>

    <table class="table" v-for="(categoryEntry, i) in this.dishesByCategory" :key="i">
      <thead class="thead">
      <tr>
        <th v-if="categoryEntry.category">
          Category: {{categoryEntry.category}}
        </th>
        <th v-else>
          Uncategorized
        </th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(dish, j) in categoryEntry.dishes" :key="j">
        <td>
          {{dish.name}} (<price :data-price="dish.price"></price>)

          <v-chip text-color="blue" v-if="dish.lastCrawled != null">
            crawled-automatically
          </v-chip>
          <v-chip text-color="green" v-if="dish.lastCrawled == null">
            created-by-user
          </v-chip>

          <v-btn color="error" @click="deleteDish(dish.id)" class="pull-right">
            Delete&nbsp;<span class="fa fa-times"/>
          </v-btn>

          <v-btn :href="'#/restaurants/' + restaurant.id + '/dishes/' + dish.id + '/edit'" class="pull-right">
            Edit&nbsp;<span class="fa fa-pencil"/>
          </v-btn>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
  import Price from '../commons/PriceElement'
  import {DELETE_DISH_ACTION} from "../../store/modules/ShowRestaurantState";

  export default {
    name: "show-restaurant-dishes-table",
    props: ["restaurant", "dishesByCategory"],
    data() {
      return {
        sideDishesShown: false
      }
    },
    methods: {
      deleteDish (dishId) {
        this.$store.dispatch(`showRestaurant/${DELETE_DISH_ACTION}`, {restaurantId: this.restaurant.id, dishId: dishId})
      },
    },
    components: {
      Price,
    }
  }
</script>

<style scoped>
  .table td {
    vertical-align: middle;
  }
</style>