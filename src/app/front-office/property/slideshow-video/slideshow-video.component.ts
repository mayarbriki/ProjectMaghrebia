import { Component, Input, OnInit } from '@angular/core';
import { VideoService } from '../../../video.service'; // Adjust the path as needed

@Component({
  selector: 'app-slideshow-video-download',
  template: `
    <div>
      <button (click)="downloadVideo()" class="px-3 py-1 bg-green-600 text-white rounded-md">
        Download Video (MP4)
      </button>
    </div>
  `,
  styles: [`
    button {
      margin: 10px;
    }
  `]
})
export class SlideshowVideoDownloadComponentF implements OnInit {
  @Input() property!: { name: string; imageFolder: string };

  constructor(private videoService: VideoService) { }

  ngOnInit(): void {
    // Optionally, you can do initialization here.
  }

  downloadVideo(): void {
    const propertyData = { 
      name: this.property.name, 
      imageFolder: this.property.imageFolder 
    };
    
    console.log('Property data:', propertyData); // Log the property data

    this.videoService.generateVideo(propertyData).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'property_slideshow.mp4';
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error('Error downloading video:', err);
        alert('Failed to download video. Please try again later.');
      }
    });
  }
}