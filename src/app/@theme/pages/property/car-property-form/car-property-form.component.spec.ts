import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarPropertyFormComponent } from './car-property-form.component';

describe('CarPropertyFormComponent', () => {
  let component: CarPropertyFormComponent;
  let fixture: ComponentFixture<CarPropertyFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarPropertyFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarPropertyFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
