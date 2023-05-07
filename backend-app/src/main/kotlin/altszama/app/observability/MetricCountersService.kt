package altszama.app.observability


import io.micrometer.core.instrument.Counter
import io.micrometer.core.instrument.Metrics
import org.springframework.stereotype.Service

@Service
class MetricCountersService() {

  var importedDishesCounter: Counter = Metrics.counter("altszama.restaurantimport.dishes.count")
  var importedRestaurantsCounter: Counter = Metrics.counter("altszama.restaurantimport.restaurants.count")
  var createdOrdersCounter: Counter = Metrics.counter("altszama.order.created.count")
  var createdOrderEntryCounter: Counter = Metrics.counter("altszama.orderentry.created.count")

}
