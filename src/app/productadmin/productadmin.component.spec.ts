import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductadminComponent } from './productadmin.component';

describe('ProductadminComponent', () => {
  let component: ProductadminComponent;
  let fixture: ComponentFixture<ProductadminComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProductadminComponent]
    });
    fixture = TestBed.createComponent(ProductadminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
