<template>
  <div class="wrapper">
    <template v-if="this.loadingEntry === false">
      <errors-component ref="errorsComponent"/>

      <div class="pull-right">
        <button type="button" class="btn btn-light" @click="cancelEdit()">
          Cancel
        </button>
      </div>

      <div>
        <order-entry-input/>

        <side-dishes-input/>

        <div class="form-group">
          <h4>Additional Comments</h4>
          <textarea class="form-control" name="additionalComments" id="additionalComments"
                    v-model="editedOrderEntry.additionalComments"></textarea>
        </div>


        <button class="btn btn-block btn-success" @click="submitForm">
          Update order
        </button>
      </div>

    </template>

    <template v-if="this.loadingEntry === true">
      <div class="justify-content-center">
        <spinner></spinner>
      </div>
    </template>
  </div>
</template>

<script>
  import BackButton from '../commons/BackButton.vue'
  import ErrorsComponent from '../commons/Errors.vue'
  import Spinner from '../commons/Spinner.vue'
  import Price from '../commons/PriceElement.vue'

  import OrderEntryInput from './OrderEntryInput.vue'
  import SideDishesInput from './SideDishesInput.vue'
  import OrdersApiConnector from "../../lib/OrdersApiConnector";

  export default {
    name: 'order-entry-edit-entry',
    props: ['order', 'orderEntry', 'dishEntry'],
    data() {
      return {}
    },
    created() {
      this.$store.commit('setEntryLoadingTrue')
    },
    mounted() {
      var newEditedOrderEntry = {
        id: this.dishEntry.id,
        orderId: this.order.id,
        dishId: this.dishEntry.dish.id,
        additionalComments: this.dishEntry.additionalComments,
        newDish: false,
        newDishName: "",
        newDishPrice: "",
        chosenSideDishes: this.dishEntry.sideDishes || []
      };

      this.$store.commit('setEditedOrderEntry', newEditedOrderEntry);
      this.$store.commit('setEntryLoadingFalse');
    },
    methods: {
      submitForm: function (e) {
        e.preventDefault();

        let errorsComponent = this.$refs.errorsComponent;

        OrdersApiConnector.editOrderEntry(this.order.id, this.orderEntry.id, this.editedOrderEntry)
          .then(() => {
            this.$emit("updateOrder");
            this.$store.commit('cancelEntryCreateOrEdit', {})
          })
          .catch((error) => {
            console.log("OrderEntryEditEntry error:", error);
            error.body.messages.forEach(msg => errorsComponent.addError(msg));
          });

        return false;
      },
      cancelEdit: function () {
        this.$store.commit('cancelEntryCreateOrEdit', {})
      },
    },
    computed: {
      loadingEntry() {
        return this.$store.state.loadingEntry;
      },
      editedOrderEntry() {
        return this.$store.state.editedOrderEntry;
      }
    },
    components: {
      BackButton,
      ErrorsComponent,
      Price,
      Spinner,
      OrderEntryInput,
      SideDishesInput
    }
  }

</script>

<style scoped>
  .wrapper {
    margin-bottom: 30px;
  }
</style>
