import { Component, OnInit, OnDestroy } from '@angular/core';
import { BlogService, Blog } from '../../blog.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './blogs.component.html',
  styleUrls: ['./blogs.component.scss']
})
export class BlogsComponent implements OnInit, OnDestroy {
  blogs: Blog[] = [];
  newBlog: Partial<Blog> = { title: '', author: '', content: '', type: 'NEWS', scheduledPublicationDate: '' };
  selectedBlog: Blog | null = null;
  isModifyMode: boolean = false;
  selectedFile: File | null = null;
  errors: { title?: string; author?: string; content?: string; scheduledPublicationDate?: string } = {};
  private refreshInterval: any;

  // Sorting properties
  sortBy: string = 'createdAt'; // Default sort field
  direction: string = 'ASC'; // Default sort direction
  sortOptions = [
    { label: 'Created At', value: 'createdAt' },
    { label: 'Title', value: 'title' },
    { label: 'Author', value: 'author' },
    { label: 'Likes', value: 'likes' },
    { label: 'Scheduled Date', value: 'scheduledPublicationDate' },
    { label: 'Published', value: 'published' }
  ];
  directionOptions = [
    { label: 'Ascending', value: 'ASC' },
    { label: 'Descending', value: 'DESC' }
  ];

  constructor(private blogService: BlogService) {}

  ngOnInit(): void {
    this.loadBlogs();
    this.refreshInterval = setInterval(() => {
      this.loadBlogs();
    }, 30000);
  }

  ngOnDestroy(): void {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  }

  loadBlogs(): void {
    this.blogService.getBlogs(this.sortBy, this.direction).subscribe(
      (data) => {
        console.log('Blogs loaded:', data);
        this.blogs = data.map(blog => {
          if (typeof blog.scheduledPublicationDate === 'string' && blog.scheduledPublicationDate.includes(',')) {
            const parts = blog.scheduledPublicationDate.split(',').map(Number);
            if (parts.length >= 5) {
              blog.scheduledPublicationDate = new Date(parts[0], parts[1] - 1, parts[2], parts[3], parts[4]).toISOString();
            }
          }
          return blog;
        });
      },
      (error) => {
        console.error('Error loading blogs:', error);
      }
    );
  }

  onSortChange(): void {
    this.loadBlogs(); // Reload blogs when sorting changes
  }

  validateBlog(blog: Partial<Blog>): boolean {
    this.errors = {};

    if (!blog.title || blog.title.trim().length < 3) {
      this.errors.title = 'Title must be at least 3 characters long';
    }
    if (!blog.author || blog.author.trim().length < 2) {
      this.errors.author = 'Author must be at least 2 characters long';
    }
    if (!blog.content || blog.content.trim().length < 10) {
      this.errors.content = 'Content must be at least 10 characters long';
    }
    if (blog.scheduledPublicationDate) {
      const scheduledDate = new Date(blog.scheduledPublicationDate);
      const now = new Date();
      if (isNaN(scheduledDate.getTime())) {
        this.errors.scheduledPublicationDate = 'Invalid date format';
      } else if (scheduledDate < now) {
        this.errors.scheduledPublicationDate = 'Scheduled publication date cannot be in the past';
      }
    }

    return Object.keys(this.errors).length === 0;
  }

  addBlog(): void {
    if (!this.validateBlog(this.newBlog)) {
      console.error('Validation failed:', this.errors);
      return;
    }

    this.blogService.createBlog(this.newBlog as Blog, this.selectedFile || undefined).subscribe(
      () => {
        this.loadBlogs();
        this.newBlog = { title: '', author: '', content: '', type: 'NEWS', scheduledPublicationDate: '' };
        this.selectedFile = null;
        this.errors = {};
      },
      (error) => {
        console.error('Error adding blog:', error);
      }
    );
  }

  modifyBlog(): void {
    if (!this.selectedBlog || !this.selectedBlog.id || !this.validateBlog(this.selectedBlog)) {
      console.error('Validation failed:', this.errors);
      return;
    }

    this.blogService.updateBlog(this.selectedBlog.id, this.selectedBlog, this.selectedFile || undefined).subscribe(
      () => {
        this.loadBlogs();
        this.isModifyMode = false;
        this.selectedBlog = null;
        this.selectedFile = null;
        this.errors = {};
      },
      (error) => {
        console.error('Error updating blog:', error);
      }
    );
  }

  selectBlog(blog: Blog): void {
    this.selectedBlog = { ...blog };
    this.isModifyMode = true;
    this.errors = {};
  }

  deleteBlog(id: number): void {
    this.blogService.deleteBlog(id).subscribe(
      () => {
        this.loadBlogs();
      },
      (error) => {
        console.error('Error deleting blog:', error);
      }
    );
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  getBlogImageUrl(imageFileName?: string): string {
    return imageFileName ? `http://localhost:6969/uploads/${imageFileName}` : '';
  }

  resetForm(): void {
    this.newBlog = { title: '', author: '', content: '', type: 'NEWS', scheduledPublicationDate: '' };
    this.selectedBlog = null;
    this.isModifyMode = false;
    this.selectedFile = null;
    this.errors = {};
  }

  likeBlog(id: number): void {
    this.blogService.likeBlog(id).subscribe(
      () => this.loadBlogs(),
      (error) => console.error('Error liking blog:', error)
    );
  }

  unlikeBlog(id: number): void {
    this.blogService.unlikeBlog(id).subscribe(
      () => this.loadBlogs(),
      (error) => console.error('Error unliking blog:', error)
    );
  }
}