<template>
  <div class="show-order-entry-wrapper">
    <v-list>
      <v-list-item>
        <v-list-item-content>
          <div class="dish-name-and-edit-buttons">
            <div class="dish-name-text">
              {{ dishEntry.dishName }}
            </div>

            <div class="dish-price">
              (
              <price :data-price="dishEntry.price"/>
              )
            </div>

            <div class="edit-buttons" v-if="(isOrderEntryOwner(orderEntry)) && order.orderState === 'CREATED'">
              <v-btn text icon @click="editDishEntry()">
                <i class="fa fa-pencil" aria-hidden="true"></i>
              </v-btn>

              <v-btn text icon @click="deleteDishEntry()">
                <i class="fa fa-times" aria-hidden="true"></i>
              </v-btn>
            </div>
          </div>
        </v-list-item-content>
      </v-list-item>

      <template v-for="sideDish in dishEntry.sideDishes">
        <v-list-item>
          <v-list-item-content>
            <div class="side-dish-name-and-price">
              <div class="side-dish-name">
                + {{sideDish.name}}
              </div>

              <div class="side-dish-price"> &nbsp; (
                <price :data-price="sideDish.price"/>
                )
              </div>
            </div>
          </v-list-item-content>
        </v-list-item>
      </template>

      <template v-if="dishEntry.comments.length > 0">
        <v-list-item>
          <v-list-item-content>
            <div class="dish-comments py-2">
              Additional comments: {{dishEntry.comments}}
            </div>
          </v-list-item-content>
        </v-list-item>
      </template>
    </v-list>


    <!--<div class="dish-name-and-edit-buttons">-->
    <!--<div class="dish-name-text">-->
    <!--{{ dishEntry.dishName }}-->
    <!--</div>-->

    <!--<div class="dish-price">-->
    <!--(-->
    <!--<price :data-price="dishEntry.price"/>-->
    <!--)-->
    <!--</div>-->

    <!--<div class="edit-buttons" v-if="(isOrderEntryOwner(orderEntry)) && order.orderState === 'CREATED'">-->
    <!--<v-btn text icon @click="editDishEntry()">-->
    <!--<i class="fa fa-pencil" aria-hidden="true"></i>-->
    <!--</v-btn>-->

    <!--<v-btn text icon @click="deleteDishEntry()">-->
    <!--<i class="fa fa-times" aria-hidden="true"></i>-->
    <!--</v-btn>-->
    <!--</div>-->
    <!--</div>-->

    <!--<div class="side-dishes">-->
    <!--<div v-for="sideDish in dishEntry.sideDishes" class="side-dish-name py-2">-->
    <!--+ {{sideDish.name}} (-->
    <!--<price :data-price="sideDish.price"/>-->
    <!--)-->
    <!--</div>-->

    <!--<div v-if="dishEntry.comments.length > 0" class="dish-comments py-2">-->
    <!--Additional comments: {{dishEntry.comments}}-->
    <!--</div>-->
    <!--</div>-->
  </div>
</template>

<script>
  import Price from '../../../commons/PriceElement.vue'
  import {
    CONFIRM_ORDER_ENTRY_AS_PAID_ACTION,
    MARK_ORDER_ENTRY_AS_PAID_ACTION,
    DELETE_DISH_ENTRY_ACTION,
    NAMESPACE_SHOW_ORDER
  } from "../../../../store/modules/ShowOrderState";
  import {NAMESPACE_MODIFY_ORDER_ENTRY, SET_DISH_ENTRY_EDITING} from "../../../../store/modules/ModifyOrderEntryState";
  import {mapState} from "vuex";

  export default {
    name: 'show-order-entry',
    props: ['index', 'orderEntry', 'dishEntry', 'currentUserId'],
    methods: {
      isOrderOwner() {
        return this.order.orderCreatorId === this.currentUserId
      },
      isOrderEntryOwner(orderEntry) {
        return orderEntry.userId === this.currentUserId
      },
      shouldShowMarkAsPaidButton(orderEntry) {
        return (this.order.orderState !== 'CREATED' && this.order.orderState !== 'ORDERING' && (orderEntry.paymentStatus !== "MARKED" && orderEntry.paymentStatus !== "CONFIRMED") && this.isOrderOwner() === false)
      },
      shouldShowConfirmAsPaidButton(orderEntry) {
        return (this.order.orderState !== 'CREATED' && this.order.orderState !== 'ORDERING' && orderEntry.paymentStatus !== "CONFIRMED" && this.isOrderOwner() === true)
      },
      paymentStatus(orderEntry) {
        if (orderEntry.paymentStatus === "UNPAID") {
          return "Unpaid"
        } else if (orderEntry.paymentStatus === "MARKED") {
          return "Marked as paid"
        } else if (orderEntry.paymentStatus === "CONFIRMED") {
          return "Payment confirmed"
        } else {
          return orderEntry.paymentStatus
        }
      },
      confirmAsPaid(orderEntryId) {
        this.$store.dispatch(`${NAMESPACE_SHOW_ORDER}/${CONFIRM_ORDER_ENTRY_AS_PAID_ACTION}`, {orderEntryId: orderEntryId})
      },
      markAsPaid(orderEntryId) {
        this.$store.dispatch(`${NAMESPACE_SHOW_ORDER}/${MARK_ORDER_ENTRY_AS_PAID_ACTION}`, {orderEntryId: orderEntryId})
      },
      editDishEntry() {
        this.$store.commit(`${NAMESPACE_MODIFY_ORDER_ENTRY}/${SET_DISH_ENTRY_EDITING}`, {
          orderEntryId: this.orderEntry.id,
          dishEntryId: this.dishEntry.id
        })
      },
      deleteDishEntry() {
        this.$store.dispatch(`${NAMESPACE_SHOW_ORDER}/${DELETE_DISH_ENTRY_ACTION}`, {
          orderEntryId: this.orderEntry.id,
          dishEntryId: this.dishEntry.id
        });
      },
    },
    computed: {
      ...mapState(NAMESPACE_SHOW_ORDER, [
        "order"
      ])
    },
    components: {
      Price
    }
  }
</script>

<style scoped>
  .dish-name-and-edit-buttons {
    display: flex;
    flex-direction: row;
    max-width: 100%;
    line-height: 36px;
  }

  .dish-name-text {
    display: block;
    min-width: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .dish-price {
    white-space: nowrap;
    padding-left: 5px;
  }

  .side-dish-name-and-price {
    max-width: 100%;
    display: flex;
    flex-direction: row;
  }

  .side-dish-name {
    margin-top: 0;
    margin-bottom: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
  }

  .side-dish-price {
    white-space: nowrap;
  }

  p.dish-comments {
    margin-top: 0;
    margin-bottom: 0;
    font-size: 10pt;
    color: #444444;

    overflow: hidden;
    text-overflow: ellipsis;
  }

  .show-order-entry-wrapper {
    max-width: 100%;
  }

  .edit-buttons {
    min-width: 72px;
  }

  .side-dishes {
    padding-left: 10px;
  }
</style>
