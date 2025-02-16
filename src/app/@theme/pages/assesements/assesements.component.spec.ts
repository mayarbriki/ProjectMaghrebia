import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssesementsComponent } from './assesements.component';

describe('AssesementsComponent', () => {
  let component: AssesementsComponent;
  let fixture: ComponentFixture<AssesementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssesementsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssesementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
