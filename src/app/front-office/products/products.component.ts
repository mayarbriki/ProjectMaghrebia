import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Product, ProductService } from 'src/app/product.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  selectedProduct: Product | null = null;
  isModifyMode = false;
  selectedFile: File | null = null;
  productForm!: FormGroup;
  formSubmitted = false;
  
  newProduct: Product = {
    name: '',
    description: '',
    category: 'VEHICULE',
    price: 0,
    views: 0,
  };
  
  constructor(
    private productService: ProductService,
    private fb: FormBuilder
  ) {}
  
  ngOnInit(): void {
    this.loadProducts();
    this.initForm();
  }
  
  initForm() {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      category: ['VEHICULE', Validators.required],
      price: [0, [Validators.required, Validators.min(0.01), Validators.pattern(/^\d+(\.\d{1,2})?$/)]]
    });
  }
  
  get f() { return this.productForm.controls; }
  
  loadProducts() {
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        console.log('Loaded products:', this.products);
      },
      error: (error) => {
        console.error('Error loading products:', error);
        alert('Failed to load products: ' + (error.error?.message || 'Unknown error'));
      }
    });
  }
  
  onFileSelected(event: any) {
    const file = event.target.files[0];
    
    if (file) {
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      const maxSize = 5 * 1024 * 1024; // 5MB
      
      if (!validTypes.includes(file.type)) {
        alert('Only JPG, JPEG and PNG files are allowed');
        event.target.value = '';
        return;
      }
      
      if (file.size > maxSize) {
        alert('File size cannot exceed 5MB');
        event.target.value = '';
        return;
      }
      
      this.selectedFile = file;
    }
  }
  
  addProduct() {
    this.formSubmitted = true;
    
    if (this.productForm.invalid) {
      console.log('Form is invalid', this.productForm.errors);
      return;
    }
    
    if (!this.selectedFile) {
      alert('Please select an image for the product');
      return;
    }
    
    const formData = new FormData();
    formData.append('name', this.productForm.value.name);
    formData.append('description', this.productForm.value.description);
    formData.append('category', this.productForm.value.category.toUpperCase());
    formData.append('price', this.productForm.value.price.toString());
    formData.append('file', this.selectedFile);
    
    this.productService.addProduct(formData).subscribe({
      next: (response) => {
        console.log('Product added:', response);
        alert('Product added successfully!');
        this.loadProducts(); // Refresh list
        this.resetForm();
      },
      error: (error) => {
        console.error('Error adding product:', error);
        alert('Failed to add product: ' + (error.error?.message || 'Unknown error'));
      }
    });
  }
  
  selectProduct(product: Product) {
    this.selectedProduct = { ...product };
    this.isModifyMode = true;
    
    this.productForm.patchValue({
      name: product.name,
      description: product.description,
      category: product.category,
      price: product.price
    });
    this.selectedFile = null; // Reset file selection when selecting a product
  }
  
  modifyProduct() {
    this.formSubmitted = true;
    
    if (this.productForm.invalid) {
      return;
    }
    
    if (!this.selectedProduct || !this.selectedProduct.idProduct) {
      alert('No product selected for modification.');
      return;
    }
    
    const formData = new FormData();
    formData.append('name', this.productForm.value.name);
    formData.append('description', this.productForm.value.description);
    formData.append('category', this.productForm.value.category.toUpperCase());
    formData.append('price', this.productForm.value.price.toString());
    
    if (this.selectedFile) {
      formData.append('file', this.selectedFile);
    }
    
    this.productService.updateProduct(this.selectedProduct.idProduct, formData).subscribe({
      next: (response) => {
        console.log('Product updated:', response);
        alert('Product updated successfully!');
        this.loadProducts(); // Refresh list
        this.isModifyMode = false;
        this.resetForm();
      },
      error: (error) => {
        console.error('Error updating product:', error);
        alert('Failed to update product: ' + (error.error?.message || 'Unknown error'));
      }
    });
  }
  
  deleteProduct(id: number) {
    if (!id) return;
 
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(id).subscribe({
        next: (response) => {
          console.log('Delete success:', response);
          alert(response.message || 'Product deleted successfully');
          this.loadProducts(); // Refresh list
          if (this.selectedProduct?.idProduct === id) {
            this.resetForm(); // Reset form if deleted product was selected
            this.isModifyMode = false;
            this.selectedProduct = null;
          }
        },
        error: (error) => {
          console.error('Error deleting product:', error);
          alert(error.error?.message || 'Failed to delete product.');
        }
      });
    }
  }
 
  resetForm() {
    this.formSubmitted = false;
    this.productForm.reset({
      name: '',
      description: '',
      category: 'VEHICULE',
      price: 0
    });
    this.selectedFile = null;
    this.newProduct = {
      name: '',
      description: '',
      category: 'VEHICULE',
      price: 0,
      views: 0,
    };
  }
  
  hasError(controlName: string, errorName: string): boolean {
    const control = this.productForm.get(controlName);
    return !!(control && control.hasError(errorName) && (control.dirty || control.touched || this.formSubmitted));
  }
}