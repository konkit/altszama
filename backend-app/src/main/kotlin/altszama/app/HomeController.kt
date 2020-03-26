package altszama.app;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
class HomeController {

  @RequestMapping("/")
  fun home(): String {
    return "index.html"
  }

}
