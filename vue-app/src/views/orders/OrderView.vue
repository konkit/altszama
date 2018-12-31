<template>
  <LoadingView>
    <div v-if="isStateOrdering">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col">
            <back-button :href="'#/orders/show/' + orderId"></back-button>
          </div>
        </div>

        <div class="row justify-content-center">
          <div class="col">
            <h1>Ordering from {{restaurantName}}</h1>

            <div class="alert alert-warning">
              <p>Order is now locked, so no one should order anything else now.</p>

              <!-- <h4>Below there are all entries you have to order.</h4> -->
            </div>

            <h4>Now please call:</h4>
            <h4>tel. {{restaurantTelephone}}</h4>
            <h4>make an order and then enter approximate delivery time and click "Order placed"</h4>

          </div>
        </div>
      </div>

      <div class="container">
        <div class="row justify-content-center">
          <div class="col">

            <form id="place-order-form">
              <div class="form-group">
                <masked-input
                    class="form-control"
                    type="text"
                    :value="approxTimeOfDelivery"
                    @input="updateApproxTimeOfDelivery($event.target.value)"
                    :mask="[/\d/,/\d/,':',/\d/,/\d/]"
                    :keepCharPositions="true"
                />
              </div>
            </form>

            <button class="btn btn-block btn-success" @click="submitForm">
              Order placed!
              &nbsp;<i class="fa fa-arrow-right" aria-hidden="true"></i>
            </button>

          </div>
        </div>
      </div>

      <div class="container">
        <errors-component/>
      </div>

      <div class="container">
        <div class="row justify-content-center">
          <div class="col">

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
                      {{ eatingPersonEntry.user.username }}
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

          </div>
        </div>
      </div>

      <div class="container">
        <div class="row justify-content-center">
          <div class="col">

            <h4>Price summary</h4>

            <dt v-if="orderDecreaseInPercent !== 0 || orderDeliveryCostPerEverybody !== 0">
              Base price :
            </dt>
            <dd v-if="orderDecreaseInPercent !== 0 || orderDeliveryCostPerEverybody !== 0">
              <price :data-price="basePriceSum"/>
            </dd>

            <dt v-if="orderDecreaseInPercent !== 0">
              Price decrease :
            </dt>
            <dd v-if="orderDecreaseInPercent !== 0">
              - {{orderDecreaseInPercent}} %
            </dd>

            <dt v-if="orderDeliveryCostPerEverybody !== 0">
              Delivery :
            </dt>
            <dd v-if="orderDeliveryCostPerEverybody !== 0">
              +
              <price :data-price="orderDeliveryCostPerEverybody"/>
            </dd>

            <dt v-if="orderDeliveryCostPerDish !== 0">
              Delivery per dish:
            </dt>
            <dd v-if="orderDeliveryCostPerDish !== 0">
              +
              <price :data-price="orderDeliveryCostPerDish"/>
              * {{allEatingPeopleCount}}
            </dd>

            <dt>Total:</dt>
            <dd><b>
              <price :data-price="totalPrice"/>
            </b></dd>
          </div>
        </div>
      </div>
    </div>

    <div v-if="isStateNotOrdering">
      <navigation user-name="Tmp name"></navigation>

      <div class="container">
        <back-button :href="'#/orders/show/' + orderId"></back-button>

        <div class="row justify-content-center">
          <div class="col">
            <h1>Ordering from {{restaurantName}}</h1>
          </div>
        </div>
      </div>

      <div class="container">
        <div class="row justify-content-center">
          <div class="col">
            <h4>Sorry, the order is empty</h4>
            <p>
              <back-button :href="'#/orders/show/' + orderId"></back-button>
            </p>
          </div>
        </div>
      </div>
    </div>
  </LoadingView>
</template>

<script>
  import BackButton from '../../components/commons/BackButton.vue'
  import ErrorsComponent from '../../components/commons/Errors.vue'
  import MaskedInput from 'vue-text-mask'
  import Price from '../../components/commons/PriceElement.vue'
  import Navigation from '../../components/Navigation.vue'
  import LoadingView from "../../components/commons/LoadingView";
  import {MAKE_AN_ORDER_ACTION, FETCH_ORDER_VIEW_DATA_ACTION, UPDATE_APPROX_TIME_OF_DELIVERY} from "../../store/modules/OrderViewState"
  import {mapState} from "vuex"

  export default {
    data() {
      return {
        orderId: this.$route.params.id,
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
      LoadingView,
      BackButton,
      ErrorsComponent,
      MaskedInput,
      Price,
      Navigation,
    }
  }

</script>

<style scoped>
  .container {
    margin-bottom: 2rem;
  }

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