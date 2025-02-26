import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewClaimComponent } from './view-claim.component';

describe('ViewClaimComponent', () => {
  let component: ViewClaimComponent;
  let fixture: ComponentFixture<ViewClaimComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewClaimComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewClaimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
