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
          <h1>Edit restaurant {{name}}</h1>
        </div>
      </div>

      <errors-component ref="errorsComponent"/>

      <div class="row justify-content-center">
        <div class="col">
          <form>
            <input type="hidden" name="id" :value="restaurantId"/>

            <div class="form-group">
              <label>Name:</label>
              <input class="form-control" type="text" :value="name" @input="updateName($event.target.value)"/>
            </div>

            <div class="form-group">
              <label>URL:</label>
              <input class="form-control" type="text" :value="url" @input="updateUrl($event.target.value)"/>
            </div>

            <div class="form-group">
              <label>Rating:</label>
              <input class="form-control" type="text" :value="rating" @input="updateRating($event.target.value)" />
            </div>

            <div class="form-group">
              <label>Telephone:</label>
              <input class="form-control" type="text" :value="telephone" @input="updateTelephone($event.target.value)" />
            </div>

            <div class="form-group">
              <label>Address:</label>
              <input class="form-control" type="text" :value="address" @input="updateAddress($event.target.value)" />
            </div>
          </form>

          <button class="btn btn-block btn-success" @click="submitForm">Update</button>
        </div>
      </div>
    </div>
  </WithSpinner>
</template>

<script>
  import BackButton from '../../components/commons/BackButton'
  import ErrorsComponent from '../../components/commons/Errors'
  import Spinner from '../../components/commons/Spinner'

  import WithSpinner from "../../components/commons/WithSpinner";
  import {mapMutations, mapState} from 'vuex'

  export default {
    data() {
      return {
        restaurantId: this.$route.params.id,
      }
    },
    mounted() {
      this.$store.dispatch("editRestaurant/initEditRestaurant", {restaurantId: this.restaurantId});
    },
    methods: {
      submitForm: function () {
        let errorsComponent = this.$refs.errorsComponent;

        this.$store.dispatch("editRestaurant/updateRestaurant", {errorsComponent: errorsComponent});

        return false;
      },
      ...mapMutations("editRestaurant", [
        "updateName",
        "updateUrl",
        "updateRating",
        "updateTelephone",
        "updateAddress",
      ])
    },
    computed: {
      ...mapState('editRestaurant', [
        'name',
        'url',
        'rating',
        'telephone',
        'address'
      ]),
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