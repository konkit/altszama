import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs/operators';
import { ViewWrapperComponent } from '../../../components/view-wrapper/view-wrapper.component';
import { AllOrdersOrderDto } from '../../../../frontend-client';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-all-orders-view',
  imports: [
    ViewWrapperComponent,
    MatTableModule,
    MatPaginatorModule,
    RouterLink,
    MatCardModule,
  ],
  templateUrl: './all-orders-view.component.html',
  styleUrl: './all-orders-view.component.scss',
  standalone: true
})
export class AllOrdersViewComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['orderDate', 'restaurantName', 'orderState', 'orderCreatorUsername'];

  allOrders$: Observable<AllOrdersOrderDto[]>;
  dataSource = new MatTableDataSource<AllOrdersOrderDto>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private route: ActivatedRoute) {
    this.allOrders$ = this.route.data.pipe(map(r => r['response'].allOrdersList))
  }

  ngOnInit() {
    this.allOrders$.subscribe(allOrders => {
      console.log(this.dataSource)
      this.dataSource.data = allOrders;
    })
  }

  ngAfterViewInit(): void {
    console.log(this.paginator)
    this.dataSource.paginator = this.paginator;
  }

}
