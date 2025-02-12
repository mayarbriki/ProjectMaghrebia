import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeadminComponent } from './homeadmin.component';

describe('HomeadminComponent', () => {
  let component: HomeadminComponent;
  let fixture: ComponentFixture<HomeadminComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HomeadminComponent]
    });
    fixture = TestBed.createComponent(HomeadminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
