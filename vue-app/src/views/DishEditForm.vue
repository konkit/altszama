<template>
  <WithSpinner>
    <div class="container">
      <div class="row justify-content-center">
        <div class="col">
          <back-button :href="'#/restaurants/show/' + this.restaurantId"></back-button>
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
          <input type="hidden" name="restaurant.id" v-bind:value="this.restaurantId"/>
          <input type="hidden" name="id" v-bind:value="dishData.dishId"/>

          <div class="form-group">
            <label for="name">Name</label>
            <input type="text" class="form-control" v-model="dishData.name" required="" id="name"/>
          </div>

          <div class="form-group">
            <label for="price">Price</label>
            <vue-numeric currency="zł" separator="." currency-symbol-position="suffix" v-model="dishData.price"
                         v-bind:precision="2" class="form-control" required="" id="price"></vue-numeric>
          </div>

          <div class="form-group">
            <label for="category">Category</label>
            <input type="text" class="form-control" v-model="dishData.category" id="category" list="categoryNames"/>
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
          <button v-on:click="submitForm" class="btn btn-block btn-success">Update</button>
        </div>
      </div>
    </div>
  </WithSpinner>
</template>

<script>
  import BackButton from '../components/commons/backButton'
  import ErrorsComponent from '../components/commons/errors'
  import Price from '../components/commons/priceElement'
  import Spinner from '../components/commons/spinner'
  import SideDishes from '../components/restaurants/SideDishes.vue'

  import ApiConnector from '../lib/ApiConnector.js'
  import WithSpinner from "../components/commons/WithSpinner";
  import DishesApiConnector from "../lib/DishesApiConnector";

  export default {
    data() {
      return {
        restaurantId: this.$route.params.id,
        dishId: this.$route.params.dishId,

        dishData: {
          name: '',
          price: '',
          category: '',
          initialSideDishes: [],
          categories: [],
        }
      }
    },
    created() {
      this.$store.commit('setLoadingTrue')
    },
    mounted() {
      DishesApiConnector.getDishEditData(this.restaurantId, this.dishId)
        .then(dishData => {
          this.dishData = dishData;
          this.$store.commit('setLoadingFalse')
        })
        .catch(errResponse => ApiConnector.handleError(errResponse))
    },
    methods: {
      submitForm: function () {
        let sideDishesElement = this.$refs.sideDishesElement;

        var dishObj = {
          id: this.dishId,
          name: dishData.name,
          price: Math.round(dishData.price * 100),
          category: dishData.category,
          sideDishes: sideDishesElement.getSideDishes()
        };

        var dataSuccessUrl = "#/restaurants/show/" + this.restaurantId

        let errorsComponent = this.$refs.errorsComponent;

        DishesApiConnector.editDish(this.restaurantId, dishObj)
          .then(response => {
            window.location.href = dataSuccessUrl;
          })
          .catch(error => {
            console.log("dishCreateForm Error:")
            console.log(error);
            errorsComponent.addError(error.body.message);
          });

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
    },
    computed: {
      loading() {
        return this.$store.state.loading;
      }
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