import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommercialPropertyFormComponent } from './commercial-property-form.component';

describe('CommercialPropertyFormComponent', () => {
  let component: CommercialPropertyFormComponent;
  let fixture: ComponentFixture<CommercialPropertyFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommercialPropertyFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommercialPropertyFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
