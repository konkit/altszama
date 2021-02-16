<template>
  <ViewWrapper :title="`Restaurant ${restaurant.name}`">
    <template slot="toolbar-buttons">
      <v-btn @click="editRestaurant">
        Edit restaurant&nbsp;<span class="fa fa-pencil"/>
      </v-btn>

      <v-btn color="error" @click="deleteRestaurant()">
        Delete restaurant&nbsp;<span class="fa fa-times"/>
      </v-btn>
    </template>

    <LoadingView>
      <errors-component/>

      <v-container>
        <v-row>
          <v-col cols="xs12">
            <v-layout column>
              <p><b>Address : </b> {{ this.restaurant.address }}</p>
              <p>
                <b>URL : </b>
                <a target="_blank" :href="this.restaurant.url">{{ this.restaurant.url }}</a>
              </p>
              <p>
                <b>Telephone number:</b> {{ this.restaurant.telephone }}
              </p>
              <p>
                <b>Last auto-updated:</b>
                {{ dateToRel(this.restaurant.lastCrawled) }}
              </p>
              <p>
                <b>Last updated manually:</b>
                {{ dateToRel(this.restaurant.lastEdited) }}
              </p>
            </v-layout>
          </v-col>
        </v-row>

        <v-divider></v-divider>

        <v-row>
          <v-col cols="xs12">
            <v-layout column>
              <show-restaurant-dishes-table
                  :restaurant="this.restaurant"
                  :dishes-by-category="this.dishesByCategory"
              />
            </v-layout>

            <v-tooltip left>
              <template v-slot:activator="{ on }">
                <v-btn
                    fixed
                    dark
                    fab
                    large
                    bottom
                    right
                    color="green"
                    @click="goToCreateDish()"
                    v-on="on"
                >
                  <v-icon>add</v-icon>
                </v-btn>
              </template>
              <span>Create new dish</span>
            </v-tooltip>
          </v-col>
        </v-row>
      </v-container>
    </LoadingView>
  </ViewWrapper>
</template>

<script lang="ts">
import ErrorsComponent from "@/views/commons/ErrorsComponent.vue";
import ShowRestaurantDishesTable from "./components/ShowRestaurantDishesTable.vue";
import LoadingView from "@/views/commons/LoadingView.vue";
import {
  DELETE_RESTAURANT_ACTION,
  FETCH_RESTAURANT_ACTION,
  ShowRestaurantState
} from "@/store/modules/ShowRestaurantModule";
import router from "../../router/index";
import ViewWrapper from "@/views/commons/ViewWrapper.vue";
import Component from "vue-class-component";
import Vue from "vue";
import moment from "moment";

@Component({
  components: {
    ViewWrapper,
    LoadingView,
    ErrorsComponent,
    ShowRestaurantDishesTable
  }
})
export default class ShowRestaurant extends Vue {
  restaurantId = "";

  mounted() {
    this.restaurantId = this.$route.params.id;

    this.$store.dispatch(`showRestaurant/${FETCH_RESTAURANT_ACTION}`, {
      restaurantId: this.restaurantId
    });
  }

  get restaurant() {
    const showRestaurant: ShowRestaurantState = this.$store.state
        .showRestaurant;

    console.log("showRestaurant: ", showRestaurant);

    return showRestaurant.restaurant;
  }

  get dishes() {
    return this.$store.state.showRestaurant.dishes;
  }

  get dishesByCategory() {
    return this.$store.state.showRestaurant.dishesByCategory;
  }

  goToCreateDish() {
    router.push({name: "DishCreateForm", params: {id: this.restaurantId}})
  }

  editRestaurant() {
    router.push({name: "RestaurantEditForm", params: {id: this.restaurantId}})
  }

  deleteRestaurant() {
    const errorsComponent = this.$refs.errorsComponent;
    this.$store.dispatch(`showRestaurant/${DELETE_RESTAURANT_ACTION}`, {
      restaurantId: this.restaurantId,
      errorsComponent: errorsComponent
    });
  }

  dateToRel(date: Date) {
    if (date) {
      return moment(date).fromNow();
    } else {
      return "";
    }
  }
}
</script>

<style scoped></style>
