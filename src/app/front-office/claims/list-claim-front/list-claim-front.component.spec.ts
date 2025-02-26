import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListClaimComponentFront } from './list-claim-front.component';

describe('ListClaimComponent', () => {
  let component: ListClaimComponentFront;
  let fixture: ComponentFixture<ListClaimComponentFront>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListClaimComponentFront]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListClaimComponentFront);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
