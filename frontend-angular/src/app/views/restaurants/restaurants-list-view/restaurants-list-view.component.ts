import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { map, Observable, take } from 'rxjs';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Clipboard } from '@angular/cdk/clipboard';
import { AsyncPipe } from '@angular/common';
import { RelativeDatePipe } from '../../../components/pipes/date-to-rel.pipe';
import { ViewWrapperComponent } from '../../../components/view-wrapper/view-wrapper.component';
import { IndexResponse, RestaurantInfo } from '../../../../frontend-client';
import { FrontendConfigService } from '../../../service/frontend-config.service';

@Component({
  selector: 'app-restaurants-list-view',
  templateUrl: './restaurants-list-view.component.html',
  styleUrls: ['./restaurants-list-view.component.scss'],
  standalone: true,
  imports: [ViewWrapperComponent, MatButtonModule, MatExpansionModule, MatTooltipModule, RouterLink, MatIconModule, MatTableModule, MatPaginatorModule, AsyncPipe, RelativeDatePipe]
})
export class RestaurantsListViewComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['name', 'dishCount', 'lastCrawled', 'lastEdited'];

  dataSource = new MatTableDataSource<RestaurantInfo>();

  hasAnyRestaurants = false
  apiKey = ""
  isApiKeyVisible = false

  swaggerUrl$: Observable<string>

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private frontendConfigService: FrontendConfigService,
              private route: ActivatedRoute,
              private clipboard: Clipboard,
              private snackBar: MatSnackBar) {
    this.swaggerUrl$ = this.frontendConfigService.getConfig().pipe(
      map(config => config.currentDomain + '/api/swagger-ui/index.html?configUrl=/api/swagger/swagger-config')
    )
  }

  ngOnInit() {
    this.route.data.pipe(take(1)).subscribe(data => {
      const response: IndexResponse = data['response']
      this.dataSource.data = response.restaurants
      this.hasAnyRestaurants = response.restaurants.length > 0
      this.apiKey = response.importCredentials?.apiKey ?? ""
    })
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  toggleApiKeyVisibility() {
    this.isApiKeyVisible = !this.isApiKeyVisible
  }

  copyApiKey() {
    if (this.clipboard.copy(this.apiKey)) {
      this.snackBar.open("API key copied", undefined, {duration: 2000})
    }
  }
}
