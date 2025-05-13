import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PropertyService } from 'src/app/property.service';

@Component({
  selector: 'app-property-mobile-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './property-mobile-detail.component.html',
  styleUrls: ['./property-mobile-detail.component.scss'],
})
export class PropertyMobileDetailComponent implements OnInit {
  public propertyId!: number;
  public property: any = null;

  constructor(
    private route: ActivatedRoute,
    public propertyService: PropertyService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.propertyId = +params.get('id')!;
      this.loadProperty();
    });
  }

  loadProperty(): void {
    this.propertyService.getPropertyById(this.propertyId).subscribe({
      next: data => {
        this.property = data;
      },
      error: err => {
        console.error('Error loading property:', err);
      }
    });
  }
}
