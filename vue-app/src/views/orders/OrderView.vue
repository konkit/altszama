<template>
  <ViewWrapper :title="`Ordering from ${restaurantName}`" :backpath="`#/orders/show/${orderId}`">
    <LoadingView>
      <div v-if="isStateOrdering">
        <simple-card>
          <v-container>
            <v-layout row>
              <v-flex>
                <v-alert :value="true" color="warning" icon="new_releases" outline>
                  Order is now locked, so no one should order anything else now.
                </v-alert>
              </v-flex>
            </v-layout>
          </v-container>

          <v-container>
            <v-layout row>
              <v-flex xs12>
                <p>
                  Now please call the restaurant <span v-if="restaurantTelephone">(<b>tel. {{restaurantTelephone}}</b>)</span>,
                  make an order and then enter approximate delivery time and click "Order placed"
                </p>
              </v-flex>
            </v-layout>

            <v-layout row justify-space-around>
              <v-flex xs3>
                <TimePicker :value="approxTimeOfDelivery" @input="updateApproxTimeOfDelivery($event)"
                            label="Approximate time of delivery"></TimePicker>
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

          <div class="grid-container">
            <template v-for="entry in groupedEntries">
              <div class="table-column pt-3">
                {{entry.eatingPeopleCount}}x {{entry.dish.name}}
                <span class="price-wrapper">(<price :data-price="entry.dish.price"></price>)</span>
              </div>

              <div class="table-column pt-3">
                <div v-for="(eatingPersonEntry, i) in entry.eatingPeopleEntries" :key="i">
                  <p class="dish-name">
                    {{i + 1}}. {{ eatingPersonEntry.username }}
                  </p>

                  <p class="side-dish-name pl-3" v-for="(sd, j) in eatingPersonEntry.sideDishes" :key="j">
                    + {{sd.name}} (
                    <price :data-price="sd.price"/>
                    )
                  </p>

                  <p class="dish-comments pl-3" v-if="eatingPersonEntry.comments.length > 0">
                    Additional comments: {{ eatingPersonEntry.comments }}
                  </p>
                </div>
              </div>

              <div class="table-column pt-3">
                <price :data-price="entry.price"></price>
              </div>
            </template>
          </div>

        </simple-card>

        <simple-card>

          <price-summary
              :orderDecreaseInPercent="orderDecreaseInPercent"
              :orderDeliveryCostPerEverybody="orderDeliveryCostPerEverybody"
              :basePriceSum="basePriceSum"
              :orderDeliveryCostPerDish="orderDeliveryCostPerDish"
              :allEatingPeopleCount="allEatingPeopleCount"
              :totalPrice="totalPrice"
          >
          </price-summary>
        </simple-card>

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
  </ViewWrapper>
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
  import ViewWrapper from "../commons/ViewWrapper";

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
      ViewWrapper,
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

  .price-wrapper {
    white-space: nowrap;
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

    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .grid-container {
    display: grid;
    grid-template-columns: 2fr minmax(0, 2fr) 100px;
  }

  .table-column {
  }
</style>