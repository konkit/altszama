import {Component, OnInit} from '@angular/core';
import {RestaurantControllerService, ShowRestaurantResponse} from "../../../../frontend-client";
import {ActivatedRoute, Router} from "@angular/router";
import {EMPTY, filter, Observable, switchMap, take, tap} from "rxjs";
import {faAdd, faPencil, faTimes} from "@fortawesome/free-solid-svg-icons";
import * as moment from "moment";
import {NonNullableFormBuilder} from "@angular/forms";
import {RestaurantEditorState, RestaurantFormService} from "./service/restaurant-form.service";
import {isNotNull} from "../../../lib/utils";
import {MatDialog} from "@angular/material/dialog";
import {DialogService} from "../../../service/dialog.service";


@Component({
  selector: 'app-show-restaurant-view',
  templateUrl: './show-restaurant-view.component.html',
  styleUrls: ['./show-restaurant-view.component.scss']
})
export class ShowRestaurantViewComponent implements OnInit {

  restaurant$: Observable<ShowRestaurantResponse>
  editedDishId$: Observable<string>;

  restaurantState$: Observable<RestaurantEditorState>

  faPencil = faPencil;
  faTimes = faTimes;
  faAdd = faAdd;
  RestaurantEditorState = RestaurantEditorState


  constructor(private restaurantControllerService: RestaurantControllerService,
              private router: Router,
              private fb: NonNullableFormBuilder,
              private restaurantFormService: RestaurantFormService,
              private dialogService: DialogService,
              private dialog: MatDialog,
              private route: ActivatedRoute) {
    this.restaurant$ = this.restaurantFormService.showRestaurantResponse.asObservable().pipe(filter(isNotNull));
    this.restaurantState$ = this.restaurantFormService.editorStateSubject.asObservable()
    this.editedDishId$ = this.restaurantFormService.editedDishId.asObservable()
  }

  ngOnInit() {

  }

  onRefresh() {
    let restaurantId = this.route.snapshot.paramMap.get('id');
    this.restaurantFormService.refresh(restaurantId!)
  }

  editRestaurant() {
    this.restaurantFormService.setEditorState(RestaurantEditorState.EDITING_RESTAURANT)
  }

  deleteRestaurant() {
    this.dialogService.displayDeleteDialog("Are you sure you want to delete this restaurant?")
      .afterClosed()
      .pipe(
        switchMap(confirmed => {
          if (confirmed) {
            return this.restaurant$.pipe(
              take(1),
              switchMap(payload => {
                let restaurantId = payload.restaurant.id;

                return this.restaurantControllerService.deleteRestaurant(restaurantId)
                  .pipe(tap(() => {
                    this.router.navigate(['/restaurants/'], {onSameUrlNavigation: "reload"})
                  }))
              })
            )
          } else {
            return EMPTY;
          }
        })
      )
      .subscribe()
  }

  createDish() {
    this.restaurantFormService.setEditorState(RestaurantEditorState.CREATING_DISH)
  }

  onDishCreateCancel() {
    this.restaurantFormService.setEditorState(RestaurantEditorState.IDLE)
  }

  onDishCreateSucceded() {
    this.onRefresh()
  }
}
