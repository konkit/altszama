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
          <h1>Edit restaurant {{this.restaurant.name}}</h1>
        </div>
      </div>

      <errors-component ref="errorsComponent"/>

      <div class="row justify-content-center">
        <div class="col">
          <form>
            <input type="hidden" name="id" v-model="restaurant.id"/>

            <div class="form-group">
              <label>Name:</label>
              <input class="form-control" type="text" v-model="restaurant.name"/>
            </div>

            <div class="form-group">
              <label>URL:</label>
              <input class="form-control" type="text" v-model="restaurant.url"/>
            </div>

            <div class="form-group">
              <label>Rating:</label>
              <input class="form-control" type="text" v-model="restaurant.rating"/>
            </div>

            <div class="form-group">
              <label>Telephone:</label>
              <input class="form-control" type="text" v-model="restaurant.telephone"/>
            </div>

            <div class="form-group">
              <label>Address:</label>
              <input class="form-control" type="text" v-model="restaurant.address"/>
            </div>
          </form>

          <button class="btn btn-block btn-success" v-on:click="submitForm">Update</button>
        </div>
      </div>
    </div>
  </WithSpinner>
</template>

<script>
  import BackButton from '../../components/commons/BackButton'
  import ErrorsComponent from '../../components/commons/Errors'
  import Spinner from '../../components/commons/Spinner'

  import ApiConnector from '../../lib/ApiConnector.js'
  import WithSpinner from "../../components/commons/WithSpinner";
  import DishesApiConnector from "../../lib/DishesApiConnector";

  export default {
    data() {
      return {
        restaurantId: this.$route.params.id,

        restaurant: {
          id: '',
          name: '',
          url: '',
          rating: '',
          telephone: '',
          address: '',
        }
      }
    },
    created() {
      this.$store.commit('setLoadingTrue')
    },
    mounted() {
      DishesApiConnector.getRestaurantEditData(this.restaurantId)
        .then(response => {
          this.restaurant = response;
          this.$store.commit('setLoadingFalse')
        })
        .catch(errResponse => ApiConnector.handleError(errResponse))
    },
    methods: {
      submitForm: function () {
        let errorsComponent = this.$refs.errorsComponent;

        DishesApiConnector.editRestaurant(this.restaurantId, restaurant)
          .catch(error => {
            errorsComponent.addError(error.body.message);
          });

        return false;
      }
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
      Spinner
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