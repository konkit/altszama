<template>
  <div>
    <v-list two-line>
      <template v-for="(categoryEntry, i) in this.dishesByCategory">
        <v-subheader>
          <span v-if="categoryEntry.category">
            Category: {{categoryEntry.category}}
          </span>
          <span v-else>
            Uncategorized
          </span>
        </v-subheader>

        <v-list-tile v-for="(dish, j) in categoryEntry.dishes">
          <v-list-tile-content>
            <v-list-tile-title>
              {{dish.name}} (<price :data-price="dish.price"></price>)
            </v-list-tile-title>

            <v-list-tile-sub-title>
              <span v-if="dish.lastCrawled != null">
                auto-updated {{ dateToRel(dish.lastCrawled) }}
              </span>

              <span v-if="dish.lastCrawled == null">
                updated manually
              </span>
            </v-list-tile-sub-title>
          </v-list-tile-content>

          <v-list-tile-action>
            <span class="edit-buttons">
              <v-btn flat icon :href="'#/restaurants/' + restaurant.id + '/dishes/' + dish.id + '/edit'">
                <i class="fa fa-pencil" aria-hidden="true"></i>
              </v-btn>

              <v-btn flat icon @click="deleteDish(dish.id)">
                <i class="fa fa-times" aria-hidden="true"></i>
              </v-btn>
            </span>
          </v-list-tile-action>
        </v-list-tile>
      </template>
    </v-list>
  </div>
</template>

<script>
  import Price from '../../commons/PriceElement'
  import {DELETE_DISH_ACTION} from "../../../store/modules/ShowRestaurantState";
  import moment from "moment"

  export default {
    name: "show-restaurant-dishes-table",
    props: ["restaurant", "dishesByCategory"],
    data() {
      return {
        sideDishesShown: false
      }
    },
    methods: {
      deleteDish (dishId) {
        this.$store.dispatch(`showRestaurant/${DELETE_DISH_ACTION}`, {restaurantId: this.restaurant.id, dishId: dishId})
      },
      dateToRel(date) {
        if (date) {
          return moment(date).fromNow()
        } else {
          return ""
        }
      }
    },
    components: {
      Price,
    },
    computed: {
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