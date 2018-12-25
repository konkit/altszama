import Vue from 'vue'
import store from '../store'
import router from '../router'
import GoogleLogin from './GoogleLogin.js'

var currentDomain = location.protocol+'//'+location.hostname+(location.port ? ':'+location.port: '');
var backendUrl = process.env.VUE_APP_BACKEND_URL || currentDomain;

var pushNotificationEnabled = false;

export default {
  getPushNotificationEnabled: () => pushNotificationEnabled,

  setPushNotificationEnabled: (newVal) => pushNotificationEnabled = newVal,
  
  getBackendUrl: () => backendUrl,
  
  loginWithGoogle: (returnPath = "") => {
    return new Promise((resolve, reject) => {
      GoogleLogin.signIn()
        .then((authCode) => {
          var authUrl = backendUrl + '/auth/authorizationCode?authCode=' + encodeURIComponent(authCode);

          return Vue.http.get(authUrl).then(response => {
            store.commit('loginUser', {username: response.body.username, token: response.body.token})
    
            if (returnPath.length > 0) {
              console.log("Moving to custom path")
              router.push({path: returnPath})
            } else {
              console.log("Moving to default path")
              router.push({name: 'TodayOrders'})
            }

            resolve()
          })
        })
        .catch((error) => {
          if( error.status === 0) {
            reject("Connection error!!")
          } else if( typeof error.error !== "undefined" ) {
            reject(error.error)
          } else {
            reject(error)
          }
        })
    })
  },

  makeGet: function(relPath) {
    this.token = store.state.token;
    return Vue.http.get(backendUrl + relPath, headersWithToken(this.token))
  },

  makePost: function(relPath, formData) {
    this.token = store.state.token;
    return Vue.http.post(backendUrl + relPath, formData, headersWithToken(this.token))
  },

  saveOrderEntry: function(orderId, editedOrderEntry) {
    const action = "/order_entries/save";

    let formData = {
      orderId: orderId,
      dishId: editedOrderEntry.dishId,
      newDish: editedOrderEntry.newDish,
      newDishName: editedOrderEntry.newDishName,
      newDishPrice: Math.round(editedOrderEntry.newDishPrice * 100),
      additionalComments: editedOrderEntry.additionalComments,
      sideDishes: editedOrderEntry.chosenSideDishes.map(sd => Object.assign(sd, {newSideDishPrice: Math.round(sd.newSideDishPrice * 100)}))
    };

    return this.makePost(action, formData)
  },

  editOrderEntry: function(orderId, orderEntryId, editedOrderEntry) {
    const action = "/order_entries/update";

    let formData = {
      id: orderEntryId,
      orderId: orderId,
      dishEntryId: editedOrderEntry.id,
      dishId: editedOrderEntry.dishId,
      newDish: editedOrderEntry.newDish,
      newDishName: editedOrderEntry.newDishName,
      newDishPrice: Math.round(editedOrderEntry.newDishPrice * 100),
      additionalComments: editedOrderEntry.additionalComments,
      sideDishes: editedOrderEntry.chosenSideDishes.map(sd => Object.assign({}, sd, {newSideDishPrice: Math.round(sd.newSideDishPrice * 100)}))
    };

    return this.makePost(action, formData)
  },

  fetchOrder: function(orderId) {
    return this.makeGet("/orders/" + orderId + "/show.json")
      .then(response => {
        return {
          order: response.data.order,
          orderEntries: response.data.orderEntries,
          currentUserId: response.data.currentUserId,
          allDishesInRestaurant: response.data.allDishesInRestaurant,
          allDishesByCategory: convertToMapEntries(response.data.allDishesByCategory),
          dishIdToSideDishesMap: response.data.dishIdToSideDishesMap,
          totalOrderPrice: response.data.totalOrderPrice
        };
      })
  },

  fetchAllOrders: function() {
    return this.makeGet("/orders/all.json")
      .then(response => {
          return response.data.allOrdersList;
      })
  },

  fetchTodaysOrders: function() {
    return this.makeGet("/orders.json")
      .then(response => {
        return {
          currentOrderEntries: response.data.currentOrderEntries,
          createdOrders: response.data.createdOrders,
          orderingOrders: response.data.orderingOrders,
          orderedOrders: response.data.orderedOrders,
          deliveredOrders: response.data.deliveredOrders
        }
      })
  },

  fetchOrderView: function(orderId) {
    return this.makeGet("/orders/" + orderId + "/order_view.json")
        .then(response => {
          return {
            order: response.data.order,
            groupedEntries: response.data.groupedEntries,
            allEatingPeopleCount: response.data.allEatingPeopleCount,
            basePriceSum: response.data.basePriceSum,
            totalPrice: response.data.totalPrice
          }
        })
  },

  getOrderCreateData: function() {
    return this.makeGet("/orders/create.json")
        .then(response => {
          this.restaurantsList = response.data.restaurantsList;

          var restaurantId;
          if( response.data.restaurant != null) {
            restaurantId = response.data.restaurant.id
          } else {
            restaurantId = response.data.restaurantsList[0].id;
          }

          return {
            restaurantsList: response.data.restaurantsList,
            order: {
              restaurantId: restaurantId,
              orderDate: response.data.orderDate,
              timeOfOrder: response.data.timeOfOrder,

              decreaseInPercent: 0,
              deliveryCostPerEverybody: 0,
              deliveryCostPerDish: 0,
              paymentByCash: true,
              paymentByBankTransfer: false,
              bankTransferNumber: ''
            }
          }
        });
  },

  getOrderEditData: function(orderId) {
    return this.makeGet("/orders/" + orderId + "/edit.json")
        .then(response => {
          var restaurantId;
          if (response.data.order.restaurant != null) {
            restaurantId = response.data.order.restaurant.id
          } else {
            restaurantId = response.data.restaurantsList[0].id;
          }

          return {
            restaurantsList: response.data.restaurantsList,
            order: {
              restaurantId: restaurantId,
              orderDate: response.data.order.orderDate,
              timeOfOrder: response.data.order.timeOfOrder,
              decreaseInPercent: response.data.order.decreaseInPercent,
              deliveryCostPerEverybody: response.data.order.deliveryCostPerEverybody / 100,
              deliveryCostPerDish: response.data.order.deliveryCostPerDish / 100,
              paymentByCash: response.data.order.paymentByCash,
              paymentByBankTransfer: response.data.order.paymentByBankTransfer,
              bankTransferNumber: response.data.order.bankTransferNumber
            }
          }
        })
  },

  getRestaurantEditData: function(restaurantId) {
    return this.makeGet("/restaurants/" + restaurantId + "/edit.json")
        .then(response => {
          return {
            id: response.data.id,
            url: response.data.url,
            name: response.data.name,
            rating: response.data.rating,
            telephone: response.data.telephone,
            address: response.data.address
          }
        })
  },

  getShowRestaurantData: function(restaurantId) {
    return this.makeGet("/restaurants/" + restaurantId + "/show.json")
        .then(response => {
          return {
            restaurant: response.data.restaurant,
            dishes: response.data.dishes,
            dishesByCategory: convertToMapEntries(response.data.dishesByCategory)
          }
        })
  },

  editDish: function(restaurantId, dishObj) {
    const action = "/restaurants/" + restaurantId + "/dishes/update";

    var formData = {
      "restaurant.id": restaurantId,
      id: dishObj.dishId,
      name: dishObj.name,
      price: dishObj.price,
      category: dishObj.category,
      sideDishes: dishObj.sideDishes
    };

    return this.makePost(action, formData)
  },

  getDishCreateData: function(restaurantId) {
    return this.makeGet("/restaurants/" + restaurantId + "/dishes/create.json")
  },

  getDishEditData: function(restaurantId, dishId) {
    return this.makeGet("/restaurants/" + restaurantId + "/dishes/" + dishId + "/edit.json")
        .then(response => {
          return {
            name: response.data.dish.name,
            price: response.data.dish.price / 100,
            category: response.data.dish.category,
            initialSideDishes: response.data.dish.sideDishes,
            categories: response.data.categories,
          }
        })
  },

  deleteDish: function(restaurantId, dishId) {
    return this.makeGet("/restaurants/" + restaurantId + "/dishes/" + dishId + "/delete")
  },

  deleteDishEntry: function(orderEntryId, dishEntryId) {
    return this.makeGet('/order_entries/' + orderEntryId + '/dish_entry/' + dishEntryId + '/delete')
  },

  setOrderAsCreated: function(orderId) {
    return this.makeGet('/orders/' + orderId + '/set_as_created')
  },

  setOrderAsOrdered: function(orderId) {
    return this.makeGet('/orders/' + orderId + '/set_back_as_ordered')
  },

  setOrderAsDelivered: function(orderId) {
    return this.makeGet('/orders/' + orderId + '/set_as_delivered')
  },

  setOrderAsRejected: function(orderId) {
    return this.makeGet('/orders/' + orderId + '/set_as_rejected')
  },

  deleteOrder: function(orderId) {
    return this.makeGet('/orders/' + orderId + '/delete')
  },

  markOrderEntryAsPaid: function(orderEntryId) {
    return this.makeGet('/order_entries/' + orderEntryId + '/mark_as_paid')
  },

  confirmOrderEntryAsPaid: function(orderEntryId) {
    return this.makeGet('/order_entries/' + orderEntryId + '/confirm_as_paid')
  },

  getRestaurants: function() {
    return this.makeGet("/restaurants.json")
      .then(response => {
        return {
          restaurants: response.data.restaurants,
          restaurantToDishesMap: response.data.restaurantToDishesMap
        }
      })
  },

  deleteRestaurant: function(restaurantId) {
    return this.makeGet("/restaurants/" + restaurantId + "/delete")
  },

  createDish: function(restaurantId, formData) {
    const action = "/restaurants/" + restaurantId + "/dishes/save";

    return this.makePost(action, formData)
  },

  createOrder: function(order, token) {
    let action = "/orders/save";

    let formData = {
      restaurantId: order.restaurantId,
      orderDate: order.orderDate,
      timeOfOrder: order.timeOfOrder,
      decreaseInPercent: order.decreaseInPercent,
      deliveryCostPerEverybody: Math.round(order.deliveryCostPerEverybody * 100),
      deliveryCostPerDish: Math.round(order.deliveryCostPerDish * 100),
      paymentByCash: order.paymentByCash === true,
      paymentByBankTransfer: order.paymentByBankTransfer === true,
      bankTransferNumber: order.bankTransferNumber
    };

    return this.makePost(action, formData, {'headers': {'Authorization': 'Bearer ' + token}})
  },

  editOrder: function(orderId, order) {
    let action = "/orders/update";

    let formData = {
      orderId: orderId,
      restaurantId: order.restaurantId,
      orderDate: order.orderDate,
      timeOfOrder: order.timeOfOrder,
      decreaseInPercent: order.decreaseInPercent,
      deliveryCostPerEverybody: Math.round(order.deliveryCostPerEverybody * 100),
      deliveryCostPerDish: Math.round(order.deliveryCostPerDish * 100),
      paymentByCash: order.paymentByCash === true,
      paymentByBankTransfer: order.paymentByBankTransfer === true,
      bankTransferNumber: order.bankTransferNumber,
    };

    return this.makePost(action, formData)
  },

  createRestaurant: function(restaurant) {
    const action = "/restaurants/save";

    return this.makePost(action, restaurant)
  },

  editRestaurant: function(restaurantId, restaurant) {
    const action = "/restaurants/update";

    let formData = {
      "restaurant.id": restaurantId,
      id: restaurant.id,
      name: restaurant.name,
      rating: restaurant.rating,
      telephone: restaurant.telephone,
      address: restaurant.address,
      url: restaurant.url
    };

    return this.makePost(action, formData)
  },

  makeAnOrder: function (orderId, approxTimeOfDelivery) {
    let action = '/orders/' + orderId + '/set_as_ordered';

    let formData = {
      approxTimeOfDelivery: approxTimeOfDelivery.toString()
    };

    return this.makePost(action, formData)
  },

  handleError: function(errorResponse) {
    console.log("errorResponse: ", errorResponse);

    if (errorResponse.status === 401) {
      var fullRoutePath = router.currentRoute.fullPath
      console.log("Current path", fullRoutePath)

      store.commit("logoutUser")

      pushNotificationEnabled = false;

      console.log("401 Unauthorized")
      var signOutCallback = () => router.push({name: 'Login', query: { returnPath: fullRoutePath } })
      GoogleLogin.signOut(signOutCallback, signOutCallback)
    }
  },

  initializePushNotifications: function() {
    if (this.getPushNotificationEnabled() === false) {
      if ('serviceWorker' in navigator) {
        console.log("Initialise state");
        this.initialiseState();
      } else {
        console.warn('Service workers are not supported in this browser.');
      }

      this.setPushNotificationEnabled(true)
    }
  },

  initialiseState: function() {
    console.log("Initialise state")

    if (!('showNotification' in ServiceWorkerRegistration.prototype)) {
      console.warn('Notifications aren\'t supported.');
      return;
    }

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
          this.subscribe();

          return;
        }

        // Update the server state with the new subscription
        this.sendSubscriptionToServer(subscription);
      })
        .catch(function (err) {
          // Handle the error - show a notification in the GUI
          console.warn('Error during getSubscription()', err);
        });
    });
  },

  subscribe: function () {
    navigator.serviceWorker.ready.then(function (serviceWorkerRegistration) {

      serviceWorkerRegistration.pushManager.subscribe({userVisibleOnly: true}).then(function (subscription) {

        // Update the server state with the new subscription
        return this.sendSubscriptionToServer(subscription);
      })
        .catch(function (e) {
          if (Notification.permission === 'denied') {
            console.warn('Permission for Notifications was denied');
          } else {
            console.error('Unable to subscribe to push.', e);
          }
        });
    });
  },

  sendSubscriptionToServer: function(subscription) {
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

    var url = this.getBackendUrl() + '/notification/subscribe'
    var authToken = localStorage.getItem("token")

    console.log("Sending info to backend to address : " + url + ", token: " + authToken)

    this.makePost('/notification/subscribe', subscribeData)

    console.log("Subscribe data", subscribeData);
  },

  logout: function() {
    doLogout()
  }
}

function headersWithToken(token) {
  return { 'headers': {'Authorization': 'Bearer ' + token } }
}

function doLogout() {
  store.commit("logoutUser")

  pushNotificationEnabled = false;

  var signOutCallback = () => router.push({name: 'Login'})
  GoogleLogin.signOut(signOutCallback, signOutCallback)
}

function convertToMapEntries(dishesMap) {
  var result = [];

  for (const key of Object.keys(dishesMap)) {
    result.push({"category": key, "dishes": dishesMap[key]})
  }

  return result;
}