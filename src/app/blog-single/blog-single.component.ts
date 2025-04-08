import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlogService, Blog } from '../blog.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-blog-single',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './blog-single.component.html',
  styleUrls: ['./blog-single.component.scss']
})
export class BlogSingleComponent implements OnInit {
  blog: Blog | null = null;
  isLiked: boolean = false;
  likeCount: number = 0;

  constructor(
    private blogService: BlogService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadBlog();
  }

  loadBlog(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.blogService.getBlogById(+id).subscribe({
        next: (blog) => {
          if (blog.published) {
            this.blog = blog;
            this.likeCount = blog.likes || 0;
            this.isLiked = this.checkIfLiked(blog.id);
          } else {
            this.router.navigate(['/']);
          }
        },
        error: () => this.router.navigate(['/'])
      });
    }
  }

  getBlogImageUrl(imageFileName?: string): string {
    return imageFileName ? `http://localhost:6969/uploads/${imageFileName}` : '';
  }

  backToList(): void {
    this.router.navigate(['/']);
  }

  toggleLike(): void {
    if (!this.blog) return;

    // Store previous state for rollback on error
    const wasLiked = this.isLiked;
    this.isLiked = !this.isLiked; // Optimistic toggle
    this.likeCount += this.isLiked ? 1 : -1; // Optimistic update

    // Update local storage
    this.updateLikeState(this.blog.id);

    // Choose the correct backend call based on new state
    const serviceCall = this.isLiked
      ? this.blogService.likeBlog(this.blog.id)
      : this.blogService.unlikeBlog(this.blog.id);

    // Sync with backend
    serviceCall.subscribe({
      next: (updatedBlog) => {
        // Update local state with server response
        this.likeCount = updatedBlog.likes || 0;
        this.blog!.likes = this.likeCount;
        console.log('Likes updated on server:', this.likeCount);
      },
      error: (err) => {
        // Revert on error
        console.error('Error updating like status:', err);
        this.isLiked = wasLiked; // Revert to previous state
        this.likeCount += wasLiked ? 1 : -1; // Revert count
        this.updateLikeState(this.blog!.id); // Revert local storage
      }
    });
  }

  private checkIfLiked(blogId: number): boolean {
    const likedBlogs = JSON.parse(localStorage.getItem('likedBlogs') || '[]');
    return likedBlogs.includes(blogId);
  }

  private updateLikeState(blogId: number): void {
    let likedBlogs = JSON.parse(localStorage.getItem('likedBlogs') || '[]');
    if (this.isLiked) {
      if (!likedBlogs.includes(blogId)) {
        likedBlogs.push(blogId);
      }
    } else {
      likedBlogs = likedBlogs.filter((id: number) => id !== blogId);
    }
    localStorage.setItem('likedBlogs', JSON.stringify(likedBlogs));
  }
}