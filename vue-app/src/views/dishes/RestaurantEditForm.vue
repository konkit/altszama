<template>
  <LoadingView>
    <v-toolbar>
      <back-button2 :href="'#/restaurants/show/' + this.restaurantId"></back-button2>

      <v-toolbar-title>
        Edit restaurant {{name}}
      </v-toolbar-title>
    </v-toolbar>

    <v-content>
      <v-container fluid>
        <v-layout align-center justify-center>
          <v-flex xs10>
            <v-card>
              <v-card-text>
                <errors-component />

                <v-form id="restaurantCreateForm">
                  <v-text-field label="Name" :value="name" @input="updateName($event)"></v-text-field>
                  <v-text-field label="Url" :value="url" @input="updateUrl($event)"></v-text-field>
                  <v-text-field label="Rating" :value="rating" @input="updateRating($event)"></v-text-field>
                  <v-text-field label="Telephone" :value="telephone" @input="updateTelephone($event)"></v-text-field>
                  <v-text-field label="Address" :value="address" @input="updateAddress($event)"></v-text-field>
                </v-form>

              </v-card-text>
              <v-card-actions>
                <v-btn color="primary" @click="submitForm">Update</v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </LoadingView>
</template>

<script>
  import BackButton2 from '../commons/BackButton2'
  import ErrorsComponent from '../commons/Errors'

  import LoadingView from "../commons/LoadingView";
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
        this.$store.dispatch(`editRestaurant/${UPDATE_RESTAURANT_ACTION}`);

        return false;
      },
      updateName(newValue) {
        this.$store.commit(`editRestaurant/${UPDATE_NAME}`, newValue);
      },
      updateUrl(newValue) {
        this.$store.commit(`editRestaurant/${UPDATE_URL}`, newValue);
      },
      updateRating(newValue) {
        this.$store.commit(`editRestaurant/${UPDATE_RATING}`, newValue);
      },
      updateTelephone(newValue) {
        this.$store.commit(`editRestaurant/${UPDATE_TELEPHONE}`, newValue);
      },
      updateAddress(newValue) {
        this.$store.commit(`editRestaurant/${UPDATE_ADDRESS}`, newValue);
      },
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
      BackButton2,
      ErrorsComponent,
    }
  }
</script>

<style scoped>
  .row {
    margin-top: 2rem;
  }
</style>