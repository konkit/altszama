<template>
  <LoadingView>
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

      <errors-component />

      <div class="row justify-content-center">
        <div class="col">
          <form>
            <input type="hidden" name="id" :value="restaurantId"/>

            <div class="form-group">
              <label>Name:</label>
              <input class="form-control" type="text" :value="name" @input="[UPDATE_NAME]($event.target.value)"/>
            </div>

            <div class="form-group">
              <label>URL:</label>
              <input class="form-control" type="text" :value="url" @input="[UPDATE_URL]($event.target.value)"/>
            </div>

            <div class="form-group">
              <label>Rating:</label>
              <input class="form-control" type="text" :value="rating" @input="[UPDATE_RATING]($event.target.value)"/>
            </div>

            <div class="form-group">
              <label>Telephone:</label>
              <input class="form-control" type="text" :value="telephone" @input="[UPDATE_TELEPHONE]($event.target.value)"/>
            </div>

            <div class="form-group">
              <label>Address:</label>
              <input class="form-control" type="text" :value="address" @input="[UPDATE_ADDRESS]($event.target.value)"/>
            </div>
          </form>

          <button class="btn btn-block btn-success" @click="submitForm">Update</button>
        </div>
      </div>
    </div>
  </LoadingView>
</template>

<script>
  import BackButton from '../../components/commons/BackButton'
  import ErrorsComponent from '../../components/commons/Errors'

  import LoadingView from "../../components/commons/LoadingView";
  import {mapMutations, mapState} from 'vuex'
  import {
    UPDATE_RESTAURANT_ACTION,
    INIT_EDIT_RESTAURANT_ACTION,
    UPDATE_ADDRESS,
    UPDATE_TELEPHONE,
    UPDATE_RATING,
    UPDATE_URL,
    UPDATE_NAME
  } from "../../store/modules/EditRestaurantState"

  export default {
    data() {
      return {
        restaurantId: this.$route.params.id,
      }
    },
    mounted() {
      this.$store.dispatch(`editRestaurant/${INIT_EDIT_RESTAURANT_ACTION}`, {restaurantId: this.restaurantId});
    },
    methods: {
      submitForm () {
        let errorsComponent = this.$refs.errorsComponent;

        this.$store.dispatch(`editRestaurant/${UPDATE_RESTAURANT_ACTION}`, {errorsComponent: errorsComponent});

        return false;
      },
      ...mapMutations("editRestaurant", [
        UPDATE_NAME,
        UPDATE_URL,
        UPDATE_RATING,
        UPDATE_TELEPHONE,
        UPDATE_ADDRESS,
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
      LoadingView,
      BackButton,
      ErrorsComponent,
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