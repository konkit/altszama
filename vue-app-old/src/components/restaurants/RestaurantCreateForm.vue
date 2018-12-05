<template>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col">
        <back-button href="#/restaurants"></back-button>
      </div>
    </div>

    <div class="row justify-content-center">
      <div class="col">
        <h1>Create restaurant</h1>
      </div>
    </div>

    <errors-component ref="errorsComponent" />

    <div class="row justify-content-center">
      <div class="col">
        <form id="restaurantCreateForm">
          <div class="form-group">
            <label>Name:</label>
            <input class="form-control" type="text" name="name" v-model="name" />
          </div>

          <div class="form-group">
            <label>URL:</label>
            <input class="form-control" type="text" name="url" v-model="url" />
          </div>

          <div class="form-group">
            <label>Rating:</label>
            <input class="form-control" type="text" name="rating" v-model="rating" />
          </div>

          <div class="form-group">
            <label>Telephone:</label>
            <input class="form-control" type="text" name="telephone" v-model="telephone" />
          </div>

          <div class="form-group">
            <label>Address:</label>
            <input class="form-control" type="text" name="address" v-model="address" />
          </div>
        </form>

        <button v-on:click="submitForm" class="btn btn-block btn-success">Create</button>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'

import BackButton from '../commons/backButton'
import ErrorsComponent from '../commons/errors'

import ApiConnector from '../../ApiConnector.js'

export default {
  props: ['restaurantName'],
  data () {
    return {
      restaurantId: this.$route.params.id,

      name: '',
      url: '',
      rating: '',
      telephone: '',
      address: '',

      loaded: false
    }
  },
  mounted: function() {
    console.log("RestaurantCreateForm")
  },
  methods: {
    submitForm: function() {
      const action = "/restaurants/save";
      const dataSuccessUrl = "#/restaurants";

      let formData = {
        name: this.name,
        url: this.url,
        rating: this.rating,
        telephone: this.telephone,
        address: this.address
      };

      let errorsComponent = this.$refs.errorsComponent;

      ApiConnector.makePost(action, formData)
        .then(function (response) {
          window.location.href = dataSuccessUrl;
        })
        .catch(function(error) {
          console.log("restaurantCreateForm Error:");
          console.log(error);
          errorsComponent.addError(error.body.message);
        });

      return false;
    }
  },
  components: {
    BackButton,
    ErrorsComponent
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