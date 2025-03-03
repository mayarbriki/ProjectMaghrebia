import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackAdminComponent } from './feedback-admin.component';

describe('FeedbackAdminComponent', () => {
  let component: FeedbackAdminComponent;
  let fixture: ComponentFixture<FeedbackAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeedbackAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeedbackAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
