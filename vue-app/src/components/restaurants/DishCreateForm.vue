<template>
  <div>
    <div class="container">
      <div class="row justify-content-center">
        <div class="col">
          <back-button :href="getBackUrl()" ></back-button>
        </div>
      </div>

      <div class="row justify-content-center">
        <div class="col">
          <h1>Create dish in restaurant {{this.restaurantName}}</h1>
        </div>
      </div>

      <errors-component ref="errorsComponent" />

      <div class="row justify-content-center">
        <div class="col">
          <div class="form">
            <input type="hidden" name="restaurant.id" v-bind:value="this.restaurantId" />

            <div class="form-group">
              <label for="name">Name</label>
              <input type="text" class="form-control" v-model="name" required="" id="name" />
            </div>

            <div class="form-group">
              <label for="price">Price</label>
              <vue-numeric currency="zł" separator="." currency-symbol-position="suffix" v-model="price" v-bind:precision="2" class="form-control" required="" id="price"></vue-numeric>
            </div>

            <div class="form-group">
              <label for="category">Category</label>
              <input type="text" class="form-control" v-model="category" id="category" list="categoryNames" />
              <datalist id="categoryNames">
                <option v-for="categoryName in categories" :value="categoryName" />
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
import Vue from 'vue'

import BackButton from '../commons/backButton.vue'
import ErrorsComponent from '../commons/errors.vue'
import Price from '../commons/priceElement.vue'
import Spinner from '../commons/spinner'
import SideDishes from './components/SideDishes.vue'

import ApiConnector from '../../ApiConnector.js'

export default {
  props: ['restaurantName'],
  data () {
    return {
      restaurantId: this.$route.params.id,

      categories: [],

      name: '',
      price: '',
      category: ''
    }
  },
  mounted() {
    ApiConnector.makeGet("/restaurants/" + this.restaurantId + "/dishes/create.json")
      .then(response => this.categories = response.data.categories)
      .catch(errResponse => ApiConnector.handleError(errResponse))
  },
  methods: {
    submitForm: function() {
      let sideDishesElement = this.$refs.sideDishesElement;

      var formData = {
        "restaurant.id": this.restaurantId,
        name: this.name,
        price: Math.round(this.price * 100),
        category: this.category,
        sideDishes: sideDishesElement.getSideDishes()
      };

      var action = "/restaurants/" + this.restaurantId + "/dishes/save"
      var dataSuccessUrl = this.getBackUrl();

      let errorsComponent = this.$refs.errorsComponent;

      ApiConnector.makePost(action, formData)
        .then(function (response) {
          window.location.href = dataSuccessUrl;
        })
        .catch(function(error) {
          console.log("dishCreateForm Error:")
          console.log(error);
          errorsComponent.addError(error.body.message);
        });

      return false;
    },
    getBackUrl: function() {
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