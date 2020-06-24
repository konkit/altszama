<template>
  <div>
    <template v-if="this.loadingEntry === false">
      <errors-component/>

      <div class="form-wrapper">
        <order-entry-form></order-entry-form>

        <v-spacer></v-spacer>

        <v-btn color="success" @click="submitForm">
          Submit
        </v-btn>

        <v-btn @click="cancelEdit()">
          Cancel
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
  import ErrorsComponent from '../../../commons/Errors.vue'
  import Spinner from '../../../commons/Spinner.vue'

  import OrderEntryForm from './OrderEntryForm.vue'
  import {mapState} from "vuex"
  import {
    CANCEL_DISH_ENTRY_MODIFICATION,
    NAMESPACE_MODIFY_ORDER_ENTRY,
    SET_ENTRY_LOADING_TRUE,
    SETUP_EDIT_ORDER_ENTRY_ACTION,
    UPDATE_ORDER_ENTRY_ACTION
  } from "../../../../store/modules/ModifyOrderEntryState";

  export default {
    name: 'edit-order-entry',
    props: ['index', 'orderEntry', 'dishEntry'],
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
      cancelEdit() {
        this.$store.commit(`${NAMESPACE_MODIFY_ORDER_ENTRY}/${CANCEL_DISH_ENTRY_MODIFICATION}`, {})
      },
    },
    computed: {
      ...mapState(NAMESPACE_MODIFY_ORDER_ENTRY, [
        "loadingEntry",
      ]),
    },
    components: {
      ErrorsComponent,
      Spinner,
      OrderEntryForm,
    }
  }

</script>

<style scoped>
  .form-wrapper {
    padding-top: 9px;
  }
</style>
