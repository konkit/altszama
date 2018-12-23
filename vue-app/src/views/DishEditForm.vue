<template>
  <div>
    <div v-if="this.loading === true">
      <spinner></spinner>
    </div>

    <div v-if="this.loading === false">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col">
            <back-button :href="'#/restaurants/show/' + this.restaurantId" ></back-button>
          </div>
        </div>

        <div class="row justify-content-center">
          <div class="col">
            <h1>Edit dish</h1>
          </div>
        </div>        

        <errors-component ref="errorsComponent" />

        <div class="row justify-content-center">
          <div class="col">
            <input type="hidden" name="restaurant.id" v-bind:value="this.restaurantId" />
            <input type="hidden" name="id" v-bind:value="this.dishId" />

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
              <side-dishes ref="sideDishesElement" :initialSideDishes="initialSideDishes"></side-dishes>
            </div>
          </div>
        </div>

        <div class="row justify-content-center">
          <div class="col">
            <button v-on:click="submitForm" class="btn btn-block btn-success">Update</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'

import BackButton from '../components/commons/backButton'
import ErrorsComponent from '../components/commons/errors'
import Price from '../components/commons/priceElement'
import Spinner from '../components/commons/spinner'
import SideDishes from '../components/restaurants/SideDishes.vue'

import ApiConnector from '../lib/ApiConnector.js'

export default {
  data () {
    return {
      restaurantId: this.$route.params.id,
      dishId: this.$route.params.dishId,
      initialSideDishes: [],
      categories: [],

      results: {},

      name: '',
      price: '',
      category: '',
    }
  },
  created() {
    this.$store.commit('setLoadingTrue')
  },
  mounted() {
    ApiConnector.makeGet("/restaurants/" + this.restaurantId + "/dishes/" + this.dishId + "/edit.json")
      .then(response => {
        this.results = response.data;

        this.name = response.data.dish.name;
        this.price = response.data.dish.price / 100;
        this.category = response.data.dish.category;
        this.initialSideDishes = response.data.dish.sideDishes;
        this.categories = response.data.categories;

        this.$store.commit('setLoadingFalse')
      })
      .catch(errResponse => ApiConnector.handleError(errResponse))
  },
  methods: {
    submitForm: function() {
      let sideDishesElement = this.$refs.sideDishesElement;

      var formData = {
        "restaurant.id": this.restaurantId,
        id: this.dishId,
        name: this.name,
        price: Math.round(this.price * 100),
        category: this.category,
        sideDishes: sideDishesElement.getSideDishes()
      };

      var action = "/restaurants/" + this.restaurantId + "/dishes/update"
      var dataSuccessUrl = "#/restaurants/show/" + this.restaurantId

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
    addSideDish: function() {
      var newSideDish = {
        name: this.newSideDishName,
        price: Math.round(this.newSideDishPrice * 100)
      }

      this.sideDishes.push(newSideDish)
    },
    removeSideDish: function(sideDishId) {
      this.sideDishes = this.sideDishes.filter(sd => sd.id !== sideDishId)
    },
  },
  computed: {
    loading () {
      return this.$store.state.loading;
    }
  },
  components: {
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