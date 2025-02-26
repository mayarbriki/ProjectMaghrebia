import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyAssessmentComponent } from './modify-assessment.component';

describe('ModifyAssessmentComponent', () => {
  let component: ModifyAssessmentComponent;
  let fixture: ComponentFixture<ModifyAssessmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModifyAssessmentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModifyAssessmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
