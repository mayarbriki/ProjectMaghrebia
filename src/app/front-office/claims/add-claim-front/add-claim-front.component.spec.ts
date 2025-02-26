import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddClaimComponentFront } from './add-claim-front.component';

describe('AddClaimComponent', () => {
  let component: AddClaimComponentFront;
  let fixture: ComponentFixture<AddClaimComponentFront>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddClaimComponentFront]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddClaimComponentFront);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
