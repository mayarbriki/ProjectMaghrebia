import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogadminComponent } from './blogadmin.component';

describe('BlogadminComponent', () => {
  let component: BlogadminComponent;
  let fixture: ComponentFixture<BlogadminComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BlogadminComponent]
    });
    fixture = TestBed.createComponent(BlogadminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
