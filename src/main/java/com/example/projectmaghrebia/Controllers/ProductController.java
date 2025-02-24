package com.example.projectmaghrebia.Controllers;

import com.example.projectmaghrebia.Entities.Category;
import com.example.projectmaghrebia.Entities.Product;
import com.example.projectmaghrebia.Services.FileStorageService;
import com.example.projectmaghrebia.Services.IProductService;
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
    private IProductService productService;
    @Autowired
    private FileStorageService fileStorageService;
    @GetMapping("/products")
    public ResponseEntity<List<Product>> getAllProducts() {
        List<Product> products = productService.getAllProducts();

        // Base URL for serving images
        String baseUrl = "http://localhost:6060/upload-dir/";

        // Update each product to have a full image URL
        products.forEach(product -> {
            if (product.getFileName() != null && !product.getFileName().isEmpty()) {
                product.setFileName(baseUrl + product.getFileName());
            }
        });

        return ResponseEntity.ok().body(products);
    }


    @GetMapping("/{id}")
    public Optional<Product> getProductById(@PathVariable Long id) {
        return productService.getProductById(id);
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
            @Parameter(description = "Image file for the product")
            @RequestParam(value = "file", required = false) MultipartFile file,

            @Parameter(description = "Product category", required = true)
            @RequestParam("category") Category category,

            @Parameter(description = "Product description", required = true)
            @RequestParam("description") String description,

            @Parameter(description = "Product name", required = true)
            @RequestParam("name") String name) {

        Product product = new Product();
        product.setCategory(category);
        product.setDescription(description);
        product.setName(name);

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
            @Parameter(description = "ID of the product to update", required = true)
            @PathVariable Long id,

            @Parameter(description = "Updated image file for the product")
            @RequestParam(value = "file", required = false) MultipartFile file,

            @Parameter(description = "Updated product category", required = true)
            @RequestParam("category") Category category,

            @Parameter(description = "Updated product description", required = true)
            @RequestParam("description") String description,

            @Parameter(description = "Updated product name", required = true)
            @RequestParam("name") String name) {

        Product productDetails = new Product();
        productDetails.setCategory(category);
        productDetails.setDescription(description);
        productDetails.setName(name);

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
}