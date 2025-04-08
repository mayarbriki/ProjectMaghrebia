import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router'; // Import RouterModule and Router
import { BlogService, Blog } from '../blog.service';

@Component({
  selector: 'app-blog-detail',
  standalone: true,
  imports: [CommonModule, RouterModule], // Add RouterModule here
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

  constructor(
    private blogService: BlogService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadBlogs();
  }

  loadBlogs(): void {
    this.blogService.getBlogs().subscribe((data) => {
      this.allBlogs = data.filter(blog => blog.published === true);
      this.totalBlogs = this.allBlogs.length;
      this.totalPages = Math.ceil(this.totalBlogs / this.pageSize);
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

  getBlogImageUrl(imageFileName?: string): string {
    return imageFileName ? `http://localhost:6969/uploads/${imageFileName}` : '';
  }

  viewBlog(blogId: number): void {
    this.router.navigate(['/blogs', blogId]);
  }
  
}