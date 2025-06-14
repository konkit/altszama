import { Component } from '@angular/core';
import { ShowRestaurantResponse } from '../../../../frontend-client';
import { filter, Observable } from 'rxjs';
import { RestaurantFormService } from './service/restaurant-form.service';
import { isNotNull } from '../../../lib/utils';
import { RestaurantEditorState } from './service/restaurant-editor-state';
import { DishEntryComponent } from './components/dish-entry/dish-entry.component';
import { EditDishFormComponent } from './components/edit-dish-form/edit-dish-form.component';
import { CreateDishFormComponent } from './components/create-dish-form/create-dish-form.component';
import { MatDividerModule } from '@angular/material/divider';
import { EditRestaurantFormComponent } from './components/edit-restaurant-form/edit-restaurant-form.component';
import { RestaurantDetailsComponent } from './components/restaurant-details/restaurant-details.component';
import { ViewWrapperComponent } from '../../../components/view-wrapper/view-wrapper.component';
import { AsyncPipe, KeyValuePipe } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { MatCard, MatCardContent, MatCardHeader, MatCardModule } from '@angular/material/card';


@Component({
    selector: 'app-show-restaurant-view',
    templateUrl: './show-restaurant-view.component.html',
    styleUrls: ['./show-restaurant-view.component.scss'],
    standalone: true,
  imports: [ViewWrapperComponent, MatCardModule, RestaurantDetailsComponent, EditRestaurantFormComponent, MatDividerModule, CreateDishFormComponent, EditDishFormComponent, DishEntryComponent, AsyncPipe, KeyValuePipe, MatButton, MatIcon, RouterLink, MatCard, MatCardContent, MatCardHeader]
})
export class ShowRestaurantViewComponent {

  restaurant$: Observable<ShowRestaurantResponse>

  restaurantState$: Observable<RestaurantEditorState>


  constructor(private restaurantFormService: RestaurantFormService) {
    this.restaurant$ = this.restaurantFormService.loadedRestaurantData.asObservable().pipe(filter(isNotNull));
    this.restaurantState$ = this.restaurantFormService.editorStateSubject.asObservable()
  }

  editRestaurant(restaurantId: string) {
    this.restaurantFormService.setRestaurantAsEdited(restaurantId)
  }

  deleteRestaurant(restaurantId: string) {
    this.restaurantFormService.deleteRestaurant(restaurantId)
  }

  createDish() {
    this.restaurantFormService.setDishAsCreated()
  }
}
