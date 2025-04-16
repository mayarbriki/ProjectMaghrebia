import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlideshowVideoComponent } from './slideshow-video.component';

describe('SlideshowVideoComponent', () => {
  let component: SlideshowVideoComponent;
  let fixture: ComponentFixture<SlideshowVideoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SlideshowVideoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SlideshowVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
