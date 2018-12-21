<template>
  <div>
    <div v-if="this.loading === true">
      <spinner></spinner>
    </div>

    <div v-if="this.loading === false">
      <div class="jumbotron lunch-bg-img">
        <div class="container">
          <div class="row justify-content-center">
            <div class="col">
              <h2>So today you ordered ...</h2>

              <div v-if="this.results.currentOrderEntries.length > 0">
                <template v-for="orderEntry in this.results.currentOrderEntries">
                  <template v-for="dishEntry in orderEntry.dishEntries">
                    <p class="pointer" @click="goToOrder(orderEntry.order.id)" :key="dishEntry.id">
                      <b>{{dishEntry.dish.name}}</b>
                      from
                      <b>{{dishEntry.dish.restaurant.name}}</b>
                      (STATUS: {{orderEntry.order.orderState}})
                    </p>
                  </template>
                </template>
              </div>
              <div v-else>
                <div>
                  <p>... nothing yet.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="container">
        <div class="row justify-content-center">
          <div class="col">

            <a href="#/orders/create" class="btn btn-success pull-right">Create new order &nbsp;<i class="fa fa-plus"
                                                                                                   aria-hidden="true"></i></a>

            <h1>Orders today:</h1>

          </div>
        </div>

        <div class="row justify-content-center">
          <div class="col">
            <h3>Not ordered yet ({{ this.results.createdOrders.length }})</h3>

            <div v-if="this.results.createdOrders.length > 0">
              <table class="table table-hover">
                <thead>
                <tr>
                  <th>Restaurant</th>
                  <th>Who will order?</th>
                </tr>
                </thead>

                <tbody>
                <tr v-on:click="goToOrder(order.id)" v-for="order in this.results.createdOrders" v-bind:key="order.id"
                    class="pointer">
                  <td>{{order.restaurant.name}}</td>
                  <td>{{order.orderCreator.username}}</td>
                </tr>
                </tbody>
              </table>
            </div>

            <div v-else>
              <p>No orders.</p>
            </div>

          </div>
        </div>

        <div class="row justify-content-center">
          <div class="col">
            <h3>Ordering right now ({{ this.results.orderingOrders.length }})</h3>

            <div v-if="this.results.orderingOrders.length > 0">
              <table class="table table-hover">
                <thead>
                <tr>
                  <th>Restaurant</th>
                  <th>Who will order?</th>
                </tr>
                </thead>

                <tbody>
                <tr v-on:click="goToOrder(order.id)" v-for="order in this.results.orderingOrders" v-bind:key="order.id"
                    class="pointer">
                  <td>{{order.restaurant.name}}</td>
                  <td>{{order.orderCreator.username}}</td>
                </tr>
                </tbody>
              </table>
            </div>

            <div v-else>
              <p>No orders.</p>
            </div>

          </div>
        </div>

        <div class="row justify-content-center">
          <div class="col">
            <h3>Ordered ({{ this.results.orderedOrders.length }})</h3>

            <div v-if="this.results.orderedOrders.length > 0">
              <table class="table table-hover">
                <thead>
                <tr>
                  <th>Restaurant</th>
                  <th>Who will order?</th>
                </tr>
                </thead>

                <tbody>
                <tr @click="goToOrder(order.id)" v-for="order in this.results.orderedOrders" v-bind:key="order.id"
                    class="pointer">
                  <td>{{order.restaurant.name}}</td>
                  <td>{{order.orderCreator.username}}</td>
                </tr>
                </tbody>
              </table>
            </div>

            <div v-else>
              <p>No orders.</p>
            </div>

          </div>
        </div>

        <div class="row justify-content-center">
          <div class="col">
            <h3>Delivered ({{ this.results.deliveredOrders.length }})</h3>

            <div v-if="this.results.deliveredOrders.length > 0">
              <table class="table table-hover">
                <thead>
                <tr>
                  <th>Restaurant</th>
                  <th>Who will order?</th>
                </tr>
                </thead>

                <tbody>
                <tr v-on:click="goToOrder(order.id)" v-for="order in this.results.deliveredOrders" v-bind:key="order.id"
                    class="pointer">
                  <td>{{order.restaurant.name}}</td>
                  <td>{{order.orderCreator.username}}</td>
                </tr>
                </tbody>
              </table>
            </div>

            <div v-else>
              <p>No orders.</p>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
    import Vue from 'vue'
    import Spinner from '../commons/spinner.vue'

    import ApiConnector from '../../ApiConnector.js'

    export default {
        data() {
            return {
                results: {}
            }
        },
        created() {
            this.$store.commit('setLoadingTrue')
        },
        mounted() {
            initPushNotifications();

            ApiConnector.makeGet("/orders.json")
                .then(response => {
                    this.results = response.data;
                    this.$store.commit('setLoadingFalse')
                })
                .catch(errResponse => ApiConnector.handleError(errResponse))
        },
        methods: {
            goToOrder: function (selectedOrderId) {
                location = "#/orders/show/" + selectedOrderId
            }
        },
        computed: {
            loading() {
                return this.$store.state.loading;
            }
        },
        components: {
            Spinner
        }
    }


    /**
     * Step one: run a function on load (or whenever is appropriate for you)
     * Function run on load sets up the service worker if it is supported in the
     * browser. Requires a serviceworker in a `sw.js`. This file contains what will
     * happen when we receive a push notification.
     * If you are using webpack, see the section below.
     */
    function initPushNotifications() {
        if (ApiConnector.getPushNotificationEnabled() == false) {
            if ('serviceWorker' in navigator) {
                console.log("Initialise state")
                initialiseState();
            } else {
                console.warn('Service workers are not supported in this browser.');
            }

            ApiConnector.setPushNotificationEnabled(true)
        }
    }

    /**
     * Step two: The serviceworker is registered (started) in the browser. Now we
     * need to check if push messages and notifications are supported in the browser
     */
    function initialiseState() {
        console.log("Initialise state")

        // Check if desktop notifications are supported
        if (!('showNotification' in ServiceWorkerRegistration.prototype)) {
            console.warn('Notifications aren\'t supported.');
            return;
        }

        // Check if user has disabled notifications
        // If a user has manually disabled notifications in his/her browser for
        // your page previously, they will need to MANUALLY go in and turn the
        // permission back on. In this statement you could show some UI element
        // telling the user how to do so.
        if (Notification.permission === 'denied') {
            console.warn('The user has blocked notifications.');
            return;
        }

        // Check is push API is supported
        if (!('PushManager' in window)) {
            console.warn('Push messaging isn\'t supported.');
            return;
        }

        navigator.serviceWorker.ready.then(function (serviceWorkerRegistration) {
            // Get the push notification subscription object
            serviceWorkerRegistration.pushManager.getSubscription().then(function (subscription) {

                // If this is the user's first visit we need to set up
                // a subscription to push notifications
                if (!subscription) {
                    subscribe();

                    return;
                }

                // Update the server state with the new subscription
                sendSubscriptionToServer(subscription);
            })
                .catch(function (err) {
                    // Handle the error - show a notification in the GUI
                    console.warn('Error during getSubscription()', err);
                });
        });
    }

    /**
     * Step three: Create a subscription. Contact the third party push server (for
     * example mozilla's push server) and generate a unique subscription for the
     * current browser.
     */
    function subscribe() {
        navigator.serviceWorker.ready.then(function (serviceWorkerRegistration) {

            // Contact the third party push server. Which one is contacted by
            // pushManager is  configured internally in the browser, so we don't
            // need to worry about browser differences here.
            //
            // When .subscribe() is invoked, a notification will be shown in the
            // user's browser, asking the user to accept push notifications from
            // <yoursite.com>. This is why it is async and requires a catch.
            serviceWorkerRegistration.pushManager.subscribe({userVisibleOnly: true}).then(function (subscription) {

                // Update the server state with the new subscription
                return sendSubscriptionToServer(subscription);
            })
                .catch(function (e) {
                    if (Notification.permission === 'denied') {
                        console.warn('Permission for Notifications was denied');
                    } else {
                        console.error('Unable to subscribe to push.', e);
                    }
                });
        });
    }

    /**
     * Step four: Send the generated subscription object to our server.
     */
    function sendSubscriptionToServer(subscription) {
        console.log("Sending subscription to backend")

        // Get public key and user auth from the subscription object
        var key = subscription.getKey ? subscription.getKey('p256dh') : '';
        var auth = subscription.getKey ? subscription.getKey('auth') : '';

        var subscribeData = JSON.stringify({
            endpoint: subscription.endpoint,
            // Take byte[] and turn it into a base64 encoded string suitable for
            // POSTing to a server over HTTP
            p256dhKey: key ? btoa(String.fromCharCode.apply(null, new Uint8Array(key))) : '',
            authKey: auth ? btoa(String.fromCharCode.apply(null, new Uint8Array(auth))) : ''
        })

        var url = ApiConnector.getBackendUrl() + '/notification/subscribe'
        var authToken = localStorage.getItem("token")

        console.log("Sending info to backend to address : " + url + ", token: " + authToken)

        ApiConnector.makePost('/notification/subscribe', subscribeData)

        console.log("Subscribe data", subscribeData);
    }

</script>

<style scoped>
  .container {
    max-width: 900px;
  }

  .pointer {
    cursor: pointer;
  }

  .row {
    margin-top: 2rem;
  }

  .lunch-bg-img {
    background-image: url('./../../assets/lunch-bw.png');
    -webkit-background-size: cover;
    -moz-background-size: cover;
    -o-background-size: cover;
    background-size: cover;
    background-position: 0% 72%;
    /* min-height: 300px; */
  }
</style>