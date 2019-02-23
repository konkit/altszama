<template>
  <LoadingView>
    <v-toolbar>
      <back-button2 :href="'#/orders/show/' + orderId"></back-button2>

      <v-toolbar-title>
        Ordering from {{restaurantName}}
      </v-toolbar-title>
    </v-toolbar>

    <div v-if="isStateOrdering">
      <simple-card>
        <v-container>
          <v-layout row>
            <v-flex>
              <v-alert :value="true" color="warning" icon="new_releases">
                Order is now locked, so no one should order anything else now.
              </v-alert>
            </v-flex>
          </v-layout>

          <v-layout row>
            <v-flex xs12>
              <p>Now please call: <b>tel. {{restaurantTelephone}}</b>, make an order and then enter approximate delivery time and click "Order placed"</p>
            </v-flex>
          </v-layout>

          <v-layout row>
            <v-flex xs3>
              <TimePicker :value="approxTimeOfDelivery" @input="updateApproxTimeOfDelivery($event)" label="Approximate time of delivery"></TimePicker>
            </v-flex>

            <v-flex xs3>
              <v-btn color="success" @click="submitForm">
                Order placed! &nbsp;<i class="fa fa-arrow-right" aria-hidden="true"></i>
              </v-btn>
            </v-flex>
          </v-layout>
        </v-container>
      </simple-card>

      <simple-card>
        <errors-component/>

        <h4>Dishes:</h4>

        <table class="table">
          <thead>
          <tr>
            <th>Dish</th>
            <th>Eaters (and their comments)</th>
            <th class="price-column">Price</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="entry in groupedEntries" :key="entry.id">
            <td>{{entry.eatingPeopleCount}}x {{entry.dish.name}} (
              <price :data-price="entry.dish.price"></price>
              )
            </td>

            <td>
              <div v-for="(eatingPersonEntry, i) in entry.eatingPeopleEntries" :key="i">
                <p class="dish-name">
                  {{ eatingPersonEntry.username }}
                </p>

                <p class="side-dish-name" v-for="(sd, i) in eatingPersonEntry.sideDishes" :key="i">
                  + {{sd.name}} (
                  <price :data-price="sd.price"/>
                  )
                </p>

                <p class="dish-comments" v-if="eatingPersonEntry.comments.length > 0">
                  Additional comments: {{ eatingPersonEntry.comments }}
                </p>
              </div>
            </td>
            <td>
              <price :data-price="entry.price"></price>
            </td>
          </tr>
          </tbody>
        </table>

      </simple-card>

      <v-container fluid>
        <v-layout align-center justify-center>
          <v-flex xs10 xl8>
            <v-card>
              <v-card-text>
                <v-layout column>

                  <price-summary
                      :orderDecreaseInPercent="orderDecreaseInPercent"
                      :orderDeliveryCostPerEverybody="orderDeliveryCostPerEverybody"
                      :basePriceSum="basePriceSum"
                      :orderDeliveryCostPerDish="orderDeliveryCostPerDish"
                      :allEatingPeopleCount="allEatingPeopleCount"
                      :totalPrice="totalPrice"
                  >
                  </price-summary>

                </v-layout>
              </v-card-text>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>

      <div v-if="isStateNotOrdering">
        <navigation user-name="Tmp name"></navigation>

        <simple-card>
          <h1>Ordering from {{restaurantName}}</h1>
          <h4>Sorry, the order is empty</h4>
          <p>
            <back-button :href="'#/orders/show/' + orderId"></back-button>
          </p>
        </simple-card>
      </div>
    </div>
  </LoadingView>
</template>

<script>
  import BackButton2 from '../commons/BackButton2.vue'
  import ErrorsComponent from '../commons/Errors.vue'
  import MaskedInput from 'vue-text-mask'
  import Price from '../commons/PriceElement.vue'
  import Navigation from '../commons/Navigation.vue'
  import LoadingView from "../commons/LoadingView";
  import {
    MAKE_AN_ORDER_ACTION,
    FETCH_ORDER_VIEW_DATA_ACTION,
    UPDATE_APPROX_TIME_OF_DELIVERY
  } from "../../store/modules/OrderViewState"
  import {mapState} from "vuex"
  import SimpleCard from "../commons/SimpleCard";
  import PriceSummary from "./components/PriceSummary";
  import TimePicker from "../commons/TimePicker";

  export default {
    data() {
      return {
        orderId: this.$route.params.id,
        approxTimeOfDeliveryModal: false,
        timeOfOrderModal: false
      }
    },
    mounted() {
      this.$store.dispatch(`orderView/${FETCH_ORDER_VIEW_DATA_ACTION}`, {orderId: this.orderId});
    },
    methods: {
      submitForm() {
        this.$store.dispatch(`orderView/${MAKE_AN_ORDER_ACTION}`, {approxTimeOfDelivery: this.approxTimeOfDelivery});

        return false
      },
      updateApproxTimeOfDelivery() {
        this.$store.commit(`orderView/${UPDATE_APPROX_TIME_OF_DELIVERY}`)
      }
    },
    computed: {
      ...mapState("orderView", [
        "orderState",
        "orderDecreaseInPercent",
        "orderDeliveryCostPerEverybody",
        "orderDeliveryCostPerDish",
        "restaurantName",
        "restaurantTelephone",
        "groupedEntries",
        "allEatingPeopleCount",
        "basePriceSum",
        "totalPrice",
        "approxTimeOfDelivery"
      ]),
      isStateOrdering() {
        return this.orderState === 'ORDERING';
      },
      isStateNotOrdering() {
        return this.orderState !== 'ORDERING';
      }
    },
    components: {
      TimePicker,
      PriceSummary,
      SimpleCard,
      LoadingView,
      BackButton2,
      ErrorsComponent,
      MaskedInput,
      Price,
      Navigation,
    }
  }

</script>

<style scoped>

  .price-column {
    min-width: 100px;
  }

  p.dish-name {
    margin-top: 0;
    margin-bottom: 0;
  }

  p.side-dish-name {
    margin-top: 0;
    margin-bottom: 0;
    font-size: 10pt;
    color: #555555;
  }

  p.dish-comments {
    margin-top: 0;
    margin-bottom: 0;
    font-size: 10pt;
    color: #444444;
  }
</style>