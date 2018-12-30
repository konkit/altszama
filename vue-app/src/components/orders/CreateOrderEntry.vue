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
        <order-entry-form></order-entry-form>

        <side-dishes-input></side-dishes-input>

        <div class="form-group">
          <h4>Additional Comments</h4>
          <textarea class="form-control" :value="additionalComments" @input="[UPDATE_ADDITIONAL_COMMENTS]($event.target.value)"></textarea>
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

  import OrderEntryForm from './OrderEntryForm.vue'
  import SideDishesInput from './SideDishesInput.vue'
  import {
    SAVE_ORDER_ENTRY_ACTION,
    CANCEL_ENTRY_CREATE_OR_EDIT,
  } from "../../store/modules/ShowOrderState";
  import {INIT_EDITED_ORDER, SET_ENTRY_LOADING_FALSE, SET_ENTRY_LOADING_TRUE, UPDATE_ADDITIONAL_COMMENTS} from "../../store/modules/ModifyOrderEntryState";
  import {mapState, mapMutations, mapGetters} from "vuex"

  export default {
    name: 'create-order-entry',
    data() {
      return {}
    },
    created() {
      this.$store.commit(`modifyOrderEntry/${SET_ENTRY_LOADING_TRUE}`)
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

      this.$store.commit(`modifyOrderEntry/${INIT_EDITED_ORDER}`, newEditedOrderEntry);
      this.$store.commit(`modifyOrderEntry/${SET_ENTRY_LOADING_FALSE}`)
    },
    methods: {
      submitForm (e) {
        e.preventDefault();

        this.$store.dispatch(`showOrder/${SAVE_ORDER_ENTRY_ACTION}`, {
          orderId: this.order.id,
          editedOrderEntry: this.editedOrderEntry
        });

        return false;
      },
      cancelEdit () {
        this.$store.commit(`showOrder/${CANCEL_ENTRY_CREATE_OR_EDIT}`, {})
      },
      ...mapMutations("modifyOrderEntry", [
        UPDATE_ADDITIONAL_COMMENTS
      ])
    },
    computed: {
      ...mapGetters("modifyOrderEntry", [
        "editedOrderEntry"
      ]),
      ...mapState("modifyOrderEntry", [
        "loadingEntry",

        "orderId",
        "dishId",
        "additionalComments",
        "newDish",
        "newDishName",
        "newDishPrice",
        "chosenSideDishes",
      ]),
      ...mapState("showOrder", [
        "order",
        "allDishesInRestaurant"
      ]),
    },
    components: {
      BackButton,
      ErrorsComponent,
      Price,
      Spinner,
      OrderEntryForm,
      SideDishesInput
    }
  }
</script>

<style scoped>
  .wrapper {
    margin-bottom: 30px;
  }
</style>
