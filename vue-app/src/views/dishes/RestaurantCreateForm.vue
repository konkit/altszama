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

    <errors-component ref="errorsComponent"/>

    <div class="row justify-content-center">
      <div class="col">
        <form id="restaurantCreateForm">
          <div class="form-group">
            <label>Name:</label>
            <input class="form-control" type="text" name="name" v-model="restaurant.name"/>
          </div>

          <div class="form-group">
            <label>URL:</label>
            <input class="form-control" type="text" name="url" v-model="restaurant.url"/>
          </div>

          <div class="form-group">
            <label>Rating:</label>
            <input class="form-control" type="text" name="rating" v-model="restaurant.rating"/>
          </div>

          <div class="form-group">
            <label>Telephone:</label>
            <input class="form-control" type="text" name="telephone" v-model="restaurant.telephone"/>
          </div>

          <div class="form-group">
            <label>Address:</label>
            <input class="form-control" type="text" name="address" v-model="restaurant.address"/>
          </div>
        </form>

        <button v-on:click="submitForm" class="btn btn-block btn-success">Create</button>
      </div>
    </div>
  </div>
</template>

<script>
  import BackButton from '../../components/commons/BackButton'
  import ErrorsComponent from '../../components/commons/Errors'
  import DishesApiConnector from "../../lib/DishesApiConnector";

  export default {
    props: ['restaurantName'],
    data() {
      return {
        restaurantId: this.$route.params.id,

        restaurant: {
          name: '',
          url: '',
          rating: '',
          telephone: '',
          address: '',
        },
      }
    },
    methods: {
      submitForm: function () {
        DishesApiConnector.createRestaurant(this.restaurant, this.$refs.errorsComponent);
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