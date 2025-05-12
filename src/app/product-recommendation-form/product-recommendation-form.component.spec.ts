import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductRecommendationFormComponent } from './product-recommendation-form.component';

describe('ProductRecommendationFormComponent', () => {
  let component: ProductRecommendationFormComponent;
  let fixture: ComponentFixture<ProductRecommendationFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductRecommendationFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductRecommendationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
