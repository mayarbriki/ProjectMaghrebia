import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TravelPropertyFormComponent } from './travel-property-form.component';

describe('TravelPropertyFormComponent', () => {
  let component: TravelPropertyFormComponent;
  let fixture: ComponentFixture<TravelPropertyFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TravelPropertyFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TravelPropertyFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
