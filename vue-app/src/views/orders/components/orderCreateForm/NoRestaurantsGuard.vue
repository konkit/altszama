<template>
  <div>
    <div v-if="this.restaurantsList.length === 0">
      <h1 class="my-4">There are no restaurants, please create one first</h1>
    </div>

    <div v-if="this.restaurantsList.length > 0">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { RestaurantDto } from '@/frontend-client';

@Component({
  name: 'NoRestaurantsGuard',
})
export default class NoRestaurantsGuard extends Vue {
  @Prop() restaurantsList: RestaurantDto[];
}
</script>

<style scoped>

</style>
