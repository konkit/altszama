<template>
  <LoadingView>
    <v-toolbar>
      <back-button2 href="#/restaurants"></back-button2>

      <v-toolbar-title>
        Restaurant {{this.restaurant.name}}
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn @click="editRestaurant">
        Edit restaurant&nbsp;<span class="fa fa-pencil"/>
      </v-btn>

      <v-btn color="error" @click="deleteRestaurant">
        Delete restaurant&nbsp;<span class="fa fa-times"/>
      </v-btn>
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
                    <p><b>Last crawled:</b> {{this.restaurant.lastCrawled}} </p>
                    <p><b>Last edited:</b> {{this.restaurant.lastEdited}} </p>
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

                <v-btn fixed dark fab bottom left color="green" @click="goToCreateDish()">
                  <v-icon>add</v-icon>
                </v-btn>
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
  import BackButton2 from '../../components/commons/BackButton2'
  import Price from '../../components/commons/PriceElement'
  import ShowRestaurantDishesTable from '../../components/restaurants/ShowRestaurantDishesTable'
  import LoadingView from "../../components/commons/LoadingView";
  import {DELETE_RESTAURANT_ACTION, FETCH_RESTAURANT_ACTION} from "../../store/modules/ShowRestaurantState"
  import router from "../../router/index"

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
      },
      goToCreateDish() {
        router.push("/restaurants/" + this.restaurantId + "/dishes/create")
      },
      editRestaurant() {
        router.push("#/restaurants/" + this.restaurantId + "/edit")
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
      BackButton2,
      Price,
      ErrorsComponent,
      ShowRestaurantDishesTable
    }
  }
</script>

<style scoped>
</style>