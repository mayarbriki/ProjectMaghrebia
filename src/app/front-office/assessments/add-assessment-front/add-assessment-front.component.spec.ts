import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAssessmentFrontComponent } from './add-assessment-front.component';

describe('AddAssessmentFrontComponent', () => {
  let component: AddAssessmentFrontComponent;
  let fixture: ComponentFixture<AddAssessmentFrontComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddAssessmentFrontComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddAssessmentFrontComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
