import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LifePropertyFormComponent } from './life-property-form.component';

describe('LifePropertyFormComponent', () => {
  let component: LifePropertyFormComponent;
  let fixture: ComponentFixture<LifePropertyFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LifePropertyFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LifePropertyFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
