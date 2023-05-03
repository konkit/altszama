import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MakeAnOrderViewComponent } from './make-an-order-view.component';

describe('MakeAnOrderViewComponent', () => {
  let component: MakeAnOrderViewComponent;
  let fixture: ComponentFixture<MakeAnOrderViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MakeAnOrderViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MakeAnOrderViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
