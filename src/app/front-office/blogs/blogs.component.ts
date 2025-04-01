import { Component, OnInit } from '@angular/core';
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
export class BlogsComponent implements OnInit {
  blogs: Blog[] = [];
  newBlog: Blog = { title: '', author: '', content: '', type: 'NEWS' };
  selectedBlog: Blog | null = null;
  isModifyMode: boolean = false;
  selectedFile: File | null = null;
  errors: { title?: string; author?: string; content?: string } = {};

  constructor(private blogService: BlogService) {}

  ngOnInit(): void {
    this.loadBlogs();
  }

  loadBlogs(): void {
    this.blogService.getBlogs().subscribe(
      (data) => {
        console.log('Blogs loaded:', data);
        this.blogs = data;
      },
      (error) => {
        console.error('Error loading blogs:', error);
      }
    );
  }

  validateBlog(blog: Blog): boolean {
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

    return Object.keys(this.errors).length === 0;
  }

  addBlog(): void {
    if (!this.validateBlog(this.newBlog)) {
      console.error('Validation failed:', this.errors);
      return;
    }

    this.blogService.createBlog(this.newBlog, this.selectedFile || undefined).subscribe(
      () => {
        // Refresh the blog list after adding
        this.loadBlogs();
        this.newBlog = { title: '', author: '', content: '', type: 'NEWS' };
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

    this.blogService.updateBlog(this.selectedBlog.id, this.selectedBlog, this.selectedFile || undefined)
      .subscribe(
        () => {
          // Refresh the blog list after modifying
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
        // Refresh the blog list after deleting
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
    this.newBlog = { title: '', author: '', content: '', type: 'NEWS' };
    this.selectedBlog = null;
    this.isModifyMode = false;
    this.selectedFile = null;
    this.errors = {};
  }
}