import { AfterViewInit, Component, OnInit, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { take } from 'rxjs/operators';
import { AsyncPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { ViewWrapperComponent } from '../../../components/view-wrapper/view-wrapper.component';
import { ChipComponent, ChipTone } from '../../../components/chip/chip.component';
import { AllOrdersOrderDto, AllOrdersResponse } from '../../../../frontend-client';
import { orderStateToCaption, orderStateToTone } from '../lib/orderState';
import { formatOrderDate } from '../lib/orderDate';
import OrderStateEnum = AllOrdersOrderDto.OrderStateEnum;

@Component({
  selector: 'app-all-orders-view',
  imports: [
    ViewWrapperComponent,
    ChipComponent,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatListModule,
    RouterLink,
    AsyncPipe,
  ],
  templateUrl: './all-orders-view.component.html',
  styleUrl: './all-orders-view.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: true
})
export class AllOrdersViewComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['orderDate', 'restaurantName', 'orderState', 'orderCreatorUsername'];

  dataSource = new MatTableDataSource<AllOrdersOrderDto>();
  // Current page after sorting, used by the phone layout
  visibleRows$ = this.dataSource.connect();

  hasAnyOrders = false

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.dataSource.sortingDataAccessor = (order, column) => {
      switch (column) {
        case 'orderState': return orderStateToCaption(order.orderState)
        default: return (order as any)[column] ?? ""
      }
    }

    this.route.data.pipe(take(1)).subscribe(data => {
      const response: AllOrdersResponse = data['response']
      this.dataSource.data = response.allOrdersList
      this.hasAnyOrders = response.allOrdersList.length > 0
    })
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  creatorLabel(order: AllOrdersOrderDto): string {
    return order.createdByCurrentUser ? "you" : order.orderCreatorUsername
  }

  formatDate(isoDate: string): string {
    return formatOrderDate(isoDate)
  }

  getOrderStateString(orderState: OrderStateEnum): string {
    return orderStateToCaption(orderState)
  }

  getOrderStateTone(orderState: OrderStateEnum): ChipTone {
    return orderStateToTone(orderState)
  }
}
