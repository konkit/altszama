<template>
  <div class="wrapper">
    <div class="pull-right">
      <div v-if="isOrderEntryOwner(orderEntry) || isOrderOwner(order)">

        <div v-if="(isOrderEntryOwner(orderEntry)) && order.orderState === 'CREATED'">
          <button type="button" class="btn btn-light" @click="editEntry(orderEntry.id, dishEntry.id)">
            <i class="fa fa-pencil" aria-hidden="true" />
          </button>

          <button type="button" class="btn btn-danger" @click="deleteEntry(orderEntry.id, dishEntry.id)">
            <i class="fa fa-times" aria-hidden="true" />
          </button>
        </div>

        <div v-if="(isOrderEntryOwner(orderEntry) || isOrderOwner(order)) && (order.orderState === 'ORDERED' || order.orderState === 'DELIVERED')" >
          {{paymentStatus(orderEntry)}}
        </div>

        <div v-if="shouldShowMarkAsPaidButton(orderEntry)">
          <button type="button" class="btn btn-success" @click="markAsPaid(orderEntry.id)">
            Mark as paid
          </button>
        </div>

        <div v-if="shouldShowConfirmAsPaidButton(orderEntry)">
          <button type="button" class="btn btn-success" @click="confirmAsPaid(orderEntry.id)">
            Confirm as paid
          </button>
        </div>

      </div>
    </div>

    <div>
      <p class="dish-name">
        {{dishEntry.dish.name}} (<price :data-price="dishEntry.price"/>)
      </p>
      <p v-for="sideDish in dishEntry.sideDishes" class="side-dish-name">
        + {{sideDish.name}} (<price :data-price="sideDish.price" />)
      </p>
      <p v-if="dishEntry.comments.length > 0" class="dish-comments">Additional comments: {{dishEntry.comments}}</p>
    </div>
  </div>
</template>

<script>
import Price from '../../commons/priceElement.vue'
import ApiConnector from '../../../ApiConnector.js'

export default {
  name: 'order-entry-row',
  props: ['order', 'orderEntry', 'dishEntry', 'currentUserId', 'isEntryEdited'],
  methods: {
    createEntryLink: function(orderId) {
      return '#/orders/' + orderId + '/create_entry'
    },
    isOrdering: function() {
      return this.order.orderState === 'ORDERING';
    },
    isOrderOwner: function() {
      return this.order.orderCreator.id == this.currentUserId
    },
    isOrderEntryOwner: function(orderEntry) {
      return orderEntry.user.id === this.currentUserId
    },
    shouldShowMarkAsPaidButton: function(orderEntry) {
      return (this.order.orderState != 'CREATED' && this.order.orderState != 'ORDERING' && (orderEntry.paymentStatus != "MARKED" && orderEntry.paymentStatus != "CONFIRMED") && this.isOrderOwner() == false)
    },
    shouldShowConfirmAsPaidButton: function(orderEntry) {
      return (this.order.orderState != 'CREATED' && this.order.orderState != 'ORDERING' && orderEntry.paymentStatus != "CONFIRMED" && this.isOrderOwner() == true)
    },
    paymentStatus: function(orderEntry) {
      if (orderEntry.paymentStatus == "UNPAID") {
        return "Unpaid"
      } else if (orderEntry.paymentStatus == "MARKED") {
        return "Marked as paid"
      } else if (orderEntry.paymentStatus == "CONFIRMED") {
        return "Payment confirmed"
      } else {
        return orderEntry.paymentStatus
      }
    },
    confirmAsPaid: function(orderEntryId) {
      ApiConnector.makeGet('/order_entries/' + orderEntryId + '/confirm_as_paid')
        .then(successResponse => window.location.reload())
        .catch(errResponse => console.log(errResponse) );
    },
    markAsPaid: function(orderEntryId) {
      ApiConnector.makeGet('/order_entries/' + orderEntryId + '/mark_as_paid')
        .then(successResponse => window.location.reload())
        .catch(errResponse => console.log(errResponse) );
    },
    deleteEntry: function(orderEntryId, dishEntryId) {
      this.$emit("deleteEntry", orderEntryId, dishEntryId);
    },
    createEntry: function() {
      this.$emit("createEntry");
    },
    editEntry: function(orderEntryId, dishEntryId) {
      this.$emit("editEntry", orderEntryId, dishEntryId);
    },
    cancelEdit: function() {
      this.$emit("cancelEdit");
    },
    userColumnRowSpan: function(order, orderEntry) {
      if ((this.isOrderEntryOwner(orderEntry) ) && this.isEntryEdited == false) {
        return orderEntry.dishEntries.length + 2;
      } else {
        return orderEntry.dishEntries.length + 1;
      }
    }
  },
  components: {
    Price
  }
}
</script>

<style scoped>
  .container {
    max-width: 1000px;
  }

  .row {
    margin-top: 2rem;
  }

  .price-column {
    min-width: 94px;
  }

  .names-person {
    width: 250px;
  }

  .actions-column {
    width: 108px;
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

  .wrapper {
    margin-bottom: 50px;
  }
</style>
