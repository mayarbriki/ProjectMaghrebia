import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyClaimComponent } from './modify-claim.component';

describe('ModifyClaimComponent', () => {
  let component: ModifyClaimComponent;
  let fixture: ComponentFixture<ModifyClaimComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModifyClaimComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModifyClaimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
