import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorSnackBarComponent } from './error-snack-bar.component';

describe('ErrorSnackBarComponent', () => {
  let component: ErrorSnackBarComponent;
  let fixture: ComponentFixture<ErrorSnackBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ErrorSnackBarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ErrorSnackBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
