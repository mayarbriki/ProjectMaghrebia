import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListClaimComponent } from './list-claim.component';

describe('ListClaimComponent', () => {
  let component: ListClaimComponent;
  let fixture: ComponentFixture<ListClaimComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListClaimComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListClaimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
