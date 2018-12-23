<template>
  <div>
    <div v-if="this.loading === true">
      <spinner></spinner>
    </div>

    <div v-if="this.loading === false">
      <div class="container">
        
        <div class="row justify-content-center">
          <div class="col">
            <a href="#/restaurants/create" class="btn btn-success float-right">
              Create new restaurant&nbsp;<span class="fa fa-plus" />
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
                <tr v-on:click="goToRestaurant(restaurant.id)" v-for="restaurant in this.restaurants" v-bind:key="restaurant.id" class="pointer">
                  <td>{{restaurant.name}}</td>
                </tr>
              </tbody>
            </table>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'

import Spinner from '../components/commons/spinner'
import ApiConnector from '../lib/ApiConnector.js'

export default {
  data () {
    return { 
      results: {},
      restaurants: [],
      restaurantToDishesMap: {},
    }
  },
  created() {
    this.$store.commit('setLoadingTrue')
  },
  mounted() {
    ApiConnector.makeGet("/restaurants.json")
      .then(response => {
        this.results = response.data;
        this.restaurants = response.data.restaurants;
        this.restaurantToDishesMap = response.data.restaurantToDishesMap;

        this.$store.commit('setLoadingFalse')
      })
      .catch(errResponse => ApiConnector.handleError(errResponse))
  },
  methods: {
    goToRestaurant: function(restaurantId) {
      location = "#/restaurants/show/" + restaurantId
    }
  },
  computed: {
    loading () {
      return this.$store.state.loading;
    }
  },
  components: {
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
