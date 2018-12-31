<template>
  <div class="wrapper">
    <template v-if="this.loadingEntry === false">
      <errors-component/>

      <div class="pull-right">
        <button type="button" class="btn btn-light" @click="cancelEdit()">
          Cancel
        </button>
      </div>

      <div>
        <order-entry-form></order-entry-form>

        <side-dishes-input></side-dishes-input>

        <div class="form-group">
          <h4>Additional Comments</h4>
          <textarea class="form-control" :value="additionalComments"
                    @input="[UPDATE_ADDITIONAL_COMMENTS]($event.target.value)"></textarea>
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

  import OrderEntryForm from './OrderEntryForm.vue'
  import SideDishesInput from './SideDishesInput.vue'
  import {
    NAMESPACE_SHOW_ORDER
  } from "../../store/modules/ShowOrderState";
  import {mapState, mapMutations} from "vuex"
  import {
    EDIT_ORDER_ENTRY_ACTION,
    CANCEL_ENTRY_CREATE_OR_EDIT,
    INIT_EDIT_ORDER_ENTRY_ACTION,
    SET_ENTRY_LOADING_TRUE,
    UPDATE_ADDITIONAL_COMMENTS,
    NAMESPACE_MODIFY_ORDER_ENTRY
  } from "../../store/modules/ModifyOrderEntryState";

  export default {
    name: 'edit-order-entry',
    props: ['orderEntry', 'dishEntry'],
    data() {
      return {}
    },
    created() {
      this.$store.commit(`${NAMESPACE_MODIFY_ORDER_ENTRY}/${SET_ENTRY_LOADING_TRUE}`)
    },
    mounted() {
      this.$store.dispatch(`${NAMESPACE_MODIFY_ORDER_ENTRY}/${INIT_EDIT_ORDER_ENTRY_ACTION}`, {dishEntry: this.dishEntry})
    },
    methods: {
      submitForm(e) {
        e.preventDefault();

        this.$store.dispatch(`${NAMESPACE_MODIFY_ORDER_ENTRY}/${EDIT_ORDER_ENTRY_ACTION}`, {orderEntryId: this.orderEntry.id});

        return false;
      },
      cancelEdit() {
        this.$store.commit(`${NAMESPACE_MODIFY_ORDER_ENTRY}/${CANCEL_ENTRY_CREATE_OR_EDIT}`, {})
      },
      ...mapMutations(NAMESPACE_MODIFY_ORDER_ENTRY, [
        UPDATE_ADDITIONAL_COMMENTS
      ])
    },
    computed: {
      ...mapState(NAMESPACE_MODIFY_ORDER_ENTRY, [
        "loadingEntry",

        "orderId",
        "dishId",
        "additionalComments",
        "newDish",
        "newDishName",
        "newDishPrice",
        "chosenSideDishes",
      ]),
      ...mapState(NAMESPACE_SHOW_ORDER, [
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
