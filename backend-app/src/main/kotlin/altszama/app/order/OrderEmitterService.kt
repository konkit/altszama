package altszama.app.order

import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter
import java.util.concurrent.CopyOnWriteArrayList
import java.util.concurrent.Executors
import java.util.function.Consumer


@Service
class OrderEmitterService {

  private val logger = LoggerFactory.getLogger(OrderEmitterService::class.java)

  private var nonBlockingService = Executors.newCachedThreadPool()

  private val emittersList: MutableList<SseEmitter> = CopyOnWriteArrayList()

  fun emitOrderEntryChanged(orderId: String) {
    val event = SseEmitter.event()
      .data("""{"name": "orderEntryChanged", "orderId": "${orderId}"}""")

    emitEvent(event)
  }

  private fun emitEvent(event: SseEmitter.SseEventBuilder) {
    nonBlockingService.execute {
      val failedEmitters: MutableList<SseEmitter> = ArrayList()
      emittersList.forEach(Consumer { emitter: SseEmitter ->
        try {
          logger.info("Emitting event")
          emitter.send(event)
        } catch (e: Exception) {
          logger.info("Error emitting event", e)
          emitter.completeWithError(e)
          failedEmitters.add(emitter)
        }
      })
      emittersList.removeAll(failedEmitters)
    }
  }

  fun getEmitter(): SseEmitter {
    val emitter = SseEmitter()
    emittersList.add(emitter)

    emitter.onCompletion {
      logger.info("Emitter completed. Removing from queue.")
      emittersList.remove(emitter)
    }

    emitter.onTimeout {
      logger.info("Emitter timed out. Removing from queue")
      emitter.complete()
      emittersList.remove(emitter)
    }
    return emitter
  }

}

