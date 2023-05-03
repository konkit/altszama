import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewWrapperComponent } from './view-wrapper.component';

describe('ViewWrapperComponent', () => {
  let component: ViewWrapperComponent;
  let fixture: ComponentFixture<ViewWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewWrapperComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
