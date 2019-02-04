<template>
  <div class="wrapper">
    <template v-if="this.loadingEntry === false">
      <errors-component/>

      <div>
        <order-entry-form></order-entry-form>

        <v-btn color="success" block @click="submitForm">
          Update order
        </v-btn>
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
  import ErrorsComponent from '../commons/Errors.vue'
  import Spinner from '../commons/Spinner.vue'
  import Price from '../commons/PriceElement.vue'

  import OrderEntryForm from './OrderEntryForm.vue'
  import SideDishesInput from './SideDishesInput.vue'
  import {mapState} from "vuex"
  import {
    UPDATE_ORDER_ENTRY_ACTION,
    CANCEL_DISH_ENTRY_MODIFICATION,
    SETUP_EDIT_ORDER_ENTRY_ACTION,
    SET_ENTRY_LOADING_TRUE,
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
      this.$store.dispatch(`${NAMESPACE_MODIFY_ORDER_ENTRY}/${SETUP_EDIT_ORDER_ENTRY_ACTION}`, {dishEntry: this.dishEntry})
    },
    methods: {
      submitForm(e) {
        e.preventDefault();

        this.$store.dispatch(`${NAMESPACE_MODIFY_ORDER_ENTRY}/${UPDATE_ORDER_ENTRY_ACTION}`, {orderEntryId: this.orderEntry.id});

        return false;
      },
    },
    computed: {
      ...mapState(NAMESPACE_MODIFY_ORDER_ENTRY, [
        "loadingEntry",
      ]),
    },
    components: {
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
