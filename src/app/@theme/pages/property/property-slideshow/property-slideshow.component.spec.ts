import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertySlideshowComponent } from './property-slideshow.component';

describe('PropertySlideshowComponent', () => {
  let component: PropertySlideshowComponent;
  let fixture: ComponentFixture<PropertySlideshowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PropertySlideshowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PropertySlideshowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
