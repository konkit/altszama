<template>
  <div>
    <v-list two-line>
      <template v-for="[category, dishes] in Object.entries(this.dishesByCategory)">
        <v-subheader :key="category">
          <span v-if="category"> Category: {{ category }} </span>
          <span v-else>
            No category
          </span>
        </v-subheader>

        <template v-for="dish in dishes">
          <v-list-item :key="dish.id">
            <v-list-item-content>
              <v-list-item-title>
                {{ dish.name }} (
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
                <router-link :to="{name: 'DishEditForm', params: {id: restaurant.id, dishId: dish.id}}">
                  <v-btn text icon class="edit-button">
                    <i class="fa fa-pencil" aria-hidden="true"></i>
                  </v-btn>
                </router-link>

                <v-btn text icon @click="deleteDish(dish.id)" class="delete-button">
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
import Price from "../../commons/PriceElement.vue";
import Vue from "vue";
import {Prop} from "vue-property-decorator";
import Component from "vue-class-component";
import {DishDto, Restaurant} from "../../../frontend-client";
import moment from "moment";
import DishesApiConnector from "@/lib/api/DishesApiConnector";


@Component({
  components: {
    Price
  }
})
export default class ShowRestaurantDishesTable extends Vue {
  @Prop() restaurant!: Restaurant;
  @Prop() dishesByCategory!: { [key: string]: Array<DishDto> };

  connector = new DishesApiConnector()

  deleteDish(dishId: string) {
    this.$emit("delete-dish", dishId)
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

<style scoped>
.table td {
  vertical-align: middle;
}

.edit-buttons {
  margin-left: auto;
}
</style>
