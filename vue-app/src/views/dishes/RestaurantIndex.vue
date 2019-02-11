<template>
  <LoadingView>
    <v-toolbar>
      <v-toolbar-title>
        Restaurants
      </v-toolbar-title>
    </v-toolbar>

    <simple-card>

      <v-data-table
          class="table table-hover"
          :items="restaurantsEntries"
          :headers="headers"
          :loading="false"
          :pagination.sync="pagination">
        <template slot="headers" slot-scope="props">
          <tr>
            <th v-for="header in props.headers" :key="header.text">
              {{ header.text }}
            </th>
          </tr>
        </template>

        <template slot="items" slot-scope="props">
          <tr @click="goToRestaurant(props.item.id)" :key="props.item.id" :data-href="'/orders/show/' + props.item.id"
              class="pointer">
            <td>{{props.item.name}}</td>
            <td>{{props.item.dishCount}}</td>
            <td>{{props.item.lastCrawled}}</td>
            <td>{{props.item.lastEdited}}</td>
          </tr>
        </template>
      </v-data-table>

      <v-btn fixed dark fab bottom left color="green" @click="goToCreateRestaurant()">
        <v-icon>add</v-icon>
      </v-btn>

    </simple-card>
  </LoadingView>
</template>

<script>
    import LoadingView from "../../components/commons/LoadingView";
    import {FETCH_ALL_RESTAURANTS} from "../../store/modules/RestaurantIndexState"
    import router from '../../router/index'
    import SimpleCard from "../../components/commons/SimpleCard";

    export default {
        data() {
            return {
                headers: [
                    { text: "Restaurant name", align: 'left' },
                    { text: "Dish count" },
                    { text: "Last crawled" },
                    { text: "Last manual modification" },
                ],
                pagination: {
                    rowsPerPage: 20
                },
            }
        },
        mounted() {
            this.$store.dispatch(`restaurantIndex/${FETCH_ALL_RESTAURANTS}`)
        },
        methods: {
            goToRestaurant(restaurantId) {
                router.push("/restaurants/show/" + restaurantId)
            },
            goToCreateRestaurant() {
                router.push("/restaurants/create")
            }
        },
        computed: {
            restaurants() {
                return this.$store.state.restaurantIndex.restaurants;
            },
            restaurantToDishesMap() {
                return this.$store.state.restaurantIndex.restaurantToDishesMap;
            },
            restaurantsEntries() {
                return this.$store.state.restaurantIndex.restaurants.map(e => {
                    return {"id": e.id, "name": e.name, "dishCount": e.dishCount, "lastCrawled": e.lastCrawled, "lastEdited": e.lastEdited}
                })
            }
        },
        components: {
            SimpleCard,
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
