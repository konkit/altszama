<template>
  <LoadingView>
    <v-toolbar>
      <back-button2 :href="'#/restaurants/show/' + restaurantId"></back-button2>

      <v-toolbar-title>
        Edit dish
      </v-toolbar-title>
    </v-toolbar>

    <v-content>
      <v-container fluid>
        <v-layout align-center justify-center>
          <v-flex xs10>
            <v-card>
              <v-card-text>
                <errors-component />

                <input type="hidden" name="restaurant.id" :value="restaurantId"/>
                <input type="hidden" name="id" :value="dishId"/>

                <div class="form-group">
                  <label for="name">Name</label>
                  <input type="text" class="form-control" :value="name" @input="updateName($event)" required="" id="name"/>
                </div>

                <div class="form-group">
                  <label for="price">Price</label>
                  <vue-numeric currency="zł" separator="." currency-symbol-position="suffix" :value="price" @input="updatePrice($event)"
                               :precision="2" class="form-control" required="" id="price"></vue-numeric>
                </div>

                <div class="form-group">
                  <label for="category">Category</label>
                  <input type="text" class="form-control" :value="category" @input="updateCategory($event)" id="category" list="categoryNames"/>
                  <datalist id="categoryNames">
                    <option v-for="categoryName in categories" :value="categoryName"/>
                  </datalist>
                </div>

                <div>
                  <side-dishes ref="sideDishesElement" :initialSideDishes="initialSideDishes"></side-dishes>
                </div>

              </v-card-text>

              <v-card-actions>
                <button @click="submitForm" class="btn btn-block btn-success">Update</button>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </LoadingView>
</template>

<script>
  import BackButton2 from '../../components/commons/BackButton2'
  import ErrorsComponent from '../../components/commons/Errors'
  import Price from '../../components/commons/PriceElement'
  import SideDishes from '../../components/restaurants/SideDishes.vue'
  import LoadingView from "../../components/commons/LoadingView";
  import {mapState} from "vuex"
  import {
    INIT_EDIT_DISH_ACTION,
    UPDATE_CATEGORY,
    UPDATE_DISH_ACTION,
    UPDATE_NAME,
    UPDATE_PRICE
  } from "../../store/modules/EditDishState"

  export default {
    data() {
      return {
        restaurantId: this.$route.params.id,
        dishId: this.$route.params.dishId,
      }
    },
    mounted() {
      this.$store.dispatch(`editDish/${INIT_EDIT_DISH_ACTION}`, {restaurantId: this.restaurantId, dishId: this.dishId})
    },
    methods: {
      submitForm () {
        let sideDishes = this.$refs.sideDishesElement.getSideDishes();

        this.$store.dispatch(`editDish/${UPDATE_DISH_ACTION}`, {sideDishes: sideDishes});

        return false;
      },
      addSideDish () {
        const newSideDish = {
          name: this.newSideDishName,
          price: Math.round(this.newSideDishPrice * 100)
        };

        this.sideDishes.push(newSideDish)
      },
      removeSideDish (sideDishId) {
        this.sideDishes = this.sideDishes.filter(sd => sd.id !== sideDishId)
      },
      updateName(newValue) {
        this.$store.commit(`editDish/${UPDATE_NAME}`, newValue)
      },
      updatePrice(newValue) {
        this.$store.commit(`editDish/${UPDATE_PRICE}`, newValue)
      },
      updateCategory(newValue) {
        this.$store.commit(`editDish/${UPDATE_CATEGORY}`, newValue)
      }
    },
    computed: {
      ...mapState("editDish", [
        'categories',
        'initialSideDishes',
        'name',
        'price',
        'category'
      ])
    },
    components: {
      LoadingView,
      BackButton2,
      ErrorsComponent,
      Price,
      SideDishes
    }
  }
</script>

<style scoped>
  .row {
    margin-top: 2rem;
  }
</style>