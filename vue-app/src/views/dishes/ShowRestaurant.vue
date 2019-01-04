<template>
  <LoadingView>
    <v-toolbar>
      <back-button2 href="#/restaurants"></back-button2>

      <v-toolbar-title>
        Restaurant {{this.restaurant.name}}
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <a :href="'#/restaurants/' + this.restaurantId + '/edit'" class="btn btn-light">
        Edit restaurant&nbsp;<span class="fa fa-pencil"/>
      </a>

      <button @click="deleteRestaurant" class="btn btn-danger">
        Delete restaurant&nbsp;<span class="fa fa-times"/>
      </button>
    </v-toolbar>

    <v-content>
      <errors-component />

      <v-container fluid>
        <v-layout align-center justify-center>
          <v-flex xs10>
            <v-card>
              <v-card-text>
                <v-layout column>
                    <p><b>Rating: </b> {{this.restaurant.rating}} </p>
                    <p><b>Address : </b> {{this.restaurant.address}} </p>
                    <p><b>URL : </b> {{this.restaurant.url}} </p>
                    <p><b>Telephone number:</b> {{this.restaurant.telephone}} </p>
                    <p><b>Last updated:</b> {{this.restaurant.telephone}} </p>
                </v-layout>
              </v-card-text>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>

      <v-container fluid>
        <v-layout align-center justify-center>
          <v-flex xs10>
            <v-card>
              <v-card-text>
                <v-layout column>
                  <show-restaurant-dishes-table :restaurant="this.restaurant" :dishes-by-category="this.dishesByCategory"/>
                </v-layout>
              </v-card-text>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </LoadingView>
</template>

<script>
  import ErrorsComponent from '../../components/commons/Errors'
  import BackButton from '../../components/commons/BackButton'
  import BackButton2 from '../../components/commons/BackButton2'
  import Price from '../../components/commons/PriceElement'
  import ShowRestaurantDishesTable from '../../components/restaurants/ShowRestaurantDishesTable'
  import LoadingView from "../../components/commons/LoadingView";
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
      deleteRestaurant (e) {
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
      LoadingView,
      BackButton,
      BackButton2,
      Price,
      ErrorsComponent,
      ShowRestaurantDishesTable
    }
  }
</script>

<style scoped>
</style>