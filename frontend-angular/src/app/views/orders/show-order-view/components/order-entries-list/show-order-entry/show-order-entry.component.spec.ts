import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowOrderEntryComponent } from './show-order-entry.component';

describe('ShowOrderEntryComponent', () => {
  let component: ShowOrderEntryComponent;
  let fixture: ComponentFixture<ShowOrderEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowOrderEntryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowOrderEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
