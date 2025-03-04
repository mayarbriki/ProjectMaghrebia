package com.example.projectmaghrebia.Services;

import com.example.projectmaghrebia.Entities.Product;
import com.example.projectmaghrebia.Repositories.ProductRepository;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
@NoArgsConstructor
public class ProductService implements IProductService {
    @Autowired
    private ProductRepository productRepository;


    @Override
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }


    @Override
    public Optional<Product> getProductById(Long id) {
        return productRepository.findById(id);
    }


    @Override
    public Product createProduct(Product product) {
        return productRepository.save(product);
    }


    @Override
    public Product updateProduct(Long id, Product productDetails) {
        Product product = productRepository.findById(id).orElseThrow(() -> new RuntimeException("Product not found"));
        product.setCategory(productDetails.getCategory());
        product.setDescription(productDetails.getDescription());
        product.setName(productDetails.getName());
        product.setFileName(productDetails.getFileName());
        return productRepository.save(product);
    }


    @Override
    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }

    public Product incrementViews(Long id) {
        return productRepository.findById(id)
                .map(product -> {
                    Long currentViews = product.getViews() != null ? product.getViews() : 0L;
                    product.setViews(currentViews + 1);
                    return productRepository.save(product);
                })
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
    }

    public Product getMostViewedProduct() {
        // Add null check and optional handling
        return productRepository.findTopByOrderByViewsDesc();

    }

}
