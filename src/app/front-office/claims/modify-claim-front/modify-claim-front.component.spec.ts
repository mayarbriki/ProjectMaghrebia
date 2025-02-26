import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyClaimComponentFront } from './modify-claim-front.component';

describe('ModifyClaimComponent', () => {
  let component: ModifyClaimComponentFront;
  let fixture: ComponentFixture<ModifyClaimComponentFront>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModifyClaimComponentFront]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModifyClaimComponentFront);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
