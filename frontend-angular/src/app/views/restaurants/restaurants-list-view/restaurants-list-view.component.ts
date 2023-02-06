import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {map, Observable} from "rxjs";
import {IndexResponse, RestaurantControllerService, RestaurantInfo} from "../../../../frontend-client";
import {FrontendConfigService} from "../../../service/frontend-config.service";
import {faUpload, faPlus} from "@fortawesome/free-solid-svg-icons";
import {ActivatedRoute} from "@angular/router";
import {DataSource} from "@angular/cdk/collections";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";

@Component({
  selector: 'app-restaurants-list-view',
  templateUrl: './restaurants-list-view.component.html',
  styleUrls: ['./restaurants-list-view.component.scss']
})
export class RestaurantsListViewComponent implements OnInit, AfterViewInit {
  indexResponse$: Observable<IndexResponse>;

  faUpload = faUpload
  faPlus = faPlus;

  displayedColumns: string[] = ['name', 'dishCount', 'lastCrawled', 'lastEdited'];

  dataSource = new MatTableDataSource<RestaurantInfo>()

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private restaurantControllerService: RestaurantControllerService,
              private frontendConfigService: FrontendConfigService,
              private route: ActivatedRoute) {
    this.indexResponse$ = this.route.data.pipe(
      map(r => r['response'])
    )
  }

  ngOnInit() {
    this.indexResponse$.subscribe(response => {
      this.dataSource.data = response.restaurants;
    })
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  getSwaggerUrl(): Observable<string> {
    return this.frontendConfigService.getConfig().pipe(map(config => {
      return config.currentDomain + "/api/swagger-ui/index.html?configUrl=/api/swagger/swagger-config"
    }))
  }
}
