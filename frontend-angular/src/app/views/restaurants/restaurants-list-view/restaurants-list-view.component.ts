import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {map, Observable} from "rxjs";
import {IndexResponse, RestaurantInfo} from "../../../../frontend-client";
import {FrontendConfigService} from "../../../service/frontend-config.service";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {MatTableDataSource, MatTableModule} from "@angular/material/table";
import {MatPaginator, MatPaginatorModule} from "@angular/material/paginator";
import {RelativeDatePipe} from '../../../components/pipes/date-to-rel.pipe';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {AsyncPipe, NgIf} from '@angular/common';
import {ViewWrapperComponent} from '../../../components/view-wrapper/view-wrapper.component';

@Component({
    selector: 'app-restaurants-list-view',
    templateUrl: './restaurants-list-view.component.html',
    styleUrls: ['./restaurants-list-view.component.scss'],
    standalone: true,
    imports: [ViewWrapperComponent, NgIf, MatButtonModule, RouterLink, MatIconModule, MatTableModule, MatPaginatorModule, AsyncPipe, RelativeDatePipe]
})
export class RestaurantsListViewComponent implements OnInit, AfterViewInit {
  indexResponse$: Observable<IndexResponse>;

  displayedColumns: string[] = ['name', 'dishCount', 'lastCrawled', 'lastEdited'];

  dataSource = new MatTableDataSource<RestaurantInfo>()

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private frontendConfigService: FrontendConfigService,
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
