<template>
  <WithSpinner>
    <div class="container">

      <div class="row justify-content-center">
        <div class="col">
          <a href="#/restaurants/create" class="btn btn-success float-right">
            Create new restaurant&nbsp;<span class="fa fa-plus"/>
          </a>

          <h1>Restaurants</h1>
        </div>
      </div>

      <div class="row justify-content-center">
        <div class="col">
          <a href="#/restaurants/import/upload">Import restaurant from JSON</a>
        </div>
      </div>

      <div class="row justify-content-center">
        <div class="col">
          <table class="table table-hover">
            <tbody>
            <tr v-on:click="goToRestaurant(restaurant.id)" v-for="restaurant in this.restaurants"
                v-bind:key="restaurant.id" class="pointer">
              <td>{{restaurant.name}}</td>
            </tr>
            </tbody>
          </table>

        </div>
      </div>
    </div>
  </WithSpinner>
</template>

<script>
  import Spinner from '../components/commons/spinner'
  import ApiConnector from '../lib/ApiConnector.js'
  import WithSpinner from "../components/commons/WithSpinner";
  import DishesApiConnector from "../lib/DishesApiConnector";

  export default {
    data() {
      return {
        restaurants: [],
        restaurantToDishesMap: {},
      }
    },
    created() {
      this.$store.commit('setLoadingTrue')
    },
    mounted() {
      DishesApiConnector.getRestaurants()
        .then(response => {
          this.restaurants = response.restaurants;
          this.restaurantToDishesMap = response.restaurantToDishesMap;

          this.$store.commit('setLoadingFalse')
        })
        .catch(errResponse => ApiConnector.handleError(errResponse))
    },
    methods: {
      goToRestaurant: function (restaurantId) {
        location = "#/restaurants/show/" + restaurantId
      }
    },
    computed: {
      loading() {
        return this.$store.state.loading;
      }
    },
    components: {
      WithSpinner,
      Spinner
    }
  }
</script>

<style scoped>
  .pointer {
    cursor: pointer;
  }

  .row {
    margin-top: 2rem;
  }

  .container {
    max-width: 900px;
  }
</style>
