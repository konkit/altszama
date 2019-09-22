<template>
  <ViewWrapper :title="`Restaurant ${restaurant.name}`" backpath="#/restaurants">
    <template slot="toolbar-buttons">

      <v-btn @click="editRestaurant">
        Edit restaurant&nbsp;<span class="fa fa-pencil"/>
      </v-btn>

      <v-btn color="error" @click="deleteRestaurant">
        Delete restaurant&nbsp;<span class="fa fa-times"/>
      </v-btn>
    </template>

    <LoadingView>
      <errors-component/>

      <v-container>
        <v-row>
          <v-col cols="xs12">
            <v-card>
              <v-card-text>
                <v-layout column>
                  <p><b>Rating: </b> {{this.restaurant.rating}} </p>
                  <p><b>Address : </b> {{this.restaurant.address}} </p>
                  <p><b>URL : </b> <a :href="this.restaurant.url">{{this.restaurant.url}}</a></p>
                  <p><b>Telephone number:</b> {{this.restaurant.telephone}} </p>
                  <p><b>Last auto-updated:</b> {{ dateToRel(this.restaurant.lastCrawled) }} </p>
                  <p><b>Last updated manually:</b> {{ dateToRel(this.restaurant.lastEdited) }} </p>
                </v-layout>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="xs12">
            <v-card>
              <v-card-text>
                <v-layout column>
                  <show-restaurant-dishes-table :restaurant="this.restaurant" :dishes-by-category="this.dishesByCategory"/>
                </v-layout>

                <v-tooltip left>
                  <template slot="activator">
                    <v-btn fixed dark fab large bottom right color="green" @click="goToCreateDish()">
                      <v-icon>add</v-icon>
                    </v-btn>
                  </template>
                  <span>Create new dish</span>
                </v-tooltip>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </LoadingView>
  </ViewWrapper>
</template>

<script>
  import ErrorsComponent from '../commons/Errors'
  import BackButton2 from '../commons/BackButton2'
  import Price from '../commons/PriceElement'
  import ShowRestaurantDishesTable from './components/ShowRestaurantDishesTable'
  import LoadingView from "../commons/LoadingView";
  import {DELETE_RESTAURANT_ACTION, FETCH_RESTAURANT_ACTION} from "../../store/modules/ShowRestaurantState"
  import router from "../../router/index"
  import moment from "moment"
  import ViewWrapper from "../commons/ViewWrapper";

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
      deleteRestaurant(e) {
        let errorsComponent = this.$refs.errorsComponent;
        this.$store.dispatch(`showRestaurant/${DELETE_RESTAURANT_ACTION}`, {
          restaurantId: this.restaurantId,
          errorsComponent: errorsComponent
        });
      },
      goToCreateDish() {
        router.push("/restaurants/" + this.restaurantId + "/dishes/create")
      },
      editRestaurant() {
        router.push("/restaurants/" + this.restaurantId + "/edit")
      },
      dateToRel(date) {
        if (date) {
          return moment(date).fromNow()
        } else {
          return ""
        }
      }
    },
    computed: {
      restaurant() {
        return this.$store.state.showRestaurant.restaurant;
      },
      dishes() {
        return this.$store.state.showRestaurant.dishes;
      },
      dishesByCategory() {
        return this.$store.state.showRestaurant.dishesByCategory;
      },
    },
    components: {
      ViewWrapper,
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