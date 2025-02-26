import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewClaimComponentFront } from './view-claim-front.component';

describe('ViewClaimComponent', () => {
  let component: ViewClaimComponentFront;
  let fixture: ComponentFixture<ViewClaimComponentFront>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewClaimComponentFront]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewClaimComponentFront);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
