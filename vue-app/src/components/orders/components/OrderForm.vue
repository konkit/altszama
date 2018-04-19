<template>
  <form>
    <div class="row justify-content-center">
      <div class="col">
        <div class="form-group">
          <label for="restaurant">Restaurant: </label>
          <select id="restaurant" class="form-control" name="restaurantId"  v-model="order.restaurantId">
            <option v-for="restaurant in this.restaurantsList" :key="restaurant.id" :value="restaurant.id">
              <span>{{restaurant.name}}</span>
            </option>
          </select>
        </div>
      </div>
    </div>

    <div class="row justify-content-center">
      <div class="col-4">
        <h3>Order time</h3>

        <div class="form-group">
          <label for="orderDate">Order date</label>
          <input type="date" id="orderDate" name="orderDate" class="form-control" v-model="order.orderDate" />
        </div>

        <div class="form-group">
          <label for="timeOfOrder">Time of order</label>
          <masked-input type="text" class="form-control" v-model="order.timeOfOrder" :mask="[/\d/,/\d/,':',/\d/,/\d/]" :keepCharPositions="true" />
        </div>
      </div>

      <div class="col-4">
        <h3>Price change</h3>

        <div class="form-group">
          <label for="decreaseInPercent">Price decrease (in percent)</label>
          <vue-numeric currency="%" :min="0" :max="100" currency-symbol-position="suffix" decimal-precision="false" id="decreaseInPercent" class="form-control" v-model="order.decreaseInPercent" />
        </div>

        <div class="form-group">
          <label for="deliveryCostPerEverybody">Delivery cost (total)</label>
          <vue-numeric currency="zł" separator="." currency-symbol-position="suffix" v-model="order.deliveryCostPerEverybody" v-bind:precision="2" class="form-control" required="" id="deliveryCostPerEverybody"></vue-numeric>
        </div>

        <div class="form-group">
          <label for="deliveryCostPerDish">Delivery cost (per dish)</label>
          <vue-numeric currency="zł" separator="." currency-symbol-position="suffix" v-model="order.deliveryCostPerDish" v-bind:precision="2" class="form-control" required="" id="deliveryCostPerDish"></vue-numeric>
        </div>
      </div>

      <div class="col-4">
        <h3>Payment</h3>

        <b-form-group label="Payment by cash">
          <b-form-radio-group
                    buttons
                    v-model="order.paymentByCash"
                    button-variant="outline-primary"
                    :options="yesNoOptions" />
        </b-form-group>

        <b-form-group label="Payment by bank transfer">
          <b-form-radio-group
                    buttons
                    v-model="order.paymentByBankTransfer"
                    button-variant="outline-primary"
                    :options="yesNoOptions" />
        </b-form-group>

        <div class="form-group" v-if="order.paymentByBankTransfer">
          <label>Bank transfer number</label>
          <input type="text" id="bankTransferNumber" name="bankTransferNumber" class="form-control" v-model="order.bankTransferNumber" />
        </div>
      </div>
    </div>
  </form> 
</template>

<script>
import MaskedInput from 'vue-text-mask'

export default {
  props: {
    order: {
      type: Object
    },
    restaurantsList: {
      type: Array
    }
  },
  data () {
    return {
      yesNoOptions: [
        { text: 'Yes', value: true },
        { text: 'No', value: false },
      ]
    }
  },
  components: {
    MaskedInput,
  }
}
</script>
