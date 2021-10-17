<template>
  <div>
    <h1>Select restaurant</h1>

    <v-text-field
      v-model="filterRestaurantName"
      label="Filter restaurant by name"
    ></v-text-field>

    <v-list v-if="filteredRestaurants.length > 0">
      <v-list-item
        v-for="restaurant of restaurantsFromTheCurrentPage"
        :key="restaurant.id"
        :input-value="restaurant.id === restaurantId"
        @click="updateRestaurantId(restaurant.id)"
        color="primary"
      >
        <v-list-item-content>
          <v-list-item-title>{{ restaurant.name }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>

     <div v-if="filteredRestaurants.length === 0" class="d-flex justify-center">
       <div class="empty-state">
        No results, please adjust your search criteria.
       </div>
     </div>

    <v-pagination
      v-model="restaurantsPage"
      :length="Math.ceil(filteredRestaurants.length / pageSize)"
    ></v-pagination>

    <v-divider class="my-2"></v-divider>

    <v-btn color="primary" @click="next()">Continue</v-btn>
    <v-btn text @click="back()">Back</v-btn>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { RestaurantDto } from '@/frontend-client';

@Component({})
export default class SelectRestaurantStep extends Vue {
  @Prop() restaurantId: string;

  @Prop() restaurantsList: RestaurantDto[];

  restaurantsPage = 1;

  pageSize = 5;

  filterRestaurantName = ''

  updateRestaurantId(newValue: string) {
    this.$emit('updateRestaurantId', newValue);
  }

  next() {
    this.$emit('next');
  }

  back() {
    this.$emit('back');
  }

  get filteredRestaurants() {
    const restaurants = this.filterRestaurantName != null
      ? this.restaurantsList.filter((x) => x.name.toLowerCase().includes(this.filterRestaurantName.toLowerCase()))
      : this.restaurantsList;

    console.log(restaurants);

    return restaurants;
  }

  get restaurantsFromTheCurrentPage() {
    let rangeStart = (this.restaurantsPage - 1) * this.pageSize;
    let rangeEnd = this.restaurantsPage * this.pageSize;

    if (rangeStart >= this.filteredRestaurants.length) {
      this.restaurantsPage = 1;
      rangeStart = (this.restaurantsPage - 1) * this.pageSize;
      rangeEnd = this.restaurantsPage * this.pageSize;
    }

    return this.filteredRestaurants.slice(rangeStart, rangeEnd);
  }
}
</script>

<style lang="scss">
 .empty-state {
   width: max-content;
   min-height: 3rem;
 }
</style>
