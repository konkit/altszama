<template>
  <LoadingView>
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
            <tr @click="goToRestaurant(restaurant.id)" v-for="restaurant in this.restaurants"
                :key="restaurant.id" class="pointer">
              <td>{{restaurant.name}}</td>
            </tr>
            </tbody>
          </table>

        </div>
      </div>
    </div>
  </LoadingView>
</template>

<script>
  import LoadingView from "../../components/commons/LoadingView";
  import {FETCH_ALL_RESTAURANTS} from "../../store/modules/RestaurantIndexState"

  export default {
    mounted() {
      this.$store.dispatch(`restaurantIndex/${FETCH_ALL_RESTAURANTS}`)
    },
    methods: {
      goToRestaurant (restaurantId) {
        location = "#/restaurants/show/" + restaurantId
      }
    },
    computed: {
      restaurants() {
        return this.$store.state.restaurantIndex.restaurants;
      },
      restaurantToDishesMap() {
        return this.$store.state.restaurantIndex.restaurantToDishesMap;
      },
    },
    components: {
      LoadingView,
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
