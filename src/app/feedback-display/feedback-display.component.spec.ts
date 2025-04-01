import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackDisplayComponent } from './feedback-display.component';

describe('FeedbackDisplayComponent', () => {
  let component: FeedbackDisplayComponent;
  let fixture: ComponentFixture<FeedbackDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeedbackDisplayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeedbackDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
