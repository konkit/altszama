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
          <h1>Create dish in restaurant {{this.restaurantName}}</h1>
        </div>
      </div>

      <errors-component ref="errorsComponent"/>

      <div class="row justify-content-center">
        <div class="col">
          <div class="form">
            <input type="hidden" name="restaurant.id" v-bind:value="this.restaurantId"/>

            <div class="form-group">
              <label for="name">Name</label>
              <input type="text" class="form-control" v-model="name" required="" id="name"/>
            </div>

            <div class="form-group">
              <label for="dish-price">Price</label>
              <vue-numeric currency="zł" separator="." currency-symbol-position="suffix" v-model="price"
                           v-bind:precision="2" class="form-control" required="" id="dish-price"></vue-numeric>
            </div>

            <div class="form-group">
              <label for="category">Category</label>
              <input type="text" class="form-control" v-model="category" id="category" list="categoryNames"/>
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
          <button v-on:click="submitForm" class="btn btn-block btn-success">Create</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import BackButton from '../components/commons/backButton.vue'
  import ErrorsComponent from '../components/commons/errors.vue'
  import Price from '../components/commons/priceElement.vue'
  import Spinner from '../components/commons/spinner'
  import SideDishes from '../components/restaurants/SideDishes.vue'

  import ApiConnector from '../lib/ApiConnector.js'
  import DishesApiConnector from "../lib/DishesApiConnector";

  export default {
    props: ['restaurantName'],
    data() {
      return {
        restaurantId: this.$route.params.id,

        categories: [],

        name: '',
        price: '',
        category: ''
      }
    },
    mounted() {
      DishesApiConnector.getDishCreateData(this.restaurantId)
        .then(response => {
          this.categories = response.data.categories
        })
        .catch(errResponse => ApiConnector.handleError(errResponse))
    },
    methods: {
      submitForm: function () {
        let sideDishesElement = this.$refs.sideDishesElement;

        const formData = {
          "restaurant.id": this.restaurantId,
          name: this.name,
          price: Math.round(this.price * 100),
          category: this.category,
          sideDishes: sideDishesElement.getSideDishes()
        };

        let errorsComponent = this.$refs.errorsComponent;

        DishesApiConnector.createDish(this.restaurantId, formData)
          .then(response => {
            window.location.href = this.getBackUrl();
          })
          .catch(function (error) {
            console.log("dishCreateForm Error:");
            console.log(error);
            errorsComponent.addError(error.body.message);
          });

        return false;
      },
      getBackUrl: function () {
        if (typeof this.$route.query.addingToOrderId !== "undefined" && this.$route.query.addingToOrderId.length > 0) {
          return "#/orders/" + this.$route.query.addingToOrderId + "/create_entry"
        } else {
          return "#/restaurants/show/" + this.restaurantId
        }
      }
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