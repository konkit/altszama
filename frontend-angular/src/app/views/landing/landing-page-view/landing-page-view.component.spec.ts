import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingPageViewComponent } from './landing-page-view.component';

describe('LandingPageViewComponent', () => {
  let component: LandingPageViewComponent;
  let fixture: ComponentFixture<LandingPageViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LandingPageViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LandingPageViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
