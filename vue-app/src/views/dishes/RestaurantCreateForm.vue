<template>
  <div>
    <v-toolbar>
      <back-button2 href="#/restaurants"></back-button2>

      <v-toolbar-title>
        Create restaurant
      </v-toolbar-title>
    </v-toolbar>

    <v-content>
      <v-container fluid>
        <v-layout align-center justify-center>
          <v-flex xs10>
            <v-card>
              <v-card-text>
                <errors-component/>

                  <v-form id="restaurantCreateForm">
                    <v-text-field label="Name" :value="name" @input="updateName($event)"></v-text-field>
                    <v-text-field label="Url" :value="url" @input="updateUrl($event)"></v-text-field>
                    <v-text-field label="Rating" :value="rating" @input="updateRating($event)"></v-text-field>
                    <v-text-field label="Telephone" :value="telephone" @input="updateTelephone($event)"></v-text-field>
                    <v-text-field label="Address" :value="address" @input="updateAddress($event)"></v-text-field>
                  </v-form>
              </v-card-text>
              <v-card-actions>
                <v-btn color="primary" @click="submitForm">Create</v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </div>
</template>

<script>
  import BackButton2 from '../commons/BackButton2'
  import ErrorsComponent from '../commons/Errors'
  import {mapState} from 'vuex'
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
      updateName(newValue) {
        console.log("newValue: ", newValue);
        this.$store.commit(`createRestaurant/${UPDATE_NAME}`, newValue);
      },
      updateUrl(newValue) {
        this.$store.commit(`createRestaurant/${UPDATE_URL}`, newValue);
      },
      updateRating(newValue) {
        this.$store.commit(`createRestaurant/${UPDATE_RATING}`, newValue);
      },
      updateTelephone(newValue) {
        this.$store.commit(`createRestaurant/${UPDATE_TELEPHONE}`, newValue);
      },
      updateAddress(newValue) {
        this.$store.commit(`createRestaurant/${UPDATE_ADDRESS}`, newValue);
      },
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
      BackButton2,
      ErrorsComponent,
    }
  }
</script>

<style scoped>
</style>