<template>
  <div>
    <a :href="'#/restaurants/' + this.restaurant.id + '/dishes/create'" class="btn btn-success pull-right">Add new dish&nbsp;<span
        class="fa fa-plus"/></a>

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
          {{dish.name}}
          <price :data-price="dish.price"></price>

          <button @click="deleteDish(dish.id)" class="btn btn-danger pull-right">
            Delete&nbsp;<span class="fa fa-times"/>
          </button>

          <a :href="'#/restaurants/' + restaurant.id + '/dishes/' + dish.id + '/edit'" class="btn btn-light pull-right">
            Edit&nbsp;<span class="fa fa-pencil"/>
          </a>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
  import Price from '../commons/PriceElement'

  export default {
    name: "show-restaurant-dishes-table",
    props: ["restaurant", "dishesByCategory"],
    data() {
      return {
        sideDishesShown: false
      }
    },
    methods: {
      deleteDish: function (dishId) {
        this.$store.dispatch("showRestaurant/deleteDish", {restaurantId: this.restaurant.id, dishId: dishId})
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