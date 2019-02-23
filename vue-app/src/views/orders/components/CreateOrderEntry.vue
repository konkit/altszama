<template>
  <div class="wrapper">
    <template v-if="this.loadingEntry === false">
      <errors-component/>

      <div>
        <order-entry-form></order-entry-form>

        <v-spacer></v-spacer>

        <v-btn color="success" @click="submitForm">
          Save order
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
    import ErrorsComponent from '../../commons/Errors.vue'
    import Spinner from '../../commons/Spinner.vue'
    import Price from '../../commons/PriceElement.vue'

    import OrderEntryForm from './OrderEntryForm.vue'
    import SideDishesInput from './SideDishesInput.vue'
    import {NAMESPACE_SHOW_ORDER} from "../../../store/modules/ShowOrderState";
    import {
        NAMESPACE_MODIFY_ORDER_ENTRY,
        CANCEL_DISH_ENTRY_MODIFICATION,
        SAVE_ORDER_ENTRY_ACTION,
        SETUP_CREATE_ORDER_ENTRY_ACTION,
        SET_ENTRY_LOADING_FALSE,
        SET_ENTRY_LOADING_TRUE,
    } from "../../../store/modules/ModifyOrderEntryState";
    import {mapState} from "vuex"

    export default {
        name: 'create-order-entry',
        data() {
            return {}
        },
        created() {
            this.$store.commit(`${NAMESPACE_MODIFY_ORDER_ENTRY}/${SET_ENTRY_LOADING_TRUE}`)
        },
        mounted() {
            this.$store.dispatch(`${NAMESPACE_MODIFY_ORDER_ENTRY}/${SETUP_CREATE_ORDER_ENTRY_ACTION}`);
            this.$store.commit(`${NAMESPACE_MODIFY_ORDER_ENTRY}/${SET_ENTRY_LOADING_FALSE}`)
        },
        methods: {
            submitForm(e) {
                e.preventDefault();

                this.$store.dispatch(`${NAMESPACE_MODIFY_ORDER_ENTRY}/${SAVE_ORDER_ENTRY_ACTION}`);

                return false;
            },
            cancelEdit() {
                this.$store.commit(`${NAMESPACE_MODIFY_ORDER_ENTRY}/${CANCEL_DISH_ENTRY_MODIFICATION}`, {})
            },
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
