import { HttpClient ,HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Blog {
  id: number;
  title: string;
  author: string;
  content: string;
  createdAt?: string;
  type: 'NEWS' | 'ARTICLE';
  image?: string;
  scheduledPublicationDate?: string;
  published?: boolean;
  likes?: number; 
}

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private apiUrl = 'http://localhost:6969/api/blogs';

  constructor(private http: HttpClient) {}

  getBlogs(sortBy: string = 'createdAt', direction: string = 'ASC'): Observable<Blog[]> {
    let params = new HttpParams()
      .set('sortBy', sortBy)
      .set('direction', direction);
    return this.http.get<Blog[]>(this.apiUrl, { params });
  }
  createBlog(blog: Blog, file?: File): Observable<Blog> {
    const formData = new FormData();
    formData.append('title', blog.title);
    formData.append('author', blog.author);
    formData.append('content', blog.content);
    formData.append('type', blog.type);
    if (blog.scheduledPublicationDate) {
      formData.append('scheduledPublicationDate', blog.scheduledPublicationDate);
    }
    if (file) {
      formData.append('file', file);
    }
    return this.http.post<Blog>(this.apiUrl, formData);
  }

  updateBlog(id: number, blog: Blog, file?: File): Observable<Blog> {
    const formData = new FormData();
    formData.append('title', blog.title);
    formData.append('author', blog.author);
    formData.append('content', blog.content);
    formData.append('type', blog.type);
    if (blog.scheduledPublicationDate) {
      formData.append('scheduledPublicationDate', blog.scheduledPublicationDate);
    }
    if (file) {
      formData.append('file', file);
    }
    return this.http.put<Blog>(`${this.apiUrl}/${id}`, formData);
  }

  deleteBlog(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getBlogById(id: number): Observable<Blog> {
    return this.http.get<Blog>(`${this.apiUrl}/${id}`);
  }

  // New method to like a blog
  likeBlog(id: number): Observable<Blog> {
    return this.http.post<Blog>(`${this.apiUrl}/${id}/like`, {});
  }

  unlikeBlog(id: number): Observable<Blog> {
    return this.http.post<Blog>(`${this.apiUrl}/${id}/unlike`, {});
  }
}