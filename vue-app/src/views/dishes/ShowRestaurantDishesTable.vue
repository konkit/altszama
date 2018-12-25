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
  import Price from '../../components/commons/PriceElement'
  import DishesApiConnector from "../../lib/DishesApiConnector";

  export default {
    name: "show-restaurant-dishes-table",
    props: ["restaurant", "dishesByCategory"],
    data() {
      return {
        sideDishesShown: false
      }
    },
    methods: {
      toggleSideDishes: function () {
        this.sideDishesShown = !this.sideDishesShown;
      },
      deleteDish: function (dishId) {
        DishesApiConnector.deleteDish(this.restaurant.id, dishId)
          .then(successResponse => window.location.reload())
          .catch(errResponse => console.log(errResponse));
      },
    },
    components: {
      Price,
    }
  }

  function convertToMapEntries(dishesMap) {
    var result = []

    for (const key of Object.keys(dishesMap)) {
      result.push({"category": key, "dishes": dishesMap[key]})
    }

    return result;
  }
</script>

<style scoped>
  .container {
    max-width: 1200px;
  }

  .row {
    margin-top: 2rem;
  }

  .table td {
    vertical-align: middle;
  }
</style>