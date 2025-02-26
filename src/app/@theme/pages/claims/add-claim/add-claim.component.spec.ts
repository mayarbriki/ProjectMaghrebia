import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddClaimComponent } from './add-claim.component';

describe('AddClaimComponent', () => {
  let component: AddClaimComponent;
  let fixture: ComponentFixture<AddClaimComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddClaimComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddClaimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
