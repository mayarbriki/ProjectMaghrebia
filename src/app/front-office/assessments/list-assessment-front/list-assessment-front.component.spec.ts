import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAssessmentComponentFront } from './list-assessment-front.component';

describe('ListAssessmentComponent', () => {
  let component: ListAssessmentComponentFront;
  let fixture: ComponentFixture<ListAssessmentComponentFront>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListAssessmentComponentFront]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListAssessmentComponentFront);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
