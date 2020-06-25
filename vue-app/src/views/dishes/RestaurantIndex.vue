<template>
  <ViewWrapper title="Restaurants">
    <LoadingView>
      <v-container>
        <v-row>
          <v-col cols="xs12">
            <v-card>
              <v-card-text>

                <v-data-table
                    class="table table-hover"
                    :items="restaurantsEntries"
                    :headers="headers"
                    :loading="false"
                    :pagination.sync="pagination">
                  <template slot="header" slot-scope="props">
                    <tr>
                      <th v-for="header in props.headers" :key="header.text">
                        {{ header.text }}
                      </th>
                    </tr>
                  </template>

                  <template slot="item" slot-scope="props">
                    <tr @click="goToRestaurant(props.item.id)" :key="props.item.id"
                        :data-href="'/orders/show/' + props.item.id"
                        class="pointer">
                      <td>{{ props.item.name }}</td>
                      <td>{{ props.item.dishCount }}</td>
                      <td>{{ dateToRel(props.item.lastCrawled) }}</td>
                      <td>{{ dateToRel(props.item.lastEdited) }}</td>
                    </tr>
                  </template>
                </v-data-table>

                <v-tooltip left>
                  <template v-slot:activator="{ on }">
                    <v-btn fixed dark fab large bottom right color="green" @click="goToCreateRestaurant()" v-on="on">
                      <v-icon>add</v-icon>
                    </v-btn>
                  </template>
                  <span>Create new restaurant</span>
                </v-tooltip>

              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>

    </LoadingView>
  </ViewWrapper>
</template>

<script lang="ts">
  import LoadingView from "../commons/LoadingView";
  import router from '../../router/index'
  import moment from "moment"
  import ViewWrapper from "../commons/ViewWrapper";
  import Component from "vue-class-component";
  import Vue from "vue";
  import DishesApiConnector from "../../lib/DishesApiConnector";
  import ApiConnector from "../../lib/ApiConnector";

  @Component({
    components: {
      ViewWrapper,
      LoadingView,
    }
  })
  export default class RestaurantIndex extends Vue {
    headers = [
      {text: "Restaurant name", align: 'left'},
      {text: "Dish count"},
      {text: "Last auto-updated"},
      {text: "Last updated manually"}
    ];

    pagination = {
      rowsPerPage: 20
    }

    restaurants = [];
    restaurantsEntries = [];

    mounted() {
      const connector = new DishesApiConnector();

      connector.getRestaurants()
        .then(payload => {
          this.restaurants = payload.restaurants;
          this.restaurantsEntries = this.restaurants.map(r => this.mapToRestaurantEntry(r));

          this.$store.commit('setLoadingFalse');

          document.title = `Restaurants | Alt Szama`
        })
        .catch(errResponse => ApiConnector.handleError(errResponse))
    }

    goToRestaurant(restaurantId) {
      router.push("/restaurants/show/" + restaurantId)
    }

    goToCreateRestaurant() {
      router.push("/restaurants/create")
    }

    dateToRel(date) {
      if (date) {
        return moment(date).fromNow()
      } else {
        return ""
      }
    }

    private mapToRestaurantEntry(restaurant) {
        return {
          "id": restaurant.id,
          "name": restaurant.name,
          "dishCount": restaurant.dishCount,
          "lastCrawled": restaurant.lastCrawled,
          "lastEdited": restaurant.lastEdited
        }
    }
  }
</script>

<style scoped>
  .pointer {
    cursor: pointer;
  }

  th {
    text-align: left;
  }
</style>
