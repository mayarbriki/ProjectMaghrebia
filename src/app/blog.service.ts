import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Blog {
  id?: number;
  title: string;
  author: string;
  content: string;
  createdAt?: string;
  type: 'NEWS' | 'ARTICLE';
  image?: string;
}

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private apiUrl = 'http://localhost:6969/api/blogs';

  constructor(private http: HttpClient) {}

  getBlogs(): Observable<Blog[]> {
    return this.http.get<Blog[]>(this.apiUrl);
  }

  createBlog(blog: Blog, file?: File): Observable<Blog> {
    const formData = new FormData();
    formData.append('title', blog.title);
    formData.append('author', blog.author);
    formData.append('content', blog.content);
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
  
}
