import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DishFormPlaceholderComponent } from './dish-form-placeholder.component';

describe('DishFormPlaceholderComponent', () => {
  let component: DishFormPlaceholderComponent;
  let fixture: ComponentFixture<DishFormPlaceholderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DishFormPlaceholderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DishFormPlaceholderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
