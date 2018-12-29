<template>
  <WithSpinner>
    <div class="container">
      <div class="row justify-content-center">
        <div class="col">
          <back-button href="#/restaurants"></back-button>
        </div>
      </div>

      <div class="row justify-content-center">
        <div class="col">
          <h1>Restaurant {{this.restaurant.name}}</h1>

          <a :href="'#/restaurants/' + this.restaurantId + '/edit'" class="btn btn-light">
            Edit restaurant&nbsp;<span class="fa fa-pencil"/>
          </a>

          <button @click="deleteRestaurant" class="btn btn-danger">
            Delete restaurant&nbsp;<span class="fa fa-times"/>
          </button>
        </div>
      </div>

      <errors-component ref="errorsComponent"/>

      <div class="row justify-content-center">
        <div class="col">
          <h4>Details</h4>

          <p><b>Rating: </b> {{this.restaurant.rating}} </p>
          <p><b>Address : </b> {{this.restaurant.address}} </p>
          <p><b>URL : </b> {{this.restaurant.url}} </p>
          <p><b>Telephone number:</b> {{this.restaurant.telephone}} </p>
        </div>
      </div>
    </div>

    <div class="container">
      <div class="row justify-content-center">
        <div class="col">
          <show-restaurant-dishes-table :restaurant="this.restaurant" :dishes-by-category="this.dishesByCategory"/>
        </div>
      </div>
    </div>
  </WithSpinner>
</template>

<script>
  import Spinner from '../../components/commons/Spinner'
  import ErrorsComponent from '../../components/commons/Errors'
  import BackButton from '../../components/commons/BackButton'
  import Price from '../../components/commons/PriceElement'
  import ShowRestaurantDishesTable from '../../components/restaurants/ShowRestaurantDishesTable'
  import WithSpinner from "../../components/commons/WithSpinner";
  import {DELETE_RESTAURANT_ACTION, FETCH_RESTAURANT_ACTION} from "../../store/modules/ShowRestaurantState"

  export default {
    name: 'show-restaurant',
    data() {
      return {
        restaurantId: this.$route.params.id,
      }
    },
    mounted() {
      this.$store.dispatch(`showRestaurant/${FETCH_RESTAURANT_ACTION}`, {restaurantId: this.restaurantId});
    },
    methods: {
      deleteRestaurant: function (e) {
        let errorsComponent = this.$refs.errorsComponent;
        this.$store.dispatch(`showRestaurant/${DELETE_RESTAURANT_ACTION}`, {restaurantId: this.restaurantId, errorsComponent: errorsComponent});
      }
    },
    computed: {
      restaurant () {
        return this.$store.state.showRestaurant.restaurant;
      },
      dishes () {
        return this.$store.state.showRestaurant.dishes;
      },
      dishesByCategory () {
        return this.$store.state.showRestaurant.dishesByCategory;
      },
    },
    components: {
      WithSpinner,
      Spinner,
      BackButton,
      Price,
      ErrorsComponent,
      ShowRestaurantDishesTable
    }
  }
</script>

<style scoped>
  .container {
    max-width: 900px;
  }

  .row {
    margin-top: 2rem;
  }
</style>