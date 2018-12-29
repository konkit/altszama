<template>
  <WithSpinner>
    <div v-if="isStateOrdering()">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col">
            <back-button :href="'#/orders/show/' + order.id"></back-button>
          </div>
        </div>

        <div class="row justify-content-center">
          <div class="col">
            <h1>Ordering from {{order.restaurant.name}}</h1>

            <div class="alert alert-warning">
              <p>Order is now locked, so no one should order anything else now.</p>

              <!-- <h4>Below there are all entries you have to order.</h4> -->
            </div>

            <h4>Now please call:</h4>
            <h4>tel. {{order.restaurant.telephone}}</h4>
            <h4>make an order and then enter approximate delivery time and click "Order placed"</h4>

          </div>
        </div>
      </div>

      <div class="container">
        <div class="row justify-content-center">
          <div class="col">

            <form id="place-order-form">
              <div class="form-group">
                <masked-input class="form-control" type="text" v-model="approxTimeOfDelivery"
                              :mask="[/\d/,/\d/,':',/\d/,/\d/]" :keepCharPositions="true"/>
              </div>
            </form>

            <button class="btn btn-block btn-success" @click="submitForm">
              Order placed!
              &nbsp;<i class="fa fa-arrow-right" aria-hidden="true"/>
            </button>

          </div>
        </div>
      </div>

      <div class="container">
        <errors-component ref="errorsComponent"/>
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
              <tr v-for="entry in this.groupedEntries" :key="entry.id">
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

            <dt v-if="order.decreaseInPercent != 0 || order.deliveryCostPerEverybody != 0">
              Base price :
            </dt>
            <dd v-if="order.decreaseInPercent != 0 || order.deliveryCostPerEverybody != 0">
              <price :data-price="this.basePriceSum"/>
            </dd>

            <dt v-if="order.decreaseInPercent != 0">
              Price decrease :
            </dt>
            <dd v-if="order.decreaseInPercent != 0">
              - {{order.decreaseInPercent}} %
            </dd>

            <dt v-if="order.deliveryCostPerEverybody != 0">
              Delivery :
            </dt>
            <dd v-if="order.deliveryCostPerEverybody != 0">
              +
              <price :data-price="order.deliveryCostPerEverybody"/>
            </dd>

            <dt v-if="order.deliveryCostPerDish != 0">
              Delivery per dish:
            </dt>
            <dd v-if="order.deliveryCostPerDish != 0">
              +
              <price :data-price="order.deliveryCostPerDish"/>
              * {{this.allEatingPeopleCount}}
            </dd>

            <dt>Total:</dt>
            <dd><b>
              <price :data-price="this.totalPrice"/>
            </b></dd>
          </div>
        </div>
      </div>
    </div>

    <div v-if="isStateNotOrdering()">
      <navigation user-name="Tmp name"></navigation>

      <div class="container">
        <back-button :href="'#/orders/show/' + order.id"></back-button>

        <div class="row justify-content-center">
          <div class="col">
            <h1>Ordering from {{order.restaurant.name}}</h1>
          </div>
        </div>
      </div>

      <div class="container">
        <div class="row justify-content-center">
          <div class="col">
            <h4>Sorry, the order is empty</h4>
            <p>
              <back-button :href="'#/orders/show/' + order.id"></back-button>
            </p>
          </div>
        </div>
      </div>
    </div>
  </WithSpinner>
</template>

<script>
  import BackButton from '../../components/commons/BackButton.vue'
  import ErrorsComponent from '../../components/commons/Errors.vue'
  import MaskedInput from 'vue-text-mask'
  import Price from '../../components/commons/PriceElement.vue'
  import Navigation from '../../components/Navigation.vue'
  import WithSpinner from "../../components/commons/WithSpinner";
  import {MAKE_AN_ORDER_ACTION, FETCH_ORDER_VIEW_DATA_ACTION} from "../../store/modules/OrderViewState"

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
      submitForm: function () {
        let errorsComponent = this.$refs.errorsComponent;

        this.$store.dispatch(`orderView/${MAKE_AN_ORDER_ACTION}`, { errorsComponent: errorsComponent });

        return false
      },
      isStateOrdering: function () {
        return this.order.orderState === 'ORDERING';
      },
      isStateNotOrdering: function () {
        return this.order.orderState !== 'ORDERING';
      }
    },
    computed: {
      ...mapState("orderView", [
        "order",
        "groupedEntries",
        "allEatingPeopleCount",
        "basePriceSum",
        "totalPrice",
        "approxTimeOfDelivery",
      ])
    },
    components: {
      WithSpinner,
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
    max-width: 1000px;
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