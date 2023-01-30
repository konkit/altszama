import {Component} from '@angular/core';
import {map, Observable} from "rxjs";
import {IndexResponse, RestaurantControllerService, RestaurantInfo} from "../../../../frontend-client";
import {FrontendConfigService} from "../../../service/frontend-config.service";
import {faUpload} from "@fortawesome/free-solid-svg-icons";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-restaurants-list-view',
  templateUrl: './restaurants-list-view.component.html',
  styleUrls: ['./restaurants-list-view.component.scss']
})
export class RestaurantsListViewComponent {
  indexResponse$: Observable<IndexResponse>;

  faUpload = faUpload

  constructor(private restaurantControllerService: RestaurantControllerService,
              private frontendConfigService: FrontendConfigService,
              private route: ActivatedRoute) {
    this.indexResponse$ = this.route.data.pipe(
      map(r => r['response'])
    )
  }


  getSwaggerUrl(): Observable<string> {
    return this.frontendConfigService.getConfig().pipe(map(config => {
      return config.currentDomain + "/api/swagger-ui/index.html?configUrl=/api/swagger/swagger-config"
    }))
  }
}
