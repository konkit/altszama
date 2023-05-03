import {ComponentFixture, TestBed} from '@angular/core/testing';

import {OrderLockedWarningBannerComponent} from './order-locked-warning-banner.component';

describe('OrderLockedWarningBannerComponent', () => {
  let component: OrderLockedWarningBannerComponent;
  let fixture: ComponentFixture<OrderLockedWarningBannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderLockedWarningBannerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderLockedWarningBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
