import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [CommonModule], // Import CommonModule for pipes
  selector: 'app-productadmin',
  templateUrl: './productadmin.component.html',
  styleUrls: ['./productadmin.component.css']
})
export class ProductadminComponent {
  // Static product list
  products: any[] = [
    { id: 1, name: 'Product 1', description: 'Description 1', price: 100, category: 'Category 1' },
    { id: 2, name: 'Product 2', description: 'Description 2', price: 200, category: 'Category 2' },
    { id: 3, name: 'Product 3', description: 'Description 3', price: 300, category: 'Category 3' },
  ];

  // New product object


  // Add a new product
  showForm = false; // Control form visibility
  newProduct: any = {
    name: '',
    description: '',
    price: 0,
    category: '',
  };

  // Show the SweetAlert2 popup and then the form
  showAddProductModal(): void {
    Swal.fire({
      title: 'Add New Product',
      html: `
        <form id="addProductForm">
          <div class="form-group">
            <label for="name">Name</label>
            <input type="text" id="name" class="swal2-input" placeholder="Name" required>
          </div>
          <div class="form-group">
            <label for="description">Description</label>
            <textarea id="description" class="swal2-textarea" placeholder="Description" required></textarea>
          </div>
          <div class="form-group">
            <label for="price">Price</label>
            <input type="number" id="price" class="swal2-input" placeholder="Price" required>
          </div>
          <div class="form-group">
            <label for="category">Category</label>
            <input type="text" id="category" class="swal2-input" placeholder="Category" required>
          </div>
        </form>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Add Product',
      cancelButtonText: 'Cancel',
      preConfirm: () => {
        const name = (Swal.getPopup()?.querySelector('#name') as HTMLInputElement)?.value;
        const description = (Swal.getPopup()?.querySelector('#description') as HTMLTextAreaElement)?.value;
        const price = (Swal.getPopup()?.querySelector('#price') as HTMLInputElement)?.value;
        const category = (Swal.getPopup()?.querySelector('#category') as HTMLInputElement)?.value;

        if (!name || !description || !price || !category) {
          Swal.showValidationMessage('Please fill out all fields');
          return false;
        }

        return { name, description, price: parseFloat(price), category };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const newProduct = result.value;
        this.addProduct(newProduct); // Add the product
      }
    });
  }

  // Add a new product
  addProduct(product: any): void {
    console.log('New Product:', product);

    // Show success message
    Swal.fire({
      title: 'Success!',
      text: 'Product added successfully.',
      icon: 'success',
    });
  }
  showProductDetails(product: any): void {
    Swal.fire({
      title: product.name,
      html: `
        <div class="product-details">
          <div class="detail-group">
            <h4>Description</h4>
            <p>${product.description}</p>
          </div>
          <div class="detail-group">
            <h4>Price</h4>
            <p>$${product.price}</p>
          </div>
          <div class="detail-group">
            <h4>Category</h4>
            <p>${product.category}</p>
          </div>
        </div>
      `,
      width: '500px',
      showConfirmButton: false,
      showCloseButton: true
    });
  }

  // Delete a product
  deleteProduct(index: number): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.products.splice(index, 1); // Remove the product from the array
    }
  }
}