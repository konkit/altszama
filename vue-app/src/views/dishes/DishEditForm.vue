<template>
  <LoadingView>
    <div class="container">
      <div class="row justify-content-center">
        <div class="col">
          <back-button :href="'#/restaurants/show/' + restaurantId"></back-button>
        </div>
      </div>

      <div class="row justify-content-center">
        <div class="col">
          <h1>Edit dish</h1>
        </div>
      </div>

      <errors-component />

      <div class="row justify-content-center">
        <div class="col">
          <input type="hidden" name="restaurant.id" :value="restaurantId"/>
          <input type="hidden" name="id" :value="dishId"/>

          <div class="form-group">
            <label for="name">Name</label>
            <input type="text" class="form-control" :value="name" @input="updateName($event.target.value)" required="" id="name"/>
          </div>

          <div class="form-group">
            <label for="price">Price</label>
            <vue-numeric currency="zł" separator="." currency-symbol-position="suffix" :value="price" @input="updatePrice($event)"
                         :precision="2" class="form-control" required="" id="price"></vue-numeric>
          </div>

          <div class="form-group">
            <label for="category">Category</label>
            <input type="text" class="form-control" :value="category" @input="updateCategory($event.target.value)" id="category" list="categoryNames"/>
            <datalist id="categoryNames">
              <option v-for="categoryName in categories" :value="categoryName"/>
            </datalist>
          </div>

          <div>
            <side-dishes ref="sideDishesElement" :initialSideDishes="initialSideDishes"></side-dishes>
          </div>
        </div>
      </div>

      <div class="row justify-content-center">
        <div class="col">
          <button @click="submitForm" class="btn btn-block btn-success">Update</button>
        </div>
      </div>
    </div>
  </LoadingView>
</template>

<script>
  import BackButton from '../../components/commons/BackButton'
  import ErrorsComponent from '../../components/commons/Errors'
  import Price from '../../components/commons/PriceElement'
  import SideDishes from '../../components/restaurants/SideDishes.vue'
  import LoadingView from "../../components/commons/LoadingView";
  import {mapMutations, mapState} from "vuex"
  import {INIT_EDIT_DISH_ACTION, UPDATE_DISH_ACTION, UPDATE_NAME, UPDATE_PRICE, UPDATE_CATEGORY} from "../../store/modules/EditDishState"

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
      updateName() {
        this.$store.commit(`editDish/${UPDATE_NAME}`)
      },
      updatePrice() {
        this.$store.commit(`editDish/${UPDATE_PRICE}`)
      },
      updateCategory() {
        this.$store.commit(`editDish/${UPDATE_CATEGORY}`)
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
      BackButton,
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