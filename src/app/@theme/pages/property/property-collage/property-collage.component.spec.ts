import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyCollageComponent } from './property-collage.component';

describe('PropertyCollageComponent', () => {
  let component: PropertyCollageComponent;
  let fixture: ComponentFixture<PropertyCollageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PropertyCollageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PropertyCollageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
