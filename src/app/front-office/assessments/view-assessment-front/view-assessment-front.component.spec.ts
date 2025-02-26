import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAssessmentComponentFront } from './view-assessment-front.component';

describe('ViewAssessmentComponent', () => {
  let component: ViewAssessmentComponentFront;
  let fixture: ComponentFixture<ViewAssessmentComponentFront>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewAssessmentComponentFront]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewAssessmentComponentFront);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
