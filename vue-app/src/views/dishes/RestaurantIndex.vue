<template>
  <ViewWrapper>
    <LoadingView>
      <v-container>
        <v-row>
          <v-col cols="xs12">
            <v-data-table
                class="table table-hover"
                :items="restaurantsEntries"
                :headers="headers"
                :loading="false"
            >
              <template slot="header" slot-scope="props">
                <tr>
                  <th v-for="header in props.headers" :key="header.text">
                    {{ header.text }}
                  </th>
                </tr>
              </template>

              <template slot="item" slot-scope="props">
                <tr @click="goToRestaurant(props.item.id)" :key="props.item.id" class="pointer">
                  <td>{{ props.item.name }}</td>
                  <td>{{ props.item.dishCount }}</td>
                  <td>{{ dateToRel(props.item.lastCrawled) }}</td>
                  <td>{{ dateToRel(props.item.lastEdited) }}</td>
                </tr>
              </template>
            </v-data-table>

            <router-link to="/restaurants/create">
              <v-btn dark large bottom right color="green">
                Create new restaurant
                <v-icon class="ml-2">add</v-icon>
              </v-btn>
            </router-link>

            <a :href="getSwaggerUrl()">
              <v-btn large bottom right>
                Import API
                <v-icon class="ml-2">upload</v-icon>
              </v-btn>
            </a>
          </v-col>
        </v-row>
      </v-container>
    </LoadingView>
  </ViewWrapper>
</template>

<script lang="ts">
import LoadingView from "@/views/commons/LoadingView.vue";
import router from "../../router/index";
import moment from "moment";
import ViewWrapper from "@/views/commons/ViewWrapper.vue";
import Component from "vue-class-component";
import Vue from "vue";
import DishesApiConnector from "../../lib/DishesApiConnector";
import ApiConnector from "../../lib/ApiConnector";
import {RestaurantInfo} from "@/frontend-client";

interface RestaurantEntry {
  id: string;
  name: string;
  dishCount: number;
  lastCrawled?: Date;
  lastEdited?: Date;
}

@Component({
  components: {
    ViewWrapper,
    LoadingView
  }
})
export default class RestaurantIndex extends Vue {
  headers = [
    {text: "Restaurant name", align: "left"},
    {text: "Dish count"},
    {text: "Last auto-updated"},
    {text: "Last updated manually"}
  ];

  restaurants: RestaurantInfo[] = [];
  restaurantsEntries: RestaurantEntry[] = [];

  connector?: DishesApiConnector;

  mounted() {
    this.connector = new DishesApiConnector(this.$store.state);

    this.connector
        .getRestaurants()
        .then(payload => {
          this.restaurants = payload.restaurants;
          this.restaurantsEntries = this.restaurants.map(r =>
              this.mapToRestaurantEntry(r)
          );

          this.$store.commit("setTitle", "Restaurants")
          this.$store.commit("setLoadingFalse");
        })
        .catch(errResponse => ApiConnector.handleError(errResponse));
  }

  getSwaggerUrl() {
    return ApiConnector.getBackendUrl() + "/swagger-ui/index.html?configUrl=/v3/api-docs/swagger-config#/"
  }

  goToRestaurant(restaurantId: string) {
    router.push({name: "ShowRestaurant", params: {id: restaurantId}});
  }

  goToCreateRestaurant() {
    router.push({name: "CreateRestaurant"});
  }

  dateToRel(date: Date) {
    if (date) {
      return moment(date).fromNow();
    } else {
      return "";
    }
  }

  private mapToRestaurantEntry(restaurant: RestaurantInfo): RestaurantEntry {
    return {
      id: restaurant.id,
      name: restaurant.name,
      dishCount: restaurant.dishCount,
      lastCrawled: restaurant.lastCrawled,
      lastEdited: restaurant.lastEdited
    };
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
