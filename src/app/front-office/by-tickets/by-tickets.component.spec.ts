import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ByTicketsComponent } from './by-tickets.component';

describe('ByTicketsComponent', () => {
  let component: ByTicketsComponent;
  let fixture: ComponentFixture<ByTicketsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ByTicketsComponent]
    });
    fixture = TestBed.createComponent(ByTicketsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
