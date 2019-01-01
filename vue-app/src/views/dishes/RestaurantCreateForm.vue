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

    <errors-component />

    <div class="row justify-content-center">
      <div class="col">
        <form id="restaurantCreateForm">
          <div class="form-group">
            <label>Name:</label>
            <input class="form-control" type="text" name="name" :value="name" @input="[UPDATE_NAME]($event.target.value)"/>
          </div>

          <div class="form-group">
            <label>URL:</label>
            <input class="form-control" type="text" name="url" :value="url" @input="[UPDATE_URL]($event.target.value)"/>
          </div>

          <div class="form-group">
            <label>Rating:</label>
            <input class="form-control" type="text" name="rating" :value="rating"
                   @input="[UPDATE_RATING]($event.target.value)"/>
          </div>

          <div class="form-group">
            <label>Telephone:</label>
            <input class="form-control" type="text" name="telephone" :value="telephone"
                   @input="[UPDATE_TELEPHONE]($event.target.value)"/>
          </div>

          <div class="form-group">
            <label>Address:</label>
            <input class="form-control" type="text" name="address" :value="address"
                   @input="[UPDATE_ADDRESS]($event.target.value)"/>
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
  import {
    UPDATE_NAME,
    UPDATE_URL,
    UPDATE_RATING,
    UPDATE_TELEPHONE,
    UPDATE_ADDRESS,
    SAVE_RESTAURANT_ACTION
  } from "../../store/modules/CreateRestaurantState"

  export default {
    props: ['restaurantName'],
    methods: {
      submitForm () {
        this.$store.dispatch(`createRestaurant/${SAVE_RESTAURANT_ACTION}`)
      },
      ...mapMutations("createRestaurant", [
        UPDATE_NAME,
        UPDATE_URL,
        UPDATE_RATING,
        UPDATE_TELEPHONE,
        UPDATE_ADDRESS,
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
  .row {
    margin-top: 2rem;
  }
</style>