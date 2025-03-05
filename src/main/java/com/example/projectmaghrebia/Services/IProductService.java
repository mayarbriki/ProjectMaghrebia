package com.example.projectmaghrebia.Services;

import com.example.projectmaghrebia.Entities.Category;
import com.example.projectmaghrebia.Entities.Product;

import java.util.List;
import java.util.Optional;

public interface IProductService {
    List<Product> getAllProducts();
    Optional<Product> getProductById(Long id);
    Product createProduct(Product product);
    Product updateProduct(Long id, Product productDetails);
    void deleteProduct(Long id);
    // Get the category of a product by its ID
    String getCategoryByProductId(Long productId);

    // Get a list of product IDs for a given category
    List<Long> getProductIdsByCategory(Category category); // Change to Category
 }
