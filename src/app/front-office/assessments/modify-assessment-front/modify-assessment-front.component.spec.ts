import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyAssessmentFrontComponent } from './modify-assessment-front.component';

describe('ModifyAssessmentFrontComponent', () => {
  let component: ModifyAssessmentFrontComponent;
  let fixture: ComponentFixture<ModifyAssessmentFrontComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModifyAssessmentFrontComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModifyAssessmentFrontComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
