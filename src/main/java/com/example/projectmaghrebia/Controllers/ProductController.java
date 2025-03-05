package com.example.projectmaghrebia.Controllers;

import com.example.projectmaghrebia.Entities.Category;
import com.example.projectmaghrebia.Entities.Product;
import com.example.projectmaghrebia.Repositories.ProductRepository;
import com.example.projectmaghrebia.Services.FileStorageService;
import com.example.projectmaghrebia.Services.IProductService;
import com.example.projectmaghrebia.Services.ProductService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:4200")
public class ProductController {
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private IProductService productService;
    @Autowired
    private ProductService ProductService;
    @Autowired
    private FileStorageService fileStorageService;

    @GetMapping("/products")
    public ResponseEntity<List<Product>> getAllProducts() {
        List<Product> products = productService.getAllProducts();
        String baseUrl = "http://localhost:6060/upload-dir/";
        products.forEach(product -> {
            if (product.getFileName() != null && !product.getFileName().isEmpty()) {
                product.setFileName(baseUrl + product.getFileName());
            }
        });
        return ResponseEntity.ok().body(products);
    }

    @GetMapping("/products/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        Optional<Product> productOptional = productService.getProductById(id);
        if (productOptional.isPresent()) {
            Product product = productOptional.get();
            String baseUrl = "http://localhost:6060/upload-dir/";
            if (product.getFileName() != null && !product.getFileName().isEmpty()) {
                product.setFileName(baseUrl + product.getFileName());
            }
            return ResponseEntity.ok(product);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping(value = "/products", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(
            summary = "Create a new product",
            description = "Creates a new product with an optional image file",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Product created successfully"),
                    @ApiResponse(responseCode = "400", description = "Invalid input")
            }
    )
    public ResponseEntity<Product> createProduct(
            @RequestParam(value = "file", required = false) MultipartFile file,
            @RequestParam("category") Category category,
            @RequestParam("description") String description,
            @RequestParam("name") String name,
            @RequestParam("price") Double price) {  // Added price parameter

        Product product = new Product();
        product.setCategory(category);
        product.setDescription(description);
        product.setName(name);
        product.setPrice(price);  // Set price

        if (file != null && !file.isEmpty()) {
            String fileName = fileStorageService.store(file);
            product.setFileName(fileName);
        }

        return ResponseEntity.ok(productService.createProduct(product));
    }

    @PutMapping(value = "products/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(
            summary = "Update a product",
            description = "Updates an existing product by ID with an optional image file",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Product updated successfully"),
                    @ApiResponse(responseCode = "404", description = "Product not found"),
                    @ApiResponse(responseCode = "400", description = "Invalid input")
            }
    )
    public ResponseEntity<Product> updateProduct(
            @PathVariable Long id,
            @RequestParam(value = "file", required = false) MultipartFile file,
            @RequestParam("category") Category category,
            @RequestParam("description") String description,
            @RequestParam("name") String name,
            @RequestParam("price") Double price) {  // Added price parameter

        Product productDetails = new Product();
        productDetails.setCategory(category);
        productDetails.setDescription(description);
        productDetails.setName(name);
        productDetails.setPrice(price);  // Set price

        if (file != null && !file.isEmpty()) {
            String fileName = fileStorageService.store(file);
            productDetails.setFileName(fileName);
        }

        return ResponseEntity.ok(productService.updateProduct(id, productDetails));
    }

    @DeleteMapping("/products/{id}")
    public void deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
    }
    @PostMapping("/products/{id}/increment-views")
    public ResponseEntity<Product> incrementViews(@PathVariable Long id) {
        try {
            Product updatedProduct = ProductService.incrementViews(id);
            return ResponseEntity.ok(updatedProduct);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/products/most-viewed")
    public ResponseEntity<Product> getMostViewedProduct() {
        Product mostViewedProduct = ProductService.getMostViewedProduct();
        if (mostViewedProduct != null) {
            return ResponseEntity.ok(mostViewedProduct);
        }
        return ResponseEntity.notFound().build();
    }
    // Optional: Bulk retrieval for multiple product IDs
    @PostMapping("/bulk")
    public ResponseEntity<List<Product>> getProductsByIds(@RequestBody List<Long> productIds) {
        List<Product> products = productRepository.findAllById(productIds);
        return ResponseEntity.ok(products);
    }
}