<template>
  <div>
    <v-list two-line>
      <template v-for="(categoryEntry, i) in this.dishesByCategory">
        <v-subheader :key="'category-' + i">
          <span v-if="categoryEntry.category">
            Category: {{categoryEntry.category}}
          </span>
          <span v-else>
            Uncategorized
          </span>
        </v-subheader>

        <template v-for="(dish, j) in categoryEntry.dishes">
          <v-list-item :key="'item-' + j">
            <v-list-item-content>
              <v-list-item-title>
                {{dish.name}} (
                <price :data-price="dish.price"></price>
                )
              </v-list-item-title>

              <v-list-item-subtitle>
              <span v-if="dish.lastCrawled != null">
                auto-updated {{ dateToRel(dish.lastCrawled) }}
              </span>

                <span v-if="dish.lastCrawled == null">
                updated manually
              </span>
              </v-list-item-subtitle>
            </v-list-item-content>

            <v-list-item-action>
            <span class="edit-buttons">
              <v-btn text icon :href="'#/restaurants/' + restaurant.id + '/dishes/' + dish.id + '/edit'">
                <i class="fa fa-pencil" aria-hidden="true"></i>
              </v-btn>

              <v-btn text icon @click="deleteDish(dish.id)">
                <i class="fa fa-times" aria-hidden="true"></i>
              </v-btn>
            </span>
            </v-list-item-action>
          </v-list-item>
        </template>
      </template>
    </v-list>
  </div>
</template>

<script lang="ts">
  import Price from '../../commons/PriceElement'
  import {DELETE_DISH_ACTION} from "../../../store/modules/ShowRestaurantState";
  import moment from "moment"
  import Vue from 'vue'
  import {Prop} from "vue-property-decorator";
  import Component from "vue-class-component";

  @Component({
    components: {
      Price,
    },
  })
  export default class ShowRestaurantDishesTable extends Vue {
    @Prop() restaurant;
    @Prop() dishesByCategory;

    sideDishesShown: false;

    deleteDish(dishId) {
      this.$store.dispatch(`showRestaurant/${DELETE_DISH_ACTION}`, {restaurantId: this.restaurant.id, dishId: dishId})
    }

    dateToRel(date) {
      if (date) {
        return moment(date).fromNow()
      } else {
        return ""
      }
    }

  }
</script>

<style scoped>
  .table td {
    vertical-align: middle;
  }

  .edit-buttons {
    margin-left: auto;
  }
</style>