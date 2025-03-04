package com.example.projectmaghrebia.Repositories;

import com.example.projectmaghrebia.Entities.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product,Long> {
    Product findTopByOrderByViewsDesc(); // Fetch the product with the highest views
}
