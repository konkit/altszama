<template>
  <ViewWrapper :title="`Ordering from ${restaurantName}`" :backpath="`#/orders/show/${orderId}`">
    <LoadingView>

      <template v-if="isStateOrdering">
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-banner>
                <v-icon slot="icon" color="warning" size="36">mdi-lock-alert</v-icon>

                <p><strong>The order is locked!</strong></p>

                <p>
                  Order is now locked, so no one should order anything else now.
                </p>

                <template v-slot:actions>
                  <v-btn text color="primary" @click="unlockOrder()">
                    Unlock &nbsp; <span class="fa fa-unlock"></span>
                  </v-btn>
                </template>
              </v-banner>
            </v-col>
          </v-row>
        </v-container>

        <v-container>
          <v-row>
            <v-col cols="8">
              <v-card height="100%">
                <v-card-title>Call the place!</v-card-title>

                <v-card-text>

                  <v-row>
                    <v-col>
                      <p>
                        Now please call the restaurant, make an order and then enter approximate delivery time
                        and click "Order placed"
                      </p>
                    </v-col>
                  </v-row>

                  <v-row>
                    <v-col v-if="restaurantTelephone.length > 0" class="align-center">
                      <b>tel. {{restaurantTelephone}}</b>
                    </v-col>
                    <v-col v-else class="align-center">
                      <b>Telephone number not specified, sorry :/</b>
                    </v-col>
                  </v-row>

                  <v-row class="justify-space-around">
                    <v-col class="align-center align-self-center" :align-self="align">
                      <div class=" delivery-time-wrapper">

                        <TimePicker :value="approxTimeOfDelivery" @input="updateApproxTimeOfDelivery($event)"
                                    label="Approximate time of delivery"></TimePicker>
                      </div>
                    </v-col>

                    <v-col class="align-center align-self-center" :align-self="center">
                      <v-btn color="success" @click="submitForm">
                        Order placed! &nbsp;<i class="fa fa-arrow-right" aria-hidden="true"></i>
                      </v-btn>
                    </v-col>
                  </v-row>

                </v-card-text>
              </v-card>
            </v-col>

            <v-col cols="4">
              <v-card>
                <v-card-title>Cost summary</v-card-title>

                <v-card-text>
                  <price-summary
                      :orderDecreaseInPercent="orderDecreaseInPercent"
                      :orderDeliveryCostPerEverybody="orderDeliveryCostPerEverybody"
                      :basePriceSum="basePriceSum"
                      :orderDeliveryCostPerDish="orderDeliveryCostPerDish"
                      :allEatingPeopleCount="allEatingPeopleCount"
                      :totalPrice="totalPrice"
                  >
                  </price-summary>
                </v-card-text>


              </v-card>
            </v-col>

          </v-row>
        </v-container>

        <v-container>
          <v-row>
            <v-col cols="xs12">
              <v-card>
                <v-card-title>
                  Dishes:
                </v-card-title>

                <v-card-text>
                  <UserOrders :groupedEntries="groupedEntries"></UserOrders>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </template>

      <template v-if="isStateNotOrdering">
        <v-container>
          <v-row>
            <v-col cols="xs12">
              <v-card>
                <v-card-text>
                  <h1>Ordering from {{restaurantName}}</h1>
                  <h4>Sorry, the order is empty</h4>
                  <p>
                    <back-button :href="'#/orders/show/' + orderId"></back-button>
                  </p>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </template>

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
  import PriceSummary from "./components/PriceSummary";
  import TimePicker from "../commons/TimePicker";
  import ViewWrapper from "../commons/ViewWrapper";
  import {
    UNLOCK_ORDER_ACTION,
    FETCH_ORDER_DATA_ACTION,
    NAMESPACE_SHOW_ORDER,
    SET_ORDER_AS_DELIVERED_ACTION,
  } from "../../store/modules/ShowOrderState"
  import router from '../../router/index'
  import UserOrders from "./components/orderView/UserOrders";

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
      updateApproxTimeOfDelivery(newValue) {
        this.$store.commit(`orderView/${UPDATE_APPROX_TIME_OF_DELIVERY}`, newValue)
      },
      unlockOrder() {
        this.$store.dispatch(`${NAMESPACE_SHOW_ORDER}/${UNLOCK_ORDER_ACTION}`, {orderId: this.orderId})
          .then(() => router.push("/orders/show/" + this.orderId))
      },
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
      UserOrders,
      ViewWrapper,
      TimePicker,
      PriceSummary,
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

  .align-center {
    text-align: center;
  }

  .delivery-time-wrapper {
    display: inline-block;
  }

  .no-y-padding {
    padding-top: 0;
    padding-bottom: 0;
  }
</style>