import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResidencePropertyFormComponent } from './residence-property-form.component';

describe('ResidencePropertyFormComponent', () => {
  let component: ResidencePropertyFormComponent;
  let fixture: ComponentFixture<ResidencePropertyFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResidencePropertyFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResidencePropertyFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
