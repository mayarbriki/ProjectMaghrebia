import { Component, OnInit } from '@angular/core';
import { BlogService, Blog } from '../../blog.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './blogs.component.html',
  styleUrls: ['./blogs.component.scss']
})
export class BlogsComponent implements OnInit {
  blogs: Blog[] = [];
  newBlog: Blog = { title: '', author: '', content: '', type: 'NEWS' };
  selectedBlog: Blog | null = null;
  isModifyMode: boolean = false;
  selectedFile: File | null = null;

  constructor(private blogService: BlogService) {}

  ngOnInit(): void {
    this.loadBlogs();
  }

  loadBlogs(): void {
    this.blogService.getBlogs().subscribe((data) => {
      this.blogs = data;
    });
  }

  addBlog(): void {
    this.blogService.createBlog(this.newBlog, this.selectedFile || undefined).subscribe((blog) => {
      this.blogs.push(blog);
      this.newBlog = { title: '', author: '', content: '', type: 'NEWS' };
      this.selectedFile = null;
    });
  }
  
  modifyBlog(): void {
    if (this.selectedBlog) {
      this.blogService.updateBlog(this.selectedBlog.id!, this.selectedBlog, this.selectedFile || undefined)
        .subscribe((updatedBlog) => {
          this.blogs = this.blogs.map((b) => (b.id === updatedBlog.id ? updatedBlog : b));
          this.isModifyMode = false;
          this.selectedBlog = null;
          this.selectedFile = null;
        });
    }
  }
  
  

  selectBlog(blog: Blog): void {
    this.selectedBlog = { ...blog };
    this.isModifyMode = true;
  }

  deleteBlog(id: number): void {
    this.blogService.deleteBlog(id).subscribe(() => {
      this.blogs = this.blogs.filter(blog => blog.id !== id);
    });
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
}
