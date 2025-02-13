import { Component } from '@angular/core';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-blogadmin',
  templateUrl: './blogadmin.component.html',
  styleUrls: ['./blogadmin.component.css']
})
export class BlogadminComponent {
  
    blogs: any[] = [
      {
        title: 'Blog 1',
        description: 'This is the first blog.',
        author: 'John Doe',
        date: new Date(),
        category: 'Technology',
      },
      {
        title: 'Blog 2',
        description: 'This is the second blog.',
        author: 'Jane Smith',
        date: new Date(),
        category: 'Lifestyle',
      },
    ];
  
    // Show the SweetAlert2 modal to add a blog
    showAddBlogModal(): void {
      Swal.fire({
        title: 'Add New Blog',
        html: `
          <form id="addBlogForm">
            <div class="form-group">
              <label for="title">Title</label>
              <input type="text" id="title" class="swal2-input" placeholder="Title" required>
            </div>
            <div class="form-group">
              <label for="description">Description</label>
              <textarea id="description" class="swal2-textarea" placeholder="Description" required></textarea>
            </div>
            <div class="form-group">
              <label for="author">Author</label>
              <input type="text" id="author" class="swal2-input" placeholder="Author" required>
            </div>
            <div class="form-group">
              <label for="category">Category</label>
              <input type="text" id="category" class="swal2-input" placeholder="Category" required>
            </div>
          </form>
        `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Add Blog',
        cancelButtonText: 'Cancel',
        preConfirm: () => {
          const title = (Swal.getPopup()?.querySelector('#title') as HTMLInputElement)?.value;
          const description = (Swal.getPopup()?.querySelector('#description') as HTMLTextAreaElement)?.value;
          const author = (Swal.getPopup()?.querySelector('#author') as HTMLInputElement)?.value;
          const category = (Swal.getPopup()?.querySelector('#category') as HTMLInputElement)?.value;
  
          if (!title || !description || !author || !category) {
            Swal.showValidationMessage('Please fill out all fields');
            return false;
          }
  
          return { title, description, author, category, date: new Date() };
        },
      }).then((result) => {
        if (result.isConfirmed) {
          const newBlog = result.value;
          this.addBlog(newBlog); // Add the blog
        }
      });
    }
  
    // Add a new blog
    addBlog(blog: any): void {
      this.blogs.push(blog);
      Swal.fire({
        title: 'Success!',
        text: 'Blog added successfully.',
        icon: 'success',
      });
    }
  
    // Edit a blog
    editBlog(index: number): void {
      const blog = this.blogs[index];
      Swal.fire({
        title: 'Edit Blog',
        html: `
          <form id="editBlogForm">
            <div class="form-group">
              <label for="title">Title</label>
              <input type="text" id="title" class="swal2-input" value="${blog.title}" required>
            </div>
            <div class="form-group">
              <label for="description">Description</label>
              <textarea id="description" class="swal2-textarea" required>${blog.description}</textarea>
            </div>
            <div class="form-group">
              <label for="author">Author</label>
              <input type="text" id="author" class="swal2-input" value="${blog.author}" required>
            </div>
            <div class="form-group">
              <label for="category">Category</label>
              <input type="text" id="category" class="swal2-input" value="${blog.category}" required>
            </div>
          </form>
        `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Save Changes',
        cancelButtonText: 'Cancel',
        preConfirm: () => {
          const title = (Swal.getPopup()?.querySelector('#title') as HTMLInputElement)?.value;
          const description = (Swal.getPopup()?.querySelector('#description') as HTMLTextAreaElement)?.value;
          const author = (Swal.getPopup()?.querySelector('#author') as HTMLInputElement)?.value;
          const category = (Swal.getPopup()?.querySelector('#category') as HTMLInputElement)?.value;
  
          if (!title || !description || !author || !category) {
            Swal.showValidationMessage('Please fill out all fields');
            return false;
          }
  
          return { title, description, author, category, date: blog.date };
        },
      }).then((result) => {
        if (result.isConfirmed) {
          const updatedBlog = result.value;
          this.blogs[index] = updatedBlog; // Update the blog
          Swal.fire({
            title: 'Success!',
            text: 'Blog updated successfully.',
            icon: 'success',
          });
        }
      });
    }
  
    // Delete a blog
    deleteBlog(index: number): void {
      if (confirm('Are you sure you want to delete this blog?')) {
        this.blogs.splice(index, 1); // Remove the blog
        Swal.fire({
          title: 'Success!',
          text: 'Blog deleted successfully.',
          icon: 'success',
        });
      }
    }
  }