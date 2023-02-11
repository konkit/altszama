import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteDishConfirmModalComponent } from './delete-dish-confirm-modal.component';

describe('DeleteDishConfirmModalComponent', () => {
  let component: DeleteDishConfirmModalComponent;
  let fixture: ComponentFixture<DeleteDishConfirmModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteDishConfirmModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteDishConfirmModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
