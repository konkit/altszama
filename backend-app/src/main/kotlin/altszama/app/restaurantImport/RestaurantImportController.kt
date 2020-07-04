package altszama.app.restaurantImport

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile



@RestController
@RequestMapping("/api")
class RestaurantImportController {

  @Autowired
  private lateinit var objectMapper: ObjectMapper

  @Autowired
  private lateinit var service: RestaurantImportService

  @PostMapping("/restaurantImport")
  fun handleFileUpload(@RequestParam("file")file: MultipartFile): ResponseEntity<String> {
    val restaurantData = objectMapper.readValue<RestaurantImportJson>(String(file.bytes))

    service.createFromJson(restaurantData)

    return ResponseEntity("{}", HttpStatus.CREATED)
  }

  @PostMapping(
      value = ["/restaurantImportFromPayload"],
      consumes = ["application/json"],
      produces = ["application/json"]
  )
  fun handlePayload(@RequestBody restaurantData: RestaurantImportJson): ResponseEntity<String> {
    service.createFromJson(restaurantData)

    return ResponseEntity("{}", HttpStatus.CREATED)
  }

}