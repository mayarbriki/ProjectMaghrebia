import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { BlogService, Blog } from '../blog.service';

@Component({
  selector: 'app-blog-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './blog-detail.component.html',
  styleUrls: ['./blog-detail.component.scss']
})
export class BlogDetailComponent implements OnInit {
  allBlogs: Blog[] = [];
  displayedBlogs: Blog[] = [];
  currentPage: number = 1;
  pageSize: number = 3;
  totalBlogs: number = 0;
  totalPages: number = 0;

  // Sorting properties
  sortBy: string = 'createdAt'; // Default sort field
  direction: string = 'ASC'; // Default sort direction
  sortOptions = [
    { label: 'Created At', value: 'createdAt' },
    { label: 'Title', value: 'title' },
    { label: 'Author', value: 'author' },
    { label: 'Likes', value: 'likes' },
    { label: 'Scheduled Date', value: 'scheduledPublicationDate' }
  ];

  constructor(
    private blogService: BlogService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadBlogs();
  }

  loadBlogs(): void {
    this.blogService.getBlogs(this.sortBy, this.direction).subscribe((data) => {
      this.allBlogs = data.filter(blog => blog.published === true);
      this.totalBlogs = this.allBlogs.length;
      this.totalPages = Math.ceil(this.totalBlogs / this.pageSize);
      this.currentPage = Math.min(this.currentPage, this.totalPages || 1);
      this.updateDisplayedBlogs();
    });
  }

  updateDisplayedBlogs(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = Math.min(startIndex + this.pageSize, this.totalBlogs);
    this.displayedBlogs = this.allBlogs.slice(startIndex, endIndex);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updateDisplayedBlogs();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateDisplayedBlogs();
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updateDisplayedBlogs();
    }
  }

  sort(field: string): void {
    if (this.sortBy === field) {
      // Toggle direction if the same field is clicked
      this.direction = this.direction === 'ASC' ? 'DESC' : 'ASC';
    } else {
      // Set new sort field and default to ASC
      this.sortBy = field;
      this.direction = 'ASC';
    }
    this.currentPage = 1; // Reset to first page when sorting changes
    this.loadBlogs(); // Reload blogs with new sorting
  }

  getSortArrow(field: string): string {
    if (this.sortBy !== field) return ''; // No arrow if not sorted by this field
    return this.direction === 'ASC' ? '↑' : '↓';
  }

  getBlogImageUrl(imageFileName?: string): string {
    return imageFileName ? `http://localhost:6969/uploads/${imageFileName}` : '';
  }

  viewBlog(blogId: number): void {
    this.router.navigate(['/blogs', blogId]);
  }
}