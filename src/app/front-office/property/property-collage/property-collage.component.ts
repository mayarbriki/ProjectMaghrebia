import { Component, Input, AfterViewInit, ElementRef, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { PropertyService } from 'src/app/property.service';  // Adjust the import path as needed

@Component({
  selector: 'app-property-collage',
  templateUrl: './property-collage.component.html',
  styleUrls: ['./property-collage.component.scss']
})
export class PropertyCollageComponentF implements AfterViewInit, OnChanges {
  @Input() images: any[] = []; 
  @Input() propertyName: string = '';
  
  @ViewChild('collageCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  // You can also expose canvasSize as an @Input if you want further customization.
  canvasSize: number = 700; // 700px square canvas
  overlayHeight: number = 70; // height reserved for text overlay

  constructor(private propertyService: PropertyService) { }

  ngAfterViewInit() {
    setTimeout(() => {
      this.generateCollage();
    }, 0);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['images'] && this.images.length > 0) {
      this.generateCollage();
    }
  }

  generateCollage() {
    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('Unable to get canvas context.');
      return;
    }

    // Set canvas dimensions
    canvas.width = this.canvasSize;
    canvas.height = this.canvasSize;

    // If no images, display a placeholder
    if (this.images.length === 0) {
      ctx.fillStyle = '#f0f0f0';
      ctx.fillRect(0, 0, this.canvasSize, this.canvasSize);
      ctx.fillStyle = '#333';
      ctx.font = '20px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('No Images', this.canvasSize / 2, this.canvasSize / 2);
      return;
    }

    // Limit to a maximum number if desired (or use all images)
    const imagesToLoad = this.images.slice(0); // or slice(0, 9) if you want to cap it

    // Function to load a single image using the service's URL function
    const loadImage = (src: any) => {
      const url = this.propertyService.getImageUrl(src);
      return new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = url;
        img.onload = () => {
          resolve(img);
        };
        img.onerror = (err) => {
          console.error('Failed to load image:', url, err);
          reject(err);
        };
      });
    };

    Promise.all(imagesToLoad.map(src => loadImage(src)))
      .then((loadedImages: HTMLImageElement[]) => {
        ctx.clearRect(0, 0, this.canvasSize, this.canvasSize);
        
        // Determine grid layout based on number of images
        const numImages = loadedImages.length;
        const cols = Math.ceil(Math.sqrt(numImages));
        const rows = Math.ceil(numImages / cols);
        const cellWidth = this.canvasSize / cols;
        // Reserve some vertical space for overlay
        const cellHeight = (this.canvasSize - this.overlayHeight) / rows;

        loadedImages.forEach((img, index) => {
          const col = index % cols;
          const row = Math.floor(index / cols);
          const x = col * cellWidth;
          const y = row * cellHeight;
          ctx.drawImage(img, x, y, cellWidth, cellHeight);
        });

        this.addTextOverlay(ctx);
      })
      .catch(error => {
        console.error('Error loading one or more images:', error);
        ctx.fillStyle = '#f0f0f0';
        ctx.fillRect(0, 0, this.canvasSize, this.canvasSize);
        ctx.fillStyle = '#333';
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Error loading images', this.canvasSize / 2, this.canvasSize / 2);
      });
  }

  addTextOverlay(ctx: CanvasRenderingContext2D) {
    // Draw a semi-transparent overlay at the bottom
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.fillRect(0, this.canvasSize - this.overlayHeight, this.canvasSize, this.overlayHeight);

    // Draw the property name text
    ctx.fillStyle = 'white';
    ctx.font = '24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(this.propertyName, this.canvasSize / 2, this.canvasSize - (this.overlayHeight / 2) + 8);
  }

  downloadCollage() {
    const canvas = this.canvasRef.nativeElement;
    const link = document.createElement('a');
    link.download = `${this.propertyName}_collage.jpg`;
    link.href = canvas.toDataURL('image/jpg');
    link.click();
  }
}
