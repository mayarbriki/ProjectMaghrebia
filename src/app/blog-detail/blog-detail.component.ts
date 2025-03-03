import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlogService , Blog} from '../blog.service';

@Component({
  selector: 'app-blog-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './blog-detail.component.html',
  styleUrls: ['./blog-detail.component.scss']
})
export class BlogDetailComponent implements OnInit {
  blogs: Blog[] = [];

  constructor(private blogService: BlogService) {}

  ngOnInit(): void {
    this.blogService.getBlogs().subscribe((data) => {
      this.blogs = data;
    });
  }

  getBlogImageUrl(imageFileName?: string): string {
    return imageFileName ? `http://localhost:6969/uploads/${imageFileName}` : '';
  }
}
