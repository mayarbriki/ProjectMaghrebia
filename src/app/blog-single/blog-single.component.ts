import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlogService, Blog, Comment } from '../blog.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HeaderFrontComponent } from '../front-office/header-front/header-front.component';

@Component({
  selector: 'app-blog-single',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderFrontComponent],
  templateUrl: './blog-single.component.html',
  styleUrls: ['./blog-single.component.scss']
})
export class BlogSingleComponent implements OnInit {
  blog: Blog | null = null;
  originalBlog: Blog | null = null;
  isLiked: boolean = false;
  likeCount: number = 0;
  newCommentContent: string = '';
  currentUser: string = 'nermine';
  loading: boolean = true;
  error: string | null = null;
  isTranslated: boolean = false;
  translatedLanguage: string | null = null;
  originalLanguage: string | null = null; // No default value, will be set by detection

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
      this.loading = true;
      this.blogService.getBlogById(+id).subscribe({
        next: (blog) => {
          if (blog.published) {
            this.blog = blog;
            this.originalBlog = { ...blog };
            this.likeCount = blog.likes || 0;
            this.isLiked = this.checkIfLiked(blog.id);
            // Detect the language of the blog title
            this.detectBlogLanguage(blog.title);
          } else {
            this.router.navigate(['/']);
          }
          this.loading = false;
        },
        error: () => {
          this.error = 'Failed to load blog post';
          this.loading = false;
          this.router.navigate(['/']);
        }
      });
    }
  }

  detectBlogLanguage(text: string): void {
    if (!text || text.trim() === '') {
      // If the title is empty, use a fallback or skip detection
      this.originalLanguage = null;
      this.error = 'Cannot detect language: Blog title is empty';
      return;
    }

    this.blogService.detectLanguage(text).subscribe({
      next: (language) => {
        this.originalLanguage = language;
        this.isTranslated = false;
        this.translatedLanguage = null;
      },
      error: (err) => {
        console.error('Error detecting language:', err);
        this.error = 'Failed to detect blog language';
        this.originalLanguage = null; // No fallback, handle in UI
      }
    });
  }

  getBlogImageUrl(imageFileName?: string): string {
    return imageFileName ? `http://localhost:6969/uploads/${imageFileName}` : '';
  }

  backToList(): void {
    this.router.navigate(['/']);
  }

  parseCustomDate(dateStr: string): Date {
    if (dateStr.includes('T')) {
      const [datePart, timePart] = dateStr.split('T');
      const [time, millis] = timePart.split(':');
      const correctedTime = `${time}.${millis.substring(0, 3)}Z`;
      const correctedDate = `${datePart}T${correctedTime}`;
      return new Date(correctedDate);
    }
    const [year, month, day, hour, minute, second] = dateStr.split(',').map(Number);
    return new Date(year, month - 1, day, hour, minute, second);
  }

  toggleLike(): void {
    if (!this.blog) return;

    const wasLiked = this.isLiked;
    this.isLiked = !this.isLiked;
    this.likeCount += this.isLiked ? 1 : -1;

    this.updateLikeState(this.blog.id);

    const serviceCall = this.isLiked
      ? this.blogService.likeBlog(this.blog.id)
      : this.blogService.unlikeBlog(this.blog.id);

    serviceCall.subscribe({
      next: (updatedBlog) => {
        this.likeCount = updatedBlog.likes || 0;
        this.blog!.likes = this.likeCount;
        console.log('Likes updated on server:', this.likeCount);
      },
      error: (err) => {
        console.error('Error updating like status:', err);
        this.isLiked = wasLiked;
        this.likeCount += wasLiked ? 1 : -1;
        this.updateLikeState(this.blog!.id);
      }
    });
  }

  addComment(): void {
    if (!this.blog || !this.newCommentContent.trim()) return;

    this.blogService
      .addComment(this.blog.id, {
        content: this.newCommentContent,
        user: this.currentUser
      })
      .subscribe({
        next: (comment) => {
          if (!this.blog!.comments) {
            this.blog!.comments = [];
          }
          this.blog!.comments.push(comment);
          this.newCommentContent = '';
        },
        error: (err) => {
          console.error('Error adding comment:', err);
          this.error = 'Failed to add comment. Please try again.';
        }
      });
  }

  translateBlog(targetLanguage: string): void {
    if (!this.blog) return;

    this.loading = true;
    this.blogService.translateBlog(this.blog.id, targetLanguage).subscribe({
      next: (translatedBlog) => {
        this.blog = translatedBlog;
        this.isTranslated = true;
        this.translatedLanguage = targetLanguage;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error translating blog:', err);
        this.error = 'Failed to translate blog post';
        this.loading = false;
      }
    });
  }

  revertToOriginal(): void {
    if (this.originalBlog) {
      this.blog = { ...this.originalBlog };
      this.isTranslated = false;
      this.translatedLanguage = null;
      // Re-detect the language after reverting
      this.detectBlogLanguage(this.originalBlog.title);
    }
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