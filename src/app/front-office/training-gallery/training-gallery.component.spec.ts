import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingGalleryComponent } from './training-gallery.component';

describe('TrainingGalleryComponent', () => {
  let component: TrainingGalleryComponent;
  let fixture: ComponentFixture<TrainingGalleryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrainingGalleryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrainingGalleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
