import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {AllOrdersOrderDto} from "../../../../frontend-client";
import {map, Observable} from "rxjs";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {MatPaginator, MatPaginatorModule} from "@angular/material/paginator";
import {MatTableDataSource, MatTableModule} from "@angular/material/table";
import {ViewWrapperComponent} from '../../../components/view-wrapper/view-wrapper.component';

@Component({
    selector: 'app-all-orders-view',
    templateUrl: './all-orders-view.component.html',
    styleUrls: ['./all-orders-view.component.scss'],
    standalone: true,
    imports: [ViewWrapperComponent, MatTableModule, RouterLink, MatPaginatorModule]
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
