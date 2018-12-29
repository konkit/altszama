<template>
  <div class="wrapper">
    <template v-if="this.loadingEntry === false">
      <div class="pull-right">
        <button type="button" class="btn btn-light" @click="cancelEdit()">
          Cancel
        </button>
      </div>

      <errors-component/>

      <div>
        <order-entry-input/>

        <side-dishes-input/>

        <div class="form-group">
          <h4>Additional Comments</h4>
          <textarea class="form-control" v-model="editedOrderEntry.additionalComments"></textarea>
        </div>

        <button class="btn btn-block btn-success" @click="submitForm">
          Save order
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
  import {
    SET_EDITED_ORDER_ENTRY,
    SAVE_ORDER_ENTRY_ACTION,
    CANCEL_ENTRY_CREATE_OR_EDIT,
    SET_ENTRY_LOADING_FALSE,
    SET_ENTRY_LOADING_TRUE
  } from "../../store/modules/ShowOrderState";
  import {mapState} from "vuex"

  export default {
    name: 'order-entry-create-entry',
    props: ['order'],
    data() {
      return {}
    },
    created() {
      this.$store.commit(`showOrder/${SET_ENTRY_LOADING_TRUE}`)
    },
    mounted() {
      let dishId;
      if (this.allDishesInRestaurant.length > 0) {
        dishId = this.allDishesInRestaurant[0].id;
      } else {
        dishId = null
      }

      const newEditedOrderEntry = {
        orderId: this.order.id,
        dishId: dishId,
        additionalComments: '',
        newDish: false,
        newDishName: "",
        newDishPrice: "",
        chosenSideDishes: []
      };

      this.$store.commit(`showOrder/${SET_EDITED_ORDER_ENTRY}`, newEditedOrderEntry);
      this.$store.commit(`showOrder/${SET_ENTRY_LOADING_FALSE}`)
    },
    methods: {
      submitForm: function (e) {
        e.preventDefault();

        this.$store.dispatch(`showOrder/${SAVE_ORDER_ENTRY_ACTION}`, {
          orderId: this.order.id,
          editedOrderEntry: this.editedOrderEntry
        });

        return false;
      },
      cancelEdit: function () {
        this.$store.commit(`showOrder/${CANCEL_ENTRY_CREATE_OR_EDIT}`, {})
      },
    },
    computed: {
      loadingEntry() {
        return this.$store.state.loadingEntry;
      },
      ...mapState("showOrder", [
        "allDishesInRestaurant",
        "editedOrderEntry"
      ]),
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
