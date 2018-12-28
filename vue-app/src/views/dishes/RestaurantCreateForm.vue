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
            <input class="form-control" type="text" name="name" :value="name" @input="updateName($event.target.value)"/>
          </div>

          <div class="form-group">
            <label>URL:</label>
            <input class="form-control" type="text" name="url" :value="url" @input="updateUrl($event.target.value)"/>
          </div>

          <div class="form-group">
            <label>Rating:</label>
            <input class="form-control" type="text" name="rating" :value="rating" @input="updateRating($event.target.value)" />
          </div>

          <div class="form-group">
            <label>Telephone:</label>
            <input class="form-control" type="text" name="telephone" :value="telephone" @input="updateTelephone($event.target.value)" />
          </div>

          <div class="form-group">
            <label>Address:</label>
            <input class="form-control" type="text" name="address" :value="address" @input="updateAddress($event.target.value)" />
          </div>
        </form>

        <button @click="submitForm" class="btn btn-block btn-success">Create</button>
      </div>
    </div>
  </div>
</template>

<script>
  import BackButton from '../../components/commons/BackButton'
  import ErrorsComponent from '../../components/commons/Errors'
  import {mapMutations, mapState} from 'vuex'

  export default {
    props: ['restaurantName'],
    methods: {
      submitForm: function () {
        this.$store.dispatch("createRestaurant/saveRestaurant", {errorsComponent: this.$refs.errorsComponent})
      },
      ...mapMutations("createRestaurant", [
        "updateName",
        "updateUrl",
        "updateRating",
        "updateTelephone",
        "updateAddress",
      ])
    },
    computed: {
      ...mapState('createRestaurant', [
        'name',
        'url',
        'rating',
        'telephone',
        'address'
      ]),
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