package com.example.projectmaghrebia.Services;

import com.example.projectmaghrebia.Entities.Product;

import java.util.List;
import java.util.Optional;

public interface IProductService {
    List<Product> getAllProducts();
    Optional<Product> getProductById(Long id);
    Product createProduct(Product product);
    Product updateProduct(Long id, Product productDetails);
    void deleteProduct(Long id);
}
