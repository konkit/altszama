import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowOrderViewComponent } from './show-order-view.component';

describe('ShowOrderViewComponent', () => {
  let component: ShowOrderViewComponent;
  let fixture: ComponentFixture<ShowOrderViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowOrderViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowOrderViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
