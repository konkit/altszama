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
            <h1>Edit restaurant {{this.name}}</h1>
          </div>
        </div>

        <errors-component ref="errorsComponent" />

        <div class="row justify-content-center">
          <div class="col">
            <form>
              <input type="hidden" name="id" v-model="id" />

              <div class="form-group">
                <label>Name:</label>
                <input class="form-control" type="text" v-model="name" />
              </div>

              <div class="form-group">
                <label>URL:</label>
                <input class="form-control" type="text" v-model="url" />
              </div>

              <div class="form-group">
                <label>Rating:</label>
                <input class="form-control" type="text" v-model="rating" />
              </div>

              <div class="form-group">
                <label>Telephone:</label>
                <input class="form-control" type="text" v-model="telephone" />
              </div>

              <div class="form-group">
                <label>Address:</label>
                <input class="form-control" type="text" v-model="address" />
              </div>
            </form>

            <button class="btn btn-block btn-success" v-on:click="submitForm">Update</button>
          </div>
        </div>
      </div>
  </WithSpinner>
</template>

<script>
import BackButton from '../components/commons/backButton'
import ErrorsComponent from '../components/commons/errors'
import Spinner from '../components/commons/spinner'

import ApiConnector from '../lib/ApiConnector.js'
import WithSpinner from "../components/commons/WithSpinner";

export default {
  data () {
    return {
      restaurantId: this.$route.params.id,

      id: '',
      name: '',
      url: '',
      rating: '',
      telephone: '',
      address: '',
    }
  },
  created() {
    this.$store.commit('setLoadingTrue')
  },
  mounted() {
    ApiConnector.getRestaurantEditData(this.restaurantId)
      .then(response => {
        this.id = response.id;
        this.url = response.url;
        this.name = response.name;
        this.rating = response.rating;
        this.telephone = response.telephone;
        this.address = response.address;

        this.$store.commit('setLoadingFalse')
      })
      .catch(errResponse => ApiConnector.handleError(errResponse))
  },
  methods: {
    submitForm: function() {
      let restaurant = {
        id: this.id,
        name: this.name,
        rating: this.rating,
        telephone: this.telephone,
        address: this.address,
        url: this.url
      };

      const dataSuccessUrl = "#/restaurants/show/" + this.restaurantId;

      let errorsComponent = this.$refs.errorsComponent;

      ApiConnector.editRestaurant(this.restaurantId, restaurant)
        .then(function (response) {
          window.location.href = dataSuccessUrl;
        })
        .catch(function(error) {
          console.log("dishCreateForm Error:");
          console.log(error);
          errorsComponent.addError(error.body.message);
        });

      return false;
    }
  },
  computed: {
    loading () {
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