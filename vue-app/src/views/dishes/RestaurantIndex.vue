<template>
  <LoadingView>
    <v-toolbar>
      <v-toolbar-title>
        Restaurants
      </v-toolbar-title>
    </v-toolbar>

    <v-content>
      <v-container fluid>
        <v-layout align-center justify-center>
          <v-flex xs10>
            <v-card>
              <v-card-text>

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
                        <td>
                          <span>{{restaurant.name}}</span>
                          <v-chip outline="true" text-color="blue" v-if="restaurant.lastCrawled != null">
                            crawled
                          </v-chip>
                          <v-chip outline="true" text-color="green" v-if="restaurant.lastCrawled == null">
                            user-created
                          </v-chip>
                        </td>
                      </tr>
                      </tbody>
                    </table>

                    <v-btn fixed dark fab bottom right color="green" @click="goToCreateRestaurant()">
                      <v-icon>add</v-icon>
                    </v-btn>

                  </div>
                </div>

              </v-card-text>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
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
      },
      goToCreateRestaurant () {
        location = '#/restaurants/create'
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
</style>
