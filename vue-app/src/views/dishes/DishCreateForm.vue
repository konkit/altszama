<template>
  <div>
    <div class="container">
      <div class="row justify-content-center">
        <div class="col">
          <back-button :href="getBackUrl()"></back-button>
        </div>
      </div>

      <div class="row justify-content-center">
        <div class="col">
          <h1>Create dish in restaurant {{restaurantName}}</h1>
        </div>
      </div>

      <errors-component ref="errorsComponent"/>

      <div class="row justify-content-center">
        <div class="col">
          <div class="form">
            <input type="hidden" name="restaurant.id" :value="restaurantId"/>

            <div class="form-group">
              <label for="name">Name</label>
              <input type="text" class="form-control" :value="name" @input="updateName($event.target.value)" required="" id="name"/>
            </div>

            <div class="form-group">
              <label for="dish-price">Price</label>
              <vue-numeric currency="zł" separator="." currency-symbol-position="suffix" :value="price" @input="updatePrice($event)"
                           :precision="2" class="form-control" required="" id="dish-price"></vue-numeric>
            </div>

            <div class="form-group">
              <label for="category">Category</label>
              <input type="text" class="form-control" :value="category" @input="updateCategory($event.target.value)" id="category" list="categoryNames"/>
              <datalist id="categoryNames">
                <option v-for="categoryName in categories" :value="categoryName"/>
              </datalist>
            </div>

            <div>
              <side-dishes ref="sideDishesElement"></side-dishes>
            </div>
          </div>
        </div>
      </div>

      <div class="row justify-content-center">
        <div class="col">
          <button @click="submitForm" class="btn btn-block btn-success">Create</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import BackButton from '../../components/commons/BackButton.vue'
  import ErrorsComponent from '../../components/commons/Errors.vue'
  import Price from '../../components/commons/PriceElement.vue'
  import Spinner from '../../components/commons/Spinner'
  import SideDishes from '../../components/restaurants/SideDishes.vue'
  import {mapMutations, mapState} from "vuex"

  export default {
    props: ['restaurantName'],
    data() {
      return {
        restaurantId: this.$route.params.id,
      }
    },
    mounted() {
      this.$store.dispatch("createDish/initCreateDish", {restaurantId: this.restaurantId})
    },
    methods: {
      submitForm: function () {
        let errorsComponent = this.$refs.errorsComponent;

        let sideDishes = this.$refs.sideDishesElement.getSideDishes();

        this.$store.dispatch("createDish/saveDish", {errorsComponent: errorsComponent, sideDishes: sideDishes, backUrl: this.getBackUrl()});

        return false;
      },
      getBackUrl: function () {
        if (typeof this.$route.query.addingToOrderId !== "undefined" && this.$route.query.addingToOrderId.length > 0) {
          return "#/orders/" + this.$route.query.addingToOrderId + "/create_entry"
        } else {
          return "#/restaurants/show/" + this.restaurantId
        }
      },
      ...mapMutations("createDish", [
        "updateName",
        "updatePrice",
        "updateCategory",
      ])
    },
    computed: {
      ...mapState("createDish", [
        'categories',
        'name',
        'price',
        'category'
      ])
    },
    components: {
      BackButton,
      ErrorsComponent,
      Spinner,
      Price,
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