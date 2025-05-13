import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyMobileDetailComponent } from './property-mobile-detail.component';

describe('PropertyMobileDetailComponent', () => {
  let component: PropertyMobileDetailComponent;
  let fixture: ComponentFixture<PropertyMobileDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PropertyMobileDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PropertyMobileDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
