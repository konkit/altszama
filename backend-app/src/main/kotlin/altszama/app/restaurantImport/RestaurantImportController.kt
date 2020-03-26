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

  @PostMapping("/restaurantImportFromPayload")
  fun handlePayload(@RequestBody restaurantJsonString: String): ResponseEntity<String> {
    val restaurantData = objectMapper.readValue<RestaurantImportJson>(restaurantJsonString)

    service.createFromJson(restaurantData)

    return ResponseEntity("{}", HttpStatus.CREATED)
  }

}