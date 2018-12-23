<template>
  <div>
    <div v-if="this.loading === true">
      <spinner></spinner>
    </div>

    <div v-if="this.loading === false">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col">
            <back-button href="#/restaurants"></back-button>
          </div>
        </div>

        <div class="row justify-content-center">
          <div class="col">
            <h1>Restaurant {{this.restaurant.name}}</h1>
  
            <a v-bind:href="'#/restaurants/' + this.restaurantId + '/edit'" class="btn btn-light">
              Edit restaurant&nbsp;<span class="fa fa-pencil" />
            </a>

            <button @click="deleteRestaurant" class="btn btn-danger">
              Delete restaurant&nbsp;<span class="fa fa-times" />
            </button>
          </div>
        </div>

        <errors-component ref="errorsComponent" />

        <div class="row justify-content-center">
          <div class="col">
            <h4>Details</h4>

            <p><b>Rating from Pyszne.pl : </b> {{this.restaurant.rating}} </p>
            <p><b>Address : </b> {{this.restaurant.address}} </p>
            <p><b>URL : </b> {{this.restaurant.url}} </p>
            <p><b>Telephone number:</b> {{this.restaurant.telephone}} </p>
          </div>
        </div>
      </div>

      <div class="container">
        <div class="row justify-content-center">
          <div class="col">
            <show-restaurant-dishes-table :restaurant="this.restaurant" :dishes-by-category="this.dishesByCategory" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'

import Spinner from '../components/commons/spinner'
import ErrorsComponent from '../components/commons/errors'
import BackButton from '../components/commons/backButton'
import Price from '../components/commons/priceElement'
import router from '../router'

import ShowRestaurantDishesTable from './ShowRestaurantDishesTable'

import ApiConnector from '../lib/ApiConnector.js'

export default {
  name: 'show-restaurant',
  data () {
    return {
      restaurantId: this.$route.params.id,

      results: {},
      restaurants: [],
      dishes: [],
      dishesByCategory: {},
    }
  },
  created() {
    this.$store.commit('setLoadingTrue')
  },
  mounted() {
    ApiConnector.makeGet("/restaurants/" + this.restaurantId + "/show.json")
      .then(response => {
        this.restaurant = response.data.restaurant;
        this.dishes = response.data.dishes;
        this.dishesByCategory = convertToMapEntries(response.data.dishesByCategory);

        console.log("response: ", response.data)
        console.log("dishesByCategory: ", this.dishesByCategory)

        this.$store.commit('setLoadingFalse')
      })
      .catch(errResponse => ApiConnector.handleError(errResponse))
  },
  methods: {
    deleteRestaurant: function(e) {
      let errorsComponent = this.$refs.errorsComponent;

      ApiConnector.makeGet("/restaurants/" + this.restaurantId + "/delete")
        .then(response => router.push({'path': '/restaurants'}))
        .catch(function(error) {
          console.log("Delete restaurant error:");
          console.log(error);

          if( typeof error.message !== "undefined") {
            errorsComponent.addError(error.message);
          } else if (typeof error.body !== "undefined" && typeof error.body.message !== "undefined") {
            errorsComponent.addError(error.body.message);
          } else {
            errorsComponent.addError(error);
          }

          ApiConnector.handleError(error);
        });
    }
  },
  computed: {
    loading () {
      return this.$store.state.loading;
    }
  },
  components: {
    Spinner,
    BackButton,
    Price,
    ErrorsComponent,
    ShowRestaurantDishesTable
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
    max-width: 900px;
  }

  .row {
    margin-top: 2rem;
  }

  .table {
    margin-top: 10px;
  }
</style>