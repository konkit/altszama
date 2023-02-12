import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteRestaurantConfirmModalComponent } from './delete-restaurant-confirm-modal.component';

describe('DeleteRestaurantConfirmModalComponent', () => {
  let component: DeleteRestaurantConfirmModalComponent;
  let fixture: ComponentFixture<DeleteRestaurantConfirmModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteRestaurantConfirmModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteRestaurantConfirmModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
