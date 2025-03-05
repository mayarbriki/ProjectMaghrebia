import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Product, ProductService } from 'src/app/product.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})

export class ProductsComponent implements OnInit {
  products: Product[] = [];
  selectedProduct: Product | null = null;
  isModifyMode = false;
  selectedFile: File | null = null;

  newProduct: Product = {
    name: '',
    description: '',
    category: 'VEHICULE', // Default category
    price: 0, // Default price
    views:0,
  };

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getProducts().subscribe(data => {
      this.products = data;
      console.log('Loaded products:', this.products);
    });
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  addProduct() {
    const formData = new FormData();
    formData.append('name', this.newProduct.name);
    formData.append('description', this.newProduct.description);
    formData.append('category', this.newProduct.category.toUpperCase()); // Ensure UPPERCASE for Enum
    formData.append('price', this.newProduct.price!.toString()); // Convert number to string

    if (this.selectedFile) {
      formData.append('file', this.selectedFile);
    }

    this.productService.addProduct(formData).subscribe(
      response => {
        console.log('Product added:', response);
        alert('Product added successfully!');
        this.loadProducts();
        this.resetForm();
      },
      error => {
        console.error('Error adding product:', error);
        alert('Failed to add product.');
      }
    );
  }

  selectProduct(product: Product) {
    this.selectedProduct = { ...product };
    this.isModifyMode = true;
  }

  modifyProduct() {
    if (!this.selectedProduct || !this.selectedProduct.idProduct) {
      alert('No product selected for modification.');
      return;
    }

    const formData = new FormData();
    formData.append('name', this.selectedProduct.name);
    formData.append('description', this.selectedProduct.description);
    formData.append('category', this.selectedProduct.category.toUpperCase());
    formData.append('price', this.selectedProduct.price!.toString()); // Convert number to string


    if (this.selectedFile) {
      formData.append('file', this.selectedFile);
    }

    this.productService.updateProduct(this.selectedProduct.idProduct, formData)
      .subscribe(response => {
        console.log('Product updated:', response);
        alert('Product updated successfully!');
        this.loadProducts();
        this.isModifyMode = false;
      }, error => {
        console.error('Error updating product:', error);
        alert('Failed to update product.');
      });
  }

  deleteProduct(id: number) {
    if (!id) return;
  
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(id).subscribe(
        (response) => {
          console.log('Delete success:', response);
          alert(response.message || 'Product deleted successfully');
          this.loadProducts(); // Refresh product list
        },
        (error) => {
          console.error('Error deleting product:', error);
          alert(error.error?.error || 'Failed to delete product.');
        }
      );
    }
  }
  

  resetForm() {
    this.newProduct = {
      name: '',
      description: '',
      category: 'ELECTRONICS',
    };
    this.selectedFile = null;
    this.isModifyMode = false;
    this.selectedProduct = null;
  }
  
}
