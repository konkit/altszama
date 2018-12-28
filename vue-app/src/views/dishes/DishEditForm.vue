<template>
  <WithSpinner>
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

      <errors-component ref="errorsComponent"/>

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
  </WithSpinner>
</template>

<script>
  import BackButton from '../../components/commons/BackButton'
  import ErrorsComponent from '../../components/commons/Errors'
  import Price from '../../components/commons/PriceElement'
  import Spinner from '../../components/commons/Spinner'
  import SideDishes from '../../components/restaurants/SideDishes.vue'
  import WithSpinner from "../../components/commons/WithSpinner";
  import {mapMutations, mapState} from "vuex"

  export default {
    data() {
      return {
        restaurantId: this.$route.params.id,
        dishId: this.$route.params.dishId,
      }
    },
    mounted() {
      this.$store.dispatch("editDish/initEditDish", {restaurantId: this.restaurantId, dishId: this.dishId})
    },
    methods: {
      submitForm: function () {
        let sideDishes = this.$refs.sideDishesElement.getSideDishes();

        let errorsComponent = this.$refs.errorsComponent;

        this.$store.dispatch("editDish/updateDish", {errorsComponent: errorsComponent, sideDishes: sideDishes});

        return false;
      },
      addSideDish: function () {
        var newSideDish = {
          name: this.newSideDishName,
          price: Math.round(this.newSideDishPrice * 100)
        }

        this.sideDishes.push(newSideDish)
      },
      removeSideDish: function (sideDishId) {
        this.sideDishes = this.sideDishes.filter(sd => sd.id !== sideDishId)
      },
      ...mapMutations("editDish", [
        "updateName",
        "updatePrice",
        "updateCategory"
      ])
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
      WithSpinner,
      BackButton,
      ErrorsComponent,
      Price,
      Spinner,
      SideDishes
    }
  }
</script>

<style scoped>
  .container {
    max-width: 1200px;
  }

  .row {
    margin-top: 2rem;
  }
</style>