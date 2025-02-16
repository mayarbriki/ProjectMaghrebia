import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JoboffersComponent } from './joboffers.component';

describe('JoboffersComponent', () => {
  let component: JoboffersComponent;
  let fixture: ComponentFixture<JoboffersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JoboffersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JoboffersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
